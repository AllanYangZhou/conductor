var pointers = {};
var music = document.getElementById("theSong");
var alerts = document.getElementById("alerts");
music.playbackRate = 0;
Leap.loop(function(frame){
	if(frame.hands.length > 0){
		var index = frame.hands[0].indexFinger;
		if(index.extended == false){
			console.log(frame.hands[0].grabStrength)
			if(frame.hands[0].grabStrength > 0.8){
				alerts.innerHTML = "Paused!";
				music.playbackRate = 0;
			}
			else {
				alerts.innerHTML = "Everything is running smoothly!";
				music.playbackRate = 1;
			}
		}
	}
	frame.hands.forEach(function(hand, index){
		var pointer = (pointers[index] || (pointers[index] = new Pointer()))
		pointer.setPosition(hand.screenPosition());
	});
})
.use('screenPosition', {scale: 0.50})
.use('handEntry')
.on('handFound', function(){
	alerts.innerHTML = 'Everything is running smoothly!';
	music.playbackRate = 1;
})
.on('handLost', function(){
	alerts.innerHTML = 'You done goofed--we lost a hand!';
	music.playbackRate = 0;
});


//creates new pointer
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