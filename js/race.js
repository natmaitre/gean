var track = null;
var numbers = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT'];
var Race = function () {
  this.state = 0;
  this.countdownNumber = 3;
  this.lastTime = 0;
  this.carCount = 1;
  this.zIsDown = false;
  this.xIsDown = false;
  this.raceNumber = 0;
}
var STATE_PRERACE = 0;
var STATE_COUNTDOWN = 1;
var STATE_RACING = 4;
var STATE_RACEOVER = 5;
Race.COUNTDOWN_INTERVAL = 800;

Race.prototype = {
  init: function () {},
  start: function (trackNumber) {
    raceAudioEngineSpeed(0);   
    this.raceNumber = trackNumber;
    track = new Track();
    track.buildTrack(this.raceNumber)
    this.carCount = track.getCarCount();
    this.resetCars();
    player = cars[0];
    player.initSlipstreamLines();
    this.state = STATE_PRERACE;
    this.countdownNumber = 4;
    this.lastTime = getTimestamp();
  },
  raceOver: function () {
    this.state = STATE_RACEOVER;
  },
  keyDown: function (e) {
    if (this.state !== STATE_RACEOVER) {
      switch (e.keyCode) {
        case 90:
          this.zIsDown = true;
          player.setDrift(true);
          break;
        case 88:
          this.xIsDown = true;
          player.setTurbo(true);
          break;
        case 38:
          player.setAccelerate(true);
          break;
        case 40:
          player.setBrake(true);
          break;
        case 37:
          player.setTurnLeft(true);
          break;
        case 39:
          player.setTurnRight(true);
          break;
      }
    }
  },
  keyUp: function (e) {
    if (this.state != STATE_RACEOVER) {
      switch (e.keyCode) {
        case 90:
          this.zIsDown = false;
          player.setDrift(false);
          break;
        case 88:
          this.xIsDown = false;
          player.setTurbo(false);
          break;
        case 38:
          player.setAccelerate(false);
          break;
        case 40:
          player.setBrake(false);
          break;
        case 37:
          player.setTurnLeft(false);
          break;
        case 39:
          player.setTurnRight(false);
          break;
      }
    } else {
      if (e.keyCode == 90) {
        if (!this.zIsDown) {
          this.start(this.raceNumber);
        }
        this.zIsDown = false;
      }
      if (e.keyCode == 88) {
        if (!this.xIsDown) {
          if (cars[0].finishPosition == '1st') this.start(this.raceNumber + 1);
        }
        this.xIsDown = false;
      }
    }
  },
  customCar: function(car) {
    if (CARS && CARS[0] && 'settings' in CARS[0]) {
      car.maxSpeed = CARS[0].settings.maxSpeed;
      car.maxTurboSpeed = CARS[0].settings.maxTurboSpeed;
      car.accel = CARS[0].settings.accel;
      car.breaking = CARS[0].settings.breaking;
      car.decel = CARS[0].settings.decel;
    }
  },
  resetCars: function () {
    cars = [];
    var n, car, segment, z;
    for (var n = 0; n < this.carCount; n++) {
      z = track.getLength() - (this.carCount - n) * Track.segmentLength * 13;
      segment = track.findSegment(z);
      var trackLeft = segment.p1.world.x;
      var trackRight = segment.p2.world.x;
      car = new Car(n);
      if (n == 0) {
        this.customCar(car)
      } 
      var x = 0;
      if (n % 2) x = trackLeft / 2;
      else x = trackRight / 2 - car.width;
      car.index = n;
      car.x = x;
      car.z = z;
      car.speed = 0;
      car.percent = utilPercentRemaining(car.z, Track.segmentLength);
      if (car.index !== 0) {
        var maxSpeed = 23000;
        if (car.index < 8 && car.index > 3) car.maxSpeed = maxSpeed * 0.905 - Math.random() * (this.carCount - n - 1) * maxSpeed / 55;
        else if (car.index > 12) car.maxSpeed = maxSpeed * 0.905 - (this.carCount - n - 1) * maxSpeed / 65;
        else car.maxSpeed = maxSpeed * 0.905 - (this.carCount - n - 1) * maxSpeed / 45;
        car.accel = maxSpeed / 2;
        if (car.index < 4) car.takeCornerOnInside = false;
        else if (car.index < 8) {
          car.takeCornerOnInside = Math.random() > 0.4;
          car.slowOnCorners = Math.random() > 0.6;
        }
      }
      segment.cars.push(car);
      cars.push(car);
    }
  },
  updatePrerace: function (dt) {
    var time = getTimestamp();
    if (time - this.lastTime > Race.COUNTDOWN_INTERVAL) {
      this.lastTime = getTimestamp();
      this.countdownNumber--;
      if (this.countdownNumber <= 0) {
        this.state = STATE_COUNTDOWN;
        this.countdownNumber = 3;
        raceAudioTone(220, 1 / 4);
      }
    }
    camera.update(dt);
  },
  updateCountdown: function (dt) {
    var time = getTimestamp();
    if (time - this.lastTime > Race.COUNTDOWN_INTERVAL) {
      this.lastTime = getTimestamp();
      this.countdownNumber--;
      if (this.countdownNumber <= 0) {
        raceAudioTone(440, 1 / 2);
        this.state = STATE_RACING;
      } else {
        raceAudioTone(220, 1 / 4);
      }
    }
    camera.update(dt);
  },
  updateRace: function (dt) {
    var playerSegment = track.findSegment(player.z);
    var startPosition = camera.z;
    for (var i = 0; i < cars.length; i++) {
      cars[i].update(dt);
    }
    camera.update(dt);
    bgLayer3Offset = utilIncrease(bgLayer3Offset, bgLayer3Speed * playerSegment.curve * (camera.z - startPosition) / Track.segmentLength, 1);
    bgLayer2Offset = utilIncrease(bgLayer2Offset, bgLayer2Speed * playerSegment.curve * (camera.z - startPosition) / Track.segmentLength, 1);
    bgLayer1Offset = utilIncrease(bgLayer1Offset, bgLayer1Speed * playerSegment.curve * (camera.z - startPosition) / Track.segmentLength, 1);
  },
  updateRaceOver: function () {
  },
  update: function (dt) {
    if (this.state == STATE_PRERACE) this.updatePrerace(dt);
    else if (this.state == STATE_COUNTDOWN) this.updateCountdown(dt);
    else if (this.state == STATE_COUNTDOWN || this.state == STATE_RACING) this.updateRace(dt);
  },
  render: function () {
    renderRender();
    if (this.state == STATE_PRERACE) {
      raceAudioStart();
      context.font = 'italic bold ' + window.innerHeight / 5 + 'px "Helvetica Neue", Helvetica, Arial, sans-serif';
      if (this.countdownNumber < 4) {
        cntx.fillStyle = DARKGREY;
        context.fillText("RACE", window.innerWidth / 2, window.innerHeight / 4 + 4);
        cntx.fillStyle = LIGHTGREY;
        context.fillText("RACE", window.innerWidth / 2, window.innerHeight / 4);
      }
      if (this.countdownNumber < 3) {
        cntx.fillStyle = DARKGREY;
        context.fillText(numbers[this.raceNumber], window.innerWidth / 2, window.innerHeight / 4 * 2 + 4);
        cntx.fillStyle = LIGHTGREY;
        context.fillText(numbers[this.raceNumber], window.innerWidth / 2, window.innerHeight / 4 * 2);
      }
    }
    if (this.state == STATE_COUNTDOWN) {
      context.fillStyle = '#111111';
      context.fillText(this.countdownNumber, window.innerWidth / 2, 254);
      context.fillStyle = LIGHTGREY;
      context.fillText(this.countdownNumber, window.innerWidth / 2, 250);
    }
    if (this.state == STATE_RACING) {

      gamepads = navigator.getGamepads();
      for (const gamepad of gamepads) {
        if (!gamepad) {
          continue;
        }
        if(gamepad.buttons[0].pressed === true) {
          player.setAccelerate(true);
        } else player.setAccelerate(false);
        if(gamepad.buttons[1].pressed === true) {
          player.setBrake(true);
        } else player.setBrake(false);
        if(gamepad.buttons[9].pressed === true) {
          player.setTurbo(true);
        } else player.setTurbo(false);
        if (parseInt(gamepad.axes[6]) === 1) {
          player.setTurnRight(true);
        } else player.setTurnRight(false);
        if (parseInt(gamepad.axes[6]) === -1) {
          player.setTurnLeft(true);
        } else player.setTurnLeft(false);
      }


      cntx.fillStyle = LIGHTGREY;
      cntx.strokeStyle = LIGHTGREY;
      context.font = ' 80px "Helvetica Neue", Helvetica, Arial, sans-serif';
      context.fillText(player.getPosition(), 100, 80);
      context.font = ' 40px "Helvetica Neue", Helvetica, Arial, sans-serif';
      context.fillText("Lap " + player.getLap() + " of 2", 100, 130);
      context.fillText("Lap Time: " + player.getCurrentLapTime().toFixed(2), 150, 180);
      context.font = ' 80px "Helvetica Neue", Helvetica, Arial, sans-serif';
      var speed = ("000" + Math.round(player.getSpeed() / 100).toString(10)).substr(-3);
      context.fillText(speed + "km/h", window.innerWidth * 4 / 5, 80);
      context.font = ' 40px "Helvetica Neue", Helvetica, Arial, sans-serif';
      context.fillText("Turbo ", window.innerWidth * 4 / 5 - 100, 136);
      context.fillText("Health ", window.innerWidth * 4 / 5 - 100, 186);
      cntx.beginPath();
      context.rect(window.innerWidth * 4 / 5 - 4, 110, 208, 28);
      context.rect(window.innerWidth * 4 / 5 - 4, 160, 208, 28);
      cntx.stroke();
      cntx.fillRect(window.innerWidth * 4 / 5, 114, player.turboAmount * 2, 20);
      cntx.fillRect(window.innerWidth * 4 / 5, 164, player.healthAmount * 2, 20);
      if (cars[0].newPositionTime > 0) {
        context.font = ' 60px "Helvetica Neue", Helvetica, Arial, sans-serif';
        cntx.fillStyle = LIGHTGREY;
        context.fillText(cars[0].getPosition(), window.innerWidth / 2, window.innerHeight / 3);
      }
    }
    if (this.state == STATE_RACEOVER) {
      raceAudioEnd()
      context.font = ' 300px "Helvetica Neue", Helvetica, Arial, sans-serif';
      cntx.fillStyle = LIGHTGREY;
      context.fillText(cars[0].finishPosition, 300, 290);
      context.font = ' 40px "Helvetica Neue", Helvetica, Arial, sans-serif';
      var y = 380;
      if (cars[0].finishPosition == '1st') {
        context.fillText("x: Next Race", 397, y);
        y += 80;
      }
      context.fillText("z: Retry", 445, y);
    }
  }
}