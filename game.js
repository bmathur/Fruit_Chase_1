/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

//Start image
var MenuReady = false;
var MenuImage = new Image();
MenuImage.onload = function () {
	MenuReady = true;
};
MenuImage.src = "Menu.png";

//Start image
var StartReady = false;
var StartImage = new Image();
StartImage.onload = function () {
	StartReady = true;
};
StartImage.src = "START.png";

// HighScores image
var High_sReady = false;
var High_sImage = new Image();
High_sImage.onload = function () {
	High_sReady = true;
};
High_sImage.src = "HIGH_S.png";

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "background.jpg";

// Fruit image
var fruitReady = false;
var fruitImage = new Image();
fruitImage.onload = function () {
	fruitReady = true;
};
fruitImage.src = "berry.png";

// Character image
var characterReady = false;
var characterImage = new Image();
characterImage.onload = function () {
	characterReady = true;
};
characterImage.src = "georgeDown.png";


var evilFruitReady = false;
var evilFruitImage = new Image();
evilFruitImage.onload = function () {
    evilFruitReady = true;
};
evilFruitImage.src = "EvilFruit.png";


var evilFruits = [];
var isGameOver = true;
sessionStorage.setItem("highScore", 0);

// Game objects
var character = {
	speed: 256, // movement in pixels per second
	x: canvas.width/2,
	y: canvas.height/2
};
var fruit = {
	x: 0,
	y: 0
};
function evilFruit() {
    this.speed = (Math.random() * 50) + 60;
	this.x = 32 + (Math.random() * (canvas.width - 64));
	this.y = 32 + (Math.random() * (canvas.height - 64));
};
var fruit_count = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a fruit
var newFruit = function () {
	// Throw the fruit somewhere on the screen randomly
	fruit.x = 32 + (Math.random() * (canvas.width - 64));
	fruit.y = 32 + (Math.random() * (canvas.height - 64));
};

var reset = function() {
	character.x = canvas.width/2;
	character.y = canvas.height/2;
    	fruit.x = 32 + (Math.random() * (canvas.width - 64));
	fruit.y = 32 + (Math.random() * (canvas.height - 64));
        fruit_count = 0;
        var numEvil = evilFruits.length;
        for(i = 0; i < numEvil; i++) {
            evilFruits.pop();
        }
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown && character.y > 0) { // Player holding up
        characterImage.src = "georgeUp.png";
	character.y -= character.speed * modifier;
	}
	if (40 in keysDown && character.y < canvas.height - 32) { // Player holding down
        characterImage.src = "georgeDown.png";
	character.y += character.speed * modifier;
	}
	if (37 in keysDown && character.x > 0) { // Player holding left
        characterImage.src = "georgeLeft.png";
	character.x -= character.speed * modifier;
	}
	if (39 in keysDown && character.x < canvas.width - 32) { // Player holding right
        characterImage.src = "georgeRight.png";
	character.x += character.speed * modifier;
	}
        
        for (i = 0; i < evilFruits.length; i++){
            if (character.x < evilFruits[i].x + 50 && character.x > evilFruits[i].x  
                            && character.y < evilFruits[i].y + 50 && character.y > evilFruits[i].y  ) {
                        
                        isGameOver = true;
                        
                        if (sessionStorage.getItem("highScore") < fruit_count){
                            sessionStorage.setItem("highScore", fruit_count);   
                        }                        
                    }
        }

        //update evil fruits if not touching another evil fruit
        for (i = 0; i < evilFruits.length; i++){
            for (j = 0; j < evilFruits.length; j++) {
                if (j !== i) {
                    if (evilFruits[j].x < evilFruits[i].x + 50 && evilFruits[j].x > evilFruits[i].x  
                            && evilFruits[j].y < evilFruits[i].y + 50 && evilFruits[j].y > evilFruits[i].y  ) {
                        evilFruits[j].x += evilFruits[j].speed * modifier;
                        evilFruits[i].x -= evilFruits[j].speed * modifier;
                        evilFruits[j].y += evilFruits[j].speed * modifier;
                        evilFruits[i].x -= evilFruits[j].speed * modifier;
                    }
                }
            }

            evilFruits[i].x += 
        ((evilFruits[i].x - character.x) > 0) ? 
            -1 * (evilFruits[i].speed * modifier) : 
            evilFruits[i].speed * modifier;

        evilFruits[i].y += 
            ((evilFruits[i].y - character.y) > 0) ? 
                -1 * (evilFruits[i].speed * modifier) : 
                evilFruits[i].speed * modifier;

        }
	// Are they touching?
	if (
		character.x <= (fruit.x + 32)
		&& fruit.x <= (character.x + 32)
		&& character.y <= (fruit.y + 32)
		&& fruit.y <= (character.y + 32)
	) {
		++fruit_count;
                
            //create new evil fruit every 10 fruits collected
            if (fruit_count > 0 && fruit_count % 10 === 0) {
               var newEvilFruit = new evilFruit();
               evilFruits.push(newEvilFruit);

            }

           newFruit();


	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (characterReady) {
		ctx.drawImage(characterImage, character.x, character.y);
	}

	if (fruitReady) {
		ctx.drawImage(fruitImage, fruit.x, fruit.y);
	}
        
        if (evilFruitReady){
            for (i = 0; i < evilFruits.length; i++){
               ctx.drawImage(evilFruitImage, evilFruits[i].x, evilFruits[i].y);
            }
        }

	// Score

	ctx.fillText("fruits eaten: " + fruit_count, 32, 32);

};
//audio
var audio, playbtn;
        //mutebtn, seek_bar;
function initAudioPlayer(){
	audio = new Audio();
	audio.src = "music.mp3";
	audio.loop = true;
	audio.play();
	// Set object references
	playbtn = document.getElementById("playpausebtn");
//mutebtn = document.getElementById("mutebtn");
	// Add Event Handling
	playbtn.addEventListener("click",playPause);
	//mutebtn.addEventListener("click", mute);
	// Functions
	function playPause(){
		if(audio.paused){
		    audio.play();
		    playbtn.style.background = "url(pause.png) no-repeat";
	    } else {
		    audio.pause();
		    playbtn.style.background = "url(play.png) no-repeat";
	    }
	}
        
	}

// The main game loop
var main = function () {
       	ctx.fillStyle = "rgb(255,255,255)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
    
	var now = Date.now();
	var delta = now - then;

	if(isGameOver){               
                ctx.drawImage(MenuImage, 0,0);
		ctx.drawImage(StartImage, 50, 50);
		ctx.drawImage(High_sImage, 50, 250);
 
                ctx.fillText("HIGHSCORE: " + sessionStorage.getItem("highScore"), 250, 32);
	canvas.addEventListener('click', function(event) {
    var x = event.pageX - canvas.offsetLeft,
     y = event.pageY - canvas.offsetTop;

	var Startwidth = StartImage.naturalWidth;
	var Startheight = StartImage.naturalHeight;


	var Highwidth = High_sImage.naturalWidth;
	var Highheight = High_sImage.naturalHeight;
   

       	 if (y > 50 && y < 50 + Startheight && x > 50 && x < 50 + Startwidth) {
             x = 0;
             y = 0;
       	     isGameOver = false;
             reset();
       	 }
       	 else if (y > 250 && y < 250 + Highheight && (x > 50) && x < 50 + Highwidth){

       	 }
       	 else{//do nothing
       	 }

    });
    }
	else{

    update(delta / 1000);
	render();
       
}
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
newFruit();

main();
//initAudio();
window.addEventListener("load", initAudioPlayer);