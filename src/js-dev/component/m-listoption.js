// m-listoption  操作列表

+function () {

    'use strict';

    // define class
    var MListoption = function (el, options) {
        this.el = el;
        this.options = options;

        // 左拉自动触发
        if (this.options.auto) { this.options.limit = 0.8; }
      
        this.run();
    };

    MListoption.prototype.run = function () {

        var self = this;
        var $m_listoption = m(this.el);
      
        // 阻止冒泡
        $m_listoption.parent().touch(function (event, obj) {
         
                var $listoptionEl = m(event.target).parents(".m-listoption-item-cnt");

                if ($listoptionEl.translateX() < -1) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            
        });

        $m_listoption.touch(function () {

        }, function (event, obj) {
              
            if (obj.isX) {
                event.preventDefault();
            }
        });
      
        $m_listoption.touchdeletage(".m-listoption-item",
           
            function (event, obj, preoObj) {
             
                var $moveElement = m(this).find(".m-listoption-item-cnt");
                obj.$moveElement = $moveElement;
                obj.wraperWidth=obj.$moveElement.outerWidth()
                obj.moveElmentX = $moveElement.translateX();
                obj.$moveElment = $moveElement;
                obj.optionWidth = -$moveElement.find(".m-listoption-item-option").outerWidth();
                m(this).siblings().find(".m-listoption-item-cnt").translateX(0).transition("all .4s  ease");

                // 弹性拉动right
                if (preoObj.tempObj.length > 1 && (obj.moveElmentX < obj.optionWidth)) {
                    obj.moveElmentX = obj.moveElmentX2;
                    obj.moveElmentX2 = 0;
                } 

                // 触发自定义的事件
                m(this).emit("start.m.listoption", [this]);

            },
            function (event, obj,) {

                if (obj.isX) {
                    event.preventDefault();
                    obj.$moveElment.transition("none");
                    var translateX = obj.moveElmentX + obj.x;
                  
                    if (translateX > 0) {
                        translateX = 0;

                    } 

                    // 右限弹性拉动
                    if (translateX < obj.optionWidth) {
                        var moveRightVal = (translateX - obj.optionWidth)
                        obj.moveElmentX2 = translateX;
                        var biliRight = Math.abs(moveRightVal) / obj.wraperWidth;
                        translateX = obj.wraperWidth * (1 - self.options.limit) * biliRight + translateX;

                    }

                    obj.$moveElement.translateX(translateX);

                    // 触发自定义的事件
                    m(this).emit("move.m.listoption", [this]);

                }

            },
            function (event, obj) {

                if (obj.isX) {
                    var target = obj.$moveElment.translateX();
                    var ansTime = 400;
                    if (!self.options.auto) {
                        if (target < obj.optionWidth / 2) {
                              target = obj.optionWidth;

                            } else {
                                target = 0;

                            }
                         }

                   
                    if (self.options.auto){
                        if (target < (-obj.wraperWidth) * 0.6) {
                            target = -obj.wraperWidth;
                            ansTime = 200;
                            var $this = this;
                            // 触发自定义的auto事件
                            obj.$moveElement.setTimeout(function () {
                                m($this).emit("auto.m.listoption", [$this]);
                            }, ansTime);
                           
                        } else { target = 0;}

                    }

                    obj.$moveElement.translateX(target);
                    obj.$moveElement.transition("all " + ansTime+"ms  ease");
                   
                    // 触发自定义的事件
                    m(this).emit("end.m.listoption", [this]);
                }

            }

        );

        //m(document).on("tap", ".m-listoption-item-option", function (event) {
        //    event.preventDefault();
        //    event.stopPropagation();
        //});

    };

    MListoption.prototype.back = function () {
        console.log(this.el)
        m(this.el).find(".m-listoption-item-cnt").translateX(0).transition("all .4s  ease");;

    };

    MListoption.DEFAULTS = {
        limit: .2

};

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-listoption');
            var options = typeof option === 'object' && option;

            if (!data) {
                var o = {};
                o.auto = m(this).hasAttr("data-auto");
                o.limit = MListoption.DEFAULTS.limit;
                var p = $.extend({}, o, options);
                $this.data('m-listoption', data = new MListoption(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }

        });

    }

    var _mListoption = $.fn.mListoption;
    m.fn.mListoption = Plugin;

    m("[data-toggle=m-listoption]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });

}();