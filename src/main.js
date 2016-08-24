import { Unistroke, DollarRecognizer } from './dollarOne';
import * as gesture from './dollarOne/gestures';

const DO = new DollarRecognizer();
const emptyFunc = () => {};
class Canvas {
  constructor(options = {}) {
    this.path = null;
    this.startPos = null;
    this.endPos = null;
    this.direction = null;
    this.directionList = [];
    this.points = [];
    this.isMove = false;
    this.Unistrokes = [];
    // this.onLeft = options.onLeft || emptyFunc;
    // this.onRight = options.onRight || emptyFunc;
    // this.onUp = options.onUp || emptyFunc;
    // this.onDown = options.onDown || emptyFunc;
    this.onSwipe = options.onSwipe || emptyFunc;
    this.onGesture = options.onGesture || emptyFunc;
    this.path = document.getElementById('path');

    this._initUnistrokes(options.gestures || gesture);

    window.addEventListener('contextmenu', () => {
      event.preventDefault();
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.path.id = 'path';
      this.svg.setAttribute('style', 'position: fixed; top: 0; left: 0;');
      this.svg.setAttribute('width', '100%');
      this.svg.setAttribute('height', '100%');
      this.svg.setAttribute('stroke', '#000');
      this.svg.setAttribute('fill', 'none');
      this.svg.appendChild(this.path);
      document.body.appendChild(this.svg);

      this.points = [];
      this.startPos = {
        x: event.pageX,
        y: event.pageY,
      };
      this.path.setAttribute('stroke', '#666');
      this.path.setAttribute('stroke-width', 4);
      this.path.setAttribute('d', `M ${event.pageX} ${event.pageY}`);
      this.isMove = true;
    });

    window.addEventListener('mousemove', this.move.bind(this));

    window.addEventListener('mouseup', () => {
      if (!this.isMove) return;
      // if (Math.abs(this.endPos.x - this.startPos.x) > Math.abs(this.endPos.y - this.startPos.y)) {
      //   this.direction = this.endPos.x - this.startPos.x > 0 ? 'Right' : 'Left';
      // } else {
      //   this.direction = this.endPos.y - this.startPos.y > 0 ? 'Down' : 'Up';
      // }
      if (this.directionList.length > 0) {
        this.onSwipe(this.directionList);
      }
      if (this.points.length > 10) {
        const res = DO.recognize(this.points, this.Unistrokes, true);
        this.onGesture(res, this.points);
      }

      document.body.removeChild(this.svg);
      this.isMove = false;
      this.endPos = null;
      this.directionList = [];
      this.points = [];
    });
  }

  _initUnistrokes(gestures) {
    if (Array.isArray(gestures)) {
      gestures.forEach((ges) => this.addGesture(ges));
    } else {
      const keys = Object.keys(gestures);
      keys.forEach((key) => this.addGesture(gestures[key]));
    }
  }

  addGesture(ges = {}) {
    const { name, points } = ges;
    if (!name || !points || !Array.isArray(points)) {
      console.warn('invalid params. addGesture fail.');
      return false;
    }

    const unistroke = new Unistroke(name, points);
    this.Unistrokes.push(unistroke);
  }

  move() {
    if (!this.isMove) return;
    this._progressSwipe(event);
    // this.endPos = {
    //   x: event.pageX,
    //   y: event.pageY,
    // };
    // const d = this.path.getAttribute('d');
    // this.points.push({ x: event.pageX, y: event.pageY });
    // this.path.setAttribute('d', `${d} L ${event.pageX} ${event.pageY}`);
  }

  _progressSwipe(e) {
    if (!this.endPos) {
      this.endPos = {
        x: e.pageX,
        y: e.pageY,
      };
      return;
    }

    const x = e.pageX;
    const y = e.pageY;
    const dx = Math.abs(x - this.endPos.x);
    const dy = Math.abs(y - this.endPos.y);

    if (dx > 5 || dy > 5) {
      // draw the point
      const d = this.path.getAttribute('d');
      this.points.push({ x, y });
      this.path.setAttribute('d', `${d} L ${event.pageX} ${event.pageY}`);

      if (dx > 20 || dy > 20) {
        let direction;
        if (dx > dy) {
          direction = x < this.endPos.x ? 'L' : 'R';
        }
        else {
          direction = y < this.endPos.y ? 'U' : 'D';
        }
        const lastDirection = this.directionList.length <= 0 ? '' : this.directionList[this.directionList.length - 1];
        if (direction != lastDirection) {
          this.directionList.push(direction);
        }

        this.endPos = { x, y };
      }
    }
  }
}

const createCanvas = (options) => new Canvas(options);

export default createCanvas;
