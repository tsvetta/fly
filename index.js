const screenBounds = document.getElementsByTagName('body')[0].getBoundingClientRect();
let flyCoords = {x: 100, y: 100};
let delta = 50;

const changeDirection = (coords) => {
  const goLeft = () => ({
    ...coords,
    x: coords.x <= 0 ? coords.x : coords.x - delta,
  });

  const goRight = () => ({
    ...coords,
    x: coords.x >= screenBounds.width ? coords.x : coords.x + delta,
  });

  const goTop = () => ({
    ...coords,
    y: coords.y <= 0 ? coords.y : coords.y - delta,
  });
  const goBottom = () => ({
    ...coords,
    y: coords.y >= screenBounds.height ? coords.y : coords.y + delta,
  });

  const directions = [goLeft, goRight, goTop, goBottom];
  const rndDirectionIdx = Math.ceil(Math.random()* 3);

  return directions[rndDirectionIdx];
}



const setFlyCoords = (f, c) => {
  console.log('coords', c)
  f.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
}

const moveFly = (flyNode) => () => {
  flyCoords = changeDirection(flyCoords)();

  setFlyCoords(flyNode, flyCoords);
}

const flyFlies = () => {
  let fly = document.getElementById('fly');

  setFlyCoords(fly, flyCoords)

  const flyingInterval = setInterval(moveFly(fly), 500);

  // setTimeout(() => {
  //   clearInterval(flyingInterval);
  // }, 10000);

}

flyFlies();
