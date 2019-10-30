'use strict';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.style.width = canvas.width + 'px';
canvas.style.height	= canvas.height + 'px';

var oldDate;

var audio = document.getElementById('audio');
var element = 0;

var soundsOn = false;
var paused = false;

var stageNumber;
var currentStage;

var enemySpawnChance = 0.001;
var bonusSpawnChance = 0.005;

var ended;

var enemies;

var mapBonuses;

var player;

var animations;

var gameLoop;

function pauseGame() {
	clearInterval(gameLoop);
	paused = true;
}

function unpauseGame() {
	gameLoop = setInterval(gameTick, 1);
	oldDate = new Date();//statisk variabel i gameTick?
	paused = false;
}

function resetGame() {
	enemies = [];

	mapBonuses = [];

	animations = [];
	
	for (var i = 0; i < stages.length; i++) {
		stages[i].finished = false;
	}

	stageNumber = -1;
	enterStage();
	//var currentStage = stages[stageNumber];

	enemyBullets.bullets = [];

	ended = false;

	player = new Player();
	player.setPosition(450, 350);
}

function commenceGame() {//bort eller se över
	resetGame();
	unpauseGame();

	startDraw();
}

window.onload = setTimeout(commenceGame, 1000);

function endGame(){
	ended = true;
	playSound('sfx/game-over.wav');
	clearInterval(gameLoop);
}

function gameTick() {
	var currentDate = new Date();// bort med dessa tre
	var delta = +currentDate - +oldDate;
	oldDate = currentDate;

	player.update(delta);

	for(var i = 0; i < enemies.length; i++){
		enemies[i].update(delta);
	}

	enemyBullets.update(delta);
	enemyBullets.checkCollision();
	
	player.checkEnemyCollision();
	player.checkBonusCollision();
	
	checkIfEnemiesHasPast();
	
	for (var i = 0; i < player.activeBonuses.length; i++) {
		if (player.activeBonuses[i]) {
			player.activeBonuses[i].update();
		}
	}

	if (Math.random() < currentStage.enemySpawnChance * delta) {
		var enemy = new Enemy();
		enemy.setPosition(50 + (Math.random() * (canvas.width - 100)), -100);
		enemies.push(enemy);
	}

	if (player.points >= currentStage.threshold && !currentStage.finished) {
		currentStage.finished = true;
		enterStage();
	}
}

(function () {//körs en gång när sidan laddas
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	
	window.requestAnimationFrame = requestAnimationFrame;
})();
var requestId = 0;

var draw = function() {
	clearCanvas();

	enemyBullets.draw(ctx);

	for (var i = 0; i < enemies.length; i++) {
		enemies[i].draw(ctx);
	}

	player.draw(ctx);
	
	for (var i = 0; i < mapBonuses.length; i++) {
		mapBonuses[i].draw(ctx);
	}

	for (var i = 0; i < animations.length; i++) {
		animations[i].draw(ctx);

		if (animations[i].done) {
			animations.removeAt(i);
		}
	}

	drawHUD(ctx);

	requestId = window.requestAnimationFrame(draw);
};

function startDraw(){
	requestId = window.requestAnimationFrame(draw);
}

function stopDraw(){//Ta bort
	if (requestId) {
		window.cancelAnimationFrame(requestId);
	}
	
	requestId = 0;
}

function useFullscreen() {//i framework?
	if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled){
		if (document.FullscreenEnabled) {
			canvas.requestFullscreen();
			console.log('standard');
		} else if(document.webkitFullscreenEnabled) {
			canvas.webkitRequestFullScreen();
			console.log('webkit');
		} else if(document.mozFullScreenEnabled) {
			canvas.mozRequestFullScreen();
			console.log('mozilla');
		} else if(document.msFullscreenEnabled) {
			canvas.msRequestFullscreen();
			console.log('microsoft');
		}
	}
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}