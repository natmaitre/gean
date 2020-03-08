function initLight(scene) {
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);
}