// m-Mpicker


+function () {

    'use strict';
    window.pickerObj = null;
    m.extend({

        mPicker: Plugin
    });

    // define class
    var MPicker = function (el, options, okfn) {

        this.okfn = okfn;
        this.options = options;
        this.createHtml();
        this.el = m(".m-picker");
        this.run();
    };

    MPicker.prototype.run = function () {
        m.router.ismask = true;
        var self = this;
        var $m_touch_tb = m(this.el).addClass("m-picker").find(".m-picker-inner");
        var $moveElement = $m_touch_tb.find(".m-picker-cnt");

        $m_touch_tb.find(".m-picker-item.active").each(function (i, v) {
            self.center.call(self, v); // 初始化选择第一项
        });

        m(".m-picker-item").on("tap", function (event) {
            event.preventDefault();
            event.stopPropagation();
            self.center.call(self, this);   // 移动到center

        });

        m(".m-picker").on("tap", function (event) {

            self.hide();

        });

        m(".m-picker-box-ttl").on("tap", function (event) {

            event.preventDefault();

        });

        m(".m-picker-box-cnt").on("tap", function (event) {
            event.preventDefault();
            event.stopPropagation();

        });

        m(".m-picker-btn.cancel").on("tap", function () {

            self.hide();

        });

        m(".m-picker-btn.ok").on("tap", function () {

            self.hide();
            if (typeof self.okfn === "function") {
                var val;
                var select = "select";
                if (self.options.type === select) {
                    val = self.getVal(select);
                }


                if (self.options.type === "date" || self.options.type === "datetime" || self.options.type === "date1" || self.options.type === "date2" || self.options.type === "date3" || self.options.type === "date4" || self.options.type === "date5" || self.options.type === "date6") {
                    val = self.getVal(self.options.type);
                }

                if (self.options.type === "time" || self.options.type === "time2") {
                    val = self.getVal("time");
                }

                if (self.options.type === "city1" || self.options.type === "city2" || self.options.type === "city3") {
                    val = self.getVal(self.options.type);
                }
                self.okfn(val);
            }

        });

        self.speedSetIntervalId = 0;  // 计算速度定时器id

        $m_touch_tb.each(function (i, v) {
            m(v).touch(

                function (event, obj) {
                    obj.$moveElment = m(this).find(".m-picker-cnt");// $moveElement;
                    obj.moveElmentY = obj.$moveElment.translateY();

                    // obj.$moveElment.transition("none");
                    self.obj = obj;

                    // 计算移动速度
                    // if (self.options.speed) {
                
                    self.speedlateY = obj.y=0;
                    clearInterval(self.speedSetIntervalId);
                    self.speedSetIntervalFisrt = true;
                    self.speedlateY = 0;
                    self.speedScroll = 0;
                    self.speedlateY2 = 0;
                    self.speedlateY3 = 0;

                    // 计算移动速度
                    if (self.speedSetIntervalFisrt) {
                        self.speedSetIntervalFisrt = false;
                        self.speedSetIntervalId = setInterval(function () {
                            self.speedlateY2 = obj.y || 0;
                            self.speedlateY3 = parseFloat(self.speedlateY2) - parseFloat(self.speedlateY);
                            self.speedlateY = self.speedlateY2;
                            self.speedScroll = self.speedlateY3;


                        }, 50);
                    }

                },

                function (event, obj) {

                    if (obj.isY) {
                        event.preventDefault();
                        obj.$moveElment.transition("none");
                        var translateY = obj.moveElmentY + obj.y;

                        // 下限住拉动
                        var limitTop = $m_touch_tb.outerHeight() * 0.8;
                        translateY = translateY > limitTop ? limitTop : translateY;

                        // 上限住拉动
                        var limitBottom = obj.$moveElment.outerHeight() - $m_touch_tb.outerHeight() * 0.2;
                        translateY = translateY < -limitBottom ? -limitBottom : translateY;

                        obj.$moveElment.translateY(translateY);

                    }

                },

                function (event, obj) {

                    if (obj.isY) {
                        

                        var moveElmentHeigth = obj.$moveElment.outerHeight();
                        var wraperHeight = $m_touch_tb.outerHeight();
                        var moveYSpace = moveElmentHeigth - wraperHeight;
                        var target = obj.$moveElment.translateY();
                        var liHeight = obj.$moveElment.find("li").outerHeight();

                        self.speedSetIntervalFisrt = true;
                        clearInterval(self.speedSetIntervalId);

                        // 计算移动速度
                        //if (self.speedScroll > 200) {
                        //    self.speedScroll = 200;
                        //} else if (self.speedScroll < -120) {
                        //    self.speedScroll = -200;
                        //}

                        target = target + self.speedScroll * (wraperHeight / 40); // 修改速度值 20 ，40， 60

                        // picker-item  first element
                        var middelHeight = wraperHeight / 2 - liHeight / 2;
                        var el;

                        if (target < 0) {
                            var _moveTranstalte = Math.abs(target) + middelHeight;
                            var index = Math.round(_moveTranstalte / liHeight);
                            el = obj.$moveElment.find("li").eq(index);

                            // last
                            if (target < -(moveYSpace + middelHeight - liHeight / 2)) {
                                el = obj.$moveElment.find(".m-picker-item").last();

                            }

                        } else {

                            var _move2 = middelHeight - target;

                            var index2 = Math.round(_move2 / liHeight);
                            el = obj.$moveElment.find("li").eq(index2);


                            if ((moveElmentHeigth + target) < wraperHeight / 2) {
                                el = obj.$moveElment.find("li").last();
                            } else {

                                // first
                                var movetop = middelHeight + liHeight / 2;
                                if (target > movetop) {
                                    el = obj.$moveElment.find(".m-picker-item").first();

                                }
                            }

                        }

               

                        //var abs_target = Math.abs(target);
                        //console.log(" wraperHeight", wraperHeight);
                        //console.log(" target", abs_target);
                        //console.log(" target/", abs_target / wraperHeight);

                        //$moveElement.transition("transform .6s cubic-bezier(.3,.53,.48,1.27)");
                       
                        self.center.call(self, el, true);   // 移动到center


                    }

                }

            );
        });

    };

    // position center
    MPicker.prototype.center = function (item, bl) {
        var $el = m(item).closest(".m-picker-inner");
        var $ul = $el.find(".m-picker-cnt");
        var $li = m(item);
        var window_h = $el.outerHeight();
        var current_top = $li.offset().top;
        var current_h = $li.outerHeight();
        var current_center = Math.abs(window_h / 2);
        var moveY = 0;

        if (Math.abs(current_top) > Math.abs(current_center)) {

            moveY = -(current_top - current_center + current_h / 2);

        } else {
            moveY = +(current_center - current_top - current_h / 2);
        }

        // 滑动过度效果
        var translateY = $ul.translateY();
        var gudingVal = 200;
        var spaceMoveY = Math.abs(moveY - translateY);
        var beishu = spaceMoveY / gudingVal;
        var ansTime = 600 * beishu;
        if (spaceMoveY < gudingVal) { ansTime = 600; }
        ansTime = ansTime > 2000 ? 2000 : ansTime;
      
        $ul.translateY(moveY);

        if (!bl) {
            $ul.transition("all", 600, "ease");
        } else { $ul.transition("transform  " + ansTime + "ms  cubic-bezier(.13,.77,.53,.93)");}



        if (!$el.get(0)) { return; }
        clearTimeout($el.get(0).settimeoutId);
        var self = this;
        $el.get(0).settimeoutId = setTimeout(function () {
            $li.addClass("active").siblings().removeClass("active");

            // 触发自定义的事件
            $li.emit("select.m.picker", [item, $li.attr("data-val"), self.options.type]);
            m(".m-picker-btns-tip").html("选择的值：" + `<span>${$li.text()}</span`);
            if (self.options.isShowTip && typeof self.okfn === "function") {
                var o = {};
                o[self.options.type] = $li.attr("data-val");
                self.okfn(o);
            }

        }, ansTime);

    };

    // 获取值
    MPicker.prototype.getVal = function (type) {
        var o = {};
        // date
        if (type === "date" || type === "datetime" || type === "date1" || type === "date2" || type === "date3" || type === "date4" || type === "date5" || type === "date6") {

            var _dateObj = o["date"] = {};
            _dateObj.date1 = m(this.el).find(".m-picker-year").find(".m-picker-item.active").attr("data-val");
            _dateObj.date2 = m(this.el).find(".m-picker-month").find(".m-picker-item.active").attr("data-val");
            _dateObj.date3 = m(this.el).find(".m-picker-day").find(".m-picker-item.active").attr("data-val");
            _dateObj.date4 = m(this.el).find(".m-picker-hour").find(".m-picker-item.active").attr("data-val");
            _dateObj.date5 = m(this.el).find(".m-picker-mimu").find(".m-picker-item.active").attr("data-val");
            _dateObj.date6 = m(this.el).find(".m-picker-second").find(".m-picker-item.active").attr("data-val");

        }

        // time
        if (type === "time2" || type === "time") {

            var _time = o["time"] = {};

            _time.time1 = m(this.el).find(".m-picker-hour").find(".m-picker-item.active").attr("data-val");
            _time.time2 = m(this.el).find(".m-picker-mimu").find(".m-picker-item.active").attr("data-val");
            _time.time3 = m(this.el).find(".m-picker-second").find(".m-picker-item.active").attr("data-val");

        }

        // select
        if (type === "select") {

            o[type] = m(this.el).find(".m-picker-item.active").attr("data-val");
        }

        // city
        if (type === "city1" || type === "city2" || type === "city3") {

            var _city = o["city"] = {};

            _city.city1 = {
                val: m(this.el).find(".m-picker-city1").find(".m-picker-item.active").attr("data-val"),
                txt: m(this.el).find(".m-picker-city1").find(".m-picker-item.active").text()
            };
            _city.city2 = {
                val: m(this.el).find(".m-picker-city2").find(".m-picker-item.active").attr("data-val"),
                txt: m(this.el).find(".m-picker-city2").find(".m-picker-item.active").text()
            };
            _city.city3 = {
                val: m(this.el).find(".m-picker-city3").find(".m-picker-item.active").attr("data-val"),
                txt: m(this.el).find(".m-picker-city3").find(".m-picker-item.active").text()
            };
        }
        return o;
    };

    // creaet html 
    MPicker.prototype.createHtml = function () {

        var ttl = ``;
        var content = ``;

        // select
        if (this.options.type === "select") {
            ttl = `${this.options.ttl ? `<div class="m-picker-box-ttl">
                <div>${this.options.ttl}</div>
            </div>`: ``}`;
            var list = this.options.list || [];
            list = list.constructor === Array ? list : [];
            content += MPicker.createInnerHtml(list);
        }

        // date
        if (this.options.type === "date" || this.options.type === "date1" || this.options.type === "date2" || this.options.type === "date3" || this.options.type === "date4" || this.options.type === "date5" || this.options.type === "date6" || this.options.type === "datetime") {
            ttl = ` <div class="m-picker-box-ttl">
                    <div>年</div>
                    
            </div>`;

            var year = [];
            var yearActive = new Date().getFullYear();
            for (var _date = (yearActive-100); _date < yearActive + 50; _date++) {
                year.push({ text: _date, val: _date, select: yearActive === _date ? true : false });
            }
            content += MPicker.createInnerHtml(year, "m-picker-year", this.options.type);

        }
        if (this.options.type === "date" || this.options.type === "date2" || this.options.type === "date3" || this.options.type === "date4" || this.options.type === "date5" || this.options.type === "date6" || this.options.type === "datetime") {
            ttl = ` <div class="m-picker-box-ttl">
                    <div>年</div>
                    <div>月</div>
                  
            </div>`;
            var month = [];
            var monthActive = new Date().getMonth() + 1;
            for (var _month = 1; _month <= 12; _month++) {
                month.push({ text: _month, val: _month, select: monthActive === _month ? true : false });
            }
            content += MPicker.createInnerHtml(month, "m-picker-month");
        }

        if (this.options.type === "date" || this.options.type === "date3" || this.options.type === "date4" || this.options.type === "date5" || this.options.type === "date6" || this.options.type === "datetime") {
            ttl = ` <div class="m-picker-box-ttl">
                    <div>年</div>
                    <div>月</div>
                    <div>日</div>
            </div>`;
            var day = [];
            var dayActive = new Date().getDate();
            var _y = new Date().getFullYear();
            var _m = new Date().getMonth() + 1;
            var maxDays = MPicker.computerDay(Number(_y), Number(_m));
            for (var _day = 1; _day <= maxDays; _day++) {
                day.push({ text: _day, val: _day, select: dayActive === _day ? true : false });
            }
            content += MPicker.createInnerHtml(day, "m-picker-day", this.options.type);

        }

        if (this.options.type === "date4" || this.options.type === "date5" || this.options.type === "date6" || this.options.type === "datetime") {
            ttl = ` <div class="m-picker-box-ttl">
                    <div>年</div>
                    <div>月</div>
                    <div>日</div>
                    <div>时</div>
                   
            </div>`;
            var hour = [];
            var hourActive = new Date().getHours();
            for (var _hh = 0; _hh < 24; _hh++) {
                hour.push({ text: _hh, val: _hh, select: hourActive === _hh ? true : false });
            }
            content += MPicker.createInnerHtml(hour, "m-picker-hour", this.options.type);

        }

        if (this.options.type === "date5" || this.options.type === "date6" || this.options.type === "datetime") {
            ttl = ` <div class="m-picker-box-ttl">
                    <div>年</div>
                    <div>月</div>
                    <div>日</div>
                    <div>时</div>
                    <div>分</div>
                 
            </div>`;

            var mimu = [];
            var mimuhActive = new Date().getMinutes();
            for (var _mimu = 0; _mimu < 60; _mimu++) {
                mimu.push({ text: _mimu, val: _mimu, select: mimuhActive === _mimu ? true : false });
            }
            content += MPicker.createInnerHtml(mimu, "m-picker-mimu", this.options.type);

        }

        // datetime
        if (this.options.type === "datetime" || this.options.type === "date6") {
            ttl = ` <div class="m-picker-box-ttl">
                    <div>年</div>
                    <div>月</div>
                    <div>日</div>
                    <div>时</div>
                    <div>分</div>
                    <div>秒</div>
            </div>`;

            var second = [];
            var secondActive = new Date().getSeconds();
            for (var _second = 0; _second < 60; _second++) {
                second.push({ text: _second, val: _second, select: secondActive === _second ? true : false });
            }
            content += MPicker.createInnerHtml(second, "m-picker-second", this.options.type);
        }

        if (this.options.type === "time" || this.options.type === "time2") {
            ttl = ` <div class="m-picker-box-ttl">
                    <div>时</div>
                    <div>分</div>
                  
            </div>`;

            var hour2 = [];
            var hourActive2 = new Date().getHours();
            for (var _hh2 = 0; _hh2 < 24; _hh2++) {
                hour2.push({ text: _hh2, val: _hh2, select: hourActive2 === _hh2 ? true : false });
            }
            content += MPicker.createInnerHtml(hour2, "m-picker-hour");
            var mimu2 = [];
            var mimuhActive2 = new Date().getMinutes();
            for (var _mimu2 = 0; _mimu2 < 60; _mimu2++) {
                mimu2.push({ text: _mimu2, val: _mimu2, select: mimuhActive2 === _mimu2 ? true : false });
            }
            content += MPicker.createInnerHtml(mimu2, "m-picker-mimu", this.options.type);
        }

        if (this.options.type === "time") {
            ttl = ` <div class="m-picker-box-ttl">
                    <div>时</div>
                    <div>分</div>
                    <div>秒</div>
                  
            </div>`;

            var second2 = [];
            var secondActive2 = new Date().getSeconds();
            for (var _second2 = 0; _second2 < 60; _second2++) {
                second2.push({ text: _second2, val: _second2, select: secondActive2 === _second2 ? true : false });
            }
            content += MPicker.createInnerHtml(second2, "m-picker-second", this.options.type);
        }

        // city
        if (this.options.type === "city1" || this.options.type === "city2" || this.options.type === "city3") {

            var cityList = m.cityData || [];
            cityList = cityList.constructor === Array ? cityList : [];
            var cityList1 = cityList.map(function (item, index) {

                return { text: item.text, val: item.value, select: index === 0 ? `active` : `` };
            });
            content += MPicker.createInnerHtml(cityList1, "m-picker-city1", this.options.type);
        }

        // city2
        if (this.options.type === "city2" || this.options.type === "city3") {

            content += MPicker.createInnerHtml([], "m-picker-city2", this.options.type);
        }

        // city3
        if (this.options.type === "city3") {

            content += MPicker.createInnerHtml([], "m-picker-city3", this.options.type);
        }

        var tophtml = `
           
                <div class="m-picker-box-cnt in">
                  ${!(this.options.isShowTip && this.options.type === `select`) ? ` <div class="m-picker-box-btns">
                        <div class="m-picker-btn cancel">取消</div>
                        <div class="m-picker-btn ok">确定</div>
                    </div>`: `<div class="m-picker-btns-tip">选择的值:</div>
                    `} 
                    ${ttl ? ttl : ``}
                    <div class="m-picker-inners">`;
        var bottomhtml = `  </div></div>`;
        var picker = document.createElement("div");
        picker.classList.add("m-picker");
        picker.classList.add("in");
        picker.innerHTML = tophtml + content + bottomhtml;
        var elm = document.body || document.documentElement;
        m(elm).append(picker);

    };

    MPicker.prototype.show = function () {

        m(".m-picker").addClass("in").removeClass("out").find(".m-picker-box-cnt").addClass("in").removeClass("out");
        m.router.ismask = true;


    };

    MPicker.prototype.hide = function () {

        window.pickerObj = null;
        m(".m-picker").find(".m-picker-box-cnt").removeClass("in").addClass("out");
        window.setTimeout(function () {
            m(".m-picker").remove();
            m.router.ismask = false;
        }, 400);

    };

    MPicker.prototype.toggle = function () {

        if (m(".m-picker").hasClass("in")) {
            this.hide();
        } else {
            this.show();
        }
    };

    // position center
    MPicker.prototype.setInnerContentHeight = function () {

        var $el = m(this.el);
        var MaxBoxHeight = $el.find("m-picker-box-cnt").outerHeight();
        var btnsHeight = $el.find("m-picker-box-btns").outerHeight();
        var ttlHeight = $el.find("m-picker-box-ttl").outerHeight();
        $el.find("m-picker-box-inners").height(MaxBoxHeight - btnsHeight - ttlHeight);

    };

    MPicker.createInnerHtml = function (list, className, type) {
        list = list || [];
        var topthtml = `
                    <nav class="m-picker-inner ${className}" data-type="${type}">
                        <div class="m-picker-line"></div>
                        <ul class="m-picker-cnt"> `;

        var contenthtml = ``;
        var bottomHtml = `</ul></nav>`;

        list.forEach(function (item) {
            contenthtml += ` <li class="m-picker-item ${item.select ? `active` : ``}" data-val="${item.val}">${item.text} </li>`;
        });

        return topthtml + contenthtml + bottomHtml;
    };

    //  根据年月计算天数
    MPicker.computerDay = function (y, m) {
        var d = 1;
        switch (m) {
            case 1:
                d = 31;
                break;
            case 2:
                d = 30;
                if (y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0)) {
                    //document.write(num + "是闰年。");
                    d = 29;
                } else {
                    //document.write(num + "是平年。");
                    d = 28;
                }

                break;
            case 3:
                d = 31;
                break;
            case 4:
                d = 30;
                break;
            case 5:
                d = 31;
                break;
            case 6:
                d = 30;
                break;
            case 7:
                d = 31;
                break;
            case 8:
                d = 31;
                break;
            case 9:
                d = 30;
                break;
            case 10:
                d = 31;
                break;
            case 11:
                d = 30;
                break;
            case 12:
                d = 31;
                break;
        }

        return d;

    };

    MPicker.center = function (item, bl) {
        var $el = m(item).closest(".m-picker-inner");

        var $ul = $el.find(".m-picker-cnt");
        var $li = m(item);
        var window_h = $el.outerHeight();
        var current_top = $li.offset().top;
        var current_h = $li.outerHeight();
        var current_center = Math.abs(window_h / 2);
        var moveY = 0;

        if (Math.abs(current_top) > Math.abs(current_center)) {

            moveY = -(current_top - current_center + current_h / 2);

        } else {
            moveY = +(current_center - current_top - current_h / 2);
        }
        $ul.transition("all", 600, "ease");
        $ul.translateY(moveY);

        if (!$el.get(0)) { return; }
        clearTimeout($el.get(0).settimeoutId);
        $el.get(0).settimeoutId = setTimeout(function () {
            $li.addClass("active").siblings().removeClass("active");

            // 触发自定义的事件
            $li.emit("select.m.picker", [item, $li.attr("data-val"), $el.attr("data-type")]);
        }, 600);


    };

    function Plugin(toggle, option, okfn) {
        if (toggle instanceof Object) {

            okfn = option;
            option = toggle;
            toggle = "toggle";

        }
        toggle = toggle || "toggle";
        var options = typeof option === 'object' && option;
        var o = {};
        var p = $.extend({}, o, options);

        window.pickerObj = new MPicker(null, p, okfn);

    }

    // select 触发是事件
    m(document).on("select.m.picker", function (event, el, val, type) {

        var $p = m(el).closest(".m-picker-inner");

        // date time
        if (type === "date" || type === "datetime" || type === "date3" || type === "datet4" || type === "date5" || type === "date6") {

            if ($p.hasClass("m-picker-year") || $p.hasClass("m-picker-month")) {
                var $ps = m(el).closest(".m-picker-inners");
                var year = $ps.find(".m-picker-year .m-picker-item.active").attr("data-val");
                var month = $ps.find(".m-picker-month .m-picker-item.active").attr("data-val");
                var maxDays = MPicker.computerDay(Number(year), Number(month));
                var index = $ps.find(".m-picker-day .m-picker-item.active").index() + 1;

                index = index < maxDays ? index : maxDays;
                var lis = ``;
                for (var _day = 1; _day <= maxDays; _day++) {

                    lis += ` <li class="m-picker-item ${index === _day ? `active` : ``} " data-val="${_day}">${_day} </li>`;
                }
                var dayEl = $ps.find(".m-picker-day .m-picker-cnt");
                if (dayEl.length > 0) {

                    dayEl.html(lis);
                }

                var activeEl = $ps.find(".m-picker-day .m-picker-item.active");
                MPicker.center(activeEl);

                m(".m-picker-day").on("tap", ".m-picker-item", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    MPicker.center(this);

                });


            }
        }

        // city
        if (type === "city1" || type === "city2" || type === "city3") {

            var $ps2 = m(el).closest(".m-picker-inners");
            if ($p.hasClass("m-picker-city1")) {

                var cityActive = $ps2.find(".m-picker-city1 .m-picker-item.active").attr("data-val");
                var city2Index = $ps2.find(".m-picker-city2 .m-picker-item.active").index();
                city2Index = city2Index < 0 ? 0 : city2Index;
                var cityObj = m.cityData.find(function (item) { return item.value === cityActive; });
                city2Index = cityObj.children.length - 1 < city2Index ? cityObj.children.length - 1 : city2Index;

                var cityLis = ``;
                cityObj.children.forEach(function (item, i) {
                    cityLis += ` <li class="m-picker-item elp-1 ${i === city2Index ? `active` : ``} " data-val="${item.value}">${item.text} </li>`;
                });

                var city2El = $ps2.find(".m-picker-city2 .m-picker-cnt");
                city2El.data("children", cityObj);
                if (city2El.length > 0) {

                    city2El.html(cityLis);
                }
                var city2ActiveEl = $ps2.find(".m-picker-city2 .m-picker-item.active");
                MPicker.center(city2ActiveEl);

                m(".m-picker-city2").on("tap", ".m-picker-item", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    MPicker.center(this);

                });

            }
            if ($p.hasClass("m-picker-city1") || $p.hasClass("m-picker-city2")) {
                var $activeEl = $ps2.find(".m-picker-city2 .m-picker-cnt");
                var city2Obj = $activeEl.data("children");
                if (!city2Obj) { return; }
                var city2Active = $ps2.find(".m-picker-city2 .m-picker-item.active").attr("data-val");
                var city3Index = $ps2.find(".m-picker-city3 .m-picker-item.active").index();
                city3Index = city3Index < 0 ? 0 : city3Index;
                var city3El = $ps2.find(".m-picker-city3 .m-picker-cnt");

                var city3Obj = city2Obj.children.find(function (item) { return item.value === city2Active; });
                if (!city3Obj.children) { city3El.html(""); return; }

                city3Index = city3Obj.children.length - 1 < city3Index ? city3Obj.children.length - 1 : city3Index;
                var cityLis2 = ``;
                city3Obj.children.forEach(function (item, i) {
                    cityLis2 += ` <li class="m-picker-item  elp-1 ${i === city3Index ? `active` : ``} " data-val="${item.value}">${item.text} </li>`;
                });

                if (city3El.length > 0) {

                    city3El.html(cityLis2);
                }

                var city3ActiveEl = $ps2.find(".m-picker-city3 .m-picker-item.active");
                MPicker.center(city3ActiveEl);

                m(".m-picker-city3").on("tap", ".m-picker-item", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    MPicker.center(this);

                });

            }
        }

    });

}();