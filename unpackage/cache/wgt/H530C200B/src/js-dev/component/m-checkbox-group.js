/*
  m-checkbox-group
 */

(function () {

    // define class
    var MCheckboxGroup = function (el, options) {
        this.el = el;
        this.options = options;
    };

    MCheckboxGroup.prototype.set = function (args) {

        var $this = m(this.el);
        var $items = $this.find(".m-checkbox-group-item");

        if (typeof args === "function") {
            var list = [];
            for (var i = 0; i < $items.length; i++) {
                var item = $items[i];
                $(item).removeClass("active");
                var val = $(item).attr("data-val") || "";
                var bl = args(val);
                if (bl) {
                    $(item).addClass("active");
                    list.push(val);
                }
            }
            // 触发自定义的事件
            $this.trigger("check.m.checkbox.group", [$this.get(0), list]);

            return;
        }

        else if (args instanceof Array) {
            var list2 = [];
            for (var i2 = 0; i2 < $items.length; i2++) {
                var item2 = $items[i2];
                $(item2).removeClass("active");
                for (var y = 0; y < args.length; y++) {
                    var v = $(item2).attr("data-val") || "";
                    if (v === args[y]) {
                        $(item2).addClass("active");
                        list2.push(v);
                        break;

                    }
                }
            }
            // 触发自定义的事件
            $this.trigger("check.m.checkbox.group", [$this.get(0), list2]);
        } 
    }

    MCheckboxGroup.prototype.all = function (args) {
        var $this = m(this.el);
        var items = $this.find(".m-checkbox-group-item");
         if (typeof args === "boolean") {

            var list1 = [];
            items.each(function () {
                if (args) {
                    $(this).addClass("active");
                    list1.push($(this).attr("data-val") || "");
                } else {
                    $(this).removeClass("active");

                }
            });

            // 触发自定义的事件
            $this.trigger("check.m.checkbox.group", [$this.get(0), list1]);
        }
            
    }

    MCheckboxGroup.prototype.get = function () {  
        var $this = m(this.el);
        var items = $this.find(".m-checkbox-group-item");
        var arrs = [];
        items.each(function () {

            if ($(this).hasClass("active")) {
                var v = $(this).attr("data-val") || "";

                if ($.trim(v) !== "") {
                    arrs.push(v);
                }
            }
        });

        return arrs;
       
    }

    function Plugin(option, val) {
        var  result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-checkbox-group');
            var options = typeof option === 'object' && option;
            if (!data) {
                var o = {}; 
                var p = $.extend({}, o, options);
                $this.data('m-checkbox-group', data = new MCheckboxGroup(this, p));
            }

            if (typeof option === 'string') {
                result= data[option](val);   
            }

        });

        return result;

    }

    var _mCheckbtnGroup = $.fn.mCheckboxGroup;
    m.fn.mCheckboxGroup = Plugin;

    // 单选组 m-checkbox-group
    m(document).on("tap", ".m-checkbox-group-item", function (e) {
        e.preventDefault();
        $(this).toggleClass("active");
        var p = $(this).parents(".m-checkbox-group");
        var vals = [];
        $(".m-checkbox-group-item.active", p).each(function () {
            var v = $(this).attr("data-val");
            vals.push(v);

        });

        // 触发自定义的事件
        m(this).trigger("check.m.checkbox.group", [p, vals]);

    });
})();

