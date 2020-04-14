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
  