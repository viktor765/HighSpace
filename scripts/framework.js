'use strict';

function getLeft (elm) {
	var left = elm.offsetLeft;
	while (elm = elm.offsetParent) {
		left += elm.offsetLeft;
	}
	
	left -= window.pageXOffset;
	
	return left;
}

function getTop (elm) {
	var top = elm.offsetTop;
	while (elm = elm.offsetParent) {
		top += elm.offsetTop;
	}
	
	top -= window.pageYOffset;
	
	return top;
}

Array.prototype.remove = function (arg, all) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === arg) {
			this.splice(i, 1);
			
			if (all == null || !all) {
				break;
			} else {
				i--;
			}
		}
	}
}

Array.prototype.removeAt = function (position) {
	this.splice(position, 1);
}

Array.prototype.clear = function () {
	this.length = 0;
}

Array.prototype.insertAt = function (arg, position) {
	var arr1 = this.slice(0, position);
	var arr2 = this.slice(position);
	
	this.Clear();
	
	for (var i = 0; i < arr1.length; i++) {
		this.push(arr1[i]);
	}
	
	this.push(arg);
	
	for (var j = 0; j < arr2.length; j++) {
		this.push(arr2[j]);
	}
}

Array.prototype.contains = function (arg) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === arg) {
			return true;
		}
	}
			
	return false;
}

Array.prototype.occurs = function (arg) {
	var counter = 0;
	
	for (var i = 0; i < this.length; i++) {
		if (this[i] === arg) {
			counter++;
		}
	}
	
	return counter;
}

var Vector2 = function (x, y) {
	this.x = x;
	this.y = y;
	
	this.previousX = 0;
	this.previousY = 0;
};

Vector2.prototype.set = function (x, y) {
	if (x === undefined && y === undefined) {
		console.log("No 'x' or 'y' has been passed to Vector2's Set function");
	} else {
		this.previousX = this.x;
		this.previousY = this.y;
		
		if (x !== undefined && y === undefined) {
			this.x = x;
			this.y = y;
		} else {
			if (x !== undefined) {
				this.x = x;
			}
			if (y !== undefined) {
				this.y = y;
			}
		}
	}
};

Vector2.prototype.move = function (vec2) {
	this.x += vec2.x;
	this.y += vec2.y;
};

Vector2.prototype.normalize = function () {
	var tmp = new Vector2(this.x, this.y);
	
	var mag = Math.sqrt((tmp.x * tmp.x) + (tmp.y * tmp.y));
	tmp.x = tmp.x / mag;
	tmp.y = tmp.y / mag;
	
	return tmp;
};

Vector2.prototype.distance = function (vec2) {
	if (vec2 !== undefined) {
		return Math.sqrt(((vec2.x - this.x) * (vec2.x - this.x)) + ((this.y - vec2.y) * (this.y - vec2.y)));
	} else {
		return Math.sqrt(((this.previousX - this.x) * (this.previousX - this.x)) + ((this.previousY - this.y) * (this.previousY - this.y)));
	}
};

Vector2.prototype.hasChanged = function () {
	if (this.x !== this.previousX || this.y !== this.previousY) {
		return true;
	}
	
	return false;
};

Vector2.prototype.difference = function (vec2, invert) {
	var inv = 1;
	
	if (invert) {
		inv = -1;
	}
	
	if (vec2 === undefined) {
		return new Vector2((this.x - this.previousX) * inv, (this.y - this.previousY) * inv);
	} else {
		return new Vector2((this.x - vec2.x) * inv, (this.y - vec2.y) * inv);
	}
};

Vector2.prototype.accelerateTowards = function (target, acceleration) {//(vec2, vec2) Tar farten till en bestämd fart i steg, accelerate är fel ord, "gå mot" skulle passa bättre, stepTowards?
	if (target.x !== undefined) {
		
		//console.log(target.x + ' ' + target.y);
		
		if (target.x > this.x) {
			if (target.x - this.x > acceleration) {
				this.x += acceleration;
			} else {
				this.x = target.x;
			}
		} else if (target.x < this.x) {
			if (target.x - this.x < acceleration) {
				this.x -= acceleration;
			} else {
				this.x = target.x;
			}
		}
	}

	if (target.y !== undefined) {
		if (target.y > this.y) {
			if (target.y - this.y > acceleration) {
				this.y += acceleration;
			} else {
				this.y = target.y;
			}
		} else if (target.y < this.y) {
			if (target.y - this.y < acceleration) {
				this.y -= acceleration;
			} else {
				this.y = target.y;
			}
		}
	}
};

var Color = function (r, g, b, a) {
	this.r = 255;
	this.g = 255;
	this.b = 255;
	this.a = 1;
	
	if (r !== undefined) {
		this.r = r;
	}
	if (g !== undefined) {
		this.g = g;
	}
	if (b !== undefined) {
		this.b = b;
	}
	if (a !== undefined) {
		this.a = a;
	}
};

Color.prototype.toStandard = function (noAlpha) {
	if (noAlpha === undefined || !noAlpha) {
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	} else {
		return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
	}
};

var Rectangle = function (x, y, w, h, color) {
	if (x === undefined || y === undefined || w === undefined || h === undefined) {
		alert("You must pass in all the veriables for a rectange: (x, y, width, height)");
		
		var errorMsg = "The following are not provided:";
		if (x === undefined) {
			errorMsg += " 'x' ";
		}
		if (y === undefined) {
			errorMsg += " 'y' ";
		}
		if (w === undefined) {
			errorMsg += " 'width' ";
		}
		if (h === undefined) {
			errorMsg += " 'height'";
		}
		
		alert(errorMsg);
		throw new Error(errorMsg);
	}

	this.x		= x;
	this.y		= y;
	this.width	= w;
	this.height	= h;
	
	this.color = new Color();
};

Rectangle.prototype.intersects = function (shape) {
	var offset = 0;
	if (shape.radius !== undefined) {
		offset = shape.radius;
	}
	
	if (this.contains(shape.x - offset, shape.y - offset) || this.contains(shape.x + shape.width - offset, shape.y - offset) || this.contains(shape.x - offset, shape.y + shape.height - offset) || this.contains(shape.x + shape.width - offset, shape.y + shape.height - offset)) {
		return true;
	} else if (shape.contains(this.x - offset, this.y - offset) || shape.contains(this.x + this.width - offset, this.y - offset) || shape.contains(this.x - offset, this.y + this.height - offset) || shape.contains(this.x + this.width - offset, this.y + this.height - offset)) {
		return true;
	}
	
	return false;
};

Rectangle.prototype.contains = function (x, y) {
	if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
		return true;
	} else {
		return false;
	}
};

Rectangle.prototype.draw = function (ctx) {
	ctx.fillStyle = this.color.toStandard();
	ctx.fillRect(this.x, this.y, this.width, this.height);
};

var Animation = function (width, height, row, column, limit, imgSrc, fps, columns, rows, runs) {
	if (fps === undefined || fps >= 33) {
		this.fps = 1;
	} else {
		this.fps = 33 / fps;
	}
	
	this.fpsCounter = 0;
	this.width = width;
	this.height = height;
	this.rowStart = row;
	this.columnStart = column;
	this.row = row;
	this.column = column;
	this.rows = rows;
	this.columns = columns;
	
	if (limit === undefined || limit === 0) {
		this.limit = 999999999999;
	} else {
		this.limit = limit - 1;
	}

	this.limitCount = 0;

	if (runs === undefined || runs === 0) {
		this.runs = 999999999999;
	} else {
		this.runs = runs;
	}

	this.runCount = 0;
	this.done = false;
	this.image = new Image();
	this.image.src = imgSrc;
	this.position = new Vector2(0);
	this.cropPosition = new Vector2(0);
};

Animation.prototype.setLimit = function (limit) {
	this.limit = l - 1;
};

Animation.prototype.setRow = function (num) {
	this.row = num;
	this.rowStart = num;
	
	this.cropPosition.x = this.width * this.column;
	this.cropPosition.y = this.height * this.row;
};

Animation.prototype.setColumn = function (num) {
	this.column = num;
	this.columnStart = num;
	
	this.cropPosition.x = this.width * this.column;
	this.cropPosition.y = this.height * this.row;
};

Animation.prototype.update = function () {
	this.cropPosition.x = this.width * this.column;
	this.cropPosition.y = this.height * this.row;
	
	if (this.columns === undefined || this.columns === 0) {
		this.columns = this.image.width / this.width;
	}
	if (this.rows === undefined || this.rows === 0) {
		this.rows = this.image.height / this.height;
	}
};

Animation.prototype.draw = function (ctx) {
	if (this.fpsCounter === 0) {
		if (this.limitCount < this.limit) {
			this.limitCount++;
			this.column++;
			
			if (this.column >= this.columns) {
				this.row++;
				this.column = 0;
				
				if (this.row >= this.rows) {
					this.row = this.rowStart;
					this.column = this.columnStart;
					this.limitCount = 0;
				}
			}
		} else {
			this.column = this.columnStart
			this.row = this.rowStart;
			this.limitCount = 0;
			this.runCount++;

			if (this.runCount >= this.runs) {
				this.done = true;
			}
		}
	}
	
	ctx.drawImage(this.image, this.cropPosition.x, this.cropPosition.y, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
	
	this.fpsCounter++;
	
	if (this.fpsCounter >= this.fps) {
		this.fpsCounter = 0;
	}
};

var Input = function () {
	this.a = false;
	this.b = false;
	this.c = false;
	this.d = false;
	this.e = false;
	this.f = false;
	this.g = false;
	this.h = false;
	this.i = false;
	this.j = false;
	this.k = false;
	this.l = false;
	this.m = false;
	this.n = false;
	this.o = false;
	this.p = false;
	this.q = false;
	this.r = false;
	this.s = false;
	this.t = false;
	this.u = false;
	this.v = false;
	this.w = false;
	this.x = false;
	this.y = false;
	this.z = false;
	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
	this.enter = false;
	this.space = false;
	this.mouseIsDown = false;
	this.mousePosition = new Vector2(0);
	this.offset = new Vector2(0);
	this.clamp = new Vector2(0);
};

var input = new Input();

document.documentElement.onmousemove = function (e) {
	e = e || window.event;
	
	input.mousePosition.x = e.clientX - input.offset.x;
	input.mousePosition.y = e.clientY - input.offset.y;
};

document.documentElement.onmousedown = function (e) {
	input.mouseIsDown = true;
};

document.documentElement.onmouseup = function (e) {
	input.mouseIsDown = false;
};

document.documentElement.onkeydown = function (e) {
	var keycode;
	if (window.event) {
		keycode = window.event.keyCode;
	} else if (e) {
		keycode = e.which;
	}
	
	switch (keycode) {
		case 13:
			input.enter = true;
			break;
		case 32:
			input.space = true;
				if (ended) {
					resetGame();
					unpauseGame();
				}
			break;
		case 37:
			input.left = true;
			break;
		case 38:
			input.up = true;
			break;
		case 39:
			input.right = true;
			break;
		case 40:
			input.down = true;
			break;
		case 65:
			input.a = true;
			break;
		case 66:
			input.b = true;
			break;
		case 67:
			input.c = true;
			break;
		case 68:
			input.d = true;
			break;
		case 69:
			input.e = true;
			break;
		case 70:
			input.f = true;
			break;
		case 71:
			input.g = true;
			break;
		case 72:
			input.h = true;
			break;
		case 73:
			input.i = true;
			break;
		case 74:
			input.j = true;
			break;
		case 75:
			input.k = true;
			break;
		case 76:
			input.l = true;
			break;
		case 77:
			input.m = true;
			break;
		case 78:
			input.n = true;
			break;
		case 79:
			input.o = true;
			break;
		case 80:
			input.p = true;
			break;
		case 81:
			input.q = true;
			break;
		case 82:
			input.r = true;
			break;
		case 83:
			input.s = true;
			break;
		case 84:
			input.t = true;
			break;
		case 85:
			input.u = true;
			break;
		case 86:
			input.v = true;
			break;
		case 87:
			input.w = true;
			break;
		case 88:
			input.x = true;
			break;
		case 89:
			input.y = true;
			break;
		case 90:
			input.z = true;
			break;
	}
};

document.documentElement.onkeyup = function (e) {
	var keycode;
	if (window.event) {
		keycode = window.event.keyCode;
	} else if (e) {
		keycode = e.which;
	}
	
	switch (keycode) {
		case 13:
			input.enter = false;
			break;
		case 32:
			input.space = false;
			break;
		case 37:
			input.left = false;
			break;
		case 38:
			input.up = false;
			break;
		case 39:
			input.right = false;
			break;
		case 40:
			input.down = false;
			break;
		case 65:
			input.a = false;
			break;
		case 66:
			input.b = false;
			break;
		case 67:
			input.c = false;
			break;
		case 68:
			input.d = false;
			break;
		case 69:
			input.e = false;
			break;
		case 70:
			input.f = false;
			break;
		case 71:
			input.g = false;
			break;
		case 72:
			input.h = false;
			break;
		case 73:
			input.i = false;
			break;
		case 74:
			input.j = false;
			break;
		case 75:
			input.k = false;
			break;
		case 76:
			input.l = false;
			break;
		case 77:
			input.m = false;
			break;
		case 78:
			input.n = false;
			break;
		case 79:
			input.o = false;
			break;
		case 80:
			input.p = false;
			break;
		case 81:
			input.q = false;
			break;
		case 82:
			input.r = false;
			break;
		case 83:
			input.s = false;
			break;
		case 84:
			input.t = false;
			break;
		case 85:
			input.u = false;
			break;
		case 86:
			input.v = false;
			break;
		case 87:
			input.w = false;
			break;
		case 88:
			input.x = false;
			break;
		case 89:
			input.y = false;
			break;
		case 90:
			input.z = false;
			break;
	}
};