var pointers = {};
var music = document.getElementById("theSong");
previousframerate = my_controller.frames(0)
Leap.loop(function(frame){
	var currhandposition = frame.hands.palmPosition
	if(frame.hands.length === 0){
		music.playbackRate = 0;
	}
	if((currhandposition[0] < (left box right boundary) && (currhandposition[1] < (left box top boundary)) && (currhandposition[1] > (left box bottom boundary)))
		|| ((currhandposition[0] > (right box left boundary) && (currhandposition[1] < (right box top boundary)) && (currhandposition[1] > (right box bottom boundary))))
		|| ((currhandposition[1] > (top box bottom boundary) && (currhandposition[0] > (top box left boundary)) && (currhandposition[0] < (top box right boundary))))
		|| ((currhandposition[1] < (bottom box top boundary) && (currhandposition[0] > (bottom box left boundary)) && (currhandposition[0] < (bottom box right boundary))))
		){
		var currframerate = my_controller.frames(0)
		float framedifference = currframerate - previousframerate
		previousframerate = currframerate
		float conductorbpm = 60 / framedifference
		float newspeed = conductorbpm / 154
		music.playbackRate = newspeed
	}
	else {
		music.playbackRate = 1;
	}
	frame.hands.forEach(function(hand, index){
		var pointer = (pointers[index] || (pointers[index] = new Pointer()))
		pointer.setPosition(hand.screenPosition());
	});
}).use('screenPosition', {scale: 0.25});

var Pointer = function(){
	var pointer = this;
	var img = document.createElement('img');
	img.src = 'http://upload.wikimedia.org/wikipedia/commons/0/0f/Black_dot.png';
	img.style.position = 'absolute';
	img.onload = function(){
		document.body.appendChild(img);
	};
	pointer.setPosition = function(position){
		img.style.left = position[0] - img.width / 2 + 'px';
		img.style.top = 150 + position[1] - img.height / 2 + 'px';
	}
};