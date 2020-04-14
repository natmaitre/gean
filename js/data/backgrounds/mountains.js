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
    if (Math.random() > 0.6) across = 160 * Math.random();
    else across = 20 * Math.random();
    for (var i = 0; i < across; i++) {
      y = y + (0.4 - Math.random()) * 2;
      points[index++] = y;
    }
    while (y > 0) {
      y = y - Math.random() * multiplier;
      points[index++] = y;
      multiplier -= 0.003;
      if (multiplier < 0) multiplier = 0.03;
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
      if (Math.random() > 0.4) x--;
      else if (Math.random() > 0.4) x++;
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
      if (Math.random() > 0.8) x++;
      else if (Math.random() > 0.1) x--;
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