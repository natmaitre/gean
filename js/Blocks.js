const CubeT = 10;
var cubeG = [];
var mergedGeo = [];

for (let i = 1; i < CubeT; i++) {
    cubeG[i] = new THREE.CubeGeometry(50, 50, 50);
    mergedGeo[i] = new THREE.Geometry();
}

for (var y = 0; y < cubeMap.length; y++) {
    for (var x = 0; x < cubeMap[0].length; x++) {
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
    }
}

var cubeC = [
    "textures/minecraft/textures/block/atlas.png",
    "textures/minecraft/textures/block/stone_bricks.png",
    "textures/minecraft/textures/block/acacia_planks.png", 
    "textures/minecraft/textures/block/stone.png",
    "textures/minecraft/textures/block/oak_log.png",
    "textures/minecraft/textures/block/jungle_log.png",
    "textures/minecraft/textures/block/spruce_log.png",
    "textures/minecraft/textures/block/anvil.png",
    "textures/minecraft/textures/block/bricks.png",
    "textures/minecraft/textures/block/acacia_log_top.png"
];


function initBlocks(scene, walls) {
    for (var i = 1; i < CubeT; i++) {
        var texture = new THREE.TextureLoader().load(cubeC[i]);
        var mesh = new THREE.Mesh(mergedGeo[i], new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.DoubleSide
        }));
        texture.magFilter = THREE.NearestFilter;
        scene.add(mesh);
        walls.push(mesh);
    }
}