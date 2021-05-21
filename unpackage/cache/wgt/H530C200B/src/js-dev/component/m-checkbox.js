/*
 hqs  m-checkbox
 * */

(function () {

    // 单选 m-checkbox
    $(document).on("tap", ".m-checkbox", function (e) {
        e.preventDefault();
        var $p = $(this).find(".m-checkbox-item");
        $p.toggleClass("active");
        var bl = $p.hasClass("active");
        // 触发自定义的事件
        $(this).trigger("check.m.checkbox", [$p, bl]);
    });

    
    $.fn.extend({

        mCheckbox: function (v) {

            if (arguments.length > 0) {
                v = !!v;
                if (v) {
                    $(this).find(".m-checkbox-item").addClass("active");
                    // 触发自定义的事件
                    $(this).trigger("check.m.checkbox", [$(this).get(0), true]);
                } else {
                    $(this).find(".m-checkbox-item").removeClass("active");
                    // 触发自定义的事件
                    $(this).trigger("check.m.checkbox", [$(this).get(0), false]);
                }

            } else {

                return $(this).find(".m-checkbox-item").hasClass("active");
            }
        }
    });


})();


(function () {
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

    

    m.fn.extend({
        mCheckboxGroup: function (args) {
            var items = $(this).find(".m-checkbox-group-item");

            if (typeof args === "function") {
                var list = [];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    $(item).removeClass("active");
                    var val = $(item).attr("data-val") || "";
                    var bl = args(val);
                    if (bl) {
                        $(item).addClass("active");
                        list.push(val);
                    }
                }
                // 触发自定义的事件
                $(this).trigger("check.m.checkbox.group", [this, list]);

                return;
            }

            // 全选 与 反选
            else if (typeof args === "boolean") {

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
                $(this).trigger("check.m.checkbox.group", [this, list1]);



            }

            else if (args instanceof Array) {
                var list2 = [];
                for (var i2 = 0; i2 < items.length; i2++) {
                    var item2 = items[i2];
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
                $(this).trigger("check.m.checkbox.group", [this, list2]);
            } else {
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
        }
    });

})();




(function () {

    // 单选 m-radiobox
    m(document).on("tap", ".m-radiobox-item", function (e) {
        e.preventDefault();
        var p = $(this).parents(".m-radiobox-group");
        $(".m-radiobox-item", p).removeClass("active");
        $(this).addClass("active");
        var v = $(this).attr("data-val") || "";

        // 触发自定义的事件
        $(this).trigger("check.m.radiobox.group", [this, v]);
    });


    m.fn.extend({

        mRadioboxGroup: function (args) {
            var items = $(this).find(".m-radiobox-item");
            if (typeof args === "string") {
                items.removeClass("active");
                var v = "";
                items.each(function () {
                    var v2 = $(this).attr("data-val") || "";
                    if ($.trim(v2) === args) {
                        $(this).addClass("active");
                        v = v2;
                        return false;
                    }
                });

                // 触发自定义的事件
                m(this).trigger("check.m.radiobox.group", [$(this).find(".m-radiobox-item.active").get(0), v]);

            }

            else if (typeof args === "number") {

                items.removeClass("active");
                if (args > 0) {
                    args = args >= 1 ? args - 1 : 0;
                    items.eq(args).addClass("active");
                }

                return;
            }

            else if (typeof args === "function") {

                items.removeClass("active");
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
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
            } else {
                return m(this).find(".m-radiobox-item.active").attr("data-val") || "";
            }


        }
    });


})();