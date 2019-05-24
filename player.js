const PLAYER_ACC = 200;
const PLAYER_RED = -40;
const PLAYER_DEC = - 80;
const BREAKING_FACTOR = 0.01 ;
const STOP_LEVEL = 5;


class Player {
	constructor(x,y) {
		this.pos = createVector(x,y);
		this.speed = createVector(0,0);
		this.theta = 0;
		this.acc = createVector(0,0);
		this.radius = 20;
		this.rotSpeed = 0.04;
		this.power = false;
		this.retro = false;
		this.energy = ENERGY_MAX;
		this.score = 0;
	}

	update(t) {
		if (this.power) {
			this.acc.set(PLAYER_ACC * cos(this.theta), PLAYER_ACC * sin(this.theta));
			this.speed.add(p5.Vector.mult(this.acc, t)).limit(200);
			this.pos.add(p5.Vector.mult(this.speed, t));
		} else if(this.power == false && this.retro == false && this.speed.mag() > STOP_LEVEL) {
			this.speed.sub(p5.Vector.mult(this.speed, BREAKING_FACTOR ));
			this.pos.add(p5.Vector.mult(this.speed, t));
		} else if (this.power == false && this.retro) {
			this.acc.set(PLAYER_DEC * cos(this.theta), PLAYER_DEC * sin(this.theta));
			this.speed.add(p5.Vector.mult(this.acc, t)).limit(90);
			this.pos.add(p5.Vector.mult(this.speed, t));
		} 
		else {
			this.speed.set(0,0);
		}

	}
	

	show() {

		// Shape définie par rapport à l'origine
		let x1 = this.radius; 
		let y1 = 0 ;
		let x2 = - 0.5 * this.radius;
		let y2 = 0.866 * this.radius;
		let x3 = - 0.5 * this.radius;
		let y3 = - 0.866 * this.radius;
		push();
		noStroke();
		fill(230,20,100);
		translate(this.pos.x, this.pos.y);		// Translation jusqu'à la position
		rotate(this.theta);						// Rotation veers direction
		beginShape();
		vertex(x1,y1);
		vertex(x2,y2);
		vertex(0, 0);
		endShape(CLOSE);

		fill(200,10,90);
		beginShape();
		vertex(0,0);
		vertex(x3,y3);
		vertex(x1,y1);
		endShape(CLOSE);
		pop();
	}
}

class Bullet {
	constructor(x,y, theta, radius) {
		const SPEED = 250;
		this.pos  = createVector(x + radius * cos(theta), y + radius * sin(theta));
		this.speed = createVector(SPEED * cos(theta), SPEED * sin(theta));
		this.radius = 4;
	}

	update(t) {
		this.pos.add(p5.Vector.mult(this.speed, t));
	}

	show() {
		fill(255);
		circle(this.pos.x, this.pos.y, this.radius)
	}
}