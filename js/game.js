import * as THREE from './three.module.js';

import {
    PointerLockControls
} from './PointerLockControls.js';

var camera, scene, renderer, controls;
var objects = [];
var raycaster;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color();

var euler = new THREE.Euler(0, 0, 0, 'YXZ');
var PI_2 = Math.PI / 2;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbfd1e5 );
    scene.fog = new THREE.Fog(0xcccccc);

    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    controls = new PointerLockControls(camera, document.body);

    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');
    var crosshair = document.getElementById('crosshair');

    instructions.addEventListener('click', function () {
        controls.lock();
    }, false);

    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
        crosshair.style.display = 'block';
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
        crosshair.style.display = 'none';
    });

    scene.add(controls.getObject());

    var onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38: // up
                moveForward = true;
                break;
            case 37: // left
                moveLeft = true;
                break;
            case 40: // down
                moveBackward = true;
                break;
            case 39: // right
                moveRight = true;
                break;
            case 32: // space
                if (canJump === true) velocity.y += 250;
                canJump = false;
                break;
        }
    };

    var onKeyUp = function (event) {
        switch (event.keyCode) {
            case 38: // up
                moveForward = false;
                break;
            case 37: // left
                moveLeft = false;
                console.log(objects[0].position)
                break;
            case 40: // down
                moveBackward = false;
                break;
            case 39: // right
                moveRight = false;
                console.log(camera.position)
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(-1, -1, -1), 0, 10);

    var floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);

    var floorMaterial = new THREE.MeshBasicMaterial({
        color: "green"
    });

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);

    var boxGeometry = new THREE.BoxBufferGeometry(10, 10, 10);

    for (var i = 0; i < 2; i++) {
        var boxMaterial = new THREE.MeshPhongMaterial({
            color: "green"
        });
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        box.position.y = 10;
        box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
        scene.add(box);
        objects.push(box);
    }

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    if (navigator.getGamepads()) {
        var pads = navigator.getGamepads();
        var pad = pads[0];
        if (pad !== null) {
            if (pad.buttons[12].pressed || (pad.axes[1] < -0.5))
                moveForward = true;
            else moveForward = false;
            if (pad.buttons[13].pressed || (pad.axes[1] > 0.5))
                moveBackward = true;
            else moveBackward = false;
            if (pad.buttons[14].pressed || (pad.axes[0] < -0.5))
                moveLeft = true;
            else moveLeft = false;
            if (pad.buttons[15].pressed || (pad.axes[0] > 0.5))
                moveRight = true;
            else moveRight = false;

            if (pad.buttons[1].pressed) {
                console.log(controls.getObject().position)
            }

            if (pad.buttons[7].pressed) {
                if (canJump === true) velocity.y += 250;
                canJump = false;
            }
            if (pad.buttons[8].pressed) {
                controls.dispatchEvent({
                    type: 'unlock'
                });
            }
            if (pad.buttons[9].pressed) {
                controls.lock();
            }

            if ((pad.axes[2] !== 0) || (pad.axes[3] !== 0)) {
                euler.setFromQuaternion(camera.quaternion);
                euler.y -= pad.axes[2] * 0.03;
                euler.x -= pad.axes[3] * 0.03;
                euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
                camera.quaternion.setFromEuler(euler);
            }
        }
    }

    requestAnimationFrame(animate);
    if (controls.isLocked === true) {
        var time = performance.now();
        var delta = (time - prevTime) / 1000;
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        /*if (onObject === true) {
            console.log("hit");
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }*/

        var onObject = false;
        for (let i = 0; i < objects.length; i++) {
            if ((objects[i].position.x + 5 <= camera.position.x) &&
                (objects[i].position.x - 5 >= camera.position.x) &&
                (objects[i].position.z + 5 <= camera.position.z) &&
                (objects[i].position.z - 5 >= camera.position.z)) {
                    console.log("Hit");
                    onObject = true;
                }
        }
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        controls.getObject().position.y += (velocity.y * delta);

        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        prevTime = time;
    }
    renderer.render(scene, camera);
}