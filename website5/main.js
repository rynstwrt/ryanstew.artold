function createOrChangeBoxes(container, colors)
{
	const currentBoxes = document.querySelectorAll(`#${container.id} .color-box`);

	if (currentBoxes.length === colors.length)
	{
		currentBoxes.forEach((box, i) => {
			box.style.backgroundColor = colors[i];
		});

		return;
	}

	while (container.firstChild) container.firstChild.remove();

	colors.forEach(color =>
	{
		const box = document.createElement('div');
		box.classList.add('color-box');
		box.style.backgroundColor = color;
		container.append(box);
	});
}

function start(hex, numColors, range)
{
	let color = new Color(hex);

	createOrChangeBoxes(document.querySelector('#monochromatic'), color.getMonochromaticScheme(numColors, range));
	createOrChangeBoxes(document.querySelector('#analogous'), color.getAnalogousScheme(numColors, range));
	createOrChangeBoxes(document.querySelector('#complement'), [color.getHSL(), color.complement().getHSL()]);
	createOrChangeBoxes(document.querySelector('#splitcomplementary'), color.getSplitComplementaryScheme(10));
	createOrChangeBoxes(document.querySelector('#triadic'), color.getTriadicScheme());
	createOrChangeBoxes(document.querySelector('#tetradic'), color.getTetradicScheme());
}

window.addEventListener('load', () =>
{
	const colorInput = document.querySelector('#color-input');
	const numColorsInput = document.querySelector('#numcolors-input');
	const rangeInput = document.querySelector('#range-input');

	start(colorInput.value, numColorsInput.value, rangeInput.value);

	[colorInput, numColorsInput, rangeInput].forEach((input, i) => {
		input.addEventListener('input', () => start(colorInput.value, numColorsInput.value, rangeInput.value));
	});
});
