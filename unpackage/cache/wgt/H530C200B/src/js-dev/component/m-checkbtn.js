/*
  m-checkbtn
 */

(function () {

    // define class
    var MCheckbtn = function (el, options) {
        this.el = el;
        this.options = options;
    };

    MCheckbtn.prototype.set = function (val) {

        if (val) {
            m(this.el).find(".m-checkbtn-item").addClass("active");
            m(this.el).trigger("check.m.checkbtn", [m(this.el).find(".m-checkbtn-item")[0], true]);
        }
        else {
            m(this.el).find(".m-checkbtn-item").removeClass("active");
            m(this.el).trigger("check.m.checkbtn", [m(this.el).find(".m-checkbtn-item")[0], false]);
        }
    }

    MCheckbtn.prototype.get = function () {    
        return m(this.el).find(".m-checkbtn-item").hasClass("active");
    }

    function Plugin(option, val) {
        var  result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-checkbtn');
            var options = typeof option === 'object' && option;
            if (!data) {
                var o = {}; 
                var p = $.extend({}, o, options);
                $this.data('m-checkbtn', data = new MCheckbtn(this, p));
            }

            if (typeof option === 'string') {
                result= data[option](val);   
            }

        });

        return result;

    }

    var _mCheckbtn = $.fn.mCheckbtn;
    m.fn.mCheckbtn = Plugin;

    // 单选
    $(document).on("tap", ".m-checkbtn-item", function (e) {
        e.preventDefault();
        $(this).toggleClass("active");
        var bl = $(this).hasClass("active");

        // 触发自定义的事件
        $(this).emit("check.m.checkbtn", [this, bl]);
    });


})();

