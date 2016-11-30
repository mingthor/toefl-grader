import endpoints
from protorpc import message_types
from protorpc import messages
from protorpc import remote
from google.appengine.api import users
import model

@endpoints.api(name='toefl_grader', version='v1')
class GraderApi(remote.Service):

    @endpoints.method(
        model.QuestionMsg,
        model.QuestionMsg,
        path='addNewQuestion',
        http_method='POST',
        name='addNewQuestion')
    def addNewQuestion(self, request):
        """Create a new question"""
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authorization required')
        if not users.is_current_user_admin():
            raise endpoints.UnauthorizedException('Only administrator can access this API')
        return model.InsertNewQuestion(request)
    
    @endpoints.method(
        message_types.VoidMessage,
        model.QuestionMsgs,
        path='getQuestions',
        http_method='GET',
        name='getQuestions')
    def getQuestions(self, unused_request):
        questions = model.Question.query()
        return model.QuestionMsgs(items=[
            question.asQuestionMsg() for question in questions
        ])
    
api = endpoints.api_server([GraderApi])
