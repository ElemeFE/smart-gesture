# smart-gesture

这是一个web版的鼠标手势组件，支持普通的鼠标手势和自定义图形手势, 在线 [demo](https://elemefe.github.io/smart-gesture/)

## 安装

可通过npm安装

```
npm install --save smart-gesture
```

也可以直接使用`dist/min/smart-gesture.min.js`文件

## 普通鼠标手势

普通手势可识别上(U)下(D)左(L)右(R)4个方向的任意组合

![basic-gesture](images/basic-gesture.gif)

## 自定义图形手势

可识别任意的可以一笔画出的手势,默认有预设的14种图形,同时也能自定义图形。若自定义图形手势,可以通过增加样本集来提高识别率,推荐同一个手势对应2-3个样本集。

![smart-gesture](images/smart-gesture.gif)

## Usage

```
import smartGesture from 'smart-gesture';
const options = {
  el: document.getElementById('test'),             
  onSwipe: (list) => {
    console.log(list);
  },
  onGesture: (res, points) => {
    console.log(res);
    document.getElementById('result').innerHTML = res.score > 2 ? res.name : '未识别';
  }
};

const gesture = new smartGesture(options);
```

或者直接在页面中引用`dist/min/smart-gesture.min.js`,会在window上暴露一个smartGesture方法
```
<script src="dist/min/smart-gesture.min.js"></script>
<script>
    let lastPoints = [];
    const options = {
      el: document.getElementById('test'),             
      onSwipe: (list) => {
        console.log(list);
      },
      onGesture: (res, points) => {
        console.log(res);
        document.getElementById('result').innerHTML = res.score > 2 ? res.name : '未识别';
      }
    };
    const gesture = new smartGesture(options);
</script>
```

## Documentation

### configuration

```
var gesture = new smartGesture({el: document.querySelector('#target'), ...});
```

可配置的参数如下:

- `el` 应用手势识别的元素,类型为`DOMElement`。需要注意的是,由于用于显示鼠标轨迹的svg的`position`是`absolute`,
所以为了保证鼠标轨迹的位置正常,建议对该元素设置`position: relative`。(default: `body`)

- `enablePath` 是否显示鼠标轨迹,类型为`Boolean`。(default: `true`)

- `lineColor` 鼠标轨迹的颜色,类型为`String`。(default: `#666`)

- `lineWidth` 鼠标轨迹的宽度,类型为`Number`,单位`px`。(default: `4`)

- `timeDelay` 长按一定时间后才会触发手势识别,类型为`Number`,单位`ms`。(default: `600`)

- `triggerMouseKey` 触发手势识别的鼠标按键,类型为`String`,可选值`left | right`。(default: `right`)

- `gestures` 初始化自定义图形集合。类型为`Array | Object`,若不想使用预设的手势,可以传空数组。(default: [所有预设的手势])

- `activeColor` 开启手势时背景色。类型为`String`。(default: `rgba(0, 0, 0, .05)`)

- `onSwipe: function(directionList)` 手势结束时调用, 

    - `directionList`: 普通手势的识别结果,数组。


- `onGesture: function(result, points)` 手势结束时调用

    - `result`: 自定义图形手势的识别结果,值为一个对象,包含`name`和`score`两个key。
    
    - `points`: 包含该次手势的轨迹的点的集合构成的数组。可以配合`addGesture`方法来实现自定义手势功能。


### Methods

- `.addGesture(gesture)` 添加自定义图形模板
    - gesture: 自定义图形模板
        - type: Object
        - gesture.name:String: 模板名称
        - gesture.points:Array: 点集合

- `.refresh(options)` 重新刷新实例的options

    - options: smartGesture参数对象

- `.destroy()` 销毁当前的实例

## Development

```
npm i
npm run dev
```

## License

MIT
