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
  SPRITES_STREETLIGHTLEFT = SPRITES_STREETLIGHTRIGHT = SPRITES_CARLEFT = SPRITES_CARRIGHT = SPRITES_CARSTRAIGHT = SPRITES_TURNLEFT = SPRITES_TURNRIGHT = SPRITES_FLOWERS = 0,
  SPRITES_BUILDINGS = [], COLORS_FOG = 0;

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

function createTurnArrows() {
  cntx = scratchCanvas.x;
  eraseScratch();
  cntx.fillStyle = '#996644';
  cntx.fillRect(0, 0, 200, 200);
  cntx.fillStyle = '#996644';
  cntx.fillRect(10, 200, 10, 10);
  cntx.fillStyle = '#996644';
  cntx.fillRect(180, 200, 10, 10);
  cntx.fillStyle = MEDIUMGREY;
  cntx.fillRect(10, 10, 180, 180);
  cntx.beginPath();
  cntx.moveTo(20, 100);
  cntx.lineTo(160, 30);
  cntx.lineTo(160, 170);
  cntx.lineTo(20, 100);
  cntx.fillStyle = '#cc2211';
  cntx.fill();
  cntx.fillStyle = MEDIUMGREY;
  cntx.fillRect(10, 10, 20, 180);
  SPRITES_TURNLEFT = newSprite();
  SPRITES_TURNRIGHT = newSprite(1);
}

function smallTree(width, slope) {
  var points = [];
  var y = 0;
  var index = 0;
  points[index++] = 0;
  var multiplier = 1;
  for (var i = 0; i < width; i++) {
    y = y + Math.random() * slope;
    points[index++] = y;
  }
  while (y > 0) {
    y = y - Math.random() * slope;
    points[index++] = y;
  }
  return points;
}

function createBackgroundTrees() {
  cntx = backgroundLayer1.x;
  var colours = [
    '#114433',
    '#114e33',
    '#115433',
    '#113433',
    '#114433',
  ];
  var sx = 0;
  for (var j = 0; j < 4; j++) {
    var x = sx;
    var width = 10 + 40 * Math.random();
    for (var i = 0; i < width; i++) {
      var terPoints = smallTree(8, 7);
      var colour = Math.floor(Math.random() * colours.length);
      cntx.fillStyle = colours[colour];
      cntx.beginPath();
      cntx.moveTo(x, 240 - terPoints[0]);
      for (var t = 1; t < terPoints.length; t++) {
        cntx.lineTo(x + t, 240 - terPoints[t]);
      }
      cntx.closePath();
      cntx.fill();
      x += 2 + Math.random() * 4;
    }
    var colours = [
      '#226639',
      '#115e33',
      '#316433',
      '#215433',
      '#114433',

    ];
    var x = sx;
    for (var i = 0; i < width; i++) {
      var terPoints = smallTree(4, 4);
      var colour = Math.floor(Math.random() * colours.length);
      cntx.fillStyle = colours[colour];
      cntx.beginPath();
      cntx.moveTo(x, 240 - terPoints[0]);
      for (var t = 1; t < terPoints.length; t++) {
        cntx.lineTo(x + t, 240 - terPoints[t]);
      }
      cntx.closePath();
      cntx.fill();
      x += 2 + Math.random() * 5;
    }
    sx = x + 50 + Math.random() * 180;
  }
}

function terrain(startX) {
  cntx = backgroundLayer2.x;
  var points = [];
  var highlightpoints = [];
  var highlightpoints2 = [];
  var highlightBackpoints2 = [];
  var y = 0;
  var index = 0;
  var multiplier = 1;
  multiplier = 0.1 + 3 * Math.random();
  var across = 20 * 100 * Math.random();
  for (var i = 0; i < 100; i++) {
    y = y + Math.random() * multiplier;
    points[index] = y;
    highlightpoints[index] = y;
    index++;
    multiplier += 0.01;
  }
  var across = 5 + 8 * Math.random();
  for (var i = 0; i < across; i++) {
    y = y + (0.4 - Math.random()) * 2;
    highlightpoints[index] = y;
    points[index++] = y;
  }
  var highlightBackpoints = [];
  var highlightY = y;
  while (highlightY > 0) {
    highlightY -= Math.random() * 5;
    highlightBackpoints.push(highlightY);
  }
  if (Math.random() > 0.6) {
    across = 160 * Math.random();
  } else {
    across = 20 * Math.random();
  }
  for (var i = 0; i < across; i++) {
    y = y + (0.4 - Math.random()) * 2;
    points[index++] = y;
  }
  while (y > 0) {
    y = y - Math.random() * multiplier;
    points[index++] = y;
    multiplier -= 0.003;
    if (multiplier < 0) {
      multiplier = 0.03;
    }
  }
  for (var i = 0; i < highlightpoints.length - 20; i++) {
    highlightY = highlightpoints[i] + Math.random();
    highlightpoints2.push(highlightY);
  }
  for (var i = 0; i < highlightpoints2.length - 10; i++) {
    highlightY -= Math.random() * 2;
    highlightBackpoints2.push(highlightY);
  }
  var heightOffset = 260;
  var x = startX;
  cntx.fillStyle = '#114433';
  cntx.beginPath();
  cntx.moveTo(x, heightOffset - points[0]);
  for (var t = 1; t < points.length; t++) {
    cntx.lineTo(x + t, heightOffset - points[t]);
  }
  cntx.closePath();
  cntx.fill();
  x = startX;
  cntx.fillStyle = '#224a33';
  cntx.beginPath();
  cntx.moveTo(x, heightOffset - highlightpoints[0]);
  for (var t = 1; t < highlightpoints.length; t++) {
    cntx.lineTo(x, heightOffset - highlightpoints[t]);
    x++;
  }
  for (var t = 1; t < highlightBackpoints.length; t++) {
    cntx.lineTo(x, heightOffset - highlightBackpoints[t]);
    if (Math.random() > 0.4) {
      x--;
    } else if (Math.random() > 0.4) {
      x++;
    }
  }
  cntx.closePath();
  cntx.fill();
  x = startX + 4;
  cntx.fillStyle = '#335a3a';
  cntx.beginPath();
  cntx.moveTo(x, heightOffset - highlightpoints2[0]);
  for (var t = 1; t < highlightpoints2.length; t++) {
    cntx.lineTo(x, heightOffset - highlightpoints2[t]);
    x++;
  }
  for (var t = 1; t < highlightBackpoints2.length; t++) {
    cntx.lineTo(x, heightOffset - highlightBackpoints2[t]);
    if (Math.random() > 0.8) {
      x++;
    } else if (Math.random() > 0.1) {
      x--;
    }
  }
  cntx.closePath();
  cntx.fill();
  return points;
}

function createBackgroundMountains() {
  var x = 0;
  for (var i = 0; i < 20; i++) {
    terrain(x);
    x += 3 + Math.random() * 100;;
  }
}

var tree = {
  leavesColor: '',
  draw: function () {
    cntx.translate(500 / 2, 500);
    this.leavesColor = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
    cntx.lineWidth = 1 + (Math.random() * 20);
    cntx.lineJoin = 'round';

    this.branch(0);
  },
  branch: function (depth) {
    if (depth < 12) {
      cntx.beginPath();
      cntx.moveTo(0, 0);
      cntx.lineTo(0, -(500) / 10);
      cntx.stroke();
      cntx.translate(0, -500 / 10);
      var randomN = -(Math.random() * 0.1) + 0.1;
      cntx.rotate(randomN);
      if ((Math.random() * 1) < 0.6) {
        cntx.rotate(-0.35);
        cntx.scale(0.7, 0.7);
        cntx.save();
        this.branch(depth + 1);
        cntx.restore();
        cntx.rotate(0.6);
        cntx.save();
        this.branch(depth + 1);
        cntx.restore();
      } else {
        this.branch(depth);
      }
    } else {
      cntx.fillStyle = this.leavesColor;
      cntx.fillRect(0, 0, 500, 200);
      cntx.stroke();
    }
  }
};

var SPRITES_TREES = [];

function createTrees() {
  SPRITES_TREES = [];
  for (var ti = 0; ti < 6; ti++) {
    var treeOK = false;
    var c = 0;
    while (!treeOK) {
      cntx = scratchCanvas.x;
      scratchCanvas.x.save();
      eraseScratch();
      tree.draw();
      var bounds = getScratchSpriteBounds();
      treeOK = (bounds.w < 300 && bounds.h < 400) || c > 5;
      scratchCanvas.x.restore();
      c++;
    }
    SPRITES_TREES[ti] = newSprite();
  }
}

function backgroundBuilding(x, type, buildingColor, windowColor) {
  cntx = backgroundLayer1.x;
  var buildingHeight = 30;
  var buildingWidth = 20;
  var windowSpacing = 2;
  var windowWidth = 1;
  var windowHeight = 1;
  var windowColumns = 4;
  var windowRows = 8;
  if (type == 1) {
    windowWidth = 2;
    windowHeight = 2;
    windowColumns = 3;
    windowRows = 10;
    buildingHeight = 40;
    buildingWidth = 25;
  }
  if (type == 2) {
    windowWidth = 4;
    windowColumns = 2;
    windowRows = 6;
    buildingHeight = 20;
    buildingWidth = 18;
  }
  var yOffset = 260;
  buildingHeight += 30 * Math.random();
  cntx.fillStyle = buildingColor;
  cntx.fillRect(x, yOffset - buildingHeight, buildingWidth, buildingHeight);
  if (Math.random() < 0.4) {
    var inset = 5;
    var insetHeight = 8;
    cntx.fillRect(x + inset,
      yOffset - (buildingHeight + insetHeight),
      buildingWidth - 2 * inset,
      buildingHeight + insetHeight);
  }
  if (Math.random() < 0.2) {
    var inset = 5;
    var insetHeight = 13;
    var insetWidth = 2;
    cntx.fillRect(x + inset,
      yOffset - (buildingHeight + insetHeight),
      insetWidth,
      buildingHeight + insetHeight);
  }
  for (var row = 0; row < windowRows; row++) {
    var wy = windowSpacing + row * (windowHeight + windowSpacing);
    for (var col = 0; col < windowColumns; col++) {
      var wx = windowSpacing + col * (windowWidth + windowSpacing);
      cntx.fillStyle = windowColor;
      cntx.fillRect(x + wx, yOffset - buildingHeight + wy, windowWidth, windowHeight);
    }
  }
}

function createBackgroundBuildings(night) {
  var buildingColor = '#777799';
  var windowColor = '#9999ee';
  if (night) {
    buildingColor = '#060606';
    windowColor = '#929156';
  }
  var x = 0;
  for (var i = 0; i < 80; i++) {
    var n = Math.random();
    if (n < 0.4) {
      backgroundBuilding(x, 0, buildingColor, windowColor);
    } else if (n < 0.6) {
      backgroundBuilding(x, 1, buildingColor, windowColor);
    } else {
      backgroundBuilding(x, 2, buildingColor, windowColor);
    }
    x += 10 + Math.random() * 30;
  }
  var buildingColor = '#9999aa';
  var windowColor = '#aaaaee';
  if (night) {
    buildingColor = '#101010';
    windowColor = '#929156';
  }
  var x = 0;
  for (var i = 0; i < 80; i++) {
    var n = Math.random()
    if (n < 0.4) {
      backgroundBuilding(x, 0, buildingColor, windowColor);
    } else if (n < 0.6) {
      backgroundBuilding(x, 1, buildingColor, windowColor);
    } else {
      backgroundBuilding(x, 2, buildingColor, windowColor);
    }
    x += 10 + Math.random() * 30;
  }
}

function createBuildings(night) {
  SPRITES_BUILDINGS = [];
  for (var ti = 0; ti < 4; ti++) {
    eraseScratch();
    cntx = scratchCanvas.x;
    var grey = 100 + Math.random() * 80;
    if (night) {
      grey = 10 + Math.random() * 20;
    }
    cntx.fillStyle = 'rgb(' + grey + ',' + grey + ',' + grey + ')';
    cntx.fillRect(0, 30, 240, 500);
    var windowWidth = 24,
      windowHeight = 15,
      windowStartOffset = 8,
      windowSpacingH = 8,
      windowSpacingV = 10;
    var row = col = x = y = 0;
    for (row = 0; row < 18; row++) {
      y = 30 + windowStartOffset + row * (windowHeight + windowSpacingV);
      for (col = 0; col < 7; col++) {
        x = windowStartOffset + col * (windowWidth + windowSpacingH);
        if (night) {
          if (Math.random() > 0.7) {
            cntx.fillStyle = '#ffffec';
            cntx.fillRect(x, y, windowWidth, windowHeight);
            cntx.fillStyle = '#bbbb88';
            cntx.fillRect(x, y + windowHeight / 2, windowWidth, windowHeight / 2);
          } else {
            cntx.fillStyle = '#112237';
            cntx.fillRect(x, y, windowWidth, windowHeight);
            cntx.fillStyle = '#111a30';
            cntx.fillRect(x, y + windowHeight / 2, windowWidth, windowHeight / 2);
          }
        } else {
          cntx.fillStyle = '#5555a7';
          cntx.fillRect(x, y, windowWidth, windowHeight);
          cntx.fillStyle = '#444495';
          cntx.fillRect(x, y + windowHeight / 2, windowWidth, windowHeight / 2);
        }
      }
    }
    SPRITES_BUILDINGS[ti] = newSprite();
  }
}

function createStreetlights(night) {
  cntx = scratchCanvas.x;
  eraseScratch();
  cntx.save();
  cntx.fillStyle = '#999999';
  if (night) {
    cntx.fillStyle = '#555555';
  }
  var poleWidth = 7;
  cntx.fillRect(40, 150, poleWidth, 300);
  cntx.beginPath();
  cntx.arc(70, 150, 30, Math.PI, -Math.PI / 2);
  cntx.lineTo(70, 150 - 30 + poleWidth);
  cntx.arc(70, 150, 30 - poleWidth, -Math.PI / 2, Math.PI, true);
  cntx.lineTo(70 - 30, 150);
  cntx.fill();
  cntx.fillRect(70, 150 - 30, 70, poleWidth);
  cntx.fillRect(130, 150 - 30 - 1, 35, 6);
  cntx.fillStyle = '#aaaaaa';
  if (night) {
    cntx.fillStyle = '#777777';
  }
  cntx.fillRect(40 + poleWidth - 4, 150, 2, 300);
  cntx.fillRect(70, 150 - 30 + poleWidth - 4, 70, 2);
  cntx.beginPath();
  cntx.arc(70, 150, 30 - poleWidth + 4, Math.PI, -Math.PI / 2);
  cntx.lineTo(70, 150 - 30 + poleWidth);
  cntx.arc(70, 150, 30 - poleWidth, -Math.PI / 2, Math.PI, true);
  cntx.lineTo(70 - 30, 150);
  cntx.fill();
  cntx.fillStyle = '#aaaaaa';
  if (night) {
    cntx.fillStyle = '#999999';
  }
  cntx.fillRect(40 + poleWidth - 2, 150, 2, 300);
  cntx.fillRect(70, 150 - 30 + poleWidth - 2, 70, 2);
  cntx.beginPath();
  cntx.arc(70, 150, 30 - poleWidth + 2, Math.PI, -Math.PI / 2);
  cntx.lineTo(70, 150 - 30 + poleWidth);
  cntx.arc(70, 150, 30 - poleWidth, -Math.PI / 2, Math.PI, true);
  cntx.lineTo(70 - 30, 150);
  cntx.fill();
  if (night) {
    cntx.filter = 'blur(2px)';
  }
  cntx.fillStyle = '#ffffff';
  cntx.fillRect(128, 150 - 30 + 4, 38, 12);
  if (night) {
    cntx.globalAlpha = 0.8;
    cntx.globalCompositeOperation = 'lighter';
    cntx.filter = 'blur(4px)';
    cntx.fillRect(123, 150 - 30 + 3, 44, 18);
    cntx.globalAlpha = 1;
  }
  SPRITES_STREETLIGHTLEFT = newSprite();
  SPRITES_STREETLIGHTRIGHT = newSprite(1);
  cntx.restore();
}

function createNightSky() {
  var xMax = BACKGROUNDLAYERWIDTH;
  var yMax = BACKGROUNDLAYERHEIGHT;
  cntx = backgroundLayer3.x;
  var gradient = cntx.createLinearGradient(0, 0, 0, yMax);
  gradient.addColorStop(0, "#00111e");
  gradient.addColorStop(1, "#033d5e");
  cntx.fillStyle = gradient;
  cntx.fillRect(0, 0, BACKGROUNDLAYERWIDTH, BACKGROUNDLAYERHEIGHT);
  var hmTimes = Math.round(xMax + yMax);
  for (var i = 0; i <= hmTimes; i++) {
    var randomX = Math.floor(Math.random() * xMax);
    var randomY = Math.floor(Math.random() * yMax);
    var randomSize = Math.floor(Math.random() * 2) + 1;
    var randomOpacityOne = Math.floor(Math.random() * 9) + 1;
    var randomOpacityTwo = Math.floor(Math.random() * 9) + 1;
    var randomHue = Math.floor(Math.random() * 360);
    if (randomSize > 1) {
      cntx.shadowBlur = Math.floor(Math.random() * 15) + 5;
      cntx.shadowColor = "white";
    }
    cntx.fillStyle = "hsla(" + randomHue + ", 30%, 80%, ." + randomOpacityOne + randomOpacityTwo + ")";
    cntx.fillRect(randomX, randomY, randomSize, randomSize);
  }
}

function createLeaf(s) {
  cntx.fillStyle = s;
  cntx.beginPath();
  cntx.arc(3, 7, 3, Math.PI / 2, Math.PI);
  cntx.arc(10, 7, 10, Math.PI, Math.PI * 1.24);
  cntx.arc(-4.7, 7, 10, Math.PI * 1.76, 0);
  cntx.arc(2.3, 7, 3, 0, Math.PI / 2);
  cntx.fill();
}

function createFlowers() {
  eraseScratch();
  cntx = scratchCanvas.x;
  var canvas = scratchCanvas.c;
  cntx.save();
  var leafGradient = cntx.createLinearGradient(0, 0, 0, 8);
  leafGradient.addColorStop(0, "#ff111e");
  leafGradient.addColorStop(1, "#aa3d5e");
  createLeaf(leafGradient);
  cntx.translate(0, 20);
  createLeaf(leafGradient);
  cntx.translate(0, 20);
  createLeaf(leafGradient);
  cntx.translate(0, 20);
  createLeaf('#44aa55');
  cntx.restore();
  var y = 100;
  for (var j = 0; j < 2; j++) {
    var x = 30;
    for (var i = 0; i < 60; i++) {
      x += 4 + 6 * Math.random();
      if (x > 780) {
        continue;
      }
      var height = 20 + 4 * Math.random();
      y = 100 + j * 16 - height + Math.random() * 12;
      if (Math.random() > 0.5) {
        cntx.fillStyle = '#44aa55';
        cntx.fillRect(x, y, 2, height);
        cntx.fillStyle = '#66cc88';
        cntx.fillRect(x, y, 1, height);
      } else {
        cntx.fillStyle = '#449955';
        cntx.fillRect(x, y, 2, height);
        cntx.fillStyle = '#66aa88';
        cntx.fillRect(x, y, 1, height);
      }
      var flower = Math.floor(Math.random() * 2) * 20;
      var dstX = x - 2;
      var dstY = y - 6;
      cntx.save();
      cntx.translate(dstX + 3, dstY);
      cntx.rotate(0.3);
      cntx.drawImage(canvas, 0, flower, 6, 11, 0, 0, 6, 11);
      cntx.restore();
      cntx.save();
      cntx.translate(dstX - 3, dstY + 1);
      cntx.rotate(-0.3);
      cntx.drawImage(canvas, 0, flower, 6, 11, 0, 0, 6, 11);
      cntx.restore();
      cntx.save();
      cntx.translate(dstX, dstY);
      cntx.drawImage(canvas, 0, flower, 6, 11, 0, 0, 6, 11);
      cntx.restore();
      cntx.save();
      cntx.translate(dstX + 6, dstY + 10);
      cntx.rotate(0.6);
      cntx.drawImage(canvas, 0, 60, 6, 11, 0, 0, 6, 11);
      cntx.restore();
    }
  }
  cntx.clearRect(0, 0, 22, 300);
  SPRITES_FLOWERS = newSprite();
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

function createCar(model) {
  eraseScratch();
  cntx = scratchCanvas.x;
  var points = [];
  for (p in CARS[model].side) {
    points = CARS[model].side[p].points;
    if (CARS[model].side[p].fill) fillPoints(points, CARS[model].side[p].fill);
    if (CARS[model].side[p].gradient) {
      var gradient = cntx.createLinearGradient(CARS[model].side[p].gradient[0], CARS[model].side[p].gradient[1], CARS[model].side[p].gradient[2], CARS[model].side[p].gradient[3]);
      gradient.addColorStop(0, CARS[model].side[p].color[0]);
      gradient.addColorStop(1, CARS[model].side[p].color[1]);
      fillPoints(points, gradient);
    }
  }
  SPRITES_CARLEFT = newSprite(0);
  SPRITES_CARRIGHT = newSprite(1);
}

function createCar2(model) {
  eraseScratch();
  cntx = scratchCanvas.x;
  var points = [5, 197, 143, 197, 141, 87, 1, 87, 4, 106, 1, 121, 1, 180];
  fillPoints(points, '#4abf74');
  var points = [141, 87, 143, 1, 87, 3, 72, 6, 61, 17, 31, 67, 1, 87, ];
  fillPoints(points, '#a9fb78');
  points = [4, 100, 143, 100, 143, 93, 3, 93];
  fillPoints(points, '#226d7d');
  points = [4, 155, 143, 155, 143, 113, 4, 113];
  fillPoints(points, '#226d7d');
  points = [4, 150, 86, 149, 86, 121, 5, 121, 3, 139];
  fillPoints(points, '#b44258');
  points = [4, 149, 86, 149, 86, 138, 4, 138];
  fillPoints(points, '#5d2959');
  points = [22, 131, 22, 134, 73, 134, 73, 131];
  fillPoints(points, '#d65d5b');
  points = [32, 82, 143, 82, 143, 19, 66, 19];
  var gradient = cntx.createLinearGradient(0, 19, 0, 90);
  gradient.addColorStop(0, "#4fa8f7");
  gradient.addColorStop(1, "#2d3c7c");
  fillPoints(points, gradient);
  points = [47, 59, 143, 59, 143, 64, 78, 68, 38, 77];
  fillPoints(points, '#95eef7');
  points = [13, 197, 16, 205, 23, 208, 49, 207, 56, 202, 58, 197];
  fillPoints(points, DARKGREY);
  var points = [1, 155, 1, 167, 143, 167, 143, 155];
  fillPoints(points, '#a9fb78');
  /*
    cntx.strokeStyle = '#63a96e';
    drawLine(1, 161, 143, 161);
    cntx.strokeStyle = '#111111';
    cntx.lineWidth = 2;
    drawLine(4, 137, 86, 137);
    cntx.lineWidth = 1;
    for(var i = 0; i < 68; i += 4) {
      drawLine(6 + i, 138, 6 + i, 149);
    }
    cntx.strokeStyle = '#204e69';
    cntx.lineWidth = 2;
    drawLine(5, 114, 106, 114);
    cntx.lineWidth = 1;
    drawLine(105, 116, 105, 155);
    cntx.strokeStyle = '#204e69';
    cntx.lineWidth = 1;
    drawLine(143, 21, 65, 21);
    drawLine(65, 21, 32, 82);
    drawLine(32, 82, 143, 82);
  */
  cntx.save();
  cntx.scale(-1, 1);
  cntx.drawImage(scratchCanvas.c, 0, 0, 143, 210, -143 - 132, 0, 143, 210);
  cntx.restore();
  SPRITES_CARSTRAIGHT = newSprite(0);
}

function createCars(model = 0) {
  createCar(model);
  createCar2(model);
}

/*
function createBush() {
  eraseScratch();
  cntx = scratchCanvas.x;
  var canvas = scratchCanvas.c;

  var colours = [
    '#002205',
    '#336622',
    '#448833'
  ];
  for(var j = 0; j < 3; j++) {
    createLeaf(colours[j]);

      for(var i = 0; i < 100; i++) {
        var radius = 30 * Math.random();
        var angle = Math.PI * 2 * Math.random();
        var cX = 140;
        var cY = 160;
        var dstX = cX + radius * M.Math.cos(angle);
        var dstY = cY + radius * M.Math.sin(angle);
        cntx.save();
        cntx.translate(dstX, dstY);
        cntx.rotate(Math.random() * Math.PI * 2);
        cntx.drawImage(canvas, 0, 0, 6, 11, 0, 0, 6, 11);
        cntx.restore();
      }

      for(var i = 0; i < 120; i++) {
        var radius = 40 * Math.random();
        var angle = Math.PI * 2 * Math.random();
        var cX = 160;
        var cY = 150;
        var dstX = cX + radius * Math.cos(angle);
        var dstY = cY + radius * Math.sin(angle);
        cntx.save();
        cntx.translate(dstX, dstY);
        cntx.rotate(Math.random() * Math.PI * 2);
        cntx.drawImage(canvas, 0, 0, 6, 11, 0, 0, 6, 11);
        cntx.restore();
      }


      for(var i = 0; i < 100; i++) {
        var radius = 30 * Math.random();
        var angle = Math.PI * 2 * Math.random();
        var cX = 190;
        var cY = 160;
        var dstX = cX + radius * Math.cos(angle);
        var dstY = cY + radius * Math.sin(angle);
        cntx.save();
        cntx.translate(dstX, dstY);
        cntx.rotate(Math.random() * Math.PI * 2);
        cntx.drawImage(canvas, 0, 0, 6, 11, 0, 0, 6, 11);
        cntx.restore();

      }
    }
}
*/