# Copyright 2013 Google, Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#             http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json

import webapp2

import model

class RestHandler(webapp2.RequestHandler):

    def dispatch(self):
        # time.sleep(1)
        super(RestHandler, self).dispatch()

    def SendJson(self, r):
        self.response.headers['content-type'] = 'text/plain'
        self.response.write(json.dumps(r))


class QueryHandler(RestHandler):

    def get(self):
        questions = model.Question.query()
        r = [item.asDict() for item in questions]
        self.SendJson(r)


class UpdateHandler(RestHandler):

    def post(self):
        r = json.loads(self.request.body)
        item = model.UpdateQuestion(r['id'], r['type'], r['description'])
        r = item.asDict()
        self.SendJson(r)


class InsertHandler(RestHandler):

    def post(self):
        r = json.loads(self.request.body)
        item = model.InsertQuestion(r['type'], r['description'])
        r = item.asDict()
        self.SendJson(r)


class DeleteHandler(RestHandler):

    def post(self):
        r = json.loads(self.request.body)
        model.DeleteQuestion(r['id'])


APP = webapp2.WSGIApplication([
    ('/rest/query', QueryHandler),
    ('/rest/insert', InsertHandler),
    ('/rest/delete', DeleteHandler),
    ('/rest/update', UpdateHandler),
], debug=True)
