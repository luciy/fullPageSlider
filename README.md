# 竖屏轮播组件

fullPageSlider 移动端（基于Zepto）的竖屏轮播插件：http://demo.uis.cc/fullPageSlider/ （chrome 模拟移动端查看 ）

------------------------------

#### 用法
只需要引入依赖的资源，遵循下面例子中的模式。

| 路径      | 描述 |
| :-------- | :--------|
| `js/fullPageSlider.js` | js引用路径。 |
| `css/base.css`|  css引用路径。  |


------------------------------

#### DOM结构 ：
```
<section class="full-page">
    <div class="content" id="touchSilder">
        <div class="item01">
            <h2>page1</h2>
        </div>
        <div class="item02">
            <h2>page2</h2>
        </div>
        <div class="item03">
            <h2>page3</h2>
        </div>
    </div>
    <div class="tip-top"></div>
</section>
```
------------------------------

#### SCSS 样式：
```
.full-page {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .content {
        height: 100%;
        & > div {
            position: relative;
            height: 100%;
        }
    }
    .tip-top {
        width: 26px;
        height: 22px;
        position: fixed;
        left: 50%;
        bottom: 100px;
        margin-left: -13px;
        background:url(#{$imgPath}tip-top.png) no-repeat;
        background-size: 26px;
        -webkit-animation: moveIconUp ease 1.5s both infinite;
        animation: moveIconUp ease 1.5s both infinite;
    }
}
```

------------------------------

#### js实例化:
```
var slider = new FullPageSlider({
    layout: '.full-page',                   // 外层Dom
    wrap: '.content',                       // 包裹容器
    activeClassName: 'active',              // 动画当前页面外层添加的class名称用于CSS3动画
    animationDuration: 500,                 // 动画时间
    timingFunction: 'ease',                 // 动画曲线
    index: 0,                               // 开始位置
    continuous: true,                       // 无限滚动
    callback: function(index) {             // 切换后的回调
        console.log(index);
    }
});
```

------------------------------

#### 参数详解：
| 参数      | 描述 |
| :-------- | :--------|
| `layout`	| ClassName (默认：.full-page) 外层Dom ClassName。| 
| `wrap`	| ClassName (默认：.wrap）包裹容器。| 
| `activeClassName`	| ClassName (默认：active) 动画当前页面外层添加的class名称用于CSS3动画。| 
| `animationDuration`	| 整数 (默认：500) 动画时间。| 
| `timingFunction`	| String (默认：ease) 动画曲线| 
| `index`	| 整数 (默认：0) 开始位置| 
| `continuous`	| 布尔值 (默认：true) 无限滚动| 
| `callback`	| function类型 切换后的回调| 


------------------------------

#### API：
`fullPageSlider` 对外暴漏了一些方法，这些方法对于控制是有用的。

| 参数      | 描述 |
| :-------- | :--------|
|`inext()`|	显示轮播图下一张。|
|`getPos()`	|返回当前幻灯片的索引位置。|
|`getNumSlides()`	|返回幻灯片总量。|
