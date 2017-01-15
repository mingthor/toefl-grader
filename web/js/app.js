'use strict';


/**
 * @ngdoc object
 * @name graderApp
 * @requires $routeProvider
 * @requires graderControllers
 *
 * @description
 * Root app, which routes and specifies the partial html and controller depending on the url requested.
 *
 */
var app = angular.module('graderApp', ['graderControllers', 'ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/question', {
      templateUrl: '/partials/show_questions.html',
      controller: 'ShowQuestionCtrl'
    })
    .when('/', {
      templateUrl: '/partials/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});
