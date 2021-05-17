// diffuse: basic color of object
// groundColor: light in opposite direction color
// specular: highlight color of object
function createScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine, rows: number, cols: number)
{
	// Scene
	const scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.collisionsEnabled = true;
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

	// Buildings
	const buildingProportions = [
		new BABYLON.Vector3(2, 1, 1),
		new BABYLON.Vector3(1, 4, 1),
		new BABYLON.Vector3(1, 3, 1),
		new BABYLON.Vector3(1, 1, 2),
		new BABYLON.Vector3(2, 2, 1),
		new BABYLON.Vector3(1, 2, 2)
	];

	const buildings: BABYLON.Mesh[] = [];
	const buildingUnit = 5;

	const buildingMat = new BABYLON.StandardMaterial('buildingmat', scene);
	buildingMat.diffuseColor = BABYLON.Color3.White();

	const spacing = 5;
	let margin = 0;
	let currentXPosition = 0;
	let currentZPosition = 0;

	buildingProportions.forEach(proportion =>
	{
		const prop = Math.max(proportion.x, proportion.z);
		if (prop * buildingUnit + spacing > margin) margin = prop * buildingUnit + spacing;
	});

	for (let i = 0; i < rows; ++i)
	{
		for (let j = 0; j < cols; ++j)
		{
			const proportion = buildingProportions[Math.floor(Math.random() * buildingProportions.length)];
			const width = proportion.x * buildingUnit;
			const height = proportion.y * buildingUnit;
			const depth = proportion.z * buildingUnit;
			const building = BABYLON.MeshBuilder.CreateBox('box', { width: width, height: height, depth: depth }, scene);

			building.position.x = currentXPosition;
			building.position.y = height / 2;
			building.position.z = currentZPosition;
			building.checkCollisions = true;
			building.material = buildingMat;
			buildings.push(building);

			currentXPosition += margin;
		}
		currentXPosition = 0;
		currentZPosition += margin;
	}

	// Corner Things
	const cornerMat = new BABYLON.StandardMaterial('cornermat', scene);
	cornerMat.diffuseColor = BABYLON.Color3.Black();

	const cornerAnim = new BABYLON.Animation('corneranim', 'scaling', 60,
	BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
	BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

	const cornerKeys = [];
	cornerKeys.push({
		frame: 0,
		value: new BABYLON.Vector3(1, 1, 1)
	})
	cornerKeys.push({
		frame: 60,
		value: new BABYLON.Vector3(2, 2, 2)
	});
	cornerKeys.push({
		frame: 120,
		value: new BABYLON.Vector3(1, 1, 1)
	})
	cornerAnim.setKeys(cornerKeys);

	buildings.forEach(building =>
	{
		const vw = building.getBoundingInfo().boundingBox.vectorsWorld;
		vw.forEach(vector =>
		{
			const corner = BABYLON.MeshBuilder.CreateSphere('box', { diameter: .25 }, scene);
			corner.position = building.position.add(vector);
			corner.animations.push(cornerAnim);
			scene.beginAnimation(corner, 0, 120, true);
			corner.material = cornerMat;
		});
	});

	// Ground
	const groundOffset = new BABYLON.Vector3(buildingUnit / 2 + margin / 2, 0, buildingUnit / 2 + margin / 2);
	let groundWidth = rows * margin;
	let groundHeight = cols * margin;

	const ground = BABYLON.MeshBuilder.CreateGround('ground', {
		width: groundWidth,
		height: groundHeight
	}, scene);

	const groundMat = new BABYLON.StandardMaterial('groundmat', scene);
	groundMat.diffuseColor = BABYLON.Color3.Black();
	ground.material = groundMat;

	ground.position = new BABYLON.Vector3(groundWidth / 2, 0, groundHeight / 2).subtract(groundOffset);
	ground.checkCollisions = true;

	// Roads
	const roads = [];
	const roadWidth = buildingUnit / 1.25;

	const roadMat = new BABYLON.StandardMaterial('roadmat', scene);
	const roadAnimation = new BABYLON.Animation('roadanimation', 'material.diffuseColor', 15,
		BABYLON.Animation.ANIMATIONTYPE_COLOR3,
		BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

	const roadColors = ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#FF0000'];
	const roadKeys = [];
	const frames = 120;
	for (let i = 0; i < roadColors.length; ++i)
	{
		roadKeys.push({
			frame: (frames / roadColors.length) * i,
			value: BABYLON.Color3.FromHexString(roadColors[i])
		});
	}
	roadAnimation.setKeys(roadKeys);

	for (let i = 0; i < rows; ++i)
	{
		const road = BABYLON.MeshBuilder.CreateGround('road',
		{ width: roadWidth, height: groundHeight }, scene);
		road.position = new BABYLON.Vector3(buildingUnit / 2, .1, groundHeight / 2).subtract(groundOffset);
		road.position = road.position.add(new BABYLON.Vector3(i * margin, 0, 0));
		road.material = roadMat;
		road.animations.push(roadAnimation);
		scene.beginAnimation(road, 0, frames, true);
		roads.push(road);
	}

	for (let i = 0; i < rows; ++i)
	{
		const road = BABYLON.MeshBuilder.CreateGround('road',
		{ width: groundWidth, height: roadWidth }, scene);
		road.position = new BABYLON.Vector3(groundWidth / 2, .11, buildingUnit / 2).subtract(groundOffset);
		road.position = road.position.add(new BABYLON.Vector3(0, 0, i * margin));
		road.material = roadMat;
		road.animations.push(roadAnimation);
		scene.beginAnimation(road, 0, 210, false);
		roads.push(road);
	}

	// Camera
	let camera;
	const debugCam = false;
	if (debugCam)
	{
		camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 4, Math.PI / 4, 150, ground.position, scene);
		//camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 400, ground.position, scene);
		camera.attachControl(canvas, false);
	}
	else
	{
		const camSize = 1.1;
		const camPos = roads[Math.floor(Math.random() * (roads.length - 1))].position.add(new BABYLON.Vector3(0, camSize, 0));
		camera = new BABYLON.UniversalCamera('camera', camPos, scene);
		camera.speed = .15;
		camera.fov = Math.PI / 3;
		camera.ellipsoid = new BABYLON.Vector3(camSize, camSize, camSize);
		camera.ellipsoidOffset = new BABYLON.Vector3(0, camSize, 0);
		camera.checkCollisions = true;
		camera.applyGravity = true;
		camera.keysUp.push(87); // w
		camera.keysLeft.push(65) // a
		camera.keysDown.push(83); // s
		camera.keysRight.push(68) // d
		camera.attachControl(canvas, false);
	}

	// Lights
	const pl1 = new BABYLON.PointLight('pl1', ground.position.add(new BABYLON.Vector3(-groundWidth / 2, Math.max(groundWidth, groundHeight), -groundHeight / 2)), scene);
	const pl2 = new BABYLON.PointLight('pl2', ground.position.add(new BABYLON.Vector3(groundWidth / 2, Math.max(groundWidth, groundHeight), groundHeight / 2)), scene);
	pl1.intensity = pl2.intensity = .7;

	// Return
	return scene;
}

function createBackground(container: HTMLDivElement, shapeSize: number, margin: number)
{
	const rows = Math.ceil(document.documentElement!.clientWidth / shapeSize);
	const cols = Math.ceil(document.documentElement!.clientHeight / shapeSize);

	for (let i = 0; i < rows; ++i)
	{
		for (let j = 0; j < cols; ++j)
		{
			const shape = document.createElement('div');
			shape.classList.add('shape');

			const x = (i * shapeSize) + (margin * 2 * (i + 1));
			const y = (j * shapeSize) + (margin * 2 * (j + 1));
			shape.style.left = `${x}px`;
			shape.style.top = `${y}px`;

			container!.append(shape);
		}
	}
}

window.addEventListener('DOMContentLoaded', () =>
{
	const canvas = document.querySelector('canvas');
	const engine = new BABYLON.Engine(canvas, true);
	const scene = createScene(canvas!, engine, 10, 10);

	const shapeContainer = <HTMLDivElement> document.querySelector('#bg-container');
	const shapeSize = parseInt(getComputedStyle(document.documentElement!).getPropertyValue('--shape-size'));
	const margin = 2;

	createBackground(shapeContainer, shapeSize, margin);

	engine.runRenderLoop(() => scene.render());
	window.addEventListener('resize', () => {
		engine.resize();
		while (shapeContainer.firstChild) shapeContainer.firstChild.remove();
		createBackground(shapeContainer, shapeSize, margin);
	});
});
