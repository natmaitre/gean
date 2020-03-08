function initFloor(scene, walls) {
    var floorGeometry = new THREE.PlaneBufferGeometry(5000, 5000, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);
    var floorTexture = new THREE.TextureLoader().load("textures/minecraft/textures/block/green_wool.png");
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(100, 100);
    var floorMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture,
        side: THREE.DoubleSide
    });
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, -50, 0);
    walls.push(floor);
    scene.add(floor);
}