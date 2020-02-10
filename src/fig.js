window.onload = function () {

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
	var spaceship;
	var crosshair;
	var crosshairVisible = false;
	var crosshairPositions = [];

	var renderer = new THREE.WebGLRenderer({
		antialias: false
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
	document.body.appendChild(renderer.domElement);

	var crateTexture = new THREE.TextureLoader().load('gfx/crosshairs.gif');

	objects.loadEnemyTextures();

	var gameOverTexture = new THREE.TextureLoader().load('gfx/startgame.png');
	var gameOverMaterial = new THREE.SpriteMaterial({
		map: gameOverTexture, color: 0xffffff
	});
	
	var gameOver = new THREE.Sprite(gameOverMaterial);
	gameOver.position.set(-100, 0, camera.position.z - 1000);
	gameOver.scale.set(2000, 300, 1.0);	
	scene.add(gameOver);

	objects.loadGems();

	var difficultyTimer = 0;
	var difficultyThreshold = 1200;
	//var difficultyThreshold = 180;
	var bullets = [];
	var usedBullets = [];

	var score = 0;
	var difficulty = 1;

	//var light = new THREE.HemisphereLight(0xFFFFFF, 0x999999, 1);
	var light = new THREE.SpotLight( 0xffffff );
	light.position.set(0, 1000, 3000);
	light.castShadow = true; 
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;	
	light.shadow.camera.near = 0.5;
	light.shadow.camera.far = 100;
	scene.add(light);

	var dirLight = new THREE.DirectionalLight(0xffffff, 1);
	dirLight.color.setHSL(0.1, 1, 0.95);
	dirLight.position.set(300, 1000, -500);
	dirLight.position.multiplyScalar(50);
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.width = 2048;
	dirLight.shadow.mapSize.height = 2048;
	dirLight.shadow.camera.left = -50;
	dirLight.shadow.camera.right = 50;
	dirLight.shadow.camera.top = 50;
	dirLight.shadow.camera.bottom = -50;
	dirLight.shadow.camera.far = 3500;
	dirLight.shadow.bias = -0.0001;
	scene.add(dirLight);

	var floorTexture = new THREE.TextureLoader().load('gfx/checkeredFloorBrown.jpg');
	var floorMaterial = new THREE.MeshPhongMaterial({
		color: 0x6C6C6C,
		side: THREE.DoubleSide
    });
	var floorGeometry = new THREE.PlaneBufferGeometry(5000, 10000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	var floorHalfHeight = floor.geometry.parameters.height / 2;
	var floorHalfWidth = floor.geometry.parameters.width / 2;
	floor.position.y = -200;
	floor.rotation.x = Math.PI / 2;
	floor.receiveShadow = true;
	scene.add(floor);

	var leftBound = -floorHalfWidth + 1000;
	var rightBound = floorHalfWidth - 1000;

	obstacles.init(scene, camera, leftBound, rightBound, player);

	var cubeL = objects.makeCube({
		x: 500,
		y: 2000,
		z: 10000
	});
	cubeL.position.set(-2000, 0, 0);
	scene.add(cubeL);
	var cubeF = objects.makeCube({
		x: 500,
		y: 2000,
		z: 10000
	});
	cubeF.position.set(2000, 0, 0);
	scene.add(cubeF);

	var imagePrefix = "gfx/skybox-";
	var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".jpg";
	var skyGeometry = new THREE.CubeGeometry(7000, 7000, 7000);

	var materialArray = [];
	for (var i = 0; i < 6; i++) {
		materialArray.push(new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load(imagePrefix + directions[i] + imageSuffix),
			side: THREE.BackSide
		}));

	}
	var skybox = new THREE.Mesh(skyGeometry, materialArray);
	scene.add(skybox);

	var guiDiv = document.getElementById("gui");

	function addSpaceship() {
		var jsonLoader = new THREE.ObjectLoader();
		jsonLoader.load("models/spaceship.json", function (obj) {
			spaceship = obj;
			spaceship.scale.set(10, 10, 10);
			spaceship.rotation.y += Math.PI;
			scene.add(spaceship);
			spaceship.position.z = -100;
			spaceship.receiveShadow = true;
			spaceship.castShadow = true;
			particles.init(scene, camera, spaceship);
		});
	}

	function addGemToScene(geometry, materials) {
		var material = new THREE.MeshFaceMaterial(materials);
		bluegem = new THREE.Mesh(geometry, material);
		bluegem.scale.set(50, 50, 50);
		bluegem.rotation.y += Math.PI;
		scene.add(bluegem);
		bluegem.position.z = -1500;
		bluegem.position.y += 100;
	}

	var ambientLight = new THREE.AmbientLight(0x111111);
	scene.add(ambientLight);

	function init() {
		player.init();

		window.addEventListener('keyup', onKeyUp, false);
		window.addEventListener('keydown', function (event) {
			Key.onKeydown(event);
		}, false);

		animloop();
	}

	function onKeyUp(event) {
		Key.onKeyup(event);
		if (event.keyCode == Key.SPACE) {
			shoot();
		}
		if (event.keyCode == 187) {
			increaseDifficulty();
		}
	}

	function animloop() {
		requestAnimationFrame(animloop);
		render();
	}

	function startGame() {
		player.reset();
		score = 0;
		obstacles.reset();
		difficulty = 1;
		difficultyTimer = 0;
		particles.stopSmoke();
		scene.remove(gameOver);
		addCrosshair();
		addSpaceship();
	}

	function increaseDifficulty() {
		difficulty++;
		obstacles.increaseDifficulty();
		player.increaseDifficulty();
		console.log("Entering level " + difficulty);
	}

	function addCrosshair() {
		var crateMaterial = new THREE.SpriteMaterial({
			map: crateTexture,
			color: 0xff0000
		});
		crosshair = new THREE.Sprite(crateMaterial);
		crosshair.position.set(-100, 50, camera.position.z - 1000);
		crosshair.scale.set(48, 48, 1.0);
		scene.add(crosshair);
		crosshairVisible = true;
	}

	function removeCrosshair() {
		crosshairVisible = false;
		scene.remove(crosshair);
	}

	function moveCrosshair() {
		if (!spaceship) return;
		var maxHistory = 1;
		var newp;
		var savedPosition = spaceship.position.clone();
		crosshairPositions.push(savedPosition);
		if (crosshairPositions.length > maxHistory) {
			//crosshairPositions.length = maxHistory;
			newp = crosshairPositions.shift();
		} else {
			newp = crosshairPositions[0];
		}
		if (crosshairVisible) {
			crosshair.position.x = newp.x;
			crosshair.position.y = newp.y;
			crosshair.position.z = camera.position.z - 700;
		}
	}

	function collision() {
		if (player.dead) return;
		player.crash();
		removeCrosshair();
		obstacles.clean();
		camera.position.x = camera.position.y = 0
		gameOver.position.set(-100, 0, camera.position.z - 1000);
		scene.add(gameOver);
	}

	var sinceLastShot = 0;

	function joystickShoot() {
		if (sinceLastShot >= 5) {
			shoot();
			sinceLastShot = 0;
		} else
			sinceLastShot++;

	}

	function shoot() {
		if (usedBullets.length > 0) {
			var bullet = usedBullets.pop();
		} else {
			var bullet = objects.makeBullet();
		}

		bullet.position.set(player.x - 25, player.y, player.z - 25);
		scene.add(bullet);
		bullets.push(bullet);

		if (usedBullets.length > 0)
			var bullet2 = usedBullets.pop();
		else {
			var bullet2 = objects.makeBullet();
		}

		var bullet2 = objects.makeBullet();
		bullet2.position.set(player.x + 25, player.y, player.z - 25);
		scene.add(bullet2);
		bullets.push(bullet2);

	}

	function checkStartButton() {
		if (Key.isDown(Key.SPACE)) {
			startGame();
		}
		if (navigator.getGamepads()) {
			var pads = navigator.getGamepads();
			var pad = pads[0];
			if (pad !== null) {
				if (pad.buttons[9].pressed) startGame();
			}
		}
	}

	function render() {
		renderer.render(scene, camera);
		//light.position.z = player.z;
		//light.position.x = player.x;
		skybox.position.z = camera.position.z;
		skybox.position.y = camera.position.y;
		skybox.position.x = camera.position.x;

		moveCrosshair();

		if (obstacles.isStarted()) {
			difficultyTimer++;
			if (difficultyTimer > difficultyThreshold) {
				difficultyTimer = 0;
				increaseDifficulty();
			}
		} else {
			checkStartButton();
		}
		if (!player.dead) {
			guiDiv.innerHTML = "SCORE: " + score + "<br>LEVEL: " + difficulty;
			for (var i = 0; i < bullets.length; i++) {
				var thisBullet = bullets[i];
				thisBullet.position.z -= player.speed * 5;

				if (Math.abs(thisBullet.position.z - player.z) > 3000) {
					bullets.splice(i, 1);
					scene.remove(thisBullet);
					usedBullets.push(thisBullet);
				}
			}
			controls(camera, spaceship);
		} else {
			checkStartButton();
		}
		if (navigator.getGamepads()) {
			var pads = navigator.getGamepads();
			var pad = pads[0];
			if (pad !== null) {
				if (pad.buttons[7].pressed) joystickShoot();
			}
		}
		if (floor.position.z - 1000 > camera.position.z) {
			floor.position.z -= floorHalfHeight;
			cubeL = objects.makeCube({
				x: 500,
				y: 2000,
				z: 10000
			});
			cubeL.position.set(-2000, 0, camera.position.z-5000);
			scene.add(cubeL);
			cubeF = objects.makeCube({
				x: 500,
				y: 2000,
				z: 10000
			});
			cubeF.position.set(2000, 0, camera.position.z-5000);
			scene.add(cubeF);
		}
		var hitGem = obstacles.collideGems(spaceship);

		if (hitGem != null) score += hitGem.value * difficulty;

		if (obstacles.collideCubes(spaceship) != null || obstacles.collideEnemyBullets(spaceship)) collision();

		if (obstacles.collidePlayerBullets(bullets)) score += 50;

		obstacles.tick();
		particles.tick();
	}

	init();
}
