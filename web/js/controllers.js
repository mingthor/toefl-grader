'use strict';

/**
 * @ngdoc module
 * @name conferenceControllers
 *
 * @description
 * Angular module for controllers.
 *
 */

var graderApp = graderApp || {};
graderApp.controllers = angular.module('graderControllers', ['ui.bootstrap']);

graderApp.controllers.controller('ShowQuestionCtrl', ['$scope', function ($scope) {
  $scope.questions = [{'number': 1, 'title': 'A place', 'type':'Familiar Topic'}];
  $scope.init = function () {
    console.log("ShowQuestionCtrl init call getQuestion Endpoint API");
    gapi.client.toefl_grader.getQuestions().
      execute(function (resp) {
        $scope.$apply(function () {
          if (resp.error) {
            // The request has failed.
            var errorMessage = resp.error.message || '';
            console.log("Failed to get questions");
          } else {
            // The request has succeeded.
            console.log("Get questions succeeded");

            $scope.questions = [];
            angular.forEach(resp.items, function (question) {
              $scope.questions.push(question);
            });
          }
        });
      });
  };
}]);
