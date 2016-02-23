angular.module('controllersContainer', [])
.controller('MainController', function($scope, $rootScope){
	
	$rootScope.difficulty = 'easy';
	$rootScope.topScore = localStorage.getItem('topScore') || 0;
	



})
.controller('StartScreenController', function($scope, $rootScope){


})
.controller('MainScreenController', function($scope, $rootScope, $http, $timeout){



function initialise(){

	function randomNumberBetween(min,max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	///Set spotify's list offset based on the difficulty setting
	///The higher the difficulty, the less popular songs will be shown
	function getOffset(diff){

		var offset = 0;
		var offset_min;
		var offset_max;

		if(diff === 'easy'){
			offset_min = 0; ///only possible to get the 100 most popular songs
			offset_max = 70;
		}
		else if(diff === 'medium'){
			offset_min = 600;
			offset_max = 1200;
		}
		else{
			offset_min = 4000;
			offset_max = 7000;
		}

		
		offset = randomNumberBetween(offset_min, offset_max);
		return String(offset);
	}

	

	function getSpotifyUrl(){
		return 'https://api.spotify.com/v1/search?q=year%3A1900-2040&type=track&market=IE&limit=30&offset='+getOffset($rootScope.difficulty);
	}

	function fetchTrackData(){
		$http.get(getSpotifyUrl()).then(function(response){
			
			songs =  response.data.tracks.items;
			setupEnvironment(songs);
			
			console.log(songs);

		})
	}

	var currentRound = 1;

	function getSongs(songs, round){///get 3 songs based on what round it is
		var startingPoint = (round*3)-3;
		song1 = songs[startingPoint];
		song2 = songs[startingPoint+1];
		song3 = songs[startingPoint+2];
		return [song1,song2,song3];
	}

	function setupEnvironment(songs){
		var currentSongs = getSongs(songs, currentRound);
		$scope.currentSongs = currentSongs;
		var playingSong = pickASong(currentSongs);

		loadMusic(playingSong);		
		
	}

	function loadMusic(song){
		angular.element('#music-player')[0].src = song.preview_url;
	}

	$rootScope.startMusic = function (){
		document.getElementById('music-player').play();
	}

	$rootScope.stopMusic = function (){
		document.getElementById('music-player').pause();
	}
	

	function pickASong(currentSongs){
		pickedSongNum = randomNumberBetween(0,2);
		return currentSongs[ pickedSongNum ];
	}
fetchTrackData();




};
initialise();
resetTimer();

var pickedSongNum;

$scope.makeChoice = function(num){
	checkAnswer(num);


}


function setupRound(round){};


function resetTimer(){
	$scope.currentTimer = 1000;
	$scope.newTimer = 1000;
}


function getTimer(){
	var timer = $('#timer').text();
	return Number(timer);
}

function startTimer(){
	$scope.newTimer = 0;
}

function stopTimer(){
	$scope.currentTimer = getTimer();
	$scope.newTimer = getTimer();
}

function correctAnswer(){

}

var checkAnswer = function(num){
	$rootScope.stopMusic();
	stopTimer();
	console.log('checkAnswer');
	if(num == pickedSongNum){
		
		increaseScore(getTimer());
		return true;
	}
	else{
		return false;
	}
}

$scope.begin =  function(){
	$rootScope.startMusic();
	startTimer();
}

$scope.currentScore = 0;
function increaseScore(score){

	$scope.newScore = $scope.currentScore + score;
	$timeout(function(){
		$scope.currentScore = $scope.newScore;
	}, 1000);
}


//get songs
//display 1st 3 songs
//pick 1 at random 
//play song
	//move record
	//spin record
	//move needle
	//play audio
//start countdown
	//score decrease
	//led decrease
//answer-right
	//current score ++
	//light up green
	//play bing sfx
	//stop_player
		//flip sleeve
		//record disappear
		//sleeve disappear, new one in




})
.controller('FinishScreenController', function($scope, $rootScope){


})
