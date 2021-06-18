// m-touch-lr 菜单左右滑动

+function () {

    'use strict';

    // define class
    var MTouchLr = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MTouchLr.prototype.run = function () {
        var self = this;
        var $m_touch_lr = m(this.el);
        var $moveElement = $m_touch_lr.find(".m-touch-lr-cnt");

        m(this.el).find(".m-touch-lr-item").on("tap", function (event) {

            event.stopPropagation();
            // 选中的样式移动
            if (self.options.left) {
                self.left.call(self, m(this).index()); // 移动到left
            }
            else {
                self.center.call(self, m(this).index());   // 移动到center
            }
        });

        self.speedSetIntervalId = 0;  // 计算速度定时器id
        $m_touch_lr.touch(

            function (event, obj, preoObj) {
                event.preventDefault();
                obj.$moveElment = $moveElement;
                obj.moveElmentX = $moveElement.translateX();
                obj.moveElmentWidth = obj.$moveElment.outerWidth();
                obj.wraperWidth = $m_touch_lr.outerWidth();
                obj.moveXSpace = obj.wraperWidth - obj.moveElmentWidth;

                // 弹性拉动left
                if (preoObj.tempObj.length > 1 && obj.moveElmentX > 0) {
                    obj.moveElmentX = obj.moveElmentX2;
                    obj.moveElmentX2 = 0;
                }

                // 弹性拉动right
                if (preoObj.tempObj.length > 1 && (obj.moveElmentWidth > obj.wraperWidth) && (obj.moveElmentX < obj.moveXSpace)) {
                    obj.moveElmentX = obj.moveElmentX2;
                    obj.moveElmentX2 = 0;
                } 


                self.obj = obj;
              
                 // 计算移动速度
                    self.speedlateY = obj.x=0;
                    clearInterval(self.speedSetIntervalId);
                    self.speedSetIntervalFisrt = true;
                    self.speedlateX = 0;
                    self.speedScroll = 0;
                    self.speedlateX2 = 0;
                    self.speedlateX3 = 0;

                    // 计算移动速度
                    if (self.speedSetIntervalFisrt) {
                        self.speedSetIntervalFisrt = false;
                        self.speedSetIntervalId = obj.$moveElment.setInterval(function () {
                            self.speedlateX2 = obj.x || 0;
                            self.speedlateX3 = parseFloat(self.speedlateX2) - parseFloat(self.speedlateX);
                            self.speedlateX = self.speedlateX2;
                            self.speedScroll = self.speedlateX3;
                           
                        }, 50);
                    }

                // 触发自定义的事件
                m(this).emit("start.m.touch.lr", [this, obj.moveElmentX, obj]);
             
            },
            function (event, obj) {

                if (obj.isX) {
                    event.preventDefault();
                    event.stopPropagation();
                    obj.$moveElment.transition("none");
                    var translateX = obj.moveElmentX + obj.x;

                    // 左限住拉动
                    if (self.options.limitLeft) {
                        translateX = translateX > 0 ? 0: translateX;
                    }

                    // 右限住拉动
                    if (self.options.limitRight) {
                      
                        if (obj.moveElmentWidth > obj.wraperWidth && translateX < obj.moveXSpace) {
                            translateX = obj.moveXSpace;

                        }
                    }
 
                    // 移动滑动条
                    if (self.options.bar) {
                        self.moveBar(translateX).transition("none");
                    }

                    // 左限弹性拉动
                    if ( translateX > 0) {
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
                    m(this).emit("move.m.touch.lr", [this, translateX, obj]);
                }

            },
            function (event, obj) {

                if (obj.isX) {
                    var target = obj.$moveElment.translateX();
                   
                    // 计算移动速度
                    self.speedSetIntervalFisrt = true;
                    clearInterval(self.speedSetIntervalId);
                    target = target + self.speedScroll * 11; //修改速度值 

                    // 滑动过度效果
                    var gudingVal = obj.wraperWidth;
                    var translateX = $moveElement.translateX();
                    var moveVal = 0;

                    if (target > 0) {
                        target = 0;
                        moveVal = target - translateX;
                    } else {

                        target = target < obj.moveXSpace ? obj.moveXSpace : target;
                        moveVal = target - translateX;
                        moveVal = Math.abs(moveVal);
                    }

                    var beishu = Math.abs( moveVal) / gudingVal;
                    var ansTime = 600 * beishu;
                    if (moveVal < gudingVal) { ansTime = 600; }
                    ansTime = ansTime > 2000 ? 2000 : ansTime;

                    // 移动宽度小于大框
                    if (obj.moveElmentWidth < obj.wraperWidth) {
                        target = 0;
                        ansTime = 600;
                    }

                    // 拉到左边 触发自定义的事件
                    if (target >= 0) {
                        $moveElement.transition("transform " + ansTime + "ms " + MTouchLr.DEFAULTS.cubicBezierEnd);
                        $moveElement.setTimeout(function () {
                            $moveElement.emit("reachleft.m.touch.lr", [$moveElement, target, obj]);

                        }, ansTime);
                    }

                    // 拉到底部 触发自定义的事件
                    else if (target <= obj.moveXSpace) {
                        $moveElement.transition("transform " + ansTime + "ms " + MTouchLr.DEFAULTS.cubicBezierEnd);
                        $moveElement.setTimeout(function () {
                            $moveElement.emit("reachright.m.touch.lr", [$moveElement, target, obj]);

                        }, ansTime);

                    }
                    else { $moveElement.transition("transform " + ansTime + "ms " + MTouchLr.DEFAULTS.cubicBezierMiddle);}
        
                    if (self.options.touchTap) {
                        var translateIndex = Math.round(target / obj.wraperWidth);                
                        $moveElement.translateX(obj.wraperWidth * translateIndex);
            
                    } else {
                        $moveElement.translateX(target);
                       
                    }

                    // 触发自定义的事件
                    m(this).emit("end.m.touch.nav", [this, target, obj]);
                }
            }
        );

    };

    MTouchLr.DEFAULTS = {
        cubicBezierMiddle: "  cubic-bezier(0,.05,.31,.93)",
        cubicBezierEnd: "  cubic-bezier(0,.03,.27,1.22)",
        limit: 0.4,
    };

    // position left
    MTouchLr.prototype.left = function (index,bl) {
        var $ul = m(this.el).find(".m-touch-lr-cnt");
        var $li = $ul.find(".m-touch-lr-item").eq(index); 
        var window_w = m(this.el).outerWidth();

        var $ul_w = $ul.outerWidth();
        var current_left = $li.offset().left;
        var scroll_left = $ul_w - window_w;
        var moveX = 0;
        $li.addClass("active").siblings().removeClass("active");
        if ($ul_w > window_w) {

            if (Math.abs(current_left) < Math.abs(scroll_left)) {
                moveX = -current_left;
            } else {
                moveX = -scroll_left;
            }

            $ul.translateX(moveX);
            $ul.transition("all", 600, "ease");

        }

        // 触发自定义的事件
        if (!bl) { $li.emit("tap.m.touch.lr", [$li.get(0), moveX]); }
       
    };

    // position center
    MTouchLr.prototype.center = function (index,bl) {

        var $ul = m(this.el).find(".m-touch-lr-cnt");
        var $li = $ul.find(".m-touch-lr-item").eq(index); 
        var window_w = m(this.el).outerWidth();
        var $ul_w = $ul.outerWidth();
        var current_left = $li.offset().left;
        var current_w = $li.outerWidth();
        var current_center = Math.abs(window_w / 2);
        var offsetCenter = (current_left - current_center) + current_w / 2;
        var scroll_left = $ul_w - window_w;
        $li.addClass("active").siblings().removeClass("active");

        var moveX = 0;
        if ($ul_w > window_w) {

            if (Math.abs(current_left) > Math.abs(current_center)) {

                if (Math.abs(scroll_left) < offsetCenter) {
                    moveX = -Math.abs(scroll_left);
                } else {
                    moveX = -Math.abs(-offsetCenter);
                }

            } else {
                moveX = 0;
            }
            $ul.translateX(moveX);
            $ul.transition("all", 600, "ease");
        }

        // 触发自定义的事件
        if (!bl) { $li.emit("tap.m.touch.lr", [$li.get(0), moveX]); }

    };

    MTouchLr.prototype.set = function (index,bl) {
        var self = this;

        // 选中的样式移动
        if (self.options.left) {
            self.left.call(self, index,bl); // 移动到left
        }
        else {
            self.center.call(self, index,bl);   // 移动到center
        }  
    };

    function Plugin(option,index,bl) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-lr');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.limitLeft = $this.hasAttr("data-limit-left");
                o.limitRight = $this.hasAttr("data-limit-right");
                o.left = $this.hasAttr("data-left");
                o.limit = $this.attr("data-limit") ? Number($this.attr("data-limit")) : MTouchLr.DEFAULTS.limit;

                var p = $.extend({}, o, options);
                $this.data('m-touch-lr', data = new MTouchLr(this, p));
            }

            if (typeof option === 'string') {
                data[option](index,bl);
            }

        });

    }

    var _mTouchLr = $.fn.mTouchLr;
    m.fn.mTouchLr = Plugin;

    m("[data-toggle=m-touch-lr]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();