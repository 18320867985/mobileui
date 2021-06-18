/*
 hqs  m-checkbox
 * */

(function () {

    // define class
    var MCheckbox = function (el, options) {
        this.el = el;
        this.options = options;
    };

    MCheckbox.prototype.set = function (v) {

            var $this = $(this.el);
            v = !!v;
            if (v) {
                $this.find(".m-checkbox-item").addClass("active");
                // 触发自定义的事件
                $this.trigger("check.m.checkbox", [$this.get(0), true]);
            } else {
                $this.find(".m-checkbox-item").removeClass("active");
                // 触发自定义的事件
                $this.trigger("check.m.checkbox", [$this.get(0), false]);
            }

        
    }

    MCheckbox.prototype.get = function () {
         return $(this.el).find(".m-checkbox-item").hasClass("active");
    }

    function Plugin(option, val) {
        var result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-checkbox');
            var options = typeof option === 'object' && option;
            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-checkbox', data = new MCheckbox(this, p));
            }

            if (typeof option === 'string') {
                result = data[option](val);
            }

        });

        return result;

    }

    var _mCheckbox = $.fn.mCheckbox;
    m.fn.mCheckbox = Plugin;

    // 单选 m-checkbox
    $(document).on("tap", ".m-checkbox", function (e) {
        e.preventDefault();
        var $p = $(this).find(".m-checkbox-item");
        $p.toggleClass("active");
        var bl = $p.hasClass("active");
        // 触发自定义的事件
        $(this).trigger("check.m.checkbox", [$p, bl]);
    });


})();
