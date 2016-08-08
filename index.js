import createCanvas from './src/main.js';
import 'normalize.css';
import './src/css/main.scss';

const options = {
  onLeft: () => {
    alert('left');
  },
  onRight: () => {
    alert('right');
  },
  onUp: () => {
    alert('up');
  },
  onDown: () => {
    alert('down');
  },
};

createCanvas(options);
