// m-touch-lr 菜单左右滑动

+function () {

    'use strict';

    // define class
    var MTouchLeftRight = function (el, options) {
        this.el = el;
        this.options = options;
        this.running();
    };

    MTouchLeftRight.prototype.running = function () {
        var self = this;
        var $m_touch_lr = m(this.el);
        var $moveElement = $m_touch_lr.find(".m-touch-lr-cnt");

        // 设置滑动条
        if (this.options.bar) {
            this.setBar();
        }

        self.speedSetIntervalId = 0;  // 计算速度定时器id
        $m_touch_lr.touch(

            function (event, obj) {
             
                obj.moveElmentX = $moveElement.translateX();
                obj.$moveElment = $moveElement;
               // obj.$moveElment.transition("none");
                self.obj = obj;
                obj.oneTouchLeft = true; // 每一个手指第一次触摸
                obj.oneTouchRight = true; // 每一个手指第一次触摸

                // 计算移动速度
                if (self.options.speed) {
                    self.speedlateY = obj.x;
                    clearInterval(self.speedSetIntervalId);
                    self.speedSetIntervalFisrt = true;
                    self.speedlateX = 0;
                    self.speedScroll = 0;
                    self.speedlateX2 = 0;
                    self.speedlateX3 = 0;

                    // 计算移动速度
                    if (self.speedSetIntervalFisrt) {
                        self.speedSetIntervalFisrt = false;
                        self.speedSetIntervalId = setInterval(function () {
                            self.speedlateX2 = obj.x || 0;
                            self.speedlateX3 = parseFloat(self.speedlateX2) - parseFloat(self.speedlateX);
                            self.speedlateX = self.speedlateX2;
                            self.speedScroll = self.speedlateX3;
                           
                        }, 20);
                    }
                }

                // 触发自定义的事件
                m(this).emit("m-touch-lr-start", [this, obj.moveElmentX, obj]);
             
            },
            function (event, obj) {

                if (obj.isX) {
                    event.preventDefault();
                    obj.$moveElment.transition("none");
                    var translateX = obj.moveElmentX + obj.x;

                    // 左限住拉动
                    if (self.options.limitLeft) {
                        translateX = translateX > 0 ? 0: translateX;
                    }

                    // 右限住拉动
                    var moveElmentWidth = obj.$moveElment.outerWidth();
                    var wraperWidth = $m_touch_lr.outerWidth();
                    var moveYSpace = wraperWidth - moveElmentWidth;
                    if (self.options.limitRight) {
                      
                        if (moveElmentWidth > wraperWidth && translateX < moveYSpace) {
                            translateX = moveYSpace;

                        }
                    }

                    // 左右最大限住拉动
                    var limitLeftRight = $m_touch_lr.outerWidth() * .95;
                    var maxLeftLimit = limitLeftRight;
                    translateX = translateX > maxLeftLimit ? maxLeftLimit : translateX;

                    var maxRightLimit = moveYSpace - limitLeftRight;

                    if (moveElmentWidth > wraperWidth ) {
                       
                        translateX = translateX < maxRightLimit ? maxRightLimit : translateX;
                    }
                  

                    // 移动滑动条
                    if (self.options.bar) {
                        self.moveBar(translateX).transition("none");
                    }

                    obj.$moveElment.translateX(translateX);
                    // 触发自定义的事件
                    m(this).emit("m-touch-lr-move", [this, translateX, obj]);


                }

            },
            function (event, obj) {

                if (obj.isX) {

                    var moveElmentWidth = obj.$moveElment.outerWidth();
                    var wraperWidth = $m_touch_lr.outerWidth();
                    var moveYSpace = wraperWidth - moveElmentWidth;
                    var target = obj.$moveElment.translateX();
                   
                    // 计算移动速度
                    if (self.options.speed) {
                        self.speedSetIntervalFisrt = true;
                        clearInterval(self.speedSetIntervalId);

                        // 计算移动速度
                        if (self.speedScroll > 200) {
                            self.speedScroll = 200;
                        } else if (self.speedScroll < -200) {
                            self.speedScroll = -200;
                        }


                        target = target + self.speedScroll * (wraperWidth / 20);

                    }

                    var transition = "transform .8s ease";
                    if (target > 0) {
                        target = 0;
                     
                        transition = "transform .8s cubic-bezier(.3,.53,.48,1.27)";
                      
                   
                    } else if (target < moveYSpace) {
                        target = moveYSpace;
                        if (moveElmentWidth < wraperWidth) {
                            target = 0;
                        }
                        transition = "transform .8s cubic-bezier(.3,.53,.48,1.27)";
                      
     
                    } else {
                        transition = "transform .8s cubic-bezier(.31,.66,.64,.98)";
                    
                    }

                    if (self.options.touchTab) {
                        var translateIndex = Math.round(target / wraperWidth);                
                        $moveElement.translateX(wraperWidth * translateIndex);
                        $moveElement.transition("transform .4s cubic-bezier(.31,.66,.64,.98)");
                        // 触发自定义的事件
                        m(this).emit("m-touch-lr-tab", [this, Math.abs(translateIndex), target, obj]);

                    } else {
                        $moveElement.translateX(target);
                        $moveElement.transition(transition);
                    }


                    // 移动滑动条
                    if (self.options.bar) {
                        self.moveBar(target).transition(transition);
                    }
                  

                    obj.oneTouchLeft = true; // 每一个手指第一次触摸
                    obj.oneTouchRight = true;

                    // 触发自定义的事件
                    m(this).emit("m-touch-lr-end", [this, target, obj]);


                }


            }

        );

    };

    MTouchLeftRight.prototype.setBar = function (x) {
        var $m_touch_lr = m(this.el);
        var pwr = document.createElement("div");
        pwr.classList.add("m-touch-lr-bar-pwr");
        var bar = document.createElement("div");
        bar.classList.add("m-touch-lr-bar");
        var item = document.createElement("div");
        item.classList.add("m-touch-lr-bar-item");
        bar.appendChild(item);

        pwr.appendChild(bar);
        $m_touch_lr.append(pwr);
        var winW = $m_touch_lr.outerWidth();
        var moveElementW = $m_touch_lr.find(".m-touch-lr-cnt").outerWidth();
        var ratio = winW / moveElementW;
        ratio = ratio > 1 ? 1 : ratio;

        $m_touch_lr.find(".m-touch-lr-bar-item").width($m_touch_lr.find(".m-touch-lr-bar").width() * ratio);
    };


    MTouchLeftRight.prototype.moveBar = function (x) {
        x = parseFloat(x) || 0;
        var x2 = x;
        x = Math.abs(x);
        var $m_touch_lr = m(this.el);
        
        var winW = $m_touch_lr.outerWidth();
        var moveElementW = $m_touch_lr.find(".m-touch-lr-cnt").outerWidth();
        if (moveElementW < winW) { return; }
        var moveLeft = moveElementW - winW;
        var ratio = x / moveLeft;

        var barW = $m_touch_lr.find(".m-touch-lr-bar").width();
        var itemW = $m_touch_lr.find(".m-touch-lr-bar-item").width();
        var moveX = ratio * (barW - itemW);
        moveX = x2 >0 ? -moveX : moveX;

        return $m_touch_lr.find(".m-touch-lr-bar-item").translateX(moveX);
    };


    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-lr');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.limitLeft = $this.hasAttr("data-limit-left");
                o.limitRight = $this.hasAttr("data-limit-right");
                o.speed = $this.hasAttr("data-speed");
                o.touchTab = $this.hasAttr("data-touch-tab");
                o.bar = $this.hasAttr("data-bar");

                var p = $.extend({}, o, options);
                $this.data('m-touch-lr', data = new MTouchLeftRight(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mTouchLeftRight = $.fn.mTouchLeftRight;
    $.fn.mTouchLeftRight = Plugin;

    $("[data-toggle=m-touch-lr]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();