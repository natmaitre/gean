window.onload = function () {

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );

	var spaceship;

	var crosshair;
	var crosshairVisible = false;
	var crosshairPositions = [];

	var renderer = new THREE.WebGLRenderer({antialias: false});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var crateTexture = new THREE.TextureLoader().load( 'gfx/crosshairs.gif' );
	var logoTexture = new THREE.TextureLoader().load( 'gfx/mask2.png' );

	var logoMaterial = new THREE.SpriteMaterial( { map: logoTexture  } );
	var logo = new THREE.Sprite( logoMaterial );

	objects.loadEnemyTextures();

	logo.position.set( window.innerWidth/2, window.innerHeight/2, 0 );
	logo.scale.set( 1024, 256, 1.0 ); // imageWidth, imageHeight
	scene.add(logo);

	var gameOverTexture = new THREE.TextureLoader().load('gfx/gameOver.png');
	var gameOverMaterial = new THREE.SpriteMaterial( { map: gameOverTexture } );
	var gameOver = new THREE.Sprite(gameOverMaterial);
	//gameOver.position.set(window.innerWidth/2, window.innerHeight/2, 0 );
	//gameOver.scale.set( 1024, 256, 1.0 );
	//scene.add( gameOver );

	//objects.loadGems();
	var difficultyTimer = 0;
	var difficultyThreshold = 1200;
	//var difficultyThreshold = 180;
	var bullets = [];
	var usedBullets = [];

	var score = 0;
	var difficulty = 1;

	var floorTexture = new THREE.TextureLoader().load('gfx/checkeredFloorBrown.jpg');
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set(20,20);
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(5000, 10000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	var floor2 = new THREE.Mesh(floorGeometry, floorMaterial);
	var floorHalfHeight = floor.geometry.parameters.height/2;
	var floorHalfWidth = floor.geometry.parameters.width/2;

	floor.position.y = -200;
	floor.rotation.x = Math.PI / 2;
	floor.receiveShadow = true;

	floor2.position.y = floor.position.y;
	floor2.rotation.x = floor.rotation.x;
	floor2.position.z = -floor.geometry.height;
	floor2.receiveShadow = true;

	scene.add(floor);
	scene.add(floor2);

	var leftBound = -floorHalfWidth + 1000;
	var rightBound = floorHalfWidth - 1000;

	obstacles.init(scene, camera, leftBound, rightBound, player);

	// LIGHT
	var light = new THREE.HemisphereLight(0xFFFFFF, 0x999999,1);
	light.position.set(3000,1000,-5000);
	scene.add(light);

	dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.color.setHSL( 0.1, 1, 0.95 );
	dirLight.position.set( 300, 100, -500 );
	dirLight.position.multiplyScalar( 50 );
	scene.add( dirLight );

	dirLight.castShadow = true;

	dirLight.shadow.mapSize.width = 2048;
	dirLight.shadow.mapSize.height = 2048;

	var d = 50;

	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;

	dirLight.shadow.camera.far = 3500;
	dirLight.shadow.bias = -0.0001;

	var imagePrefix = "gfx/skybox-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".jpg";
	var skyGeometry = new THREE.CubeGeometry( 7000, 7000, 7000 );	

	var materialArray = [];
	for (var i = 0; i < 6; i++) {
		materialArray.push( new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));

	}
	//var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skybox = new THREE.Mesh( skyGeometry, materialArray );
	scene.add(skybox);

	var jsonLoader = new THREE.ObjectLoader();
	//jsonLoader.load("https://threejs.org/examples/models/json/teapot-claraio.json", addShipToScene );
	jsonLoader.load("models/spaceship.json", addShipToScene );

	var guiDiv = document.getElementById("gui");

	function addShipToScene( obj ) 
	{
		spaceship = obj;
		spaceship.scale.set(10,10,10);
		spaceship.rotation.y += Math.PI;
		scene.add(spaceship);
		spaceship.position.z = -100;
		particles.init(scene, camera, spaceship);
	}

	function addGemToScene(geometry, materials) {
		var material = new THREE.MeshFaceMaterial( materials );
		bluegem = new THREE.Mesh( geometry, material );
		bluegem.scale.set(50,50,50);
		bluegem.rotation.y += Math.PI;
		scene.add( bluegem );
		console.log("loaded");
		bluegem.position.z = -1500;
		bluegem.position.y += 100;
	}

	var ambientLight = new THREE.AmbientLight(0x111111);
	scene.add(ambientLight);	

	function init() {
		player.init();

		window.addEventListener('keyup', onKeyUp, false);
		window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

		animloop();
	}

	function onKeyUp(event) {
		Key.onKeyup(event);
		if (event.keyCode == Key.SPACE) {
			shoot();
		}
		if(event.keyCode == 187) {
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
		scene.remove(logo);
		difficulty = 1;
		difficultyTimer = 0;
		particles.stopSmoke();
		scene.remove(gameOver);
		addCrosshair();
	}

	function increaseDifficulty() {
		difficulty++;
		obstacles.increaseDifficulty();
		player.increaseDifficulty();
		console.log("Entering level " + difficulty);
	}

	function addCrosshair() {
		var crateMaterial = new THREE.SpriteMaterial( { map: crateTexture, color: 0xff0000 } );
		crosshair = new THREE.Sprite( crateMaterial );
		crosshair.position.set( -100, 50, camera.position.z - 1000 );
		crosshair.scale.set( 48, 48, 1.0 ); // imageWidth, imageHeight
		scene.add( crosshair );
		crosshairVisible = true;
	}

	function removeCrosshair() {
		crosshairVisible = false;
		scene.remove( crosshair );
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
		
		if (usedBullets.length > 0)  {

			var bullet = usedBullets.pop();
		} else {
			var bullet = objects.makeBullet();
		}	

		bullet.position.set(player.x-25,player.y,player.z-25);
		scene.add(bullet);
		bullets.push(bullet);

		if (usedBullets.length > 0) 
			var bullet2 = usedBullets.pop();
		else {
			var bullet2 = objects.makeBullet();
		}	

		var bullet2 = objects.makeBullet();
		bullet2.position.set(player.x+25,player.y,player.z-25);
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
			if(difficultyTimer > difficultyThreshold) {
				difficultyTimer = 0;

				increaseDifficulty();
			}
		} else {
			checkStartButton();
		}
		if (!player.dead) {
			guiDiv.innerHTML = "SCORE: " + score + "<br />LEVEL: " + difficulty;
			for (var i=0;i<bullets.length;i++) {
				var thisBullet = bullets[i];
				thisBullet.position.z -= player.speed * 5;

				if (Math.abs(thisBullet.position.z - player.z) > 3000) {
					bullets.splice(i,1);
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
		}

		if (floor2.position.z - 1000 > camera.position.z) {
			floor2.position.z -= floorHalfHeight;
		}

		var hitGem = obstacles.collideGems(spaceship);

		if (hitGem != null) {
			score += hitGem.value * difficulty;
		}

		if (obstacles.collideCubes(spaceship)!= null || obstacles.collideEnemyBullets(spaceship)) {
			collision();
		};

		if (obstacles.collidePlayerBullets(bullets)) {
			score += 50;
		}

		obstacles.tick();
		particles.tick();

	}

	init();

}


