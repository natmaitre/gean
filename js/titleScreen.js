var TitleScreen = function (canvas, context) {
  this.canvas = canvas;
  this.context = context;
  this.context.textAlign = 'center';
}

TitleScreen.prototype = {
  init: function () {
    camera.reset();
    track.buildTrack0();
  },
  keyDown: function (e) {
    if (e.keyCode === 49) startGame(0);
    if (e.keyCode === 50) startGame(1);
    if (e.keyCode === 51) startGame(2);
    if (e.keyCode === 52) startGame(3);
  },
  keyUp: function (e) {
  },
  renderRoad: function () {
    outlineOnly = true;
    var maxy = height;
    camera.y = window.innerWidth / 2;
    camera.depth = 0.83909963117728;
    camera.x = 0;
    var baseSegment = track.findSegment(camera.z);
    var cameraPercent = utilPercentRemaining(camera.z, Track.segmentLength);
    camera.y = 500 + utilInterpolate(baseSegment.p1.world.y, baseSegment.p3.world.y, cameraPercent);
    var n, segment;
    for (n = 0; n < camera.drawDistance; n++) {
      segment = track.getSegment((baseSegment.index + n) % track.getSegmentCount());
      segment.looped = segment.index < baseSegment.index;
      segment.clip = maxy;
      segment.clip = 0;
      camera.project(segment.p1, 0, segment.looped, width, height, laneWidth);
      camera.project(segment.p2, 0, segment.looped, width, height, laneWidth);
      camera.project(segment.p3, 0, segment.looped, width, height, laneWidth);
      camera.project(segment.p4, 0, segment.looped, width, height, laneWidth);
      if ((segment.p1.camera.z <= camera.depth) || (segment.p3.screen.y >= segment.p1.screen.y) || (segment.p3.screen.y >= maxy)) continue;
      renderSegment(segment);
      maxy = segment.p1.screen.y;
    }
  },
  render: function (dt) {
    cntx = this.context;
    var t = getTimestamp();
    cntx.fillStyle = DARKGREY;
    cntx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    cntx.fillStyle = '#4576aa';
    cntx.fillRect(0, 0, this.canvas.width, this.canvas.height / 2);
    cntx.fillStyle = '#047804';
    cntx.beginPath();
    cntx.moveTo(0, this.canvas.height / 2);
    cntx.lineTo(this.canvas.width / 2, this.canvas.height / 2);
    cntx.lineTo(0, this.canvas.height / 2 + 210);
    cntx.closePath();
    cntx.fill();
    cntx.beginPath();
    cntx.moveTo(this.canvas.width, this.canvas.height / 2);
    cntx.lineTo(this.canvas.width / 2, this.canvas.height / 2);
    cntx.lineTo(this.canvas.width, this.canvas.height / 2 + 210);
    cntx.closePath();
    cntx.fill();
    for (var i = 0; i < 30; i++) {
      var fontSize = 100 + i * 10;
      context.font = 'italic ' + fontSize + 'px "Helvetica Neue", Helvetica, Arial, sans-serif';
      context.fontStyle = 'italic';
      var col = 80 + (i * 4);
      col = (col + t / 6) % 200;
      if (i == 29) col = 255;
      cntx.fillStyle = 'rgb(' + col + ',' + col + ',' + col + ')';
      cntx.fillText("gean", this.canvas.width / 2, 300 - i);
    }
    context.font = '44px "Helvetica Neue", Helvetica, Arial, sans-serif';
    cntx.fillText("Arrow keys to drive, x for Turbo, z for Handbrake", this.canvas.width / 2, 570);
    cntx.fillText("1,2,3 or 4 To Start", this.canvas.width / 2, 460);
    camera.z = utilIncrease(camera.z, dt * 120, track.getLength());
    this.renderRoad();
  }
}