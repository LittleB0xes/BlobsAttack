

const MAX_BIG_BLOB = 2;
const MAX_BLOB = 0;



let blobs = [];
let bullets = [];
let player;

let myFont;
const ENERGY_MAX = 10;

let gameState = 0;

let screen;

function preload() {
	myFont = loadFont('assets/8-bit-pusab.ttf');
	screen = createGraphics(700, 700);
	screen.background(5, 0, 12);
	screen.textSize(12);
	screen.textAlign(CENTER);
	screen.text("Waiting...", 350, 350);
	for (let i = 0; i <400; i++) {
		randomChord(0.18 * screen.width, 0.1 * screen.width);
	}
	screen.fill(5,0,12);
	screen.noStroke();
	screen.ellipse(0.72 * screen.width, 0.72 * screen.width,1.44 * screen.width);
	for (let i = 0; i <800; i++) {
		randomChord(0.72 * screen.width, 0.72 * screen.width);
	}
}

function setup() {
	createCanvas(700,700);
	frameRate(60);
	init();
}

function init() {
	blobs = [];
	bullets = [];
	player = new Player(width / 2, height / 2);
	for (let i = 0; i < MAX_BLOB; i++) {
		blobs.push(borningBlob(1));
	}
	for (let i = 0; i < MAX_BIG_BLOB; i++) {
		blobs.push(borningBlob(2));
	}
}

function draw() {
	image(screen, 0,0);
	switch(gameState) {
		case 0: 				// Intro Screen
			infoDisplay();
			break;
		case 1: 				// Game screen
			bulletMove();
			playerMove();
			blobMove();
			collision();
			infoDisplay();
			break;
		case 2 : 				// Game over screen
			blobMove();
			player.pos.set(0.5 * width , 0.5 * height + 100);
			infoDisplay();
			break;
	}
}

function keyPressed() {
	switch(gameState) {
		case 0:
			if (keyCode === RETURN) {
				gameState += 1;
			}
			break;
		case 1:
			if (key === ' ') {
				bullets.push(new Bullet(player.pos.x, player.pos.y, player.theta, player.radius));
			}
			break;
		case 2:
			if (keyCode === RETURN) {
				gameState -= 1;
				init();
			}

	}
	
}

function infoDisplay() {
	switch(gameState) {
		case 0:
			fill(255);
			textAlign(CENTER);
			textStyle(BOLD);
			textSize(24);
			text("Blob's Attack", 0.5 * width, 0.5 * height - 100);
			textSize(12);
			text("How long will you survive ?", 0.5 * width, 0.5 * height - 70);
			textSize(12);
			textFont(myFont);
			textStyle(NORMAL);
			text("Right & Left Arrow to rotate", 0.5 * width, 0.5 * height + 100 );
			text("Spacebar to fire", 0.5 * width, 0.5 * height + 150 );
			text("Up Arrow to turn the engine on", 0.5 * width, 0.5 * height + 200);
			text("Down Arrow for retro",  0.5 * width, 0.5 * height + 250)
			
			// Blinky message !!
			if (second() % 2 == 0) {
				fill(230,20,100);
			} else {
				fill(255);
			}
			text("Press Enter to start...", 0.5 * width, 0.5 * height + 300);
			break;
		case 1:
			fill(255);
			textFont(myFont);
			textSize(18);
			textAlign(CENTER);
			textStyle(BOLD);
			text(player.score, 0.90 * width, 0.1 * height);
			fill(230,20,100);
			noStroke();
			rect(10,10, 100,20);
			fill(10,230,100);
			rect(10,10, player.energy * 100 / ENERGY_MAX, 20);
			break;
		case 2:
			fill(255);
			textFont(myFont);
			textSize(18);
			textAlign(CENTER);
			textStyle(BOLD);
			text(player.score, 0.90 * width, 0.1 * height);
			textAlign(CENTER);
			textStyle(BOLD);
			textSize(24);
			text("Game Over...", 0.5 * width, 0.5 * height);
			textSize(12);
			if (second() % 2 == 0) {
				fill(230,20,100);
			} else {
				fill(255);
			}
			text("Press Return to try again", 0.5 * width , 0.75 * height);
			break;
	}
}

function collision() {
	for (let i = 0; i < bullets.length; i++) {
		if (checkContact(player, bullets[i])) {
			player.energy -=1;
			player.score += 1;
			bullets.splice(i,1);
		}
	}

	for (let i = 0; i < blobs.length; i++) {
		if (checkContact(player, blobs[i])) {
			player.energy -=1;
			player.score +=1;
			let type = blobs[i].type;
			if (type == 1) {
				blobs[i] = borningBlob(type);
			} else if (type == 2) {							// Blob's explosion
				// Blob with opposite direction
				blobs.push(borningBlob(1));
				blobs[blobs.length-1].speed.set(p5.Vector.mult(player.speed,10));
				blobs[blobs.length-1].pos.set(blobs[i].pos);

				// Blob with opposite direction and with deviation
				blobs.push(borningBlob(1));
				blobs[blobs.length-1].speed.set(p5.Vector.mult(player.speed,10).rotate(PI / 3));
				blobs[blobs.length-1].pos.set(blobs[i].pos);
				
				// Blob witj opposite direction and another angle
				blobs.push(borningBlob(1));
				blobs[blobs.length-1].speed.set(p5.Vector.mult(player.speed,10).rotate(-PI/3));
				blobs[blobs.length-1].pos.set(blobs[i].pos);

				blobs[i] = borningBlob(2);
				
			}
			
		}
	}

	for (let j = 0; j < blobs.length; j++) {
		for (let i = 0; i < bullets.length; i++) {
			if (checkContact(blobs[j], bullets[i])) {
				let type = blobs[j].type;
				if (type == 1) {
					blobs[j] = borningBlob(type);
				} else if (type == 2) {
					// Explosion du blob de type 2 en trois blob de type 1
					// suivant trois axe de 0, pi/4 et -pi/4 par rapport à la vitesse du projectile
					blobs.push(borningBlob(1));
					blobs[blobs.length-1].speed.set(p5.Vector.mult(bullets[i].speed,10));
					blobs[blobs.length-1].pos.set(blobs[j].pos);

					blobs.push(borningBlob(1));
					blobs[blobs.length-1].speed.set(p5.Vector.mult(bullets[i].speed,10).rotate(PI / 3));
					blobs[blobs.length-1].pos.set(blobs[j].pos);

					blobs.push(borningBlob(1));
					blobs[blobs.length-1].speed.set(p5.Vector.mult(bullets[i].speed,10).rotate(-PI / 3));
					blobs[blobs.length-1].pos.set(blobs[j].pos);

					blobs[j] = borningBlob(2);
					
				}

				player.score +=1;
				bullets.splice(i,1);
			}
		}
	}
}

function borningBlob(type) {
	let x;
	let y;
	let zone = round(random(0,3));
	switch(zone) {
		case 0: 
			x = random(0.2 * width, 0.8 * width);
			y = random(0, 0.05 * height);
			break;
		case 1:
			x = random(0.95 * width, width);
			y = random(0.2 * height, 0.8 * height);
			break;
		case 2:
			x = random(0.2 * width, 0.8 * width);
			y = random(0.95 * height, height);
			break;
		case 3:
			x = random(0, 0.05 * width);
			y = random(0.2 * height, 0.8 * height);
			break;
	}
	return new Blob(x, y, type, player.pos);
}

function checkContact(object1, object2) {
	if(object1.pos.dist(object2.pos) < object1.radius + object2.radius - 4) {
		return true;
	} else {
		return false;
	}
}

function bulletMove() {
	for (let bullet of bullets) {
		if (bullet.pos.x > width) {
			bullet.pos.x = 0;
		} else if (bullet.pos.x < 0) {
			bullet.pos.x = width;
		}
		if (bullet.pos.y > height) {
			bullet.pos.y = 0;
		} else if (bullet.pos.y < 0) {
			bullet.pos.y = height;
		}
		bullet.update(1/frameRate());
		bullet.show();
	}
}

function playerMove() {
	if (keyIsDown(LEFT_ARROW)) {
		player.theta -=player.rotSpeed;

	} else if (keyIsDown(RIGHT_ARROW)) {
		player.theta += player.rotSpeed;
	}
	if (keyIsDown(UP_ARROW)) {
		player.power = true;
		player.retro = false;
	} else if (keyIsDown(DOWN_ARROW)) {
		player.power = false;
		player.retro = true;
	} else {
		player.retro = false;
		player.power = false;
	}

	if (player.pos.x > width) {
		player.pos.x = 0;
	} else if (player.pos.x < 0) {
		player.pos.x = width;
	}
	if (player.pos.y > height) {
		player.pos.y = 0;
	} else if (player.pos.y < 0) {
		player.pos.y = height;
	}

	player.update(1/frameRate());
	player.show();
	if (player.energy <= 0) {
		gameState+=1;
	}
}

function blobMove() {
	for (let i = 0; i < blobs.length; i++) {
		if (blobs[i].pos.x > width) {
			blobs[i].pos.x = 0;
		} else if (blobs[i].pos.x < 0) {
			blobs[i].pos.x = width;
		}
		if (blobs[i].pos.y > height) {
			blobs[i].pos.y = 0;
		} else if (blobs[i].pos.y < 0) {
			blobs[i].pos.y = height;
		}

		blobs[i].update(1/frameRate());
		blobs[i].show();		
	}
}

function randomChord(x,y) {
	// find a random point on a circle
	let angle1 = random(0, 2 * PI);
	let xpos1 = x + y * cos(angle1);
	let ypos1 = x + y * sin(angle1);
	
	// find another random point on the circle
	let angle2 = random(0, 2 * PI);
	let xpos2 = x + y * cos(angle2);
	let ypos2 = x + y * sin(angle2);
	
	// draw a line between them
	screen.stroke(255, 255, 255, 15);
	screen.line(xpos1, ypos1, xpos2, ypos2);
}  
	