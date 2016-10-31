import smartGesture from '../src/index.js';
import 'normalize.css';
import '../src/css/main.scss';

let lastPoints = [];

const options = {
  el: document.getElementById('test'),
  enablePath: true,
  timeDelay: 500,
  triggerMouseKey: 'left',
  onSwipe: (list) => {
    document.getElementById('result0').innerHTML = list.join('');
    console.log(list);
  },
  onGesture: (res, points) => {
    console.log(res);
    document.getElementById('result').innerHTML = res.score > 2 ? res.name : '未识别';
    lastPoints = points;
  }
};

const canvas = smartGesture(options);

document.getElementById('btn').addEventListener('click', () => {
  canvas.addGesture({
    name: document.getElementById('gestureName').value,
    points: lastPoints
  });
  document.getElementById('gestureName').value = '';
});
