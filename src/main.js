const emptyFunc = () => {};
class Canvas {
  constructor(options = {}) {
    this.path = null;
    this.startPos = null;
    this.endPos = null;
    this.direction = null;
    this.points = [];
    this.isMove = false;
    this.onLeft = options.onLeft || emptyFunc;
    this.onRight = options.onRight || emptyFunc;
    this.onUp = options.onUp || emptyFunc;
    this.onDown = options.onDown || emptyFunc;
    this.path = document.getElementById('path');

    window.addEventListener('contextmenu', () => {
      event.preventDefault();
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      this.path.id = 'path';
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
      this.path.setAttribute('d', `M ${event.pageX} ${event.pageY}`);
      this.isMove = true;
    });

    window.addEventListener('mousemove', this.move.bind(this));

    window.addEventListener('mouseup', () => {
      // console.log(this.points);
      if (Math.abs(this.endPos.x - this.startPos.x) > Math.abs(this.endPos.y - this.startPos.y)) {
        this.direction = this.endPos.x - this.startPos.x > 0 ? 'Right' : 'Left';
      } else {
        this.direction = this.endPos.y - this.startPos.y > 0 ? 'Down' : 'Up';
      }
      this[`on${this.direction}`]();
      document.body.removeChild(this.svg);
      this.isMove = false;
    });
  }

  move() {
    if (!this.isMove) return;
    this.endPos = {
      x: event.pageX,
      y: event.pageY,
    };
    const d = this.path.getAttribute('d');
    this.points.push({ x: event.pageX, y: event.pageY });
    this.path.setAttribute('d', `${d} L ${event.pageX} ${event.pageY}`);
  }
}

const createCanvas = (options) => new Canvas(options);

export default createCanvas;
