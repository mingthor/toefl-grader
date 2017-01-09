from google.appengine.api import users
from google.appengine.ext import ndb
from protorpc import message_types
from protorpc import messages

class BooleanMessage(messages.Message):
    """BooleanMessage-- outbound Boolean value message"""
    data = messages.BooleanField(1)
    
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

def InsertQuestion(questionMsg):
    question = Question(type=questionMsg.type, description=questionMsg.description)
    question.put()
    return question.asQuestionMsg()

def DeleteQuestion(id):
    key = ndb.Key('Question', id)
    if key.get():
        key.delete()

def question_key(id):
    return ndb.Key('Question', id)
    
class User(ndb.Model):
    identity = ndb.StringProperty()
    email = ndb.StringProperty()
    answers = ndb.StringProperty(repeated=True)
    def asUserMsg(self):
        return UserMsg(identity=self.identity,
                       email=self.email,
                       answers=self.answers)

class UserMsg(messages.Message):
    """User profile that stores a message."""
    identity = messages.StringField(2)
    email = messages.StringField(3)
    answers = messages.StringField(4, repeated=True)
    
class Answer(ndb.Model):
    question = ndb.KeyProperty(Question)
    content = ndb.StringProperty()
    userId = ndb.StringProperty()

    def asDict(self):
        return {'question_id':self.question.id(), 'question_type': self.question.get().type, 'question_description': self.question.get().description, 'content': self.content}

    def asAnswerMsg(self):
        return AnswerMsg(websafeQuestionKey=self.question.urlsafe(),
                         content=self.content,
                         userId=self.userId,
                         websafeKey=self.key.urlsafe())

class AnswerMsg(messages.Message):
    """Answer that stores a message."""
    websafeQuestionKey = messages.StringField(1)
    content = messages.StringField(2)
    userId = messages.StringField(3)
    websafeKey = messages.StringField(4)

class AnswerMsgs(messages.Message):
    """Collection of Answers."""
    items = messages.MessageField(AnswerMsg, 1, repeated=True)
    
