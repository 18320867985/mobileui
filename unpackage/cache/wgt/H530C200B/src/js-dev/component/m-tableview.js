

+function () {

    'use strict';

    // define class
    var MTableView = function (el, options) {
        this.el = el;
        this.options = options;
        this.running();
    };

    MTableView.prototype.running = function () {
        var self = this;
        m(this.el).find(".m-table-view-ttl").on("tap", function (event) {
            event.stopPropagation();
            var $tableCell = m(this).parents(".m-table-view-cell");
            var isIn = $tableCell.hasClass("in");
            if (isIn) {
                self.hide($tableCell);

            } else {
                self.show($tableCell);
            }

        });

       
        m(this.el).on("tap", "a", function (event) {

            event.preventDefault();

            var isHref = m(this).hasAttr("href");
            var hrefValue = m(this).attr("href");
            if (isHref) {
                if (hrefValue.trim() === "" || hrefValue.trim() === "#" || hrefValue.trim() === "javascript;") {
                    return;
                } else {

                    //if (m(this).hasAttr("data-router")) {
                    m.router.link(hrefValue);
                    return;
                    //  }
                    // window.location.href = hrefValue;
                }

            }
        });
  
    };

    // show
    MTableView.prototype.show = function ($el) {

        $el.addClass("in").siblings().removeClass("in");
        
    };

    MTableView.prototype.hide = function ($el) {
        $el.removeClass("in");
    };

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-tbale-view');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-tbale-view', data = new MTableView(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mTableView = $.fn.mTableView;
    $.fn.mTableView = Plugin;

    $("[data-toggle=m-table-view]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();
