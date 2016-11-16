import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote

from helloworld_api import HelloWorldApi


# If the request contains path or querystring arguments,
# you cannot use a simple Message class.
# Instead, you must use a ResourceContainer class

USER_ANSWER_RESOURCE = endpoints.ResourceContainer(
    answer=messages.StringField(1),
    question_id=messages.IntegerField(2),
)

package = 'ToeflGrader'


class UserAnswer(messages.Message):
    """String that stores a message."""
    content = messages.StringField(1)


@endpoints.api(name='toeflgrader', version='v1')
class ToeflGraderApi(remote.Service):
    """ToeflGrader API v1."""

    @endpoints.method(USER_ANSWER_RESOURCE, UserAnswer,
                      path = "question/{question_id}/answer/{answer}",
                      http_method='POST', name = "gradeUserAnswer")
    def grade_answer(self, request):
      answer = "question {} answer {}".format(request.question_id, request.answer)
      return UserAnswer(content=answer)


api = endpoints.api_server([ToeflGraderApi, HelloWorldApi])
