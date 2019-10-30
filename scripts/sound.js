'use strict';

var gunshots = [];

for (var i = 0; i < 50; i++) {
	var gunshot = document.createElement('audio');
	gunshot.src = 'sfx/plasma.mp3';
	gunshots.push(gunshot);
}

function playGunSound(){
	if (element >= gunshots.length - 1) {
		element = 0;
	} else {
		element++;
	}

	try {
		gunshots[element].play();
	} catch (err) {
		console.log(element + err);
	}
}

function playSound (src) {
	if (soundsOn) {
		try {
			play(src);
		} catch(e) {
			playGunSound();
			console.log('Could not use webapi.');
		}
	}
}