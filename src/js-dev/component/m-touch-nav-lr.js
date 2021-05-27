// m-touch-lr 菜单左右滑动

+function () {

    'use strict';

    // define class
    var MTouchNavLr = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MTouchNavLr.prototype.run = function () {
        var self = this;
        var $m_touch_lr = m(this.el);
        var $moveElement = $m_touch_lr.find(".m-touch-nav-cnt");

        m(this.el).find(".m-touch-nav-item").on("tap", function (event) {

            event.stopPropagation();

            // 选中的样式移动
            //if (self.options.left) {

            //    self.left.call(self, this); // 移动到left
            //}
            //else {

            //    self.center.call(self, this);   // 移动到center
            //}

            self.center.call(self, this);   // 移动到center

        });

  
        self.speedSetIntervalId = 0;  // 计算速度定时器id

        $m_touch_lr.touch(

            function (event, obj) {
                event.preventDefault();
                obj.moveElmentX = $moveElement.translateX();
                obj.$moveElment = $moveElement;
               // obj.$moveElment.transition("none");
                self.obj = obj;
              
                // 计算移动速度
               // if (self.options.speed) {
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
                        self.speedSetIntervalId = setInterval(function () {
                            self.speedlateX2 = obj.x || 0;
                            self.speedlateX3 = parseFloat(self.speedlateX2) - parseFloat(self.speedlateX);
                            self.speedlateX = self.speedlateX2;
                            self.speedScroll = self.speedlateX3;
                           
                        }, 50);
                    }
              //  }

                // 触发自定义的事件
                m(this).emit("start.m.touch.nav", [this, obj.moveElmentX, obj]);
             
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
                    var moveElmentWidth = obj.$moveElment.outerWidth();
                    var wraperWidth = $m_touch_lr.outerWidth();
                    var moveYSpace = wraperWidth - moveElmentWidth;
                    if (self.options.limitRight) {
                      
                        if (moveElmentWidth > wraperWidth && translateX < moveYSpace) {
                            translateX = moveYSpace;

                        }
                    }
 
                    // 移动滑动条
                    if (self.options.bar) {
                        self.moveBar(translateX).transition("none");
                    }


                    obj.$moveElment.translateX(translateX);
                    // 触发自定义的事件
                    m(this).emit("move.m.touch.nav", [this, translateX, obj]);
                }

            },
            function (event, obj) {

                if (obj.isX) {

                    var moveElmentWidth = obj.$moveElment.outerWidth();
                    var wraperWidth = $m_touch_lr.outerWidth();
                    var moveYSpace = wraperWidth - moveElmentWidth;
                    var target = obj.$moveElment.translateX();
                   
                    // 计算移动速度
                 //   if (self.options.speed) {
                        self.speedSetIntervalFisrt = true;
                        clearInterval(self.speedSetIntervalId);

                        // 计算移动速度
                        //if (self.speedScroll > 200) {
                        //    self.speedScroll = 200;
                        //} else if (self.speedScroll < -200) {
                        //    self.speedScroll = -200;
                        //}

                    target = target + self.speedScroll * 10; //修改速度值 

                  //  }

                    // 滑动过度效果
                    var gudingVal = 400;
                    var translateX = $moveElement.translateX();
                    var moveVal = 0;

                    if (target > 0) {
                        target = 0;
                        moveVal = (-moveYSpace) - translateX;

                    } else {

                        target = target > (-moveYSpace) ? (-moveYSpace) : target;
                        moveVal = target - translateX;

                    }


                  //  target = Math.abs(target) > wraperWidth ? wraperWidth : target;
                    


                    console.log("translateX", translateX);
                    console.log("self.speedScroll", self.speedScroll);

                    console.log("moveYSpace", moveYSpace);
                    console.log("$moveElement.translateX()", $moveElement.translateX());

                  
                    console.log(target);


                    var beishu = Math.abs( moveVal) / gudingVal;
                    var ansTime = 600 * beishu;
                    if (moveVal < gudingVal) { ansTime = 600; }
                    ansTime = ansTime > 2000 ? 2000 : ansTime;

                    if (moveElmentWidth < wraperWidth) {
                        target = 0;
                        ansTime = 600;
                    }

                    console.log("moveVal", moveVal);
                    console.log("ansTime", ansTime);

                    if (self.options.touchTap) {
                        var translateIndex = Math.round(target / wraperWidth);                
                        $moveElement.translateX(wraperWidth * translateIndex);
                       
                       

                    } else {


                        $moveElement.translateX(target);
                        $moveElement.transition("transform " + ansTime + "ms cubic-bezier(.13,.77,.53,.93)");
                    }

                    // 触发自定义的事件
                    m(this).emit("end.m.touch.nav", [this, target, obj]);


                }


            }

        );


    };

    // position left
    MTouchNavLr.prototype.left = function (item,bl) {
        var $ul = m(this.el).find(".m-touch-nav-cnt");
        var $li = m(item);
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
        if (!bl) { $li.emit("tap.m.touch.nav", [item, moveX]); }
       
    };

    // position center
    MTouchNavLr.prototype.center = function (item,bl) {

        var $ul = m(this.el).find(".m-touch-nav-cnt");
        var $li = m(item);
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
        if (!bl) { $li.emit("tap.m.touch.nav", [item, moveX]); }

    };

    MTouchNavLr.prototype.set = function (el,bl) {
        var self = this;
        // 选中的样式移动
        //if (self.options.left) {

        //    self.left.call(self, el,bl); // 移动到left
        //}
        //else {

        //    self.center.call(self, el,bl);   // 移动到center
        //}

        self.center.call(self, el, bl);   // 移动到center
    };

    function Plugin(option,el,bl) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-nav');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.limitLeft = $this.hasAttr("data-limit-left");
                o.limitRight = $this.hasAttr("data-limit-right");
              //  o.left = $this.hasAttr("data-left");
              //  o.center = $this.hasAttr("data-center");
                var p = $.extend({}, o, options);
                $this.data('m-touch-nav', data = new MTouchNavLr(this, p));
            }

            if (typeof option === 'string') {
                data[option](el,bl);
            }

        });

    }

    var _mTouchNavLr = $.fn.mTouchNavLr;
    m.fn.mTouchNavLr = Plugin;

    m("[data-toggle=m-touch-nav]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();