class Color
{
	constructor(...args)
	{
		if (args.length === 1) // if hex
		{
			const hex = args[0];
			const r = parseInt(hex.substr(1, 2), 16) / 255;
			const g = parseInt(hex.substr(3, 2), 16) / 255;
			const b = parseInt(hex.substr(5, 2), 16) / 255;

			const max = Math.max(r, g, b);
			const min = Math.min(r, g, b);
			let h, s, l = (min + max) / 2;

			if (min === max)
			{
				h = 0;
				s = 0;
			}
			else
			{
				const d = max - min;
				s = l > .5 ? d / (2 - min - max) : d / (min + max);

				switch(max)
				{
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);
						break;

					case g:
						h = (b - r) / d + 2;
						break;

					case b:
						h = (r - g) / d + 4;
						break;
				}
				h /= 6;
			}

			this.hue = h * 360;
			this.sat = s * 100;
			this.lum = l * 100;
		}
		else // if HSL
		{
			this.hue = args[0];
			this.sat = args[1];
			this.lum = args[2];
		}

	}

	getHSL()
	{
		return `hsl(${this.hue}, ${this.sat}%, ${this.lum}%)`;
	}

	darken(percent)
	{
		return new Color(this.hue, this.sat, this.lum * (1 - percent / 100));
	}

	lighten(percent)
	{
		return new Color(this.hue, this.sat, this.lum * (1 + percent / 100));
	}

	rotateHue(percent)
	{
		return new Color(this.hue + (360 * (percent / 100)), this.sat, this.lum);
	}

	addHue(hue)
	{
		return new Color(this.hue + hue, this.sat, this.lum);
	}

	subtractHue(hue)
	{
		return new Color(this.hue - hue, this.sat, this.lum);
	}

	complement()
	{
		return this.rotateHue(50);
	}

	getMonochromaticScheme(steps, range)
	{
		let colors = [];

		steps -= 1;

		const minLum = Math.round(this.darken(range).lum);
		const maxLum = Math.round(this.lighten(range).lum);
		const step = (maxLum - minLum) / steps;

		for (let i = minLum; i <= maxLum; i += step)
			colors.push(new Color(this.hue, this.sat, i).getHSL());

		return colors;
	}

	getAnalogousScheme(steps, range)
	{
		let colors = [];

		steps -= 1;

		const minHue = Math.round(this.rotateHue(-range).hue);
		const maxHue = Math.round(this.rotateHue(range).hue);
		const step = (maxHue - minHue) / steps;

		for (let i = minHue; i <= maxHue; i += step)
			colors.push(new Color(i, this.sat, this.lum).getHSL());

		return colors;
	}

	getSplitComplementaryScheme(range)
	{
		return [
			this.rotateHue(-range).getHSL(),
			this.complement().getHSL(),
			this.rotateHue(range).getHSL()
		];
	}

	getTriadicScheme()
	{
		return [
			this.getHSL(),
			this.subtractHue(120).getHSL(),
			this.addHue(120).getHSL()
		];
	}

	getTetradicScheme()
	{
		return [
			this.getHSL(),
			this.rotateHue(25).getHSL(),
			this.rotateHue(50).getHSL(),
			this.rotateHue(75).getHSL()
		];
	}

}
