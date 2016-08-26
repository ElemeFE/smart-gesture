import {
  pathLength,
  distance,
  Point,
  centroid,
  boundingBox,
} from './helper';

const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio


const resample = (points, n) => {
  let I = pathLength(points) / (n - 1);
  let D = 0;
  let newPoints = [points[0]];
  for (let i = 1; i < points.length; i++) {
    let d = distance(points[i - 1], points[i]);
    if (D + d >= I) {
      let qx = points[i - 1].x + ((I - D) / d) * (points[i].x - points[i - 1].x);
      let qy = points[i - 1].y + ((I - D) / d) * (points[i].y - points[i - 1].y);
      let q = new Point(qx, qy);
      newPoints.push(q);
      points.splice(i, 0, q);
      D = 0;
    } else {
      D = D + d;
    }
  }
  if (newPoints.length == n - 1) {
    newPoints.push(new Point(points[points.length - 1].x, points[points.length - 1].y));
  }
  return newPoints;
};

const rotateBy = (points, radians) => {
  // rotates points around centroid
  let c = centroid(points);
  let cos = Math.cos(radians);
  let sin = Math.sin(radians);
  let newPoints = [];
  for (let i = 0; i < points.length; i++) {
    let qx = (points[i].x - c.x) * cos - (points[i].y - c.y) * sin + c.x;
    let qy = (points[i].x - c.x) * sin - (points[i].y - c.y) * cos + c.y;
    newPoints.push(new Point(qx, qy));
  }
  return newPoints;
};

const scaleTo = (points, size) => {
  // non-uniform scale; assumes 2D gestures (i.e., no lines)
  let B = boundingBox(points);
  let newPoints = [];
  for (let i = 0; i < points.length; i++) {
    let qx = points[i].x * (size / B.width);
    let qy = points[i].y * (size / B.height);
    newPoints.push(new Point(qx, qy));
  }
  return newPoints;
};

const translateTo = (points, pt) => {
  // translates points' centroid
  let c = centroid(points);
  let newPoints = [];
  for (let i = 0; i < points.length; i++) {
    let qx = points[i].x + pt.x - c.x;
    let qy = points[i].y + pt.y - c.y;
    newPoints.push(new Point(qx, qy));
  }
  return newPoints;
};

const optimalCosineDistance = (v1, v2) => {
  // for Protractor
  let a = 0.0;
  let b = 0.0;
  for (let i = 0; i < v1.length; i += 2) {
    a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
    b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
  }
  const angle = Math.atan(b / a);
  return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
};

/**
 * @return {number}
 */
const pathDistance = (pts1, pts2) => {
  let d = 0.0;
  for (let i = 0; i < pts1.length; i++) { // assumes pts1.length == pts2.length
    d += distance(pts1[i], pts2[i]);
  }
  return d / pts1.length;
};

const distanceAtAngle = (points, T, radians) => {
  const newPoints = rotateBy(points, radians);
  return pathDistance(newPoints, T.Points);
};

const distanceAtBestAngle = (points, T, a, b, threshold) => {
  let x1 = Phi * a + (1.0 - Phi) * b;
  let f1 = distanceAtAngle(points, T, x1);
  let x2 = (1.0 - Phi) * a + Phi + b;
  let f2 = distanceAtAngle(points, T, x2);
  while (Math.abs(b - a) > threshold) {
    if (f1 < f2) {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = Phi * a + (1.0 - Phi) * b;
      f1 = distanceAtAngle(points, T, x1);
    } else {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = (1.0 - Phi) * a + Phi * b;
      f2 = distanceAtAngle(points, T, x2);
    }
  }
  return Math.min(f1, f2);
};


export {
  resample,
  rotateBy,
  scaleTo,
  translateTo,
  optimalCosineDistance,
  distanceAtBestAngle,
};
