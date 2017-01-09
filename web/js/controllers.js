'use strict';

/**
 * @ngdoc module
 * @name conferenceControllers
 *
 * @description
 * Angular module for controllers.
 *
 */
 var app = angular.module('graderApp');

app.controller('ShowQuestionCtrl', function ($scope, $log) {
  $scope.questions = [{'number': 1, 'title': 'A place', 'type':'Familiar Topic'}];
  
  $scope.getQuestions();

  $scope.getQuestions = function () {
    gapi.client.toefl_grader.getQuestions().
      execute(function (resp) {
        $scope.$apply(function () {
          if (resp.error) {
            // The request has failed.
            var errorMessage = resp.error.message || '';
            $scope.messages = 'Failed to query conferences : ' + errorMessage;
            $log.error($scope.messages);
          } else {
            // The request has succeeded.
            $scope.messages = 'Query succeeded';
            $log.info($scope.messages);

            $scope.questions = [];
            angular.forEach(resp.items, function (question) {
              $scope.questions.push(question);
            });
          }
        });
      });
  }
  
})
