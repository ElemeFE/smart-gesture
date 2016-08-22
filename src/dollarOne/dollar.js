import {
  resample,
  rotateBy,
  scaleTo,
  translateTo,
  optimalCosineDistance,
  distanceAtBestAngle,
} from './process';
import {
  indicativeAngle,
  vectorize,
  Point,
  deg2Rad,
} from './helper';

// const numUnistrokes = 16;
const numPoints = 64;
const squareSize = 200.0;
const origin = new Point(0, 0);
const diagonal = Math.sqrt(squareSize * squareSize + squareSize * squareSize);
const halfDiagonal = 0.5 * diagonal;
const angleRange = deg2Rad(45.0);
const anglePrecision = deg2Rad(2.0);

// Unistroke class
export function Unistroke(name, points) {
  this.name = name;
  this.points = resample(points, numPoints);
  const radians = indicativeAngle(this.points);
  this.points = rotateBy(this.points, -radians);
  this.points = scaleTo(this.points, squareSize);
  this.points = translateTo(this.points, origin);
  this.vector = vectorize(this.points); // for Protractor
}

// Result class
function Result(name, score) {
  this.name = name;
  this.score = score;
}

export class DollarRecognizer {
  recognize(_points, Unistrokes, useProtractor) {
    if (Unistrokes.length === 0) return new Result('No match.', 0.0);
    let points = resample(_points, numPoints);
    const radians = indicativeAngle(points);
    points = rotateBy(points, -radians);
    points = scaleTo(points, squareSize);
    points = translateTo(points, origin);
    const vector = vectorize(points); // for Protractor
    let b = +Infinity;
    let u = -1;

    for (let i = 0; i < Unistrokes.length; i++) {
      // for each unistroke
      let d;
      if (useProtractor) {
        d = optimalCosineDistance(Unistrokes[i].vector, vector);
      } else {
        // Golden Section Search (original $1)
        d = distanceAtBestAngle(points, Unistrokes[i], -angleRange, +angleRange, anglePrecision);
      }
      if (d < b) {
        b = d; // best (least) distance
        u = i; // unistroke
      }
    }

    return (u === -1) ?
      new Result('No match.', 0.0) :
      new Result(Unistrokes[u].name, useProtractor ? 1.0 / b : 1.0 - b / halfDiagonal);
  }
}
