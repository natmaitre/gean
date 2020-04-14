
function createBush() {
    eraseScratch();
    cntx = scratchCanvas.x;
    var canvas = scratchCanvas.c;
    var colours = ['#002205', '#336622', '#448833'];
    for (var j = 0; j < 3; j++) {
      createLeaf(colours[j]);
      for (var i = 0; i < 100; i++) {
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
      for (var i = 0; i < 120; i++) {
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
      for (var i = 0; i < 100; i++) {
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