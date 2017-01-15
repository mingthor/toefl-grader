import endpoints
from protorpc import message_types
from protorpc import messages
from protorpc import remote
from google.appengine.api import users
from google.appengine.ext import ndb
import model

from settings import WEB_CLIENT_ID
from settings import ANDROID_CLIENT_ID
from settings import ANDROID_AUDIENCE
API_EXPLORER_CLIENT_ID = endpoints.API_EXPLORER_CLIENT_ID

ANSWER_GET_REQUEST = endpoints.ResourceContainer(
    message_types.VoidMessage,
    websafeAnswerKey=messages.StringField(1),
)
ANSWER_POST_REQUEST = endpoints.ResourceContainer(
    model.AnswerMsg,
    websafeQuestionKey=messages.StringField(1),
)
QUESTION_GET_REQUEST = endpoints.ResourceContainer(
    message_types.VoidMessage,
    websafeQuestionKey=messages.StringField(1),
)
QUESTION_POST_REQUEST = endpoints.ResourceContainer(
    model.QuestionMsg,
    websafeQuestionKey=messages.StringField(1),
)

@endpoints.api(name='toefl_grader', version='v1')
class GraderApi(remote.Service):

    def user_key(self, user):
        return ndb.Key('User', user.nickname())
      
    @endpoints.method(
        message_types.VoidMessage,
        model.UserMsg,
        path='profile',
        http_method='POST',
        name='register')
    def register(self, request):
        """New user registration"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')
        
        profile = self.user_key(user).get()
        # create new Profile if not there
        if not profile:
            profile = model.User(
                key = self.user_key(user),
                identity = user.nickname(),
                email= user.email())
            profile.put()
        return profile.asUserMsg()

    @endpoints.method(
        message_types.VoidMessage,
        model.UserMsg,
        path='profile',
        http_method='GET',
        name='getProfile')
    def getProfile(self, request):
        """Get user profile"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')
        
        profile = self.user_key(user).get()
        # create new Profile if not there
        if not profile:
            return register(request)
        return profile.asUserMsg()

    @endpoints.method(
        model.QuestionMsg,
        model.QuestionMsg,
        path='addNewQuestion',
        http_method='POST',
        name='addNewQuestion')
    def addNewQuestion(self, request):
        """Admin: Create a new question"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')
        #if not users.is_current_user_admin():
        #    raise endpoints.UnauthorizedException('Only administrator can access this API')
        return model.InsertQuestion(request)
    
    @endpoints.method(
        message_types.VoidMessage,
        model.QuestionMsgs,
        path='question',
        http_method='GET',
        name='getQuestions')
    def getQuestions(self, unused_request):
        """Get all the questions"""
        questions = model.Question.query()
        return model.QuestionMsgs(items=[
            question.asQuestionMsg() for question in questions
        ])

    @endpoints.method(
        QUESTION_GET_REQUEST,
        model.QuestionMsg,
        path='question/{websafeQuestionKey}',
        http_method='GET',
        name='getQuestion')
    def getQuestion(self, request):
        """Get a specific question using a key"""
        question = ndb.Key(urlsafe=request.websafeQuestionKey).get()
        if not question:
            raise endpoints.NotFoundException(
                'No question found with key: %s' % requestion.websafeQuestionKey)
        return question.asQuestionMsg()

    @endpoints.method(
        QUESTION_POST_REQUEST,
        model.QuestionMsg,
        path='question/{websafeQuestionKey}',
        http_method='PUT',
        name='updateQuestion')
    def updateQuestion(self, request):
        """Admin: Update a question"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')
        #if not users.is_current_user_admin():
        #    raise endpoints.UnauthorizedException('Only administrator can access this API')

        question = ndb.Key(urlsafe=request.websafeQuestionKey).get()
        if not question:
            raise endpoints.NotFoundException(
                'No question found with key: %s' % request.websafeQuestionKey)

        question.type = request.type
        question.description = request.description
        question.put()
        return question.asQuestionMsg()

    @endpoints.method(
        QUESTION_GET_REQUEST,
        model.BooleanMessage,
        path='question/{websafeQuestionKey}',
        http_method='DELETE',
        name='deleteQuestion')
    def deleteQuestion(self, request):
        """Admin: Delete a question"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')
        #if not users.is_current_user_admin():
        #    raise endpoints.UnauthorizedException('Only administrator can access this API')

        question = ndb.Key(urlsafe=request.websafeQuestionKey).get()
        if not question:
            raise endpoints.NotFoundException(
                'No question found with key: %s' % request.websafeQuestionKey)
        question.key.delete()
        return model.BooleanMessage(data=True)
        
    @endpoints.method(
        ANSWER_POST_REQUEST,
        model.AnswerMsg,
        path='question/{websafeQuestionKey}/answer',
        http_method='POST',
        name='answerQuestion')
    def answerQuestion(self, request):
        """Create an answer to a specific question"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')
        
        question_key = ndb.Key(urlsafe=request.websafeQuestionKey)
        answer = model.Answer(parent=self.user_key(user), question=question_key, content=request.content)
        answer.put()
        return answer.asAnswerMsg()

    @endpoints.method(
        ANSWER_POST_REQUEST,
        model.AnswerMsgs,
        path='question/{websafeQuestionKey}/answer',
        http_method='GET',
        name='queryAnswers')
    def queryAnswers(self, request):
        """Get the answers to a specific question"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')

        question = ndb.Key(urlsafe=request.websafeQuestionKey).get()
        if not question:
            raise endpoints.NotFoundException(
                'No question found with key: %s' % requestion.websafeQuestionKey)
        
        answers = model.Answer.query(ancestor=self.user_key(user)).filter(
            model.Answer.question == question.key)
        
        return model.AnswerMsgs(items=[
            answer.asAnswerMsg() for answer in answers
        ])
        
    @endpoints.method(
        message_types.VoidMessage,
        model.AnswerMsgs,
        path='answer',
        http_method='GET',
        name='getAnswers')
    def getAnswers(self, request):
        """Get all the answers created by user"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')

        answers = model.Answer.query(ancestor=self.user_key(user))
        return model.AnswerMsgs(items=[
            answer.asAnswerMsg() for answer in answers
        ])

    @endpoints.method(
        ANSWER_GET_REQUEST,
        model.AnswerMsg,
        path='answer/{websafeAnswerKey}',
        http_method='GET',
        name='getAnswer')
    def getAnswer(self, request):
        """Get a specific answer using a key"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')
        
        answer = ndb.Key(urlsafe=request.websafeAnswerKey).get()
        if not answer:
            raise endpoints.NotFoundException(
                'No answer found with key: %s' % request.websafeAnswerKey)
        return answer.asAnswerMsg()

    @endpoints.method(
        ANSWER_GET_REQUEST,
        model.BooleanMessage,
        path='answer/{websafeAnswerKey}',
        http_method='DELETE',
        name='deleteAnswer')
    def deleteAnswer(self, request):
        """Delete a specific answer"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')
        
        answer = ndb.Key(urlsafe=request.websafeAnswerKey).get()
        if not answer:
            raise endpoints.NotFoundException(
                'No answer found with key: %s' % request.websafeAnswerKey)
        answer.key.delete()
        return model.BooleanMessage(data=True)
    
api = endpoints.api_server([GraderApi])
