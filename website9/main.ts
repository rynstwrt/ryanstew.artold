// diffuse: basic color of object
// groundColor: light in opposite direction color
// specular: highlight color of object
function createScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine)
{
	// Scene
	const scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

	// Grid
	const amount = 50;
	const width = 2;
	const height = 10;
	const depth = 5;
	const margin = 1;

	const shapeAnim = new BABYLON.Animation('shapeanim', 'rotation.z', 30,
	BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
	const keys = [];
	keys.push({
		frame: 0,
		value: 0
	});
	keys.push({
		frame: 120,
		value: Math.PI * 2
	});
	shapeAnim.setKeys(keys);

	const gridPositions = getGridPositions(amount, width, height, margin);
	gridPositions.forEach((position, i) => {
		const shape = BABYLON.MeshBuilder.CreateBox('box', { width: width, height: height, depth: depth }, scene);
		shape.position = position;
		shape.animations.push(shapeAnim);

		setTimeout(() =>
		{
			scene.beginAnimation(shape, 0, 120, true);
		}, i);
	});

	// Camera
	const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 1200, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, false);

	// Lights
	const light = new BABYLON.PointLight('light', camera.position, scene);
	light.intensity = 1;

	// Return
	return scene;
}

function getGridPositions(amount: number, width: number, height: number, margin: number)
{
	const positions = [];
	const range = Math.floor(amount / 2);
	const maxDim = Math.max(width, height);
	const inc = maxDim + margin;

	for (let i = -range; i < range; ++i)
	{
		for (let j = -range; j < range; ++j)
		{
			positions.push(new BABYLON.Vector3(i * inc, j * inc, 0));
		}
	}

	console.log(positions);
	return positions;
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
