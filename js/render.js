var width = window.innerWidth;
var height = window.innerHeight;
var resolution = height / 480;
var bgLayer3Speed = 0.001;
var bgLayer2Speed = 0.002;
var bgLayer1Speed = 0.003;
var bgLayer3Offset = 0;
var bgLayer2Offset = 0;
var bgLayer1Offset = 0;
var outlineOnly = false;
var lastDriftDraw = 0;
var COLORS_LANEMARKER = 0;

function renderPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color) {
  cntx.fillStyle = color;
  cntx.beginPath();
  cntx.moveTo(x1, y1);
  cntx.lineTo(x2, y2);
  cntx.lineTo(x3, y3);
  cntx.lineTo(x4, y4);
  cntx.closePath();
  if (outlineOnly) {
    cntx.strokeStyle = MEDIUMGREY;
    cntx.stroke();
  } else {
    cntx.fill();
  }
}

function renderSegment(segment) {
  var lanew1, lanew2, lanex1, lanex2, lane;
  var dark = Math.floor(segment.index / 2) % 2;
  var kerbColor = COLORS_KERBLIGHT;
  var landColor = COLORS_LANDLIGHT;
  if (dark) {
    kerbColor = COLORS_KERBDARK;
    landColor = COLORS_LANDDARK;
  }
  if (!outlineOnly) {
    cntx.fillStyle = landColor;
    cntx.fillRect(0, segment.p3.screen.y, width, segment.p1.screen.y - segment.p3.screen.y);
  }
  var r1 = segment.kerbWidth * segment.p1.screen.scale * width / 2;
  var r2 = segment.kerbWidth * segment.p4.screen.scale * width / 2;
  renderPolygon( segment.p1.screen.x - r1, segment.p1.screen.y, segment.p1.screen.x,
    segment.p1.screen.y, segment.p4.screen.x, segment.p4.screen.y, segment.p4.screen.x - r2, segment.p4.screen.y, kerbColor);
  renderPolygon( segment.p2.screen.x, segment.p2.screen.y, segment.p2.screen.x + r1, segment.p2.screen.y, segment.p3.screen.x + r2,
    segment.p3.screen.y, segment.p3.screen.x, segment.p3.screen.y, kerbColor);
  if (!outlineOnly) {
    var colour = COLORS_ROAD;
    if (segment.index == 0) {
      colour = MEDIUMGREY;
    }
    renderPolygon(segment.p1.screen.x, segment.p1.screen.y, segment.p2.screen.x, segment.p2.screen.y, segment.p3.screen.x,
      segment.p3.screen.y, segment.p4.screen.x, segment.p4.screen.y, colour);
  }
  var l1 = 50 * segment.p1.screen.scale * width / 2;
  var l2 = 50 * segment.p4.screen.scale * width / 2;
  lanex1 = segment.p1.screen.x + 100 * segment.p1.screen.scale * width / 2;
  lanex2 = segment.p4.screen.x + 100 * segment.p4.screen.scale * width / 2;
  renderPolygon(lanex1 - l1 / 2, segment.p1.screen.y, lanex1 + l1 / 2, segment.p1.screen.y, lanex2 + l2 / 2, segment.p3.screen.y, lanex2 - l2 / 2, segment.p3.screen.y, COLORS_LANEMARKER);
  lanex1 = segment.p2.screen.x - 100 * segment.p1.screen.scale * width / 2;
  lanex2 = segment.p3.screen.x - 100 * segment.p4.screen.scale * width / 2;
  renderPolygon(lanex1 - l1 / 2, segment.p1.screen.y, lanex1 + l1 / 2, segment.p1.screen.y, lanex2 + l2 / 2,
    segment.p3.screen.y, lanex2 - l2 / 2, segment.p3.screen.y, COLORS_LANEMARKER);
  lanes = 2;
  if (dark) {
    lanew1 = (segment.p2.screen.x - segment.p1.screen.x) / lanes;
    lanew2 = (segment.p3.screen.x - segment.p4.screen.x) / lanes;
    lanex1 = segment.p1.screen.x + lanew1;
    lanex2 = segment.p4.screen.x + lanew2;
    for (lane = 1; lane < lanes; lanex1 += lanew1, lanex2 += lanew2, lane++) {
      renderPolygon(lanex1 - l1 / 2, segment.p1.screen.y, lanex1 + l1 / 2, segment.p1.screen.y,
        lanex2 + l2 / 2, segment.p3.screen.y, lanex2 - l2 / 2, segment.p3.screen.y, COLORS_LANEMARKER);
    }
  }
  if (COLORS_FOG != 0) {
    renderFog(0, segment.p1.screen.y, width, segment.p3.screen.y - segment.p1.screen.y, segment.fog);
  }
}

function renderBackground(background, width, height, rotation, offset) {
  rotation = rotation || 0;
  offset = offset || 0;
  var imageW = BACKGROUNDLAYERWIDTH / 2;
  var imageH = BACKGROUNDLAYERHEIGHT;
  var sourceX = Math.floor(BACKGROUNDLAYERWIDTH * rotation);
  var sourceY = 0;
  var sourceW = Math.min(imageW, BACKGROUNDLAYERWIDTH - sourceX);
  var sourceH = imageH;
  var destX = 0;
  var destY = offset;
  var destW = Math.floor(width * (sourceW / imageW));
  var destH = height;
  context.drawImage(background.c, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
  if (sourceW < imageW)
    context.drawImage(background.c, 0, sourceY, imageW - sourceW, sourceH, destW - 1, destY, width - destW, destH);
}

function renderSprite(sprite, scale, destX, destY, clipY, fog) {
  var destW = (sprite.w * scale * width / 2);
  var destH = (sprite.h * scale * width / 2);
  destY = destY - destH;
  var clipH = clipY ? Math.max(0, destY + destH - clipY) : 0;
  if (clipH < destH) {
    context.drawImage(spritesCanvas, sprite.x, sprite.y, sprite.w, sprite.h - (sprite.h * clipH / destH),
      destX, destY, destW, destH - clipH);
    if (fog !== false && COLORS_FOG != 0) renderFog(destX, destY, destW, destH, fog);
  }
}

function renderExponentialFog(distance, density) {
  return 1 / (Math.pow(Math.E, (distance * distance * density)));
}

function renderPlayer(scale, destX, destY, steer, updown, playerShadowY) {
  var sprite;
  if (steer < 0) sprite = SPRITES_CARLEFT;
  else if (steer > 0) sprite = SPRITES_CARRIGHT;
  else sprite = SPRITES_CARSTRAIGHT;
  var spriteScale = player.width * scale / sprite.w;
  if (player.slipstreamTime > 0 || player.slipstream > 0) {
    cars[0].initSlipstreamLines();
    var amount = 0;
    if (player.slipstreamTime <= 0) {
      amount = player.slipstream;
      while (amount > 1) amount -= 1;
    }
    cntx.globalAlpha = 1 - amount;
    for (var i = 0; i < cars[0].slipstreamLines.length; i++) {
      var points = cars[0].slipstreamLines[i];
      cntx.beginPath();
      cntx.moveTo(points[0].screen.x, points[0].screen.y);
      for (var j = 1; j < points.length; j++) {
        cntx.lineTo(points[j].screen.x, points[j].screen.y);
      }
      cntx.fillStyle = MEDIUMGREY;
      cntx.fill();
    }
    cntx.globalAlpha = 1;
  }

  // ***** DRAW SHADOW IF IN AIR *******/
  /*
      if(playerShadowY != destY) {
        cntx.globalAlpha = 0.4;
          var destW  = (sprite.w * spriteScale * width/2) ;
          renderPolygon(destX, playerShadowY,
            destX + destW, playerShadowY,
            destX + 0.7 * destW, playerShadowY - 180,
            destX + 0.3 * destW, playerShadowY - 180,
            
            DARKGREY);
        cntx.globalAlpha = 1;      
      }
      */
  // ***** DRAW CAR SPRITE ****** /

  renderSprite( sprite, spriteScale, destX, destY + player.bounce, false);

  if (player.driftAmount > 0) {
    var time = getTimestamp();
    if (time - lastDriftDraw > 100) {
      cntx.globalAlpha = 0.8;
      cntx.fillStyle = MEDIUMGREY;
      var x = destX + 12;
      var y = destY - 4;
      cntx.fillRect(x, y, 50, 10)
      x = destX + 260;
      cntx.fillRect(x, y, 50, 10)
      cntx.globalAlpha = 1;
      lastDriftDraw = time;
    }
  }
  if (player.turbo) {
    var centreX = destX + 30;
    var centreY = destY - 10;
    drawFuzzyCircle(centreX, centreY, 10, '#dd9925');
    drawFuzzyCircle(centreX, centreY, 5, '#cccc55');
    centreX = destX + 180;
    drawFuzzyCircle(centreX, centreY, 10, '#dd9925');
    drawFuzzyCircle(centreX, centreY, 5, '#cccc55');
  }
}

function renderFog(x, y, width, height, fog) {
  if (fog < 1) {
    cntx.globalAlpha = 1 - fog;
    cntx.fillStyle = COLORS_FOG;
    cntx.fillRect(x, y, width, height);
    cntx.globalAlpha = 1;
  }
}

function renderRender() {
  cntx = context;
  var baseSegment = track.findSegment(camera.z);
  var basePercent = utilPercentRemaining(camera.z, Track.segmentLength);
  var playerSegment = track.findSegment(player.z);
  var playerPercent = utilPercentRemaining(player.z, Track.segmentLength);
  var playerY = utilInterpolate(playerSegment.p1.world.y, playerSegment.p3.world.y, playerPercent);
  var maxy = height;
  var x = 0;
  var dx = -(baseSegment.curve * basePercent);
  context.fillStyle = '#4576aa';
  cntx.fillRect(0, 0, width, height);
  renderBackground(backgroundLayer3, width, height, bgLayer3Offset, resolution * bgLayer3Speed * playerY);
  renderBackground(backgroundLayer2, width, height, bgLayer2Offset, resolution * bgLayer2Speed * playerY);
  renderBackground(backgroundLayer1, width, height, bgLayer1Offset, resolution * bgLayer1Speed * playerY);
  var n, i, segment, car, sprite, spriteScale, spriteX, spriteY;
  for (n = 0; n < camera.drawDistance; n++) {
    segment = track.getSegment((baseSegment.index + n) % track.getSegmentCount());
    segment.looped = segment.index < baseSegment.index;
    segment.fog = renderExponentialFog(n / camera.drawDistance, camera.fogDensity);
    segment.clip = maxy;
    camera.project(segment.p1, -x, segment.looped, width, height);
    camera.project(segment.p2, -x, segment.looped, width, height);
    camera.project(segment.p3, -x - dx, segment.looped, width, height);
    camera.project(segment.p4, -x - dx, segment.looped, width, height);
    x = x + dx;
    dx = dx + segment.curve;
    if ((segment.p1.camera.z <= camera.depth) ||
      (segment.p3.screen.y >= segment.p1.screen.y) ||
      (segment.p3.screen.y >= maxy))
      continue;
    renderSegment(segment);
    maxy = segment.p1.screen.y;
  }
  for (n = (camera.drawDistance - 1); n > 0; n--) {
    segment = track.getSegment((baseSegment.index + n) % track.getSegmentCount());
    for (i = 0; i < segment.cars.length; i++) {
      car = segment.cars[i];
      if (car.index !== 0) {
        sprite = car.sprite;
        var scale = utilInterpolate(segment.p1.screen.scale, segment.p3.screen.scale, car.percent);
        spriteX = utilInterpolate(
            (segment.p1.screen.x + segment.p2.screen.x) / 2,
            (segment.p3.screen.x + segment.p4.screen.x) / 2,
            car.percent) +
          (scale * car.x * width / 2);
        spriteY = utilInterpolate(segment.p1.screen.y, segment.p4.screen.y, car.percent);
        var sprite = SPRITES_CARSTRAIGHT;
        spriteScale = car.width * scale / sprite.w;
        if (car.turnLeft) {
          sprite = SPRITES_CARLEFT;
        } else if (car.turnRight) {
          sprite = SPRITES_CARRIGHT;
        }
        renderSprite(sprite, spriteScale, spriteX, spriteY, segment.clip, segment.fog);
      }
    }
    for (i = 0; i < segment.sprites.length; i++) {
      sprite = segment.sprites[i];
      spriteScale = segment.p1.screen.scale;
      spriteX = segment.p1.screen.x - segment.p1.world.x * segment.p1.screen.scale * width / 2 +
        spriteScale * sprite.x * width / 2;
      spriteY = segment.p1.screen.y;
      spriteScale = sprite.s * spriteScale;
      renderSprite(sprite.source, spriteScale, spriteX, spriteY, segment.clip, false);
      var destW = (sprite.source.w * spriteScale * width / 2);
      var offsetX = -0;
      var destX = spriteX + (destW * (offsetX || 0));
      spriteScale = segment.p1.screen.scale;
      spriteScale = sprite.s * spriteScale;
      var collisionx = (sprite.source.cx) * spriteScale * width / 2;
      var collisionw = sprite.source.cw * spriteScale * width / 2;
      spriteX = destX + collisionx;
    }
    if (segment == playerSegment) {
      var playerScreenY = utilInterpolate(playerSegment.p1.screen.y, playerSegment.p3.screen.y, playerPercent);
      playerScreenY = (height / 2) -
        (camera.depth / camera.zOffset * utilInterpolate(playerSegment.p1.camera.y,
          playerSegment.p3.camera.y, playerPercent) * height / 2);
      var playerShadowY = playerScreenY;
      if (cars[0].yOffset > 0) {
        playerScreenY -= cars[0].yOffset * camera.depth / camera.zOffset * height / 2;
      }
      var carX = width / 2;
      var scale = utilInterpolate(playerSegment.p1.screen.scale, playerSegment.p3.screen.scale, playerPercent);
      spriteX = utilInterpolate(
          (playerSegment.p1.screen.x + playerSegment.p2.screen.x) / 2,
          (playerSegment.p3.screen.x + playerSegment.p4.screen.x) / 2,
          playerPercent) +
        (scale * cars[0].x * width / 2);
      var p = {
        world: {
          x: player.x,
          y: player.y,
          z: player.z
        },
        camera: {},
        screen: {}
      };
      camera.project(p, 0, playerSegment.index < baseSegment.index, width, height);
      carX = p.screen.x;
      var playerDirection = 0;
      if (player.speed > 0) {
        if (player.driftDirection != 0) playerDirection = player.driftDirection;
        else playerDirection = (player.turnLeft ? -1 : player.turnRight ? 1 : 0);
      }
      renderPlayer(camera.depth / camera.zOffset, carX, playerScreenY, playerDirection, playerSegment.p3.world.y - playerSegment.p1.world.y, playerShadowY);
      if (race.state == STATE_RACING) context.drawImage(track.overheadMap, -40, 200, 400, 400);
    }
  }
}