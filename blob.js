class Blob {

	constructor(x,y, type, playerPosition) {
		this.pos = createVector(x, y);
		this.speed = createVector(0,0);
		this.acc = p5.Vector.sub(playerPosition, this.pos);
		
		this.type = type;
		if (this.type == 1) {
			this.radius = random(12,20);
			this.speedMax = random(100,130)
			this.accMax = random(110,130);

		} else if (this.type == 2) {
			this.radius = random(25,30);
			this.speedMax = random(90,110);
			this.accMax = random(100,110);
		}
		this.acc.setMag(this.accMax);
	}

	update(t) {
		if (p5.Vector.dist(this.pos, player.pos) < width * 0.55) {
			this.acc = p5.Vector.sub(player.pos, this.pos);
		} else {
			this.acc = p5.Vector.sub(this.pos, player.pos);			
		}
		this.acc.setMag(this.accMax);
		this.speed.add(p5.Vector.mult(this.acc, t)).limit(this.speedMax);
		this.pos.add(p5.Vector.mult(this.speed, t));
	}

	show() {
		fill(90,70,200,75);
		stroke(100,100,200,75);
		ellipse(this.pos.x, this.pos.y, this.radius * 2 + random(-0.2 * this.radius, 0.2 * this.radius), this.radius * 2+ random(-0.2 * this.radius, 0.2 * this.radius));
		noStroke();
		fill(100,100,200,75);
		ellipse(this.pos.x + 0.5 * this.radius, this.pos.y + 0.5 * this.radius, random(0.2 * this.radius,0.5 * this.radius), random(0.2 * this.radius,0.5 * this.radius));
	}
}