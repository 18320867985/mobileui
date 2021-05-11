// m-overflow-lr 左右原生overflow滑动

+function () {

    'use strict';

    // define class
    var MOverflowLr = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

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

            // 滚动顶 部触发的事件
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

        $el.touch(function (event) { event.stopPropagation(); }, function (event, obj) {
         
            if (obj.isX) {
                event.stopPropagation();
  
            }
           
        }, function (event) { event.stopPropagation(); });

        $el.find("a").on("tap",function (event) {
            event.preventDefault();

            var isHref = m(this).hasAttr("href");
            var hrefValue = m(this).attr("href");
            if (isHref) {
                if (hrefValue.trim() === "" || hrefValue.trim() === "#" || hrefValue.trim() === "javascript:;") {
                    return;
                } else {
                    m.router.link(hrefValue);
                    return;
                }

            }
        });

        // 导航 m-overflow-lr-menu 
        var $el_parent = m(self.el).find(".m-overflow-lr-nav.m-overflow-lr-menu");
        var $el_menu = $el_parent.find(".m-overflow-lr-item");
        $el_menu.on("tap", function (event) {

            m(this).addClass("active").siblings().removeClass("active");
         
            // 定位到左边
           // $el_parent.scrollLeft(m(this).offsetLeft(),200)；

           // 定位到中间
            var $el_parent_w = $el_parent.outerWidth();
            console.log($el_parent_w);

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
                var p = $.extend({}, o, options);
                $this.data('m-overflow-lr', data = new MOverflowLr(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mOverflowLr = $.fn.mOverflowLr;
    $.fn.mOverflowLr = Plugin;

    $("[data-toggle=m-overflow-lr]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();