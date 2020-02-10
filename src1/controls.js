var sinceLeftDown = 0;
var sinceRightDown = 0;
var wasLeftDown = false;
var wasRightDown = false;
var doubleTapThreshold = 10;
var flipThreshold = 80;
var cameraOffsetY = 70;
var cameraOffsetZ = 120;


var controls = function (camera, playerMesh) {

	if (!playerMesh) {
		console.log('TODO: wait for ship mesh to download');
		return;
	}

	if (Key.isDown(Key.LEFT)) {
		player.turnLeft();
	}
	
	if (Key.isDown(Key.RIGHT)) {
		player.turnRight();
	}

	if (Key.isDown(Key.UP)) {
		player.moveUp();
	}

	if (Key.isDown(Key.DOWN)) {
		player.moveDown();
	}

	player.update();
	
	playerMesh.position.set(player.x, player.y, player.z)
	playerMesh.rotation.z = player.rotation;
	
	camera.position.set(player.x/1.1, player.y/1.3 + cameraOffsetY, player.z + cameraOffsetZ)
	camera.rotation.z = player.flipRotation;
	
	if (Key.isDown(Key.ENTER)) {
		camera.rotation.y = Math.PI;
	} else {
		camera.rotation.y = 0;
	}

	const isGamePad = 'ongamepadconnected' in window;
	if (isGamePad) {
		var pads = navigator.getGamepads();
		var pad = pads[0]; 
		console.log("pad:" + pad)
		if (pad) {
			if ( pad.buttons[12].pressed )
				player.moveUp();
			if ( pad.buttons[13].pressed )
				player.moveDown();
			if ( pad.buttons[14].pressed )
				player.turnLeft();
			if ( pad.buttons[15].pressed )
				player.turnRight();
		}
	}

};
