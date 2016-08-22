// Point class
function Point(x, y) {
  this.x = x;
  this.y = y;
}
// Rectangle class
function Rectangle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

/**
 * @return {number}
 */
const distance = (p1, p2) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * @return {number}
 */
const pathLength = (points) => {
  let d = 0;
  for (let i = 1; i < points.length; i++) {
    d = d + distance(points[i - 1], points[i]);
  }
  return d;
};

const centroid = (points) => {
  let x = 0.0;
  let y = 0.0;
  for (let i = 0; i < points.length; i++) {
    x += points[i].x;
    y += points[i].y;
  }
  x /= points.length;
  y /= points.length;
  return new Point(x, y);
};

const boundingBox = (points) => {
  let minX = +Infinity;
  let maxX = -Infinity;
  let minY = +Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxX = Math.max(maxX, points[i].x);
    maxY = Math.max(maxY, points[i].y);
  }
  return new Rectangle(minX, minY, maxX - minX, maxY - minY);
};

/**
 * @return {number}
 */
const indicativeAngle = (points) => {
  const c = centroid(points);
  return Math.atan2(c.y - points[0].y, c.x - points[0].x);
};

const vectorize = (points) => {
  let sum = 0.0;
  let vector = [];
  for (let i = 0; i < points.length; i++) {
    vector.push(points[i].x);
    vector.push(points[i].y);
    sum += points[i].x * points[i].x + points[i].y * points[i].y;
  }
  const magnitude = Math.sqrt(sum);
  for (let i = 0; i < vector.length; i++) {
    vector[i] /= magnitude;
  }
  return vector;
};
const deg2Rad = (d) => {
  return d * Math.PI / 180.0;
};

export {
  pathLength,
  distance,
  Point,
  centroid,
  boundingBox,
  indicativeAngle,
  vectorize,
  deg2Rad,
}
