var obstacles = (function () {

	console.log(objects);
	if (typeof objects !== 'object') throw new Error('mising object dependency')

	var collidableMeshList = [];
	var frameCounter = 0;
	var tickCounter = 0;

	var scene;
	var camera;
	var player;
	var leftBound;
	var rightBound;
	var oldCubes = [];
	var cubes = [];
	var started = false;
	var baseCubeFrequency = 30;
	var cubeFrequency = 28;
	var maxCubeVelocity = 4;
	
	var gemThreshold = 300;
	var gemBaseThreshold = 300;
	var gemCounter = 0;
	var gems = [];
	var gemCollisionBox = new THREE.Vector3(75,75,75);
	var maxGems = 1;
	
	var enemyThreshold = 300;
	var enemyThresholdBase = 300;
	var enemyCounter = 0;
	var enemies = [];
	var maxEnemies = 50;
	var oldEnemies = [];
	
	var bullets = [];
	
	var enemyBullets = [];
	var oldEnemyBullets = [];
	
	var difficulty = 1;
	
	
	function init(_scene, _camera, _leftBound, _rightBound, _player) {
		scene = _scene;
		camera = _camera;
		player = _player;
		leftBound = _leftBound;
		rightBound = _rightBound;
		started = false;
	};
	
	function isStarted() {
		return started;
	}
	
	function tick() {
		if (!started) return;
		
		frameCounter = frameCounter + 1;
		tickCounter++;
		
		
		
		if (tickCounter > cubeFrequency) {
			tickCounter = 0;
			addBox();
			
		}
		
		for (var i=0;i<cubes.length;i++) {
			var thisCube = cubes[i];
			thisCube.position.x += thisCube.vx;
			thisCube.position.y += thisCube.vy;
			thisCube.position.z += thisCube.vz;
			
			if (thisCube.vz < 0) thisCube.vz *= 0.95;
			if (thisCube.vz > -1) thisCube.vz = 0;
			
			if (thisCube.vr !=0) {
				thisCube.rotation.y += thisCube.vr;
				thisCube.rotation.x += thisCube.vr;
			}
			if (thisCube.position.z > camera.position.z) {
				cubes.splice(i,1);
				scene.remove(thisCube);
				//thisCube.dispose();
				oldCubes.push(thisCube);
			}
		}
		
		gemCounter++;
		if(gemCounter > gemThreshold && gems.length < maxGems) {
			gemCounter = 0;
			gemThreshold += getRandomInt(-50,50);
			var rand = getRandomInt(0+difficulty,2+difficulty);
			var color;
			
			if (rand <= 3) {
				color = "blue";
			} else if (rand <= 5) {
				color = "green";
			} else if (rand <= 7) {
				color = "red";
			} else {
				color = "white";
			}
			
			var gem = objects.makeGem(color);
			gem.position.z = camera.position.z - 3000;
			gem.position.x = getRandomInt(leftBound,rightBound);
			gem.position.y = getRandomInt(50,450);
			scene.add(gem);
			gems.push(gem);
			
		}
		
		for (var i=0;i<gems.length;i++) {
			var g = gems[i];
			g.rotation.y += 0.04;
			if (g.position.z > camera.position.z) {
				gems.splice(i,1);
				scene.remove(g);
			}
		
		}
		
		for (var i=0;i<enemyBullets.length;i++) {
			var e = enemyBullets[i];
			e.position.x += e.vx;
			e.position.y += e.vy;
			if (e.position.z > player.z) {
				enemyBullets.splice(i,1);
				scene.remove(e);
				oldEnemyBullets.push(e);
			}
		}
		
		/*
		var eb;
		
		if(oldEnemyBullets.length > 0) 
			eb = oldEnemyBullets.pop();
		else 
			eb = objects.makeEnemyBullet();
			
		eb.position.set(0,200,player.z-1000);
		eb.scale.set(64,64,1);
		eb.vx = getRandomInt(-10,10);
		eb.vy = getRandomInt(-10,10);
		enemyBullets.push(eb);
		scene.add(eb);
		
		for (var i=0;i<enemyBullets.length;i++) {
			var e = enemyBullets[i];
			e.position.x += e.vx;
			e.position.y += e.vy;
			if (e.position.z > player.z) {
				enemyBullets.splice(i,1);
				scene.remove(e);
				oldEnemyBullets.push(e);
			}
		}*/
	
		if (difficulty >= 3) {
			enemyCounter++;
			if (enemyCounter > enemyThreshold && enemies.length < maxEnemies) {
				enemyCounter = 0;
				var enemy;
				if (oldEnemies.length > 0) 
					enemy = oldEnemies.pop();
				else 
					var enemy = objects.makeEnemy();
				
				var rand = getRandomInt(0,1);
				if (rand == 0) {
					enemy.position.set(leftBound*2,500,player.z - 2000);
					enemy.vx = getRandomInt(120,200);
					enemy.vy = -5;
				} else {
					enemy.position.set(rightBound*2,500,player.z - 2000);
					enemy.vx = -getRandomInt(120,200);
					enemy.vy = -5;
				}
				enemy.scale.set(256,256,1);
				enemy.vz = -player.vz;
				enemy.firing = false;
				enemy.doneFiring = false;
				enemy.fireCount = 0;
				enemy.fireCounter = 0;
				enemies.push(enemy);
				scene.add(enemy);

			}
			
			for (var i=0;i<enemies.length;i++) {
				
				
				var e = enemies[i];
				
				if(e.firing) {
					e.fireCounter++;
					if (e.fireCounter > 15) {
						e.fireCount++;
						e.fireCounter = 0;
						fireEnemyBullet(e.position.x, e.position.y, e.position.z);
						if(e.fireCount > 20) {
							e.firing = false;
							e.doneFiring = true;
							var rand = getRandomInt(0,1);
							if (rand == 0) e.vx = 15;
							else e.vx = -15;
							e.vy = 30;
						}
					}
				} 
				else {
					e.position.x += e.vx;
					e.position.y += e.vy;
					
						if(!e.doneFiring) {
						e.vy += 0.05;
						e.vx *= 0.95;
						
						var afterDir = getRandomInt(0,1);
						if(afterDir == 0) afterDir = -1;
						
						if(Math.abs(e.vx) < 2) {
							
							e.vx = 0;
							e.firing = true;
							e.fireCount = 0;
							e.vx = 10 * afterDir;
							
						}
					
					}
					
					
					if (e.position.y > 1500) {
						enemies.splice(i,1);
						scene.remove(e);
						oldEnemies.push(e);
					}
				}
				
				e.position.z += e.vz;
					
		}
		}
	};
	
	function fireEnemyBullet(originX,originY,originZ) {
		var eb;
		
		if(oldEnemyBullets.length > 0) 
			eb = oldEnemyBullets.pop();
		else 
			eb = objects.makeEnemyBullet();
		
		//var dx = originX - player.x;
		//var dy = originY - player.y;
		//var dz = originZ - player.z;
		//console.log(dz);
		//var ang = Math.atan2(dy,dx);
		//var angX = Math.atan2(dz,dx);
		//var angY = Math.atan2(dz,dy);
		
		var bulletSpeed = player.vz/2;
		//var bvx = bulletSpeed * Math.cos(ang);
		//var bvy = bulletSpeed * Math.sin(ang);
			
		eb.position.set(originX,originY,originZ);
		eb.scale.set(64,64,1);
		eb.vx = 0;
		eb.vy = 0;
		eb.vz = 5;
		enemyBullets.push(eb);
		scene.add(eb);
		
		
	}
	function increaseDifficulty() {
		difficulty++;
		if (difficulty >= 7) cubeFrequency -= 1;
		else cubeFrequency -= 4;
		if (cubeFrequency < 4) cubeFrequency = 4;
		
		enemyThreshold -= 10;
		if (enemyThreshold < 120) enemyThreshold = 120;
		
	}
	
	function reset() {
		difficulty = 1;
		
		while(enemies.length > 0) {
			e = enemies.pop();
			scene.remove(e);
			oldEnemies.push(e);
		
		}
		
		while(enemyBullets.length > 0) {
			e = enemyBullets.pop();
			scene.remove(e);
			oldEnemyBullets.push(e);
		
		}
		
		while(cubes.length > 0) {
			c = cubes.pop();
			scene.remove(c);
			oldCubes.push(c);
		}
		gemThreshold = gemBaseThreshold;
		while (gems.length > 0) {
			g = gems.pop();
			scene.remove(g);	
		}
		enemyThreshold = enemyThresholdBase;
		tickCounter = 0;
		cubeFrequency = baseCubeFrequency;
		start();
	}
	
	function start() {
		started = true;
	}
	
	function limitValue(value,limit) {
		if (value < -limit) value = -limit;
		else if (value > limit) value = limit;
		return value;
	}
	
	

	function addBox() {
		
		var cube;
		if (oldCubes.length > 0)  {
			cube = oldCubes.pop();
			
		} else { 		
			cube = objects.makeCube({x:getRandomInt(175,1000), y:getRandomInt(175,850), z:getRandomInt(120,400)});
			
		}
		var vLimit = difficulty;
		if (vLimit > 4) vLimit = 4;
		
		cube.vx = 0;
		cube.vy = 0;
		cube.vz = 0;
		cube.vr = 0;
		cube.rotation.y = 0;
		cube.rotation.x = 0;
		
		if (difficulty >= 7) {
			cube.vz = getRandomInt (0, -vLimit);
			cube.vx = getRandomInt (-vLimit,vLimit);
			cube.vy = getRandomInt (-vLimit,vLimit);
		} else if (difficulty >= 5) {
			var rand = getRandomInt(0,2); 
			if (rand == 1) cube.vy = getRandomInt (-vLimit,vLimit);
			else cube.vx = getRandomInt (-vLimit,vLimit);
		} else if (difficulty >= 3) 
			cube.vx = getRandomInt (-vLimit,vLimit);
		else {
			cube.vx = 0;
			cube.vy = 0;
		}
		
		var newX = getRandomInt(leftBound-500,rightBound+500);
		//var newX = 0;
		if (difficulty >= 6) {
			var newY = getRandomInt(-500,1000);
			if (newY < 0 && cube.vy < 0) cube.vy *= -1;
		} else 
			var newY = getRandomInt(0,1000);
		
		var newZ = getRandomInt(-4900,-5900) + camera.position.z;
		cube.position.set(newX, newY, newZ);
		
		
		scene.add(cube);
		//collidableMeshList.push(cube);
		cubes.push(cube);
	}
	
	function collidePlayerBullets(bullets) {
		for (var i=0;i<bullets.length;i++) {
			var obj = bullets[i];
			//var hitCube = collideCubes(obj);
			/*
			if (hitCube != null) {
				hitCube.vy = -10;
				hitCube.vz = -35;
				hitCube.vr = -0.01;
			}
			*/
			
			for (var j=0;i<enemies.length;i++) {
				var e = enemies[j];
				var cx = e.position.x;
				var ox = obj.position.x;
				var cz = e.position.z;
				var oz = obj.position.z;
				var cy = e.position.y;
				var oy = obj.position.y;
				
				if(oz < cz + 128) {
					
					if(oy > cy -128 && oy < cy + 128) {
					
						if(ox > cx -128 && ox < cx + 128) {
						
							e.doneFiring = true;
							scene.remove(e);
							enemies.splice(i,1);
							oldEnemies.push(e);
						}
					}
				}	
					
			}
			
		}
		
		
		
		//return null;
	}

	function collideEnemyBullets(obj) {
		for (var i=0;i<enemyBullets.length;i++) {
		
			var eb = enemyBullets[i];
			var cx = eb.position.x;
			var ox = obj.position.x;
			var cz = eb.position.z;
			var oz = obj.position.z;
			var cy = eb.position.y;
			var oy = obj.position.y;
			
			if(oz < cz + 50) {
				
				if(oy > cy - 50 && oy < cy + 50) {
					//console.log("hit!");
					if(ox > cx -50 && ox < cx + 50) {
						//console.log("hit!");
						return true;
					}
				}
			}
		}
	}
	
	function collideCubes(obj) {
		for (var i=0;i<cubes.length;i++) {
			var cube = cubes[i];
			var bb = cube.geometry.boundingBox;
			var cx = cube.position.x;
			var ox = obj.position.x;
			var cz = cube.position.z;
			var oz = obj.position.z;
			var cy = cube.position.y;
			var oy = obj.position.y;
			
			
			
			if(oz < cz + bb.max.z) {
				
				if(oy > cy + bb.min.y && oy < cy + bb.max.y) {
				
					if(ox > cx + bb.min.x && ox < cx + bb.max.x) {
					
						return cube;
					}
				}
			}	
				
		}
		return null;
	};
	
	function collideGems(obj) {
		for (var i=0;i<gems.length;i++) {
			var gem = gems[i];
			//console.log(gem.geometry.boundingBox);
			var gx = gem.position.x;
			var ox = obj.position.x;
			var gz = gem.position.z;
			var oz = obj.position.z;
			var gy = gem.position.y;
			var oy = obj.position.y;	
			//console.log(gx,ox,gz,oz,gy,oy);
			if(oz > gz - gemCollisionBox.z && oz < gz + gemCollisionBox.z) {
				
				if(oy > gy - gemCollisionBox.y && oy < gy + gemCollisionBox.y) {
				
					if(ox > gx - gemCollisionBox.x && ox < gx + gemCollisionBox.x) {
						gems.splice(i,1);
						scene.remove(gem);
						return gem;
					}
				}
			}
		}
		
		return null;
	}

	return {
		init: init,
		tick: tick,
		collideCubes: collideCubes,
		collideGems: collideGems,
		reset: reset,
		isStarted: isStarted,
		increaseDifficulty: increaseDifficulty,
		collidePlayerBullets: collidePlayerBullets,
		collideEnemyBullets: collideEnemyBullets
	};

})()


