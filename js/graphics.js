var SCRATCHWIDTH = 600,
  SCRATCHHEIGHT = 600,
  SPRITESWIDTH = 2400,
  SPRITESHEIGHT = 2400,
  BACKGROUNDLAYERWIDTH = 1280,
  BACKGROUNDLAYERHEIGHT = 480,
  OVERHEADTRACKWIDTH = 600,
  OVERHEADTRACKHEIGHT = 600,
  scratchCanvas = createCanvas(SCRATCHWIDTH, SCRATCHHEIGHT),
  sprites = createCanvas(SPRITESWIDTH, SPRITESHEIGHT)
spritesCanvas = sprites.c,
  spritesContext = sprites.x,
  backgroundLayer3 = createCanvas(BACKGROUNDLAYERWIDTH, BACKGROUNDLAYERHEIGHT),
  backgroundLayer2 = createCanvas(BACKGROUNDLAYERWIDTH, BACKGROUNDLAYERHEIGHT),
  backgroundLayer1 = createCanvas(BACKGROUNDLAYERWIDTH, BACKGROUNDLAYERHEIGHT),
  overheadTrack = createCanvas(OVERHEADTRACKWIDTH, OVERHEADTRACKHEIGHT),
  SPRITES_STREETLIGHTLEFT = SPRITES_STREETLIGHTRIGHT = SPRITES_TURNLEFT = SPRITES_TURNRIGHT = SPRITES_FLOWERS = 0,
  SPRITES_BUILDINGS = [], COLORS_FOG = 0;

var SPRITES_CARLEFT = []
var SPRITES_CARRIGHT = []
var SPRITES_CARSTRAIGHT = []

var DARKGREY = '#222222';
var MEDIUMGREY = '#cccccc';
var LIGHTGREY = '#e5e5e5';
var CARS = [];

function eraseScratch() {
  scratchCanvas.x.clearRect(0, 0, SCRATCHWIDTH, SCRATCHHEIGHT);
}

function createCanvas(width, height) {
  var c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  var x = c.getContext('2d');

  return {
    c: c,
    x: x
  };
}

var spriteDstX = 0;
var spriteDstY = 0;
var spriteMaxRowHeight = 0;

function resetGraphics() {
  spriteDstX = 0;
  spriteDstY = 0;
  spriteMaxRowHeight = 0;

  spritesContext.clearRect(0, 0, SPRITESWIDTH, SPRITESHEIGHT);

  backgroundLayer1.x.clearRect(0, 0, BACKGROUNDLAYERWIDTH, BACKGROUNDLAYERHEIGHT);
  backgroundLayer2.x.clearRect(0, 0, BACKGROUNDLAYERWIDTH, BACKGROUNDLAYERHEIGHT);
  backgroundLayer3.x.clearRect(0, 0, BACKGROUNDLAYERWIDTH, BACKGROUNDLAYERHEIGHT);
}

function drawFuzzyCircle(x, y, r, c) {
  var angle = 0;
  cntx.fillStyle = c;
  var radius = r + r * Math.random();
  cntx.beginPath();
  cntx.moveTo(x + (radius) * Math.cos(angle), y + (radius) * Math.sin(angle));
  for (var i = 1; i < 30; i++) {
    angle = i * Math.PI * 2 / 30;
    radius = r + r * Math.random();
    cntx.lineTo(x + (radius) * Math.cos(angle), y + (radius) * Math.sin(angle));
  }
  cntx.closePath();
  cntx.fill();
}

function getScratchSpriteBounds() {
  var data = scratchCanvas.x.getImageData(0, 0, scratchCanvas.c.width, scratchCanvas.c.height);
  var buffer32 = new Uint32Array(data.data.buffer);
  var testX, testY;
  var w = scratchCanvas.c.width;
  var h = scratchCanvas.c.height;
  var x1 = w,
    y1 = h,
    x2 = 0,
    y2 = 0;
  for (testY = 0; testY < h; testY++) {
    for (testX = 0; testX < w; testX++) {
      if (buffer32[testX + testY * w] > 0) {
        if (testX < x1) x1 = testX;
        if (testX > x2) x2 = testX;
        if (testY < y1) y1 = testY;
        if (testY > y2) y2 = testY;
      }
    }
  }
  var collisionYStart = y2 - 50;
  if (collisionYStart < 0) {
    collisionYStart = 0;
  }
  var cx1 = w;
  var cx2 = 0;
  for (testY = collisionYStart; testY < y2; testY++) {
    for (testX = 0; testX < w; testX++) {
      if (buffer32[testX + testY * w] > 0) {
        if (testX < cx1) {
          cx1 = testX;
        }
        if (testX > cx2) {
          cx2 = testX;
        }
      }
    }
  }
  return {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
    cx: cx1 - x1,
    cw: cx2 - cx1
  }
}

function newSprite(flipH) {
  var fh = flipH || 0;
  var bounds = getScratchSpriteBounds();
  if (spriteDstX + bounds.w > SPRITESWIDTH) {
    spriteDstX = 0;
    spriteDstY += spriteMaxRowHeight;
    spriteMaxRowHeight = 0;
  }
  if (bounds.h > spriteMaxRowHeight) {
    spriteMaxRowHeight = bounds.h;
  }
  spritesContext.save();
  var dstX = spriteDstX;
  if (fh) {
    spritesContext.scale(-1, 1);
    dstX = -spriteDstX - bounds.w;
    bounds.cx = bounds.w - bounds.cx - bounds.cw;
  }
  spritesContext.drawImage(scratchCanvas.c, bounds.x, bounds.y, bounds.w, bounds.h,
    dstX, spriteDstY, bounds.w, bounds.h);
  spritesContext.restore();
  var result = {
    x: spriteDstX,
    y: spriteDstY,
    w: bounds.w,
    h: bounds.h,
    cx: bounds.cx,
    cw: bounds.cw
  }
  spriteDstX += bounds.w + 5;
  return result;
}

function fillPoints(points, color) {
  cntx.beginPath();
  cntx.fillStyle = color;
  cntx.moveTo(points[0], points[1]);
  for (var i = 2; i < points.length; i += 2) {
    cntx.lineTo(points[i], points[i + 1]);
  }
  cntx.closePath();
  cntx.fill();
}

function drawLine(x1, y1, x2, y2) {
  cntx.beginPath();
  cntx.moveTo(x1, y1);
  cntx.lineTo(x2, y2);
  cntx.stroke();
}

function createCar(number, model, type) {
  eraseScratch();
  cntx = scratchCanvas.x;
  var points = [];
  for (p in model) {
    points = model[p].points;
    if (model[p].fill) fillPoints(points, model[p].fill);
    if (model[p].gradient) {
      var gradient = cntx.createLinearGradient(model[p].gradient[0], model[p].gradient[1], model[p].gradient[2], model[p].gradient[3]);
      gradient.addColorStop(0, model[p].color[0]);
      gradient.addColorStop(1, model[p].color[1]);
      fillPoints(points, gradient);
    }
  }
  if (type === "side") {
    SPRITES_CARLEFT[number] = newSprite(0);
    SPRITES_CARRIGHT[number] = newSprite(1);
  }
  if (type === "back") {
    cntx.save();
    cntx.scale(-1, 1);
    cntx.drawImage(scratchCanvas.c, 0, 0, 143, 210, -143 - 132, 0, 143, 210);
    cntx.restore();
    SPRITES_CARSTRAIGHT[number] = newSprite(0);
  }
}

function createCars(carTypeList) {
  createCar(0, CARS[0].side, "side");
  createCar(0, CARS[0].back, "back");
  for (let c = 1; c < carTypeList.length; c++ ) {
    createCar(c, CARS[carTypeList[c]].side, "side");
    createCar(c, CARS[carTypeList[c]].back, "back");
  }
}