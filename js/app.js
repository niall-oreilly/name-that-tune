angular.module('nameThatTuneApp', ['ngRoute', 'ngAnimate' , 'controllersContainer', 'servicesContainer', 'directivesContainer'])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'views/start-screen.html',
        controller: 'StartScreenController'
      }).
      when('/main', {
        templateUrl: 'views/main-screen.html',
        controller: 'MainScreenController'
      }).
      when('/finish', {
        templateUrl: 'views/finish-screen.html',
        controller: 'FinishScreenController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);