// tap 点击移动定位

+function () {

    'use strict';

    // define class
    var MOverflowTopBottomPosition = function (el, options) {
        this.el = el;
        this.options = options;
        this.running();
    };

    MOverflowTopBottomPosition.prototype.running = function () {

        var $self =this;
        var $parent = m(this.el).parent();
    
        m(this.el).find(".m-overflow-position-item").on("tap", function (event) {
            m(this).addClass("active").siblings().removeClass("active");
            var elOffsetTop = m(this).offsetTop();
           
            // 向左
            if ($self.options.positionTop) {
                $parent.scrollTop(elOffsetTop);
            }

           // 居中
            else {
                var parentHeight= $parent.height()/2;
                var elHeight= m(this).height() / 2;
                var offsetTop = elOffsetTop - parentHeight + elHeight;
                $parent.scrollTop(offsetTop);
            }
                
        });

    };

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-overflow-lr-position');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};

                o.positionLeft = $this.hasAttr("data-position-top");
                o.positionCenter = $this.hasAttr("data-position-center");
                var p = $.extend({}, o, options);
                $this.data('m-overflow-lr-position', data = new MOverflowTopBottomPosition(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mOverflowTopBottomPosition = $.fn.mOverflowTopBottomPosition;
    $.fn.mOverflowTopBottomPosition = Plugin;

    $("[data-toggle=m-overflow-tb-position]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();