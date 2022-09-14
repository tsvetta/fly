const screenBounds = document.getElementsByTagName('body')[0].getBoundingClientRect();

let flyCoords = {
  x: 200,
  y: 200,
  angle: 0,
  radius: 100,
  scale: 1,
  direction: null,
  atBound: false,
};

let delta = 100;
let minDistance = delta + 50;

const rotate = (coords) => {
  const px = coords.x + coords.radius * Math.cos(coords.angle);
  const py = coords.y + coords.radius * Math.sin(coords.angle);
  const newRadius = Math.round(Math.random() * 100);

  return {
    ...coords,
    radius: newRadius,
    x: px,
    y: py,
  }
}

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
  f.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) scale(${c.scale})`;
}

const logData = (name, data) => {
  console.clear()
  console.group(name);
  console.table(data);
  console.groupEnd();
}

const moveFly = (flyNode) => () => {
  flyCoords = changeDirection(flyCoords)();
  flyCoords.angle = (flyCoords.angle * 10 + Math.PI / 360) % (Math.PI * 2);
  flyCoords = rotate(flyCoords);

  setFlyCoords(flyNode, flyCoords);
}

const scaleFly = (flyNode) => () => {
  flyCoords.scale = (flyCoords.scale * 1.1 + Math.PI / 360) % (Math.PI * 2);

  logData('Coordinates:', flyCoords);

  setFlyCoords(flyNode, flyCoords);
}

const flyFlies = () => {
  const fly = document.getElementById('fly');

  setFlyCoords(fly, flyCoords)

  const flyingInterval = setInterval(moveFly(fly), 150);
  const scalingInterval = setInterval(scaleFly(fly), 150);

  // setTimeout(() => {
  //   clearInterval(flyingInterval);
  //   clearInterval(scalingInterval);
  // }, 10000);

}

flyFlies();
