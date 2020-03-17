// m-touch-lr 菜单左右滑动

+function () {

    'use strict';

    // define class
    var MTouchTopBottom = function (el, options) {
        this.el = el;
        this.options = options;
        this.running();
    };

    MTouchTopBottom.prototype.running = function () {
        var self = this;
        var $m_touch_tb = m(this.el);
        var $moveElement = $m_touch_tb.find(".m-touch-tb-cnt");
        
        self.speedSetIntervalId = 0;  // 计算速度定时器id
        $m_touch_tb.touch(

            function (event, obj) {
              
                obj.moveElmentY = $moveElement.translateY();
                obj.$moveElment = $moveElement;
               // obj.$moveElment.transition("none");
                self.obj = obj;
                obj.oneTouchTop = true; // 每一个手指第一次触摸
                obj.oneTouchBottom = true; // 每一个手指第一次触摸

                // 触发自定义的事件
                m(this).emit("m-touch-tb-start", [this, obj.moveElmentY, obj]);
             
            },
            function (event, obj) {

                if (obj.isY) {
                    event.preventDefault();
                    obj.$moveElment.transition("none");
                    var translateY = obj.moveElmentY + obj.y;

                  
                    // 上限住拉动
                    if (self.options.limitTop) {
                        translateY = translateY > 0 ? 0 : translateY;
                    }

                    // 下限住拉动
                    if (self.options.limitBottom) {
                        var moveElmentHeigth = obj.$moveElment.outerHeight();
                        var wraperHeight = $m_touch_tb.outerHeight();
                        var moveYSpace = wraperHeight - moveElmentHeigth;
                        if (moveElmentHeigth > wraperHeight&&translateY < moveYSpace) {
                            translateY = moveYSpace;
                            
                        }
                    }

                    obj.$moveElment.translateY(translateY);
                    // 触发自定义的事件
                    m(this).emit("m-touch-tb-move", [this, translateY,obj]);

                }

            },
            function (event, obj) {

                if (obj.isY) {

                    var moveElmentHeigth = obj.$moveElment.outerHeight();
                    var wraperHeight = $m_touch_tb.outerHeight();
                    var moveYSpace = wraperHeight - moveElmentHeigth;
                    var target = obj.$moveElment.translateY();
                  

                    if (target > 0) {
                        target = 0;
                        $moveElement.transition("transform .8s cubic-bezier(.3,.53,.48,1.27)");
                    } else if (target < moveYSpace) {
                            target = moveYSpace;
                        if (moveElmentHeigth < wraperHeight) {
                            target = 0;
                        }
                        $moveElement.transition("transform .8s cubic-bezier(.3,.53,.48,1.27)");
                        // 拉到底部 触发自定义的事件
                        m(this).emit("m-touch-tb-reachbottom", [this, target, obj]);
                    } else {
                        $moveElement.transition("transform .8s cubic-bezier(.31,.66,.64,.98)");
                    }

                    obj.oneTouchTop = true; // 每一个手指第一次触摸
                    obj.oneTouchBottom = true;
                    $moveElement.translateY(target);
                    
                  
                    // 触发自定义的事件
                    m(this).emit("m-touch-tb-end", [this, target, obj]);

                }

            }

        );

    };

    // tuoch左右移动动态限制
    MTouchTopBottom.prototype.limitdy = function (obj, wraperHeight) {

        var translateY = obj.moveElmentY + obj.y;
        var minY= wraperHeight - obj.$moveElment.outerHeight();

        if (this.options.limit) {

            if (translateY > 0) {
                var scale = 1 - obj.$moveElment.translateY() / wraperHeight;
                scale = scale < 0 ? 0 : scale;
                translateY = translateY * scale;

            }
            //else if (translateY < minY) {
            //    var over = Math.abs(translateY - minY);
            //    scale = 1 - over / wraperHeight;
            //    translateY = minY - over * scale;

            //}
        }
        
        return translateY;

    };


    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-tb');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.limitTop = $this.hasAttr("data-limit-top");
                o.limitBottom= $this.hasAttr("data-limit-bottom");
                o.speed = $this.hasAttr("data-speed");
                o.touchTab = $this.hasAttr("data-touch-tab");

                var p = $.extend({}, o, options);
                $this.data('m-touch-tb', data = new MTouchTopBottom(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mTouchTopBottom = $.fn.mTouchTopBottom;
    $.fn.mTouchTopBottom = Plugin;

    $("[data-toggle=m-touch-tb]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();