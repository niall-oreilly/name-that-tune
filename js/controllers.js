angular.module('controllersContainer', [])
.controller('MainController', function($scope, $rootScope){
	
	$rootScope.difficulty = 'easy';
	$rootScope.topScore = localStorage.getItem('topScore') || 0;




})
.controller('StartScreenController', function($scope, $rootScope){


})
.controller('MainScreenController', function($scope, $rootScope){



})
.controller('FinishScreenController', function($scope, $rootScope){


})
