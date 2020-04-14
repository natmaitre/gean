
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
  