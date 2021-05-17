 function wave()
 {
	 const shapes = document.querySelectorAll('.shape');
	 shapes.forEach((shape, i) => {
		 shape.style.animation = `wave .75s ${i / 30 + .5}s`;
	 });

 }

 window.addEventListener('load', () =>
{
	wave();
});
