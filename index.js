import createCanvas from './src/main.js';
import 'normalize.css';
import './src/css/main.scss';

const options = {
  onSwipe: (list) => {
    console.log(list);
  },
  onGesture: (res, points) => {
    console.log(res, points);
  }
};

createCanvas(options);
