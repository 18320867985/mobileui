// m-listoption  操作列表

+function () {

    'use strict';

    // define class
    var MListoption = function (el, options) {
        this.el = el;
        this.options = options;
        this.running();
    };

    MListoption.prototype.running = function () {

        var $m_listoption = m(this.el);
        var transition = "transform .6s ease";


        // 阻止冒泡
        $m_listoption.parent().touch(function (event, obj) {
         
                var $listoptionEl = m(event.target).parents(".m-listoption-item-cnt");

                if ($listoptionEl.translateX() < -1) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            
        });
      
        $m_listoption.touchdeletage(".m-listoption-item",
           
            function (event, obj) {
        
                var $moveElement = m(this).find(".m-listoption-item-cnt");
                obj.$moveElement = $moveElement;
                obj.moveElmentX = $moveElement.translateX();
                obj.$moveElment = $moveElement;
                obj.$moveElment.transition("none");
                obj.optionWidth = -$moveElement.find(".m-listoption-item-option").outerWidth();

                m(this).siblings().find(".m-listoption-item-cnt").translateX(0).transition(transition);
               
                // 触发自定义的事件
                m(this).emit("start.m.listoption", [this]);
           
            },
            function (event, obj) {

                if (obj.isX) {
                    event.preventDefault();
                    obj.$moveElment.transition("none");
                    var translateX = obj.moveElmentX + obj.x;
                  
                    if (translateX < obj.optionWidth) {
                        translateX = obj.optionWidth;
                    }

                    if (translateX > 0) {
                       translateX = 0;

                    } else {
                        event.stopPropagation();
                    }

                    obj.$moveElement.translateX(translateX);

                    // 触发自定义的事件
                    m(this).emit("move.m.listoption", [this]);

                }

            },
            function (event, obj) {

                if (obj.isX) {
                  //  event.stopPropagation();
                    var target = obj.$moveElment.translateX();

                    if (target < obj.optionWidth / 2) {
                        target = obj.optionWidth;
                    } else {
                        target = 0;
                    }
                   
                    obj.$moveElement.translateX(target);
                    obj.$moveElement.transition(transition);
                   
                    // 触发自定义的事件
                    m(this).emit("end.m.listoption", [this]);
                }

            }

        );

        m(document).on("tap", ".m-listoption-item-option", function (event) {
            event.preventDefault();
            event.stopPropagation();
        });

    };

   
    MListoption.DEFAULTS = {
      
};

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-listoption');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-listoption', data = new MListoption(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mListoption = $.fn.mListoption;
    $.fn.mListoption = Plugin;

    $("[data-toggle=m-listoption]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });

}();