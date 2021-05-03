/*
 *	移动端 公共类库 IE10+
 * 作者：hqs
 */

(function (global, factory){

	//  cmd commonjs
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = factory(global);
	}
	else if (typeof define === "function" && define.amd) {
		define(function() {
			return factory(global);
		});
	}

	// cmd seajs
	else if (typeof define === "function" && define.cmd) {
		define(function(require, exports, module) {
			module.exports = factory(global);
		});

	} else {
		factory(global);
	}

})(typeof window !== "undefined" ? window : this, function(window) {

	"use strict";

	// 冲突Mobile兼容
	var _mobile = window.mobile,
		_m = window.m,
		_$ = window.$;

	// 创建mobile对象
	window.Mobile = window.$ = window.m = window.mobile = function(selector, context) {

		if (typeof selector === "function" && arguments.length === 1) {
			Mobile.ready(selector);
			return;
		}
		return new Mobile.fn.init(selector, context);
	};

	// 版本号
	Mobile.version = "1.1.5";

	// 查找父元素
	function _searchParents(el, fn) {

        try {
            if (el.parentElement) {
                if (fn(el.parentElement)) {
                    return el.parentElement;
                }
            }

            if ((el.nodeName || "").toLowerCase() === "html") {
                return;
            }
        } catch(ex){
            return null;
        }

		return _searchParents(el.parentElement, fn);

	}

	// scrollTop 动画
	function _scrollTop(self, y, time) {

		time = typeof time === "number" ? time : 400;
		y = typeof y === "number" ? y : parseFloat(y);
		y = isNaN(y) ? 0 : y;
		var fx = 20;
        var speed = 100;

		self.clearTimeId = self.clearTimeId || 0;
		clearInterval(self.clearTimeId);

		var isElement = true;
		if (self === window || self === document) {
			isElement = false;
		} else {
			isElement = true;
		}

		var windowStartTop = (isElement ? self.scrollTop : parseFloat(window.pageYOffset)) || 0;
		var speed2 = Math.abs(windowStartTop - y);
        speed = (speed2 / time) * fx;
      
		if (windowStartTop > y) {

			self.clearTimeId = setInterval(function() {
				windowStartTop = windowStartTop - speed;
				isElement ? self.scrollTop = windowStartTop : window.scrollTo(0, windowStartTop);
				//	console.log("scrolltop")
				if ((windowStartTop - speed) <= y) {
					// stop
					isElement ? self.scrollTop = y : window.scrollTo(0, y);
					clearInterval(self.clearTimeId);
				}
			}, fx);
		} else {
			if (windowStartTop === y) {
				// stop
				clearInterval(self.clearTimeId);
				return;
			}
			self.clearTimeId = setInterval(function() {
				windowStartTop = windowStartTop + speed;
				isElement ? self.scrollTop = windowStartTop : window.scrollTo(0, windowStartTop);
				//console.log("scrolltop");
				if (windowStartTop + speed > y) {
					// stop
					isElement ? self.scrollTop = y : window.scrollTo(0, y);
					clearInterval(self.clearTimeId);
				}
			}, fx);
		}
    }


    // scrollLeft 动画
    function _scrollLeft(self, x, time) {

        time = typeof time === "number" ? time : 400;
        x = typeof x === "number" ? x : parseFloat(x);
        x = isNaN(x) ? 0 : x;
        var fx = 10;
        var speed = 100;

        self.clearTimeId = self.clearTimeId || 0;
        clearInterval(self.clearTimeId);

        var isElement = true;
        if (self === window || self === document) {
            isElement = false;
        } else {
            isElement = true;
        }

        var windowStartLeft = (isElement ? self.scrollLeft : parseFloat(window.pageXOffset)) || 0;
        var speed2 = Math.abs(windowStartLeft - x);
        speed = (speed2 / time) * fx;
  
        if (windowStartLeft > x) {

            self.clearTimeId = setInterval(function () {
                windowStartLeft = windowStartLeft - speed;
                isElement ? self.scrollLeft = windowStartLeft : window.scrollTo(windowStartLeft,0);
                //	console.log("scrolltop")
                if ((windowStartLeft - speed) <= x) {
                    // stop
                    isElement ? self.scrollLeft = x : window.scrollTo(x,0);
                    clearInterval(self.clearTimeId);
                }
            }, fx);
        } else {
            if (windowStartLeft === x) {
                // stop
                clearInterval(self.clearTimeId);
                return;
            }
            self.clearTimeId = setInterval(function () {
                windowStartLeft = windowStartLeft + speed;
                isElement ? self.scrollLeft = windowStartLeft : window.scrollTo(windowStartLeft,0);
                //console.log("scrolltop");
                if (windowStartLeft + speed > x) {
                    // stop
                    isElement ? self.scrollLeft = x : window.scrollTo( x,0);
                    clearInterval(self.clearTimeId);
                }
            }, fx);
        }
    }

	// 浅复制 parentObj 父元素 childObj子元素
    function _extend(parentObj, childObj) {

        childObj = childObj || {};

        for (var prop in parentObj) {
            childObj[prop] = parentObj[prop];
        }
        return childObj;
    }

    // 深复制 parentObj 父元素 childObj子元素
    function _extendDeep(parentObj, childObj) {

        childObj = childObj || {};

        for (var prop in parentObj) {

            if (typeof parentObj[prop] === "object") {

                childObj[prop] = parentObj[prop].constructor === Array ? [] : {};
                _extendDeep(parentObj[prop], childObj[prop]);

            } else {
                childObj[prop] = parentObj[prop];
            }
        }
        return childObj;
    };

	// 原型-prototype
    Mobile.fn = Mobile.prototype = {

        init: function (selector, content) {

            var arrs = [];
            this.length = 0;
            if (!content) {

                // 字符串
                if (typeof selector === "string") {
                    if (selector.trim().length === 0) {
                        return this;
                    }
                    var els = document.querySelectorAll(selector);
                    Array.prototype.push.apply(this, els);
                } else if (typeof selector === "object") {

                    // Nodelist, HTMLCollection 对象
                    if (selector.constructor && (selector.constructor === NodeList || selector.constructor === HTMLCollection)) {
                        Mobile.each(selector, function (i, v) {
                            arrs.push(v);
                        });
                    }
                    // Mobile 对象
                    else if (selector.hasOwnProperty("length") && selector.length > 0) {
                        Mobile.each(selector, function (i, v) {
                            arrs.push(v);
                        });
                    } else if (selector.nodeType === Node.ELEMENT_NODE || selector.nodeType === Node.DOCUMENT_NODE || selector ===
                        window) {
                        // element 单例对象 
                        arrs.push(selector);
                    }

                    Array.prototype.push.apply(this, arrs);

                }

            } else {

                if (typeof content === "string" && typeof selector === "string") {

                    if (content.trim().length === 0) {
                        return this;
                    }
                    if (selector.trim().length === 0) {
                        return this;
                    }

                    var p = document.querySelectorAll(content);
                    Mobile.each(p, function () {
                        var childElements = this.querySelectorAll(selector);
                        for (var i = 0; i < childElements.length; i++) {
                            arrs.push(childElements[i]);
                        }
                    });
                    Array.prototype.push.apply(this, arrs);

                } else if (typeof content === "object" && typeof selector === "string") {
                    if (selector.trim().length === 0) {
                        return this;
                    }
                    // 遍历数组型对象
                    if (content.hasOwnProperty("length") && content.length > 0) {

                        Mobile.each(content, function () {
                            var childElements = this.querySelectorAll(selector);
                            for (var i = 0; i < childElements.length; i++) {
                                arrs.push(childElements[i]);
                            }

                        });
                        Array.prototype.push.apply(this, arrs);

                    } else if (content.nodeType === Node.ELEMENT_NODE || content.nodeType === Node.DOCUMENT_NODE) {
                        var childElements = content.querySelectorAll(selector);
                        Array.prototype.push.apply(this, childElements);
                    }

                }

            }
            return this;
        }

    };

	// 将init函数作为实例化的mobile原型。 
	Mobile.fn.init.prototype = Mobile.fn;

	// 添加静态和实例的扩展方法
    Mobile.extend = Mobile.fn.extend = function (deep,obj) {

         // mobile extend
        if (deep.constructor === Object&&arguments.length === 1) {
            _extend(deep, this);
            return this;
        }
         // mobile extend deeply
        if (deep.constructor === Boolean && arguments.length === 2 && obj.constructor === Object ) {
            if (deep) { _extendDeep(obj, this); } else { _extend(deep, this); }
            return this;
        }


        //  Object extend
        var i, item,deeply;
        if (deep.constructor === Object && arguments.length >=2) {

            for (i = 1; i < arguments.length; i++) {
                
                item = arguments[i];
                if (typeof item === "object") {
                    _extend(item,deep);
                }

            }

            return deep;

        }

        //  Object extend deeply
        if (deep.constructor === Boolean && arguments.length >= 3 && obj.constructor === Object) {
           
            for (i = 2; i < arguments.length; i++) {
               
                item = arguments[i];
             
                if (typeof item === "object") {
                    if (deep) {
                        _extendDeep(item, obj);
                    }
                    else { _extend(item, obj); }
                   
                }

            }

            return obj;

        }
    };

	// 扩展静态方法
    Mobile.extend({

        noCoflict: function (deep) {
            window.$ = _$;
            window.m = _m;
            if (deep) {
                window.mobile = _mobile;
            }

            return Mobile;
        },

        each: function (els, fn) {
            if (!els) {
                throw new Error("els property type must is Array or Object");
            }
            for (var i = 0; i < els.length; i++) {

                if (typeof fn === "function") {
                    var bl = fn.call(els[i], i, els[i]);
                    if (bl === false) {
                        break;
                    }
                }
            }
        },

        ready: function (fn) {

            if (typeof fn === "function") {
                window.addEventListener("load", fn);

            }
            return;
        },

        // 列表项和子项的匹配	
        isEqual: function (list, item) {
            list = list || [];
            for (var i = 0; i < list.length; i++) {

                if (list[i] === item) {
                    return true;
                }
            }

            return false;

        },

        // html字符串转dom对象
        htmlStringToDOM: function (txt) {

            var df2 = document.createDocumentFragment();
            var df = document.createDocumentFragment();
            var div = document.createElement("div");
            div.innerHTML = txt;
            df.appendChild(div);
            var _nodes = df.querySelector("div").childNodes;
            for (var i = _nodes.length; i > 0; i--) {
                df2.insertBefore(_nodes[i - 1], df2.childNodes[0]);
            }
            df = null;
            return df2;

        },

        checkSelector: function (el, txt) {
            if (!el) { return false; }
            txt = typeof txt === "string" ? txt : "";
            if (txt.trim() === "") {
                return false;
            }
            var regId = /\#[a-zA-Z_][\w|-]*[^\.|^#|\[]{0,}/g;
            var regClass = /\.[a-zA-Z_][\w|-]*[^\.|^#|\[]{0,}/g;
            var regTag = /^[a-zA-Z_][\w|-]*[^\.|^#|\[]{0,}|[\]][a-zA-Z_][\w|-]*[^\.|^#|\[]{0,}/g;
            var regAttr = /\[[a-zA-Z][\w-=]*\]/g;

            var idList = txt.match(regId) || [];
            idList = rep(idList, "#", "");
            var isIdBl = isId(el, idList, txt);
            //alert(isIdBl)

            var classList = txt.match(regClass) || [];
            classList = rep(classList, ".", "");
            var isClassBl = isclass(el, classList, txt);
            //alert(isClassBl)

            var tagList = txt.match(regTag) || [];
            tagList = rep(tagList, "]", "");
            var isTagBl = istag(el, tagList, txt);
            //alert(isTagBl)

            var attrList = txt.match(regAttr) || [];
            attrList = rep(attrList, "[", "");
            attrList = rep(attrList, "]", "");
            var isAttrBl = isAttr(el, attrList, txt);
            //alert(attrList)

            function rep(list, old, now) {
                var arr = [];
                for (var i = 0; i < list.length; i++) {
                    arr.push(list[i].replace(old, now));
                }

                return arr;
            }

            function isId(el, idList, searchTxt) {

                if (searchTxt.search(/#/) === -1) {
                    return true;
                } else if (searchTxt.search(/#/) !== -1 && idList.length === 0) {
                    return false;
                }

                // 上条件不符合  向下执行
                var id = el.id || "";
                for (var i = 0; i < idList.length; i++) {
                    if (idList[i] === id) {
                        return true;
                    }
                }
                return false;

            }

            function isclass(el, idList, searchTxt) {
                if (searchTxt.search(/\./) === -1) {
                    return true;
                } else if (searchTxt.search(/\./) !== -1 && idList.length === 0) {
                    return false;
                }

                // 上条件不符合  向下执行
                var _class = el.classList || "";

                for (var i = 0; i < idList.length; i++) {
                    if (!_class.contains(idList[i])) {
                        return false;
                    }
                }
                return true;

            }

            function istag(el, idList, searchTxt) {
                if (searchTxt.search(/^[a-zA-Z_]*|[\]][a-zA-Z_]/) === -1) {
                    return true;
                } else if (searchTxt.search(/^[a-zA-Z_]|[\]][a-zA-Z_]/) !== -1 && idList.length === 0) {
                    return false;
                }

                // 上条件不符合  向下执行
                var _tag = (el.nodeName || "").toLowerCase();

                for (var i = 0; i < idList.length; i++) {
                    if (idList[i].trim() !== _tag) {
                        return false;
                    }
                }
                return true;

            }

            function isAttr(el, idList, searchTxt) {

                if (searchTxt.search(/\[.*\]/) === -1) {
                    return true;
                } else if (searchTxt.search(/\[.*\]/) !== -1 && idList.length === 0) {
                    return false;
                }

                // 上条件不符合  向下执行
                //var _tag = el.getat
                var _reg2 = /=/g;
                for (var i = 0; i < idList.length; i++) {

                    if (_reg2.test(idList[i])) {
                        //alert(idList[i]);
                        var arr2 = idList[i].split("=");
                        if ((el.getAttribute(arr2[0]) || "").trim() !== (arr2[1] || "").trim()) {
                            return false;
                        }
                    } else {

                        if (!el.hasAttribute(idList[i])) {
                            return false;
                        }
                    }

                }
                return true;

            }

            return isIdBl && isClassBl && isTagBl && isAttrBl;
        },

        trim: function (txt) {
            var str = "";
            txt = typeof txt === "string" ? txt : "";
            str = txt.replace(/^\s*|\s*$/img, "");
            return str;
        },

        round: function (value, ratio) {

            if (arguments.length === 1) {

                if (typeof value === "number") {
                    return Math.round(value);
                }

            } else if (arguments.length === 2) {
                if (typeof value === "number" && typeof ratio === "number") {

                    var _v = Math.floor(value);
                    _v = _v + ratio;

                    if (value > _v) {
                        return Math.ceil(value);
                    } else {
                        return Math.floor(value);
                    }

                }

            }

            return null;
        },

        // 检查是否为移动端
        isMobile: function () {

            var userAgentInfo = navigator.userAgent.toString().toLowerCase();
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"
            ];
            //console.log(userAgentInfo)
            var flag = false;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v].toLowerCase()) > 0) {
                    flag = true;
                    break;
                }
            }
            return flag;
		},

		//判断微信
		isweixn() {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) === "micromessenger") {
					return true;
				} else {
					return false;
				}
			},

		/* jsonToDate 
		  /Date(1492048799952)/ 或 1492048799952
		  fmt=("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423 
		  */
        toDate: function (value, fmt) {
            fmt = typeof fmt !== "string" ? "yyyy-MM-dd HH:mm:ss" : fmt;
            var txt = value.toString().replace("/Date(", "").replace(")/", "");
            var times = Number(txt);
            times = isNaN(times) ? new Date(value).getTime() : times;
            var dt = new Date(Number(times.toString()));
            var o = {
                "M+": dt.getMonth() + 1,
                "d+": dt.getDate(),
                "H+": dt.getHours(),
                "m+": dt.getMinutes(),
                "s+": dt.getSeconds(),
                "q+": Math.floor((dt.getMonth() + 3) / 3),
                "S": dt.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length))
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
                }
            }
            return fmt;

        },

        isFunction: function (obj) {
            return typeof obj=== "function";
        },

        isArray: function (obj) {
            return obj.constructor === Array; 
        },

        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },

        max: function (data, fn) {
            data = data || [];
            if (data.constructor !== Array) {
                throw new Error("参数必须是个数组");
            }
            var _array_max;
            var isOne = true;
            if (arguments.length === 1) {

                for (var i = 0; i < data.length; i++) {
                    var _temp = 0;

                    if (typeof data[i] !== "number") {

                        //  is not a number
                        var _num = parseFloat(data[i]);
                        if (isNaN(_num)) {
                            continue;
                        }
                        _temp = _num;

                    } else {

                        //  is a number
                        _temp = data[i];
                    }

                    if (isOne) {
                        _array_max = _temp;
                        isOne = false;

                    } else {
                        // set value number
                        if (_temp > _array_max) {
                            _array_max = _temp;
                        }

                    }

                }
                return _array_max;

            }

            if (arguments.length === 2 && typeof fn === "function") {

                var maxVal = 0;
                for (var i2 = 0; i2 < data.length; i2++) {
                    var _temp2 = 0;
                    var item = data[i2];
                    var v = fn(item);
                    if (typeof v !== "number") {

                        //  is not a number
                        var _num2 = parseFloat(v);
                        if (isNaN(_num2)) {
                            continue;
                        }
                        _temp2 = _num2;

                    } else {

                        //  is a number
                        _temp2 = v;
                    }

                    if (isOne) {
                        maxVal = _temp2;
                        _array_max = item;
                        isOne = false;

                    } else {
                        // set value number
                        if (_temp2 > maxVal) {
                            maxVal = _temp2;
                            _array_max = item;
                        }

                    }

                }
                return _array_max;

            }
        },

        min: function (data, fn) {
            data = data || [];
            if (data.constructor !== Array) {
                throw new Error("参数必须是个数组");
            }
            var _array_min;
            var isOne = true;
            if (arguments.length === 1) {
                for (var i = 0; i < data.length; i++) {
                    var _temp = 0;

                    if (typeof data[i] !== "number") {

                        //  is not a number
                        var _num = Number(data[i]);
                        if (isNaN(_num)) {
                            continue;
                        }
                        _temp = _num;

                    } else {

                        //  is a number
                        _temp = data[i];
                    }

                    if (isOne) {
                        _array_min = _temp;
                        isOne = false;

                    } else {
                        // set value number
                        if (_temp < _array_min) {
                            _array_min = _temp;
                        }

                    }

                }
                return _array_min;
            }

            if (arguments.length === 2 && typeof fn === "function") {
                var minVal = 0;
                for (var i2 = 0; i2 < data.length; i2++) {
                    var _temp2 = 0;
                    var item = data[i2];
                    var v = fn(item);
                    if (typeof v !== "number") {

                        //  is not a number
                        var _num2 = parseFloat(v);
                        if (isNaN(_num2)) {
                            continue;
                        }
                        _temp2 = _num2;

                    } else {

                        //  is a number
                        _temp2 = v;
                    }

                    if (isOne) {
                        minVal = _temp2;
                        _array_min = item;
                        isOne = false;

                    } else {
                        // set value number
                        if (_temp2 < minVal) {
                            minVal = _temp;
                            _array_min = item;
                        }

                    }

                }
                return _array_min;

            }

        },

        proxy: function (fn,obj) {

            return function () {
                if (typeof fn === "function") {
                    fn.apply(obj, arguments);
                }

            };
           

        },

         // 把文本转换成html
        deHtml :function (txt) {
            txt = txt.replace(/&lt;/img, "<").replace(/&gt;/img, ">").replace(/&nbsp;/img, " ");
            return txt;

        },

         // 把html换成文本
        enHtml :function (txt) {
            txt = txt.replace(/</img, "&lt;").replace(/>/img, "&gt;").replace(/\s+/img, "&nbsp;");
            return txt;

        } 

	});

	// 可计算值的列表值
	Mobile.numberList = ["left", "top", "right", "bottom", "width", "height", "max-width", "min-width", "max-height","min-height"
	];

	// 扩展实例方法
    Mobile.fn.extend({

        //each
        each: function (fn) {
            Mobile.each(this, fn);
        },

        // data
        data: function () {

            var arg1 = arguments[0];

            // get 空值返回{}对象
            if (arguments.length === 0) {
                var o;
                Mobile.each(this, function () {
                   
                     o = this.vdata = this.vdata || {};
                  
                    return false;
                });

                return o;

            }

            // get
            if(arguments.length === 1 && typeof arguments[0] === "string") {
                var v;
                Mobile.each(this, function () {

                    var o = this.vdata = this.vdata || {};
                  
                    v = o[arg1];
                   
                    return false;
                });

                return v;

            }

            // set
            if (arguments.length === 2 && typeof arguments[0] === "string") {
                var arg2 = arguments[1];
                Mobile.each(this, function () {

                    var o =this.vdata= this.vdata || {};
                    v = o[arg1] = arg2;
                
                });

                return this;

            }

        },

		// css
		css: function(attr, value) {

			// get  返回第一个一个值
			if (arguments.length === 1 && typeof attr === "string") {

				var _css = "";
				Mobile.each(this, function(i, v) {

					if (window.getComputedStyle) {
						_css = window.getComputedStyle(v, null)[attr.trim()];
						if (Mobile.isEqual(Mobile.numberList, attr.trim())) {
							_css = parseFloat(_css) || 0;
						}
					}
					// ie8
					else if (v.currentStyle) {
						_css = v.currentStyle[attr];
					} else {
						_css = v.style[attr];
					}

					return false;

				});
				return _css;
			}

			// set
			if (arguments.length === 2) {

				Mobile.each(this, function() {
					if (Mobile.isEqual(Mobile.numberList, attr.trim())) {
						this.style[attr.trim()] = Number(value) ? Number(value).toString() + "px" : value;
					} else {
						this.style[attr.trim()] = value;

					}

				});

			}

			//set 对象的值
			if (arguments.length === 1 && typeof attr === "object") {
				Mobile.each(this, function(i, v) {
					for (var _attr in attr) {
						if (Mobile.isEqual(Mobile.numberList, _attr.trim())) {
							this.style[_attr] = Number(attr[_attr]) ? Number(attr[_attr]).toString() + "px" : attr[_attr];
						} else {
							this.style[_attr] = attr[_attr];
						}

					}
				});

			}

			return this;
		},

		// find
		find: function(selector) {
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				var _arr = obj[i].querySelectorAll(selector);
                Mobile.each(_arr, function (i, v) {
                    arr.push(v);
                });
				delete obj[i];
			}
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		// text
		text: function(value) {

			//set 对象的值
			var _text = "";
			if (arguments.length === 0) {
				Mobile.each(this, function() {
					_text += this.innerText;

				});
				return _text;
			}
			if (arguments.length === 1) {
				Mobile.each(this, function() {
					this.innerText = value;
				});
			}
			return this;
		},

		// val
		val: function(value) {

			//set 对象的值
			var _val = "";
			if (arguments.length === 0) {
				Mobile.each(this, function() {
					_val += this.value;

				});
				return _val;
			}
			if (arguments.length === 1) {
				Mobile.each(this, function() {
					this.value = value;
				});
			}
			return this;
		},

		// html
		html: function(value) {

			//set 对象的值
			var _html = "";
			if (arguments.length === 0) {
				Mobile.each(this, function() {
					_html += this.innerHTML;
				});
				return _html;
			}
			if (arguments.length === 1) {
				Mobile.each(this, function() {
					this.innerHTML = value;
				});
			}
			return this;
		},

		// attr
		attr: function(attr, value) {

			// 返回第一个属性值
			if (arguments.length === 1 && typeof attr === "string") {
				var _attr = undefined;
				Mobile.each(this, function() {
					_attr = this.getAttribute(attr);
					if (_attr === null) {
						_attr = undefined;
					}
					return false;
				});
				return _attr;
			}

			if (arguments.length === 2) {

				Mobile.each(this, function() {
					this.setAttribute(attr, value.toString());
				});

			}
			return this;
		},

		// hasAttr
		hasAttr: function(attr) {

			// 是否含有元素的属性
			var _attr = false;
			if (arguments.length === 1 && typeof attr === "string") {

				Mobile.each(this, function() {
					_attr = this.hasAttribute(attr);
					return false;
				});
				return _attr;
			}

		},

		// removeAttr
		removeAttr: function(attr) {

			// 返回第一个属性值
			if (arguments.length === 1 && typeof attr === "string") {

				Mobile.each(this, function() {
					this.removeAttribute(attr);
				});
			}

			return this;
		},

		// addClass
		addClass: function(className) {

			if (typeof className === "string") {
				className = className.split(/\s+/);

			} else {

				return this;
			}

			if (arguments.length === 1) {

				Mobile.each(this, function() {
					for (var y = 0; y < className.length; y++) {
						if (className[y]) {
							this.classList.add(className[y]);
						}

					}
				});

			}

			return this;
		},

		// toggleClass
		toggleClass: function(className) {

			if (typeof className === "string") {
				className = className.split(/\s+/);

			} else {

				return this;
			}

			if (arguments.length === 1) {

				Mobile.each(this, function() {
					for (var y = 0; y < className.length; y++) {
						if (className[y]) {
							if (this.classList.contains(className[y])) {
								this.classList.remove(className[y]);
							} else {
								this.classList.add(className[y]);
							}

						}

					}
				});

			}

			return this;
		},

		//  hasclass
		hasClass: function(className) {
			var ishasClass = false;
			if (arguments.length === 1) {

				Mobile.each(this, function() {
					ishasClass = this.classList.contains(className);
					return false;
				});

			}

			return ishasClass;
		},

		// removeClass
		removeClass: function(className) {

			if (typeof className === "string") {
				className = className.split(/\s+/);

			} else {

				return this;
			}

			if (arguments.length === 1) {

				Mobile.each(this, function() {
					for (var y = 0; y < className.length; y++) {
						if (className[y]) {
							this.classList.remove(className[y]);
						}

					}

				});

			}
			return this;
		},

		// parent 
		parent: function() {
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				var _arr = obj[i].parentElement;
				if (_arr) {
                    arr.push(_arr);
				}
				delete obj[i];
			}
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		// parents 
		parents: function(selector) {
			selector = typeof selector === "string" ? $.trim( selector) : "";
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {

				var p = _searchParents(obj[i], function(elm) {
					return Mobile.checkSelector(elm, selector);
				});

				delete obj[i];
				if (p) {
					arr.push(p);

				}

			}
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		// closest
		closest: function(selector) {
			selector = typeof selector === "string" ? $.trim( selector)  : "";
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				var p;
				if (Mobile.checkSelector(obj[i], selector)) {
					arr.push(obj[i]);
				} else {
					p = _searchParents(obj[i], function(elm) {
						return Mobile.checkSelector(elm, selector);
					});
				}
				delete obj[i];
				if (p) {
					arr.push(p);
				}
            }

			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		// get return native dom 
		get: function(index) {
			if (typeof index !== "number") {
                throw Error("index property must is number type");
			}

            if (index >= this.length) {
                return undefined;
				//throw Error("number  value max object length ");
			}

			return this[index];
		},

		// eq 
		eq: function(index) {
			if (typeof index !== "number") {
				throw Error("index property must is number type")
			}
			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				if (i === index) {
					arr.push(obj[i])
				}
				delete obj[i];
			}
			delete obj.length;

			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  first
		first: function() {

			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				if (i === 0) {
					arr.push(obj[i])
				}
				delete obj[i];
			}
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  prev
		prev: function() {
			var arr = [];
			var obj = m(this);
			Mobile.each(obj, function(i, v) {
				var _prev = v.previousElementSibling;
				if (_prev) {
                    arr.push(_prev);
				}
				delete v[i];
			});
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  next
		next: function() {
			var arr = [];
			var obj = m(this);
			Mobile.each(obj, function(i, v) {
				var _next = v.nextElementSibling;
				if (_next) {
                    arr.push(_next);
				}
				delete v[i];
			});
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  siblings
		siblings: function() {
			var arr = [];
			var obj = m(this);
			Mobile.each(obj, function(i, v) {
                var _children =v.parentElement&&v.parentElement.children||[];
				var _index = m(v).index();

				for (var y = 0; y < _children.length; y++) {
					if (y !== _index) {
						arr.push(_children[y]);
					}
				}
				delete v[i];
			});
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  last
		last: function() {

			var arr = [];
			var obj = m(this);
			for (var i = 0; i < obj.length; i++) {
				var _length = (obj.length > 0) ? obj.length - 1 : 0;
				if (i === _length) {
                    arr.push(obj[i]);
				}
				delete obj[i];
			}
			delete obj.length;
			Array.prototype.push.apply(obj, arr);
			return obj;
		},

		//  heigth 根据box-sizing去获取 默认content-box
		height: function() {

			if (arguments.length === 0) {
				var _h = 0;
				Mobile.each(this, function(i, v) {

					// window

					if (this === window) {
						_h = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
					} else if (this === document) {
						_h = m(document.documentElement).css("height"); //document.documentElement.offsetHeight;
					} else {
						_h = m(this).css("height");
					}
					_h = parseFloat(_h);

					return false;

				});
				return _h;
			}

			// set
			else if (arguments.length === 1) {
				var _value = arguments[0]
				Mobile.each(this, function() {
					m(this).css("height", _value);

				});
			}
			return this;
		},

		//  clientHeight  垂直方向 height + 上下padding
		innerHeight: function() {

			if (arguments.length === 0) {
				var _h = 0;
				Mobile.each(this, function(i, v) {

					// window

					if (this === window) {
						_h = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
					} else if (this === document) {
						_h = m(document.documentElement).css("height"); //document.documentElement.offsetHeight;
					} else {
						_h = m(this).eq(0) && m(this).eq(0)[0].clientHeight;
					}
					_h = parseFloat(_h);

					return false;

				});
				return _h;
			}

			return this;
		},

		//  outerHeight 垂直方向 height + 上下padding + 上下border-width
		outerHeight: function() {

			if (arguments.length === 0) {
				var _h = 0;
				Mobile.each(this, function(i, v) {

					// window

					if (this === window) {
						_h = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
					} else if (this === document) {
						_h = m(document.documentElement).eq(0) && m(document.documentElement).eq(0)[0].offsetHeight; //document.documentElement.offsetHeight;
					} else {
						_h = m(this).eq(0) && m(this).eq(0)[0].offsetHeight;
					}
					_h = parseFloat(_h);

					return false;

				});
				return _h;
			}


			return this;
		},

		//  width 根据box-sizing去获取 默认content-box
		width: function() {

			// get
			if (arguments.length === 0) {
				var _w = 0;
				Mobile.each(this, function() {

					// window
					if (this === window) {

						_w = window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth;
					} else if (this === document) {
						_w = m(document.documentElement).css("width"); //document.documentElement.offsetWidth;

					} else {
						_w = m(this).css("width");
					}
					_w = parseFloat(_w);
					return false;

				});

				return _w;

			}

			// set
			else if (arguments.length === 1) {
                var _value = arguments[0];
				Mobile.each(this, function() {
					m(this).css("width", _value);

				});
			}

			return this;
		},

		//  clientWidth  水平方向 width + 左右padding
		innerWidth: function() {

			// get
			if (arguments.length === 0) {
				var _w = 0;
				Mobile.each(this, function() {

					// window
					if (this === window) {

						_w = window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth;
					} else if (this === document) {
						_w = m(document.documentElement).css("width"); //document.documentElement.offsetWidth;

					} else {
						_w = m(this).eq(0) && m(this).eq(0)[0].clientWidth;
					}
					_w = parseFloat(_w);
					return false;

				});

				return _w;

			}

			return this;
		},

		//  outWidth 水平方向 width + 左右padding + 左右border-width
		outerWidth: function() {

			if (arguments.length === 0) {
				var _w = 0;
				Mobile.each(this, function() {

					// window
					if (this === window) {
						_w = window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth;
					} else if (this === document) {
						_w = m(document.documentElement).eq(0) && m(document.documentElement).eq(0)[0].offsetWidth; //document.documentElement.offsetWidth;

					} else {
						_w = m(this).eq(0) && m(this).eq(0)[0].offsetWidth;

					}
					_w = parseFloat(_w);

					return false;

				});

				return _w;

			}

			return this;
		},

		//  scroll 区域的高度 
		scrollHeight: function() {

			// get
			var _h = 0;
			if (arguments.length === 0) {
				Mobile.each(this, function() {

					_h = m(this).eq(0) && m(this).eq(0)[0].scrollHeight;
					return false;
				});
			}

			return _h;
		},

		//  scroll 区域的宽度 
		scrollWidth: function() {

			// get
			var _w = 0;
			if (arguments.length === 0) {
				Mobile.each(this, function() {

					_w = m(this).eq(0) && m(this).eq(0)[0].scrollWidth;
					return false;
				});
			}

			return _w;
		},

		// getBoundingClientRect() 用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left,width,heigth
		rect: function() {

			// get
			var o = {};
			if (arguments.length === 0) {

				Mobile.each(this, function() {

					if (this === window || this === document) {
						o = {};
					} else {
						o = m(this).eq(0) && m(this).eq(0)[0].getBoundingClientRect();
					}

					return false;

				});
			}

			return o;

		},


		// offsetTop  获取当前元素到 定位父节点 的top方向的距离
		offsetTop: function() {
			var _top = 0;
			Mobile.each(this, function() {
				_top = this.offsetTop;
				return false;
			});
			return _top;
		},

		// offsetLeft  获取当前元素到 定位父节点 的left方向的距离
		offsetLeft: function() {
			var _left = 0;
			Mobile.each(this, function() {
				_left = this.offsetLeft;

			});
			return _left;
		},

		// offset
		offset: function() {
			var obj = {};
			Mobile.each(this, function() {
				obj.left = this.offsetLeft;
				obj.top = this.offsetTop;

			});
			return obj;
		},

		// index
		index: function(obj) {
			var _index = -1;
			if (arguments.length === 0) {
				Mobile.each(this, function(index, v) {
					if (v.parentElement) {
						var els = v.parentElement.children;
						for (var i = 0; i < els.length; i++) {
							if (els[i].isEqualNode(v)) {
								_index = i;
							}
						}
					}

					return false;
				});
			}

			return _index;
		},

		//  remove
		remove: function() {
			var arr = [];
			var $this = this;
			Mobile.each(this, function(index, v) {
				if (v.parentElement) {
					var els = this.parentElement;
					var _indexObj = els.removeChild(this);
					arr.push(_indexObj);
				}
                delete $this[index];
			});

			Array.prototype.push.apply(this, arr);
			return this;
		},

		//  append
		append: function(obj) {
			if (typeof obj === "object" && obj.length && obj.length > 0) {
				Mobile.each(this, function() {
					for (var i = 0; i < obj.length; i++) {
						this.appendChild(obj[i]);
					}
				});
			} else if (typeof obj === "string") {
				Mobile.each(this, function() {
					this.innerHTML += obj;

				});

			} else {
				Mobile.each(this, function() {
					this.appendChild(obj);
				});
			}

			return this;
		},

		//  prepend
		prepend: function(obj) {
			if (typeof obj === "object" && obj.length && obj.length > 0) {
				Mobile.each(this, function() {
					for (var i = obj.length; i > 0; i--) {
						this.insertBefore(obj[i - 1], this.childNodes[0]);
					}
				});
			} else if (typeof obj === "string") {
				var els = Mobile.htmlStringToDOM(obj);
				Mobile.each(this, function() {
					this.insertBefore(els, this.childNodes[0]);
				});

			} else {
				Mobile.each(this, function() {
					this.insertBefore(obj, this.childNodes[0]);
				});
			}

			return this;
		},

		//  clone
		clone: function(obj) {
			var _obj;
			Mobile.each(this, function() {
				_obj = this.cloneNode(true);
				return false;
			});
			return _obj;
        },


	});

	// 动画
    Mobile.fn.extend({

        // show
        show: function (_showType) {

            Mobile.each(this, function (i, el) {

                var _showType = _showType ? _showType : "block";
                $(this).data("display-type", true);
                this.style.display = _showType;


            });
            return this;

        },

        // hide
        hide: function (_showType) {

            Mobile.each(this, function (i, el) {

                var _showType = _showType ? _showType : "none";
                $(this).data("display-type", false);
                this.style.display = _showType;


            });
            return this;
        },

        // toggle
        toggle: function () {

            Mobile.each(this, function () {

                var displayType = $(this).data("display-type");
                if (displayType) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
            return this;
        },

        //  windowTop
        windowTop: function (y, time) {

            // get
            if (arguments.length === 0) {
                return parseFloat(window.pageYOffset) || 0;
            }

            Mobile.each(this, function () {
                if (this === window || this === document) {
                    _scrollTop(this, y, time);
                } else {
                    throw new Error("windowTop() function with element must is window or document ");
                }

                return false;
            });
            return this;
        },

        //  scrollTop
        scrollTop: function (y, time) {

            // get
            if (arguments.length === 0) {
                var _size = 0;
                Mobile.each(this, function () {
                    if (this === window || this === document) {
                        _size = window.pageYOffset || 0;
                    } else {
                        _size = this.scrollTop;
                    }
                    return false;
                });
                return _size;
            } else {
                Mobile.each(this, function () {
                    _scrollTop(this, y, time);
                });

                return this;
            }
        },

        //  scrollLeft
        scrollLeft: function (x, time) {

            // get
            if (arguments.length === 0) {
                var _size = 0;
                Mobile.each(this, function () {
                    if (this === window || this === document) {
                        _size = window.pageXOffset || 0;
                    } else {
                        _size = this.scrollLeft;
                    }
                    return false;
                });
                return _size;
            } else {
                Mobile.each(this, function () {
                    _scrollLeft(this, x, time);
                });


                return this;
            }
        },

        // stop 

        stop: function () {
            Mobile.each(this, function () {
                var clearTimeId = this.clearTimeId || 0;
                clearInterval(clearTimeId);

            });

            return this;
        }
      
	});

	// 绑定事件
	Mobile.fn.extend({

        on: function (type) {

            // tap是tuochstart,tuochmove,tuochend 集合封装
            if (type === "tap") {
                var tapAarrs = [];
                for (var i = 0; i < arguments.length; i++) {
                    if (i !== 0) {
                        tapAarrs.push(arguments[i]);
                    }
                }
             
                this.tap.apply(this, tapAarrs);
                return;
            }

			var $this = this;
			var isonebind = $this.length > 0 && $this.bindOneElementEvent ? true : false; // m(el).one()只绑定一次事件
			var handler = function() {};
			var bl = false;
            var obj = null;
			var el = "";

			//  正常事件绑定
            function f(event) {
                if (type === "input") {
                   // delete event.data;
                    Object.defineProperty(event, 'data', {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: obj
                    });
                   
                }

                if (obj) {
                   
					event.data = obj;
				}

				var props=[];
				var detail=typeof event.detail ==="undefined"?{}:event.detail;
				props.push(event);

                if (detail&&detail.length){
					for(var i=0;i<detail.length;i++){
						props.push(detail[i]);
					}

				}else{
					props.push(detail);
				}

				handler.apply(this, props);

				// m(el).one()只绑定一次事件
				if (isonebind) {
					m(this).off(type, f, bl);
					m.events.on(type, f);
					$this.bindOneElementEvent = false;
				}
			}

			// 委托事件绑定
            function f2(event) {

                var entrustObj = m(event.target).closest(el).get(0); //委托对象
                if (entrustObj) {
                 
                    if (type === "input") {
                        //delete event.data;
                        Object.defineProperty(event, 'data', {
                            enumerable: true,
                            configurable: true,
                            writable: true,
                            value: obj
                        });

                    }
					if (obj) {
						event.data = obj;
					}
					
					var props=[];
					var detail=event.detail;
					props.push(event);
	
					if(detail.length){
						for(var i=0;i<detail.length;i++){
							props.push(detail[i]);
						}
	
					}else{
						props.push(detail);
                    }
                   
                    handler.apply(entrustObj, props);

					// m(el).one()只绑定一次事件
					if (isonebind) {
						m(this).off(type, f2, bl);
						m.events.on(type, f2);
						$this.bindOneElementEvent = false;
					}
				}
			}

			// 正常绑定事件
			if (arguments.length >= 2 && typeof arguments[1] === "function") {
				handler = arguments[1] || function() {};
				bl = typeof arguments[2] === "boolean" ? arguments[2] : false;

				Mobile.each(this, function() {
					if (this.addEventListener) {
						this.addEventListener(type, m.proxy(f,this), bl);
					}
					//ie8
					//else if(this.attachEvent) {
					//	this.attachEvent("on" + type, f, bl)
					//} else {
					//	this["on" + type] =f /*直接赋给事件*/
					//}
				});

				m.events.on(type, f);
			}

			// 正常绑定事件传object值
			if (arguments.length >= 3 && typeof arguments[1] === "object" && typeof arguments[2] === "function") {
				obj = arguments[1];
				handler = arguments[2] || function() {};
				bl = typeof arguments[3] === "boolean" ? arguments[3] : false;

				Mobile.each(this, function() {
					if (this.addEventListener) {
                        this.addEventListener(type, m.proxy(f, this), bl);
					}

				});

				m.events.on(type, f);
			}

			// 委托绑定事件
			if (arguments.length >= 3 && typeof arguments[1] === "string" && typeof arguments[2] === "function") {
				el = arguments[1].toString() || "";
				handler = arguments[2] || function() {};
				bl = typeof arguments[3] === "boolean" ? arguments[3] : false;

				Mobile.each(this, function() {
                    if (this.addEventListener) {
                     
                        this.addEventListener(type, m.proxy(f2, this), bl);
					}
				});

				m.events.on(type, f2);
			}

			// 委托绑定事件传object值
			if (arguments.length >= 4 && typeof arguments[1] === "string" && typeof arguments[2] === "object" && typeof arguments[3] === "function") {
				el = arguments[1].toString() || "";
				obj = arguments[2];
				handler = arguments[3] || function() {};
				bl = typeof arguments[4] === "boolean" ? arguments[4] : false;


				Mobile.each(this, function() {
					if (this.addEventListener) {
                        this.addEventListener(type, m.proxy(f2, this), bl);
					}
				});

				m.events.on(type, f2);
			}

			return this;

		},

		off: function(type, handler) {

			if (arguments.length === 1) {
				Mobile.each(this, function() {
					for (var i = m.events.props[type].length - 1; i >= 0; i--) {

						if (this.removeEventListener) {
							this.removeEventListener(type, m.events.props[type][i], false);
						} else {
							this.deattachEvent("on" + type, m.events.props[type][i]);
						}

						Mobile.events.off(type, m.events.props[type][i]);
					}
				});

				return;
			}
			Mobile.each(this, function() {
				if (this.removeEventListener)
					this.removeEventListener(type, handler, false);
				else if (this.deattachEvent) { /*IE*/
					this.deattachEvent('on' + type, handler);
				} else {

					// 直接赋给事件
					this["on" + type] = null;

				}
				Mobile.events.off(type, handler);
			});

			return this;

		},

		// trigger
		trigger: function(type, obj) {
			
            Mobile.each(this, function () {
                try {
                    var btnEvent = document.createEvent("CustomEvent");
                    btnEvent.initCustomEvent(type, true, false, obj);
                    this.dispatchEvent(btnEvent);
                }
                catch(ex){
                    console.log(ex);
                }
			});

		},

		// emit
		emit: function(type, obj) {
			Mobile.each(this, function() {
				m(this).trigger(type, obj);
			});
		},

		//  only bind one event
		one: function() {
			var args = arguments;
			var $this = this;
			this.bindOneElementEvent = true;
			Mobile.each($this, function(i, v) {
				m(this).on.apply($this, args);

			});
		},

		// click
		click: function(fn, bl) {

			if (arguments.length === 0) {
				Mobile.each(this, function() {
					this.click(); // 原生触发
				});
				return this;
			}

			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("click", fn, bl);
			});
		},

		// dblclick
		dblclick: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("dblclick", fn, bl);
			});
		},

		//  blur
		blur: function(fn, bl) {
			if (arguments.length === 0) {
				$(this).each(function() {
					this.blur(); // 原生触发

				});
				return this;
			}

			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("blur", fn, bl);
			});
		},

		// focus
		focus: function(fn, bl) {
			if (arguments.length === 0) {
				$(this).each(function() {
					this.focus(); // 原生触发

				});
				return this;
			}
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("focus", fn, bl);
			});
		},

		// touchstart
		touchstart: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("touchstart", fn, bl);
			});
		},

		// touchmove
		touchmove: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("touchmove", fn, bl);
			});
		},

		// touchend
		touchend: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("touchend", fn, bl);
			});
		},

		// touchcancel
		touchcancel: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("touchcancel", fn, bl);
			});
		},

		// touchend 和 touchcancel 
		touchendcancel: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("touchend", fn, bl);
				m(this).on("touchcancel", fn, bl);
			});
		},

		// window cancel event
		windowcancel: function(fn) {
			var $this = this[0] || {};
			m(window).on("touchstart", function(event) {

				m(event.target).one("touchend", function(event) {
					fn.call($this, event);

				});

			});
		},

		// tap
		tap: function() {
			var args = arguments;
			var fn = function() {};
			var deletage = "";
			var bl = false;

			Mobile.each(this, function(i, v) {

				var isMOve = true; // 判断是否往上拖动
				var isMOveFirst = true;

				var startX = 0;
				var startY = 0;
				var isDeleDageTarget = true; // 是否是委托事件

				function start(event) {
					
					isMOve = true;
					isMOveFirst = true;
					var touch = event.changedTouches[0];
					startX = touch.clientX;
                    startY = touch.clientY;

                    if (event.touches.length > 1) {
                        isMOve = false;
                        isMOveFirst = false;
                       
                    } else {
                        isMOve = true;
                        isMOveFirst = true;
                    }
				}

				function move(event) {
			
					var touch = event.changedTouches[0];
					var nowX = touch.clientX;
					var nowY = touch.clientY;
					var _x = Math.abs(nowX - startX);
					var _y = Math.abs(nowY - startY);
					if ((_x > 1 || _y > 1) && isMOveFirst) {
						isMOve = false;
						isMOveFirst = false;
					}
				}

				function end(event) {
					
					var _target;
					if (isDeleDageTarget) {
						_target = this;
					} else {
                        _target = m(event.target).closest(deletage).get(0); //委托对象
                    }
                 
					if (isMOve) {
						if (typeof fn === "function") {
							fn.call(_target, event);
						}
					}
				}

				// 使用事件	
				if (args.length >= 1 && typeof args[0] === "function") {
					fn = args[0];
					bl = args[1] || false;
                    isDeleDageTarget = true;

					m(this).on("touchstart", start, bl);
					m(this).on("touchmove", move, bl);
					m(this).on("touchend", end, bl);
				}

				// 使用委托事件	
				else if (args.length >= 2 && typeof args[0] === "string" && typeof args[1] === "function") {
					deletage = args[0];
					fn = args[1];
					bl = args[2] || false;
                    isDeleDageTarget = false;

					m(this).on("touchstart", deletage, start, bl);
					m(this).on("touchmove", deletage, move, bl);
					m(this).on("touchend", deletage, end, bl);
				}

				// 使用事件data		
				else if (args.length >= 2 && typeof args[0] === "object" && typeof args[1] === "function") {
					fn = args[1];
					bl = args[2] || false;
					var obj = args[0];
                    isDeleDageTarget = true;

					m(this).on("touchstart", obj, start, bl);
					m(this).on("touchmove", obj, move, bl);
					m(this).on("touchend", obj, end, bl);
				}

				// 使用委托事件传值data	
				else if (args.length >= 3 && typeof args[0] === "string" && typeof args[1] === "object" && typeof args[2] ===
					"function") {
					deletage = args[0];
					var obj2 = args[1];
					fn = args[2];
					bl = args[3] || false;
					isDeleDageTarget = false;

					m(this).on("touchstart", deletage, obj2, start, bl);
					m(this).on("touchmove", deletage, obj2, move, bl);
					m(this).on("touchend", deletage, obj2, end, bl);
				}

			});
		},

		// scroll
		scroll: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("scroll", fn, bl);
			});
		},

		// resize
		resize: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("resize", fn, bl);
			});
		},

		// change
		change: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("change", fn, bl);
			});
		},

		// keyup
		keyup: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("keyup", fn, bl);
			});
		},

		// keyup
		keydown: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("keydown", fn, bl);
			});
		},

		// keypress
		keypress: function(fn, bl) {
			bl = bl || false;
			Mobile.each(this, function() {
				m(this).on("keypress", fn, bl);
			});
		}
	});

	// 自定义事件列表
	Mobile.extend({
		events: {
			props: {},

			// bind events
			on: function(eventName, fn) {
				this.props[eventName] = this.props[eventName] || [];
				this.props[eventName].push(fn);
			},
			off: function(eventName, fn) {
				if (arguments.length === 1) {

					this.props[eventName] = [];

				} else if (arguments.length === 2) {
					var $events = this.props[eventName] || [];
					for (var i = 0; i < $events.length; i++) {
						if ($events[i] === fn) {
							$events.splice(i, 1);
							break;
						}

					}

				}

			}
		}
	});

	return Mobile;

});

