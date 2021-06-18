// m-touch-tab

+function () {

    'use strict';

    // define class
    var MTouchTab = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MTouchTab.prototype.run = function () {
        var self = this;
        var $m_touch_lr = m(this.el);
        var $moveElement = $m_touch_lr.find(".m-touch-tab-cnt");

        $m_touch_lr.find(".m-touch-tab-item").width($m_touch_lr.outerWidth());

        m(window).resize(function () {$m_touch_lr.find(".m-touch-tab-item").width($m_touch_lr.outerWidth());});

        $m_touch_lr.touch(

            function (event, obj, preoObj) {

                obj.moveElmentX = $moveElement.translateX();
                obj.$moveElment = $moveElement;
                obj.$moveElment.transition("none");
                obj.moveElmentWidth = obj.$moveElment.outerWidth();
                obj.wraperWidth = $m_touch_lr.outerWidth();
                obj.moveXSpace = obj.wraperWidth - obj.moveElmentWidth;

                // 弹性拉动top
                if (preoObj.tempObj.length > 1 && obj.moveElmentX > 0) {
                    obj.moveElmentX = obj.moveElmentX2;
                    obj.moveElmentX2 = 0;
                }

                // 弹性拉动bottom
                if (preoObj.tempObj.length > 1 && (obj.moveElmentWidth > obj.wraperWidth) && (obj.moveElmentX < obj.moveXSpace)) {
                    obj.moveElmentX= obj.moveElmentX2;
                    obj.moveElmentX2 = 0;
                } 

                self.obj = obj;

                // 触发自定义的事件
                m(this).emit("start.m.touch.tab", [this, obj.moveElmentX, obj]);

            },
            function (event, obj) {

                if (obj.isX) {
                    event.preventDefault();

                    // 阻外层冒泡
                    if (obj.oneTouch === 1) { return; }
                    if (($moveElement.translateX() === 0) && (obj.x > 0) && (obj.oneTouch === undefined)) { obj.oneTouch = 1; } else { obj.oneTouch = 2; }

                    if (obj.oneTouch === 1) {

                        return;
                    }
                    if (obj.oneTouch === 2) {
                        event.stopPropagation();
                    }

                    obj.$moveElment.transition("none");
                    var translateX = obj.moveElmentX + obj.x;

                    // 左限弹性拉动
                    if (translateX > 0) {
                        obj.moveElmentX2 = translateX;
                        var biliLeft = translateX / obj.wraperWidth;
                        translateX = obj.wraperWidth * self.options.limit * biliLeft;
                    }

                    // 右限弹性拉动
                    if ((obj.moveElmentWidth > obj.wraperWidth) && (translateX < obj.moveXSpace)) {
                        var moveRightVal = (translateX - obj.moveXSpace)
                        obj.moveElmentX2 = translateX;
                        var biliRight = Math.abs(moveRightVal) / obj.wraperWidth;
                        translateX = obj.wraperWidth * (1 - self.options.limit) * biliRight + translateX;
                    }

                    obj.$moveElment.translateX(translateX);
                    // 触发自定义的事件
                    m(this).emit("move.m.touch.tab", [this, translateX, obj]);
                }

            },
            function (event, obj) {

                if (obj.isX) {

                    var target = obj.$moveElment.translateX();
                    var transition = "transform .4s " + MTouchTab.DEFAULTS.cubicBezier;
                    if (target > 0) {
                        target = 0;

                    } else if (target < obj.moveYSpace) {
                        target = moveYSpace;
                        if (obj.moveElmentWidth < obj.wraperWidth) {
                            target = 0;
                        }
                    }

                    var translateIndex = Math.round(target / obj.wraperWidth);
                    var moveVal = obj.wraperWidth * translateIndex;
                    moveVal = obj.moveXSpace >= moveVal ? obj.moveXSpace : moveVal;

                    var maxIndex = -(Math.round(obj.moveElmentWidth / obj.wraperWidth)-1);
                    translateIndex = translateIndex <= maxIndex ? maxIndex : translateIndex;
                    $moveElement.translateX(moveVal);
                    $moveElement.transition(transition);
        
                    // 触发自定义的事件
                    var $activeEl = $moveElement.find(".m-touch-tab-item").eq(Math.abs(translateIndex));
                    m(this).emit("tab.m.touch.tab", [$activeEl, Math.abs(translateIndex)]);

                    // 设置选择的样式
                    $activeEl.addClass("active").siblings().removeClass("active");

                    // 移动滑动条
                    if (self.options.bar) {
                        self.moveBar(target).transition(transition);
                    }

                    // 触发自定义的事件
                    m(this).emit("end.m.touch.tab", [this, target, obj]);
                    obj.oneTouch = undefined;

                }

            }

        );

        
    };

    MTouchTab.DEFAULTS = {
        cubicBezier: " ease",
        limit: 0.15
    };

   
    MTouchTab.prototype.set = function (translateIndex) {

        var $m_touch_lr = m(this.el);
        var wraperWidth = m(this.el).outerWidth();
        var $moveElment = $m_touch_lr.find(".m-touch-tab-cnt");
        var moveXSpace = wraperWidth - $moveElment.outerWidth();
        var moveVal = -wraperWidth * translateIndex;
        moveVal=moveXSpace >= moveVal ? moveXSpace : moveVal;
        $moveElment.translateX(moveVal);
        $moveElment.transition("transform  .4s " + MTouchTab.DEFAULTS.cubicBezier);  
        if (this.options.fade) { $moveElment.transition("opacity  .4s " + MTouchTab.DEFAULTS.cubicBezier); }
     
        // 触发自定义的事件
        var $activeEl = $moveElment.find(".m-touch-tab-item").eq(Math.abs(translateIndex));
     
        // 设置选择的样式
        $activeEl.addClass("active").siblings().removeClass("active");

    };

    function Plugin(option,index) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-tab');
            var options = typeof option === 'object' && option;
            if (!data) {
                var o = {};
                o.limit = $this.attr("data-limit") ? Number($this.attr("data-limit")) : MTouchTab.DEFAULTS.limit;
                var p = $.extend({}, o, options);
                $this.data('m-touch-tab', data = new MTouchTab(this, p));
            }

            if (typeof option === 'string') {
                data[option](index);
            }

        });

    }

    var _mTouchTab = $.fn.mTouchTab;
    m.fn.mTouchTab = Plugin;

    m("[data-toggle=m-touch-tab]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();