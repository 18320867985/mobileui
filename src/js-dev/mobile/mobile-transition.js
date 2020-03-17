
/*
css3 transition 
*/

+function (Mobile) {


    Mobile.fn.extend({

        // transition
        transition: function (option, time, ease, delay, fn) {

            ease = typeof ease === "string" ? ease : "ease";
            delay = typeof delay === "number" ? delay : 0;
            var _transition = "all " + time / 1000 + "s  " + ease + " " + (delay / 1000) + "s";

            if (typeof option === "string") {

                if (arguments.length === 1) {
                    _transition = option;
                } else if (arguments.length > 1) {
                    _transition = option + " " + time / 1000 + "s  " + ease + " " + (delay / 1000) + "s";
                }

                Mobile.each(this, function () {
                    this.style.MozTransition = _transition;
                    this.style.msTransition = _transition;
                    this.style.webkitTransition = _transition;
                    this.style.OTransition = _transition;
                    this.style.transition = _transition;

                });

                return this;
            }

            // option is object	
            if (typeof option !== "object") {
                return;
            }
            Mobile.each(this, function (i, el) {
                time = typeof time === "number" ? time : 400;
                el.setTimeout = el.setTimeout || 0; // 第一次执行
                el.isEnd = el.isEnd || false; // 动画是否完毕

                if (el.isEnd === false) {

                    // 第一次执行
                    if (!el.isStart) {
                        el.isStart = true;
                        el.one = option; // 记录的第一次对象属性
                        el.setTimeout = time + el.setTimeout + delay;
                        el.style.MozTransition = _transition;
                        el.style.msTransition = _transition;
                        el.style.webkitTransition = _transition;
                        el.style.OTransition = _transition;
                        el.style.transition = _transition;
                        for (var name in option) {
                            el.style[name] = option[name];
                        }

                        //  第一次执行回调函数
                        if (typeof fn === "function") {
                            var clearTimeId2 = setTimeout(function () {
                                fn(el);
                                clearTimeout(clearTimeId2);
                            }, time + delay);
                        }

                    } else {
                        var clearTimeId = setTimeout(function () {

                            el.style.MozTransition = _transition;
                            el.style.msTransition = _transition;
                            el.style.webkitTransition = _transition;
                            el.style.OTransition = _transition;
                            el.style.transition = _transition;

                            for (var name in option) {
                                el.style[name] = option[name];
                            }
                            //  执行回调函数
                            if (typeof fn === "function") {
                                var clearTimeId2 = setTimeout(function () {
                                    fn(el);
                                    clearTimeout(clearTimeId2);
                                }, time + delay)
                            }
                            clearTimeout(clearTimeId);
                        }, el.setTimeout);

                        el.setTimeout = time + el.setTimeout + delay;

                    }
                }

            });

            return this;
        },

        // transitionEnd
        transitionEnd: function (isReset, fn) {

            // 是否回复到第一次的状态
            //isReset = typeof isReset === "boolean" ? isReset : false;
            var $arguments = arguments;
            Mobile.each(this, function (i, el) {

                // 第一次执行
                el.setTimeout = el.setTimeout || 0;

                // 动画是否完毕
                el.isEnd = true;
                //console.log("========end=======")
             
                // 动画是否完毕 回调函数
                var clearTimeId = setTimeout(function () {
                    el.isEnd = false;
                    el.setTimeout = 0;
                    el.isStart = false;

                    if (typeof isReset === "function") {
                        isReset(el);
                    } else if (typeof isReset === "boolean" && isReset === true) {

                        for (var name in el.one) {
                            el.style[name] = el.one[name];
                        }
                        var _v = "none";
                        el.style.MozTransition = _v;
                        el.style.msTransition = _v;
                        el.style.webkitTransition = _v;
                        el.style.OTransition = _v;
                        el.style.transition = _v;
                    }

                    if (typeof fn === "function") {
                        fn(el);
                    }

                }, el.setTimeout + 20);

            });
        }

    });


}(Mobile);
