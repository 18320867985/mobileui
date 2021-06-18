/*
  m-radiobtn-group
 */

(function () {

    // define class
    var MRadiobtnGroup = function (el, options) {
        this.el = el;
        this.options = options;
    };

    MRadiobtnGroup.prototype.set = function (index) {

        var $this = m(this.el);
        if (arguments.length >= 1) {
            if (!isNaN(index)) {
                index = Number(index);
                $this.find(".m-radiobtn-item").removeClass("active");
                $this.find(".m-radiobtn-item").eq(index).addClass("active");

                // 触发自定义的事件
                var $active = $this.find(".m-radiobtn-item.active");

                $this.trigger("check.m.radiobtn.group", [$active.get(0), $active.attr("data-val")]);
            }
            else if (typeof index === "string") {
                var $list = $this.find(".m-radiobtn-item");
                $list.removeClass("active");
                $list.each(function () {

                    var v = $.trim($(this).attr("data-val") || "");
                    if (index === v) {
                        m(this).addClass("active");
                    }

                });

                // 触发自定义的事件
                var $active2 = $this.find(".m-radiobtn-item.active");
                $this.trigger("check.m.radiobtn.group", [$active2.get(0), $active2.attr("data-val")]);
            }
        } 
    }

    MRadiobtnGroup.prototype.get = function () {    
        return $(this.el).find(".m-radiobtn-item.active").attr("data-val");
    }

    function Plugin(option, val) {
        var  result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-radiobtn-group');
            var options = typeof option === 'object' && option;
            if (!data) {
                var o = {}; 
                var p = $.extend({}, o, options);
                $this.data('m-radiobtn-group', data = new MRadiobtnGroup(this, p));
            }

            if (typeof option === 'string') {
                result= data[option](val);   
            }

        });

        return result;

    }

    var _mRadiobtnGroup= $.fn.mRadiobtnGroup;
    m.fn.mRadiobtnGroup = Plugin;


    m(document).on("tap", ".m-radiobtn-item", function (e) {
        e.preventDefault();
        var p = $(this).parents(".m-radiobtn-group");
        p.find(".m-radiobtn-item").removeClass("active");
        m(this).addClass("active");

        // 触发自定义的事件
        m(this).trigger("check.m.radiobtn.group", [this, $(this).attr("data-val")]);
    });


})();

