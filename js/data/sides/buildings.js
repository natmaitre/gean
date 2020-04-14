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
  