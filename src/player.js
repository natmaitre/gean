var player = {
	x:0,
	y:0,
	z:0,
	vx:0,
	vy:0,
	vz:0,
	speed:22,
	startSpeed:22,
	maxSpeed:65,
	difficulty:1,
	
	startingAltitude:55,
	maxAltitude:575,
	minAltitude:130,
	leftBound: -1300,
	rightBound: 1300,
	flipSpeed:3,
	flipRollSpeed:0.17453292519943295769236907684886,
	flipCharge:0,
	flipRotation:0,
	boostSpeed:5,
	rotation:0,
	maxRotation:1,
	health:3,
	
	turnSpeed:1.2,
	maxTurnSpeed:12,
	finalTurnSpeed:2.4,
	startTurnSpeed:1.2,
	startMaxTurnSpeed:12,
	finalMaxTurnSpeed:16,
	
	liftSpeed:0.75,
	maxLiftSpeed:7,
	finalLiftSpeed:7.75,
	startLiftSpeed:0.75,
	startMaxLiftSpeed:7,
	finalMaxLiftSpeed:7.223,
	
	drift:0.96,
	boosting:false,
	braking:false,
	flipping:false,
	flipDirection:"",
	lastFlipDirection:"",
	inverted:false,
	dead:false,
	
	
	init : function() {
		this.x = 30;
		this.y = this.startingAltitude;
		this.z = 0;
		
		this.reset();
	},
	
	reset : function () {
		this.vz = this.startSpeed;
		this.dead = false;
		this.turnSpeed = this.startTurnSpeed;
		this.maxTurnSpeed= this.startMaxTurnSpeed;
		this.liftSpeed = this.startLiftSpeed;
		this.maxLiftSpeed = this.startMaxLiftSpeed;
		this.difficulty = 1;
		this.health =3;
	},
	
	increaseDifficulty: function () {
		this.difficulty++;
		this.vz += 3;
		if (this.vz > this.maxSpeed) this.vz = this.maxSpeed;
		
		if(this.difficulty <= 9) {
			var up = 0.1;
			var maxUp = 0.3;
			
			this.turnSpeed += up;
			this.maxTurnSpeed += maxUp;
			
			this.liftSpeed += up * 0.625;
			this.maxLiftSpeed += maxUp * 0.583;
		}
	},
	
	
	turnLeft : function() {
		this.vx -= this.turnSpeed;
		if (this.vx < -this.maxTurnSpeed*2) this.vx = -this.maxTurnSpeed*2;
	},
	
	turnRight : function() {
		this.vx += this.turnSpeed;
		if (this.vx > this.maxTurnSpeed*2) this.vx = this.maxTurnSpeed*2;
	},
	moveUp:function () {
		this.vy += this.liftSpeed;
		if (this.vy > this.maxLiftSpeed) this.vy = this.maxLiftSpeed;
	},
	
	moveDown:function() {
		this.vy -= this.liftSpeed;
		if (this.vy < -this.maxLiftSpeed) this.vy = -this.maxLiftSpeed;
	},
	
	boost : function() {
		if(!this.boosting) {
			this.boosting = true;
			this.vz = this.speed + this.boostSpeed;
		}
	},
	
	stopBoosting:function() {
		if(this.boosting) {
			this.boosting = false;
			this.vz = this.speed;
		}
	},
	
	brake : function() {
		if (!this.braking) {
			this.braking = true;
			this.vz = this.speed / 2;
		}
	},
	
	stopBraking: function() {
		if (this.braking) {
			this.braking = false;
			this.vz = this.speed;
		}
		
	},
	
	applyDrift : function() {
		this.vx *= this.drift;
		if (Math.abs(this.vx) < .01) this.vx = 0;
		
		this.vy *= this.drift;
		if (Math.abs(this.vy) < .01) this.vy = 0;
	},
	
	applyRoll : function() {
		if (this.flipping) {
			if (this.flipDirection == "left") {
				if(!this.inverted) {
					
					if (this.flipRotation < Math.PI*2 && this.flipRotation >= Math.PI) {
						this.flipRotation += this.flipRollSpeed;
						if (this.flipRotation > Math.PI*2) this.flipRotation = 0;
					} 
					
				} else {
					if (this.flipRotation < Math.PI) {
						this.flipRotation += this.flipRollSpeed;
						if (this.flipRotation > Math.PI) this.flipRotation = Math.PI;
					} 
				}
			}	
			else if (this.flipDirection == "right") {
				
				if(!this.inverted) {
					
					if (this.flipRotation > -Math.PI*2 && this.flipRotation <= -Math.PI) {
						this.flipRotation -= this.flipRollSpeed;
						if (this.flipRotation <= -Math.PI*2) this.flipRotation = 0;
					} 
					
				} else {
					if (this.flipRotation > -Math.PI) {
						this.flipRotation -= this.flipRollSpeed;
						if (this.flipRotation < -Math.PI) this.flipRotation = -Math.PI;
					} 
				}
			}
			/*
			if (this.flipRotation < Math.PI) {
				this.flipRotation += this.flipRollSpeed;
				if (this.flipRotation > Math.PI) this.flipRotation = Math.PI;
			} 
			/*else if (this.flipDirection == "left" && this.rotation != -Math.PI) {
				this.rotation -= 0.2;
				if (this.rotation < -Math.PI) this.rotation = -Math.PI;
			}*/
		} 
		var turnAngle = this.vx * 0.03;
		if (this.inverted) turnAngle *= -1;
		
		this.rotation = turnAngle + this.flipRotation;
		//if (this.rotation < -this.maxRotation) this.rotation = -this.maxRotation;
		//else if (this.rotation > this.maxRotation) this.rotation = this.maxRotation;
	
		
		/*
		if (this.inverted && ! this.flipping) {
			this.rotation += Math.PI;
		}*/
		
	},
	
	flip : function(direction) {
		if (this.flipCharge >= 100) {
			this.lastFlipDirection = this.flipDirection;
			this.flipDirection = direction;
			
			if (this.lastFlipDirection != '' && this.lastFlipDirection != this.flipDirection) {
				this.flipRotation *= -1;
			}
			this.flipping = true;
			this.flipCharge = 0;
			if(this.y > 0) {
				this.vy = -this.flipSpeed;
				this.inverted = true;
			} else if (this.y < 0) {
				this.vy = this.flipSpeed;
				this.inverted = false;
			}
			return true;
		}
		else return false;
		/*
		if (this.vx > 0 ) {
			this.vx = this.flipSpeed * 2;
		}
		*/
		
	},
	
	stopFlipping:function () {
		this.flipping = false;
		this.vy = 0;
		if (this.y < 0) this.y = -this.startingAltitude;
		else this.y = this.startingAltitude;
	},
	
	update : function () {
		this.applyDrift();
		this.applyRoll();
		this.x += this.vx;
		this.y += this.vy;
		if (this.y > this.maxAltitude) this.y = this.maxAltitude;
		else if (this.y < this.minAltitude) this.y = this.minAltitude;
		if (this.x > this.rightBound) this.x = this.rightBound;
		else if (this.x < this.leftBound) this.x = this.leftBound;
		if(this.flipping) {
			//this.rotation += this.flipRollSpeed;
			if ( (this.vy < 0 && this.y < -this.startingAltitude) || (this.vy > 0 && this.y > this.startingAltitude)) {
				this.stopFlipping();
			}
		} else {
			if (this.flipCharge < 100) {
				this.flipCharge ++;
			}
		}
		this.z -= this.vz;
	},

	crash: function () {
		console.log('i am now a dead pilot');
		//this.speed = 0;
		this.boostSpeed = 0;
		this.vx = this.vy = 0;
		//this.turnSpeed = 0;
		this.dead = true;
	}
}
