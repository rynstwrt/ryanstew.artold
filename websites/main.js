"use strict";
function createScene(canvas, engine) {
    // Scene
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    // Shape
    var shape = BABYLON.MeshBuilder.CreateIcoSphere('shape', { radius: 25, subdivisions: 2 }, scene);
    var shapeMat = new BABYLON.StandardMaterial('shapemat', scene);
    shapeMat.emissiveColor = BABYLON.Color3.FromHexString('#FEC7A5');
    shapeMat.wireframe = true;
    shape.material = shapeMat;
    // Camera
    var camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 2, 300, BABYLON.Vector3.Zero(), scene);
    //camera.attachControl(canvas, false);
    var cameraAnimY = new BABYLON.Animation('cameraanimy', 'alpha', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    var cameraAnimX = new BABYLON.Animation('cameraanimx', 'beta', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
    var keys = [];
    keys.push({
        frame: 0,
        value: 0
    });
    keys.push({
        frame: 120,
        value: Math.PI / 2
    });
    cameraAnimY.setKeys(keys);
    cameraAnimX.setKeys(keys);
    camera.animations = [cameraAnimY, cameraAnimX];
    scene.beginAnimation(camera, 0, 120, true, .25);
    // Return
    return scene;
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
