var Car = function () {
  var t = this;
  t.sprite = 0;
  t.index = 0;
  t.width = 500;
  t.height = 0;
  t.x = 0;
  t.y = 0;
  t.lastY = false;
  t.yOffset = 0;
  t.z = 0;
  t.lap = 0;
  t.lapStarted = false;
  t.position = 0;
  t.centrifugal = 0.3;
  t.slipstreamLines = [];
  t.slipstreamLengths = false;
  t.slipstream = 0;
  t.slipstreamTime = 0;
  t.percent = 0;
  t.speed = 0;
  t.ySpeed = 0;
  t.turboStartTime = 0;
  t.accelerate = t.brake = t.turnLeft = t.turnRight = t.turbo = t.turboRequest = t.driftRequest = false;
  t.driftAmount = 0;
  t.driftDirection = 0;
  t.turboAmount = 100;
  t.healthAmount = 100;
  t.lapStarted = false;
  t.centrifugal = 0.3;
  t.maxSpeed = 26000;
  t.maxTurboSpeed = 28000;
  t.speedPercent = 0;
  t.accel = 6800;
  t.breaking = -16000;
  t.decel = -8000;
  t.currentLapTime = 0;
  t.lastLapTime = null;
  t.position = 0;
  t.turnSpeed = 3000;
  t.slowOnCorners = false;
  t.takeCornerOnInside = false;
  t.bounce = 1.5;
  t.finishPosition = 0;
}

Car.prototype = {
  doaccelerate: function (v, accel, dt) {
    return v + (accel * dt);
  },
  initSlipstreamLines: function () {
    this.slipstreamLines = [];
    var carHeight = 400;
    var centreZ = this.z + 500;
    var smallRadius = carHeight - 40;
    var lineLength = 700;
    var i, j;
    var segments = 20;
    var angle = 0.0;
    if (this.slipstreamLengths === false) {
      this.slipstreamLengths = [];
      for (i = 0; i < segments; i++) {
        this.slipstreamLengths.push(Math.random());
      }
    }
    for (i = 0; i < segments; i++) {
      this.slipstreamLengths[i] += 0.03;
      if (this.slipstreamLengths[i] >= 0.8) this.slipstreamLengths[i] = 0;
      var largeRadius = carHeight + 60;
      if (angle > Math.PI / 6 && angle < Math.PI / 2) largeRadius = carHeight + 60 + (angle - Math.PI / 6) * 128;
      if (angle >= Math.PI / 2 && angle < (5 * Math.PI / 6)) largeRadius = carHeight + 60 + (5 * Math.PI / 6 - angle) * 128;
      var x1 = this.x + this.width / 2 + smallRadius * Math.cos(angle - 0.05);
      var y1 = this.y + smallRadius * Math.sin(angle - 0.02);
      var x2 = this.x + this.width / 2 + smallRadius * Math.cos(angle + 0.05);
      var y2 = this.y + smallRadius * Math.sin(angle + 0.02);
      var x3 = this.x + this.width / 2 + largeRadius * Math.cos(angle - 0.05);
      var y3 = this.y + largeRadius * Math.sin(angle - 0.05);
      var x4 = this.x + this.width / 2 + largeRadius * Math.cos(angle + 0.05);
      var y4 = this.y + largeRadius * Math.sin(angle + 0.05);
      var x1a = x1 + (x3 - x1) * this.slipstreamLengths[i];
      var x2a = x2 + (x4 - x2) * this.slipstreamLengths[i];
      var y1a = y1 + (y3 - y1) * this.slipstreamLengths[i];
      var y2a = y2 + (y4 - y2) * this.slipstreamLengths[i];
      var x3a = x1 + (x3 - x1) * (this.slipstreamLengths[i] + 0.4);
      var x4a = x2 + (x4 - x2) * (this.slipstreamLengths[i] + 0.4);
      var y3a = y1 + (y3 - y1) * (this.slipstreamLengths[i] + 0.4);
      var y4a = y2 + (y4 - y2) * (this.slipstreamLengths[i] + 0.4);
      var za = centreZ - lineLength * this.slipstreamLengths[i];
      var z2a = centreZ - lineLength * (this.slipstreamLengths[i] + 0.4);
      var line = [];
      line.push({
        world: {
          x: x1a,
          y: y1a,
          z: za
        },
        camera: {},
        screen: {}
      });
      line.push({
        world: {
          x: x2a,
          y: y2a,
          z: za
        },
        camera: {},
        screen: {}
      });
      line.push({
        world: {
          x: x4a,
          y: y4a,
          z: z2a,
        },
        camera: {},
        screen: {}
      });
      line.push({
        world: {
          x: x3a,
          y: y3a,
          z: z2a,
        },
        camera: {},
        screen: {}
      });
      this.slipstreamLines.push(line);
      angle += Math.PI / segments;
    }
    for (i = 0; i < this.slipstreamLines.length; i++) {
      var points = this.slipstreamLines[i];
      for (j = 0; j < points.length; j++) {
        camera.project(points[j], 0, 0, width, height);
      }
    }
  },
  limit: function (value, min, max) {
    return Math.max(min, Math.min(value, max));
  },
  overlap: function (x1, w1, x2, w2, percent) {
    var min1 = x1 - (percent - 1) * w1 / 2;
    var max1 = x1 + (w1) * percent;
    var min2 = x2 - (percent - 1) * w2 / 2;
    var max2 = x2 + (w2) * percent;
    return !((max1 < min2) || (min1 > max2));
  },
  setTurnLeft: function (turn) {
    this.turnLeft = turn;
  },
  setTurnRight: function (turn) {
    this.turnRight = turn;
  },
  setAccelerate: function (accelerate) {
    this.accelerate = accelerate;
  },
  setBrake: function (brake) {
    this.brake = brake;
  },
  setTurbo: function (turbo) {
    this.turboRequest = turbo;
  },
  setDrift: function (drift) {
    this.driftRequest = drift;
  },
  setHealth: function(h) {
    var crashTime = getTimestamp();
    if(crashTime - lastCrashTime < 1000) {
      return;
    }
    this.healthAmount = Math.max(0, this.healthAmount - h);
  },
  getCurrentLapTime: function () {
    return this.currentLapTime;
  },
  getLap: function () {
    if (this.lap < 1) return 1;
    return this.lap;
  },
  getPosition: function () {
    var i = this.position,
      j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) return i + "st";
    if (j == 2 && k != 12) return i + "nd";
    if (j == 3 && k != 13) return i + "rd";
    return i + "th";
  },
  getSpeed: function () {
    return this.speed;
  },
  update: function (dt) {
    var maxSpeed = this.maxSpeed;
    this.speedPercent = this.speed / this.maxSpeed;
    var currentSegment = track.findSegment(this.z);
    var playerSegment = track.findSegment(cars[0].z);
    var speedPercent = this.speedPercent;
    this.percent = utilPercentRemaining(this.z, Track.segmentLength);
    var dx = dt * this.turnSpeed * speedPercent;
    var trackLeft = currentSegment.p1.world.x;
    var trackRight = currentSegment.p2.world.x;
    var carLeftSide = this.x;
    var carRightSide = this.x + this.width;
    var distanceToLeft = carLeftSide - trackLeft;
    var distanceToRight = trackRight - carRightSide;
    var trackWidth = trackRight - trackLeft;
    var extraSpeed = 1;
    if (currentSegment.curve < 0 && distanceToLeft > 0) {
      if (this.index == 0) extraSpeed = 1 + (trackWidth - this.width - distanceToLeft) * (-currentSegment.curve) / (trackWidth * 80);
    } else if (currentSegment.curve > 0 && distanceToRight > 0) {
      if (this.index == 0) extraSpeed = 1 + (trackWidth - this.width - distanceToRight) * (currentSegment.curve) / (trackWidth * 80);
    }
    if (extraSpeed < 1) extraSpeed = 1;
    var mult = 0.8;
    var accMult = 1;
    if (this.slipstreamTime > 0) mult += 0.4;
    if (this.driftRequest) {
      if (this.speed > 8000) {
        if (!this.drift && !this.accelerate) {
          this.driftAmount = 1.2;
          this.drift = true;
        }
      } else {
        mult -= 0.5;
        this.drift = false;
      }
    } else {
      this.drift = false;
    }
    if (this.driftAmount > 0 && this.speed > 8000) {
      this.driftAmount -= dt;
      mult -= 0.04;
      if (this.driftDirection == 0) {
        if (this.turnLeft) this.driftDirection = -1;
        if (this.turnRight) this.driftDirection = 1;
      }
    } else {
      this.drift = false;
      this.driftAmount = 0;
      this.driftDirection = 0
    }
    var turboOn = this.turbo;
    if (this.turboRequest) this.turbo = this.turboAmount > 0 && this.speed > 8000 && this.accelerate;
    else this.turbo = false;
    if (this.turbo) {
      accMult = 1.2;
      maxSpeed = this.maxTurboSpeed;
    }
    this.bounce = 3.4;
    if (distanceToLeft < -this.width * 0.1 || distanceToRight < -this.width * 0.1) {
      if (distanceToLeft + this.width * 0.1 < -playerSegment.kerbWidth ||
        distanceToRight + this.width * 0.1 < -playerSegment.kerbWidth) {
        this.bounce = 9.5;
        mult -= 0.6;
        accMult -= 0.2;
      } else {
        mult -= 0.1;
        this.bounce = 6;
      }
    }
    this.bounce = (this.bounce * Math.random() * speedPercent);
    if (this.index == 0 && race.state != STATE_RACEOVER) {
      this.x = this.x - (dx * speedPercent * playerSegment.curve * this.centrifugal);
      if (this.driftDirection != 0) dx = dx * 0.5;
      if (this.turnLeft) this.x = this.x - dx;
      else if (this.turnRight) this.x = this.x + dx;
      var ddrift = this.driftDirection * this.speed * 0.00055;
      this.x += ddrift;
      this.z = utilIncrease(this.z, dt * this.speed * extraSpeed, track.getLength());
      this.y = utilInterpolate(currentSegment.p1.world.y, currentSegment.p3.world.y, this.percent);

      this.yOffset = 0;

      if (this.accelerate) {
        if (this.turbo) {
          var time = getTimestamp();
          if (!turboOn) this.turboStartTime = time;
          this.turboAmount -= dt * 2.45;
          raceAudioSetTurboTime(time - this.turboStartTime);
        }
        if (this.speed < maxSpeed * mult) this.speed = this.doaccelerate(this.speed, this.accel * accMult, dt);
        else {
          this.speed = this.doaccelerate(this.speed, this.decel, dt);
          if (this.speed < maxSpeed * mult) this.speed = maxSpeed * mult;
        }
      } else if (this.brake) this.speed = this.doaccelerate(this.speed, this.breaking, dt);
      else this.speed = this.doaccelerate(this.speed, this.decel, dt);
      for (var n = 0; n < playerSegment.sprites.length; n++) {
        var sprite = playerSegment.sprites[n];
        var spriteW = sprite.s * sprite.source.cw;
        var spriteX = sprite.x + sprite.source.cx * sprite.s;
        var carX = this.x;
        if (this.overlap(carX, this.width, spriteX, spriteW, 1)) {
          if (this.index == 0) {
            this.setHealth(10);
            raceAudioCrash();
            this.slipstream = 0;
            this.slipstreamTime = 0;
          }
          this.speed = maxSpeed / 5;
          this.z = utilIncrease(playerSegment.p1.world.z, 0, track.getLength()); // stop in front of sprite (at front of segment)
          break;
        }
      }
      var isBehind = false;
      for (var i = 0; i < cars.length; i++) {
        var distance = cars[i].z - player.z;
        if (player.z > track.getLength() - 1200) distance -= track.getLength();
        if (distance > 0 && distance < 1800) {
          var offCentre = (player.x - cars[i].x) / cars[i].width;
          if (offCentre < 0) offCentre = -offCentre;
          if (offCentre < 0.4) isBehind = true;
        }
      }
      if (isBehind && this.speed > 8000) {
        this.slipstream += dt * 1;
        if (this.slipstream > 0.14) this.slipstreamTime = 2;
      } else {
        this.slipstream = 0;
      }
      if (this.slipstreamTime > 0) this.slipstreamTime -= dt;
    } else {
      if (this.speed < maxSpeed) this.speed = this.doaccelerate(this.speed, this.accel, dt);
      var turnDir = this.updateCarPosition(currentSegment, playerSegment, player.width);
      var newX = this.x + turnDir * dx;
      if (currentSegment.curve == 0) {
        this.turnLeft = turnDir == -1;
        this.turnRight = turnDir == 1;
      } else {
        this.turnLeft = currentSegment.curve < -0.5;
        this.turnRight = currentSegment.curve > 0.5;
      }
      if (newX + this.width < trackRight * 0.6 && newX > trackLeft * 0.8) this.x = newX;
      this.z = utilIncrease(this.z, dt * this.speed, track.getLength());
    }
    this.percent = utilPercentRemaining(this.z, Track.segmentLength); 
    var newSegment = track.findSegment(this.z);
    if (this.index === 0) {
      for (n = 0; n < newSegment.cars.length; n++) {
        var car = newSegment.cars[n];
        if (car.index != this.index) {
          if (this.speed > car.speed) {
            if (this.overlap(this.x, this.width,
                car.x, car.width, 1)) {
              if (this.index !== 0) {
                this.speed = car.speed / 2;
                if (car.index !== 0) {
                  car.speed = car.speed * 1.2;
                }
              } else {
                if (this.index == 0) {
                  this.setHealth(10);
                  raceAudioCrash();
                  this.slipstream = 0;
                  this.slipstreamTime = 0;
                }
                this.speed = car.speed;
                this.z = car.z - 100;
              }
              break;
            }
          }
        }
      }
    }
    if (this.x + this.width / 2 < trackLeft - 1.2 * this.width) this.x = trackLeft - 1.2 * this.width - this.width / 2;
    if (this.x + this.width / 2 > trackRight + 1.2 * this.width) this.x = trackRight + 1.2 * this.width - this.width / 2;
    this.speed = this.limit(this.speed, 0, maxSpeed);
    if (this.index == 0) raceAudioEngineSpeed(this.speedPercent);
    if (currentSegment != newSegment) {
      var index = currentSegment.cars.indexOf(this);
      currentSegment.cars.splice(index, 1);
      newSegment.cars.push(this);
    }
    if (this.z < Track.segmentLength * 1.2 && !this.lapStarted) {
      this.lap++;
      this.lapStarted = true;
      this.lastLapTime = this.currentLapTime;
      this.currentLapTime = 0;
    } else {
      if (this.z > Track.segmentLength * 1.2) this.lapStarted = false;
      this.currentLapTime += dt;
    }
    var currentPosition = this.position;
    this.position = 1;
    for (var i = 0; i < cars.length; i++) {
      if (i != this.index) {
        if (cars[i].lap > this.lap) {
          this.position++;
        } else if (cars[i].lap === this.lap) {
          if (cars[i].z > this.z) {
            this.position++;
          }
        }
      }
    }
    if (this.index == 0) {
      if (this.newPositionTime > 0) this.newPositionTime -= dt;
      if (this.position !== currentPosition) {
        this.newPosition = this.getPosition();
        this.newPositionTime = 1;
      }
    }
    if (this.index === 0 && this.lap > track.lap && race.state != STATE_RACEOVER) {
      this.finishPosition = this.getPosition();
      this.turbo = false;
      this.slipstream = 0;
      this.slipstreamTime = 0;
      race.raceOver();
    }
  },
  /*
  workOutPosition: function() {
    // work out position
    this.position = 0;
    for(var i = 0; i < cars.length; i++) {
      if(cars[i].lap > this.lap) {
        this.position++;
      } else if(cars[i].lap === this.lap) {
        if(cars[i].z > this.z) {
          this.position++;
        }
      }
    }
  },
  */

  updateCarPosition: function (carSegment, playerSegment, playerWidth) {
    var lookAhead = 60;
    var segment = null;
    var trackSegments = track.getSegmentCount();
    for (var i = 1; i < lookAhead; i++) {
      segment = track.getSegment((carSegment.index + i) % trackSegments);
      var trackLeft = segment.p1.world.x;
      var trackRight = segment.p2.world.x;
      var dir = 0;
      if (i < 8) {
        /*
        if ((segment === playerSegment) 
        && (this.speed > player.speed) 
        && (this.overlap(otherCarLeft, otherCarWidth, this.x, this.width, 1.2))) {
        */
        for (n = 0; n < segment.cars.length; n++) {
          var otherCar = segment.cars[n];
          var otherCarLeft = otherCar.x;
          var otherCarWidth = otherCar.width;
          var otherCarRight = otherCar.x + otherCar.width;
          if (trackRight - otherCarRight < this.width * 1.4) {
            dir = -1;
          } else if (otherCarLeft - trackLeft < this.width * 1.4) {
            dir = 1;
          } else {
            if (otherCarLeft - trackLeft > trackRight - otherCarRight) {
              dir = -1;
            } else {
              dir = 1;
            }
          }
          return dir * 3 / i;
        }
      }
    }
    if (this.takeCornerOnInside) {
      for (var i = 1; i < lookAhead; i++) {
        segment = track.getSegment((carSegment.index + i) % trackSegments);
        var trackLeft = segment.p1.world.x;
        var trackRight = segment.p2.world.x;
        if (segment.curve > 0) {
          if (i < 5) return 1 / (5);
          return 2 / i;
        }
        if (segment.curve < 0) {
          if (i < 5) return -1 / (5);
          return 2 / i;
        }
      }
    }
    return 0;
  }
}