var pointers = {};
var music = document.getElementById("theSong");
music.volume = 0.7
var alerts = document.getElementById("alerts");
var status = document.getElementById("status-icon");
var height = window.innerHeight;
var width = window.innerWidth;
var pointerCoord = {x:0, y:0};
var prev = [];

var generalError = function(){
	alerts.innerHTML = 'Something went wrong. Oops.';
	document.getElementById("status-icon").className = 'glyphicon glyphicon-minus-sign glyph-lg';
	music.playbackRate = 0;
};

var noComposingHand = function(){
	alerts.innerHTML = 'Waiting for composing hand.';
	document.getElementById("status-icon").className = 'glyphicon glyphicon-minus-sign glyph-lg';
	music.playbackRate = 0;
};

var yesComposingHand = function(){
	alerts.innerHTML = 'Everything is running smoothly!';
	document.getElementById("status-icon").className = 'glyphicon glyphicon-pause glyph-lg';
	music.playbackRate = 1;
};

var boxFinder = function(x, y){
	if((y < (height / 4)) && (x > (3 * width / 14)) && (x < 11 * width / 14)){
		return true;
	}
	else if(y > (3 * height / 8) && x < (3*width/14)){
		return true;
	}
	else if(x > (11*width / 14) && y > 3*height/8){
		return true;
	}
	else if(y > 5*height/8){
		return true;
	}
	else {
		return false;
	}
};

music.playbackRate = 0;
Leap.loop(function(frame){
	if(frame.hands.length > 2){
		generalError();
	}	
	else if(frame.hands.length == 0 || (frame.hands.length == 1 && frame.hands[0].type == "left")){
		noComposingHand();
	}
	else{
		if(prev.length == 0){
			prev = [boxFinder(pointerCoord.x, pointerCoord.y), new Date()];
		}
		else if(boxFinder(pointerCoord.x, pointerCoord.y) && !prev[0]){
			var current = new Date();
			var difference = (current.getTime()-prev[1].getTime())/1000;
			console.log(difference);
			prev[0] = true;
			prev[1] = current;
		}
		else if(!(boxFinder(pointerCoord.x, pointerCoord.y))) {
			prev[0] = false;
		}
		frame.hands.forEach(function(hand, index){
			var handType = hand.type;
			//if left hand do volume control
			if(handType == "left"){
				if(hand.palmNormal[1] < 0 && hand.palmVelocity[1] < -70){
					if(music.volume-0.01 > .01){
						music.volume = music.volume -0.015;
					}
				}
				else if(hand.palmVelocity[1] > 70){
					if(music.volume+0.01 < .99){
						music.volume = music.volume + 0.015;
					}
				}
			}
			else if(handType == "right"){
				var pointer = (pointers[0] || (pointers[0] = new Pointer()));
				pointer.setPosition(hand.screenPosition());
				var index = hand.indexFinger;
				if(frame.hands[0].grabStrength > 0.8){
					alerts.innerHTML = "Paused!";
					document.getElementById("status-icon").className = 'glyphicon glyphicon-play glyph-lg';
					music.playbackRate = 0;
				} else {
					yesComposingHand();
				}
			}
		});
	}
}).use('screenPosition', {positioning: 'absolute'});

//creates new pointer
var Pointer = function(){
	var pointer = this;
	var img = document.createElement('img');
	img.src = '/static/dot.gif';
	img.style.position = 'absolute';
	img.onload = function(){
		document.body.appendChild(img);
	};
	pointer.setPosition = function(position){
		pointerCoord.x = position[0] - (1/2)* img.width / 2;
		pointerCoord.y = window.innerHeight + (1/2)*(position[1] - img.height / 2);
		img.style.left = pointerCoord.x + 'px';
		img.style.top = pointerCoord.y + 'px';
	}
};