// logger.debug | info | warn | error (message: string, messageContext = Context)
const logToDatadog = (message = '', type = 'logger', options = {}) => {
  window.DD_LOGS && DD_LOGS.logger[type](message, options);
}

const logConsoleData = (name, data) => {
  // console.clear()
  console.group(name);
  console.table(data);
  console.groupEnd();
}

const screenBounds = document.getElementsByTagName('body')[0].getBoundingClientRect();

let flyCoords = {
  x: 200,
  y: 200,
  radius: 10,
  scale: 1,
  trajectoryAngle: 0,
  rotationAngle: 0, // from 0 to Math.PI * 2
  direction: null,
  atBound: false,
};

let DELTA = 100;
let MIN_DISTANCE = DELTA + 50;
let SCALE_INDEX = 10;
const LUCK_INDEX = 15;

const goLeft = (coords) => () => {
  const atBound = coords.x <= MIN_DISTANCE;
  return {
      ...coords,
      direction: 'left',
      x: atBound ? MIN_DISTANCE : coords.x - DELTA,
      atBound,
    };
  };

const goRight = (coords) => () => {
  const atBound = coords.x >= screenBounds.width - MIN_DISTANCE;
  return {
      ...coords,
      direction: 'right',
      x: atBound ? screenBounds.width - MIN_DISTANCE : coords.x + DELTA,
      atBound,
    };
  };

const goTop = (coords) => () => {
  const atBound = coords.y <= MIN_DISTANCE;
  return {
      ...coords,
      direction: 'top',
      y: coords.y <= MIN_DISTANCE ? MIN_DISTANCE : coords.y - DELTA,
      atBound,
    };
  };

const goBottom = (coords) => () => {
  const atBound = coords.y >= screenBounds.height - MIN_DISTANCE;
  return {
      ...coords,
      direction: 'bottom',
      y: atBound ? screenBounds.height - MIN_DISTANCE : coords.y + DELTA,
      atBound,
    };
  };

const DIRECTIONS_COUNT = 4;
const DIRECTION_FN_INDEX = 1;
const directions = (coords) => ({
  left: goLeft(coords),
  right: goRight(coords),
  top: goTop(coords),
  bottom: goBottom(coords),
});


const setFlyCoords = (f, c) => {
  f.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) scale(${c.scale}) rotate(${c.rotationAngle}deg)`;
}

const changeDirection = () => {
  const chanceOfNotChangingDirection = Math.round(Math.random() * 100);
  const rndNewDirectionIdx = Math.floor(Math.random() * DIRECTIONS_COUNT);


  if (flyCoords.atBound === true) {
    const directionsWithoutCurrentDirection = { ...directions(flyCoords) };
    delete directionsWithoutCurrentDirection[flyCoords.direction];
    const rndFilteredDirectionIdx = Math.floor(Math.random()* 3);

    flyCoords = Object.entries(directionsWithoutCurrentDirection)[rndFilteredDirectionIdx][DIRECTION_FN_INDEX]();
  }

  const firstMove = flyCoords.direction === null;
  const luckyChance = chanceOfNotChangingDirection <= LUCK_INDEX;
  if (firstMove || luckyChance) {
    flyCoords = Object.entries(directions(flyCoords))[rndNewDirectionIdx][DIRECTION_FN_INDEX]();
  }

  // return the same direction
  flyCoords = directions(flyCoords)[flyCoords.direction]();
}

const scaleFly = () => {
  flyCoords.scale = (flyCoords.scale * SCALE_INDEX + Math.PI / 360) % Math.PI;

  logConsoleData('Coordinates:', flyCoords);
}

const changeTrajectory = () => {
  const px = flyCoords.x + flyCoords.radius * Math.cos(flyCoords.trajectoryAngle);
  const py = flyCoords.y + flyCoords.radius * Math.sin(flyCoords.trajectoryAngle);

  flyCoords = {
    ...flyCoords,
    x: px,
    y: py,
  }
}

const rotate = () => {
  const newTrajectoryAngle = (flyCoords.trajectoryAngle + Math.PI / 360) % (Math.PI * 2);
  const newRadius = Math.round(Math.random() * 25);

  flyCoords = {
    ...flyCoords,
    radius: newRadius,
    trajectoryAngle: newTrajectoryAngle,
  }
}


const moveFly = (flyNode) => () => {
  setFlyCoords(flyNode, flyCoords);
}

const flyFlies = () => {
  const fly = document.getElementById('fly');

  setFlyCoords(fly, flyCoords)

  const directionInterval = setInterval(changeDirection, 350);
  const scalingInterval = setInterval(scaleFly, 500);
  const trajectoryInterval = setInterval(changeTrajectory, 20);
  const rotationIntervar = setInterval(rotate, 5);
  const flyingInterval = setInterval(moveFly(fly), 150);

  logToDatadog('Fly is flying!', 'info');

  // const timer = setTimeout(() => {
  //   clearInterval(flyingInterval);
  //   clearInterval(scalingInterval);
  // }, 10000);

}

flyFlies();
