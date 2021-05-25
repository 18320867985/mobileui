// m-touch-nav-tb

+function () {

    'use strict';

    // define class
    var MTouchNavTb = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MTouchNavTb.prototype.run = function () {
        var self = this;
        var $m_touch_tb = m(this.el);
        var $moveElement = $m_touch_tb.find(".m-touch-nav-tb-cnt");


        m(this.el).find(".m-touch-nav-item").on("tap", function (event) {

            event.stopPropagation();

            // 选中的样式移动
            //if (self.options.top) {

            //    self.top.call(self, this); // 移动到top
            //}
            //else {

            //    self.center.call(self, this);   // 移动到center
            //}
            self.center.call(self, this);   // 移动到center
        });
        
        self.speedSetIntervalId = 0;  // 计算速度定时器id
        $m_touch_tb.touch(

            function (event, obj) {
              
                obj.moveElmentY = $moveElement.translateY();
                obj.$moveElment = $moveElement;
               // obj.$moveElment.transition("none");
                self.obj = obj;
            
                // 计算移动速度
               // if (self.options.speed) {
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
                        self.speedSetIntervalId = setInterval(function () {
                            self.speedlateY2 = obj.y|| 0;
                            self.speedlateY3 = parseFloat(self.speedlateY2) - parseFloat(self.speedlateY);
                            self.speedlateY = self.speedlateY2;
                            self.speedScroll = self.speedlateY3;
                          

                        }, 50);
                    }
             //   }

                // 触发自定义的事件
                m(this).emit("start.m.touch.nav.tb", [this, obj.moveElmentY, obj]);
             
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
                    m(this).emit("move.m.touch.nav.tb", [this, translateY,obj]);

                }

            },

            function (event, obj) {

                if (obj.isY) {
                 
                    var moveElmentHeigth = obj.$moveElment.outerHeight();
                    var wraperHeight = $m_touch_tb.outerHeight();
                    var moveYSpace = wraperHeight - moveElmentHeigth;
                    var target = obj.$moveElment.translateY();
                   
                    // 计算移动速度
                   // if (self.options.speed) {

                        self.speedSetIntervalFisrt = true;
                        clearInterval(self.speedSetIntervalId);

                        // 计算移动速度
                        //if (self.speedScroll > 200) {
                        //    self.speedScroll = 200;
                        //} else if (self.speedScroll < -200) {
                        //    self.speedScroll = -200;
                        //}

                    target = target + self.speedScroll * (wraperHeight / 60); //修改速度值 20 ，40， 60
                 //   }


                     // 滑动过度效果
                    var gudingVal = 200;
                    var translateY = obj.$moveElment.translateY();
                    var spaceMoveY = Math.abs(target - translateY);
                    var beishu = spaceMoveY / gudingVal;
                    var ansTime = 600 * beishu;
                    if (spaceMoveY < gudingVal) { ansTime = 600; }
                    ansTime = ansTime > 2000 ? 2000 : ansTime;

               
                    if (target > 0) {
                        target = 0;
                        ansTime = 600;
                    } else if (target < moveYSpace) {
                            target = moveYSpace;
                        if (moveElmentHeigth < wraperHeight) {
                            target = 0;
                            ansTime = 600;
                        }
                      //  $moveElement.transition("transform 600ms   cubic-bezier(.3,.53,.48,1.1)");
                        // 拉到底部 触发自定义的事件
                       // m(this).emit("m-touch-tb-reachbottom", [this, target, obj]);
                    }

                    //cubic-bezier(.25,.96,.8,.98) cubic-bezier(.12,.87,.5,.97)
                    $moveElement.transition("transform " + ansTime + "ms cubic-bezier(.13,.77,.53,.93)");
                    obj.$moveElment.translateY(target);

                    // 触发自定义的事件
                    m(this).emit("end.m.touch.nav.tb", [this, target, obj]);

                }

            }

        );

    };

    // position left
    MTouchNavTb.prototype.top = function (item,bl) {
        var $ul = m(this.el).find(".m-touch-nav-tb-cnt");
        var $li = m(item);
        var window_h = m(this.el).outerHeight();

        var $ul_h = $ul.outerHeight();
        var current_top = $li.offset().top;
        var scroll_top = $ul_h - window_h;
        var moveY = 0;

        $li.addClass("active").siblings().removeClass("active");
        if ($ul_h > window_h) {

            if (Math.abs(current_top) < Math.abs(scroll_top)) {
                moveY = -current_top;
            } else {
                moveY = -scroll_top;
            }

            $ul.translateY(moveY);
            $ul.transition("all", 600, "ease");

        }

        // 触发自定义的事件
        if (!bl) { $li.emit("tap.m.touch.nav.tb", [item, moveY]); }

    };

    // position center
    MTouchNavTb.prototype.center = function (item,bl) {

        var $ul = m(this.el).find(".m-touch-nav-tb-cnt");
        var $li = m(item);
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
        if (!bl) { $li.emit("tap.m.touch.nav.tb", [item, moveY]); }
       

    };

    MTouchNavTb.prototype.set = function (el, bl) {
        var self = this;
        // 选中的样式移动
        //if (self.options.top) {

        //    self.top.call(self, el, bl); // 移动到left
        //}
        //else {

        //    self.center.call(self, el, bl);   // 移动到center
        //}

        self.center.call(self, el, bl);   // 移动到center
    };

    function Plugin(option, el, bl) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-nav-tb');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.limitTop = $this.hasAttr("data-limit-top");
                o.limitBottom = $this.hasAttr("data-limit-bottom");
                o.top = $this.hasAttr("data-top");
               // o.center = $this.hasAttr("data-center");
            
                var p = $.extend({}, o, options);
                $this.data('m-touch-nav-tb', data = new MTouchNavTb(this, p));
            }

            if (typeof option === 'string') {
                data[option](el,bl);
            }

        });

    }

    var _mTouchNavTb = $.fn.mTouchNavTb;
    m.fn.mTouchNavTb = Plugin;

    m("[data-toggle=m-touch-nav-tb]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();