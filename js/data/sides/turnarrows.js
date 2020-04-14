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