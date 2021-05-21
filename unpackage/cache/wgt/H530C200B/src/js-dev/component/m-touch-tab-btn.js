// m-touch-tab-btn

+function () {

    'use strict';

    // define class
    var MTouchTabBtn = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MTouchTabBtn.prototype.run = function () {
        var self = this;
        var $m_touch_tab_btn = m(this.el);

        if (self.options.line) {
           
            var line = document.createElement("div");
            line.classList.add("m-touch-tab-btn-line");
            $m_touch_tab_btn.append(line);
            var item_w = $m_touch_tab_btn.find(".m-touch-tab-btn-item").outerWidth();
            
            m(line).width(item_w * .4).css("left", item_w * .6/2);

            m(window).resize(function () {
                var resize_item_w = $m_touch_tab_btn.find(".m-touch-tab-btn-item").outerWidth();
                m(line).width(resize_item_w * .4).css("left", resize_item_w * .6 / 2);
            });

        }

        $m_touch_tab_btn.on("tap", ".m-touch-tab-btn-item", function (event) {
            event.preventDefault();
            self.active(m(this).index());

        });

    };

    MTouchTabBtn.prototype.set = function (index) {

        this.active(index);

    };

    MTouchTabBtn.prototype.active = function (index) {

        var self = this;
        var $el = m(self.el).find(".m-touch-tab-btn-item").eq(index);
        $el.addClass("active").siblings().removeClass("active");
      
        if (self.options.line) {
            var w = m(self.el).find(".m-touch-tab-btn-item").outerWidth();
            m(self.el).find(".m-touch-tab-btn-line").translateX(w * index);
            m(self.el).find(".m-touch-tab-btn-line").transition("transform .8s ease");
        }

        // 触发自定义的事件
        m(this.el).emit("tap.m.touch.tab.btn", [$el, index]);

    };

    MTouchTabBtn.prototype.move = function (ratio,index) {
      
        var self = this;
        var w = m(self.el).outerWidth();
        m(self.el).find(".m-touch-tab-btn-line").translateX(-w * ratio);
        m(self.el).find(".m-touch-tab-btn-line").transition("none");
        if (index) {
            var _index = Math.round(Math.abs(index));
            m(this.el).find(".m-touch-tab-btn-item").eq(_index).addClass("active").siblings().removeClass("active");
        }
      

    };


    function Plugin(option,value,index) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-tab-btn');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.line = $this.hasAttr("data-line");
                var p = $.extend({}, o, options);
                $this.data('m-touch-tab-btn', data = new MTouchTabBtn(this, p));
            }

            if (typeof option === 'string') {
                data[option](value,index);
            }

        });

    }

    var _mTouchTabBtn = $.fn.mTouchTabBtn;
    m.fn.mTouchTabBtn = Plugin;

    m("[data-toggle=m-touch-tab-btn]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();