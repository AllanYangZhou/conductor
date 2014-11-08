var pointers = {};
var music = document.getElementById("theSong");
Leap.loop(function(frame){
	music.playbackRate = 1;
	if(frame.hands.length > 0){
		var index = frame.hands[0].indexFinger;
		if(index.extended == false){
			console.log(frame.hands[0].grabStrength)
			if(frame.hands[0].grabStrength > 0.8){
				music.playbackRate = 0;
			}

		}
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