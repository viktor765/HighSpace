'use strict';

var Stage = function (threshold, enemySpawnChance, enemiesShoot, improvedAim) {
	this.threshold = threshold;
	this.enemySpawnChance = enemySpawnChance;
	this.enemiesShoot = enemiesShoot;
	this.improvedAim = improvedAim;

	this.finished = false;
};

Stage.prototype.action = function () {
	Enemy.prototype.canShoot = this.enemiesShoot;
	Enemy.prototype.improvedAim = this.improvedAim;
}

var stages = [];

stages.push(new Stage(50, 0.001, false, false));
stages.push(new Stage(100, 0.003, false, false));
stages.push(new Stage(150, 0.005, false, false));
stages.push(new Stage(200, 0.001, true, false));
stages.push(new Stage(250, 0.003, true, false));
stages.push(new Stage(300, 0.005, true, false));
stages.push(new Stage(350, 0.001, true, true));
stages.push(new Stage(400, 0.005, true, true));
stages.push(new Stage(99999999, 0.005, true, true));

function enterStage() {
	stageNumber++;

	HUDMessage('Entering stage ' + (stageNumber + 1) + '.', 3000);

	if (stageNumber === 3) {
		HUDMessage('Enemies now shoot!', 3000);
	} else if (stageNumber === 6) {
		HUDMessage('Enemies now aim better!', 3000);
	}
	
	if (stageNumber === 0) {
		currentStage = stages[stageNumber];
		currentStage.action();
	} else {
		//setTimeout(function () {
			currentStage = stages[stageNumber];
			currentStage.action();
			stages[stageNumber - 1].finished = false;
		//}, 5000);
	}
}