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
    var colours = [ '#114433', '#114e33', '#115433', '#113433', '#114433' ];
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
      var colours = [ '#226639', '#115e33', '#316433', '#215433', '#114433' ];
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