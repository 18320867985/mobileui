/*
    hqs-touch

    changedTouches 改变后的触摸点集合
    targetTouches 当前元素的触发点集合
    touches 页面上所有触发点集合

   changedTouches 每个事件都会记录
   targetTouches，touches 在离开屏幕的时候无法记录触摸点

    支持多指触摸 touchstart touchmove touchend  合并封装
    $(el).move(touchstart=function(event,obj){},touchmove=function(event,obj){},touchend=function(event,obj){});

    // event 是事件对象
    // obj 是touch 移动对象
        obj = {
         x: 0, // 手指移动的X坐标的值
         y: 0, // 手指移动的Y坐标的值
         isX: false, // 是否为X方向移动
         isY: false // 是否为Y方向移动
        };

*/

+ function (Mobile) {

    Mobile.fn.extend({

        // 多指触摸
        touch: function (startfn, movefn, endfn, bl) {

            var $self = this;
            bl = !!bl;
            this.isAddMoveEventFirst = true; // 判断是否第一次拖动
            this.startX = 0;
            this.startY = 0;

            this.obj = {
                x: 0, // 手指移动的X坐标的值
                y: 0, // 手指移动的Y坐标的值
                isX: false, // 是否为X方向移动
                isY: false // 是否为Y方向移动

            };

            /* 变化touchList的identifier和时间戳的集合
                {
                    id,
                    timestamp
                }
            */
            $self.tempObj = [];
            m(this).touchstart(function (event) {

                var $this = this;
                try {

                    //兼容ios的返回键和 window.history.back()
                    if (event.touches.length === 1) {
                        $self.tempObj = [];
                    }

                    var touches = event.targetTouches;
                    var len = touches.length;
                    Object.keys(touches).forEach(function (name) {

                        if (!$self.tempObj.some(item => touches[name].identifier === item.id)) {
                            $self.tempObj.push({
                                id: touches[name].identifier,
                                timestamp: new Date().getTime()
                            });
                        }
                    });

                    var _index = 0;

                    var maxCh = m.max($self.tempObj, function (item) {
                        return item.timestamp;
                    });
                    if (maxCh) {

                        var i = 0;
                        Object.keys(touches).forEach(function (name) {
                            var ch = touches[name];
                            if (ch.identifier === maxCh.id) {
                                _index = i;
                            }
                            i++;

                        });

                    } else {
                        _index = len - 1;

                    }

                    var touch = touches[_index];
                    $self.obj.x = $self.startX = touch.clientX;
                    $self.obj.y = $self.startY = touch.clientY;

                    if (typeof startfn === "function") {
                        //event.obj=obj;
                        startfn.call($this, event, $self.obj);
                    }


                    // 异常处理
                } catch (e) {

                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj);
                    }
                }

            }, bl);

            m(this).touchmove(function (event) {
                var $this = this;
                try {

                    var touches = event.touches;
                    var len = touches.length;
                    var _index = 0;

                    var maxCh = m.max($self.tempObj, function (item) {
                        return item.timestamp;
                    });
                    if (maxCh) {
                        var i = 0;
                        Object.keys(touches).forEach(function (name) {
                            var ch = touches[name];
                            if (ch.identifier === maxCh.id) {
                                _index = i;
                            }

                            i++;
                        });

                    } else {
                        _index = len - 1;
                    }

                    var touch = touches[_index];
                    var nowX = touch.clientX;
                    var nowY = touch.clientY;

                    var _x = Math.abs(nowX - $self.startX);
                    var _y = Math.abs(nowY - $self.startY);
                    $self.obj.x = nowX - $self.startX;
                    $self.obj.y = nowY - $self.startY;

                    // 检查是否向上下或左右移动
                    if ($self.isAddMoveEventFirst && (_x !== _y)) {
                        $self.isAddMoveEventFirst = false;
                        if (_y > _x) {

                            $self.obj.isY = true;
                            $self.obj.isX = false;
                        } else {

                            $self.obj.isY = false;
                            $self.obj.isX = true;
                        }
                    }

                    if (typeof movefn === "function") {
                        //event.obj=obj;
                        movefn.call($this, event, $self.obj);
                    }

                    // 异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj);
                    }
                }

            }, bl);

            m(this).touchendcancel(function (event) {
                var $this = this;
                try {

                    var touches = event.changedTouches;
                    var touches2 = event.touches;

                    $self.tempObj = $self.tempObj.filter(function (item) {
                        return item.id !== touches[0].identifier;
                    });
                    var _index = 0;
                    var maxCh = m.max($self.tempObj, item => item.timestamp);
                    if (maxCh) {
                        var i = 0;
                        Object.keys(touches2).forEach(name => {
                            var ch = touches2[name];
                            if (ch.identifier === maxCh.id) {
                                _index = i;
                            }
                            i++;

                        });
                    } else {
                        _index = touches2.length - 1;
                    }

                    if (touches2.length > 0) {
                        var touch = touches2[_index];
                        $self.startX = touch.clientX - $self.obj.x;
                        $self.startY = touch.clientY - $self.obj.y;
                    }

                    if ($self.tempObj.length === 0) {
                        $self.tempObj = [];
                        $self.isAddMoveEventFirst = true; // 判断是否第一次拖动                     
                        if (typeof endfn === "function") {

                            //event.obj=obj;
                            endfn.call($this, event, $self.obj);

                        }
                    }

                    //异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj);

                    }
                }

            }, bl);

           
        },

        // 委托的多指触摸
        touchdeletage: function (deletage, startfn, movefn, endfn, bl) {

            var $self = this;
            bl = !!bl;
            this.isAddMoveEventFirst = true; // 判断是否第一次拖动
            this.startX = 0;
            this.startY = 0;

            this.obj = {
                x: 0, // 手指移动的X坐标的值
                y: 0, // 手指移动的Y坐标的值
                isX: false, // 是否为X方向移动
                isY: false // 是否为Y方向移动

            };

            /* 变化touchList的identifier和时间戳的集合
                {
                    id,
                    timestamp
                }
            */
            $self.tempObj = [];
            m(document).on("touchstart", deletage, function (event) {

                var $this = this;
                try {

                    //兼容ios的返回键和 window.history.back()
                    if (event.touches.length === 1) {
                        $self.tempObj = [];
                    }

                    var touches = event.targetTouches;
                    var len = touches.length;
                    Object.keys(touches).forEach(function (name) {

                        if (!$self.tempObj.some(item => touches[name].identifier === item.id)) {
                            $self.tempObj.push({
                                id: touches[name].identifier,
                                timestamp: new Date().getTime()
                            });
                        }
                    });

                    var _index = 0;

                    var maxCh = m.max($self.tempObj, function (item) {
                        return item.timestamp;
                    });
                    if (maxCh) {

                        var i = 0;
                        Object.keys(touches).forEach(function (name) {
                            var ch = touches[name];
                            if (ch.identifier === maxCh.id) {
                                _index = i;
                            }
                            i++;

                        });

                    } else {
                        _index = len - 1;

                    }

                    var touch = touches[_index];
                    $self.obj.x = $self.startX = touch.clientX;
                    $self.obj.y = $self.startY = touch.clientY;

                    if (typeof startfn === "function") {
                        //event.obj=obj;
                        startfn.call($this, event, $self.obj);
                    }


                    // 异常处理
                } catch (e) {

                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj);
                    }
                }

            }, bl);

            m(document).on("touchmove", deletage, function (event) {
                var $this = this;
                try {

                    var touches = event.touches;
                    var len = touches.length;
                    var _index = 0;

                    var maxCh = m.max($self.tempObj, function (item) {
                        return item.timestamp;
                    });
                    if (maxCh) {
                        var i = 0;
                        Object.keys(touches).forEach(function (name) {
                            var ch = touches[name];
                            if (ch.identifier === maxCh.id) {
                                _index = i;
                            }

                            i++;
                        });

                    } else {
                        _index = len - 1;
                    }

                    var touch = touches[_index];
                    var nowX = touch.clientX;
                    var nowY = touch.clientY;

                    var _x = Math.abs(nowX - $self.startX);
                    var _y = Math.abs(nowY - $self.startY);
                    $self.obj.x = nowX - $self.startX;
                    $self.obj.y = nowY - $self.startY;

                    // 检查是否向上下或左右移动
                    if ($self.isAddMoveEventFirst && (_x !== _y)) {
                        $self.isAddMoveEventFirst = false;
                        if (_y > _x) {

                            $self.obj.isY = true;
                            $self.obj.isX = false;
                        } else {

                            $self.obj.isY = false;
                            $self.obj.isX = true;
                        }
                    }

                    if (typeof movefn === "function") {
                        //event.obj=obj;
                        movefn.call($this, event, $self.obj);
                    }

                    // 异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj);
                    }
                }

            }, bl);

            m(document).on("touchend", deletage, function (event) {
                var $this = this;
                try {

                    var touches = event.changedTouches;
                    var touches2 = event.touches;

                    $self.tempObj = $self.tempObj.filter(function (item) {
                        return item.id !== touches[0].identifier;
                    });
                    var _index = 0;
                    var maxCh = m.max($self.tempObj, item => item.timestamp);
                    if (maxCh) {
                        var i = 0;
                        Object.keys(touches2).forEach(name => {
                            var ch = touches2[name];
                            if (ch.identifier === maxCh.id) {
                                _index = i;
                            }
                            i++;

                        });
                    } else {
                        _index = touches2.length - 1;
                    }

                    if (touches2.length > 0) {
                        var touch = touches2[_index];
                        $self.startX = touch.clientX - $self.obj.x;
                        $self.startY = touch.clientY - $self.obj.y;
                    }

                    if ($self.tempObj.length === 0) {
                        $self.tempObj = [];
                        $self.isAddMoveEventFirst = true; // 判断是否第一次拖动                     
                        if (typeof endfn === "function") {

                            //event.obj=obj;
                            endfn.call($this, event, $self.obj);

                        }
                    }

                    //异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj);

                    }
                }

            }, bl);

            m(document).on("touchcancel", deletage, function (event) {
                var $this = this;
                try {

                    var touches = event.changedTouches;
                    var touches2 = event.touches;

                    $self.tempObj = $self.tempObj.filter(function (item) {
                        return item.id !== touches[0].identifier;
                    });
                    var _index = 0;
                    var maxCh = m.max($self.tempObj, item => item.timestamp);
                    if (maxCh) {
                        var i = 0;
                        Object.keys(touches2).forEach(name => {
                            var ch = touches2[name];
                            if (ch.identifier === maxCh.id) {
                                _index = i;
                            }
                            i++;

                        });
                    } else {
                        _index = touches2.length - 1;
                    }

                    if (touches2.length > 0) {
                        var touch = touches2[_index];
                        $self.startX = touch.clientX - $self.obj.x;
                        $self.startY = touch.clientY - $self.obj.y;
                    }

                    if ($self.tempObj.length === 0) {
                        $self.tempObj = [];
                        $self.isAddMoveEventFirst = true; // 判断是否第一次拖动                     
                        if (typeof endfn === "function") {

                            //event.obj=obj;
                            endfn.call($this, event, $self.obj);

                        }
                    }

                    //异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj);

                    }
                }

            }, bl);

        } 

    });



}(Mobile);