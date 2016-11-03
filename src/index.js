import { Unistroke, DollarRecognizer } from 'dollarOne';
import * as gesture from './dollarOne/gestures';

const DO = new DollarRecognizer();
const emptyFunc = () => {};
const svgPathId = 'elemefe_still_hiring_you_can_send_email_to_(yong.xiang@ele.me)';
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
      activeColor: 'rgba(0, 0, 0, .05)',
      eventType: 'mouse',
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

    this.path = document.getElementById(svgPathId);

    this._initUnistrokes(options.gestures || gesture);

    this._mouseDelayTimer = null;

    this._moveStart = this._moveStart.bind(this);
    this._move = this._move.bind(this);
    this._moveEnd = this._moveEnd.bind(this);
    this._contextmenu = this._contextmenu.bind(this);

    this.pointerStart = 'mousedown';
    this.pointerMove = 'mousemove';
    this.pointerUp = 'mouseup';
    this.pointerLeave = 'mouseleave';
    if (this.options.eventType === 'touch') {
      this.pointerStart = 'touchstart';
      this.pointerMove = 'touchmove';
      this.pointerUp = 'touchend';
      this.pointerLeave = 'touchcancel';
    }
    this.options.el.addEventListener(this.pointerStart, this._moveStart);
    this.options.el.addEventListener(this.pointerMove, this._move);
    this.options.el.addEventListener(this.pointerUp, this._moveEnd);
    this.options.el.addEventListener(this.pointerLeave, this._moveEnd);
    this.options.el.addEventListener('contextmenu', this._contextmenu);
  }

  _addPath(startPoint) {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.id = svgPathId;
    this.svg.setAttribute('style', `position: absolute; top: 0; left: 0; background: ${this.options.activeColor}`);
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('fill', 'none');

    this.points = [];
    // this.startPos = startPoint;
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
  
  _calcElOffset(ele) {
    let t = 0
      , l = 0;
    let parent = ele.offsetParent;
    l += ele.offsetLeft;
    t += ele.offsetTop;
    while (parent) {
      l += parent.offsetLeft;
      t += parent.offsetTop;
      if (navigator.userAgent.indexOf("MSIE 8") < 0) {
        l += parent.clientLeft;
        t += parent.clientTop;
      }
      parent = parent.offsetParent;
    }
    return {
      top: t
      , left: l
    };
  }

  _handleMouseStart() {
    let offset = this._calcElOffset(this.options.el);
    let pos = {
      x: event.pageX - offset.left,
      y: event.pageY - offset.top,
    };
    return pos;
  }

  _handleTouchStart() {
    let offset = this._calcElOffset(this.options.el);
    return {
      x: event.touches[0].pageX - offset.left,
      y: event.touches[0].pageY - offset.top,
    };
  }

  _moveStart() {
    if (!this.enable) return;

    let startPoint;
    if (this.options.eventType === 'touch') {
      startPoint = this._handleTouchStart();
    } else {
      if (this.options.triggerMouseKey === 'left') {
        if (event.button !== 0) return;
      } else {
        if (event.button !== 2) return;
      }
      startPoint = this._handleMouseStart();
    }

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

  _contextmenu() {
    if (this.enable && this.options.triggerMouseKey !== 'left') {
      event.preventDefault();
    }
  }

  _progressSwipe(e) {
    const pageX = this.options.eventType === 'touch' ? e.changedTouches[0].pageX : e.pageX;
    const pageY = this.options.eventType === 'touch' ? e.changedTouches[0].pageY : e.pageY;
  
    let offset = this._calcElOffset(this.options.el);
  
    if (!this.endPos) {
      this.endPos = {
        x: pageX - offset.left,
        y: pageY - offset.top,
      };
      return;
    }

    const x = pageX - offset.left;
    const y = pageY - offset.top;
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
    const safeName = name.trim();
    const msgMap = {
      'EMPTY_NAME':'Invalid Gesture Name. `addGesture` failed.',
      'EMPTY_POINT':'Invalid Points. `addGesture` failed.'
    };

    if(!safeName){
      console.warn(msgMap['EMPTY_NAME']);
      return false;
    }

    if (!points || !Array.isArray(points) || !points.length) {
      console.warn(msgMap['EMPTY_POINT']);
      return false;
    }

    const unistroke = new Unistroke(name, points);
    this.Unistrokes.push(unistroke);
  }

  setEnable(b = true) {
    this.enable = b;
  }

  destroy() {
    this.options.el.removeEventListener(this.pointerStart, this._moveStart);
    this.options.el.removeEventListener(this.pointerMove, this._move);
    this.options.el.removeEventListener(this.pointerUp, this._moveEnd);
    this.options.el.removeEventListener(this.pointerLeave, this._moveEnd);
    this.options.el.removeEventListener('contextmenu', this._contextmenu);
  }

  refresh(options = {}) {
    this.options = { ...this.options, ...options }
  }

}

const smartGesture = (options) => new Canvas(options);

module.exports = smartGesture;
