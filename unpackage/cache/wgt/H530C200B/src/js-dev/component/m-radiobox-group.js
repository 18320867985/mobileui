/*
  m-radiobox-group
 */

(function () {

    // define class
    var MRadiokboxGroup = function (el, options) {
        this.el = el;
        this.options = options;
    };

    MRadiokboxGroup.prototype.set = function (args) {

        var $items = $(this.el).find(".m-radiobox-item");
        if (typeof args === "string") {
            $items.removeClass("active");
            var v = "";
            $items.each(function () {
                var v2 = $(this).attr("data-val") || "";
                if ($.trim(v2) === args) {
                    $(this).addClass("active");
                    v = v2;
                    return false;
                }
            });

            // 触发自定义的事件
            m(this).trigger("check.m.radiobox.group", [$(this.el).find(".m-radiobox-item.active").get(0), v]);

        }

        else if (typeof args === "number") {

            $items.removeClass("active");
            if (args > 0) {
                args = args >= 1 ? args - 1 : 0;
                $items.eq(args).addClass("active");
            }

            return;
        }

        else if (typeof args === "function") {

            $items.removeClass("active");
            for (var i = 0; i < $items.length; i++) {
                var item = $items[i];
                var val = $(item).attr("data-val") || "";
                var bl = args(val);
                if (bl) {
                    $(item).addClass("active");
                    break;
                } else {
                    $(item).removeClass("active");
                }
            }

            return;
        }
        
    }

    MRadiokboxGroup.prototype.get = function () {    
        return  m(this.el).find(".m-radiobox-item.active").attr("data-val") || "";
    }

    function Plugin(option, val) {
        var  result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-radiobox-group');
            var options = typeof option === 'object' && option;
            if (!data) {
                var o = {}; 
                var p = $.extend({}, o, options);
                $this.data('m-radiobox-group', data = new MRadiokboxGroup(this, p));
            }

            if (typeof option === 'string') {
                result= data[option](val);   
            }

        });

        return result;
    }

    var _mRadioboxGroup= $.fn.mRadioboxGroup;
    m.fn.mRadioboxGroup = Plugin;


    // 单选 m-radiobox-group
    m(document).on("tap", ".m-radiobox-item", function (e) {
        e.preventDefault();
        var p = $(this).parents(".m-radiobox-group");
        $(".m-radiobox-item", p).removeClass("active");
        $(this).addClass("active");
        var v = $(this).attr("data-val") || "";

        // 触发自定义的事件
        $(this).trigger("check.m.radiobox.group", [this, v]);
    });



})();

