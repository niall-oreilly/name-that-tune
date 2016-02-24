angular.module('controllersContainer', [])
.controller('MainController', function($scope, $rootScope){
	
	$rootScope.difficulty = 'easy';
	$rootScope.topScore = localStorage.getItem('topScore') || 0;
	



})
.controller('StartScreenController', function($scope, $rootScope){


})
.controller('MainScreenController', function($scope, $rootScope, $http, $timeout){

	var allSongs = [];//all 30 songs that will be loaded from spotify
	var currentSongs = {}; //3 songs to be used per round
	var currentRound = 1;
	var playingSong;//song object of the currently playing song
	var pickedSongNum;///which of the 3 songs of the round will be played

	$scope.makeChoice = makeChoice;
	$scope.begin =  startRound;
	$scope.displayChoices = false;


	function randomNumberBetween(min,max){
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	$rootScope.startMusic = function (){ ///start audio /// needs to be accessible from any controller
		document.getElementById('music-player').play();
	}

	$rootScope.stopMusic = function (){///stop audio /// needs to be accessible from any controller
		document.getElementById('music-player').pause();
	}

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


	(function initialiseGame(){
		$scope.currentScore = 0;

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
				
				allSongs =  response.data.tracks.items;
				setupRound(1);			
				console.log('songs fetched');
			})
		}
		fetchTrackData();
	})();

	function setupRound(round){

		function getCurrentSongs(round){///get 3 songs based on what round it is
			var startingPoint = (round*3)-3;
			song1 = allSongs[startingPoint];
			song2 = allSongs[startingPoint+1];
			song3 = allSongs[startingPoint+2];
			return [song1,song2,song3];
		}

		function pickASong(currentSongs){///pick a random song out of the 3 songs per round
			pickedSongNum = randomNumberBetween(0,2);
			return currentSongs[ pickedSongNum ];
		}

		function loadMusic(song){///load the passed song into the player
			angular.element('#music-player')[0].src = song.preview_url;
		}

		function loadSleeve(){
			///load new sleeve
		}

		function loadRecord(){
			///load record to turntable
		}

		resetTimer();
		currentSongs = getCurrentSongs(round);
		$scope.currentSongs = currentSongs;
		playingSong = pickASong(currentSongs);
		loadMusic(playingSong);
		console.log('round setup');
	}

	function startRound(){

		function needleOn(){
			////rotate the needle element
		}

		function startTurntable(){
			needleOn();
			///after 1s start music
			///setTimeout
			$rootScope.startMusic();
			startTimer();	
		}
		$scope.displayChoices = true;

		///startDisplay()
		startTurntable();
	}	

	function stopRound(){
		function needleOff(){
			//rotate the needle element
		}

		function stopTurntable(){
			needleOff();
			$rootScope.stopMusic;
		}

		stopTimer();	
		///stopDisplay()
		stopTurntable()
	}

	function makeChoice(num){
		
		function checkAnswer(num){
			if(num == pickedSongNum){
				return true;
			}
			else{
				return false;
			}
		}

		function revealAnswer(){
			///spin sleeve
			///make button green
		}

		function correctAnswer(){
			function increaseScore(score){
				$scope.newScore = $scope.currentScore + score;
				$timeout(function(){
					$scope.currentScore = $scope.newScore;
				}, 1000);

				///play flicking sfx
			}

			increaseScore(getTimer());
			//play correct sfx
		}

		function incorrectAnswer(){
			///play buzzer sfx
		}


		stopRound();
		revealAnswer();
		if(checkAnswer(num) == true){
			correctAnswer();
		}
		else{
			incorrectAnswer();
		}
		currentRound++;
		setupRound(currentRound);
	}//makeChoice()

















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
