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
        m(window).resize(function () {
        $m_touch_lr.find(".m-touch-tab-item").width($m_touch_lr.outerWidth());
 
        });

        $m_touch_lr.touch(

            function (event, obj) {
             
                obj.moveElmentX = $moveElement.translateX();
                obj.$moveElment = $moveElement;
               // obj.$moveElment.transition("none");
                self.obj = obj;
              
                // 触发自定义的事件
                m(this).emit("start.m.touch.tab", [this, obj.moveElmentX, obj]);
             
            },
            function (event, obj) {

                if (obj.isX) {
                    event.preventDefault();

                    // 阻外层冒泡
                    if (obj.oneTouch === 1) { return; }
                    if (($moveElement.translateX() === 0) && (obj.x>0) && (obj.oneTouch === undefined)) {  obj.oneTouch = 1; } else { obj.oneTouch = 2; }

                    if (obj.oneTouch === 1) {
                       
                        return; 
                    }
                    if (obj.oneTouch === 2) {
                        event.stopPropagation();
                      
                    }
                    
                    obj.$moveElment.transition("none");
                    var translateX = obj.moveElmentX + obj.x;

                    // 左限住拉动
                    //if (self.options.limitLeft) {
                        translateX = translateX > 0 ? 0: translateX;
                   // }

                    // 右限住拉动
                    var moveElmentWidth = obj.$moveElment.outerWidth();
                    var wraperWidth = $m_touch_lr.outerWidth();
                    var moveYSpace = wraperWidth - moveElmentWidth;
                  //  if (self.options.limitRight) {
                      
                        if (moveElmentWidth > wraperWidth && translateX < moveYSpace) {
                            translateX = moveYSpace;

                        }
                  //  }

      
                    obj.$moveElment.translateX(translateX);
                    // 触发自定义的事件
                    m(this).emit("move.m.touch.tab", [this, translateX, obj]);


                }

            },
            function (event, obj) {

                if (obj.isX) {

                    var moveElmentWidth = obj.$moveElment.outerWidth();
                    var wraperWidth = $m_touch_lr.outerWidth();
                    var moveYSpace = wraperWidth - moveElmentWidth;
                    var target = obj.$moveElment.translateX();
                   
          
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

                    //if (self.options.touchTab) {
                    var translateIndex = Math.round(target / wraperWidth);                
                    $moveElement.translateX(wraperWidth * translateIndex);
                    $moveElement.transition("transform .4s cubic-bezier(.31,.66,.64,.98)");
             
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

    MTouchTab.prototype.set = function (translateIndex) {

        var $m_touch_lr = m(this.el);
        var wraperWidth = m(this.el).outerWidth();
        var $moveElement = $m_touch_lr.find(".m-touch-tab-cnt");
        $moveElement.translateX(-wraperWidth * translateIndex);
        $moveElement.transition("transform .4s cubic-bezier(.31,.66,.64,.98)");

        // 触发自定义的事件
        var $activeEl = $moveElement.find(".m-touch-tab-item").eq(Math.abs(translateIndex));
     
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