'use strict';

var App = angular.module('App', ['ngRoute']);

App.factory('myHttpInterceptor', function($rootScope, $q) {
  return {
    'requestError': function(config) {
      $rootScope.status = 'HTTP REQUEST ERROR ' + config;
      return config || $q.when(config);
    },
    'responseError': function(rejection) {
      $rootScope.status = 'HTTP RESPONSE ERROR ' + rejection.status + '\n' +
                          rejection.data;
      return $q.reject(rejection);
    },
  };
});

App.factory('questionService', function($rootScope, $http, $q, $log) {
  $rootScope.status = 'Retrieving data...';
  var deferred = $q.defer();
  $http.get('rest/query')
  .success(function(data, status, headers, config) {
    $rootScope.questions = data;
    deferred.resolve();
    $rootScope.status = '';
  });
  return deferred.promise;
});

App.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller : 'MainCtrl',
    templateUrl: '/partials/main.html',
    resolve    : { 'questionService': 'questionService' },
  });
  $routeProvider.when('/addNewQuestion', {
    controller : 'InsertCtrl',
    templateUrl: '/partials/insert.html',
  });
  $routeProvider.when('/update/:id', {
    controller : 'UpdateCtrl',
    templateUrl: '/partials/update.html',
    resolve    : { 'questionService': 'questionService' },
  });
  $routeProvider.otherwise({
    redirectTo : '/'
  });
});

App.config(function($httpProvider) {
  $httpProvider.interceptors.push('myHttpInterceptor');
});

App.controller('MainCtrl', function($scope, $rootScope, $log, $http, $routeParams, $location, $route) {

  $scope.addNewQuestion = function() {
    $location.path('/addNewQuestion');
  };

  $scope.update = function(question) {
    $location.path('/update/' + question.id);
  };

  $scope.delete = function(question) {
    $rootScope.status = 'Deleting question ' + question.id + '...';
    $http.post('/rest/delete', {'id': question.id})
    .success(function(data, status, headers, config) {
      for (var i=0; i<$rootScope.questions.length; i++) {
        if ($rootScope.questions[i].id == question.id) {
          $rootScope.questions.splice(i, 1);
          break;
        }
      }
      $rootScope.status = '';
    });
  };

});

App.controller('InsertCtrl', function($scope, $rootScope, $log, $http, $routeParams, $location, $route) {

  $scope.submitInsert = function() {
    var question = {
      type : $scope.type,
      description : $scope.description, 
    };
    $rootScope.status = 'Creating...';
    $http.post('/rest/insert', question)
    .success(function(data, status, headers, config) {
      $rootScope.questions.push(data);
      $rootScope.status = '';
    });
    $location.path('/');
  }
});

App.controller('UpdateCtrl', function($routeParams, $rootScope, $scope, $log, $http, $location) {

  for (var i=0; i<$rootScope.questions.length; i++) {
    if ($rootScope.questions[i].id == $routeParams.id) {
      $scope.question = angular.copy($rootScope.questions[i]);
    }
  }

  $scope.submitUpdate = function() {
    $rootScope.status = 'Updating...';
    $http.post('/rest/update', $scope.question)
    .success(function(data, status, headers, config) {
      for (var i=0; i<$rootScope.questions.length; i++) {
        if ($rootScope.questions[i].id == $scope.question.id) {
          $rootScope.questions.splice(i,1);
          break;
        }
      }
      $rootScope.questions.push(data);
      $rootScope.status = '';
    });
    $location.path('/');
  };

});

