"use strict";
function createScene(canvas, engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    var sphere = BABYLON.MeshBuilder.CreateIcoSphere('sphere', {
        radius: 100,
        subdivisions: 1
    }, scene);
    var sphereMat = new BABYLON.StandardMaterial('spheremat', scene);
    sphereMat.emissiveColor = BABYLON.Color3.FromHexString('#96f28a');
    sphereMat.wireframe = true;
    sphereMat.alpha = .5;
    sphere.material = sphereMat;
    var cameraAnimY = new BABYLON.Animation('camanimy', 'rotation.y', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var cameraAnimZ = new BABYLON.Animation('camanimz', 'rotation.z', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var cameraKeys = [];
    cameraKeys.push({
        frame: 0,
        value: 0
    });
    cameraKeys.push({
        frame: 120,
        value: Math.PI * 2
    });
    cameraAnimY.setKeys(cameraKeys);
    cameraAnimZ.setKeys(cameraKeys);
    sphere.animations.push(cameraAnimY);
    sphere.animations.push(cameraAnimZ);
    scene.beginAnimation(sphere, 0, 120, true, .025);
    var camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 2, 300, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);
    return scene;
}
window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.querySelector('canvas');
    var engine = new BABYLON.Engine(canvas, true);
    var scene = createScene(canvas, engine);
    engine.runRenderLoop(function () { return scene.render(); });
    window.addEventListener('resize', function () { return engine.resize(); });
});
