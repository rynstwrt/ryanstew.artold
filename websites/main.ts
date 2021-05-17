function createScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine)
{
	// Scene
	const scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

	// Shape
	const shape = BABYLON.MeshBuilder.CreateIcoSphere('shape',
	{ radius: 25, subdivisions: 2 }, scene);

	const shapeMat = new BABYLON.StandardMaterial('shapemat', scene);
	shapeMat.emissiveColor = BABYLON.Color3.FromHexString('#FEC7A5');
	shapeMat.wireframe = true;
	shape.material = shapeMat;

	// Camera
	const camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 2, 300, BABYLON.Vector3.Zero(), scene);
	//camera.attachControl(canvas, false);

	const cameraAnimY = new BABYLON.Animation('cameraanimy', 'alpha', 60,
	BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);

	const cameraAnimX = new BABYLON.Animation('cameraanimx', 'beta', 60,
	BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);

	const keys = [];
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

window.addEventListener('DOMContentLoaded', () =>
{
	const canvas = document.querySelector('canvas');
	const engine = new BABYLON.Engine(canvas, true);
	const scene = createScene(canvas!, engine);

	engine.runRenderLoop(() => scene.render());
	window.addEventListener('resize', () => {
		engine.resize();
	});
});
