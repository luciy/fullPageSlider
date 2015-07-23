/**
 * FullPageSlider.js
 * @author  : lengxu
 * @version : 1.0.1
 * @date    : 2015-07-23
 * http://www.uis.cc/
 * copyright (c) 2014-2015, Autohome.QingUI v1.0.4
 */
;
if (typeof Zepto === 'undefined') {
    throw new Error('FullPageSlider.js\'s script requires Zepto')
}

// FullPageSlider组件
! function($) {
    'use strict';

    function FullPageSlider(config) {

        // 定义配置选项
        config = $.extend({
            layout: '.full-page',           // 外层Dom
            wrap: '.content',               // 包裹容器
            activeClassName: 'active',      // 动画当前页面外层添加的class名称用于CSS3动画
            animationDuration: 500,         // 动画时间
            timingFunction: 'ease',         // 动画曲线
            index: 0,                       // 开始位置
            continuous: true,               // 无限滚动
            callback: function() {}         // 切换后的回调
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

        this.animated = true;               // 定义动画开关监控动画是否运动完成

        // 初始化
        this.init();
        // 绑定事件
        this.event();
    };

    // 初始化
    FullPageSlider.prototype.init = function() {
        var self = this;

        self.pageWidht = document.documentElement.clientWidth;
        self.pageHeight = document.documentElement.clientHeight;

        if (self.continuous) {
            self.iNow++;
            self.$wrap.append(self.$items.eq(0).clone());
            self.$wrap.prepend(self.$items.eq(self.$items.length - 1).clone());
            self.$items = self.$wrap.children();
        }

        self.$wrap.css({
            'transform': 'translate3d(0,' + (-self.iNow * self.pageHeight) + 'px,0)',
            '-webkit-transform': 'translate3d(0,' + (-self.iNow * self.pageHeight) + 'px,0)'
        });
        self.callback && self.callback(self.iNow);
        self.$items.eq(self.iNow).addClass(self.activeClassName)
    };

    // 事件绑定
    FullPageSlider.prototype.event = function() {
        var self = this;

        self.$layout.on('touchstart', function(e) {
                if (!self.animated) {
                    return;
                }
                self.startTime = new Date() * 1;
                self.startY = e.touches[0].pageY;
                self.offsetY = 0;
            })
            .on('touchmove', function(e) {
                e.preventDefault();
                if (!self.animated) {
                    return;
                }
                self.offsetY = self.startY - e.targetTouches[0].pageY;
                self.$wrap.css({
                    'transform': 'translate3d(0,' + (-self.iNow * self.pageHeight - self.offsetY) + 'px,0)',
                    '-webkit-transform': 'translate3d(0,' + (-self.iNow * self.pageHeight - self.offsetY) + 'px,0)'
                });
            })
            .on('touchend', function(evt) {
                if (!self.animated) {
                    return;
                }

                var boundary = self.pageHeight / 20;     //边界就翻页值
                var endTime = new Date() * 1;
                var direction = '';                      //滑动方向

                //判断手势
                if (endTime - self.startTime > 300) {
                    if (self.offsetY >= boundary) {
                        direction = 'swipeDown';
                    } else if (self.offsetY < 0 && self.offsetY < -boundary) {
                        direction = 'swipeUp';
                    } else {
                        direction = 'static';
                    }
                } else {
                    if (self.offsetY > 30) {            //快速移动也能使得翻页
                        direction = 'swipeDown';        //向下滑动
                    } else if (self.offsetY < -30) {
                        direction = 'swipeUp';          //向上滑动
                    } else {
                        direction = 'static';
                    }
                }

                switch (direction) {
                    case 'swipeUp':
                        self.iNow--;
                        self.moveSilder();
                        break;
                    case 'swipeDown':
                        self.iNow++;
                        self.moveSilder();
                        break;
                    case 'static':
                        self.moveSilder();
                        break;
                }

            });

        $(window).on('resize', function(){
            self.pageWidht = document.documentElement.clientWidth;
            self.pageHeight = document.documentElement.clientHeight;
            self.$wrap.css({
                'transform': 'translate3d(0,' + (-self.iNow * self.pageHeight) + 'px,0)',
                '-webkit-transform': 'translate3d(0,' + (-self.iNow * self.pageHeight) + 'px,0)'
            });
        });
    };

    // 事件触发后移动页面位置函数 依赖this.iNow
    FullPageSlider.prototype.moveSilder = function() {
        var self = this;
        if (!self.continuous) {
            if (self.iNow > self.itemCont - 1) {
                self.iNow = self.itemCont - 1;
            } else if (self.iNow < 0) {
                self.iNow = 0;
            }
        } else {
            if (self.iNow > self.itemCont + 1) {
                self.iNow = self.iNow % self.itemCont;
            } else if (self.iNow < -1) {
                self.iNow = Math.abs(self.iNow % self.itemCont);
            }
        }

        self.animated = false;
        self.$wrap.animate({
                'transform': 'translate3d(0,' + -self.iNow * self.pageHeight + 'px,0)',
                '-webkit-transform': 'translate3d(0,' + -self.iNow * self.pageHeight + 'px,0)'
            },
            self.animationDuration,
            self.timingFunction,
            function() {
                self.animated = true;
                // 如果无限 调用位置置换
                self.endJudge.call(self);
            }
        );
    };

    // 边界位置移动wrap函数 为当前可视页面添加class
    FullPageSlider.prototype.endJudge = function() {
        var self = this;

        if (self.continuous) {
            if (self.iNow > self.itemCont) {
                self.iNow = 1;
            } else if (self.iNow < 1) {
                self.iNow = self.itemCont;
            }
        }

        self.callback && self.callback(self.iNow);
        self.$items.eq(self.iNow).addClass(self.activeClassName).siblings().removeClass(self.activeClassName);

        if (!self.continuous) {
            return;
        }

        self.$wrap.css({
            'transform': 'translate3d(0,' + -self.iNow * self.pageHeight + 'px,0)',
            '-webkit-transform': 'translate3d(0,' + -self.iNow * self.pageHeight + 'px,0)'
        });
    };

    FullPageSlider.prototype.next = function() {
        this.iNow++;
        this.moveSilder();
    };

    FullPageSlider.prototype.prev = function() {
        this.iNow--;
        this.moveSilder();
    };

    FullPageSlider.prototype.sliderTo = function(i) {
        if (!this.continuous) {
            this.iNow = i;
        } else {
            this.iNow = i + 1;
        }
        this.moveSilder();
    };

    FullPageSlider.prototype.getPos = function() {
        return this.iNow;
    };

    FullPageSlider.prototype.getNumSlides = function() {
        return this.itemCont;
    };

    FullPageSlider.prototype.destroy = function(){
        this.$items.removeClass(this.activeClassName);
        this.$layout.off('touchstart').off('touchmove').off('touchend');
        this.$wrap.attr('style',null);
    };

    window.FullPageSlider = FullPageSlider;

}(Zepto);
