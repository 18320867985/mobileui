// m-touch-nav-tb

+function () {

    'use strict';

    // define class
    var MToucTb = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MToucTb.prototype.run = function () {
        var self = this;
        var $m_touch_tb = m(this.el);
        var $moveElement = $m_touch_tb.find(".m-touch-tb-cnt");


        m(this.el).find(".m-touch-tb-item").on("tap", function (event) {

            event.stopPropagation();

            // 选中的样式移动
            if (self.options.top) {

                self.top.call(self, m(this).index()); // 移动到top
            }
            else {

                self.center.call(self, m(this).index());   // 移动到center
            }
            
        });
        
        self.speedSetIntervalId = 0;  // 计算速度定时器id
        $m_touch_tb.touch(

            function (event, obj, preoObj) {

                obj.$moveElment = $moveElement;
                obj.moveElmentY = $moveElement.translateY();
                obj.moveElmentHeigth = obj.$moveElment.outerHeight();
                obj.wraperHeight = $m_touch_tb.outerHeight();
                obj.moveYSpace = obj.wraperHeight - obj.moveElmentHeigth;

                // 弹性拉动top
                if (preoObj.tempObj.length >1 && obj.moveElmentY >0) {
                    obj.moveElmentY = obj.moveElmentY2;
                    obj.moveElmentY2 = 0;
                } 

                // 弹性拉动bottom
                if (preoObj.tempObj.length > 1 && (obj.moveElmentHeigth > obj.wraperHeight) && (obj.moveElmentY< obj.moveYSpace)) {
                    obj.moveElmentY = obj.moveElmentY2;
                    obj.moveElmentY2 = 0;
                } 

                self.obj = obj;

                // 计算移动速度
                    self.speedlateY = obj.y=0;
                    clearInterval(self.speedSetIntervalId);
                    self.speedSetIntervalFisrt = true;
                    self.speedlateY = 0;
                    self.speedScroll = 0;
                    self.speedlateY2 = 0;
                    self.speedlateY3 = 0;

                    // 计算移动速度
                    if (self.speedSetIntervalFisrt) {
                        self.speedSetIntervalFisrt = false;
                        self.speedSetIntervalId = obj.$moveElment.setInterval(function () {
                            self.speedlateY2 = obj.y|| 0;
                            self.speedlateY3 = parseFloat(self.speedlateY2) - parseFloat(self.speedlateY);
                            self.speedlateY = self.speedlateY2;
                            self.speedScroll = self.speedlateY3;
                     
                        }, 50);
                    }


                // 触发自定义的事件
                m(this).emit("start.m.touch.tb", [this, obj.moveElmentY, obj]);
             
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
                      
                        if (obj.moveElmentHeigth > obj.wraperHeight && translateY < obj.moveYSpace) {
                            translateY = obj.moveYSpace;
                        }
                    }

                    // 上限弹性拉动
                    if (translateY > 0) {
                        obj.moveElmentY2 = translateY;
                        var biliTop = translateY / obj.wraperHeight;
                        translateY = obj.wraperHeight * self.options.limit * biliTop;
                        // 触发自定义的事件
                        m(this).emit("limit.m.touch.tb", [this, translateY, obj]);
                    }

                    // 下限弹性拉动
                    if ((obj.moveElmentHeigth > obj.wraperHeight) && (translateY < obj.moveYSpace)) {
                        var moveBottomVal = (translateY - obj.moveYSpace);
                        obj.moveElmentY2 = translateY;
                        var biliBottom = Math.abs(moveBottomVal) / obj.wraperHeight;
                        translateY = obj.wraperHeight * (1 - self.options.limit) * biliBottom + translateY; 
                        
                        // 触发自定义的事件
                        m(this).emit("limit.m.touch.tb", [this, translateY, obj]);
                    }

                    obj.$moveElment.translateY(translateY);
                    // 触发自定义的事件
                    m(this).emit("move.m.touch.tb", [this, translateY,obj]);
                }

            },

            function (event, obj) {

                if (obj.isY) {
                    var target = obj.$moveElment.translateY();
                   
                    // 计算移动速度
                    self.speedSetIntervalFisrt = true;
                    clearInterval(self.speedSetIntervalId);
                    target = target + self.speedScroll * 11; //修改速度值 
      
                     // 滑动过度效果
                    var gudingVal = obj.wraperHeight;
                    var translateY = obj.$moveElment.translateY();
                    var moveVal = 0;
                    if (target > 0) {
                        target = 0;
                        moveVal = target - translateY;
                       
                    } else {

                        target = target < obj.moveYSpace ? obj.moveYSpace : target;
                        moveVal = target - translateY;
                        moveVal = Math.abs(moveVal);
               
                    } 

                    var beishu = Math.abs(moveVal) / gudingVal;
                    var ansTime = 600 * beishu;
                    if (moveVal < gudingVal) { ansTime = 600; }
                    ansTime = ansTime > 2000 ? 2000 : ansTime;

                    // 移动高度小于大框
                    if (obj.moveElmentHeigth <= obj.wraperHeight) {
                        target = 0;
                        ansTime = 600;
                    }

                    if (target >= 0) {
                        $moveElement.transition("transform " + ansTime + "ms " + MToucTb.DEFAULTS.cubicBezierEnd);
                    } else if (target <=obj.moveYSpace){
                             $moveElement.transition("transform " + ansTime + "ms " + MToucTb.DEFAULTS.cubicBezierEnd);
                    } else {
                        $moveElement.transition("transform " + ansTime + "ms " + MToucTb.DEFAULTS.cubicBezierMiddle);
                    }

                    obj.$moveElment.translateY(target);

                    // 触发自定义的事件
                    var $this = m(this);
                    $this.emit("end.m.touch.tb", [$this, target, obj]);

                    // 拉到顶部 触发自定义的事件
                    if (target >=0) {
                        $this.setTimeout(function () {
                            $this.emit("reachtop.m.touch.tb", [$this, target, obj]);
                        }, ansTime);
                    }

                    // 拉到底部 触发自定义的事件
                    if (target <= obj.moveYSpace) {
                        $this.setTimeout(function () {
                            $this.emit("reachbottom.m.touch.tb", [$this, target, obj]);

                        }, ansTime);

                    }
                }

            }

        );

    };


    MToucTb.DEFAULTS = {
        cubicBezierMiddle: "  cubic-bezier(0,.05,.31,.93)",
        cubicBezierEnd: "  cubic-bezier(0,.03,.27,1.22)",
        limit:0.3
    };

    // position 
    MToucTb.prototype.top = function (index, bl) {

        var $ul = m(this.el).find(".m-touch-tb-cnt");
        var $li = $ul.find(".m-touch-tb-item").eq(index);    //m(item);
        var window_h = m(this.el).outerHeight();
        var $ul_h = $ul.outerHeight();
        var current_top = $li.offset().top;
        var scroll_top = $ul_h - window_h;
        var moveY = 0;

        $li.addClass("active").siblings().removeClass("active");

        if ($ul_h < window_h) {
            moveY = 0;
        }else {
            if (current_top < scroll_top) {
                moveY = -current_top;

            } else {
                moveY = -scroll_top;
            }

            $ul.translateY(moveY);
            $ul.transition("all", 600, "ease");
        }

        // 触发自定义的事件
        if (!bl) { $li.emit("tap.m.touch.tb", [$li.get(0), moveY]); }

    };

    // position center
    MToucTb.prototype.center = function (index,bl) {

        var $ul = m(this.el).find(".m-touch-tb-cnt");
        var $li = $ul.find(".m-touch-tb-item").eq(index);    //m(item);
        var window_h = m(this.el).outerHeight();
        var $ul_h = $ul.outerHeight();
        var current_top = $li.offset().top;
        var current_h = $li.outerHeight();
        var current_center = Math.abs(window_h / 2);
        var offsetCenter = (current_top - current_center) + current_h / 2;
        var scroll_top = $ul_h - window_h;
        $li.addClass("active").siblings().removeClass("active");

        var moveY = 0;
        if ($ul_h > window_h) {

            if (Math.abs(current_top) > Math.abs(current_center)) {

                if (Math.abs(scroll_top) < offsetCenter) {
                    moveY = -Math.abs(scroll_top);
                } else {
                    moveY = -Math.abs(-offsetCenter);
                }

            } else {

                moveY = 0;
            }

            $ul.translateY(moveY);
            $ul.transition("all", 600, "ease");
        }

        // 触发自定义的事件
        if (!bl) { $li.emit("tap.m.touch.tb", [$li.get(0), moveY]); }
       

    };

    MToucTb.prototype.set = function (el, bl) {
        var self = this;
        // 选中的样式移动
        if (self.options.top) {

            self.top.call(self, el, bl);       // 移动到left
        }
        else {

            self.center.call(self, el, bl);   // 移动到center
        }
    };

    function Plugin(option, index, bl) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-tb');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.limitTop = $this.hasAttr("data-limit-top");
                o.limitBottom = $this.hasAttr("data-limit-bottom");
                o.top = $this.hasAttr("data-top");
                o.limit = $this.attr("data-limit") ? Number($this.attr("data-limit")) : MToucTb.DEFAULTS.limit;
                var p = $.extend({}, o, options);
                $this.data('m-touch-tb', data = new MToucTb(this, p));
            }

            if (typeof option === 'string') {
                data[option](index,bl);
            }

        });

    }

    var _mTouchTb = $.fn.mTouchTb;
    m.fn.mTouchTb = Plugin;

    m("[data-toggle=m-touch-tb]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();