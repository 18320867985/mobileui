// m-slide 

+function () {

    'use strict';

    // define class
    var MSlide = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MSlide.prototype.run = function () {

        var self = this;
        var $m_touch_slide = m(this.el);
        var $moveElement = $m_touch_slide.find(".m-slide-cnt");
        self.raduisLength = $moveElement.find(".m-slide-item").length;

        // 一张轮播
        if (self.raduisLength <= 1) {
            $moveElement[0].innerHTML += $moveElement[0].innerHTML;
            $moveElement[0].innerHTML += $moveElement[0].innerHTML;
        } else {
            $moveElement[0].innerHTML += $moveElement[0].innerHTML;
        }

        this.liNodes = $m_touch_slide.find(".m-slide-item");
        this.index = this.liNodes.length / 2;
        $moveElement.translateX(-this.index * $m_touch_slide.outerWidth());

        // 添加小圆点
        var rd = document.createElement("div");
        rd.classList.add("m-slide-radius");
        for (var i = 0; i < self.raduisLength; i++) {
            var span = document.createElement("span");
            if (i === 0) {
                span.classList.add("active");
            }
            rd.appendChild(span);
        }
        $m_touch_slide.append(rd);

        // 重设窗口大小
        this.resize();
        m(window).resize(m.proxy(function() {
            this.resize();
        }, this));

        // 自动轮播
        if (self.options.auto) {
            this.autoSlide();  // m.router.addInterval($m_touch_slide,setIntervalId); // 记录定时器
        }
     
        $m_touch_slide.touch(
            function (event, obj) {
                if (self.options.auto) {
                    // 停止轮播
                    clearInterval(self.setIntervalId);
                }

                var window_w = $m_touch_slide.outerWidth();
                if (self.index === 0) {
                    self.index = self.raduisLength;
                    $moveElement.transition("none");
                    $moveElement.translateX(-self.index * window_w);
                }
                else if (self.index >= self.liNodes.length - 1) {

                    self.index = self.raduisLength - 1;
                    $moveElement.transition("none");
                    $moveElement.translateX(-self.index * window_w);
                }

                obj.moveElmentX = $moveElement.translateX();
                obj.$moveElment = $moveElement;
                obj.$moveElment.transition("none");
                self.obj = obj;

                // 触发自定义的事件
                m(this).emit("start.m.touch.slide", [this, obj.moveElmentX, obj]);   
            },
            function (event, obj) {
               
                if (obj.isX) {
                    event.preventDefault();
                    event.stopPropagation();
                    // 停止轮播
                    if (self.options.auto) {
                        clearInterval(self.setIntervalId);
                    }

                    var wraperWidth = $m_touch_slide.outerWidth();
                    var maxLeft = -(self.index - 1) * wraperWidth;
                    var maxRight = -(self.index + 1) * wraperWidth;                    
                    obj.$moveElment.transition("none");
                    var translateX = obj.moveElmentX + obj.x;

                    // 左限住拉动
                    translateX = translateX >=maxLeft ? maxLeft : translateX;
                    
                    // 右限住拉动
                    translateX = translateX <= maxRight ? maxRight : translateX;

                    obj.$moveElment.translateX(translateX);

                    // 触发自定义的事件
                    m(this).emit("move.m.touch.slide", [this, translateX, obj]);
                }

            },
            function (event, obj) {

                if (obj.isX) {
                   
                    var wraperWidth = $m_touch_slide.outerWidth();
                    var target = obj.$moveElment.translateX();
                    var translateIndex = Math.round(target / wraperWidth);    
                    var translateX=wraperWidth * translateIndex;
                    $moveElement.translateX(translateX);
                    $moveElement.transition("transform .4s cubic-bezier(.31,.66,.64,.98)");

                    var _index = Math.abs(translateIndex) % (self.raduisLength);
                    self.setRadius(_index);

                    // 触发自定义的事件
                    m(this).emit("tab.m.touch.slide", [this, _index]);
                
                    self.index = Math.abs(translateIndex);

                    // 触发自定义的事件
                    m(this).emit("end.m.touch.slide", [this, translateX, obj]);
 
                }

                // 开启轮播
                if (self.options.auto) {
                   self.autoSlide();
              
                }
            }
        );
    };

    MSlide.prototype.setRadius = function (index) {

        m(this.el).find(".m-slide-radius span").removeClass("active").eq(index).addClass("active");
    };

    MSlide.prototype.resize = function () {
    
        var $m_touch_slide = m(this.el);
        var $touch_slide_item = $m_touch_slide.find(".m-slide-item");
        $touch_slide_item.width($m_touch_slide.outerWidth());
        $touch_slide_item.height($m_touch_slide.outerHeight());
    };

    MSlide.prototype.autoSlide = function (index) {
        var self = this;
        var $m_touch_slide = m(this.el);
        var $moveElement = $m_touch_slide.find(".m-slide-cnt");
        var window_w = $m_touch_slide.outerWidth();

        return self.setIntervalId =$m_touch_slide.setInterval(function () {

            if (self.index === 0) {
                self.index = self.raduisLength;
                $moveElement.transition("none");
                $moveElement.translateX(-self.index * window_w);
            }

            else if (self.index >= self.liNodes.length - 1) {

                self.index = self.raduisLength - 1;
                $moveElement.transition("none");
                $moveElement.translateX(-self.index * window_w);
            } 

                self.index++;
                $m_touch_slide.setTimeout(function () { 
                    $moveElement.transition("transform .8s cubic-bezier(.31,.66,.64,.98)");
                    $moveElement.translateX(-self.index * window_w);

                    // 触发自定义的事件
                    var _index = self.index % (self.raduisLength);
                    $moveElement.emit("tab.m.slide", [$moveElement.get(0), _index]);
                    self.setRadius(_index);
                }, 20);

        }, self.options.time);

    };
       
    MSlide.DEFAULTS = {
        time: 3000
};

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-slide');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.time = parseFloat($this.hasAttr("data-time") || 0) || MSlide.DEFAULTS.time;
                o.auto = $this.hasAttr("data-auto");
                var p = $.extend({}, o, options);
                $this.data('m-slide', data = new MSlide(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });
    }

    var _mSlide = $.fn.mSlide;
    m.fn.mSlide = Plugin;

    m("[data-toggle=m-slide]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();