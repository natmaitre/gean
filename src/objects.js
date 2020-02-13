var objects = (function () {
	var gems = [];
	var bluegemMaterial;
	var bluegemGeometry;
	var redgemMaterial;
	var redgemGeometry;
	var greengemMaterial;
	var greengemGeometry;
	var whitegemMaterial;
	var whitegemGeometry;
	var enemyTexture;
	var enemyMaterial;
	var enemyBulletTexture;
	
	function loadGems() {
		var jsonLoader = new THREE.ObjectLoader();
		jsonLoader.load( "models/gem.json", addBlueGem);
		jsonLoader.load( "models/gem.json", addGreenGem);
		jsonLoader.load( "models/gem.json", addRedGem);
		jsonLoader.load( "models/gem.json", addWhiteGem);
	}
	 
	function loadEnemyTextures() {
		enemyTexture = new THREE.TextureLoader().load('gfx/mask2.png');
		enemyBulletTexture = new THREE.TextureLoader().load('gfx/bullet.png');
	}
	
	function addBlueGem(obj) {
		gems["blue"] = obj;
		gems["blue"].scale.set(100, 100, 100);
		gems["blue"].value = 100;
	}

	function addGreenGem(obj) {
		gems["green"] = obj;
		gems["green"].scale.set(100, 100, 100);
		gems["green"].value = 250;
	}

	function addRedGem(obj) {
		gems["red"] = obj;
		gems["red"].scale.set(100, 100, 100);
		gems["red"].value = 500;
	}

	function addWhiteGem(obj) {
		gems["white"] = obj;
		gems["white"].scale.set(100, 100, 100);
		gems["white"].value = 1000;
	}
	
	function makeGem(color) {
		return gems[color];
	}
	
	function makeEnemy() {
		/*var enemyMaterial = new THREE.SpriteMaterial( { map: enemyTexture, useScreenCoordinates: false, color: 0x000000 } );
		var enemy = new THREE.Sprite (enemyMaterial);*/
		var enemy = enemyObj.clone();
		enemy.vx = 0;
		enemy.vy = 0;
		enemy.vz = 0;
		return enemy;
	}
	
	function makeEnemyBullet() {
		var enemyMaterial = new THREE.SpriteMaterial( { map: enemyBulletTexture, useScreenCoordinates: false } );
		var enemy = new THREE.Sprite (enemyMaterial);
		enemy.vx = 0;
		enemy.vy = 0;
		enemy.vz = 0;
		return enemy;
	}
	
	function makeCube(dimensions) {
		var cube;
		var cubeMaterialArray = [];
		cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0x837f75 } ) );
		cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0x837f75 } ) );
		cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0x837f75 } ) );
		cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0x837f75 } ) );
		cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0x837f75 } ) );
		cubeMaterialArray.push( new THREE.MeshLambertMaterial( { color: 0x837f75 } ) );
		var cubeGeometry = new THREE.CubeGeometry( dimensions.x, dimensions.y, dimensions.z, 1, 1, 1 );
		cube = new THREE.Mesh( cubeGeometry, cubeMaterialArray );
		cube.geometry.computeBoundingBox();
		cube.geometry.dynamic = false;
		return cube;
	};

	function makeBigBullet() {
		var bulletMaterial = new THREE.MeshBasicMaterial({color:0x00ff33});
		var bulletGeometry = new THREE.CubeGeometry(20,20,150,1,1,1);
		var bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
		return bullet;
	};
	
	function makeBullet() {
		var bulletMaterial = new THREE.MeshBasicMaterial({color:0x00d4dc});
		var bulletGeometry = new THREE.CubeGeometry(5,5,50,1,1,1);
		var bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
		return bullet;
	};

	var jsonLoader = new THREE.ObjectLoader();
		jsonLoader.load("models/enemy.json", function (obj) {
			enemyObj = obj;
			//enemyObj.scale.set(2, 2, 2);
		});

	return {
		makeCube: makeCube,
		makeBullet: makeBullet,
		makeBigBullet,
		loadGems : loadGems,
		makeGem : makeGem,
		loadEnemyTextures : loadEnemyTextures,
		makeEnemy : makeEnemy,
		makeEnemyBullet: makeEnemyBullet
	};

})()