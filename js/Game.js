var container, scene, camera, renderer, controls;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var person;
var character;
var gravity = new THREE.Vector3(0, -15, 0);
var walls = [];
var bodyAnims = null;

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

    initLight(scene);

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

    character = new THREEx.MinecraftChar();
    character.root.position.set(-450, -10, 500);
    character.root.scale.set(40,40,40);
    scene.add(character.root);
    bodyAnims = new THREEx.MinecraftCharBodyAnimations(character);
    bodyAnims.start('walk');

    initBlocks (scene, walls);

    initFloor(scene, walls);

    this.mouseLook = {
        x: 0,
        y: 0
    };
    
    clickEvent();
}

function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

function update() {
    var delta = clock.getDelta();
    var moveDistance = 250 * delta;
    var rotateAngle = Math.PI / 4 * delta;

    if (bodyAnims != null) {
        character.root.position.z = character.root.position.z + 50 * delta;
        bodyAnims.update(delta);
    }

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
                person.velocity = new THREE.Vector3(0, 12, 0);
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
        person.velocity = new THREE.Vector3(0, 12, 0);

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