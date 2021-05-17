 function wave()
 {
	 document.querySelectorAll('.shape').forEach((shape, i) => {
		 shape.style.animation = `wave .75s ${i / 30 + .5}s`;
	 });
 }

 window.addEventListener('load', () =>
{
	wave();
    document.body.style.height = document.documentElement.clientHeight + 'px';
});
