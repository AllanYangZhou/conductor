var pointers = {};
var music = document.getElementById("theSong");
music.volume = 0.7
var alerts = document.getElementById("alerts");
var status = document.getElementById("status-icon");
var height = window.innerHeight;
var width = window.innerWidth;
var pointerCoord = {x:0, y:0};
var prev = []; // first object is true/ false, 2nd object is date
var times = []; //array that takes holds times between beats
var outofbounds = true;

var generalError = function(){
	alerts.innerHTML = 'Something went wrong. Oops.';
	document.getElementById("status-icon").className = 'glyphicon glyphicon-minus-sign glyph-lg';
	music.playbackRate = 0;
};

var noComposingHand = function(){
	alerts.innerHTML = 'Waiting for conducting hand.';
	document.getElementById("status-icon").className = 'glyphicon glyphicon-minus-sign glyph-lg';
	music.playbackRate = 0;
};

var yesComposingHand = function(){
	alerts.innerHTML = 'Everything is running smoothly!';
	document.getElementById("status-icon").className = 'glyphicon glyphicon-pause glyph-lg';
	if(music.playbackRate == 0){
		music.playbackRate = 1;
	}
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
	console.log(outofbounds);
	if(frame.hands.length > 2){  //IF there are more than 2 hands, you done goofed
		generalError();
		outofbounds = true;
	}

	else if(frame.hands.length == 0)
	{
		outofbounds = true;
	}	

	else if(frame.hands.length == 1 && frame.hands[0].type == "left") //If there are no hands or just the left, you are not composing
	{ 
		noComposingHand();
		outofbounds = true;
	}


	else{  //If you are composing...

		if(prev.length == 0)  //If the array is empty
		{
			prev = [boxFinder(pointerCoord.x, pointerCoord.y), new Date()];
		}

		else if(!prev[0] && boxFinder(pointerCoord.x, pointerCoord.y) && outofbounds != true){ //IF the previous is False and you are in a box
			prev[0] = true; 
			var current = new Date();

			// if ( prev.length == 1)// If there are no Date Time values aka this is your first box
			// {
			// 	prev[1] =  current;
			// }

		
			var difference = (current.getTime()-prev[1].getTime())/1000;
			times.push(difference);
			prev[1] = current;

			//If there are 4 times in the array:
			if (times.length == 4)
			{
				avg_time = (times[0] + times[1] + times[2] + times[3])/4;
				music.playbackRate = (60/ avg_time)/ 147;
				times = [];
			}

				
			}
		else if (prev[0] && !boxFinder(pointerCoord.x, pointerCoord.y)){  //If the previous is True and you are outside a box
			prev[0] = false;
		}
		outofbounds = false;


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