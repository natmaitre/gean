var canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
context.textAlign = 'center';
var racing = false;

var getTimestamp = function () {
  return performance.now();
};

document.addEventListener("keydown", function (e) {
  if (racing) {
    race.keyDown(e);
  } else {
    titleScreen.keyDown(e);
  }
});

document.addEventListener("keyup", function (e) {
  if (racing) {
    race.keyUp(e);
  } else {
    titleScreen.keyUp(e);
  }
});

var now = getTimestamp();
var last = getTimestamp();
var dt = 0;
var gdt = 0;
var cars = []; 
var player = null;
var camera = new Camera();
var race = new Race();
track = new Track();
var titleScreen = new TitleScreen(canvas, context);

function startGame(options) {
  raceAudioInit();
  racing = true;
  camera.reset();
  race.start(0);
}
titleScreen.init();

function frame() {
  now = getTimestamp();
  dt = Math.min(1, (now - last) / 1000);
  gdt = gdt + dt;
  if (!racing) {
    titleScreen.render(dt);
    gdt = 0;
  } else {
    outlineOnly = false;
    var step = 1 / 180;
    while (gdt > step) {
      gdt = gdt - step;
      race.update(step);
    }
    track.drawOverheadTrack();
    race.render();
    last = now;
  }
  requestAnimationFrame(frame);
}
frame();