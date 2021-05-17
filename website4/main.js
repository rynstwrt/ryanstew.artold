const numPoints = 40;
const letterDelay = 30;
const lineDelay = 2000;

let background;
let h1;
let cursor;
let cursorMargin;
let points = [];
let animationFrame;

/**
 * Types a given line of text with a start delay of 'time'.
 *
 * @param {string} line The line to type.
 * @param {number} delay The start delay of the line in milliseconds
*/
async function type(line = '\r\n', delay = 0)
{
    return new Promise((resolve, reject) =>
    {
        line.split('').forEach((char, i) =>
        {
            setTimeout(() =>
            {
                if (h1.childNodes.length == 1)
                    h1.prepend(document.createTextNode(''));

                const textNode = h1.childNodes[0];
                textNode.textContent += char;
                cursor.style.marginLeft = line.match(/^\s*$/) ? 0 : cursorMargin;
            }, letterDelay * i + delay);
        });

        setTimeout(() => resolve(), line.length * letterDelay + delay + lineDelay);
    });
}

/**
 * Draws a line between to points in { left: x, top: y } format.
 *
 * @param {object} p1 The first point.
 * @param {object} p2 The second point.
*/
function drawLineBetweenPoints(p1, p2)
{
    const line = document.createElement('div');
    line.classList.add('line');

    const dX = Math.abs(p2.left - p1.left);
    const dY = Math.abs(p2.top - p1.top);

    const width = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    line.style.width = `${width}px`;

    const bottomMostPoint = (p1.top > p2.top) ? p1 : p2;
    const topMostPoint = (bottomMostPoint === p1) ? p2 : p1;

    line.style.left = `${bottomMostPoint.left}px`;
    line.style.top = `${bottomMostPoint.top}px`;

    let theta = (bottomMostPoint.left < topMostPoint.left) ? -Math.atan(dY / dX) : Math.atan(dY / dX) + Math.PI;

    line.style.transform = `rotate(${theta}rad)`;
    background.append(line);
}

/**
 * Fills the background with random points and draws lines between them.
 *
 * @param {number} amount The amount of points to create.
*/
function fillBackground()
{
    for (let i = 0; i < numPoints; ++i)
    {
        const xMid = background.clientWidth / 2;
        const yMid = background.clientHeight / 2;

        const x = xMid + (Math.random() * (xMid * 2) - xMid);
        const y = yMid + (Math.random() * (yMid * 2) - yMid);

        const point = { left: x, top: y };
        points.push(point);
    }

    points.forEach((point, i) => {
        const nextPoint = points[i + 1];
        if (!nextPoint) return;

        drawLineBetweenPoints(point, nextPoint);
    });
    drawLineBetweenPoints(points[points.length - 1], points[0]);
}

/**
 * Animates the background.
*/
let pos = 0;
function animateBackground()
{
    pos += .1;
    background.style.transform = `rotate3d(0, 1, 0, ${pos % 360}deg)`;

    animationFrame = window.requestAnimationFrame(animateBackground);
}

/**
 * Start the intro animation.
*/
async function start()
{
    background = document.querySelector('#background');
    h1 = document.querySelector('h1');
    cursor = document.querySelector('#cursor');
    cursorMargin = getComputedStyle(cursor).marginLeft;
    cursor.style.marginLeft = 0;

    fillBackground();

    await type('Hey... ');
    await type('are you there?');

    await type(undefined, 1000);
    await type();
    await type('Do you feel the vibrations of the universe around you?');

    background.style.transition = 'opacity 2s ease-in-out';
    background.style.opacity = 1;
    animationFrame = window.requestAnimationFrame(animateBackground);

    await type(undefined, 2000);
    await type();
    await type('What do we actually experience? ');
    await type('Is it ours to keep? ');
    await type('Or is it just something we witness?');

    await type(undefined, 2000);
    await type();
    await type('Do you ever actually own a moment?');

    setTimeout(() =>
    {
        background.style.opacity = 0;
        h1.style.opacity = 0;
        setTimeout(() =>
        {
            h1.childNodes[0].textContent = '';
            h1.style.opacity = 1;
            window.cancelAnimationFrame(animationFrame);
            setTimeout(async () =>
            {
                await type('Enjoy the rest of your day.', 3000);
                await type();
                await type();
                await type('Thank you so much for stopping by.');
            });
        }, 2000);
    }, 3000);
}

window.addEventListener('load', () => start() );

window.addEventListener('resize', () =>
{
    window.cancelAnimationFrame(animationFrame);
    points = [];
    while (background.firstChild)
        background.firstChild.remove();

    fillBackground();
    animationFrame = window.requestAnimationFrame(animateBackground);
});
