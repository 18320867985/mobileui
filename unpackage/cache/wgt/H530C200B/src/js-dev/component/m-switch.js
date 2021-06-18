// m-switch

+function () {

    'use strict';

    // define class
    var MSwitch = function (el, options) {
        this.el = el;
        this.options = options;
        this.run();
       
    };

    MSwitch.prototype.run = function () {
        var self = this;
        var $witch = m(this.el);
        var transition = MSwitch.DEFAULTS.transition;
        $witch.touch(

            function (event, obj) {
                event.preventDefault();
                var $moveElement = $witch.find(".m-switch-rd");
                obj.moveElmentX = $moveElement.translateX();
                obj.$moveElment = $moveElement;
                obj.$moveElment.transition("none");
                obj.switchWidth = m(this).outerWidth();
                obj.moveElmentWidth = $moveElement.outerWidth();
                obj.maxWidth = obj.switchWidth - obj.moveElmentWidth;
       
            },
            function (event, obj) {

                if (obj.isX) {
                    event.preventDefault();
                    event.stopPropagation();
                    obj.$moveElment.transition("none");
                    var translateX = obj.moveElmentX + obj.x;

                    translateX = translateX < 0 ? 0 : translateX;

                    translateX = translateX >= obj.maxWidth ? obj.maxWidth : translateX;
                    if (translateX >= obj.maxWidth/2) {

                        m(this).addClass("active");
                    } else {
                        m(this).removeClass("active");
                       
                    }
                  
                    obj.$moveElment.translateX(translateX);
             
                }

            },
            function (event, obj) {

                if (obj.isX) {

                    var translateX = obj.$moveElment.translateX();
                    var bl = false;
                    if (translateX > obj.maxWidth / 2) {
                        bl = true;
                        translateX = obj.maxWidth;
                        m(this).addClass("active");
                    } else {
                        translateX = 0;
                        m(this).removeClass("active");
                    }

                    obj.$moveElment.translateX(translateX);
                    obj.$moveElment.transition(transition);
                    // 触发自定义的事件
                    obj.isX = false;
                    m(this).emit("switch.m.switch", [this, bl]);
                }
            }

        );


        this.setStyle($witch, transition);
        m(window).resize(m.proxy(function () {
            this.setStyle($witch, transition);
        }, this));

        // tap事件
        m(self.el).on("tap", function () {
            if (m(this).hasClass("active")) {
                m(this).removeClass("active");
                self.setStyle(this, transition);
                m(this).emit("switch.m.switch", [this, false]);
            } else {
                m(this).addClass("active");
                self.setStyle(this, transition);
                m(this).emit("switch.m.switch", [this, true]);
            }

        });

    };

    MSwitch.prototype.setStyle = function (el,transition) {
      
        var $witch = m(el);
        var $moveElement = $witch.find(".m-switch-rd");
        var switchWidth = $witch.outerWidth();
        var moveElmentWidth = $moveElement.outerWidth();
        var maxWidth = switchWidth - moveElmentWidth;
        if ($witch.hasClass("active")) {
          
            $moveElement.translateX(maxWidth);
        } else { $moveElement.translateX(0); }
        $moveElement.transition(transition);
    };

    MSwitch.prototype.set = function (val) {
        val = !!val;
        var $witch = m(this.el);
        var wraperWidth = $witch.outerWidth();
        var $moveElement = $witch.find(".m-switch-rd");
        var moveElmentWidth = $moveElement.outerWidth();
        var maxWidth = wraperWidth - moveElmentWidth;
        var translateX = 0;
        if (val) {
            translateX = maxWidth;
            $witch.addClass("active");
            } else {
            translateX = 0;
            $witch.removeClass("active");
            }

        $moveElement.translateX(translateX);
        $moveElement.transition(MSwitch.DEFAULTS.transition);
            // 触发自定义的事件
        $witch.emit("switch.m.switch", [$witch.get(0), val]);

        

    };

    MSwitch.prototype.get = function () {

    return m(this.el).hasClass("active");
      
    };


    MSwitch.DEFAULTS = {
        transition: "transform .4s ease"
    };
 
    function Plugin(option,val) {
        var result;
         this.each(function () {

            var $this = $(this);
            var data = $this.data('m-switch');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-switch', data = new MSwitch(this, p));
            }

            if (typeof option === 'string') {
                result = data[option](val);
            }

         });

        return result;

    }

    var _mSwitch = $.fn.mSwitch;
    $.fn.mSwitch = Plugin;

    $("[data-toggle=m-switch]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);

    });

}();