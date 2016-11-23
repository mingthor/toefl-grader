
from google.appengine.ext import ndb
from protorpc import message_types
from protorpc import messages

class Question(ndb.Model):
    type = ndb.StringProperty()
    description = ndb.StringProperty()

    def asDict(self):
        return {'id': self.key.id(), 'type': self.type, 'description': self.description}

    def asShortDict(self):
        return {'type': self.type, 'description': self.description}

class QuestionMsg(messages.Message):
    """Question that stores a message."""
    type = messages.StringField(1)
    description = messages.StringField(2)

class QuestionMsgs(messages.Message):
    """Collection of Questions."""
    items = messages.MessageField(QuestionMsg, 1, repeated=True)


def UpdateQuestion(id, type, description):
    question = Question(id=id, type=type, description=description)
    question.put()
    return question


def InsertQuestion(type, description):
    question = Question(type=type, description=description)
    question.put()
    return question


def DeleteQuestion(id):
    key = ndb.Key(Question, id)
    key.delete()
