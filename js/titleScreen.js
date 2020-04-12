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
    if (e.keyCode === 88) {
      startGame();
    }
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
    for (var i = 0; i < 30; i++) {
      var fontSize = 100 + i * 10;
      context.font = 'italic ' + fontSize + 'px ' + helvetica;
      context.fontStyle = 'italic';
      var col = 80 + (i * 4);
      col = (col + t / 6) % 200;
      if (i == 29) {
        col = 255;
      }
      cntx.fillStyle = 'rgb(' + col + ',' + col + ',' + col + ')';
      cntx.fillText("racer", this.canvas.width / 2, 300 - i);
    }
    context.font = '44px ' + helvetica;
    cntx.fillText("Arrow keys to drive, x for Turbo, z for Handbrake", this.canvas.width / 2, 570);
    cntx.fillText("x To Start", this.canvas.width / 2, 460);
    camera.z = utilIncrease(camera.z, dt * 120, track.getLength());
    this.renderRoad();
  }
}