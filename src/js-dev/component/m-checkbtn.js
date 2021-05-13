/*
  m-checkbtn
 * */

(function () {

    // 单选
    $(document).on("tap", ".m-checkbtn-item", function (e) {
        e.preventDefault();
        $(this).toggleClass("active");
        var bl = $(this).hasClass("active");

        // 触发自定义的事件
        $(this).emit("check.m.checkbtn", [this,bl]);
    });


    m.fn.extend({

        mCheckbtn: function (v) {
            if (typeof v !== "undefined") {
                v = !!v;

                if (v) {
                    $(this).find(".m-checkbtn-item").addClass("active");
                    $(this).trigger("check.m.checkbtn", [$(this).find(".m-checkbtn-item")[0], true]);
                } else {
                    $(this).find(".m-checkbtn-item").removeClass("active");
                    $(this).trigger("check.m.checkbtn", [$(this).find(".m-checkbtn-item")[0], false]);
                }

            } else {

                return $(this).find(".m-checkbtn-item").hasClass("active");
            }
        }
    });

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


    m.fn.extend({

        mCheckbtnGroup: function (args) {
            var items = $(this).find(".m-checkbtn-group-item");
            var arrs = [];
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
                $(".m-checkbtn-group-item", this).each(function () {
                    if ($(this).hasClass("active")) {
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
                    $(".m-checkbtn-group-item", this).each(function () {
                        if ($(this).hasClass("active")) {
                            var v = $(this).attr("data-val") || "";
                            if ($.trim(v) !== "") {
                                list2.push(v);
                            }
                        }

                    });

                }

                $(this).trigger("check.m.checkbtn.group", [list2]);

            }
            // 全选 与 反选
            else if (typeof args === "boolean") {

                var objs = $(this).find(".m-checkbtn-group-item");
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
            else {

                $(".m-checkbtn-group-item", this).each(function () {
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


    m(document).on("tap", ".m-radiobtn-item", function (e) {
        e.preventDefault();
        var p = $(this).parents(".m-radiobtn-group");
        p.find(".m-radiobtn-item").removeClass("active");
        m(this).addClass("active");

        // 触发自定义的事件
        m(this).trigger("check.m.radiobtn.group", [this, $(this).attr("data-val")]);
    });

    m.fn.extend({

        mRadiobtnGroup: function (index) {

            if (arguments.length >= 1) {
                if (!isNaN(index)) {
                    index = Number(index);
                    m(this).find(".m-radiobtn-item").removeClass("active");
                    m(this).find(".m-radiobtn-item").eq(index).addClass("active");

                    // 触发自定义的事件
                    var $active = $(this).find(".m-radiobtn-item.active");
                   
                    m(this).trigger("check.m.radiobtn.group", [$active.get(0) ,$active.attr("data-val")]);
                }
                else if (typeof index === "string") {
                    var $list = m(this).find(".m-radiobtn-item");
                    $list.removeClass("active");
                    $list.each(function () {

                        var v = $.trim($(this).attr("data-val") || "");
                        if (index === v) {
                            m(this).addClass("active");
                        }

                    });

                    // 触发自定义的事件
                    var $active2 = $(this).find(".m-radiobtn-item.active");
                    m(this).trigger("check.m.radiobtn.group", [$active2.get(0), $active2.attr("data-val")]);
                }
            } else {
              
                return $(this).find(".m-radiobtn-item.active").attr("data-val");
            }
        }
    });

})();

