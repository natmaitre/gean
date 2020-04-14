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