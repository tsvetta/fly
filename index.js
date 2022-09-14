const screenBounds = document.getElementsByTagName('body')[0].getBoundingClientRect();
console.log('screenBounds', screenBounds)
let flyCoords = {x: 200, y: 200, direction: null, atBound: false};
let delta = 100;
let minDistance = delta + 50;

const goLeft = (coords) => () => {
  const atBound = coords.x <= minDistance;
  return {
      ...coords,
      direction: 'left',
      x: atBound ? minDistance : coords.x - delta,
      atBound,
    };
  };

const goRight = (coords) => () => {
  const atBound = coords.x >= screenBounds.width - minDistance;
  return {
      ...coords,
      direction: 'right',
      x: atBound ? screenBounds.width - minDistance : coords.x + delta,
      atBound,
    };
  };

const goTop = (coords) => () => {
  const atBound = coords.y <= minDistance;
  return {
      ...coords,
      direction: 'top',
      y: coords.y <= minDistance ? minDistance : coords.y - delta,
      atBound,
    };
  };
const goBottom = (coords) => () => {
  const atBound = coords.y >= screenBounds.height - minDistance;
  return {
      ...coords,
      direction: 'bottom',
      y: atBound ? screenBounds.height - minDistance : coords.y + delta,
      atBound,
    };
  };

const directions = (coords) => ({
  left: goLeft(coords),
  right: goRight(coords),
  top: goTop(coords),
  bottom: goBottom(coords),
});

const changeDirection = (coords) => {
  const chanceOfNotChangingDirection = Math.round(Math.random() * 100);
  const rndNewDirectionIdx = Math.floor(Math.random() * 4);
  const directionFnIndex = 1;

  console.log('rndNewDirectionIdx', rndNewDirectionIdx)

  if (coords.atBound === true) {
    const directionsWithoutCurrentDirection = { ...directions(coords) };
    delete directionsWithoutCurrentDirection[coords.direction];
    const rndFilteredDirectionIdx = Math.floor(Math.random()* 3);

    return Object.entries(directionsWithoutCurrentDirection)[rndFilteredDirectionIdx][directionFnIndex];
  }

  const firstMove = coords.direction === null;
  const luckyChance = chanceOfNotChangingDirection <= 15;
  if (firstMove || luckyChance) {
    return Object.entries(directions(coords))[rndNewDirectionIdx][directionFnIndex];
  }

  // return the same direction
  return directions(coords)[coords.direction];
}

const setFlyCoords = (f, c) => {
  console.log('coords', c)
  f.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
}

const moveFly = (flyNode) => () => {
  // debugger
  flyCoords = changeDirection(flyCoords)();

  setFlyCoords(flyNode, flyCoords);
}

const flyFlies = () => {
  let fly = document.getElementById('fly');

  setFlyCoords(fly, flyCoords)

  const flyingInterval = setInterval(moveFly(fly), 200);

  // setTimeout(() => {
  //   clearInterval(flyingInterval);
  // }, 10000);

}

flyFlies();
