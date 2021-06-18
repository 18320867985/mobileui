/*
  m-checkbtn-group
 */

(function () {

    // define class
    var MCheckbtnGroup = function (el, options) {
        this.el = el;
        this.options = options;
    };

    MCheckbtnGroup.prototype.set = function (args) {
        var $this = m(this.el);
        var items = $this.find(".m-checkbtn-group-item");
        if (typeof args === "function") {

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var val = $(item).attr("data-val") || "";
                var bl = args(val);
                if (bl) {
                    $(item).addClass("active");
                } else {
                    $(item).removeClass("active");
                }
            }
            // 触发自定义的事件
            var list = [];
            $(".m-checkbtn-group-item", $this).each(function () {
                if ($this.hasClass("active")) {
                    var v = $(this).attr("data-val") || "";
                    if ($.trim(v) !== "") {
                        list.push(v);
                    }
                }
            });

            $(this).trigger("check.m.checkbtn.group", [list]);

            return;
        }

        else if (args instanceof Array) {
            var list2 = [];

            for (var i2 = 0; i2 < items.length; i2++) {
                var item2 = items[i2];
                var v = $(item2).attr("data-val") || "";
                for (var y = 0; y < args.length; y++) {
                    if (v === args[y]) {
                        $(item2).addClass("active");

                        break;
                    } else {
                        $(item2).removeClass("active");
                    }
                }

                // 触发自定义的事件
                list2 = [];
                $(".m-checkbtn-group-item", $this).each(function () {
                    if ($(this).hasClass("active")) {
                        var v = $(this).attr("data-val") || "";
                        if ($.trim(v) !== "") {
                            list2.push(v);
                        }
                    }

                });

            }

            $this.trigger("check.m.checkbtn.group", [list2]);

        }
    }

    MCheckbtnGroup.prototype.all = function (args) {

         // 全选 与 反选
         if (typeof args === "boolean") {
             var $this = $(this.el);
             var objs = $this.find(".m-checkbtn-group-item");
            var objs_list = [];
            objs.each(function () {
                if (args) {
                    var v = $(this).attr("data-val") || "";
                    $(this).addClass("active");
                    objs_list.push(v);
                } else {

                    $(this).removeClass("active");

                }

                $(this).trigger("check.m.checkbtn.group", [objs_list]);


            });

        }
        
    }

    MCheckbtnGroup.prototype.get = function () {    
      
        var arrs = [];
        $(".m-checkbtn-group-item", this.el).each(function () {
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
            var data = $this.data('m-checkbtn-group');
            var options = typeof option === 'object' && option;
            if (!data) {
                var o = {}; 
                var p = $.extend({}, o, options);
                $this.data('m-checkbtn-group', data = new MCheckbtnGroup(this, p));
            }

            if (typeof option === 'string') {
                result= data[option](val);   
            }

        });

        return result;

    }

    var _mCheckbtnGroup = $.fn.mCheckbtnGroup;
    m.fn.mCheckbtnGroup = Plugin;

    m(document).on("tap", ".m-checkbtn-group-item", function (e) {

        e.preventDefault();
        $(this).toggleClass("active");
        var arrs = [];
        var p = $(this).parents(".m-checkbtn-group");
        $(".m-checkbtn-group-item", p).each(function () {

            if ($(this).hasClass("active")) {
                var v = $(this).attr("data-val") || "";
                if ($.trim(v) !== "") {
                    arrs.push(v);
                }
            }

        });

        // 触发自定义的事件
        m(this).trigger("check.m.checkbtn.group", [arrs]);
    });

})();

