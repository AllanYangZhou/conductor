
var pointers = {};
var music = document.getElementById("theSong");
music.volume = 0.7
var alerts = document.getElementById("alerts");
var status = document.getElementById("status-icon");

music.playbackRate = 0;
Leap.loop(function(frame){
	if(frame.hands.length > 0){
		console.log(music.volume);
		var index = frame.hands[0].indexFinger;
		if(index.extended == false || Math.abs(frame.hands[0].palmNormal[1]) > .7){
			
			if(frame.hands[0].grabStrength > 0.8){
				alerts.innerHTML = "Paused!";
				document.getElementById("status-icon").className = 'glyphicon glyphicon-play glyph-lg';
				music.playbackRate = 0;
			}
			else if(frame.hands[0].palmNormal[1] < 0 && frame.hands[0].palmVelocity[1] < -70){
				if(music.volume-0.01 > .01){
					music.volume = music.volume -0.015;
				}
			}
			else if(frame.hands[0].palmNormal[1] > 0 && frame.hands[0].palmVelocity[1] > 70){
				if(music.volume+0.01 < .99){
					music.volume = music.volume + 0.015;
				}
			}

			else {
				alerts.innerHTML = "Everything is running smoothly!";
				document.getElementById("status-icon").className = 'glyphicon glyphicon-pause glyph-lg';
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
	document.getElementById("status-icon").className = 'glyphicon glyphicon-pause glyph-lg';
	music.playbackRate = 1;
})
.on('handLost', function(){
	alerts.innerHTML = 'You done goofed--we lost a hand!';
	document.getElementById("status-icon").className = 'glyphicon glyphicon-minus-sign glyph-lg';
	music.playbackRate = 0;
});


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
		img.style.left = position[0] - img.width / 2 + 'px';
		img.style.top = 150 + position[1] - img.height / 2 + 'px';
	}
};