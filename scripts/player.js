'use strict';

var Bullet = function (vel, rectangle) {
	this.velocity = vel;
	this.rect = rectangle;

	this.update = function (delta) {
		this.rect.x += this.velocity.x * delta / 7;
		this.rect.y += this.velocity.y * delta / 7;
	};

	this.draw = function (ctx) {
		this.rect.draw(ctx);
	};
};

var Fighter = function () {//överklass till Player och Enemy
	this.rect;

	this.moving = false;
	
	this.bullets = [];
	this.shotBullet = false;

	this.minTime;

	this.speed;

	this.lifes;

	this.lastShot = new Date();

	this.addShot = function (angle) {//Kortas ned, integreras i Bullet
		var b = new Rectangle(this.rect.x + (this.rect.width / 2) - 4, this.rect.y + 12, 5, 15);
		b.color.g = 0;
		b.color.b = 0;
		
		var vel = new Vector2((Math.sin(angle) * this.bulletSpeed), -Math.cos(angle) * this.bulletSpeed);

		var bul = new Bullet(vel , b);
		
		this.bullets.push(bul);
	};

	this.explode = function () {
		var anim = new Animation(64, 64, 0, 0, 25, 'resources/explosion.png', 30, 5, 5, 1);
		anim.position.set(this.rect.x, this.rect.y);

		animations.push(anim);

		setInterval(function () {
			anim.update();
		}, 1)
	};
};

Fighter.prototype = {
	bulletSpeed: 5,

	setPosition: function (x, y, mod) {
		if (mod === null || !mod) {
			if (x !== null) {
				this.rect.x = x;
			}
			if (y !== null) {
				this.rect.y = y;
			}
		} else {
			if (x !== null) {
				this.rect.x += x;
			}
			if (y !== null) {
				this.rect.y += y;
			}
		}
	},

	updateBullets: function (delta) {
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update(delta);
			
			var b = this.bullets[i];
			
			var done = false;
			
			if (b.rect.x + b.rect.width < 0) {
				done = true;
			} else if (b.rect.x > canvas.width) {
				done = true;
			} if(b.rect.y + b.rect.height < 0) {
				done = true;
			}
			else if (b.rect.y > canvas.height) {
				done = true;
			}
			
			if (done) {
				this.bullets.removeAt(i);
				i--;
			}
		}
	},

	update: function (delta) {//har overridats för både Player och Enemy
		this.moving = false;
		this.rect.y += this.speed * delta / 7;
	},
	
	shoot: function (angle) {//har overridats för både Player och Enemy
		var time = new Date();

		if (+time - +this.lastShot > this.minTime) {
			this.addShot(angle);
			
			this.shotBullet = true;

			//playSound('sfx/shot.wav');
			
			this.lastShot = time;
		}
	},

	draw: function (ctx) {
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].draw(ctx);
		}

		ctx.drawImage(this.img, Math.floor(this.rect.x), Math.floor(this.rect.y), this.rect.width, this.rect.height);
	}
}

var Player = function () {
	Fighter.call(this);

	this.rect = new Rectangle(0, 0, 83, 74);

	this.img = new Image();
	this.img.src = 'resources/hero-ship.png';

	this.velocity = new Vector2(0, 0);//Bör egentligen ligga i Fighter
	this.acceleration = 0.01;

	this.bonuses = {
		threeXShots: false,
		fiveXShots: false,
		shield: false
	};

	this.activeBonuses = [];

	this.minTime = 100;

	this.speed = 2;
	this.bulletSpeed = 5;

	this.lifes = 3;
	this.points = 0;

	this.lastShot = new Date();
	
	this.update = function (delta) {
		this.moving = false;

		if (input.a) {
			this.velocity.accelerateTowards(new Vector2(-2, undefined), this.acceleration * delta);
		}
		if (input.d) {
			this.velocity.accelerateTowards(new Vector2(2, undefined), this.acceleration * delta);
		}
		if (input.w) {
			this.velocity.accelerateTowards(new Vector2(undefined, -2), this.acceleration * delta);
		}
		if (input.s) {
			this.velocity.accelerateTowards(new Vector2(undefined, 2), this.acceleration * delta);
		}

		if (!(input.a || input.d)) {
			this.velocity.accelerateTowards(new Vector2(0, undefined), this.acceleration * delta);
		}
		if (!(input.w || input.s)) {
			this.velocity.accelerateTowards(new Vector2(undefined, 0), this.acceleration * delta);
		}

		this.rect.x += this.velocity.x * delta / 7;
		this.rect.y += this.velocity.y * delta / 7;

		if (input.v || input.space) {
			this.shoot();
		} else {
			this.shotBullet = false;
		}
		
		this.checkEdgeCollision();
		this.updateBullets(delta);
		this.checkBulletCollision(delta);
	};

	this.takeDamage = function () {
		if (!player.bonuses.shield) {
			player.lifes--;
		}

		playSound('sfx/take-damage.wav');

		if (!ended) {
			if (player.lifes <= 0) {
				//player.explode();
				endGame();
			}
		}
	}

	this.checkEdgeCollision = function () {//In i player constructorn
		if (this.rect.x < 0) {
			this.rect.x = 0;
			this.velocity.x = 0;
		}
		if (this.rect.y < 0) {
			this.rect.y = 0;
			this.velocity.y = 0;
		}
		if (this.rect.x + this.rect.width > canvas.width) {
			this.rect.x = canvas.width - this.rect.width;
			this.velocity.x = 0;
		}
		if (this.rect.y + this.rect.height > canvas.height) {
			this.rect.y = canvas.height - this.rect.height;
			this.velocity.y = 0;
		}
	};

	this.checkBulletCollision = function (delta) {
		if (this.bullets[0]) {
			for (var i = 0; i < this.bullets.length; i++) {
				for (var j = 0; j < enemies.length; j++) {
					if (this.bullets[i].rect.intersects(enemies[j].rect)) {
						enemies[j].explode();
						
						playSound('sfx/explosion.wav');						if (Math.random() < bonusSpawnChance * delta) {
							var index = Math.floor(Math.random() * bonusConstructors.length);
							mapBonuses.push(new bonusConstructors[index](enemies[j].rect.x, enemies[j].rect.y));
						}

						this.bullets.removeAt(i);
						enemies.removeAt(j);

						this.points++;

						break;
					}
				}
			}
		}
	};

	this.checkEnemyCollision = function () {
		for (var i = 0; i < enemies.length; i++) {
			if (this.rect.intersects(enemies[i].rect)) {
				enemies[i].explode();
				enemies.removeAt(i);

				playSound('sfx/explosion.wav');

				this.takeDamage();
			}
		}
	};

	this.checkBonusCollision = function () {
		for (var i = 0; i < mapBonuses.length; i++) {
			if (this.rect.intersects(mapBonuses[i].rect)) {
				mapBonuses[i].action();
				mapBonuses.removeAt(i);

				playSound('sfx/powerup.wav')
			}
		}
	};
	
	this.shoot = function () {
		var time = new Date();

		if (+time - +this.lastShot > this.minTime) {
			this.addShot(0);

			if (this.bonuses.threeXShots || this.bonuses.fiveXShots) {
				this.addShot(0.785);
				this.addShot(-0.785);
			}

			if (this.bonuses.fiveXShots) {
				this.addShot(0.3925);
				this.addShot(-0.3925);
			}
			
			this.shotBullet = true;

			playSound('sfx/shot.wav');
			
			this.lastShot = time;
		}
	};

	this.draw = function (ctx) {
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].draw(ctx);
		}

		ctx.drawImage(this.img, Math.floor(this.rect.x), Math.floor(this.rect.y), this.rect.width, this.rect.height);

		if (this.bonuses.shield) {
			ctx.strokeStyle = "#FFFFFF";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2) + 3, 52, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}
};

Player.prototype = Object.create(Fighter.prototype);

var Enemy = function () {
	Fighter.call(this);

	this.rect = new Rectangle(0, 0, 27, 51);
	
	this.bullets = enemyBullets;
	this.shotBullet = false;
	this.lastShot = new Date();
};

Enemy.prototype = Object.create(Fighter.prototype);
Enemy.prototype.img = new Image();
Enemy.prototype.img.src = 'resources/enemy-ship.png';
Enemy.prototype.speed = 1;
Enemy.prototype.bulletSpeed = 2;
Enemy.prototype.minTime = 1000;
Enemy.prototype.canShoot = false;
Enemy.prototype.improvedAim = false;

Enemy.prototype.checkBulletCollision = function (delta) {
	if (this.bullets[0]) {
		for (var i = 0; i < this.bullets.length; i++) {
			if (this.bullets[i].rect.intersects(player.rect)) {
				this.bullets.removeAt(i);

				if (!player.bonuses.shield) {
					player.lifes--;
				} else {
					player.bonuses.shield = false;
					player.activeBonuses[2] = undefined;
				}

				if (!ended) {
					if (player.lifes <= 0) {
						//player.explode();
						//endGame();
					}
				}

				break;
			}
		}
	}
};

Enemy.prototype.AILoop = function () {
	if (this.canShoot) {
		var deltaX = (player.rect.x + (player.rect.width / 2)) - (this.rect.x + (this.rect.width / 2));
		var deltaY = (this.rect.y + this.rect.height) - player.rect.y;

		var tanAngle = deltaX / deltaY;
		var angle = Math.atan(tanAngle);

		if(angle > -0.2 && angle < 0.2) {
			if (this.improvedAim) {
				tanAngle = (deltaX - (player.velocity.x * (deltaY / this.bulletSpeed))) / deltaY;
				//angle = Math.atan(tanAngle);
				this.shoot(Math.PI + angle);
			} else {
				this.shoot(Math.PI);
			}
		}
	}
}

Enemy.prototype.update = function (delta) {//har overridats i både Player och Enemy
	this.moving = false;
	this.AILoop();
	this.rect.y += this.speed * delta / 7;
}

var enemyBullets = {
	bullets: [],

	push: function (arg) {
		this.bullets.push(arg);
	},

	update: function (delta) {
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update(delta);
			
			var b = this.bullets[i];
			
			var done = false;
			
			if (b.rect.x + b.rect.width < 0) {
				done = true;
			} else if (b.rect.x > canvas.width) {
				done = true;
			} 
			if (b.rect.y + b.rect.height < 0) {
				done = true;
			} else if (b.rect.y > canvas.height) {
				done = true;
			}
			
			if (done) {
				this.bullets.removeAt(i);
				i--;
			}
		}
	},

	checkCollision: function (delta) {
		if (this.bullets[0]) {
			for (var i = 0; i < this.bullets.length; i++) {
				if (this.bullets[i].rect.intersects(player.rect)) {
					this.bullets.removeAt(i);

					player.takeDamage();

					break;
				}
			}
		}
	},

	draw: function (ctx) {
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].draw(ctx);
		}
	}
}

function checkIfEnemiesHasPast() {
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].rect.y > canvas.height){
			enemies.removeAt(i);
		}
	}
}