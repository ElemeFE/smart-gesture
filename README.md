## smart-gesture

这是一个web版的鼠标手势组件，支持普通的鼠标手势和自定义图形手势

#### 普通鼠标手势

普通手势可识别上下左右4个方向的任意组合

![basic-gesture](images/basic-gesture.gif)

#### 自定义图形手势

可识别任意的可以一笔画出的手势

![smart-gesture](images/smart-gesture.gif)

#### options

##### gestures
初始化自定义图形集合
- type: Array | Object

#### events

##### onSwipe: function(directionList)
手势结束时调用
- directionList: 普通手势的识别结果

  - type: Array

##### onGesture: function(result, points)
手势结束时调用
- result: 自定义图形手势的识别结果

  - type: Object
  - result.name:String: 手势的名称
  - result.score:Number: 匹配的分数

- points: 包含该次手势的轨迹的点的集合

  - type: Array


#### functions

##### addGesture(gesture)
添加自定义图形模板
  - gesture: 自定义图形模板
    - type: Object
    - gesture.name:String: 模板名称
    - gesture.points:Array: 点集合


### TODOS
  - 更灵活的配置项
  - 打包
