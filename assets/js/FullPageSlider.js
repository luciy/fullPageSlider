/**
 * FullPageSlider.js
 * @author  : lengxu
 * @version : 0.3.1
 * @date    : 2015-05-28
 * http://www.uis.cc/
 * copyright (c) 2014-2015, Autohome.QingUI v0.2.1
 */
;
if (typeof Zepto === 'undefined') {
    throw new Error('FullPageSlider.js\'s script requires Zepto')
}

// FullPageSlider组件
// ==============================

! function($) {
    'use strict';

    function FullPageSlider(config) {

        // 定义配置选项
        config = $.extend({
            layout: '.full-page',       // 外层Dom
            wrap: '.content',           // 包裹容器
            activeClassName: 'active',  // 动画当前页面外层添加的class名称用于CSS3动画
            animationDuration: 500,     // 动画时间
            timingFunction: 'ease',     // 动画曲线
            index: 0,                   // 开始位置
            continuous: true,           // 无限滚动
            callback: function() {}     // 切换后的回调
        }, config);

        // dom 选取
        this.$layout = $(config.layout);
        this.$wrap = this.$layout.find(config.wrap);
        this.$items = this.$wrap.children();

        this.itemCont = this.$items.length;

        this.animationDuration = config.animationDuration;
        this.iNow = config.index >= this.itemCont ? config.index % this.itemCont : config.index;
        this.callback = config.callback;
        this.continuous = config.continuous;
        this.timingFunction = config.timingFunction;
        this.activeClassName = config.activeClassName;

        this.animated = true; // 定义动画开关监控动画是否运动完成

        // 初始化
        this.init();
        // 绑定事件
        this.event();
    }

    // 初始化
    // ==============================
    FullPageSlider.prototype.init = function() {
        var _this = this;

        _this.pageWidht = document.documentElement.clientWidth;
        _this.pageHeight = document.documentElement.clientHeight;

        if (_this.continuous) {
            _this.iNow++;
            _this.$wrap.append(_this.$items.eq(0).clone());
            _this.$wrap.prepend(_this.$items.eq(_this.$items.length - 1).clone());
            _this.$items = this.$wrap.children();
        }

        _this.$wrap.css({
            'transform': 'translate3d(0,' + (-_this.iNow * _this.pageHeight) + 'px,0)',
            '-webkit-transform': 'translate3d(0,' + (-_this.iNow * _this.pageHeight) + 'px,0)'
        });
        _this.callback && _this.callback(_this.iNow);
        _this.$items.eq(_this.iNow).addClass(this.activeClassName)
    }


    // 事件绑定
    // ==============================

    FullPageSlider.prototype.event = function() {
        var _this = this;

        _this.$layout.on('touchstart', function(e) {
                if (!_this.animated) {
                    return;
                }
                _this.startTime = new Date() * 1;
                _this.startY = e.touches[0].pageY;
                _this.offsetY = 0;
            })
            .on('touchmove', function(e) {
                e.preventDefault();
                if (!_this.animated) {
                    return;
                }
                _this.offsetY = _this.startY - e.targetTouches[0].pageY;
                _this.$wrap.css({
                    'transform': 'translate3d(0,' + (-_this.iNow * _this.pageHeight - _this.offsetY) + 'px,0)',
                    '-webkit-transform': 'translate3d(0,' + (-_this.iNow * _this.pageHeight - _this.offsetY) + 'px,0)'
                });
            })
            .on('touchend', function(evt) {
                if (!_this.animated) {
                    return;
                }

                var boundary = _this.pageHeight / 20; //边界就翻页值
                var endTime = new Date() * 1;
                var direction = ''; //滑动方向

                //判断手势
                if (endTime - _this.startTime > 300) {
                    if (_this.offsetY >= boundary) {
                        direction = 'swipeDown';
                    } else if (_this.offsetY < 0 && _this.offsetY < -boundary) {
                        direction = 'swipeUp';
                    } else {
                        direction = 'static';
                    }
                } else {
                    if (_this.offsetY > 30) {       //快速移动也能使得翻页
                        direction = 'swipeDown';    //向下滑动
                    } else if (_this.offsetY < -30) {
                        direction = 'swipeUp';      //向上滑动
                    } else {
                        direction = 'static';
                    }
                }

                switch (direction) {
                    case 'swipeUp':
                        _this.iNow--;
                        _this.moveSilder();
                        break;
                    case 'swipeDown':
                        _this.iNow++;
                        _this.moveSilder();
                        break;
                    case 'static':
                        _this.moveSilder();
                        break;
                }

            });

        $(window).on('resize', function() {
            _this.pageWidht = document.documentElement.clientWidth;
            _this.pageHeight = document.documentElement.clientHeight;
            _this.$wrap.css({
                'transform': 'translate3d(0,' + (-_this.iNow * _this.pageHeight) + 'px,0)',
                '-webkit-transform': 'translate3d(0,' + (-_this.iNow * _this.pageHeight) + 'px,0)'
            });
        });

    }


    // 事件触发后移动页面位置函数 依赖this.iNow
    // ==============================
    FullPageSlider.prototype.moveSilder = function() {
        var _this = this;
        if (!_this.continuous) {
            if (_this.iNow > _this.itemCont - 1) {
                _this.iNow = _this.itemCont - 1;
            } else if (_this.iNow < 0) {
                _this.iNow = 0;
            }
        }

        _this.animated = false;
        _this.$wrap.animate({
                'transform': 'translate3d(0,' + -_this.iNow * _this.pageHeight + 'px,0)',
                '-webkit-transform': 'translate3d(0,' + -_this.iNow * _this.pageHeight + 'px,0)'
            },
            _this.animationDuration,
            _this.timingFunction,
            function() {
                _this.animated = true;
                // 如果无限 调用位置置换
                _this.endJudge.call(_this);
            }
        );
    }

    // 边界位置移动wrap函数 为当前可视页面添加class
    // ==============================
    FullPageSlider.prototype.endJudge = function() {
        var _this = this;

        if (_this.continuous) {
            if (_this.iNow > _this.itemCont) {
                _this.iNow = 1;
            } else if (_this.iNow < 1) {
                _this.iNow = _this.itemCont;
            }
        }

        _this.callback && _this.callback(_this.iNow);
        _this.$items.eq(_this.iNow).addClass(_this.activeClassName).siblings().removeClass(_this.activeClassName);

        if (!_this.continuous) {
            return;
        }

        _this.$wrap.css({
            'transform': 'translate3d(0,' + -_this.iNow * _this.pageHeight + 'px,0)',
            '-webkit-transform': 'translate3d(0,' + -_this.iNow * _this.pageHeight + 'px,0)'
        });
    }

    FullPageSlider.prototype.next = function(){
        this.iNow++;
        this.moveSilder();
    }

    FullPageSlider.prototype.prev = function(){
        this.iNow--;
        this.moveSilder();
    }

    FullPageSlider.prototype.getPos = function(){
        return this.iNow;
    }

    FullPageSlider.prototype.getNumSlides = function(){
        return this.itemCont;
    }


    window.FullPageSlider = FullPageSlider;

}(Zepto);
