var container, scene, camera, renderer, controls;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var person;
var gravity = new THREE.Vector3(0, -15, 0);
var walls = [];

init();
animate();

function init() {
    scene = new THREE.Scene();
    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 1,
        FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    scene.background = new THREE.Color(0xbfd1e5);
    scene.fog = new THREE.Fog(0xcccccc, 1000, 3000);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);

    /*var skyGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyMaterial = new THREE.MeshPhongMaterial({
        color: 0xbfd1e5
    });
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);*/

    person = new THREE.Object3D();
    person.add(camera);
    camera.position.set(0, 35, 10);
    person.position.set(-600, 100, 500);
    person.rotation.y = -Math.PI / 2.0;

    boundingG = new THREE.CubeGeometry(40, 80, 40);
    boundingG.computeBoundingSphere();
    boundingM = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        wireframe: true
    });
    bounding = new THREE.Mesh(boundingG, boundingM);
    bounding.visible = false;
    person.add(bounding);

    person.velocity = new THREE.Vector3(0, 0, 0);

    scene.add(person);

    this.cubeG = [];
    for (let i = 1; i < 4; i++) {
        cubeG[i] = new THREE.CubeGeometry(50, 50, 50);
    }
    for (let i = 4; i < 10; i++) {
        cubeG[i] = new THREE.CubeGeometry(50, 50);
    }

    var cubeM = [];
    var cubeC = ["green","green","lightgreen","blue","red","green","green","green","green","green","green"];
    for (let i = 1; i < 11; i++) {
        cubeM[i] = new THREE.MeshPhongMaterial({
            color: cubeC[i]
        });
    }
 
    var mergedGeo = [];
    for (var i = 0; i < 10; i++)
        mergedGeo[i] = new THREE.Geometry();

    for (var y = 0; y < cubeMap.length; y++)
        for (var x = 0; x < cubeMap[0].length; x++)
            for (var z = 0; z < cubeMap[0][0].length; z++) {
                var style = cubeMap[y][x][z];
                if (style == 0) continue;
                var cube = new THREE.Mesh(cubeG[style]);
                cube.position.set(50 * (cubeMap[0].length - x), 50 * y, 50 * z);
                if (style == 4 || style == 7)
                    cube.rotation.set(0, -Math.PI / 2, 0);
                if (style == 6 || style == 9)
                    cube.rotation.set(-Math.PI / 2, 0, 0);
                cube.updateMatrix();
                mergedGeo[style].merge(cube.geometry, cube.matrix);

            }

    for (var i = 1; i < 10; i++) {
        var mesh = new THREE.Mesh(mergedGeo[i], cubeM[i]);
        scene.add(mesh);
        walls.push(mesh);
    }

    var floorGeometry = new THREE.PlaneBufferGeometry(5000, 5000, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);
    var floorMaterial = new THREE.MeshBasicMaterial({
        color: "green"
    });
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, -50, 0);
    walls.push(floor);
    scene.add(floor);

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    this.mouseLook = {
        x: 0,
        y: 0
    };
    document.addEventListener('click', function (event) {
        var havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
        if (!havePointerLock) return;
        var element = document.body;
        element.requestPointerLock = element.requestPointerLock ||
            element.mozRequestPointerLock ||
            element.webkitRequestPointerLock;
        element.requestPointerLock();

        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
    }, false);
}

function moveCallback(e) {
    var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    mouseLook.x += movementX;
    mouseLook.y += movementY;
}

function pointerLockChange(event) {
    var element = document.body;
    if (document.pointerLockElement === element ||
        document.mozPointerLockElement === element ||
        document.webkitPointerLockElement === element) {
        document.addEventListener("mousemove", moveCallback, false);
    } else {
        document.removeEventListener("mousemove", moveCallback, false);
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    var delta = clock.getDelta();
    var moveDistance = 200 * delta;
    var rotateAngle = Math.PI / 4 * delta;

    if (keyboard.pressed("P")) {
        camera.position.set(0, 35, 10);
        person.position.set(50, 100, 50);
        person.rotation.y = -Math.PI / 2.0;
        person.velocity = new THREE.Vector3(0, 0, 0);
    }

    var move = {
        xDist: 0,
        yAngle: 0,
        zDist: 0
    };

    if (navigator.getGamepads()) {
        var pad = navigator.getGamepads()[0];
        if (pad !== null) {
            if (Math.abs(pad.axes[1]) > 0.15)
                move.zDist += moveDistance * pad.axes[1];
            if (Math.abs(pad.axes[0]) > 0.15)
                move.xDist += moveDistance * pad.axes[0];
            if (Math.abs(pad.axes[2]) > 0.15)
                move.yAngle -= rotateAngle * pad.axes[2];
            if (Math.abs(pad.axes[3]) > 0.15)
                camera.rotateX(-rotateAngle * pad.axes[3]);
            if (pad.buttons[7].pressed && (person.velocity.y == 0))
                person.velocity = new THREE.Vector3(0, 6, 0);
        }
    }

    if (keyboard.pressed("W"))
        move.zDist -= moveDistance;
    if (keyboard.pressed("S"))
        move.zDist += moveDistance;
    if (keyboard.pressed("Q"))
        move.yAngle += rotateAngle;
    if (keyboard.pressed("E"))
        move.yAngle -= rotateAngle;
    if (keyboard.pressed("A"))
        move.xDist -= moveDistance;
    if (keyboard.pressed("D"))
        move.xDist += moveDistance;

    move.yAngle -= rotateAngle * mouseLook.x * 0.1;
    mouseLook.x = 0;

    person.translateZ(move.zDist);
    person.rotateY(move.yAngle);
    person.translateX(move.xDist);
    person.updateMatrix();

    if (keyboard.pressed("3"))
        camera.position.set(0, 50, 250);
    if (keyboard.pressed("1"))
        camera.position.set(0, 35, 10);
    if (keyboard.pressed("R"))
        camera.rotateX(rotateAngle);
    if (keyboard.pressed("F"))
        camera.rotateX(-rotateAngle);

    camera.rotateX(-rotateAngle * mouseLook.y * 0.05);
    mouseLook.y = 0;

    camera.rotation.x = THREE.Math.clamp(camera.rotation.x, -1.04, 1.04);
    if (keyboard.pressed("R") && keyboard.pressed("F"))
        camera.rotateX(-6 * camera.rotation.x * rotateAngle);

    if (collision(walls)) {
        person.translateX(-move.xDist);
        person.rotateY(-move.yAngle);
        person.translateZ(-move.zDist);
        person.updateMatrix();

        if (collision(walls))
            console.log("Something's wrong with collision...");

    }

    if (keyboard.pressed("space") && (person.velocity.y == 0))
        person.velocity = new THREE.Vector3(0, 10, 0);

    person.velocity.add(gravity.clone().multiplyScalar(delta));
    person.translateY(person.velocity.y);
    person.updateMatrix();
    if (collision(walls)) {
        person.translateY(-person.velocity.y);
        person.updateMatrix();
        person.velocity = new THREE.Vector3(0, 0, 0);
    }
}

function collision(wallArray) {
    for (var vertexIndex = 0; vertexIndex < person.children[1].geometry.vertices.length; vertexIndex++) {
        var localVertex = person.children[1].geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(person.matrix);
        var directionVector = globalVertex.sub(person.position);

        var ray = new THREE.Raycaster(person.position, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(wallArray);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())
            return true;
    }
    return false;
}

function render() {
    renderer.render(scene, camera);
}