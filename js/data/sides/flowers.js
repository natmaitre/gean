
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
  