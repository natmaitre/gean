function clickEvent() {
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