var COLORS_KERBLIGHT = '#a02222';
var COLORS_KERBDARK = '#BBBBBB';
var COLORS_LANDLIGHT = '#000000';
var COLORS_LANDDARK = '#000000';
var COLORS_ROAD = '#000000';
var TRACK = [];

var Track = function () {
  this.trackId = 0;
  this.trackLength = 0;
  this.currentAngle = 0;
  this.segments = [];
  this.lap = 0;
  this.map = null;
}

var laneWidth = 1200;
Track.segmentLength = 300;
var lanes = 1;

Track.prototype = {
  buildTrack0: function () {
    COLORS_FOG = 0;
    this.segments = [];
    this.addStraight(200);
    this.calculateLength();
  },
  createStreetLights: function () {
    var segmentCount = this.getSegmentCount();
    for (var i = 0; i < segmentCount; i++) {
      var segment = this.segments[i];
      if (i % 20 == 0) {
        var x = segment.p1.world.x;
        segment.sprites.push({
          source: SPRITES_STREETLIGHTLEFT,
          s: 12,
          x: x - 12 * SPRITES_STREETLIGHTLEFT.w + 700
        });
        var x = segment.p2.world.x;
        segment.sprites.push({
          source: SPRITES_STREETLIGHTRIGHT,
          s: 12,
          x: x - 700
        });
      }
    }
  },
  createRoadsideObjects: function (objs, prob, scale, offset, turnSigns) {
    var segmentCount = this.getSegmentCount();
    var turnSegment = 0;
    for (var i = 0; i < segmentCount; i++) {
      var segment = this.segments[i];
      var r = Math.random();
      if (segment.curve != 0 && turnSigns) {
        if (turnSegment % 20 == 0) {
          if (segment.curve > 0) {
            var x = segment.p1.world.x;
            segment.sprites.push({
              source: SPRITES_TURNRIGHT,
              s: 3,
              x: x - 3 * SPRITES_TURNRIGHT.w - 400
            });
          } else {
            var x = segment.p2.world.x;
            segment.sprites.push({
              source: SPRITES_TURNLEFT,
              s: 3,
              x: x + 400
            });
          }
        }
        turnSegment++;
      } else {
        turnSegment = 0;
        var obj = objs[Math.floor(Math.random() * objs.length)];
        if (r > prob) {
          var x = segment.p1.world.x;
          segment.sprites.push({
            source: obj,
            s: scale,
            x: x - scale * obj.w / 2 - offset
          });
          var x = segment.p2.world.x;
          segment.sprites.push({
            source: obj,
            s: scale,
            x: x - scale * obj.w / 2 + offset
          });
        }
      }
    }
  },
  getCarCount: function () {
    return TRACK[this.trackId].carsType.length;
  },
  buildTrackFromJSON: function (trackID, t) {
    this.trackId = trackID;
    resetGraphics();
    COLORS_ROAD = TRACK[trackID].colors.road;
    COLORS_LANDLIGHT = TRACK[trackID].colors.landlight;
    COLORS_LANDDARK = TRACK[trackID].colors.landdark;
    COLORS_LANEMARKER = TRACK[trackID].colors.lanemarker;
    COLORS_FOG = TRACK[trackID].colors.fog;
    if (TRACK[trackID].cars === true) createCars(TRACK[trackID].carsType);
    this.lap = TRACK[trackID].lap;
    for (let s in TRACK[trackID].side) {
      if (TRACK[trackID].side[s] === 'TURNARROWS') createTurnArrows();
      if (TRACK[trackID].side[s] === 'TREES') createTrees();
      if (TRACK[trackID].side[s] === 'FLOWERS') createFlowers();
      if (TRACK[trackID].side[s] === 'BUILDING_DAY') createBuildings(false);
      if (TRACK[trackID].side[s] === 'BUILDING_NIGHT') createBuildings(true);
      if (TRACK[trackID].side[s] === 'STREETLIGHT_DAY') createStreetlights(false);
      if (TRACK[trackID].side[s] === 'STREETLIGHT_NIGHT') createStreetlights(true);
    }
    for (let b in TRACK[trackID].background) {
      if (TRACK[trackID].background[b] === 'MOUNTAINS') createBackgroundMountains();
      if (TRACK[trackID].background[b] === 'TREES') createBackgroundTrees();
      if (TRACK[trackID].background[b] === 'BUILDING_DAY') createBackgroundBuildings(false);
      if (TRACK[trackID].background[b] === 'BUILDING_NIGHT') {
        createBackgroundBuildings(true);
        createNightSky();
      }
    }
    for (let r in TRACK[trackID].road) {
      let d = TRACK[trackID].road[r].data;
      if (TRACK[trackID].road[r].type === 'S') t.addStraight(d[0], d[1]);
      if (TRACK[trackID].road[r].type === 'EC90') t.addEasyCurve90(d[0], d[1]);
      if (TRACK[trackID].road[r].type === 'HC90') t.addHardCurve90(d[0], d[1]);
      if (TRACK[trackID].road[r].type === 'HC180') t.addHardCurve180(d[0], d[1]);
      if (TRACK[trackID].road[r].type === 'MC90') t.addMediumCurve90(d[0], d[1]);
      if (TRACK[trackID].road[r].type === 'EC30') t.addEasyCurve30(d[0], d[1]);
      if (TRACK[trackID].road[r].type === 'H') t.addHill(d[0], d[1]);
      if (TRACK[trackID].road[r].type === 'R') t.addRoad(d[0], d[1], d[2], d[3], d[4], d[5]);
    }
    t.calculateLength();
    t.drawMap();
    let SPRITES_OPTIONS = SPRITES_TREES;
    if (TRACK[trackID].sideOptions[0] === 'TREES') SPRITES_OPTIONS = SPRITES_TREES;
    if (TRACK[trackID].sideOptions[0] === 'FLOWERS') SPRITES_OPTIONS = [SPRITES_FLOWERS];
    if (['BUILDING_DAY', 'BUILDING_NIGHT'].includes(TRACK[trackID].sideOptions[0])) {
      SPRITES_OPTIONS = SPRITES_BUILDINGS;
      t.createStreetLights();
    }
    t.createRoadsideObjects(SPRITES_OPTIONS, TRACK[trackID].sideOptions[1], TRACK[trackID].sideOptions[2], TRACK[trackID].sideOptions[3], TRACK[trackID].sideOptions[4]);
  },
  buildTrack: function (id) {
    this.buildTrackFromJSON(id, this);
  },
  lastY: function () {
    return (this.segments.length == 0) ? 0 : this.segments[this.segments.length - 1].p3.world.y;
  },
  getSegment: function (index) {
    return this.segments[index];
  },
  getSegmentCount: function () {
    return this.segments.length;
  },
  getLength: function () {
    return this.trackLength;
  },
  calculateLength: function () {
    this.trackLength = track.segments.length * Track.segmentLength;
  },
  addSegment: function (curve, y) {
    var n = this.segments.length;
    var yFront = this.lastY();
    var yBack = y;
    var zFront = n * Track.segmentLength;
    var zBack = (n + 1) * Track.segmentLength;
    var xLeft = -laneWidth;
    var xRight = laneWidth;
    var kerbWidth = 0;
    if (curve != 0) {
      kerbWidth = curve * 40;
      if (kerbWidth < 0) kerbWidth = -kerbWidth;
      kerbWidth += 60;
    }
    this.segments.push({
      index: n,
      p1: {
        world: {
          x: xLeft,
          y: yFront,
          z: zFront
        },
        camera: {},
        screen: {}
      },
      p2: {
        world: {
          x: xRight,
          y: yFront,
          z: zFront
        },
        camera: {},
        screen: {}
      },
      p3: {
        world: {
          x: xRight,
          y: yBack,
          z: zBack
        },
        camera: {},
        screen: {}
      },
      p4: {
        world: {
          x: xLeft,
          y: yBack,
          z: zBack
        },
        camera: {},
        screen: {}
      },
      curve: curve,
      kerbWidth: kerbWidth,
      sprites: [],
      cars: []
    });
  },
  easeIn: function (a, b, percent) {
    return a + (b - a) * Math.pow(percent, 2);
  },
  easeOut: function (a, b, percent) {
    return a + (b - a) * (1 - Math.pow(1 - percent, 2));
  },
  easeInOut: function (a, b, percent) {
    return a + (b - a) * ((-Math.cos(percent * Math.PI) / 2) + 0.5);
  },
  addRoad: function (enter, hold, leave, curve, y, curveAngle) {
    var curveAngle = curveAngle || 0;
    var exitAngle = this.currentAngle + curveAngle;
    var startY = this.lastY();
    var endY = startY + (Math.floor(y) * Track.segmentLength);
    var n, total = enter + hold + leave;
    var segmentCurve = 0;
    var totalCurve = 0;
    var firstSegment = this.segments.length;
    for (n = 0; n < enter; n++) {
      segmentCurve = this.easeIn(0, curve, n / enter);
      totalCurve += segmentCurve;
      this.addSegment(segmentCurve, this.easeInOut(startY, endY, n / total));
    }
    for (n = 0; n < hold; n++) {
      segmentCurve = curve;
      totalCurve += segmentCurve;
      this.addSegment(curve, this.easeInOut(startY, endY, (enter + n) / total));
    }
    for (n = 0; n < leave; n++) {
      segmentCurve = this.easeInOut(curve, 0, n / leave);
      totalCurve += segmentCurve;
      this.addSegment(segmentCurve, this.easeInOut(startY, endY, (enter + hold + n) / total));
    }
    var anglePerCurve = 0;
    if (totalCurve != 0) {
      anglePerCurve = (exitAngle - this.currentAngle) / totalCurve;
    }
    for (var i = firstSegment; i < this.segments.length; i++) {
      this.currentAngle += this.segments[i].curve * anglePerCurve;
      this.segments[i].angle = this.currentAngle;
    }
    this.currentAngle = exitAngle;
    this.segments[this.segments.length - 1].angle = exitAngle;
  },
  addStraight: function (len, height) {
    height = height || 0;
    this.addRoad(len, len, len, 0, height, 0);
  },
  addBumps: function () {
    this.addRoad(10, 10, 10, 0, 5);
    this.addRoad(10, 10, 10, 0, -2);
    this.addRoad(10, 10, 10, 0, -5);
    this.addRoad(10, 10, 10, 0, 8);
    this.addRoad(10, 10, 10, 0, 5);
    this.addRoad(10, 10, 10, 0, -7);
    this.addRoad(10, 10, 10, 0, 5);
    this.addRoad(10, 10, 10, 0, -2);
  },
  addEasyCurve90: function (direction, height) {
    this.addRoad(25, 100 * 1.4, 25,
      direction * 4.25, height, direction * 90);
  },
  addEasyCurve30: function (direction, height) {
    this.addRoad(25, 50, 25,
      direction * 4.25, height, direction * 30);
  },
  addMediumCurve90: function (direction, height) {
    this.addRoad(25,
      50 * 1.5,
      25,
      direction * 6 * 0.96,
      height, direction * 90);
  },
  addHardCurve90: function (direction) {
    this.addRoad(18, 50 * 0.8, 18, direction * 8, 0, direction * 90);
  },
  addHardCurve180: function () {
    this.addRoad(50, 50, 50, 7.5, 0, 180);
  },
  addHill: function (num, height) {
    this.addRoad(num, num, num, 0, height, 0);
  },
  addRoadsideObject: function (n, sprite, offset) {
    var segment = this.segments[n];
    var x = 0;
    if (offset < 0) {
      x = segment.p1.world.x - 600;
    } else {
      x = segment.p2.world.x + 600;
    }
    segment.sprites.push({
      source: sprite,
      x: x
    });
  },
  findSegment: function (z) {
    return this.segments[Math.floor(z / Track.segmentLength) % this.segments.length];
  },
  drawMap: function () {
    if (this.map == null) this.map = document.createElement('canvas');
    this.map.width = 600;
    this.map.height = 600;
    cntx = this.map.getContext('2d');
    cntx.clearRect(0, 0, this.map.width, this.map.height);
    cntx.strokeStyle = '#666666';
    cntx.lineWidth = 5;
    var angle = 0;
    var x = 300;
    var y = 30;
    cntx.beginPath();
    var segmentDrawLength = 0.5;
    cntx.moveTo(x, y);
    for (var i = 0; i < this.segments.length; i++) {
      angle = (this.segments[i].angle / 180) * Math.PI;
      x += segmentDrawLength * Math.cos(angle);
      y += segmentDrawLength * Math.sin(angle);
      cntx.lineTo(x, y);
      this.segments[i].x = x;
      this.segments[i].y = y;
    }
    cntx.stroke();
    cntx.strokeStyle = '#e5e5e5';
    cntx.lineWidth = 4;
    cntx.stroke();
    segmentDrawLength = 4;
    context.lineWidth = 3;
    cntx.strokeStyle = '#e5e5e5';
    cntx.beginPath();
    angle = ((this.segments[0].angle + 90) / 180) * Math.PI;
    x -= segmentDrawLength * Math.cos(angle);
    y -= segmentDrawLength * Math.sin(angle);
    cntx.moveTo(x, y);
    x += 2 * segmentDrawLength * Math.cos(angle);
    y += 2 * segmentDrawLength * Math.sin(angle);
    cntx.lineTo(x, y);
    cntx.stroke();
  },
  drawOverheadTrack: function () {
    cntx = overheadTrack.x;
    this.overheadMap = overheadTrack.c;
    cntx.clearRect(0, 0, 600, 600);
    cntx.drawImage(this.map, 0, 0, 600, 600, 0, 0, 600, 600);
    for (var i = 0; i < cars.length; i++) {
      var carPosition = cars[i].z;
      var segment = track.findSegment(carPosition);
      cntx.beginPath();
      cntx.arc(segment.x, segment.y, 5, 0, 2 * Math.PI, false);
      cntx.fillStyle = '#222222';
      cntx.fill();
      cntx.lineWidth = 2;
      cntx.strokeStyle = '#999999';
      cntx.stroke();
    }
    var playerPosition = cars[0].z;
    var playerSegment = track.findSegment(playerPosition);
    cntx.beginPath();
    cntx.arc(playerSegment.x, playerSegment.y, 5, 0, 2 * Math.PI, false);
    cntx.fillStyle = '#ff0000';
    cntx.fill();
    context.lineWidth = 2;
    cntx.strokeStyle = '#cccccc';
    cntx.stroke();
  }
}