"use strict";
// diffuse: basic color of object
// groundColor: light in opposite direction color
// specular: highlight color of object
function createScene(canvas, engine) {
    // Scene
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    // Grid
    var amount = 50;
    var width = 2;
    var height = 10;
    var depth = 5;
    var margin = 1;
    var shapeAnim = new BABYLON.Animation('shapeanim', 'rotation.z', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    var keys = [];
    keys.push({
        frame: 0,
        value: 0
    });
    keys.push({
        frame: 120,
        value: Math.PI * 2
    });
    shapeAnim.setKeys(keys);
    var gridPositions = getGridPositions(amount, width, height, margin);
    gridPositions.forEach(function (position, i) {
        var shape = BABYLON.MeshBuilder.CreateBox('box', { width: width, height: height, depth: depth }, scene);
        shape.position = position;
        shape.animations.push(shapeAnim);
        setTimeout(function () {
            scene.beginAnimation(shape, 0, 120, true);
        }, i);
    });
    // Camera
    var camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 1200, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    // Lights
    var light = new BABYLON.PointLight('light', camera.position, scene);
    light.intensity = 1;
    // Return
    return scene;
}
function getGridPositions(amount, width, height, margin) {
    var positions = [];
    var range = Math.floor(amount / 2);
    var maxDim = Math.max(width, height);
    var inc = maxDim + margin;
    for (var i = -range; i < range; ++i) {
        for (var j = -range; j < range; ++j) {
            positions.push(new BABYLON.Vector3(i * inc, j * inc, 0));
        }
    }
    console.log(positions);
    return positions;
}
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.querySelector('canvas');
    var engine = new BABYLON.Engine(canvas, true);
    var scene = createScene(canvas, engine);
    engine.runRenderLoop(function () { return scene.render(); });
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
