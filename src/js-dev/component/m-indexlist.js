// m-indexlist  索引列表

+function () {

    'use strict';

    // define class
    var MIndexlist= function (el, options) {
        this.el = el;
        this.items = [];
        this.scrollItems = [];
        this.options = options;
        this.run();
    };

    MIndexlist.prototype.run = function () {

        var $indexlist_nav = m(this.el).find(".m-indexlist-gp");
        var $indexlist_a = m(this.el).find(".m-indexlist-gp-ttl");
        var $indexlist_tip = m(this.el).find(".m-indexlist-tip");
        var $indexlist_ul = m(this.el).find(".m-indexlist-cnt");
        var items = this.items;
        var window_h, m_hd_h;
        $indexlist_nav.touchstart(function (event) {
            event.preventDefault();
            items = [];
            $indexlist_a.each(function (i, v) {
                var o = {};
                o.name = m(v).text();
                o.top = m(v).offsetTop();
                items.push(o);
            });
            window_h = m(window).height();
            m_hd_h = m(".m-hd").outerHeight();
            $indexlist_tip.addClass("in");

            var t = event.changedTouches[0];
            setindexlist(t);

        });
        $indexlist_nav.touchmove(function (event) {
            event.preventDefault();
            var t = event.changedTouches[0];
            if (t.clientY <= m_hd_h) {
                setindexlistTop(0);
                return;
            }
            setindexlist(t);

        });
        $indexlist_nav.touchendcancel(function (event) {
            $indexlist_tip.removeClass("in");
        });

        function setindexlistTop(i) {
            //console.log(items[i].name);
            var group = "[data-group=" + items[i].name + "]";
            var li = $indexlist_ul.find(group);
            var top = li.offset().top;
            $indexlist_ul.get(0).scrollTop = top;
            $indexlist_a.removeClass("active");
            $indexlist_a.eq(i).addClass("active");
            $indexlist_tip.find(".m-indexlist-tip-txt").html(items[i].name);
        }

        // scroll 
        var $indexlist_cnt = m(this.el).find(".m-indexlist-cnt");
        var $indexlist_ttl = m(this.el).find(".m-indexlist-ttl");
        var scrollItems = this.scrollItems;
        $indexlist_ttl.each(function (i, v) {
            var o = {};
            o.name = m(v).text().trim();
            o.top = m(v).offsetTop();
            scrollItems.push(o);
        });
      
        $indexlist_cnt.scroll(function (event) {
            var el = event.target;
            var top = el.scrollTop;
          
            for (var i = scrollItems.length - 1; i >= 0; i--) {
                if (top >= scrollItems[i].top) {

                    m(el).emit("scroll.m.indexlist", [el,i]);
                    setindexlistTitle(i);
                    break;
                }
   
            }
        });
        function setindexlistTitle(i) {
          
            var group = "[data-spy=" + scrollItems[i].name + "]";
            var li = $indexlist_ul.find(group);
            $indexlist_a.removeClass("active");
            $indexlist_a.eq(i).addClass("active");
           
        }

        function setindexlist(t) {
            var nowY = t.clientY - m_hd_h;
            nowY = nowY < 0 ? 0 : nowY;
            for (var i = 0; i < items.length; i++) {
                if (i < (items.length - 1)) {
                    if (nowY >= items[i].top && nowY < items[i + 1].top) {
                        setindexlistTop(i);
                        break;
                    }
                }
                else if (i === items.length - 1) {

                    if (nowY >= items[i].top) {
                        setindexlistTop(i);
                        break;
                    }

                }

            }
        }
    };

 
    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-indexlist');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-indexlist', data = new MIndexlist(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mIndexlist = $.fn.mIndexlist;
    $.fn.mIndexlist = Plugin;

    $("[data-toggle=m-indexlist]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();