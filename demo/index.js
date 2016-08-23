import createCanvas from '../src/main.js';
import 'normalize.css';
import '../src/css/main.scss';

let lastPoints = [];

const options = {
  onSwipe: (list) => {
    // document.getElementById('result').innerHTML = list.join('');
    console.log(list);
  },
  onGesture: (res, points) => {
    console.log(res);
    document.getElementById('result').innerHTML = res.score > 2 ? res.name : '未识别';
    lastPoints = points;
  }
};

const canvas = createCanvas(options);

document.getElementById('btn').addEventListener('click', () => {
  canvas.addGesture({
    name: document.getElementById('gestureName').value,
    points: lastPoints
  });
  document.getElementById('gestureName').value = '';
});
