
// m-overflow-tb 上下原生overflow滑动

+function () {

    'use strict';

    // define class
    var MOverflowTb = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MOverflowTb.prototype.run = function () {
        var $el =m( this.el);
        $el.css("overflow-y", "scroll");
 
        // document
        $el.scroll(function (e) {
      
            var _el = e.target;
            var elH = _el.clientHeight;
            var srlH = _el.scrollHeight;
            var srlTop = _el.scrollTop; // _el.scrollTop; 
           
            // 滚动顶部触发的事件
            if (srlTop <= 0) {
                $el.emit("reachtop.m.overflow.tb", [this, { elementHeight: elH, scrollHeight: srlH, scrollTop: srlTop }]);}
          
            // 滚动时触发的事件
            $el.emit("scroll.m.overflow.tb", [this, { elementHeight: elH, scrollHeight: srlH, scrollTop: srlTop}]);

            // 滚动的高度小于元素大框高度
            if (srlH < elH) {
                return;
            }

            // 滚动的真实高度
            var _top = srlH - elH;
           
            if (srlTop >= (_top-1)) {
     
                // 滚动到底部 触发的事件
                $el.emit("reachbottom.m.overflow.tb", [this, { elementHeight: elH, scrollHeight: srlH, scrollTop: srlTop }]);  
            }
        });

    };

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-overflow-tb');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-overflow-tb', data = new MOverflowTb(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mOverflowTb = $.fn.mOverflowTb;
    m.fn.mOverflowTb = Plugin;

    m("[data-toggle=m-overflow-tb]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();