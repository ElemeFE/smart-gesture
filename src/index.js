import { Unistroke, DollarRecognizer } from 'dollarOne';
import * as gesture from './dollarOne/gestures';

const DO = new DollarRecognizer();
const emptyFunc = () => {};
class Canvas {
  constructor(options = {}) {
    this.options = {
      el: document.body,
      onSwipe: emptyFunc,
      onGesture: emptyFunc,
      gestures: gesture,
      enablePath: true,
      lineColor: '#666',
      lineWidth: 4,
      timeDelay: 600,
      triggerMouseKey: 'right',
      ...options,
    };
    this.enable = true;
    this.path = null;
    this.startPos = null;
    this.endPos = null;
    this.direction = null;
    this.directionList = [];
    this.points = [];
    this.isMove = false;
    this.Unistrokes = [];

    this.path = document.getElementById('path');

    this._initUnistrokes(options.gestures || gesture);

    this._mouseDelayTimer = null;

    this.options.el.addEventListener('mousedown', this._moveStart.bind(this));

    this.options.el.addEventListener('mousemove', this._move.bind(this));

    this.options.el.addEventListener('mouseup', this._moveEnd.bind(this));
    this.options.el.addEventListener('mouseleave', this._moveEnd.bind(this));

    this.options.el.addEventListener('contextmenu', () => {
      if (this.enable && this.options.triggerMouseKey !== 'left') {
        event.preventDefault();
      }
    });
  }

  _addPath(startPoint) {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.id = 'path';
    this.svg.setAttribute('style', 'position: absolute; top: 0; left: 0; background: rgba(0,0,0,.05)');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('fill', 'none');

    this.points = [];
    this.startPos = startPoint;
    this.path.setAttribute('stroke', this.options.lineColor);
    this.path.setAttribute('stroke-width', this.options.lineWidth);
    this.path.setAttribute('d', `M ${startPoint.x} ${startPoint.y}`);

    this.svg.appendChild(this.path);
    this.options.el.appendChild(this.svg);
  }

  _initUnistrokes(gestures) {
    if (Array.isArray(gestures)) {
      gestures.forEach((ges) => this.addGesture(ges));
    } else {
      const keys = Object.keys(gestures);
      keys.forEach((key) => this.addGesture(gestures[key]));
    }
  }

  _moveStart() {
    if (!this.enable) return;

    if (this.options.triggerMouseKey === 'left') {
      if (event.button !== 0) return;
    } else {
      if (event.button !== 2) return;
    }

    const startPoint = {
      x: event.pageX - this.options.el.offsetLeft,
      y: event.pageY - this.options.el.offsetTop,
    };
    this._mouseDelayTimer = setTimeout(() => {
      if (this.options.enablePath) {
        this._addPath(startPoint);
      }

      this.isMove = true;
    }, this.options.timeDelay);
  }

  _move() {
    if (!this.isMove) {
      clearTimeout(this._mouseDelayTimer);
      return;
    }

    event.preventDefault();
    this._progressSwipe(event);
  }

  _moveEnd() {
    if (!this.isMove) {
      clearTimeout(this._mouseDelayTimer);
      return;
    }

    if (this.directionList.length > 0) {
      this.options.onSwipe(this.directionList);
    }
    if (this.points.length > 10) {
      const res = DO.recognize(this.points, this.Unistrokes, true);
      this.options.onGesture(res, this.points);
    }

    if (this.options.enablePath) {
      this.options.el.removeChild(this.svg);
    }
    this.isMove = false;
    this.endPos = null;
    this.directionList = [];
    this.points = [];
  }

  _progressSwipe(e) {
    if (!this.endPos) {
      this.endPos = {
        x: e.pageX - this.options.el.offsetLeft,
        y: e.pageY - this.options.el.offsetTop,
      };
      return;
    }

    const x = e.pageX - this.options.el.offsetLeft;
    const y = e.pageY - this.options.el.offsetTop;
    const dx = Math.abs(x - this.endPos.x);
    const dy = Math.abs(y - this.endPos.y);

    if (dx > 5 || dy > 5) {
      this.points.push({ x, y });
      // draw the point
      if (this.options.enablePath) {
        const d = this.path.getAttribute('d');
        this.path.setAttribute('d', `${d} L ${x} ${y}`);
      }

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

  addGesture(ges = {}) {
    const { name, points } = ges;
    if (!name || !points || !Array.isArray(points)) {
      console.warn('invalid params. addGesture fail.');
      return false;
    }

    const unistroke = new Unistroke(name, points);
    this.Unistrokes.push(unistroke);
  }

  setEnable(b = true) {
    this.enable = b;
  }
}

const smartGesture = (options) => new Canvas(options);

module.exports = smartGesture;
