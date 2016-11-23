import endpoints
from protorpc import message_types
from protorpc import messages
from protorpc import remote
import model

@endpoints.api(name='grader', version='v1')
class GraderApi(remote.Service):

    @endpoints.method(
        message_types.VoidMessage,
        model.QuestionMsgs,
        path='questions',
        http_method='GET',
        name='questions.list')
    def list_questions(self, unused_request):
        questions = model.Question.query()
        return model.QuestionMsgs(items=[
            question.asShortDict() for question in questions
        ])
    
api = endpoints.api_server([GraderApi])
