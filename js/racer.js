var canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
context.textAlign = 'center';
var racing = 0;

var getTimestamp = function () {
  return performance.now();
};

window.addEventListener('gamepadconnected', (event) => {
  console.log('✅ 🎮 A gamepad was connected:', event.gamepad);
})

document.addEventListener("keydown", function (e) {
  if (racing === 1) race.keyDown(e);
  if (racing === 0) titleScreen.keyDown(e);
});

document.addEventListener("keyup", function (e) {
  if (racing === 1) race.keyUp(e);
  if (racing === 0) titleScreen.keyUp(e);
});

var now = getTimestamp();
var last = getTimestamp();
var dt = 0;
var gdt = 0;
var cars = []; 
var player = null;
var camera = new Camera();
var race = new Race();
var track = new Track();
var titleScreen = new TitleScreen(canvas, context);

function startGame(trackNumber) {
  raceAudioInit();
  racing = 1;
  camera.reset();
  race.start(trackNumber);
}
function frame() {
  now = getTimestamp();
  dt = Math.min(1, (now - last) / 1000);
  gdt = gdt + dt;
  if (racing === 0) {
    titleScreen.render(dt);
    gdt = 0;
  }
  if (racing === 1) {
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

titleScreen.init();
frame();