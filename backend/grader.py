import endpoints
from protorpc import message_types
from protorpc import messages
from protorpc import remote

class Question(messages.Message):
    """Question that stores a message."""
    type = messages.StringField(1)
    description = messages.StringField(2)

class QuestionCollection(messages.Message):
    """Collection of Questions."""
    items = messages.MessageField(Question, 1, repeated=True)

STORED_QUESTIONS = QuestionCollection(items=[
    Question(type='Question', description='Talk about a person.'),
    Question(type='Question', description='Talk about a place.'),
])

@endpoints.api(name='grader', version='v1')
class GraderApi(remote.Service):

    @endpoints.method(
        message_types.VoidMessage,
        QuestionCollection,
        path='questions',
        http_method='GET',
        name='questions.list')
    def list_questions(self, unused_request):
        return STORED_QUESTIONS
    
api = endpoints.api_server([GraderApi])
