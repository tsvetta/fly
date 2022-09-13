const screenBounds = document.getElementsByTagName('body')[0].getBoundingClientRect();
let flyCoords = {top: 100, left: 100};

const changeDirection = (coords) => {
  const goLeft = () => ({
    ...coords,
    left: coords.left <= 0 ? coords.left : coords.left - 10,
  });

  const goRight = () => ({
    ...coords,
    left: coords.left >= screenBounds.width ? coords.left : coords.left + 10,
  });

  const goTop = () => ({
    ...coords,
    top: coords.top <= 0 ? coords.top : coords.top - 10,
  });
  const goBottom = () => ({
    ...coords,
    top: coords.top >= screenBounds.height ? coords.top : coords.top + 10,
  });

  const directions = [goLeft, goRight, goTop, goBottom];
  const rndDirectionIdx = Math.round(Math.random()* 3);

  return directions[rndDirectionIdx];
}



const setFlyCoords = (f, c) => {
  console.log('coords', c)
  f.style.top = `${c.top}px`;
  f.style.left = `${c.left}px`;
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
