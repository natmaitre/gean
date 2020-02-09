var particles = (function () {

	var clock = new THREE.Clock();
	var camera;
	var spaceship;
	var scene;

	var collection = [];
	var engine;

	function init(_scene, _camera, _spaceship) {
		scene = _scene;
		camera = _camera;
		spaceship = _spaceship;
	};

	function startSmoke(obj) {
		engine = new ParticleEngine();
		var smokeValues = Examples.smoke;
		smokeValues.positionBase.x = obj.position.x - 0;
		smokeValues.positionBase.y = obj.position.y + 7;
		smokeValues.positionBase.z = obj.position.z + 25;
		engine.setValues(smokeValues);
		engine.initialize();
		scene.add(engine.particleMesh);
	}

	function stopSmoke() {
		if (engine && engine.particleMesh) {
			scene.remove(engine.particleMesh);
		}
	}

	function getFlare() {
		var f = new Flare();
		collection.push(f);
		return collection[0];
	};

	function Flare() {

		this.particleGeometry = new THREE.Geometry();
		for (var i = 0; i < 10; i++) {
			this.particleGeometry.vertices.push( new THREE.Vector3(0,0,0) );
		}

		var discTexture = THREE.ImageUtils.loadTexture( 'gfx/disc.png' );

		// properties that may vary from particle to particle. 
		// these values can only be accessed in vertex shaders! 
		//  (pass info to fragment shader via vColor.)
		this.attributes = {
			customColor:	 { type: 'c',  value: [] },
			customOffset:	 { type: 'f',  value: [] },
		};

		var particleCount = this.particleGeometry.vertices.length
		for( var v = 0; v < particleCount; v++ ) {
			this.attributes.customColor.value[ v ] = new THREE.Color().setHSL( 7.0, 0.8 - v / particleCount, 0.5 );
			//this.attributes.customColor.value[ v ] = new THREE.Color("rgb(225,225,225)");
			this.attributes.customOffset.value[ v ] = 6.282 * (v / particleCount); // not really used in shaders, move elsewhere
		}

		// values that are constant for all particles during a draw call
		this.uniforms = {
			time:      { type: "f", value: 1.0 },
			texture:   { type: "t", value: discTexture },
		};

		var shaderMaterial = new THREE.ShaderMaterial( {
			uniforms:				this.uniforms,
			attributes:     this.attributes,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
			transparent: true, // alphaTest: 0.5,  // if having transparency issues, try including: alphaTest: 0.5, 
			// blending: THREE.AdditiveBlending, depthTest: false,
			// I guess you don't need to do a depth test if you are alpha blending
			// 
		});

		// WARNING: Not used right now
		this.tick = function () {
			if (!engine) return;
			var dt = clock.getDelta();
			engine.update( dt * 0.5 );
			return;
			/*
			var t0 = clock.getElapsedTime();
			this.uniforms.time.value = 0.125 * t0;

			for( var v = 0; v < this.particleGeometry.vertices.length; v++ ) {
			var timeOffset = this.uniforms.time.value + this.attributes.customOffset.value[ v ];
			this.particleGeometry.vertices[v] = position(timeOffset);		
			}

			particleCube.position.y = camera.position.y + 100;
			particleCube.position.z = spaceship.position.z - 260;
			*/
		};

		/*
		var particleCube = new THREE.ParticleSystem( this.particleGeometry, shaderMaterial );
		particleCube.position.set(spaceship.position.x, spaceship.position.y, spaceship.position.z - 10);
		particleCube.dynamic = true;
		// in order for transparency to work correctly, we need sortParticles = true.
		//  but this won't work if we calculate positions in vertex shader,
		//  so positions need to be calculated in the update function,
		//  and set in the geometry.vertices array
		particleCube.sortParticles = true;
		scene.add( particleCube );
		*/

		return this;
	};

	function tick() {
		if (!engine) return;
		var dt = clock.getDelta();
		engine.update( dt * 0.5 );
		return;
		//for (var i=0; i<collection.length; i++) {
			//collection[i].tick();
		//}
	};

	function position(t) {
		// x(t) = cos(2t)*(3+cos(3t))
		// y(t) = sin(2t)*(3+cos(3t))
		// z(t) = sin(3t)
		return new THREE.Vector3(
			20.0 * Math.cos(2.0 * t),
			20.0 * Math.sin(2.0 * t),
			50.0 * Math.sin(3.0 * t) );
			/*
			return new THREE.Vector3(
			20.0 * Math.cos(2.0 * t) * (3.0 + Math.cos(3.0 * t)),
			20.0 * Math.sin(2.0 * t) * (3.0 + Math.cos(3.0 * t)),
			50.0 * Math.sin(3.0 * t) );
			*/
	};

	return {
		init: init,
		tick: tick,
		getFlare: getFlare,
		startSmoke: startSmoke,
		stopSmoke: stopSmoke
	};

})()


