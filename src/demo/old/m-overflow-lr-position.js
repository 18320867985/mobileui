// tap 点击移动定位

+function () {

    'use strict';

    // define class
    var MOverflowLeftRightPosition = function (el, options) {
        this.el = el;
        this.options = options;
        this.running();
    };

    MOverflowLeftRightPosition.prototype.running = function () {

        var $self =this;
        var $parent = m(this.el).parent();
    
        m(this.el).find(".m-overflow-position-item").on("tap", function (event) {
            m(this).addClass("active").siblings().removeClass("active");
            var elOffsetLeft=m(this).offsetLeft();

            // 向左
            if ($self.options.positionLeft) {
                $parent.scrollLeft(elOffsetLeft);
            }

            // 居中
           else{
                var parentWidth = $parent.width()/2;
                var elWidth = m(this).width() / 2;
                var offsetLeft = elOffsetLeft - parentWidth + elWidth;
                $parent.scrollLeft(offsetLeft);
            }
                
        });

    };

    // position left
    MOverflowLeftRightPosition.prototype.positionLeft = function (item) {
        var $ul = m(this.el);
        var $li = m(item);
       
        // 触发自定义的事件
        $li.emit("m-overflow-lr-position", [item, moveX]);

    };

    // position center
    MOverflowLeftRightPosition.prototype.positionCenter = function (item) {
               
        var $ul = m(this.el);
        var $li = m(item);
        var window_w = $ul.parent().outerWidth();
    
        // 触发自定义的事件
        $li.emit("m-overflow-lr-position", [item, moveX]);

    };


    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-overflow-lr-position');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};

                o.positionLeft = $this.hasAttr("data-position-left");
                o.positionCenter = $this.hasAttr("data-position-center");
                var p = $.extend({}, o, options);
                $this.data('m-overflow-lr-position', data = new MOverflowLeftRightPosition(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mOverflowLeftRightPosition = $.fn.mOverflowLeftRightPosition;
    $.fn.mOverflowLeftRightPosition = Plugin;

    $("[data-toggle=m-overflow-lr-position]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();