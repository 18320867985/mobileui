// m-overflow-lr 左右原生overflow滑动

+function () {

    'use strict';

    // define class
    var MOverflowLr = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MOverflowLr.DEFAULT = {
        tapTime: 250,
        center:true
        
    }

    MOverflowLr.prototype.run = function () {
        var self = this;
        var $el = m(self.el).find(".m-overflow-lr-nav");
        $el.css("overflow-x", "scroll");
        var winW = $el.outerWidth();

        // 设置滑动条
        if (self.options.bar) {
            self.setBar(); 
        }

        // document
        $el.scroll(function (e) {
        
            var _el = e.target;
            var elW = _el.clientWidth;
            var srlW = _el.scrollWidth;
            var srlLeft = self.scrollLef= _el.scrollLeft; // _el.scrollLeft; 
           

            // 移动滑动条
            if (self.options.bar) {
               
                var moveElementW = $el.find(".m-overflow-lr-cnt").outerWidth();
                var ratio = winW / moveElementW;
                ratio = ratio > 1 ? 1 : ratio;
                $el.find(".m-overflow-lr-bar-item").width($el.find(".m-overflow-lr-bar").width() * ratio);

                self.moveBar(srlLeft);
               
            }

            // 滚动顶部触发的事件
            if (srlLeft <= 0) {
              //  e.stopPropagation();
                $el.emit("reachleft.m.overflow.lr", [this, { elementWidth: elW, scrollWidth: srlW, scrollLeft: srlLeft }]);
 
            }
          
            // 滚动时触发的事件
            $el.emit("scroll.m.overflow.lr", [this, { elementWidth: elW, scrollWidth: srlW, scrollLeft: srlLeft}]);

            // 滚动的高度小于元素大框高度
            if (srlW < elW) {
                return;
            }

            // 滚动的真实高度
            var _left = srlW - elW;
            if (srlLeft >= _left) {
     
                // 滚动到底部 触发的事件
                $el.emit("reachright.m.overflow.lr", [this, { elementWidth: elW, scrollWidth: srlW, scrollLeft: srlLeft }]);

               
            }
        });

        // 移动阻止冒泡行为
        $el.touch(function (event) { event.stopPropagation(); }, function (event, obj) {
         
            if (obj.isX) {
                event.stopPropagation();
            }
            if (obj.isY) {
                event.stopPropagation();
            }
           
        }, function (event) { event.stopPropagation(); });

         // 点击router 跳转
        $el.find("a[data-link]").on("tap",function (event) {
            event.preventDefault();
            m.router.alink.call(this);
        });

        // 导航 m-overflow-lr-menu 
        var $el_parent = m(self.el).find(".m-overflow-lr-nav.m-overflow-lr-menu");
        var $el_menu = $el_parent.find(".m-overflow-lr-item");
        var $el_menu_w2 = $el_menu.outerWidth() / 2;

        $el_menu.on("tap", function (event) {

            m(this).addClass("active").siblings().removeClass("active");
         
            // 定位到左边

            //  $el_parent.scrollLeft(m(this).offsetLeft(), MOverflowLr.DEFAULT.tapTime);

           // 定位到中间
            var $el_parent_w = $el_parent.outerWidth()/2;
            $el_parent.scrollLeft(m(this).offsetLeft() - ($el_parent_w - $el_menu_w2), MOverflowLr.DEFAULT.tapTime);

            // tap选中触发的事件
            m(this).emit("tap.m.overflow.lr", [this]);

        });


    };

    MOverflowLr.prototype.setBar = function (x) {
        var $m_touch_lr = m(this.el);
        var pwr = document.createElement("div");
        pwr.classList.add("m-overflow-lr-bar-nav");
        var bar = document.createElement("div");
        bar.classList.add("m-overflow-lr-bar");
        var item = document.createElement("div");
        item.classList.add("m-overflow-lr-bar-item");
        bar.appendChild(item);

        pwr.appendChild(bar);
        $m_touch_lr.append(pwr);
        var winW = $m_touch_lr.outerWidth();
        var moveElementW = $m_touch_lr.find(".m-overflow-lr-cnt").outerWidth();
        var ratio = winW / moveElementW;
        ratio = ratio > 1 ? 1 : ratio;

        $m_touch_lr.find(".m-overflow-lr-bar-item").width($m_touch_lr.find(".m-overflow-lr-bar").width() * ratio);
    };


    MOverflowLr.prototype.moveBar = function (x) {
 
        x = parseFloat(x) || 0;

        var $m_touch_lr = m(this.el);

        var winW = $m_touch_lr.outerWidth();
        var moveElementW = $m_touch_lr.find(".m-overflow-lr-cnt").outerWidth();
        if (moveElementW < winW) { return; }
        var moveLeft = moveElementW - winW;
        var ratio = x / moveLeft;
        //ratio = ratio > 1 ? 1 : ratio;
        var barW = $m_touch_lr.find(".m-overflow-lr-bar").width();
        var itemW = $m_touch_lr.find(".m-overflow-lr-bar-item").width();
      
        return $m_touch_lr.find(".m-overflow-lr-bar-item").translateX(ratio * (barW - itemW));
    };

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-overflow-lr');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.bar = $this.hasAttr("data-bar");
                //o.center = MOverflowLr.DEFAULT.center;
                //o.center = $this.hasAttr("data-center");
                var p = $.extend({}, o, options);
                $this.data('m-overflow-lr', data = new MOverflowLr(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mOverflowLr = $.fn.mOverflowLr;
    m.fn.mOverflowLr = Plugin;

    m("[data-toggle=m-overflow-lr]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();