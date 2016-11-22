# Copyright 2013 Google, Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from google.appengine.ext import ndb


class Question(ndb.Model):
    type = ndb.StringProperty()
    description = ndb.StringProperty()


def AllQuestions():
    return Question.query()


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
