'use strict';


/**
 * @ngdoc object
 * @name graderApp
 * @requires $routeProvider
 * @requires controllers
 *
 * @description
 * Root app, which routes and specifies the partial html and controller depending on the url requested.
 *
 */
var app = angular.module('graderApp', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});
