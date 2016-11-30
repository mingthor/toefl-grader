from google.appengine.api import users
from google.appengine.ext import ndb
from protorpc import message_types
from protorpc import messages

NAME = 'Ming Gao'

class Question(ndb.Model):
    type = ndb.StringProperty()
    description = ndb.StringProperty()
    
    def asDict(self):
        return {'id': self.key.id(), 'type': self.type, 'description': self.description}

    def asShortDict(self):
        return {'type': self.type, 'description': self.description}

    def asQuestionMsg(self):
        return QuestionMsg(type=self.type,
                           description=self.description,
                           websafeKey=self.key.urlsafe())

class QuestionMsg(messages.Message):
    """Question that stores a message."""
    type = messages.StringField(1)
    description = messages.StringField(2)
    websafeKey = messages.StringField(3)

class QuestionMsgs(messages.Message):
    """Collection of Questions."""
    items = messages.MessageField(QuestionMsg, 1, repeated=True)


def UpdateQuestion(id, type, description):
    question = Question(id=id, type=type, description=description)
    question.put()
    return question

#TODO(ming): Consolidate these insert functions
def InsertQuestion(type, description):
    question = Question(type=type, description=description)
    question.put()
    return question

def InsertNewQuestion(questionMsg):
    question = Question(type=questionMsg.type, description=questionMsg.description)
    question.put()
    return question.asQuestionMsg()

def DeleteQuestion(id):
    key = ndb.Key('Question', id)
    key.delete()

def question_key(id):
    return ndb.Key('Question', id)
    
def user_key(user_name=NAME):
    return ndb.Key('User', user_name)
    
class User(ndb.Model):
    name = ndb.StringProperty()
    identity = ndb.StringProperty()
    email = ndb.StringProperty()

    @property
    def query_answers(self):
        return Answer.query(ancestor=self.key)
    
class Answer(ndb.Model):
    question = ndb.KeyProperty(Question)
    content = ndb.StringProperty()

    def asDict(self):
        return {'question_id':self.question.id(), 'question_type': self.question.get().type, 'question_description': self.question.get().description, 'content': self.content}

class AnswerMsg(messages.Message):
    """Answer that stores a message."""
    websafeQuestionKey = messages.StringField(1)
    content = messages.StringField(2)
    websafeKey = messages.StringField(3)
    
def AnswerQuestion(question_id, content):
    question_key = ndb.Key('Question', question_id)
    answer = Answer(parent=user_key(), question=question_key, content=content)
    answer.put()
    return answer
