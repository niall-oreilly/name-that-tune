angular.module('controllersContainer', [])
.controller('MainController', function($scope, $rootScope){
	
	$rootScope.difficulty = 'easy';
	$rootScope.currentScore = 0;
	$rootScope.gameInPlay = false;
	$rootScope.highScore;
	$rootScope.stopRoundTimeout;
	$rootScope.playMenuMusic = function(){
		$rootScope.stopMusic();
		$rootScope.loadMusic('audio/background.mp3');
		$rootScope.startMusic();
	}

	$rootScope.loadMusic = function(songURL){///load the passed song url into the player
		angular.element('#music-player')[0].src = songURL;
	}

	$rootScope.startMusic = function (){ ///start audio /// needs to be accessible from any controller
		document.getElementById('music-player').play();
	}

	$rootScope.stopMusic = function (){///stop audio /// needs to be accessible from any controller
		document.getElementById('music-player').pause();
	}


})
.controller('StartScreenController', function($scope, $rootScope, $document, $timeout){
	$rootScope.playMenuMusic();
	$rootScope.gameInPlay = false;
	$timeout.cancel($rootScope.stopRoundTimeout);
	// angular.element('.logo').addClass('slidedown');
})
.controller('MainScreenController', function($scope, $rootScope, $http, $timeout, $location){

	var allSongs = [];//all 30 songs that will be loaded from spotify
	var currentSongs = {}; //3 songs to be used per round

	var playingSong;//song object of the currently playing song
	var pickedSongNum;///which of the 3 songs of the round will be played
	var correctSfx = new Audio('audio/correct.mp3');
	var incorrectSfx = new Audio('audio/scratch.mp3');
	var currentCover = angular.element('#cover1');
	var stopRoundTimeout;

	$scope.makeChoice;
	//$scope.startRound =  startRound;
	$scope.displayChoices = false;
	$scope.currentTimer = 1000;
	$scope.newTimer = 1000; ///the number to count to - we will set to 0 later
	$scope.currentRound = 1;
	$scope.loadingSongs = false;
	$scope.needleOnOff = {on : false, off:true};
	$scope.sleeve1 = {enter : false, leave: false};
	$scope.sleeve2 = {enter : false, leave: false};
	$scope.record1 = {enter : false, leave: false};
	$scope.record2 = {enter : false, leave: false};
	$scope.choiceColors = [{green:false, red:false}, 
							{green:false, red:false},
							{green:false, red:false}];


	function randomNumberBetween(min,max){
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	

	function resetTimer(){
		$scope.newTimer = 1000;
		$scope.currentTimer = 1000;
	}	

	function getTimer(){
		var timer = $('#timer').text();
		return Number(timer);

	}

	function startTimer(){
		$scope.currentTimer = 1000;
		$scope.newTimer = 0;
	}

	function stopTimer(){
		$scope.currentTimer = getTimer();
		$scope.newTimer = $scope.currentTimer;
	}


	(function initialiseGame(){
		$scope.currentScore = 0;
		$rootScope.highScore = localStorage.getItem($rootScope.difficulty+'highScore') || 0;
		$scope.highScore = $rootScope.highScore;
		$rootScope.gameInPlay = true;
		$rootScope.stopMusic();
		///Set spotify's list offset based on the difficulty setting
		///The higher the difficulty, the less popular songs will be shown
		function getOffset(diff){

			var offset = 0;
			var offset_min;
			var offset_max;

			if(diff === 'easy'){
				offset_min = 0; ///only possible to get the 100 most popular songs
				offset_max = 170;
			}
			else if(diff === 'medium'){
				offset_min = 2000;
				offset_max = 5000;
			}
			else{
				offset_min = 8000;
				offset_max = 12000;
			}

			
			offset = randomNumberBetween(offset_min, offset_max);
			return String(offset);
		}

		function getSpotifyUrl(){
			return 'https://api.spotify.com/v1/search?q=year%3A1990-2019&type=track&market=IE&limit=30&offset='+getOffset($rootScope.difficulty);
		}

		function fetchTrackData(){
			$scope.loadingSongs = true;
			$http.get(getSpotifyUrl()).then(function(response){
				$scope.loadingSongs = false;
				allSongs =  response.data.tracks.items;
				setupRound(1);
				if($rootScope.gameInPlay == true){
					startRound();
				}			
			})
		}
		fetchTrackData();
	})();

	function setupRound(round){
		currentCover.removeClass('flipped');


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

		function choiceColorsReset(){
			$scope.choiceColors[0].green = false;
			$scope.choiceColors[0].red = false;
			$scope.choiceColors[1].green = false;
			$scope.choiceColors[1].red = false;
			$scope.choiceColors[2].green = false;
			$scope.choiceColors[2].red = false;
		}
		

		function loadSleeve(){
			if($scope.currentRound % 2 == 1){
				$scope.sleeve1.leave = false;
				$scope.sleeve2.leave = true;
				$scope.sleeve1.enter = true;
				$scope.sleeve2.enter = false;
				currentCover = angular.element('#cover1');
				$scope.cover1Art = playingSong.album.images[0].url;
			}
			else{
				$scope.sleeve1.leave = true;
				$scope.sleeve2.leave = false;
				$scope.sleeve1.enter = false;
				$scope.sleeve2.enter = true;
				currentCover = angular.element('#cover2');
				$scope.cover2Art = playingSong.album.images[0].url;
				console.log(playingSong);

			}

			$timeout(function(){
				$scope.sleeve1.leave = false;
				$scope.sleeve2.leave = false;
				loadRecord();	
			}, 500);
			choiceColorsReset();
			
		}

		function loadRecord(){
			///load record to turntable
			if($scope.currentRound % 2 == 1){
				$scope.record1.leave = false;
				$scope.record2.leave = true;
				$scope.record1.enter = true;
				$scope.record2.enter = false;
			}
			else{
				$scope.record1.leave = true;
				$scope.record2.leave = false;
				$scope.record1.enter = false;
				$scope.record2.enter = true;	
			}
		}

		// function unloadRecord(){
		// 	///unload record from turntable
		// 	if($scope.currentRound % 2 == 1){
		// 		$scope.record1.leave = false;
		// 		$scope.record2.leave = true;
		// 		$scope.record1.enter = true;
		// 		$scope.record2.enter = false;
		// 	}
		// 	else{
		// 		$scope.record1.leave = true;
		// 		$scope.record2.leave = false;
		// 		$scope.record1.enter = false;
		// 		$scope.record2.enter = true;	
		// 	}
		// }

		
		resetTimer();
		currentSongs = getCurrentSongs(round);
		$scope.currentSongs = currentSongs;
		playingSong = pickASong(currentSongs);
		$rootScope.loadMusic(playingSong.preview_url);
		loadSleeve();
	}

	function startRound(){

		function unfreezeUI(){
			$scope.makeChoice = makeChoice;
		}

		function needleOn(){
			////rotate the needle element
			$scope.needleOnOff.on = true;
			$scope.needleOnOff.off = false;
		}

		function recordSpin(state){
			if(state == 'on'){
				//spin that shit
			}
			else{
				//stop that shit
			}
		}

		function startTurntable(){
			needleOn();
			recordSpin('on');
			///after 1s start music
			///setTimeout
			$timeout(function(){$rootScope.startMusic(); unfreezeUI()}, 1000);
			
			stopRoundTimeout = $timeout(function(){$scope.makeChoice(20); resetTimer()}, 10700);////make a wrong guess after 10secs unless the timeout has been cancelled
			$rootScope.stopRoundTimeout = stopRoundTimeout;

		}

		$scope.displayChoices = true;

		///startDisplay()
		$timeout(startTurntable, 3000);
		$timeout(startTimer,4000);

			
	}	

	function stopRound(){
		$timeout.cancel(stopRoundTimeout); //// cancel the stopRound timeout since it's already stopped
		
	

		function needleOff(){
			//rotate the needle element
			$scope.needleOnOff.on = false;
			$scope.needleOnOff.off = true;
		}

		function stopTurntable(){
			needleOff();
			$rootScope.stopMusic();
		}

		//freezeUI();
		stopTimer();	
		///stopDisplay()
		stopTurntable();
	}

	function nextRound(){
		if($scope.currentRound>=10){
			gameOver();
		}
		else{
			$scope.currentRound++;
			setupRound($scope.currentRound);
			if($rootScope.gameInPlay == true){
				startRound();
			}
		}
	}

	function gameOver(){

		if($scope.currentScore > $rootScope.highScore){
			///show new high score message
			$rootScope.highScore = $scope.currentScore;
			localStorage.setItem($rootScope.difficulty+'highScore', $scope.currentScore);
		}
		$rootScope.currentScore = $scope.currentScore;
		$location.path('/finish');

		///if score < 1000 say hard luck loser etc
		///if more than 8000 $scope.message = well done
		console.log('Game Over');
	}

	function makeChoice(num){

		function freezeUI(){///stop user from being able to click multiple times to rack up points
			$scope.makeChoice = function(){};
		}

		function checkAnswer(num){
			if(num == pickedSongNum){
				return true;
			}
			else{
				return false;
			}
		}

		function revealAnswer(correct){
			currentCover.addClass('flipped');
			$scope.choiceColors[0].red = true;
			$scope.choiceColors[1].red = true;
			$scope.choiceColors[2].red = true;
			$scope.choiceColors[correct].red = false;
			$scope.choiceColors[correct].green = true;
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
			correctSfx.play();
			increaseScore(getTimer());
		}

		function incorrectAnswer(){
			incorrectSfx.play();
		}


		stopRound();
		freezeUI();
		revealAnswer(pickedSongNum);
		if(checkAnswer(num) == true){
			correctAnswer();
		}
		else{
			incorrectAnswer();
		}

		if($rootScope.gameInPlay == true){
			$timeout(nextRound, 4000);
		};
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
.controller('FinishScreenController', function($scope, $rootScope, $timeout){
	$rootScope.playMenuMusic();
	$rootScope.gameInPlay = false;
	$timeout.cancel($rootScope.stopRoundTimeout);
	$scope.highScore = localStorage.getItem($rootScope.difficulty+"highScore");
	$scope.difficulties = {'easy': "Groupie", 'medium': "Roadie", 'hard':'Rockstar'};
})
