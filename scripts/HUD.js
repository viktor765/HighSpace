'use strict';

var heart = new Image();
heart.src = 'resources/heart.png';

function drawPoints(ctx) {
	ctx.fillStyle = '#FF0000';
	ctx.font = '12px Press Start';
	ctx.fillText('Points: ' + player.points, 870 - player.points.toString().length * 12, 40);
	ctx.fillText('Stage: ' + (stageNumber + 1), 870 - player.points.toString().length * 12, 60);
}

function drawLives(ctx) {
	for (var i = 0; i < player.lifes; i++) {
		ctx.drawImage(heart, 80 * i + 10, 20, 70, 61);
	}
}

function drawActiveBonuses(ctx) {
	var row = 0;

	for (var i = 0; i < player.activeBonuses.length; i++) {
		if (player.activeBonuses[i]) {
			ctx.fillStyle = '#FF0000';
			ctx.font = '12px Press Start';
			ctx.fillText(player.activeBonuses[i].hudName, 500, 40 + row * 20);
			
			if (!player.activeBonuses[i].durationIsInfinite) {
				ctx.fillText(Math.ceil(player.activeBonuses[i].timeLeft / 1000 * 10) / 10, 700, 40 + row * 20);
			}

			row++;
		}
	}
}

var messages = [];

function drawMessages(ctx) {
	var currentDate = new Date();
	
	for (var i = 0; i < messages.length; i++) {
		if (+currentDate <= +messages[i].start + messages[i].time) {
			ctx.fillStyle = '#FF0000';
			ctx.font = '20px Press Start';

			ctx.fillText(messages[i].string, 340, 290 + i * 20);
		} else {
			messages.removeAt(i);
		}
	}

	if (paused) {
		ctx.fillStyle = '#FF0000';
		ctx.font = '20px Press Start';

		ctx.fillText('Game paused, click to unpause.', 220, 190);
	}

	if (ended) {
		ctx.fillStyle = '#FF0000';
		ctx.font = '16px Press Start';

		ctx.fillText('Game Over, you scored ' + player.points + ' points. Play again?', 170, 190);
	}
}

function HUDMessage(string, time) {
	messages.push({
	string: string, 
	time: time, 
	start: new Date()
	});
}

function drawHUD(ctx) {
	drawButtons(ctx);
	drawPoints(ctx);
	drawLives(ctx);
	drawActiveBonuses(ctx);
	drawMessages(ctx);
}

function drawButtons(ctx) {
	ctx.drawImage(pauseButton.img, pauseButton.rect.x, pauseButton.rect.y, pauseButton.rect.width, pauseButton.rect.height);
	ctx.drawImage(muteSwitch.img, muteSwitch.rect.x, muteSwitch.rect.y, muteSwitch.rect.width, muteSwitch.rect.height);

	if (ended) {
		startButton.draw(ctx);
	}
}

//var buttons = [];

var pauseButton = {//HUD-knapp
	rect: new Rectangle(970, 550, 10, 10),
	img: new Image(),

	action: function () {
		if(!ended) {
			if (!paused) {
				pauseGame();
			} else {
				unpauseGame();
			}
		}
	}
};

pauseButton.img.src = 'resources/pause.png';
//buttons.push(pauseButton);

var muteSwitch = {//HUD-knapp
	rect: new Rectangle(970, 570, 10, 10),
	img: new Image(),

	action: function () {
		soundsOn = !soundsOn;

		if (soundsOn) {
			this.img.src = 'resources/unmuted.png';
		} else {
			this.img.src = 'resources/muted.png';
		}
	}
};

muteSwitch.img.src = 'resources/muted.png';

//buttons.push(muteSwitch);

var startButton = {
	rect: new Rectangle(458, 210, 84, 20),

	action: function () {
		resetGame();
		unpauseGame();
	},

	draw: function (ctx) {
		this.rect.draw(ctx);
		ctx.fillStyle = '#FF0000';
		ctx.font = '16px Press Start';
		ctx.fillText('Start', this.rect.x + 3, this.rect.y + 17);
	}
};

canvas.addEventListener('mousedown', function (event) {
	var rect = canvas.getBoundingClientRect();//Hämtar canvasens position

	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;

	if (paused) {
		unpauseGame();
	} else {
		if (pauseButton.rect.contains(x, y)) {
			pauseButton.action();
		}
	}

	if (muteSwitch.rect.contains(x, y)) {
		muteSwitch.action();
	}

	if (ended) {
		if (startButton.rect.contains(x, y)) {
			resetGame();
			unpauseGame();
		}
	}
});