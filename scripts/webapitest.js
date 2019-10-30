'use strict';

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var request;
//var shootsound;

function getData(src) {
	source = audioCtx.createBufferSource();
	request = new XMLHttpRequest();

	request.open('GET', src, true);

	request.responseType = 'arraybuffer';

	request.onload = function() {
		var audioData = request.response;
		//shootsound = request.response;

		//console.log(audioData);

		/*if (!audioData) {
			console.log("bad audioData: " + typeof audioData + " " + src);
			console.log(audioData);
		}*/

		audioCtx.decodeAudioData(audioData).then(function (buffer) {
			source.buffer = buffer;

			source.connect(audioCtx.destination);
		});
	}

	request.send();
}

function play(src) {
	getData(src);
	source.start();
}