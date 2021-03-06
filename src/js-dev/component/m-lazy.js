
/**
 * hqs  lazy.js

**/

+function () {

    var MLazy = function (el, options) {

        this.el = el;
        this.oldsrc = "";
        this.options = options;
        this.running();
      

    };

    MLazy.DEFAULTS = {
        timing: 400
    };

    MLazy.prototype.running = function () {


        if (this.el === window || this.el === document) {

            $(window).on("scroll", $.proxy(this._scrollImg, this));

        }
        else if (this.el.nodeType === 1) {
            $(this.el).css("position", "relative");
            $(this.el).on("scroll", $.proxy(this._scrollImgByElement, this));
        }

    };

    MLazy.prototype._scrollImgByElement = function (event) {
       
        var $el = $(this.el);
        var $list = $el.find(".m-lazy-img");
        var el_h = parseFloat( $el.outerHeight());
        var len = $list.length;
        var spaceTop = $el.rect().top;
      
        if (len === 0) { return; }
        $list.each(function () {
            var $this = $(this);
            var elTop = $this.rect().top - spaceTop;
            var img_h_min = -$this.outerHeight()/2;
            var img_h_max = el_h - $this.outerHeight()/10;
           
            if (elTop >=img_h_min && elTop <img_h_max) {
               
                if (!$this.data("bl")) {
                    $this.data("bl", true);
                    var _src = $this.attr("data-lazy") || "";
                    $this.attr("src", _src);
                    $this.removeClass("m-lazy-img");
                    $this.on("load", function () {
                       
                        $this.addClass("m-lazy-animation");
                    });
                }
            }

        });

    };

    MLazy.prototype.init = function () {
      
        this._scrollImgByElement();
    };

    MLazy.prototype.scrollemit = function () {

        if (this.el === window || this.el === document) {

            $(window).on("scroll.m-lazy", $.proxy(this._scrollemit, this));
        }
    };

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-lazy');
            var options = typeof option === 'object' && option;
            if (!data) {

                var p = $.extend({}, MLazy.DEFAULTS, options);
                $this.data('m-lazy', data = new MLazy(this, p));
            }
            if (typeof option === 'string') {
           
               data[option]();
 
            }

        });
    }

    var _mLazy = $.fn.mLazy;
    $.fn.mLazy = Plugin;

    $(window).on("load.m-lazy", function () {
        $("[data-toggle=m-lazy]").each(function () {
            var $this = $(this);
            var src = $this.attr("data-lazy") || "";
            if (src) { Plugin.call($this, "show"); }

        });
    });

}();
