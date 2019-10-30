'use strict';

var Bonus = function (x, y) {//dela upp i mapBonus och playerBonus?
	this.startTime = new Date();
	this.timeLeft;

	this.update = function () {
		if (!this.durationIsInfinite) {
			var date = new Date();
			this.timeLeft = this.duration - (+date - +this.startTime);//'+' gör om till millisekunder

			if (this.timeLeft <= 0) {
				player.bonuses[this.bonusType] = false;
				player.activeBonuses[this.key] = undefined;
			}
		}
	};

	this.action = function () {
		return;
	};

	this.img = new Image();

	this.rect = new Rectangle(x, y, 46, 46);

	this.draw = function (ctx) {
		ctx.drawImage(this.img, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
	};
};

//Är bonusar objekt? inte klasser?

var ThreeGuns = function (x, y) {
	Bonus.call(this, x, y);

	this.bonusType = 'threeXShots';
	this.key = 0;

	this.duration = 10000;

	this.hudName = '3X Shots';
	this.img.src = 'resources/3xPowerup.png';

	this.action = function () {
		player.bonuses.threeXShots = true;

		player.activeBonuses[this.key] = new ThreeGuns(0, 0);
	};
};

var FiveGuns = function (x, y) {
	Bonus.call(this, x, y);

	this.bonusType = 'fiveXShots';
	this.key = 1;

	this.duration = 10000;

	this.hudName = '5X Shots';
	this.img.src = 'resources/5xPowerup.png';

	this.action = function () {
		player.bonuses.fiveXShots = true;

		player.activeBonuses[this.key] = new FiveGuns(0, 0);
	};
};

var Shield = function (x, y) {
	Bonus.call(this, x, y);

	this.bonusType = 'shield';
	this.key = 2;

	this.duration = 10000;
	//this.durationIsInfinite = true;

	this.hudName = 'Shield';
	this.img.src = 'resources/shield.png';

	this.action = function () {
		player.bonuses.shield = true;

		player.activeBonuses[this.key] = new Shield(0, 0);
	};
};

var HealthRegen = function (x, y) {
	Bonus.call(this, x, y);

	this.img.src = 'resources/health.png';

	this.action = function () {
		player.lifes++;
	};
};

var bonusConstructors = [ThreeGuns, FiveGuns, Shield, HealthRegen];