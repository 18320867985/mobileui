(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var mobileDom = createCommonjsModule(function (module) {
	/*
  *	移动端 公共类库 IE10+
  * 作者：hqs
  */

	(function (global, factory) {

		//  cmd commonjs
		{
			module.exports = factory(global);
		}
	})(typeof window !== "undefined" ? window : commonjsGlobal, function (window) {

		var _mobile = window.mobile,
		    _m = window.m,
		    _$ = window.$;

		// 创建mobile对象
		window.Mobile = window.$ = window.m = window.mobile = function (selector, context) {

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
			} catch (ex) {
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
			speed = speed2 / time * fx;

			if (windowStartTop > y) {

				self.clearTimeId = setInterval(function () {
					windowStartTop = windowStartTop - speed;
					isElement ? self.scrollTop = windowStartTop : window.scrollTo(0, windowStartTop);
					//	console.log("scrolltop")
					if (windowStartTop - speed <= y) {
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
				self.clearTimeId = setInterval(function () {
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

			var windowStartLeft = (isElement ? self.scrollLeft : parseFloat(window.pageXOffset)) || 0;
			var speed2 = Math.abs(windowStartLeft - x);
			speed = speed2 / time * fx;

			if (windowStartLeft > x) {

				self.clearTimeId = setInterval(function () {
					windowStartLeft = windowStartLeft - speed;
					isElement ? self.scrollLeft = windowStartLeft : window.scrollTo(windowStartLeft, 0);
					//	console.log("scrolltop")
					if (windowStartLeft - speed <= x) {
						// stop
						isElement ? self.scrollLeft = x : window.scrollTo(x, 0);
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
					isElement ? self.scrollLeft = windowStartLeft : window.scrollTo(windowStartLeft, 0);
					//console.log("scrolltop");
					if (windowStartLeft + speed > x) {
						// stop
						isElement ? self.scrollLeft = x : window.scrollTo(x, 0);
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

				if (_typeof(parentObj[prop]) === "object" && parentObj[prop] !== null) {

					childObj[prop] = parentObj[prop].constructor === Array ? [] : {};
					_extendDeep(parentObj[prop], childObj[prop]);
				} else {
					childObj[prop] = parentObj[prop];
				}
			}
			return childObj;
		}

		// 原型-prototype
		Mobile.fn = Mobile.prototype = {

			init: function init(selector, content) {

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
					} else if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) === "object") {

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
							} else if (selector.nodeType === Node.ELEMENT_NODE || selector.nodeType === Node.DOCUMENT_NODE || selector === window) {
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
					} else if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === "object" && typeof selector === "string") {
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
		Mobile.extend = Mobile.fn.extend = function (deep, obj) {

			// mobile extend
			if (deep.constructor === Object && arguments.length === 1) {
				_extend(deep, this);
				return this;
			}
			// mobile extend deeply
			if (deep.constructor === Boolean && arguments.length === 2 && obj.constructor === Object) {
				if (deep) {
					_extendDeep(obj, this);
				} else {
					_extend(deep, this);
				}
				return this;
			}

			//  Object extend
			var i, item;
			if (deep.constructor === Object && arguments.length >= 2) {

				for (i = 1; i < arguments.length; i++) {

					item = arguments[i];
					if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object") {
						_extend(item, deep);
					}
				}

				return deep;
			}

			//  Object extend deeply
			if (deep.constructor === Boolean && arguments.length >= 3 && obj.constructor === Object) {

				for (i = 2; i < arguments.length; i++) {

					item = arguments[i];

					if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object") {
						if (deep) {
							_extendDeep(item, obj);
						} else {
							_extend(item, obj);
						}
					}
				}

				return obj;
			}
		};

		// 扩展静态方法
		Mobile.extend({

			noCoflict: function noCoflict(deep) {
				window.$ = _$;
				window.m = _m;
				if (deep) {
					window.mobile = _mobile;
				}

				return Mobile;
			},

			each: function each(els, fn) {
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

			ready: function ready(fn) {

				if (typeof fn === "function") {
					window.addEventListener("load", fn);
				}
				return;
			},

			// 列表项和子项的匹配	
			isEqual: function isEqual(list, item) {
				list = list || [];
				for (var i = 0; i < list.length; i++) {

					if (list[i] === item) {
						return true;
					}
				}

				return false;
			},

			// html字符串转dom对象
			htmlStringToDOM: function htmlStringToDOM(txt) {

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

			checkSelector: function checkSelector(el, txt) {
				if (!el) {
					return false;
				}
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

			trim: function trim(txt) {
				var str = "";
				txt = typeof txt === "string" ? txt : "";
				str = txt.replace(/^\s*|\s*$/img, "");
				return str;
			},

			round: function round(value, ratio) {

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
			isMobile: function isMobile() {

				var userAgentInfo = navigator.userAgent.toString().toLowerCase();
				var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
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
			isWeixn: function isWeixn() {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) === "micromessenger") {
					return true;
				} else {
					return false;
				}
			},

			//ios终端
			isIos: function isIos() {

				var u = navigator.userAgent;
				return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			},
			//android终端
			isAdr: function isAdr() {

				var u = navigator.userAgent;
				return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端

			},

			/* jsonToDate 
     /Date(1492048799952)/ 或 1492048799952
     fmt=("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423 
     */
			toDate: function toDate(value, fmt) {
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
					fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
				}
				for (var k in o) {
					if (new RegExp("(" + k + ")").test(fmt)) {
						fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
					}
				}
				return fmt;
			},

			isFunction: function isFunction(obj) {
				return typeof obj === "function";
			},

			isArray: function isArray(obj) {
				return obj.constructor === Array;
			},

			isEmptyObject: function isEmptyObject(obj) {
				var name;
				for (name in obj) {
					return false;
				}
				return true;
			},

			max: function max(data, fn) {
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

			min: function min(data, fn) {
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

			proxy: function proxy(fn, obj) {

				return function () {
					if (typeof fn === "function") {
						fn.apply(obj, arguments);
					}
				};
			},

			// 把文本转换成html
			deHtml: function deHtml(txt) {
				txt = txt.replace(/&lt;/img, "<").replace(/&gt;/img, ">").replace(/&nbsp;/img, " ");
				return txt;
			},

			// 把html换成文本
			enHtml: function enHtml(txt) {
				txt = txt.replace(/</img, "&lt;").replace(/>/img, "&gt;").replace(/\s+/img, "&nbsp;");
				return txt;
			}

		});

		// 可计算值的列表值
		Mobile.numberList = ["left", "top", "right", "bottom", "width", "height", "max-width", "min-width", "max-height", "min-height"];

		// 扩展实例方法
		Mobile.fn.extend({

			//each
			each: function each(fn) {
				Mobile.each(this, fn);
			},

			// data
			data: function data() {

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
				if (arguments.length === 1 && typeof arguments[0] === "string") {
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

						var o = this.vdata = this.vdata || {};
						v = o[arg1] = arg2;
					});

					return this;
				}
			},

			// css
			css: function css(attr, value) {

				// get  返回第一个一个值
				if (arguments.length === 1 && typeof attr === "string") {

					var _css = "";
					Mobile.each(this, function (i, v) {

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

					Mobile.each(this, function () {
						if (Mobile.isEqual(Mobile.numberList, attr.trim())) {
							this.style[attr.trim()] = Number(value) ? Number(value).toString() + "px" : value;
						} else {
							this.style[attr.trim()] = value;
						}
					});
				}

				//set 对象的值
				if (arguments.length === 1 && (typeof attr === 'undefined' ? 'undefined' : _typeof(attr)) === "object") {
					Mobile.each(this, function (i, v) {
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
			find: function find(selector) {
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
			text: function text(value) {

				//set 对象的值
				var _text = "";
				if (arguments.length === 0) {
					Mobile.each(this, function () {
						_text += this.innerText;
					});
					return _text;
				}
				if (arguments.length === 1) {
					Mobile.each(this, function () {
						this.innerText = value;
					});
				}
				return this;
			},

			// val
			val: function val(value) {

				//set 对象的值
				var _val = "";
				if (arguments.length === 0) {
					Mobile.each(this, function () {
						_val += this.value;
					});
					return _val;
				}
				if (arguments.length === 1) {
					Mobile.each(this, function () {
						this.value = value;
					});
				}
				return this;
			},

			// html
			html: function html(value) {

				//set 对象的值
				var _html = "";
				if (arguments.length === 0) {
					Mobile.each(this, function () {
						_html += this.innerHTML;
					});
					return _html;
				}
				if (arguments.length === 1) {
					Mobile.each(this, function () {
						this.innerHTML = value;
					});
				}
				return this;
			},

			// attr
			attr: function attr(_attr2, value) {

				// 返回第一个属性值
				if (arguments.length === 1 && typeof _attr2 === "string") {
					var _attr = undefined;
					Mobile.each(this, function () {
						_attr = this.getAttribute(_attr2);
						if (_attr === null) {
							_attr = undefined;
						}
						return false;
					});
					return _attr;
				}

				if (arguments.length === 2) {

					Mobile.each(this, function () {
						this.setAttribute(_attr2, value.toString());
					});
				}
				return this;
			},

			// hasAttr
			hasAttr: function hasAttr(attr) {

				// 是否含有元素的属性
				var _attr = false;
				if (arguments.length === 1 && typeof attr === "string") {

					Mobile.each(this, function () {
						_attr = this.hasAttribute(attr);
						return false;
					});
					return _attr;
				}
			},

			// removeAttr
			removeAttr: function removeAttr(attr) {

				// 返回第一个属性值
				if (arguments.length === 1 && typeof attr === "string") {

					Mobile.each(this, function () {
						this.removeAttribute(attr);
					});
				}

				return this;
			},

			// addClass
			addClass: function addClass(className) {

				if (typeof className === "string") {
					className = className.split(/\s+/);
				} else {

					return this;
				}

				if (arguments.length === 1) {

					Mobile.each(this, function () {
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
			toggleClass: function toggleClass(className) {

				if (typeof className === "string") {
					className = className.split(/\s+/);
				} else {

					return this;
				}

				if (arguments.length === 1) {

					Mobile.each(this, function () {
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
			hasClass: function hasClass(className) {
				var ishasClass = false;
				if (arguments.length === 1) {

					Mobile.each(this, function () {
						ishasClass = this.classList.contains(className);
						return false;
					});
				}

				return ishasClass;
			},

			// removeClass
			removeClass: function removeClass(className) {

				if (typeof className === "string") {
					className = className.split(/\s+/);
				} else {

					return this;
				}

				if (arguments.length === 1) {

					Mobile.each(this, function () {
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
			parent: function parent() {
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
			parents: function parents(selector) {
				selector = typeof selector === "string" ? $.trim(selector) : "";
				var arr = [];
				var obj = m(this);
				for (var i = 0; i < obj.length; i++) {

					var p = _searchParents(obj[i], function (elm) {
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
			closest: function closest(selector) {
				selector = typeof selector === "string" ? $.trim(selector) : "";
				var arr = [];
				var obj = m(this);
				for (var i = 0; i < obj.length; i++) {
					var p;
					if (Mobile.checkSelector(obj[i], selector)) {
						arr.push(obj[i]);
					} else {
						p = _searchParents(obj[i], function (elm) {
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
			get: function get$$1(index) {
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
			eq: function eq(index) {
				if (typeof index !== "number") {
					throw Error("index property must is number type");
				}
				var arr = [];
				var obj = m(this);
				for (var i = 0; i < obj.length; i++) {
					if (i === index) {
						arr.push(obj[i]);
					}
					delete obj[i];
				}
				delete obj.length;

				Array.prototype.push.apply(obj, arr);
				return obj;
			},

			//  first
			first: function first() {

				var arr = [];
				var obj = m(this);
				for (var i = 0; i < obj.length; i++) {
					if (i === 0) {
						arr.push(obj[i]);
					}
					delete obj[i];
				}
				delete obj.length;
				Array.prototype.push.apply(obj, arr);
				return obj;
			},

			//  prev
			prev: function prev() {
				var arr = [];
				var obj = m(this);
				Mobile.each(obj, function (i, v) {
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
			next: function next() {
				var arr = [];
				var obj = m(this);
				Mobile.each(obj, function (i, v) {
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
			siblings: function siblings() {
				var arr = [];
				var obj = m(this);
				Mobile.each(obj, function (i, v) {
					var _children = v.parentElement && v.parentElement.children || [];
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
			last: function last() {

				var arr = [];
				var obj = m(this);
				for (var i = 0; i < obj.length; i++) {
					var _length = obj.length > 0 ? obj.length - 1 : 0;
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
			height: function height() {

				if (arguments.length === 0) {
					var _h = 0;
					Mobile.each(this, function (i, v) {

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
						var _value = arguments[0];
						Mobile.each(this, function () {
							m(this).css("height", _value);
						});
					}
				return this;
			},

			//  clientHeight  垂直方向 height + 上下padding
			innerHeight: function innerHeight() {

				if (arguments.length === 0) {
					var _h = 0;
					Mobile.each(this, function (i, v) {

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
			outerHeight: function outerHeight() {

				if (arguments.length === 0) {
					var _h = 0;
					Mobile.each(this, function (i, v) {

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
			width: function width() {

				// get
				if (arguments.length === 0) {
					var _w = 0;
					Mobile.each(this, function () {

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
						Mobile.each(this, function () {
							m(this).css("width", _value);
						});
					}

				return this;
			},

			//  clientWidth  水平方向 width + 左右padding
			innerWidth: function innerWidth() {

				// get
				if (arguments.length === 0) {
					var _w = 0;
					Mobile.each(this, function () {

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
			outerWidth: function outerWidth() {

				if (arguments.length === 0) {
					var _w = 0;
					Mobile.each(this, function () {

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
			scrollHeight: function scrollHeight() {

				// get
				var _h = 0;
				if (arguments.length === 0) {
					Mobile.each(this, function () {

						_h = m(this).eq(0) && m(this).eq(0)[0].scrollHeight;
						return false;
					});
				}

				return _h;
			},

			//  scroll 区域的宽度 
			scrollWidth: function scrollWidth() {

				// get
				var _w = 0;
				if (arguments.length === 0) {
					Mobile.each(this, function () {

						_w = m(this).eq(0) && m(this).eq(0)[0].scrollWidth;
						return false;
					});
				}

				return _w;
			},

			// getBoundingClientRect() 用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left,width,heigth
			rect: function rect() {

				// get
				var o = {};
				if (arguments.length === 0) {

					Mobile.each(this, function () {

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
			offsetTop: function offsetTop() {
				var _top = 0;
				Mobile.each(this, function () {
					_top = this.offsetTop;
					return false;
				});
				return _top;
			},

			// offsetLeft  获取当前元素到 定位父节点 的left方向的距离
			offsetLeft: function offsetLeft() {
				var _left = 0;
				Mobile.each(this, function () {
					_left = this.offsetLeft;
				});
				return _left;
			},

			// offset
			offset: function offset() {
				var obj = {};
				Mobile.each(this, function () {
					obj.left = this.offsetLeft;
					obj.top = this.offsetTop;
				});
				return obj;
			},

			// index
			index: function index(obj) {
				var _index = -1;
				if (arguments.length === 0) {
					Mobile.each(this, function (index, v) {
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
			remove: function remove() {
				var arr = [];
				var $this = this;
				Mobile.each(this, function (index, v) {
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
			append: function append(obj) {
				if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" && obj.length && obj.length > 0) {
					Mobile.each(this, function () {
						for (var i = 0; i < obj.length; i++) {
							this.appendChild(obj[i]);
						}
					});
				} else if (typeof obj === "string") {
					Mobile.each(this, function () {
						this.innerHTML += obj;
					});
				} else {
					Mobile.each(this, function () {
						this.appendChild(obj);
					});
				}

				return this;
			},

			//  prepend
			prepend: function prepend(obj) {
				if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" && obj.length && obj.length > 0) {
					Mobile.each(this, function () {
						for (var i = obj.length; i > 0; i--) {
							this.insertBefore(obj[i - 1], this.childNodes[0]);
						}
					});
				} else if (typeof obj === "string") {
					var els = Mobile.htmlStringToDOM(obj);
					Mobile.each(this, function () {
						this.insertBefore(els, this.childNodes[0]);
					});
				} else {
					Mobile.each(this, function () {
						this.insertBefore(obj, this.childNodes[0]);
					});
				}

				return this;
			},

			//  clone
			clone: function clone(obj) {
				var _obj;
				Mobile.each(this, function () {
					_obj = this.cloneNode(true);
					return false;
				});
				return _obj;
			}

		});

		// 动画
		Mobile.fn.extend({

			// show
			show: function show(_showType) {

				Mobile.each(this, function (i, el) {

					var _showType = _showType ? _showType : "block";
					$(this).data("display-type", true);
					this.style.display = _showType;
				});
				return this;
			},

			// hide
			hide: function hide(_showType) {

				Mobile.each(this, function (i, el) {

					var _showType = _showType ? _showType : "none";
					$(this).data("display-type", false);
					this.style.display = _showType;
				});
				return this;
			},

			// toggle
			toggle: function toggle() {

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
			windowTop: function windowTop(y, time) {

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
			scrollTop: function scrollTop(y, time) {

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
			scrollLeft: function scrollLeft(x, time) {

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

			stop: function stop() {
				Mobile.each(this, function () {
					var clearTimeId = this.clearTimeId || 0;
					clearInterval(clearTimeId);
				});

				return this;
			}

		});

		// 绑定事件
		Mobile.fn.extend({

			on: function on(type) {

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
				var handler = function handler() {};
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

					var props = [];
					var detail = typeof event.detail === "undefined" ? {} : event.detail;
					props.push(event);

					if (detail && detail.length) {
						for (var i = 0; i < detail.length; i++) {
							props.push(detail[i]);
						}
					} else {
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

						var props = [];
						var detail = event.detail;
						props.push(event);

						if (detail.length) {
							for (var i = 0; i < detail.length; i++) {
								props.push(detail[i]);
							}
						} else {
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
					handler = arguments[1] || function () {};
					bl = typeof arguments[2] === "boolean" ? arguments[2] : false;

					Mobile.each(this, function () {
						if (this.addEventListener) {
							this.addEventListener(type, m.proxy(f, this), bl);
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
				if (arguments.length >= 3 && _typeof(arguments[1]) === "object" && typeof arguments[2] === "function") {
					obj = arguments[1];
					handler = arguments[2] || function () {};
					bl = typeof arguments[3] === "boolean" ? arguments[3] : false;

					Mobile.each(this, function () {
						if (this.addEventListener) {
							this.addEventListener(type, m.proxy(f, this), bl);
						}
					});

					m.events.on(type, f);
				}

				// 委托绑定事件
				if (arguments.length >= 3 && typeof arguments[1] === "string" && typeof arguments[2] === "function") {
					el = arguments[1].toString() || "";
					handler = arguments[2] || function () {};
					bl = typeof arguments[3] === "boolean" ? arguments[3] : false;

					Mobile.each(this, function () {
						if (this.addEventListener) {

							this.addEventListener(type, m.proxy(f2, this), bl);
						}
					});

					m.events.on(type, f2);
				}

				// 委托绑定事件传object值
				if (arguments.length >= 4 && typeof arguments[1] === "string" && _typeof(arguments[2]) === "object" && typeof arguments[3] === "function") {
					el = arguments[1].toString() || "";
					obj = arguments[2];
					handler = arguments[3] || function () {};
					bl = typeof arguments[4] === "boolean" ? arguments[4] : false;

					Mobile.each(this, function () {
						if (this.addEventListener) {
							this.addEventListener(type, m.proxy(f2, this), bl);
						}
					});

					m.events.on(type, f2);
				}

				return this;
			},

			off: function off(type, handler) {

				if (arguments.length === 1) {
					Mobile.each(this, function () {
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
				Mobile.each(this, function () {
					if (this.removeEventListener) this.removeEventListener(type, handler, false);else if (this.deattachEvent) {
						/*IE*/
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
			trigger: function trigger(type, obj) {

				Mobile.each(this, function () {
					try {
						var btnEvent = document.createEvent("CustomEvent");
						btnEvent.initCustomEvent(type, true, false, obj);
						this.dispatchEvent(btnEvent);
					} catch (ex) {
						console.log(ex);
					}
				});
			},

			// emit
			emit: function emit(type, obj) {
				Mobile.each(this, function () {
					m(this).trigger(type, obj);
				});
			},

			//  only bind one event
			one: function one() {
				var args = arguments;
				var $this = this;
				this.bindOneElementEvent = true;
				Mobile.each($this, function (i, v) {
					m(this).on.apply($this, args);
				});
			},

			// click
			click: function click(fn, bl) {

				if (arguments.length === 0) {
					Mobile.each(this, function () {
						this.click(); // 原生触发
					});
					return this;
				}

				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("click", fn, bl);
				});
			},

			// dblclick
			dblclick: function dblclick(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("dblclick", fn, bl);
				});
			},

			//  blur
			blur: function blur(fn, bl) {
				if (arguments.length === 0) {
					$(this).each(function () {
						this.blur(); // 原生触发
					});
					return this;
				}

				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("blur", fn, bl);
				});
			},

			// focus
			focus: function focus(fn, bl) {
				if (arguments.length === 0) {
					$(this).each(function () {
						this.focus(); // 原生触发
					});
					return this;
				}
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("focus", fn, bl);
				});
			},

			// touchstart
			touchstart: function touchstart(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("touchstart", fn, bl);
				});
			},

			// touchmove
			touchmove: function touchmove(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("touchmove", fn, bl);
				});
			},

			// touchend
			touchend: function touchend(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("touchend", fn, bl);
				});
			},

			// touchcancel
			touchcancel: function touchcancel(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("touchcancel", fn, bl);
				});
			},

			// touchend 和 touchcancel 
			touchendcancel: function touchendcancel(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("touchend", fn, bl);
					m(this).on("touchcancel", fn, bl);
				});
			},

			// window cancel event
			//windowcancel: function(fn) {
			//	var $this = this;
			//	m(window).on("touchend", function(event) {

			//		fn.call($this, event);

			//	});
			//},

			// tap
			tap: function tap() {
				var args = arguments;
				var fn = function fn() {};
				var deletage = "";
				var bl = false;

				Mobile.each(this, function (i, v) {

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
						else if (args.length >= 2 && _typeof(args[0]) === "object" && typeof args[1] === "function") {
								fn = args[1];
								bl = args[2] || false;
								var obj = args[0];
								isDeleDageTarget = true;

								m(this).on("touchstart", obj, start, bl);
								m(this).on("touchmove", obj, move, bl);
								m(this).on("touchend", obj, end, bl);
							}

							// 使用委托事件传值data	
							else if (args.length >= 3 && typeof args[0] === "string" && _typeof(args[1]) === "object" && typeof args[2] === "function") {
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
			scroll: function scroll(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("scroll", fn, bl);
				});
			},

			// resize
			resize: function resize(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("resize", fn, bl);
				});
			},

			// change
			change: function change(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("change", fn, bl);
				});
			},

			// keyup
			keyup: function keyup(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("keyup", fn, bl);
				});
			},

			// keyup
			keydown: function keydown(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("keydown", fn, bl);
				});
			},

			// keypress
			keypress: function keypress(fn, bl) {
				bl = bl || false;
				Mobile.each(this, function () {
					m(this).on("keypress", fn, bl);
				});
			}
		});

		// 自定义事件列表
		Mobile.extend({
			events: {
				props: {},

				// bind events
				on: function on(eventName, fn) {
					this.props[eventName] = this.props[eventName] || [];
					this.props[eventName].push(fn);
				},
				off: function off(eventName, fn) {
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
});

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

+function (Mobile) {

    Mobile.fn.extend({

        // 多指触摸
        touch: function touch(startfn, movefn, endfn, bl) {

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

            var $self = this;
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

                        if (!$self.tempObj.some(function (item) {
                            return touches[name].identifier === item.id;
                        })) {
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
                        startfn.call($this, event, $self.obj, $self);
                    }

                    // 异常处理
                } catch (e) {

                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj, $self);
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
                    if ($self.isAddMoveEventFirst && _x !== _y) {
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
                        movefn.call($this, event, $self.obj, $self);
                    }

                    // 异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj, $self);
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
                    var maxCh = m.max($self.tempObj, function (item) {
                        return item.timestamp;
                    });
                    if (maxCh) {
                        var i = 0;
                        Object.keys(touches2).forEach(function (name) {
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
                            endfn.call($this, event, $self.obj, $self);
                        }
                    }

                    //异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj, $self);
                    }
                }
            }, bl);
        },

        // 委托的多指触摸
        touchdeletage: function touchdeletage(deletage, startfn, movefn, endfn, bl) {

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
            m(this).on("touchstart", deletage, function (event) {

                var $this = this;
                try {

                    //兼容ios的返回键和 window.history.back()
                    if (event.touches.length === 1) {
                        $self.tempObj = [];
                    }

                    var touches = event.targetTouches;
                    var len = touches.length;
                    Object.keys(touches).forEach(function (name) {

                        if (!$self.tempObj.some(function (item) {
                            return touches[name].identifier === item.id;
                        })) {
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
                        startfn.call($this, event, $self.obj, $self);
                    }

                    // 异常处理
                } catch (e) {

                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj, $self);
                    }
                }
            }, bl);

            m(this).on("touchmove", deletage, function (event) {
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
                    if ($self.isAddMoveEventFirst && _x !== _y) {
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
                        movefn.call($this, event, $self.obj, $self);
                    }

                    // 异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj, $self);
                    }
                }
            }, bl);

            m(this).on("touchend", deletage, function (event) {
                var $this = this;
                try {

                    var touches = event.changedTouches;
                    var touches2 = event.touches;

                    $self.tempObj = $self.tempObj.filter(function (item) {
                        return item.id !== touches[0].identifier;
                    });
                    var _index = 0;
                    var maxCh = m.max($self.tempObj, function (item) {
                        return item.timestamp;
                    });
                    if (maxCh) {
                        var i = 0;
                        Object.keys(touches2).forEach(function (name) {
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
                            endfn.call($this, event, $self.obj, $self);
                        }
                    }

                    //异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj, $self);
                    }
                }
            }, bl);

            m(this).on("touchcancel", deletage, function (event) {
                var $this = this;
                try {

                    var touches = event.changedTouches;
                    var touches2 = event.touches;

                    $self.tempObj = $self.tempObj.filter(function (item) {
                        return item.id !== touches[0].identifier;
                    });
                    var _index = 0;
                    var maxCh = m.max($self.tempObj, function (item) {
                        return item.timestamp;
                    });
                    if (maxCh) {
                        var i = 0;
                        Object.keys(touches2).forEach(function (name) {
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
                            endfn.call($this, event, $self.obj, $self);
                        }
                    }

                    //异常处理
                } catch (e) {
                    //TODO handle the exception
                    $self.tempObj = [];
                    $self.isAddMoveEventFirst = true; // 判断是否第一次拖动
                    if (typeof endfn === "function") {
                        //event.obj=obj;
                        endfn.call($this, event, $self.obj, $self);
                    }
                }
            }, bl);
        }

    });
}(Mobile);

/*
      hqs-ajax
*/

+function (Mobile) {

	/* 封装ajax函数
     @param {string}opt.type http连接的方式，包括POST,GET PUT DELETE
     @param {string}opt.url 发送请求的url
     @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
     @param {object}opt.data 发送的参数，格式为对象类型
     @param {function}opt.contentType   内容类型
     @param{function}opt.success ajax发送并接收成功调用的回调函数
     @param {function}opt.error ajax发送并接收error调用的回调函数
     @param {function}opt.xhr 获取xhr对象
     @param {number}opt.timeout // 超时  默认0
 	@param {string}opt.dataType // 回调结果处理模式 默认text
 	@param {string}opt.headers  // headers 默认值是{},
  */

	var _ajaxSetup = Mobile.ajaxSettings = {
		type: "GET",
		url: '',
		async: true,
		data: {},
		success: function success() {},
		error: function error() {},
		dataType: "text",
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		timeout: 0,
		//progress: {},
		headers: {},
		xhr: function xhr() {
			return Mobile.createXHR();
		}
	};

	// ajax type
	function _ajaxFun(url, type, data, _arguments) {
		var success;
		var error;
		//var progress;
		if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" && _arguments.length > 2) {
			success = _arguments[2];
			if (_arguments.length >= 3) {
				error = _arguments[3];
				//	progress = _arguments[4] || null;
			}
		} else if (typeof data === "function") {
			success = data;
			if (_arguments.length > 2) {
				error = _arguments[2];
				//progress = _arguments[3] || null;
			}
		}

		// 最后的参数是字符类型赋值给 dataType
		var _dataType = "text";
		var lastArg = _arguments[_arguments.length - 1];
		if (typeof lastArg === "string") {
			_dataType = lastArg;
		}

		Mobile.ajax({
			type: type,
			url: url,
			data: (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" ? data : null,
			dataType: _dataType,
			success: success,
			error: error
			//progress: progress
		});
	}

	// 链接ajax发送的参数数据
	function _JoinParams(data) {

		var params = [];
		if (data instanceof Object) {
			_compilerparams(params, data, "");
		}
		return params.join("&") || "";
	}

	function _compilerparams(params, data, preKey) {
		preKey = preKey || "";

		for (var key in data) {
			var data2 = data[key];

			if (data2 === undefined) {
				continue;
			} else if (data2 !== null && data2.constructor === Object) {
				for (var key2 in data2) {

					var _key = "";
					var _key2 = "[" + key2 + "]";
					if (preKey === "") {
						_key = preKey + key + _key2;
					} else {
						_key = preKey + "[" + key + "]" + _key2;
					}

					var _value = data2[key2];

					if (_value.constructor === Array || _value.constructor === Object) {

						_compilerparams(params, _value, _key);
					} else {
						params.push(encodeURIComponent(_key) + '=' + encodeURIComponent(_value));
					}
				}
			} else if (data2 !== null && data2.constructor === Array) {

				for (var key2_ in data2) {
					var data3 = data2[key2_];
					if ((typeof data3 === "undefined" ? "undefined" : _typeof(data3)) === "object") {
						for (var key3 in data3) {

							var _key_ = "";
							var _key2_ = "[" + key2_ + "]" + "[" + key3 + "]";
							if (preKey === "") {
								_key_ = preKey + key + _key2_;
							} else {
								_key_ = preKey + "[" + key + "]" + _key2_;
							}

							var _value_ = data3[key3];

							if (_value_.constructor === Array || _value_.constructor === Object) {

								_compilerparams(params, _value_, _key_);
							} else {
								params.push(encodeURIComponent(_key_) + '=' + encodeURIComponent(_value_));
							}
						}
					} else {
						var _key_2 = preKey + key + "[]";
						var _value_2 = data3;
						params.push(encodeURIComponent(_key_2) + '=' + encodeURIComponent(_value_2));
					}
				}
			} else {
				var _key_3 = "";
				if (preKey === "") {
					_key_3 = preKey + key;
				} else {
					_key_3 = preKey + "[" + key + "]";
				}
				var dataVal = data[key];
				dataVal = dataVal === null ? "" : dataVal;
				params.push(encodeURIComponent(_key_3) + '=' + encodeURIComponent(dataVal));
			}
		}
	}

	Mobile.extend({

		// create XHR Object
		createXHR: function createXHR() {

			if (window.XMLHttpRequest) {
				//IE7+、Firefox、Opera、Chrome 和Safari
				return new window.XMLHttpRequest();
			}
		},

		ajaxSetup: function ajaxSetup(options) {

			options = (typeof options === "undefined" ? "undefined" : _typeof(options)) === "object" ? options : {};
			$.extend(_ajaxSetup, options);
			return _ajaxSetup;
		},

		ajax: function ajax(options) {

			options = (typeof options === "undefined" ? "undefined" : _typeof(options)) === "object" ? options : {};
			var opt = $.extend({}, _ajaxSetup, options);

			// setting timeout
			var abortTimeoutId = 0;
			var abort = function abort() {
				if (opt.timeout > 0) {
					abortTimeoutId = setTimeout(function () {
						xhr.onreadystatechange = function () {};
						try {
							xhr.abort();
							opt.error("timeout");
						} catch (exp) {
							console.log("timeout");
						}
					}, opt.timeout);
				}
			};

			var xhr = null;
			var _xhrObj = opt.xhr();
			if ((typeof _xhrObj === "undefined" ? "undefined" : _typeof(_xhrObj)) === "object") {
				xhr = _xhrObj;
			}
			xhr.xhrFields = opt.xhrFields || {};

			// 连接参数
			var postData;
			var reg = /application\/x-www-form-urlencoded/;

			if (reg.test(opt.contentType)) {
				postData = _JoinParams(opt.data);
			} else {
				postData = opt.data;
			}

			// xhr.setRequestHeader
			for (var propName in opt.headers) {
				xhr.setRequestHeader(propName, opt.headers[propName]);
			}

			if (opt.type.toUpperCase() === 'POST' || opt.type.toUpperCase() === 'PUT' || opt.type.toUpperCase() === 'DELETE') {
				opt.url = opt.url.indexOf("?") === -1 ? opt.url + "?" + "_=" + Math.random() : opt.url + "&_=" + Math.random();

				xhr.open(opt.type, opt.url, opt.async);
				// setting contentType
				if (opt.contentType !== false) {
					xhr.setRequestHeader('Content-Type', opt.contentType);
				}
				abort();
				xhr.send(postData);
			} else if (opt.type.toUpperCase() === 'GET') {
				if (postData.length > 0) {
					postData = "&" + postData;
				}
				opt.url = opt.url.indexOf("?") === -1 ? opt.url + "?" + "_=" + Math.random() + postData : opt.url + "&_=" + Math.random() + postData;

				xhr.open(opt.type, opt.url, opt.async);
				// setting contentType
				if (opt.contentType !== false) {
					xhr.setRequestHeader('Content-Type', opt.contentType);
				}
				abort();
				xhr.send(null);
			}
			xhr.onreadystatechange = function () {

				if (xhr.readyState === 4) {
					//xhr.onreadystatechange = function(){};
					clearTimeout(abortTimeoutId);
					if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
						if (typeof opt.success === "function") {
							try {
								var res;
								if (opt.dataType === "json") {
									res = JSON.parse(xhr.responseText);
								} else if (opt.dataType === "javascript") {
									res = xhr.responseText;
									window.eval(xhr.responseText);
								} else {
									res = xhr.responseText;
								}
								opt.success(res, xhr.status, xhr.statusText);
							} catch (e) {
								// handle the exception
								opt.success(xhr.responseText, xhr.status, xhr.statusText);
							}
						}
					} else {
						if (typeof opt.error === "function") {
							opt.error(xhr.status, xhr.statusText);
						}
					}
				}
			};
		},

		// get
		get: function get$$1(url, data) {
			_ajaxFun(url, "get", data, arguments);
		},

		// post
		post: function post(url, data) {
			_ajaxFun(url, "post", data, arguments);
		},

		// put
		put: function put(url, data) {
			_ajaxFun(url, "put", data, arguments);
		},

		// delete
		delete: function _delete(url, data) {
			_ajaxFun(url, "delete", data, arguments);
		}

		// jsonp
		// jsonp: function (url, data) {

		// 	var callback;
		// 	if (typeof data === "function") {
		// 		callback = data;
		// 	} else if (arguments.length >= 3) {
		// 		callback = arguments[2];
		// 	}

		// 	// 创建一个几乎唯一的id
		// 	var callbackName = "mobile" + (new Date()).getTime().toString().trim();
		// 	window[callbackName] = function (result) {

		// 		// 创建一个全局回调处理函数
		// 		if (typeof callback === "function") {
		// 			callback(result);
		// 		}
		// 	};

		// 	// 参数data对象字符
		// 	var params = [];
		// 	var postData = "";
		// 	if (typeof data === "object") {

		// 		postData = _JoinParams(data);
		// 	}

		// 	if (postData.length > 0) {
		// 		postData = "&" + postData;
		// 	}
		// 	url = url.indexOf("?") === -1 ? url + "?" + "callback=" + callbackName + postData : url + "&callback=" +
		// 		callbackName + postData;

		// 	// 创建Script标签并执行window[id]函数
		// 	var script = document.createElement("script");
		// 	script.setAttribute("id", callbackName);
		// 	script.setAttribute("src", url);
		// 	script.setAttribute("type", "text/javascript");
		// 	document.body.appendChild(script);

		// }

	});
}(Mobile);

/*
css3 transition 
*/

+function (Mobile) {

    Mobile.fn.extend({

        // transition
        transition: function transition(option, time, ease, delay, fn) {

            ease = typeof ease === "string" ? ease : "ease";
            delay = typeof delay === "number" ? delay : 0;
            var _transition = "all " + time / 1000 + "s  " + ease + " " + delay / 1000 + "s";

            if (typeof option === "string") {

                if (arguments.length === 1) {
                    _transition = option;
                } else if (arguments.length > 1) {
                    _transition = option + " " + time / 1000 + "s  " + ease + " " + delay / 1000 + "s";
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
            if ((typeof option === "undefined" ? "undefined" : _typeof(option)) !== "object") {
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
                                }, time + delay);
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
        transitionEnd: function transitionEnd(isReset, fn) {

            // 是否回复到第一次的状态
            //isReset = typeof isReset === "boolean" ? isReset : false;
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

/*
 hqs-transform
*/

+function (m) {

    function getTransformArrayByCss($this) {
        var transformText = m($this).css("transform");
        if (!transformText) {
            transformText = m($this).css("-webkit-transform");
        }
        transformText = m.trim(transformText);
        //console.log(transformText)
        var reg = /\((.*)\)$/img;
        var bl = reg.test(transformText),
            arrs = [];
        if (bl) {
            var txts = RegExp.$1.split(",") || [];
            txts.forEach(function (item) {
                arrs.push(parseFloat(item.trim()));
            });
        }

        return arrs;
    }

    // getDeg
    function getDeg(transformArrs, a, b, c, d) {

        var len = transformArrs.length,
            deg = 0,
            aa = 0,
            bb = 0,
            cc = 0,
            dd = 0;

        if (len === 6) {
            aa = Math.round(180 * Math.asin(transformArrs[a]) / Math.PI);
            bb = Math.round(180 * Math.acos(transformArrs[b]) / Math.PI);
            cc = Math.round(180 * Math.asin(transformArrs[c]) / Math.PI);
            dd = Math.round(180 * Math.acos(transformArrs[d]) / Math.PI);
        } else {
            aa = Math.round(180 * Math.asin(transformArrs[a]) / Math.PI);
            bb = Math.round(180 * Math.acos(transformArrs[b]) / Math.PI);
            cc = Math.round(180 * Math.asin(transformArrs[c]) / Math.PI);
            dd = Math.round(180 * Math.acos(transformArrs[d]) / Math.PI);
        }

        if (aa === bb || -aa === bb) {
            deg = dd;
        } else if (-aa + bb === 180) {
            deg = 180 + cc;
        } else if (aa + bb === 180) {
            deg = 360 - cc || 360 - dd;
        }

        return deg >= 360 ? 0 : deg;
    }

    function setTransform(transforName, value, value2) {

        // 参数为3个
        if (arguments.length === 3) {
            var vals = [value];
            vals.push(value2);
            value = vals;
        }

        m.each(this, function () {
            if (!this.transform) {
                this.transform = {};
            }

            this.transform[transforName] = value;
            var result = '';
            var arrs = [];
            for (var item in this.transform) {
                switch (item) {
                    case 'rotate':
                    case 'rotateX':
                    case 'rotateY':
                    case 'rotateZ':
                    case 'skewX':
                    case 'skewY':
                    case 'skewZ':
                        result += item + '(' + parseFloat(this.transform[item]) + 'deg)  ';
                        break;
                    case 'skew':

                        arrs = this.transform[item] || [];
                        if (arrs.length === 2) {
                            result += item + '(' + parseFloat(arrs[0]) + 'deg,' + parseFloat(arrs[1]) + 'deg)  ';
                        } else {
                            result += item + '(' + parseFloat(arrs) + 'deg,' + parseFloat(arrs) + 'deg)  ';
                        }
                        break;

                    case 'scaleX':
                    case 'scaleY':
                    case 'scaleZ':
                        result += item + '(' + parseFloat(this.transform[item]) + ')  ';
                        break;

                    case 'scale':
                        arrs = this.transform[item] || [];

                        if (arrs.length === 2) {
                            result += item + '(' + parseFloat(arrs[0]) + ',' + parseFloat(arrs[1]) + ')  ';
                        } else {
                            result += item + '(' + parseFloat(arrs) + ',' + parseFloat(arrs) + ')  ';
                        }
                        break;

                    case 'translateX':
                    case 'translateY':
                    case 'translateZ':
                        result += item + '(' + parseFloat(this.transform[item]) + 'px)  ';
                        break;
                    case 'translate':
                        arrs = this.transform[item] || [];

                        if (arrs.length === 2) {
                            result += item + '(' + parseFloat(arrs[0]) + 'px,' + parseFloat(arrs[1]) + 'px)  ';
                        } else {
                            result += item + '(' + parseFloat(arrs) + 'px,' + parseFloat(arrs) + 'px)  ';
                        }
                        break;

                }
            }

            this.style.WebkitTransform = result;
            this.style.MozTransform = result;
            this.style.msTransform = result;
            this.style.OTransform = result;
            this.style.transform = result;

            //this.style.cssText+="transform:"+result;

        });

        return this;
    }

    function getTransformByCss(transforName) {

        var result;
        Mobile.each(this, function () {
            var transformArrs = getTransformArrayByCss(this);
            // console.log(transformArrs)
            var len = transformArrs.length;
            switch (transforName) {

                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':

                    if (transforName === "rotate") {

                        if (transformArrs.length === 0) {
                            result = 0;
                        } else {

                            result = getDeg(transformArrs, 0, 1, 2, 3);
                        }
                    }

                    if (transforName === "rotateX") {
                        if (transformArrs.length === 0) {
                            result = 0;
                        } else {
                            result = getDeg(transformArrs, 5, 6, 9, 10);

                            // if(transformArrs[6]<0){
                            //     result=-(360-result);
                            // }
                        }
                    }

                    if (transforName === "rotateY") {
                        if (transformArrs.length === 0) {
                            result = 0;
                        } else {
                            result = getDeg(transformArrs, 0, 2, 8, 10);

                            // if(transformArrs[8]<0){
                            //     result=-(360-result);
                            // }
                        }
                    }

                    break;

                // case 'skew':
                // case 'skewX':
                // case 'skewY':
                // case 'skewZ':

                //     if (transforName === "skew") {

                //         if (transformArrs.length === 0) {
                //             result = 0;
                //         } else {

                //             result = getDeg(transformArrs, 0, 1, 2, 3);

                //         }

                //     }

                //     if (transforName === "skewX") {
                //         if (transformArrs.length === 0) {
                //             result = 0;
                //         } else {
                //             result = getDeg(transformArrs, 5, 6, 9, 10);

                //             // if(transformArrs[6]<0){
                //             //     result=-(360-result);
                //             // }

                //         }

                //     }

                //     if (transforName === "skewY") {
                //         if (transformArrs.length === 0) {
                //             result = 0;
                //         } else {
                //             result = getDeg(transformArrs, 0, 2, 8, 10);

                //             // if(transformArrs[8]<0){
                //             //     result=-(360-result);
                //             // }
                //         }

                //     }

                //     break;


                case 'translate':
                case 'translateX':
                case 'translateY':
                case 'translateZ':

                    if (transforName === "translate") {
                        if (len === 0) {
                            result = [0, 0];
                        } else {
                            result = len === 6 ? [transformArrs[4], transformArrs[5]] : [transformArrs[12], transformArrs[13]];
                        }
                    }
                    if (transforName === "translateX") {
                        if (len === 0) {
                            result = 0;
                        } else {
                            result = len === 6 ? transformArrs[4] : transformArrs[12];
                        }
                    }

                    if (transforName === "translateY") {
                        if (len === 0) {
                            result = 0;
                        } else {
                            result = len === 6 ? transformArrs[5] : transformArrs[13];
                        }
                    }
                    if (transforName === "translateZ") {
                        if (len === 0) {
                            result = 0;
                        } else {
                            result = len === 16 ? transformArrs[14] : 0;
                        }
                    }

                    break;

                case 'scale':
                case 'scaleX':
                case 'scaleY':
                case 'scaleZ':

                    if (transforName === "scale") {
                        if (len === 0) {
                            result = [1, 1];
                        } else {
                            result = len === 6 ? [transformArrs[0], transformArrs[3]] : [transformArrs[0], transformArrs[5]];
                        }
                    }
                    if (transforName === "scaleX") {
                        if (len === 0) {
                            result = 1;
                        } else {
                            result = transformArrs[0];
                        }
                    }

                    if (transforName === "scaleY") {
                        if (len === 0) {
                            result = 1;
                        } else {
                            result = len === 6 ? transformArrs[3] : transformArrs[5];
                        }
                    }

                    break;
            }

            return false;
        });

        return result;
    }

    m.fn.extend({

        translate: function translate() {

            if (arguments.length === 0) {
                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "translate");
                    return false;
                });

                return _v;
            } else {
                if (arguments.length === 1) {
                    setTransform.call(this, "translate", arguments[0]);
                }
                if (arguments.length === 2) {
                    setTransform.call(this, "translate", arguments[0], arguments[1]);
                }

                return this;
            }
        },

        // translateX
        translateX: function translateX(size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "translateX");
                    return false;
                });

                return _v;
            } else {

                setTransform.call(this, "translateX", size);
                return this;
            }
        },

        // translateY
        translateY: function translateY(size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "translateY");
                    return false;
                });

                return _v;
            } else {
                setTransform.call(this, "translateY", size);
                return this;
            }
        },

        // translateZ
        translateZ: function translateZ(size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "translateZ");
                    return false;
                });

                return _v;
            } else {

                setTransform.call(this, "translateZ", size);
                return this;
            }
        },

        // scale
        scale: function scale() {

            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "scale");
                    return false;
                });

                return _v;
            } else {
                if (arguments.length === 1) {
                    setTransform.call(this, "scale", arguments[0]);
                }
                if (arguments.length === 2) {
                    setTransform.call(this, "scale", arguments[0], arguments[1]);
                }

                return this;
            }
        },

        // scaleX
        scaleX: function scaleX(size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "scaleX");
                    return false;
                });

                return _v;
            } else {

                setTransform.call(this, "scaleX", size);
                return this;
            }
        },

        // scaleY
        scaleY: function scaleY(size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "scaleY");
                    return false;
                });

                return _v;
            } else {

                setTransform.call(this, "scaleY", size);
                return this;
            }
        },

        // rotate
        rotate: function rotate(size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "rotate");
                    return false;
                });

                return _v;
            } else {

                if (arguments.length >= 1) {
                    msetTransform.call(this, "rotate", size);
                }

                return this;
            }
        },

        //rotateX
        rotateX: function rotateX(size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "rotateX");
                    return false;
                });

                return _v;
            } else {
                setTransform.call(this, "rotateX", size);
                return this;
            }
        },

        // rotateY
        rotateY: function rotateY(size) {
            if (arguments.length === 0) {
                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "rotateY");
                    return false;
                });

                return _v;
            } else {
                setTransform.call(this, "rotateY", size);
                return this;
            }
        },

        // skew
        skew: function skew() {

            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "skew");
                    return false;
                });

                return _v;
            } else {
                if (arguments.length === 1) {
                    setTransform.call(this, "skew", arguments[0]);
                }
                if (arguments.length === 2) {
                    setTransform.call(this, "skew", arguments[0], arguments[1]);
                }

                return this;
            }
        },

        // skewX
        skewX: function skewX(size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "skewX");
                    return false;
                });

                return _v;
            } else {

                setTransform.call(this, "skewX", size);
                return this;
            }
        },

        // skewY
        skewY: function skewY(size) {
            if (arguments.length === 0) {

                var _v = 0;
                Mobile.each(this, function () {
                    _v = getTransformByCss.call(m(this), "skewY");
                    return false;
                });

                return _v;
            } else {

                setTransform.call(this, "skewY", size);
                return this;
            }
        }

    });
}(Mobile);

/*
 hqs Router
 */

+function () {

    /*创建Router对象*/
    var Router = function Router(selector, content) {

        if (typeof selector === "function") {
            if (window.addEventListener) {
                window.addEventListener("load", selector);
            } else {
                window.attachEvent("load", selector);
            }
        }
    };

    Router.transitionTime = 300;
    Router.fineObjs = {};
    Router.baseUrl = "";
    Router.jsLists = []; // js 加载集合
    Router.htmlUrls = []; // html 文件的 css js 集合
    Router.caches = [];
    Router.ids = [];
    Router.tapTime = new Date().getTime(); // 点击相隔的时间
    Router.ckUrl = function (url) {

        for (var i = 0; i < Router.jsLists.length; i++) {
            var _url = Router.jsLists[i];
            if (url === _url) {
                return false;
            }
        }

        return true;
    };
    Router.emitOnly = true;
    Router.isOneMove = true;

    function _addAllIterator(itr, fn2, url, arrs) {

        var doc = document.body || document.getElementsByTagName('body')[0];
        var _url = Router.baseUrl + url;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = _url;
        script.setAttribute("data-src", _url);

        // js加载完成执行方法 ie9+
        if (window.addEventListener) {
            script.onload = function () {
                Router.jsLists.push(url);
                var itrObj = itr.next();
                if (itrObj.done) {
                    Router.runIncludeAndCache();
                    var $el = m("#m-router-" + Router.getId());
                    var parameter = _getUrlParameter($el);
                    fn2.apply($el, $el, parameter);

                    // 监听页面显示 触发的事件
                    $el.emit("m-router-show", [$el, Router.getId()]);
                }
            };
            doc.appendChild(script);
        }
    }

    function _addAllIteratorSync(itr, fn2, url, arrs) {

        var doc = document.body || document.getElementsByTagName('body')[0];
        var _url = Router.baseUrl + url;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = _url;
        script.setAttribute("data-src", _url);

        //js加载完成执行方法 ie9+
        if (window.addEventListener) {
            var $el = m("#m-router-" + Router.getId());
            script.onload = function () {
                Router.jsLists.push(url);
                var itrObj = itr.next();
                if (itrObj.done) {
                    Router.runIncludeAndCache();
                    var parameter = _getUrlParameter($el);
                    fn2.apply($el, $el, parameter);

                    // 监听页面显示 触发的事件
                    $el.emit("m-router-show", [$el, Router.getId()]);
                } else {
                    _addAllIteratorSync(itr, fn2, itrObj.value, arrs);
                }
            };
            doc.appendChild(script);
        }
    }

    function _activeUrls(list) {
        var arrs = [];
        for (var i = 0; i < list.length; i++) {
            var _url = list[i];

            var bl = true;
            for (var y = 0; y < Router.jsLists.length; y++) {
                var _url2 = Router.jsLists[y];
                if (_url === _url2) {
                    bl = false;
                }
            }

            if (bl) {
                arrs.push(_url);
            }
        }

        return arrs;
    }

    function _getCurrentScript() {

        if (document.currentScript) {

            return document.currentScript.getAttribute("data-src") || "";
        } else {
            var stack,
                e,
                nodes = document.getElementsByTagName("script");
            for (var i = 0, node; i < nodes.length; i++) {
                node = nodes[i];

                if (node.readyState === "interactive") {
                    // ie8 ,ie9 ie10
                    return node.getAttribute("data-src") || "";
                } else if (!node.readyState) {

                    // ie11
                    try {
                        throw Error("强制报错,以便捕获e.stack,获取JS路径有误");
                    } catch (e) {
                        stack = e.stack;

                        if (e.sourceURL) {
                            //safari
                            saf = e.sourceURL;
                        }
                    }
                    if (stack) {

                        e = stack.indexOf(' at ') !== -1 ? ' at ' : '@';
                        while (stack.indexOf(e) !== -1) {
                            stack = stack.substring(stack.indexOf(e) + e.length);
                        }

                        var mchs = stack.match(/(http|https):\/\/.*\.js/)[0];
                        mchs = mchs.split("/");
                        mchs = mchs[mchs.length - 1];
                        var mch = mchs.match(/.*\.js$/)[0];
                        var srp = _getScriptByFileName(mch);
                        var src = srp.getAttribute("data-src");
                        return src;
                    }
                }
            }
        }
    }

    function _getScriptByFileName(fileName) {
        var srps = document.getElementsByTagName("script");
        var list = [];
        for (var i = 0; i < srps.length; i++) {
            var o = srps[i];
            var reg = new RegExp(fileName, "img");
            var src = o.getAttribute("src");
            if (reg.test(src)) {
                list.push(o);
            }
        }

        return list.length > 0 ? list[list.length - 1] : {};
    }

    function _compilerHtml(obj, src, prop, isReplace, fn, id) {
        prop = prop || {};
        Router.get(src, prop, function (data) {

            m(obj).find("._loading-dh").hide();
            var newElement = Router.htmlStringToDOM(data);

            /*----------------------添加 style 标签 兼容 ie9+--------------------------------*/
            var els_style = newElement.childNodes;
            var doc_style = document.createDocumentFragment();
            for (var i0 = els_style.length - 1; i0 >= 0; i0--) {
                var el = els_style[i0];
                if (el.nodeType === 1 && el.nodeName === "STYLE") {
                    el.setAttribute("data-Router-id", id);
                    if (window.addEventListener) {
                        doc_style.insertBefore(el, doc_style.childNodes[0]);
                    } else {
                        doc_style.insertBefore(el, doc_style.firstChild);
                    }
                }
            }
            document.getElementsByTagName("head")[0].appendChild(doc_style);

            /* ----------------------添加 link 标签 兼容 ie9 + --------------------------------*/
            var els_link = newElement.childNodes;
            var doc_link = document.createDocumentFragment();

            for (var i1 = els_link.length - 1; i1 >= 0; i1--) {
                var el1 = els_link[i1];

                if (el1.nodeType === 1 && el1.tagName === "LINK") {

                    // Router.htmlUrls 集合检测
                    el1.setAttribute("type", "text/html");
                    el1.setAttribute("data-Router-id", id);
                    el1.setAttribute("type", "text/css");

                    if (window.addEventListener) {
                        doc_link.insertBefore(el1, doc_link.childNodes[0]);
                    } else {
                        doc_link.insertBefore(el1, doc_link.firstChild);
                    }
                }
            }
            document.getElementsByTagName("head")[0].appendChild(doc_link);

            /*----------------------添加 script 标签 兼容 ie8+--------------------------------*/
            var els_scriprt = newElement.childNodes;
            var doc_script = document.createDocumentFragment();

            // 添加 新建 script
            var docDfgTypeInSrc = document.createDocumentFragment();
            var docDfgTypeInSrcIe8 = [];

            for (var i2 = 0; i2 < els_scriprt.length; i2++) {
                var el2 = els_scriprt[i2];

                if (el2.nodeType === 1 && el2.tagName === "SCRIPT") {

                    var script = document.createElement("script");
                    script.type = "text/javascript";

                    if (!el2.src) {

                        // 没有src属性值 应用script 为本内容
                        var jscontent = el2.innerHTML || "";
                        script.setAttribute("data-Router-id", id);
                        if (jscontent) {

                            // ie9+
                            if (window.addEventListener) {

                                docDfgTypeInSrc.insertBefore(script, doc_script.childNodes[0]);
                                script.innerHTML = jscontent;
                            } else {
                                // ie8
                                docDfgTypeInSrc.insertBefore(script, doc_script.firstChild);
                                script.jscode = jscontent;
                                docDfgTypeInSrcIe8.push(jscontent);
                            }
                        }
                    }
                }
            }

            // 删除原有 script
            for (var i3 = els_scriprt.length - 1; i3 >= 0; i3--) {
                var el3 = els_scriprt[i3];
                if (el3.nodeType === 1 && el3.tagName === "SCRIPT") {

                    // 删除节点
                    if (el3.parentNode) {
                        var els = el3.parentNode;
                        els.removeChild(el3);
                    }
                }
            }

            // <inlude>标签 添加到document
            if (isReplace) {

                var parent = obj.parentNode;
                if (window.addEventListener) {
                    parent.replaceChild(newElement, obj);
                } else {

                    // supper ie8
                    if ($) {
                        $(newElement).replaceAll($(obj));
                    }
                }
            } else {
                //  require 添加到document
                obj.appendChild(newElement);

                // callback function
                if (typeof fn === "function") {
                    fn();
                }
            }

            // 没有src属性值 不是script元素加载后完成 再添加到页面
            // ie9+
            if (window.addEventListener) {

                document.getElementsByTagName("body")[0].appendChild(docDfgTypeInSrc);
            }
        }, function () {
            // 加载失败
            var $p = m("#m-router-" + Router.getId());
            //  m(".m-hd-top-ttl", $p).html(`<div class="_fail"> ~<span class="icon icon-nanguo"></span>~</div>`);
            //m-router-cnt
            $p.find(".m-router-loading").hide();
            $p.append("<div class=\"m-router-loading-fail\">~\u6570\u636E\u52A0\u8F7D\u5931\u8D25\u4E86~</div>");
        });
    }

    function _moveEl(el, isOneMove) {

        m(el).touch(function (event, obj) {

            obj.$moveElment = m(this);
            obj.moveElmentX = obj.$moveElment.translateX();
            obj.moveElmentWidth = obj.$moveElment.width();
            obj.$prevEl = Router.getPrevEl();
            obj.$prevEl.transition("none");
            obj.$moveElment.transition("none");
            var _id = Router.getId();

            obj.maskEl = m("[data-router-id=m-router-" + _id + "]");

            if (obj.x < obj.$moveElment.width() * 0.95) {

                obj.isMove = true;
            }
            obj.window_w = m(window).width();
            self.obj = obj;
        }, function (event, obj) {
            if (obj.isX) {
                if (obj.oneTouch === 1) {
                    return;
                }
                if (!obj.xlt && obj.x < 0 && obj.oneTouch === undefined) {
                    obj.xlt = true;obj.oneTouch = 1;
                } else {
                    obj.xlt = false;obj.oneTouch = 2;
                }

                if (obj.xlt && obj.oneTouch === 1) {
                    return;
                }

                var id = parseInt(obj.$moveElment.attr("data-router-id") || -1);
                var _id = Router.getId();
                if (obj.isX && obj.isMove && id === _id) {
                    event.preventDefault();
                    var translateX = obj.moveElmentX + obj.x;
                    obj.$moveElment.removeClass("in");
                    translateX = translateX <= 0 ? 0 : translateX;
                    if (translateX > 0) {
                        obj.$moveElment.addClass("m-router-box-move");
                    }

                    // 移动当前的路由页
                    obj.$moveElment.translateX(translateX).translateZ(0);

                    // 上一个元素的移动
                    Router.isOneMove = false;
                    var rt = translateX / obj.moveElmentWidth;
                    var prevWidth = -obj.$prevEl.width() / 2;
                    var movePrevWidth = prevWidth - prevWidth * rt;
                    if (movePrevWidth > 0) {
                        movePrevWidth = 0;
                    }
                    obj.$prevEl.removeClass("in").translateX(movePrevWidth).translateZ(0);
                }
            }
        }, function (event, obj) {

            if (obj.isX) {
                var t = 0.5;
                var transition = "transform  " + Router.transitionTime * t + "ms ease";
                if (obj.$moveElment.translateX() < obj.$moveElment.width() / 2) {
                    obj.$moveElment.transition(transition);
                    if (!Router.isOneMove) {
                        obj.$moveElment.translateX(0).translateZ(0);
                    }
                    obj.$prevEl.transition(transition);
                    obj.$prevEl.translateX(-obj.$prevEl.width() / 2).translateZ(0);
                } else {
                    Router.back(t, transition);
                }
                obj.isMove = false;
            }

            obj.xlt = null;
            obj.oneTouch = undefined;
            obj.$moveElment.removeClass("m-router-box-move");
        });
    }

    function _setRouterObj(el, obj) {

        m(".m-hd-top-ttl", el).html(obj.routerTilte || "");
        if (obj.routerTilteColor) {
            m(".m-hd-top-ttl", el).css("color", obj.routerTilteColor);
        }
        if (obj.routerClass) {
            m(el).addClass(obj.routerClass);
        }
    }

    function _setUrlParameter(url) {

        var obj = {};
        url = typeof url === "string" ? url : "";
        var urls = url.split("?");
        if (urls.length === 2) {
            var urlList = urls[1];

            var reg = /&+/img;
            var parameters = urlList.split(reg) || [];
            parameters.forEach(function (item) {
                var values = item.split("=");
                obj[values[0]] = decodeURIComponent(values[1]);
            });
        }

        return obj;
    }

    function _getUrlParameter(el) {
        return m(el).data("parameter");
    }

    // 页面加载完成onload
    function _load(obj, urls, onload, isAmd) {

        isAmd = typeof isAmd === "boolean" ? isAmd : false;
        if (isAmd) {
            Router.req(obj, urls, onload);
        } else {
            Router.reqSync(obj, urls, onload);
        }
    }

    // 定义执行函数
    window.define = Router.define = function () {

        var arg1;

        // 定义的函数
        var name = "include_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000);
        if (arguments.length === 1 && typeof arguments[0] === "function") {

            arg1 = arguments[0];
        }

        // 兼容jquery
        if (arguments.length === 3 && typeof arguments[0] === "string" && arguments[1] instanceof Array && typeof arguments[2] === "function") {

            arg1 = arguments[2];
        }

        if (arguments.length >= 1) {
            var src = _getCurrentScript();
            Router.fineObjs[name] = {
                fn: arg1,
                isOnlyRun: true,
                url: src
            };
        }
        return this;
    };

    // amd module extend
    window.define.extend = function (obj) {

        if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
            for (var i in obj) {
                this[i] = obj[i];
            }
        }

        return this;
    };

    // 异步并行加载js  全部加载完成再执行函数
    Router.req = function (obj, urls, fn) {

        obj = obj instanceof Object ? obj : {};
        if (typeof urls === "function") {
            fn = urls;
            urls = [];
        } else {
            urls = urls instanceof Array ? urls : [];
        }

        var $el = Router.getActiveEl(); //m( "#m-router-" + Router.getId());
        _setRouterObj($el, obj);
        // console.log(obj);

        // 遍历器
        var activeUrls = _activeUrls(urls);
        var itr = Router.iterator(activeUrls);

        for (var i = 0; i < activeUrls.length; i++) {
            if (Router.ckUrl(activeUrls[i])) {

                _addAllIterator(itr, fn, activeUrls[i], urls);
            }
        }

        if (activeUrls.length === 0) {
            var parameter = _getUrlParameter($el);
            fn.call($el, $el, parameter);

            // 监听页面显示 触发的事件
            $el.emit("m-router-show", [$el, Router.getId()]);
        }

        // 执行页面的函数
        Router.runBindFn();

        return this;
    };

    // 同步加载js  按顺序加载完成再执行函数
    Router.reqSync = function (obj, urls, fn) {

        obj = obj instanceof Object ? obj : {};
        if (typeof urls === "function") {
            fn = urls;
            urls = [];
        } else {
            urls = urls instanceof Array ? urls : [];
        }

        var $el = Router.getActiveEl(); //m("#m-router-" + Router.getId());
        _setRouterObj($el, obj);

        // 遍历器
        var activeUrls = _activeUrls(urls);
        var itr = Router.iteratorSync(activeUrls);
        var itr2 = itr.next();
        if (!itr2.done) {
            _addAllIteratorSync(itr, fn, itr2.value, urls);
        }

        if (activeUrls.length === 0) {
            var parameter = _getUrlParameter($el);
            fn.apply($el, $el, parameter);
            // 监听页面显示 触发的事件
            $el.emit("m-router-show", [$el, Router.getId()]);
        }

        // 执行页面的函数
        Router.runBindFn();
        return this;
    };

    // run Router.define and  caches
    Router.runIncludeAndCache = function () {

        for (var name in Router.fineObjs) {
            var o = Router.fineObjs[name];
            if ((typeof o === "undefined" ? "undefined" : _typeof(o)) === "object") {
                if (typeof o.fn === "function" && o.isOnlyRun === true) {

                    var res = o.fn();
                    o.isOnlyRun = false;
                    Router.caches.push({
                        v: res,
                        url: o.url
                    });
                }
            }
        }
    };

    // run Router.define
    Router.runInclude = function () {

        for (var name in Router.fineObjs) {
            var o = Router.fineObjs[name];

            if ((typeof o === "undefined" ? "undefined" : _typeof(o)) === "object") {
                if (typeof o.fn === "function" && o.isOnlyRun === true) {
                    o.fn();
                    o.isOnlyRun = false;
                }
            }
        }
    };

    // 遍历器生成函数
    Router.iterator = function (array) {
        var nextIndex = 0;
        return {
            next: function next() {
                var _index = array.length - 1;
                var _nextIndex = nextIndex;
                return nextIndex < array.length ? {
                    value: array[nextIndex++],
                    done: _nextIndex >= _index ? true : false
                } : {
                    value: undefined,
                    done: true
                };
            }
        };
    };

    // 遍历器生成函数
    Router.iteratorSync = function (array) {
        var nextIndex = 0;
        return {
            next: function next() {

                return nextIndex < array.length ? {
                    value: array[nextIndex++],
                    done: false
                } : {
                    value: undefined,
                    done: true
                };
            }
        };
    };

    // 记录路的url的地址对象
    Router.urlObj = {};

    // 添加url的地址
    Router.addUrl = function (id, url) {
        Router.urlObj[id] = url;
    };

    // 清除url的地址
    Router.clearUrl = function (id) {
        delete Router.urlObj[id];
    };

    // 获取当前页url的地址
    Router.getUrl = function () {
        var id = Router.getId();
        if (id === 0) {
            return "首页";
        }
        return Router.urlObj[id];
    };

    // bind 函数
    Router.bindObj = {};
    Router.bindFn = function (fn) {

        if (typeof fn === "function") {
            Array.prototype.push.call(Router.bindObj, fn);
        }
    };

    // 执行 函数
    Router.runBindFn = function (fn) {

        for (var pros in Router.bindObj) {

            if (typeof Router.bindObj[pros] === "function") {
                Router.bindObj[pros]();
            }
        }
    };

    Router.ajax = m.ajax;

    // get ajax
    Router.get = m.get;

    // 清理定时器对象
    Router.intervalObj = {};

    // 记录setInterval定时器 
    Router.setInterval = function (fn, time) {

        var setIntervalId = 0;
        if (typeof fn === "function") {

            time = isNaN(Number(time)) ? 0 : time;
            setIntervalId = setInterval(function () {
                fn();
            }, time);

            var elId = "router_" + m(this).parents(".m-router").attr("data-router-id");
            var intervalIds = Router.intervalObj[elId] ? Router.intervalObj[elId] : [];
            intervalIds.push(setIntervalId);
            Router.intervalObj[elId] = intervalIds;
        }
        return setIntervalId;
    };

    // 记录setTimeout定时器
    Router.setTimeout = function (fn, time) {

        var setTimeoutId = 0;
        if (typeof fn === "function") {

            time = isNaN(Number(time)) ? 0 : time;
            setTimeoutId = setTimeout(function () {
                fn();
            }, time);

            var elId = "router_" + m(this).parents(".m-router").attr("data-router-id");
            var intervalIds = Router.intervalObj[elId] ? Router.intervalObj[elId] : [];
            intervalIds.push(setTimeoutId);
            Router.intervalObj[elId] = intervalIds;
        }
        return setTimeoutId;
    };

    //清除当前页的定时器
    Router.clearInterval = function () {

        var elId = "router_" + Router.getId();
        var intervalIds = Router.intervalObj[elId] ? Router.intervalObj[elId] : [];
        for (var i = 0; i < intervalIds.length; i++) {
            clearInterval(intervalIds[i]);
            clearTimeout(intervalIds[i]);
        }
        Router.intervalObj[elId] = [];
    };

    // html字符串转dom对象
    Router.htmlStringToDOM = function (txt) {

        var df2 = document.createDocumentFragment();
        var df = document.createElement("div");
        var div = document.createElement("div");
        div.innerHTML = txt;
        df.appendChild(div);
        var _nodes = df.getElementsByTagName("div")[0].childNodes;
        for (var i = _nodes.length; i > 0; i--) {
            if (window.addEventListener) {
                df2.insertBefore(_nodes[i - 1], df2.childNodes[0]);
            } else {
                df2.insertBefore(_nodes[i - 1], df2.firstChild);
            }
        }
        df = null;
        return df2;
    };

    // 动态加载html文件
    Router.getHtml = function (obj, src, fn) {

        Router.compilerHtml(obj, src, {}, false, fn);
    };

    // 获取id
    Router.getId = function () {

        if (Router.ids.length > 0) {
            return Router.ids[Router.ids.length - 1];
        }
        return 0;
    };

    // 获取当前激活路由页元素
    Router.getActiveEl = function () {

        return m("#m-router-" + m.router.getId());
    };

    // 设置路由页top区域
    Router.setting = function (settingObj) {
        _setRouterObj(Router.getActiveEl(), settingObj);
    };

    //  a标签 链接属性data-link 跳转
    Router.alink = function () {

        var isHref = m(this).hasAttr("href");
        var hrefValue = m(this).attr("href");
        if (isHref) {
            if (hrefValue.trim() === "" || hrefValue.trim() === "#" || hrefValue.trim() === "javascript:;") {
                return;
            } else {

                //if (m(this).hasAttr("data-router")) {
                m.router.link(hrefValue);
                return;
                //  }
                // window.location.href = hrefValue;
            }
        }
    };

    // 删除id
    Router.removeId = function (id) {

        if (Router.ids.length > 0) {
            var index = Router.ids.findIndex(function (item) {
                return item === id;
            });
            if (index !== -1) {
                return Router.ids.splice(index, 1);
            }
        }
    };

    // 获取上一个路由页面
    Router.getPrevEl = function () {

        if (Router.ids.length > 1) {

            var id = "#m-router-" + (Router.getId() - 1);
            return m(id);
        }

        return m(".m-bd");
    };

    // 添加路由
    Router.link = function (src, parameter, isShowBtn) {

        isShowBtn = typeof isShowBtn === "boolean" ? isShowBtn : true;

        var elm = document.body || document.documentElement;
        var id = Router.getId() + 1;
        var routerMask = document.createElement("div");
        routerMask.classList.add("m-router-mask");
        routerMask.style = "z-index:" + (100 + id);
        routerMask.setAttribute("data-Router-id", "m-router-" + id);
        elm.appendChild(routerMask);

        var routerEl = document.createElement("div");
        Router.ids.push(id);
        routerEl.id = "m-router-" + id;
        routerEl.classList.add("m-router");
        routerEl.classList.add("in");

        routerEl.style = "z-index:" + (100 + id);
        routerEl.setAttribute("data-router-id", id);

        if (isShowBtn) {
            var topEl = document.createElement("div");
            topEl.classList.add("m-router-back");
            topEl.innerHTML = "<div class=\"m-hd-top\">\n            <div class=\"m-hd-top-icon m-router-back-btn\">\n                <span class=\"icon icon-back-left\">\n                </span>\n            </div>\n\n            <h4 class=\"m-hd-top-ttl\">  \n               <div class=\"m-router-loading\"><div class=\"m-ball-clip-rotate\"><div></div></div>\n            </h4>\n            </div>";
            routerEl.appendChild(topEl);
        }

        var contEl = document.createElement("div");
        contEl.classList.add("m-router-back");

        elm.appendChild(routerEl);

        var $prevEl = Router.getPrevEl();
        var transition = "transform  " + Router.transitionTime + "ms ease  800ms";
        $prevEl.removeClass("in").transition(transition).translateX(-$prevEl.width() / 2).translateZ(0);
        Router.isOneMove = true;

        var $el = m("#" + routerEl.id);
        $el.append("<div class=\"m-router-loading\"><div class=\"m-ball-clip-rotate\"><div></div></div>");

        // 设置url的参数
        var urlParameter = _setUrlParameter(src);
        parameter = parameter || {};
        var p = m.extend({}, urlParameter, parameter);
        $el.data("parameter", p);

        // 添加urls地址
        Router.addUrl(id, src);

        // 输出当前的路由页
        console.log("当前的路由页：", Router.getUrl());

        _moveEl($el);
        var context = m("#" + routerEl.id).get(0);
        _compilerHtml(context, src, {}, false, function () {
            m.setRouterLayout();
        }, routerEl.id);
    };

    // 删除路由
    Router.remove = function (el) {

        var id = parseInt(m(el).attr("data-router-id") || -1);
        m(el).remove();
        Router.removeId(id);
        m("[data-router-id=m-router-" + id + "]").remove();
    };

    // 返回上一页
    Router.back = function (t, transition) {
        t = typeof t === "number" ? t : 1;
        if (Router.ids.length <= 0) {
            return;
        }

        var nowTime = new Date().getTime();

        // 相隔延迟时间的点击
        if (nowTime - Router.tapTime > Router.transitionTime) {
            Router.tapTime = nowTime;
            var id = "#m-router-" + Router.getId();
            var $p = m(id);
            transition = transition ? transition : "transform  " + Router.transitionTime * t + "ms linear";
            $p.removeClass("in").transition(transition).translateX($p.width()).translateZ(0);
            var _id = Router.getId();

            // 监听页面隐藏 触发的事件
            $p.emit("m-router-hide", [$p, _id]);

            var $prevEl = Router.getPrevEl();
            $prevEl.transition(transition).translateX(0);
            setTimeout(function () {

                // 清理定时器
                Router.clearInterval();

                m("[data-router-id=m-router-" + _id + "]").remove();
                $p.remove();
                Router.removeId(_id);
                Router.clearUrl(_id);

                // 监听页面显示 触发的事件
                var $preEl = m("#m-router-" + Router.getId());
                $preEl.emit("m-router-show", [$preEl, Router.getId()]);

                // 输出当前的路由页
                console.log("当前的路由页：", Router.getUrl());
            }, Router.transitionTime * t);
        }
    };

    // 生命周期函数
    Router.page = function (options) {

        var setting = options.setting instanceof Object ? options.setting : {};
        var loadJs = options.loadJs instanceof Array ? options.loadJs : [];
        var onLoad = typeof options.onLoad === "function" ? options.onLoad : function () {};
        var onShow = typeof options.onShow === "function" ? options.onShow : function () {};
        var isAmd = typeof options.isAmd === "boolean" ? options.isAmd : true;
        var id = "#m-router-" + Router.getId();

        // onHide
        if (typeof options.onHide === "function") {

            Router.onHide(m(id), options.onHide);
        }

        // onShow
        if (typeof onShow === "function") {
            Router.onShow(m(id), onShow);
        }

        // onLoad
        _load(setting, loadJs, onLoad, isAmd);
    };

    // 生命周期函数--监听页面显示
    Router.onShow = function (el, fn) {

        m(el).on("m-router-show", function (event, $p, id) {
            var _id = Number($p.attr("data-router-id") || -1);
            if (_id === id) {
                fn.call($p, $p);
            }
        });
    };

    // 生命周期函数--监听页面隐藏
    Router.onHide = function (el, fn) {

        m(el).on("m-router-hide", function (event, $p, id) {
            if (Router.getId() === id) {
                fn.call($p, $p);
            }
        });
    };

    Router.app = {}; // 全局对象

    // Router静态扩展
    m.extend({
        router: Router,
        setRouterLayout: function setRouterLayout() {

            // 设置页面布局 整体框架设置内容height
            var $el = m.router.getActiveEl();
            var $bd = $el;
            var $header = $(".m-router-back", $el);
            var $cont = $(".m-router-cnt", $el);
            var $bd_height = parseFloat($bd.height()),
                $header_height = parseFloat($header.height());
            var $cont_height = $bd_height - $header_height;
            $cont.height($cont_height); // set cnt height
            $cont.css("top", $header_height); // set cnt top
        }
    });

    // Router实例扩展
    m.fn.extend({
        setInterval: Router.setInterval,
        setTimeout: Router.setTimeout

    });

    // 初始化默认为m-bd 添加id值
    if (Router.ids.length === 0) {
        var id = "m-router-" + Router.getId();
        m(".m-bd").attr("id", id).attr("data-router-id", Router.getId());
    }

    // 返回上一页
    function mBack() {
        m(document).on("tap", ".m-router-back-btn", function (event) {
            event.preventDefault();
            Router.back();
        });
    }

    mBack(); //返回上一页 
    m.setRouterLayout(); //整体框架设置内容
    m(window).on("resize", m.setRouterLayout);

    // 绑定函数 router.link 运行时执行 
    m.router.bindFn(function () {

        //获取当前激活路由页元素
        var $activeEl = m.router.getActiveEl();
        // m-media组件 a[data-link] 链接跳转
        m(".m-media-list", $activeEl).on("tap", "a[data-link]", function (event) {

            event.preventDefault();
            event.stopPropagation();
            m.router.alink.call(this);
        });

        // m-slide组件 a[data-link] 链接跳转
        m(".m-slide", $activeEl).on("tap", "a[data-link]", function (event) {

            event.preventDefault();
            event.stopPropagation();
            m.router.alink.call(this);
        });

        // m-listoption组件 a[data-link] 链接跳转
        m(".m-listoption", $activeEl).on("tap", "a[data-link]", function (event) {

            event.preventDefault();
            event.stopPropagation();
            m.router.alink.call(this);
        });
    });
}();

$(function () {

    function setLayout() {

        // 整体框架设置内容height
        var $bd = $(".m-bd");
        var $header = $(".m-hd");
        var $cont = $(".m-cnt");
        var $footer = $(".m-ft");

        var $bd_height = parseFloat($bd.height()),
            $header_height = parseFloat($header.height()),
            $foote_height = parseFloat($footer.height());
        var $cont_height = $bd_height - ($header_height + $foote_height);

        $cont.height($cont_height); // set cnt height
        $cont.css("top", $header_height); // set cnt top
    }

    // 设置页面布局
    m.extend({
        setLayout: setLayout
    });

    m.setLayout();
    m(window).on("resize", m.setLayout);

    m(document).on("touchstart", function (event) {
        event.preventDefault();
    });

    m(document).on("touchmove", function (event) {
        event.preventDefault();
    });

    m(document).on("click", "a", function (event) {
        if (!m(this).hasAttr("data-open")) {
            event.preventDefault();
        }
    });

    // 移动端

    //if (!m.isMobile()) {
    //    location.href = "./demo/not_mobile.html";
    //}

    // 微信端
    //if (!m.isWeixn()) {
    //    location.href = "./demo/not_weixin.html";
    //}


    /*************** h5+ 应用以下**************/

    // 扩展API是否准备好，如果没有则监听“plusready"事件
    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener("plusready", plusReady, false);
    }

    // 是否手指触摸页面
    m.router.istouch = false;

    m(document).touch(function () {}, function (event, obj) {
        if (obj.isX) {
            m.router.istouch = true;
        }
    }, function () {
        m.router.istouch = false;
    });

    function plusReady() {

        // 监听“返回”按钮事件
        plus.key.addEventListener("backbutton", function () {

            if (m.router.istouch) {
                return;
            } // 是否手指触摸页面
            if (m.router.ismask) {
                return;
            } // 是否已经显示mask
            m.router.back();

            // 退出app应用 
            if (m.router.getId() === 0) {
                // 退出应用
                if (!m.router._quitOne) {

                    m.router._quitTime1 = new Date().getTime();
                    m.router._quitOne = true;
                    //console.log(m.router._quitTime1);
                } else {
                    m.router._quitTime2 = new Date().getTime();

                    if (m.router._quitTime2 - m.router._quitTime1 < 3000) {
                        plus.runtime.quit();return;
                    }
                    m.router._quitTime1 = new Date().getTime();
                }
            }
        });
    }
});

// m-slide 

+function () {

    var MSlide = function MSlide(el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MSlide.prototype.run = function () {

        var self = this;
        var $m_touch_slide = m(this.el);
        var $moveElement = $m_touch_slide.find(".m-slide-cnt");
        self.raduisLength = $moveElement.find(".m-slide-item").length;

        // 一张轮播
        if (self.raduisLength <= 1) {
            $moveElement[0].innerHTML += $moveElement[0].innerHTML;
            $moveElement[0].innerHTML += $moveElement[0].innerHTML;
        } else {
            $moveElement[0].innerHTML += $moveElement[0].innerHTML;
        }

        this.liNodes = $m_touch_slide.find(".m-slide-item");
        this.index = this.liNodes.length / 2;
        $moveElement.translateX(-this.index * $m_touch_slide.outerWidth());

        // 添加小圆点
        var rd = document.createElement("div");
        rd.classList.add("m-slide-radius");
        for (var i = 0; i < self.raduisLength; i++) {
            var span = document.createElement("span");
            if (i === 0) {
                span.classList.add("active");
            }
            rd.appendChild(span);
        }
        $m_touch_slide.append(rd);

        // 重设窗口大小
        this.resize();
        m(window).resize(m.proxy(function () {
            this.resize();
        }, this));

        // 自动轮播
        if (self.options.auto) {
            this.autoSlide(); // m.router.addInterval($m_touch_slide,setIntervalId); // 记录定时器
        }

        $m_touch_slide.touch(function (event, obj) {
            if (self.options.auto) {
                // 停止轮播
                clearInterval(self.setIntervalId);
            }

            var window_w = $m_touch_slide.outerWidth();
            if (self.index === 0) {
                self.index = self.raduisLength;
                $moveElement.transition("none");
                $moveElement.translateX(-self.index * window_w);
            } else if (self.index >= self.liNodes.length - 1) {

                self.index = self.raduisLength - 1;
                $moveElement.transition("none");
                $moveElement.translateX(-self.index * window_w);
            }

            obj.moveElmentX = $moveElement.translateX();
            obj.$moveElment = $moveElement;
            obj.$moveElment.transition("none");
            self.obj = obj;

            // 触发自定义的事件
            m(this).emit("start.m.touch.slide", [this, obj.moveElmentX, obj]);
        }, function (event, obj) {

            if (obj.isX) {
                event.preventDefault();
                event.stopPropagation();
                // 停止轮播
                if (self.options.auto) {
                    clearInterval(self.setIntervalId);
                }

                var wraperWidth = $m_touch_slide.outerWidth();
                var maxLeft = -(self.index - 1) * wraperWidth;
                var maxRight = -(self.index + 1) * wraperWidth;
                obj.$moveElment.transition("none");
                var translateX = obj.moveElmentX + obj.x;

                // 左限住拉动
                translateX = translateX >= maxLeft ? maxLeft : translateX;

                // 右限住拉动
                translateX = translateX <= maxRight ? maxRight : translateX;

                obj.$moveElment.translateX(translateX);

                // 触发自定义的事件
                m(this).emit("move.m.touch.slide", [this, translateX, obj]);
            }
        }, function (event, obj) {

            if (obj.isX) {

                var wraperWidth = $m_touch_slide.outerWidth();
                var target = obj.$moveElment.translateX();
                var translateIndex = Math.round(target / wraperWidth);
                var translateX = wraperWidth * translateIndex;
                $moveElement.translateX(translateX);
                $moveElement.transition("transform .4s cubic-bezier(.31,.66,.64,.98)");

                var _index = Math.abs(translateIndex) % self.raduisLength;
                self.setRadius(_index);

                // 触发自定义的事件
                m(this).emit("tab.m.touch.slide", [this, _index]);

                self.index = Math.abs(translateIndex);

                // 触发自定义的事件
                m(this).emit("end.m.touch.slide", [this, translateX, obj]);
            }

            // 开启轮播
            if (self.options.auto) {
                self.autoSlide();
            }
        });
    };

    MSlide.prototype.setRadius = function (index) {

        m(this.el).find(".m-slide-radius span").removeClass("active").eq(index).addClass("active");
    };

    MSlide.prototype.resize = function () {

        var $m_touch_slide = m(this.el);
        var $touch_slide_item = $m_touch_slide.find(".m-slide-item");
        $touch_slide_item.width($m_touch_slide.outerWidth());
        $touch_slide_item.height($m_touch_slide.outerHeight());
    };

    MSlide.prototype.autoSlide = function (index) {
        var self = this;
        var $m_touch_slide = m(this.el);
        var $moveElement = $m_touch_slide.find(".m-slide-cnt");
        var window_w = $m_touch_slide.outerWidth();

        return self.setIntervalId = $m_touch_slide.setInterval(function () {

            if (self.index === 0) {
                self.index = self.raduisLength;
                $moveElement.transition("none");
                $moveElement.translateX(-self.index * window_w);
            } else if (self.index >= self.liNodes.length - 1) {

                self.index = self.raduisLength - 1;
                $moveElement.transition("none");
                $moveElement.translateX(-self.index * window_w);
            }

            self.index++;
            $m_touch_slide.setTimeout(function () {
                $moveElement.transition("transform .8s cubic-bezier(.31,.66,.64,.98)");
                $moveElement.translateX(-self.index * window_w);

                // 触发自定义的事件
                var _index = self.index % self.raduisLength;
                $moveElement.emit("tab.m.slide", [$moveElement.get(0), _index]);
                self.setRadius(_index);
            }, 20);
        }, self.options.time);
    };

    MSlide.DEFAULTS = {
        time: 3000
    };

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-slide');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;

            if (!data) {
                var o = {};
                o.time = parseFloat($this.hasAttr("data-time") || 0) || MSlide.DEFAULTS.time;
                o.auto = $this.hasAttr("data-auto");
                var p = $.extend({}, o, options);
                $this.data('m-slide', data = new MSlide(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    }

    var _mSlide = $.fn.mSlide;
    m.fn.mSlide = Plugin;

    m("[data-toggle=m-slide]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });
}();

// m-touch-lr 菜单左右滑动

+function () {

    var MTouchLr = function MTouchLr(el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MTouchLr.prototype.run = function () {
        var self = this;
        var $m_touch_lr = m(this.el);
        var $moveElement = $m_touch_lr.find(".m-touch-lr-cnt");

        m(this.el).find(".m-touch-lr-item").on("tap", function (event) {

            event.stopPropagation();
            // 选中的样式移动
            if (self.options.left) {
                self.left.call(self, m(this).index()); // 移动到left
            } else {
                self.center.call(self, m(this).index()); // 移动到center
            }
        });

        self.speedSetIntervalId = 0; // 计算速度定时器id
        $m_touch_lr.touch(function (event, obj, preoObj) {
            event.preventDefault();
            obj.$moveElment = $moveElement;
            obj.moveElmentX = $moveElement.translateX();
            obj.moveElmentWidth = obj.$moveElment.outerWidth();
            obj.wraperWidth = $m_touch_lr.outerWidth();
            obj.moveXSpace = obj.wraperWidth - obj.moveElmentWidth;

            // 弹性拉动left
            if (preoObj.tempObj.length > 1 && obj.moveElmentX > 0) {
                obj.moveElmentX = obj.moveElmentX2;
                obj.moveElmentX2 = 0;
            }

            // 弹性拉动right
            if (preoObj.tempObj.length > 1 && obj.moveElmentWidth > obj.wraperWidth && obj.moveElmentX < obj.moveXSpace) {
                obj.moveElmentX = obj.moveElmentX2;
                obj.moveElmentX2 = 0;
            }

            self.obj = obj;

            // 计算移动速度
            self.speedlateY = obj.x = 0;
            clearInterval(self.speedSetIntervalId);
            self.speedSetIntervalFisrt = true;
            self.speedlateX = 0;
            self.speedScroll = 0;
            self.speedlateX2 = 0;
            self.speedlateX3 = 0;

            // 计算移动速度
            if (self.speedSetIntervalFisrt) {
                self.speedSetIntervalFisrt = false;
                self.speedSetIntervalId = obj.$moveElment.setInterval(function () {
                    self.speedlateX2 = obj.x || 0;
                    self.speedlateX3 = parseFloat(self.speedlateX2) - parseFloat(self.speedlateX);
                    self.speedlateX = self.speedlateX2;
                    self.speedScroll = self.speedlateX3;
                }, 50);
            }

            // 触发自定义的事件
            m(this).emit("start.m.touch.lr", [this, obj.moveElmentX, obj]);
        }, function (event, obj) {

            if (obj.isX) {
                event.preventDefault();
                event.stopPropagation();
                obj.$moveElment.transition("none");
                var translateX = obj.moveElmentX + obj.x;

                // 左限住拉动
                if (self.options.limitLeft) {
                    translateX = translateX > 0 ? 0 : translateX;
                }

                // 右限住拉动
                if (self.options.limitRight) {

                    if (obj.moveElmentWidth > obj.wraperWidth && translateX < obj.moveXSpace) {
                        translateX = obj.moveXSpace;
                    }
                }

                // 移动滑动条
                if (self.options.bar) {
                    self.moveBar(translateX).transition("none");
                }

                // 左限弹性拉动
                if (translateX > 0) {
                    obj.moveElmentX2 = translateX;
                    var biliLeft = translateX / obj.wraperWidth;
                    translateX = obj.wraperWidth * self.options.limit * biliLeft;
                }

                // 右限弹性拉动
                if (obj.moveElmentWidth > obj.wraperWidth && translateX < obj.moveXSpace) {

                    var moveRightVal = translateX - obj.moveXSpace;
                    obj.moveElmentX2 = translateX;
                    var biliRight = Math.abs(moveRightVal) / obj.wraperWidth;
                    translateX = obj.wraperWidth * (1 - self.options.limit) * biliRight + translateX;
                }

                obj.$moveElment.translateX(translateX);
                // 触发自定义的事件
                m(this).emit("move.m.touch.lr", [this, translateX, obj]);
            }
        }, function (event, obj) {

            if (obj.isX) {
                var target = obj.$moveElment.translateX();

                // 计算移动速度
                self.speedSetIntervalFisrt = true;
                clearInterval(self.speedSetIntervalId);
                target = target + self.speedScroll * 11; //修改速度值 

                // 滑动过度效果
                var gudingVal = obj.wraperWidth;
                var translateX = $moveElement.translateX();
                var moveVal = 0;

                if (target > 0) {
                    target = 0;
                    moveVal = target - translateX;
                } else {

                    target = target < obj.moveXSpace ? obj.moveXSpace : target;
                    moveVal = target - translateX;
                    moveVal = Math.abs(moveVal);
                }

                var beishu = Math.abs(moveVal) / gudingVal;
                var ansTime = 600 * beishu;
                if (moveVal < gudingVal) {
                    ansTime = 600;
                }
                ansTime = ansTime > 2000 ? 2000 : ansTime;

                // 移动宽度小于大框
                if (obj.moveElmentWidth < obj.wraperWidth) {
                    target = 0;
                    ansTime = 600;
                }

                // 拉到左边 触发自定义的事件
                if (target >= 0) {
                    $moveElement.transition("transform " + ansTime + "ms " + MTouchLr.DEFAULTS.cubicBezierEnd);
                    $moveElement.setTimeout(function () {
                        $moveElement.emit("reachleft.m.touch.lr", [$moveElement, target, obj]);
                    }, ansTime);
                }

                // 拉到底部 触发自定义的事件
                else if (target <= obj.moveXSpace) {
                        $moveElement.transition("transform " + ansTime + "ms " + MTouchLr.DEFAULTS.cubicBezierEnd);
                        $moveElement.setTimeout(function () {
                            $moveElement.emit("reachright.m.touch.lr", [$moveElement, target, obj]);
                        }, ansTime);
                    } else {
                        $moveElement.transition("transform " + ansTime + "ms " + MTouchLr.DEFAULTS.cubicBezierMiddle);
                    }

                if (self.options.touchTap) {
                    var translateIndex = Math.round(target / obj.wraperWidth);
                    $moveElement.translateX(obj.wraperWidth * translateIndex);
                } else {
                    $moveElement.translateX(target);
                }

                // 触发自定义的事件
                m(this).emit("end.m.touch.nav", [this, target, obj]);
            }
        });
    };

    MTouchLr.DEFAULTS = {
        cubicBezierMiddle: "  cubic-bezier(0,.05,.31,.93)",
        cubicBezierEnd: "  cubic-bezier(0,.03,.27,1.22)",
        limit: 0.4
    };

    // position left
    MTouchLr.prototype.left = function (index, bl) {
        var $ul = m(this.el).find(".m-touch-lr-cnt");
        var $li = $ul.find(".m-touch-lr-item").eq(index);
        var window_w = m(this.el).outerWidth();

        var $ul_w = $ul.outerWidth();
        var current_left = $li.offset().left;
        var scroll_left = $ul_w - window_w;
        var moveX = 0;
        $li.addClass("active").siblings().removeClass("active");
        if ($ul_w > window_w) {

            if (Math.abs(current_left) < Math.abs(scroll_left)) {
                moveX = -current_left;
            } else {
                moveX = -scroll_left;
            }

            $ul.translateX(moveX);
            $ul.transition("all", 600, "ease");
        }

        // 触发自定义的事件
        if (!bl) {
            $li.emit("tap.m.touch.lr", [$li.get(0), moveX]);
        }
    };

    // position center
    MTouchLr.prototype.center = function (index, bl) {

        var $ul = m(this.el).find(".m-touch-lr-cnt");
        var $li = $ul.find(".m-touch-lr-item").eq(index);
        var window_w = m(this.el).outerWidth();
        var $ul_w = $ul.outerWidth();
        var current_left = $li.offset().left;
        var current_w = $li.outerWidth();
        var current_center = Math.abs(window_w / 2);
        var offsetCenter = current_left - current_center + current_w / 2;
        var scroll_left = $ul_w - window_w;
        $li.addClass("active").siblings().removeClass("active");

        var moveX = 0;
        if ($ul_w > window_w) {

            if (Math.abs(current_left) > Math.abs(current_center)) {

                if (Math.abs(scroll_left) < offsetCenter) {
                    moveX = -Math.abs(scroll_left);
                } else {
                    moveX = -Math.abs(-offsetCenter);
                }
            } else {
                moveX = 0;
            }
            $ul.translateX(moveX);
            $ul.transition("all", 600, "ease");
        }

        // 触发自定义的事件
        if (!bl) {
            $li.emit("tap.m.touch.lr", [$li.get(0), moveX]);
        }
    };

    MTouchLr.prototype.set = function (index, bl) {
        var self = this;

        // 选中的样式移动
        if (self.options.left) {
            self.left.call(self, index, bl); // 移动到left
        } else {
            self.center.call(self, index, bl); // 移动到center
        }
    };

    function Plugin(option, index, bl) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-lr');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;

            if (!data) {
                var o = {};
                o.limitLeft = $this.hasAttr("data-limit-left");
                o.limitRight = $this.hasAttr("data-limit-right");
                o.left = $this.hasAttr("data-left");
                o.limit = $this.attr("data-limit") ? Number($this.attr("data-limit")) : MTouchLr.DEFAULTS.limit;

                var p = $.extend({}, o, options);
                $this.data('m-touch-lr', data = new MTouchLr(this, p));
            }

            if (typeof option === 'string') {
                data[option](index, bl);
            }
        });
    }

    var _mTouchLr = $.fn.mTouchLr;
    m.fn.mTouchLr = Plugin;

    m("[data-toggle=m-touch-lr]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });
}();

// m-touch-nav-tb

+function () {

    var MToucTb = function MToucTb(el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MToucTb.prototype.run = function () {
        var self = this;
        var $m_touch_tb = m(this.el);
        var $moveElement = $m_touch_tb.find(".m-touch-tb-cnt");

        m(this.el).find(".m-touch-tb-item").on("tap", function (event) {

            event.stopPropagation();

            // 选中的样式移动
            if (self.options.top) {

                self.top.call(self, m(this).index()); // 移动到top
            } else {

                self.center.call(self, m(this).index()); // 移动到center
            }
        });

        self.speedSetIntervalId = 0; // 计算速度定时器id
        $m_touch_tb.touch(function (event, obj, preoObj) {

            obj.$moveElment = $moveElement;
            obj.moveElmentY = $moveElement.translateY();
            obj.moveElmentHeigth = obj.$moveElment.outerHeight();
            obj.wraperHeight = $m_touch_tb.outerHeight();
            obj.moveYSpace = obj.wraperHeight - obj.moveElmentHeigth;

            // 弹性拉动top
            if (preoObj.tempObj.length > 1 && obj.moveElmentY > 0) {
                obj.moveElmentY = obj.moveElmentY2;
                obj.moveElmentY2 = 0;
            }

            // 弹性拉动bottom
            if (preoObj.tempObj.length > 1 && obj.moveElmentHeigth > obj.wraperHeight && obj.moveElmentY < obj.moveYSpace) {
                obj.moveElmentY = obj.moveElmentY2;
                obj.moveElmentY2 = 0;
            }

            self.obj = obj;

            // 计算移动速度
            self.speedlateY = obj.y = 0;
            clearInterval(self.speedSetIntervalId);
            self.speedSetIntervalFisrt = true;
            self.speedlateY = 0;
            self.speedScroll = 0;
            self.speedlateY2 = 0;
            self.speedlateY3 = 0;

            // 计算移动速度
            if (self.speedSetIntervalFisrt) {
                self.speedSetIntervalFisrt = false;
                self.speedSetIntervalId = obj.$moveElment.setInterval(function () {
                    self.speedlateY2 = obj.y || 0;
                    self.speedlateY3 = parseFloat(self.speedlateY2) - parseFloat(self.speedlateY);
                    self.speedlateY = self.speedlateY2;
                    self.speedScroll = self.speedlateY3;
                }, 50);
            }

            // 触发自定义的事件
            m(this).emit("start.m.touch.tb", [this, obj.moveElmentY, obj]);
        }, function (event, obj) {

            if (obj.isY) {
                event.preventDefault();
                obj.$moveElment.transition("none");
                var translateY = obj.moveElmentY + obj.y;

                // 上限住拉动
                if (self.options.limitTop) {
                    translateY = translateY > 0 ? 0 : translateY;
                }

                // 下限住拉动
                if (self.options.limitBottom) {

                    if (obj.moveElmentHeigth > obj.wraperHeight && translateY < obj.moveYSpace) {
                        translateY = obj.moveYSpace;
                    }
                }

                // 上限弹性拉动
                if (translateY > 0) {
                    obj.moveElmentY2 = translateY;
                    var biliTop = translateY / obj.wraperHeight;
                    translateY = obj.wraperHeight * self.options.limit * biliTop;
                    // 触发自定义的事件
                    m(this).emit("limit.m.touch.tb", [this, translateY, obj]);
                }

                // 下限弹性拉动
                if (obj.moveElmentHeigth > obj.wraperHeight && translateY < obj.moveYSpace) {
                    var moveBottomVal = translateY - obj.moveYSpace;
                    obj.moveElmentY2 = translateY;
                    var biliBottom = Math.abs(moveBottomVal) / obj.wraperHeight;
                    translateY = obj.wraperHeight * (1 - self.options.limit) * biliBottom + translateY;

                    // 触发自定义的事件
                    m(this).emit("limit.m.touch.tb", [this, translateY, obj]);
                }

                obj.$moveElment.translateY(translateY);
                // 触发自定义的事件
                m(this).emit("move.m.touch.tb", [this, translateY, obj]);
            }
        }, function (event, obj) {

            if (obj.isY) {
                var target = obj.$moveElment.translateY();

                // 计算移动速度
                self.speedSetIntervalFisrt = true;
                clearInterval(self.speedSetIntervalId);
                target = target + self.speedScroll * 11; //修改速度值 

                // 滑动过度效果
                var gudingVal = obj.wraperHeight;
                var translateY = obj.$moveElment.translateY();
                var moveVal = 0;
                if (target > 0) {
                    target = 0;
                    moveVal = target - translateY;
                } else {

                    target = target < obj.moveYSpace ? obj.moveYSpace : target;
                    moveVal = target - translateY;
                    moveVal = Math.abs(moveVal);
                }

                var beishu = Math.abs(moveVal) / gudingVal;
                var ansTime = 600 * beishu;
                if (moveVal < gudingVal) {
                    ansTime = 600;
                }
                ansTime = ansTime > 2000 ? 2000 : ansTime;

                // 移动高度小于大框
                if (obj.moveElmentHeigth <= obj.wraperHeight) {
                    target = 0;
                    ansTime = 600;
                }

                if (target >= 0) {
                    $moveElement.transition("transform " + ansTime + "ms " + MToucTb.DEFAULTS.cubicBezierEnd);
                } else if (target <= obj.moveYSpace) {
                    $moveElement.transition("transform " + ansTime + "ms " + MToucTb.DEFAULTS.cubicBezierEnd);
                } else {
                    $moveElement.transition("transform " + ansTime + "ms " + MToucTb.DEFAULTS.cubicBezierMiddle);
                }

                obj.$moveElment.translateY(target);

                // 触发自定义的事件
                var $this = m(this);
                $this.emit("end.m.touch.tb", [$this, target, obj]);

                // 拉到顶部 触发自定义的事件
                if (target >= 0) {
                    $this.setTimeout(function () {
                        $this.emit("reachtop.m.touch.tb", [$this, target, obj]);
                    }, ansTime);
                }

                // 拉到底部 触发自定义的事件
                if (target <= obj.moveYSpace) {
                    $this.setTimeout(function () {
                        $this.emit("reachbottom.m.touch.tb", [$this, target, obj]);
                    }, ansTime);
                }
            }
        });
    };

    MToucTb.DEFAULTS = {
        cubicBezierMiddle: "  cubic-bezier(0,.05,.31,.93)",
        cubicBezierEnd: "  cubic-bezier(0,.03,.27,1.22)",
        limit: 0.3
    };

    // position 
    MToucTb.prototype.top = function (index, bl) {

        var $ul = m(this.el).find(".m-touch-tb-cnt");
        var $li = $ul.find(".m-touch-tb-item").eq(index); //m(item);
        var window_h = m(this.el).outerHeight();
        var $ul_h = $ul.outerHeight();
        var current_top = $li.offset().top;
        var scroll_top = $ul_h - window_h;
        var moveY = 0;

        $li.addClass("active").siblings().removeClass("active");

        if ($ul_h < window_h) {
            moveY = 0;
        } else {
            if (current_top < scroll_top) {
                moveY = -current_top;
            } else {
                moveY = -scroll_top;
            }

            $ul.translateY(moveY);
            $ul.transition("all", 600, "ease");
        }

        // 触发自定义的事件
        if (!bl) {
            $li.emit("tap.m.touch.tb", [$li.get(0), moveY]);
        }
    };

    // position center
    MToucTb.prototype.center = function (index, bl) {

        var $ul = m(this.el).find(".m-touch-tb-cnt");
        var $li = $ul.find(".m-touch-tb-item").eq(index); //m(item);
        var window_h = m(this.el).outerHeight();
        var $ul_h = $ul.outerHeight();
        var current_top = $li.offset().top;
        var current_h = $li.outerHeight();
        var current_center = Math.abs(window_h / 2);
        var offsetCenter = current_top - current_center + current_h / 2;
        var scroll_top = $ul_h - window_h;
        $li.addClass("active").siblings().removeClass("active");

        var moveY = 0;
        if ($ul_h > window_h) {

            if (Math.abs(current_top) > Math.abs(current_center)) {

                if (Math.abs(scroll_top) < offsetCenter) {
                    moveY = -Math.abs(scroll_top);
                } else {
                    moveY = -Math.abs(-offsetCenter);
                }
            } else {

                moveY = 0;
            }

            $ul.translateY(moveY);
            $ul.transition("all", 600, "ease");
        }

        // 触发自定义的事件
        if (!bl) {
            $li.emit("tap.m.touch.tb", [$li.get(0), moveY]);
        }
    };

    MToucTb.prototype.set = function (el, bl) {
        var self = this;
        // 选中的样式移动
        if (self.options.top) {

            self.top.call(self, el, bl); // 移动到left
        } else {

            self.center.call(self, el, bl); // 移动到center
        }
    };

    function Plugin(option, index, bl) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-tb');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;

            if (!data) {
                var o = {};
                o.limitTop = $this.hasAttr("data-limit-top");
                o.limitBottom = $this.hasAttr("data-limit-bottom");
                o.top = $this.hasAttr("data-top");
                o.limit = $this.attr("data-limit") ? Number($this.attr("data-limit")) : MToucTb.DEFAULTS.limit;
                var p = $.extend({}, o, options);
                $this.data('m-touch-tb', data = new MToucTb(this, p));
            }

            if (typeof option === 'string') {
                data[option](index, bl);
            }
        });
    }

    var _mTouchTb = $.fn.mTouchTb;
    m.fn.mTouchTb = Plugin;

    m("[data-toggle=m-touch-tb]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });
}();

+function () {

    var MTableView = function MTableView(el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MTableView.prototype.run = function () {
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

        m(this.el).on("tap", "a[data-link]", function (event) {

            event.preventDefault();

            var isHref = m(this).hasAttr("href");
            var hrefValue = m(this).attr("href");
            if (isHref) {
                if (hrefValue.trim() === "" || hrefValue.trim() === "#" || hrefValue.trim() === "javascript;") {
                    return;
                } else {
                    m.router.link(hrefValue);
                    return;
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
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;

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
    m.fn.mTableView = Plugin;

    m("[data-toggle=m-table-view]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });
}();

// m-touch-tab

+function () {

    var MTouchTab = function MTouchTab(el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MTouchTab.prototype.run = function () {
        var self = this;
        var $m_touch_lr = m(this.el);
        var $moveElement = $m_touch_lr.find(".m-touch-tab-cnt");

        $m_touch_lr.find(".m-touch-tab-item").width($m_touch_lr.outerWidth());

        m(window).resize(function () {
            $m_touch_lr.find(".m-touch-tab-item").width($m_touch_lr.outerWidth());
        });

        $m_touch_lr.touch(function (event, obj, preoObj) {

            obj.moveElmentX = $moveElement.translateX();
            obj.$moveElment = $moveElement;
            obj.$moveElment.transition("none");
            obj.moveElmentWidth = obj.$moveElment.outerWidth();
            obj.wraperWidth = $m_touch_lr.outerWidth();
            obj.moveXSpace = obj.wraperWidth - obj.moveElmentWidth;

            // 弹性拉动top
            if (preoObj.tempObj.length > 1 && obj.moveElmentX > 0) {
                obj.moveElmentX = obj.moveElmentX2;
                obj.moveElmentX2 = 0;
            }

            // 弹性拉动bottom
            if (preoObj.tempObj.length > 1 && obj.moveElmentWidth > obj.wraperWidth && obj.moveElmentX < obj.moveXSpace) {
                obj.moveElmentX = obj.moveElmentX2;
                obj.moveElmentX2 = 0;
            }

            self.obj = obj;

            // 触发自定义的事件
            m(this).emit("start.m.touch.tab", [this, obj.moveElmentX, obj]);
        }, function (event, obj) {

            if (obj.isX) {
                event.preventDefault();

                // 阻外层冒泡
                if (obj.oneTouch === 1) {
                    return;
                }
                if ($moveElement.translateX() === 0 && obj.x > 0 && obj.oneTouch === undefined) {
                    obj.oneTouch = 1;
                } else {
                    obj.oneTouch = 2;
                }

                if (obj.oneTouch === 1) {

                    return;
                }
                if (obj.oneTouch === 2) {
                    event.stopPropagation();
                }

                obj.$moveElment.transition("none");
                var translateX = obj.moveElmentX + obj.x;

                // 左限弹性拉动
                if (translateX > 0) {
                    obj.moveElmentX2 = translateX;
                    var biliLeft = translateX / obj.wraperWidth;
                    translateX = obj.wraperWidth * self.options.limit * biliLeft;
                }

                // 右限弹性拉动
                if (obj.moveElmentWidth > obj.wraperWidth && translateX < obj.moveXSpace) {
                    var moveRightVal = translateX - obj.moveXSpace;
                    obj.moveElmentX2 = translateX;
                    var biliRight = Math.abs(moveRightVal) / obj.wraperWidth;
                    translateX = obj.wraperWidth * (1 - self.options.limit) * biliRight + translateX;
                }

                obj.$moveElment.translateX(translateX);
                // 触发自定义的事件
                m(this).emit("move.m.touch.tab", [this, translateX, obj]);
            }
        }, function (event, obj) {

            if (obj.isX) {

                var target = obj.$moveElment.translateX();
                var transition = "transform .4s " + MTouchTab.DEFAULTS.cubicBezier;
                if (target > 0) {
                    target = 0;
                } else if (target < obj.moveYSpace) {
                    target = moveYSpace;
                    if (obj.moveElmentWidth < obj.wraperWidth) {
                        target = 0;
                    }
                }

                var translateIndex = Math.round(target / obj.wraperWidth);
                var moveVal = obj.wraperWidth * translateIndex;
                moveVal = obj.moveXSpace >= moveVal ? obj.moveXSpace : moveVal;

                var maxIndex = -(Math.round(obj.moveElmentWidth / obj.wraperWidth) - 1);
                translateIndex = translateIndex <= maxIndex ? maxIndex : translateIndex;
                $moveElement.translateX(moveVal);
                $moveElement.transition(transition);

                // 触发自定义的事件
                var $activeEl = $moveElement.find(".m-touch-tab-item").eq(Math.abs(translateIndex));
                m(this).emit("tab.m.touch.tab", [$activeEl, Math.abs(translateIndex)]);

                // 设置选择的样式
                $activeEl.addClass("active").siblings().removeClass("active");

                // 移动滑动条
                if (self.options.bar) {
                    self.moveBar(target).transition(transition);
                }

                // 触发自定义的事件
                m(this).emit("end.m.touch.tab", [this, target, obj]);
                obj.oneTouch = undefined;
            }
        });
    };

    MTouchTab.DEFAULTS = {
        cubicBezier: " ease",
        limit: 0.15
    };

    MTouchTab.prototype.set = function (translateIndex) {

        var $m_touch_lr = m(this.el);
        var wraperWidth = m(this.el).outerWidth();
        var $moveElment = $m_touch_lr.find(".m-touch-tab-cnt");
        var moveXSpace = wraperWidth - $moveElment.outerWidth();
        var moveVal = -wraperWidth * translateIndex;
        moveVal = moveXSpace >= moveVal ? moveXSpace : moveVal;
        $moveElment.translateX(moveVal);
        $moveElment.transition("transform  .4s " + MTouchTab.DEFAULTS.cubicBezier);
        if (this.options.fade) {
            $moveElment.transition("opacity  .4s " + MTouchTab.DEFAULTS.cubicBezier);
        }

        // 触发自定义的事件
        var $activeEl = $moveElment.find(".m-touch-tab-item").eq(Math.abs(translateIndex));

        // 设置选择的样式
        $activeEl.addClass("active").siblings().removeClass("active");
    };

    function Plugin(option, index) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-tab');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
            if (!data) {
                var o = {};
                o.limit = $this.attr("data-limit") ? Number($this.attr("data-limit")) : MTouchTab.DEFAULTS.limit;
                var p = $.extend({}, o, options);
                $this.data('m-touch-tab', data = new MTouchTab(this, p));
            }

            if (typeof option === 'string') {
                data[option](index);
            }
        });
    }

    var _mTouchTab = $.fn.mTouchTab;
    m.fn.mTouchTab = Plugin;

    m("[data-toggle=m-touch-tab]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });
}();

// m-touch-tab-btn

+function () {

    var MTouchTabBtn = function MTouchTabBtn(el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MTouchTabBtn.prototype.run = function () {
        var self = this;
        var $m_touch_tab_btn = m(this.el);

        if (self.options.line) {

            var line = document.createElement("div");
            line.classList.add("m-touch-tab-btn-line");
            $m_touch_tab_btn.append(line);
            var item_w = $m_touch_tab_btn.find(".m-touch-tab-btn-item").outerWidth();

            m(line).width(item_w * .4).css("left", item_w * .6 / 2);

            m(window).resize(function () {
                var resize_item_w = $m_touch_tab_btn.find(".m-touch-tab-btn-item").outerWidth();
                m(line).width(resize_item_w * .4).css("left", resize_item_w * .6 / 2);
            });
        }

        $m_touch_tab_btn.on("tap", ".m-touch-tab-btn-item", function (event) {
            event.preventDefault();
            self.active(m(this).index());
        });
    };

    MTouchTabBtn.prototype.set = function (index) {

        this.active(index);
    };

    MTouchTabBtn.prototype.active = function (index) {

        var self = this;
        var $el = m(self.el).find(".m-touch-tab-btn-item").eq(index);
        $el.addClass("active").siblings().removeClass("active");

        if (self.options.line) {
            var w = m(self.el).find(".m-touch-tab-btn-item").outerWidth();
            m(self.el).find(".m-touch-tab-btn-line").translateX(w * index);
            m(self.el).find(".m-touch-tab-btn-line").transition("transform .4s ease");
        }

        // 触发自定义的事件
        m(this.el).emit("tap.m.touch.tab.btn", [$el, index]);
    };

    MTouchTabBtn.prototype.move = function (ratio, index) {

        var self = this;
        var w = m(self.el).outerWidth();
        m(self.el).find(".m-touch-tab-btn-line").translateX(-w * ratio);
        m(self.el).find(".m-touch-tab-btn-line").transition("none");
        if (index) {
            var _index = Math.round(Math.abs(index));
            m(this.el).find(".m-touch-tab-btn-item").eq(_index).addClass("active").siblings().removeClass("active");
        }
    };

    function Plugin(option, value, index) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-touch-tab-btn');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
            if (!data) {
                var o = {};
                o.line = $this.hasAttr("data-line");
                var p = $.extend({}, o, options);
                $this.data('m-touch-tab-btn', data = new MTouchTabBtn(this, p));
            }

            if (typeof option === 'string') {
                data[option](value, index);
            }
        });
    }

    var _mTouchTabBtn = $.fn.mTouchTabBtn;
    m.fn.mTouchTabBtn = Plugin;

    m("[data-toggle=m-touch-tab-btn]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });
}();

// m-indexlist  索引列表

+function () {

    var MIndexlist = function MIndexlist(el, options) {
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

                    m(el).emit("scroll.m.indexlist", [el, i]);
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
                if (i < items.length - 1) {
                    if (nowY >= items[i].top && nowY < items[i + 1].top) {
                        setindexlistTop(i);
                        break;
                    }
                } else if (i === items.length - 1) {

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
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;

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
    m.fn.mIndexlist = Plugin;

    m("[data-toggle=m-indexlist]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });
}();

// m-listoption  操作列表

+function () {

    var MListoption = function MListoption(el, options) {
        this.el = el;
        this.options = options;

        // 左拉自动触发
        if (this.options.auto) {
            this.options.limit = 0.8;
        }

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

        $m_listoption.touch(function () {}, function (event, obj) {

            if (obj.isX) {
                event.preventDefault();
            }
        });

        $m_listoption.touchdeletage(".m-listoption-item", function (event, obj, preoObj) {

            var $moveElement = m(this).find(".m-listoption-item-cnt");
            obj.$moveElement = $moveElement;
            obj.wraperWidth = obj.$moveElement.outerWidth();
            obj.moveElmentX = $moveElement.translateX();
            obj.$moveElment = $moveElement;
            obj.optionWidth = -$moveElement.find(".m-listoption-item-option").outerWidth();
            m(this).siblings().find(".m-listoption-item-cnt").translateX(0).transition("all .4s  ease");

            // 弹性拉动right
            if (preoObj.tempObj.length > 1 && obj.moveElmentX < obj.optionWidth) {
                obj.moveElmentX = obj.moveElmentX2;
                obj.moveElmentX2 = 0;
            }

            // 触发自定义的事件
            m(this).emit("start.m.listoption", [this]);
        }, function (event, obj) {

            if (obj.isX) {
                event.preventDefault();
                obj.$moveElment.transition("none");
                var translateX = obj.moveElmentX + obj.x;

                if (translateX > 0) {
                    translateX = 0;
                }

                // 右限弹性拉动
                if (translateX < obj.optionWidth) {
                    var moveRightVal = translateX - obj.optionWidth;
                    obj.moveElmentX2 = translateX;
                    var biliRight = Math.abs(moveRightVal) / obj.wraperWidth;
                    translateX = obj.wraperWidth * (1 - self.options.limit) * biliRight + translateX;
                }

                obj.$moveElement.translateX(translateX);

                // 触发自定义的事件
                m(this).emit("move.m.listoption", [this]);
            }
        }, function (event, obj) {

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

                if (self.options.auto) {
                    if (target < -obj.wraperWidth * 0.6) {
                        target = -obj.wraperWidth;
                        ansTime = 200;
                        var $this = this;
                        // 触发自定义的auto事件
                        obj.$moveElement.setTimeout(function () {
                            m($this).emit("auto.m.listoption", [$this]);
                        }, ansTime);
                    } else {
                        target = 0;
                    }
                }

                obj.$moveElement.translateX(target);
                obj.$moveElement.transition("all " + ansTime + "ms  ease");

                // 触发自定义的事件
                m(this).emit("end.m.listoption", [this]);
            }
        });

        //m(document).on("tap", ".m-listoption-item-option", function (event) {
        //    event.preventDefault();
        //    event.stopPropagation();
        //});
    };

    MListoption.prototype.back = function () {
        console.log(this.el);
        m(this.el).find(".m-listoption-item-cnt").translateX(0).transition("all .4s  ease");
    };

    MListoption.DEFAULTS = {
        limit: .2

    };

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-listoption');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;

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

// m-switch

+function () {

    var MSwitch = function MSwitch(el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MSwitch.prototype.run = function () {
        var self = this;
        var $witch = m(this.el);
        var transition = MSwitch.DEFAULTS.transition;
        $witch.touch(function (event, obj) {
            event.preventDefault();
            var $moveElement = $witch.find(".m-switch-rd");
            obj.moveElmentX = $moveElement.translateX();
            obj.$moveElment = $moveElement;
            obj.$moveElment.transition("none");
            obj.switchWidth = m(this).outerWidth();
            obj.moveElmentWidth = $moveElement.outerWidth();
            obj.maxWidth = obj.switchWidth - obj.moveElmentWidth;
        }, function (event, obj) {

            if (obj.isX) {
                event.preventDefault();
                event.stopPropagation();
                obj.$moveElment.transition("none");
                var translateX = obj.moveElmentX + obj.x;

                translateX = translateX < 0 ? 0 : translateX;

                translateX = translateX >= obj.maxWidth ? obj.maxWidth : translateX;
                if (translateX >= obj.maxWidth / 2) {

                    m(this).addClass("active");
                } else {
                    m(this).removeClass("active");
                }

                obj.$moveElment.translateX(translateX);
            }
        }, function (event, obj) {

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
        });

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

    MSwitch.prototype.setStyle = function (el, transition) {

        var $witch = m(el);
        var $moveElement = $witch.find(".m-switch-rd");
        var switchWidth = $witch.outerWidth();
        var moveElmentWidth = $moveElement.outerWidth();
        var maxWidth = switchWidth - moveElmentWidth;
        if ($witch.hasClass("active")) {

            $moveElement.translateX(maxWidth);
        } else {
            $moveElement.translateX(0);
        }
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

    function Plugin(option, val) {
        var result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-switch');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;

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

/*
  m-checkbtn
 */

(function () {

    // define class
    var MCheckbtn = function MCheckbtn(el, options) {
        this.el = el;
        this.options = options;
    };

    MCheckbtn.prototype.set = function (val) {

        if (val) {
            m(this.el).find(".m-checkbtn-item").addClass("active");
            m(this.el).trigger("check.m.checkbtn", [m(this.el).find(".m-checkbtn-item")[0], true]);
        } else {
            m(this.el).find(".m-checkbtn-item").removeClass("active");
            m(this.el).trigger("check.m.checkbtn", [m(this.el).find(".m-checkbtn-item")[0], false]);
        }
    };

    MCheckbtn.prototype.get = function () {
        return m(this.el).find(".m-checkbtn-item").hasClass("active");
    };

    function Plugin(option, val) {
        var result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-checkbtn');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-checkbtn', data = new MCheckbtn(this, p));
            }

            if (typeof option === 'string') {
                result = data[option](val);
            }
        });

        return result;
    }

    var _mCheckbtn = $.fn.mCheckbtn;
    m.fn.mCheckbtn = Plugin;

    // 单选
    $(document).on("tap", ".m-checkbtn-item", function (e) {
        e.preventDefault();
        $(this).toggleClass("active");
        var bl = $(this).hasClass("active");

        // 触发自定义的事件
        $(this).emit("check.m.checkbtn", [this, bl]);
    });
})();

/*
  m-checkbtn-group
 */

(function () {

    // define class
    var MCheckbtnGroup = function MCheckbtnGroup(el, options) {
        this.el = el;
        this.options = options;
    };

    MCheckbtnGroup.prototype.set = function (args) {
        var $this = m(this.el);
        var items = $this.find(".m-checkbtn-group-item");
        if (typeof args === "function") {

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var val = $(item).attr("data-val") || "";
                var bl = args(val);
                if (bl) {
                    $(item).addClass("active");
                } else {
                    $(item).removeClass("active");
                }
            }
            // 触发自定义的事件
            var list = [];
            $(".m-checkbtn-group-item", $this).each(function () {
                if ($this.hasClass("active")) {
                    var v = $(this).attr("data-val") || "";
                    if ($.trim(v) !== "") {
                        list.push(v);
                    }
                }
            });

            $(this).trigger("check.m.checkbtn.group", [list]);

            return;
        } else if (args instanceof Array) {
            var list2 = [];

            for (var i2 = 0; i2 < items.length; i2++) {
                var item2 = items[i2];
                var v = $(item2).attr("data-val") || "";
                for (var y = 0; y < args.length; y++) {
                    if (v === args[y]) {
                        $(item2).addClass("active");

                        break;
                    } else {
                        $(item2).removeClass("active");
                    }
                }

                // 触发自定义的事件
                list2 = [];
                $(".m-checkbtn-group-item", $this).each(function () {
                    if ($(this).hasClass("active")) {
                        var v = $(this).attr("data-val") || "";
                        if ($.trim(v) !== "") {
                            list2.push(v);
                        }
                    }
                });
            }

            $this.trigger("check.m.checkbtn.group", [list2]);
        }
    };

    MCheckbtnGroup.prototype.all = function (args) {

        // 全选 与 反选
        if (typeof args === "boolean") {
            var $this = $(this.el);
            var objs = $this.find(".m-checkbtn-group-item");
            var objs_list = [];
            objs.each(function () {
                if (args) {
                    var v = $(this).attr("data-val") || "";
                    $(this).addClass("active");
                    objs_list.push(v);
                } else {

                    $(this).removeClass("active");
                }

                $(this).trigger("check.m.checkbtn.group", [objs_list]);
            });
        }
    };

    MCheckbtnGroup.prototype.get = function () {

        var arrs = [];
        $(".m-checkbtn-group-item", this.el).each(function () {
            if ($(this).hasClass("active")) {
                var v = $(this).attr("data-val") || "";
                if ($.trim(v) !== "") {
                    arrs.push(v);
                }
            }
        });
        return arrs;
    };

    function Plugin(option, val) {
        var result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-checkbtn-group');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-checkbtn-group', data = new MCheckbtnGroup(this, p));
            }

            if (typeof option === 'string') {
                result = data[option](val);
            }
        });

        return result;
    }

    var _mCheckbtnGroup = $.fn.mCheckbtnGroup;
    m.fn.mCheckbtnGroup = Plugin;

    m(document).on("tap", ".m-checkbtn-group-item", function (e) {

        e.preventDefault();
        $(this).toggleClass("active");
        var arrs = [];
        var p = $(this).parents(".m-checkbtn-group");
        $(".m-checkbtn-group-item", p).each(function () {

            if ($(this).hasClass("active")) {
                var v = $(this).attr("data-val") || "";
                if ($.trim(v) !== "") {
                    arrs.push(v);
                }
            }
        });

        // 触发自定义的事件
        m(this).trigger("check.m.checkbtn.group", [arrs]);
    });
})();

/*
  m-radiobtn-group
 */

(function () {

    // define class
    var MRadiobtnGroup = function MRadiobtnGroup(el, options) {
        this.el = el;
        this.options = options;
    };

    MRadiobtnGroup.prototype.set = function (index) {

        var $this = m(this.el);
        if (arguments.length >= 1) {
            if (!isNaN(index)) {
                index = Number(index);
                $this.find(".m-radiobtn-item").removeClass("active");
                $this.find(".m-radiobtn-item").eq(index).addClass("active");

                // 触发自定义的事件
                var $active = $this.find(".m-radiobtn-item.active");

                $this.trigger("check.m.radiobtn.group", [$active.get(0), $active.attr("data-val")]);
            } else if (typeof index === "string") {
                var $list = $this.find(".m-radiobtn-item");
                $list.removeClass("active");
                $list.each(function () {

                    var v = $.trim($(this).attr("data-val") || "");
                    if (index === v) {
                        m(this).addClass("active");
                    }
                });

                // 触发自定义的事件
                var $active2 = $this.find(".m-radiobtn-item.active");
                $this.trigger("check.m.radiobtn.group", [$active2.get(0), $active2.attr("data-val")]);
            }
        }
    };

    MRadiobtnGroup.prototype.get = function () {
        return $(this.el).find(".m-radiobtn-item.active").attr("data-val");
    };

    function Plugin(option, val) {
        var result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-radiobtn-group');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-radiobtn-group', data = new MRadiobtnGroup(this, p));
            }

            if (typeof option === 'string') {
                result = data[option](val);
            }
        });

        return result;
    }

    var _mRadiobtnGroup = $.fn.mRadiobtnGroup;
    m.fn.mRadiobtnGroup = Plugin;

    m(document).on("tap", ".m-radiobtn-item", function (e) {
        e.preventDefault();
        var p = $(this).parents(".m-radiobtn-group");
        p.find(".m-radiobtn-item").removeClass("active");
        m(this).addClass("active");

        // 触发自定义的事件
        m(this).trigger("check.m.radiobtn.group", [this, $(this).attr("data-val")]);
    });
})();

/*
 hqs  m-checkbox
 * */

(function () {

    // define class
    var MCheckbox = function MCheckbox(el, options) {
        this.el = el;
        this.options = options;
    };

    MCheckbox.prototype.set = function (v) {

        var $this = $(this.el);
        v = !!v;
        if (v) {
            $this.find(".m-checkbox-item").addClass("active");
            // 触发自定义的事件
            $this.trigger("check.m.checkbox", [$this.get(0), true]);
        } else {
            $this.find(".m-checkbox-item").removeClass("active");
            // 触发自定义的事件
            $this.trigger("check.m.checkbox", [$this.get(0), false]);
        }
    };

    MCheckbox.prototype.get = function () {
        return $(this.el).find(".m-checkbox-item").hasClass("active");
    };

    function Plugin(option, val) {
        var result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-checkbox');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-checkbox', data = new MCheckbox(this, p));
            }

            if (typeof option === 'string') {
                result = data[option](val);
            }
        });

        return result;
    }

    var _mCheckbox = $.fn.mCheckbox;
    m.fn.mCheckbox = Plugin;

    // 单选 m-checkbox
    $(document).on("tap", ".m-checkbox", function (e) {
        e.preventDefault();
        var $p = $(this).find(".m-checkbox-item");
        $p.toggleClass("active");
        var bl = $p.hasClass("active");
        // 触发自定义的事件
        $(this).trigger("check.m.checkbox", [$p, bl]);
    });
})();

/*
  m-checkbox-group
 */

(function () {

    // define class
    var MCheckboxGroup = function MCheckboxGroup(el, options) {
        this.el = el;
        this.options = options;
    };

    MCheckboxGroup.prototype.set = function (args) {

        var $this = m(this.el);
        var $items = $this.find(".m-checkbox-group-item");

        if (typeof args === "function") {
            var list = [];
            for (var i = 0; i < $items.length; i++) {
                var item = $items[i];
                $(item).removeClass("active");
                var val = $(item).attr("data-val") || "";
                var bl = args(val);
                if (bl) {
                    $(item).addClass("active");
                    list.push(val);
                }
            }
            // 触发自定义的事件
            $this.trigger("check.m.checkbox.group", [$this.get(0), list]);

            return;
        } else if (args instanceof Array) {
            var list2 = [];
            for (var i2 = 0; i2 < $items.length; i2++) {
                var item2 = $items[i2];
                $(item2).removeClass("active");
                for (var y = 0; y < args.length; y++) {
                    var v = $(item2).attr("data-val") || "";
                    if (v === args[y]) {
                        $(item2).addClass("active");
                        list2.push(v);
                        break;
                    }
                }
            }
            // 触发自定义的事件
            $this.trigger("check.m.checkbox.group", [$this.get(0), list2]);
        }
    };

    MCheckboxGroup.prototype.all = function (args) {
        var $this = m(this.el);
        var items = $this.find(".m-checkbox-group-item");
        if (typeof args === "boolean") {

            var list1 = [];
            items.each(function () {
                if (args) {
                    $(this).addClass("active");
                    list1.push($(this).attr("data-val") || "");
                } else {
                    $(this).removeClass("active");
                }
            });

            // 触发自定义的事件
            $this.trigger("check.m.checkbox.group", [$this.get(0), list1]);
        }
    };

    MCheckboxGroup.prototype.get = function () {
        var $this = m(this.el);
        var items = $this.find(".m-checkbox-group-item");
        var arrs = [];
        items.each(function () {

            if ($(this).hasClass("active")) {
                var v = $(this).attr("data-val") || "";

                if ($.trim(v) !== "") {
                    arrs.push(v);
                }
            }
        });

        return arrs;
    };

    function Plugin(option, val) {
        var result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-checkbox-group');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-checkbox-group', data = new MCheckboxGroup(this, p));
            }

            if (typeof option === 'string') {
                result = data[option](val);
            }
        });

        return result;
    }

    var _mCheckbtnGroup = $.fn.mCheckboxGroup;
    m.fn.mCheckboxGroup = Plugin;

    // 单选组 m-checkbox-group
    m(document).on("tap", ".m-checkbox-group-item", function (e) {
        e.preventDefault();
        $(this).toggleClass("active");
        var p = $(this).parents(".m-checkbox-group");
        var vals = [];
        $(".m-checkbox-group-item.active", p).each(function () {
            var v = $(this).attr("data-val");
            vals.push(v);
        });

        // 触发自定义的事件
        m(this).trigger("check.m.checkbox.group", [p, vals]);
    });
})();

/*
  m-radiobox-group
 */

(function () {

    // define class
    var MRadiokboxGroup = function MRadiokboxGroup(el, options) {
        this.el = el;
        this.options = options;
    };

    MRadiokboxGroup.prototype.set = function (args) {

        var $items = $(this.el).find(".m-radiobox-item");
        if (typeof args === "string") {
            $items.removeClass("active");
            var v = "";
            $items.each(function () {
                var v2 = $(this).attr("data-val") || "";
                if ($.trim(v2) === args) {
                    $(this).addClass("active");
                    v = v2;
                    return false;
                }
            });

            // 触发自定义的事件
            m(this).trigger("check.m.radiobox.group", [$(this.el).find(".m-radiobox-item.active").get(0), v]);
        } else if (typeof args === "number") {

            $items.removeClass("active");
            if (args > 0) {
                args = args >= 1 ? args - 1 : 0;
                $items.eq(args).addClass("active");
            }

            return;
        } else if (typeof args === "function") {

            $items.removeClass("active");
            for (var i = 0; i < $items.length; i++) {
                var item = $items[i];
                var val = $(item).attr("data-val") || "";
                var bl = args(val);
                if (bl) {
                    $(item).addClass("active");
                    break;
                } else {
                    $(item).removeClass("active");
                }
            }

            return;
        }
    };

    MRadiokboxGroup.prototype.get = function () {
        return m(this.el).find(".m-radiobox-item.active").attr("data-val") || "";
    };

    function Plugin(option, val) {
        var result;
        this.each(function () {

            var $this = $(this);
            var data = $this.data('m-radiobox-group');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-radiobox-group', data = new MRadiokboxGroup(this, p));
            }

            if (typeof option === 'string') {
                result = data[option](val);
            }
        });

        return result;
    }

    var _mRadioboxGroup = $.fn.mRadioboxGroup;
    m.fn.mRadioboxGroup = Plugin;

    // 单选 m-radiobox-group
    m(document).on("tap", ".m-radiobox-item", function (e) {
        e.preventDefault();
        var p = $(this).parents(".m-radiobox-group");
        $(".m-radiobox-item", p).removeClass("active");
        $(this).addClass("active");
        var v = $(this).attr("data-val") || "";

        // 触发自定义的事件
        $(this).trigger("check.m.radiobox.group", [this, v]);
    });
})();

// m-message 信息框

+function () {

        //  m-info
        m.extend({
                mInfo: _info
        });
        var info_setTimeout_id = 0;
        function _info(mess, type, positon) {

                mess = mess || "信息提示框";
                positon = positon || "center";

                $(".m-info").remove();
                var _class = "";
                if (typeof type === "string") {
                        switch (type) {
                                case "default":
                                        _class = "";
                                        break;
                                case "primary":
                                        _class = "text-primary";
                                        break;
                                case "success":
                                        _class = "text-success";
                                        break;
                                case "warning":
                                        _class = "text-warning";
                                        break;
                                case "danger":
                                        _class = "text-danger";
                                        break;
                                default:
                                        _class = "default";
                        }
                }

                _class += " " + positon;
                // 创建v-message
                var info = document.createElement("div");
                info.setAttribute("class", "m-info in " + _class);

                var info_text = document.createElement("div");
                info_text.setAttribute("class", "m-info-text");
                info_text.innerHTML = mess;
                info.appendChild(info_text);

                var elm = document.body || document.documentElement;
                elm.appendChild(info);
                clearTimeout(info_setTimeout_id);
                info_setTimeout_id = setTimeout(function () {

                        $(".m-info").remove();
                }, 1500);
        }

        // m-alert
        m.extend({

                mAlert: _alert
        });

        function _alert(mess, okfun, obj) {
                $(".m-alert").remove();
                if (arguments.length === 0) {

                        throw new Error("参数不能为空！");
                }

                obj = obj || {};
                var _okText = obj.ok || "确定";

                mess = mess || "这是提示信息";
                var alert = document.createElement("div");
                alert.setAttribute("class", "m-alert in");

                var alert_cnt = document.createElement("div");
                alert_cnt.setAttribute("class", "m-alert-cnt");

                var ttl = document.createElement("div");
                ttl.setAttribute("class", "m-alert-cnt-ttl");

                var txt = document.createElement("div");
                txt.setAttribute("class", "_txt");
                txt.innerText = mess;

                var ok_btn = document.createElement("div");
                ok_btn.setAttribute("class", "m-alert-cnt-btn ok");
                ok_btn.innerText = _okText;

                ttl.appendChild(txt);
                alert_cnt.appendChild(ttl);
                alert_cnt.appendChild(ok_btn);
                alert.appendChild(alert_cnt);

                var elm = document.body || document.documentElement;
                elm.appendChild(alert);
                m.router.ismask = true;
                $(".m-alert-cnt-btn.ok").focus();
                $(".m-alert-cnt-btn.ok").on("tap", function (e) {
                        $(".m-alert").remove();
                        m.router.ismask = false;
                        if (typeof okfun === "function") {
                                okfun.call(this);
                        }
                });

                $(".m-alert-cnt").on("tap", function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                });
        }

        // m-confirm
        m.extend({

                mConfirm: _confirm
        });

        function _confirm(mess, okfun, nofun, obj) {
                $(".m-confirm").remove();
                if (arguments.length === 0) {

                        throw new Error("参数不能为空！");
                }

                obj = obj || {};
                var _okText = obj.ok || "确定";
                var _noText = obj.no || "取消";

                mess = mess || "这是提示信息";
                var alert = document.createElement("div");
                alert.setAttribute("class", "m-confirm in");

                var alert_cnt = document.createElement("div");
                alert_cnt.setAttribute("class", "m-confirm-cnt");

                var ttl = document.createElement("div");
                ttl.setAttribute("class", "m-confirm-cnt-ttl");

                var txt = document.createElement("div");
                txt.setAttribute("class", "_txt");
                txt.innerText = mess;

                var btns = document.createElement("div");
                btns.setAttribute("class", "m-confirm-cnt-btns");

                var ok_btn = document.createElement("div");
                ok_btn.setAttribute("class", "m-confirm-cnt-btn ok");
                ok_btn.innerText = _okText;

                var no_btn = document.createElement("div");
                no_btn.setAttribute("class", "m-confirm-cnt-btn no");
                no_btn.innerText = _noText;

                ttl.appendChild(txt);
                alert_cnt.appendChild(ttl);
                btns.appendChild(no_btn);
                btns.appendChild(ok_btn);
                alert_cnt.appendChild(btns);
                alert.appendChild(alert_cnt);

                var elm = document.body || document.documentElement;
                elm.appendChild(alert);
                m.router.ismask = true;
                $(".m-confirm-cnt-btn.ok").focus();
                $(".m-confirm-cnt-btn.ok").on("tap", function (e) {

                        if (typeof okfun === "function") {
                                okfun.call(this);
                        }
                        $(".m-confirm").remove();
                        m.router.ismask = false;
                });
                $(".m-confirm-cnt-btn.no").on("tap", function (e) {

                        if (typeof nofun === "function") {
                                nofun.call(this);
                        }
                        $(".m-confirm").remove();
                        m.router.ismask = false;
                });
                $(".m-confirm-cnt").on("tap", function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                });
        }

        // m-confirm2 下弹出的信息框
        m.extend({

                mConfirm2: _confirm2
        });

        function _confirm2(mess, okfun, nofun, obj) {
                $(".m-confirm2").remove();
                if (arguments.length === 0) {

                        throw new Error("参数不能为空！");
                }

                obj = obj || {};
                var _okText = obj.ok || "确定";
                var _noText = obj.no || "取消";

                mess = mess || "这是提示信息";
                var alert = document.createElement("div");
                alert.setAttribute("class", "m-confirm2 in");

                var alert_cnt = document.createElement("div");
                alert_cnt.setAttribute("class", "m-confirm2-cnt in");

                var ttl = document.createElement("div");
                ttl.setAttribute("class", "m-confirm2-cnt-ttl");

                var txt = document.createElement("div");
                txt.setAttribute("class", "_txt");
                txt.innerText = mess;

                var body = document.createElement("div");
                body.setAttribute("class", "m-confirm2-body");

                var ok_btn = document.createElement("div");
                ok_btn.setAttribute("class", "m-confirm2-cnt-btn ok");
                ok_btn.innerText = _okText;

                var no_btn = document.createElement("div");
                no_btn.setAttribute("class", "m-confirm2-cnt-cancel");
                no_btn.innerText = _noText;

                ttl.appendChild(txt);
                body.appendChild(ttl);
                body.appendChild(ok_btn);
                alert_cnt.appendChild(body);
                alert.appendChild(alert_cnt);
                alert_cnt.appendChild(no_btn);

                var elm = document.body || document.documentElement;
                elm.appendChild(alert);
                m.router.ismask = true;
                $(".m-confirm2-cnt-btn.ok").focus();
                $(".m-confirm2-cnt-btn.ok").on("tap", function (event) {
                        event.stopPropagation();
                        var self = this;
                        m(this).parents(".m-confirm2-cnt").removeClass("in").addClass("out");
                        setTimeout(function () {
                                $(".m-confirm2").remove();
                                m.router.ismask = false;
                                if (typeof okfun === "function") {
                                        okfun.call(self);
                                }
                        }, 400);
                });

                $(".m-confirm2-cnt-cancel").on("tap", function (event) {
                        event.stopPropagation();
                        var self = this;
                        m(this).parents(".m-confirm2-cnt").removeClass("in").addClass("out");

                        setTimeout(function () {
                                $(".m-confirm2").remove();
                                m.router.ismask = false;
                                if (typeof nofun === "function") {
                                        nofun.call(self);
                                }
                        }, 400);
                });
                $(".m-confirm2-cnt").on("tap", function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                });
                $(".m-confirm2").on("tap", function (event) {
                        event.stopPropagation();
                        m(this).find(".m-confirm2-cnt").removeClass("in").addClass("out");

                        setTimeout(function () {
                                $(".m-confirm2").remove();
                                m.router.ismask = false;
                        }, 400);
                });
        }

        // m-actionsheet 下弹出的信息框
        m.extend({

                mActionsheet: _actionsheet
        });

        function _actionsheet(list, nofun, obj) {

                list = list || [];
                list = list.length === 0 ? [{ txt: "actionsheet下弹出的信息框", fn: function fn() {} }] : list;
                $(".m-actionsheet").remove();

                obj = obj || {};
                var _noText = obj.no || "取消";

                var actionsheet = document.createElement("div");
                actionsheet.setAttribute("class", "m-actionsheet in");
                var actionsheet_cnt = document.createElement("div");
                actionsheet_cnt.setAttribute("class", "m-actionsheet-cnt in");

                var body = document.createElement("div");
                body.setAttribute("class", "m-actionsheet-body");

                for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        var ok_btn = document.createElement("div");
                        ok_btn.setAttribute("class", "m-actionsheet-cnt-btn ok");
                        ok_btn.innerHTML = item.txt;
                        ok_btn.item = item;
                        body.appendChild(ok_btn);
                }

                var no_btn = document.createElement("div");
                no_btn.setAttribute("class", "m-actionsheet-cnt-cancel");
                no_btn.innerText = _noText;

                actionsheet_cnt.appendChild(body);
                actionsheet.appendChild(actionsheet_cnt);
                actionsheet_cnt.appendChild(no_btn);

                var elm = document.body || document.documentElement;
                elm.appendChild(actionsheet);
                m.router.ismask = true;

                $(".m-actionsheet-cnt-btn.ok").on("tap", function (event) {
                        event.stopPropagation();
                        m(this).parents(".m-actionsheet-cnt").removeClass("in").addClass("out");
                        var item = m(this).get(0).item;
                        setTimeout(function () {
                                item.fn.call(item);
                                $(".m-actionsheet").remove();
                                m.router.ismask = false;
                        }, 400);
                });

                $(".m-actionsheet-cnt-cancel").on("tap", function (event) {
                        event.stopPropagation();
                        var self = this;
                        m(this).parents(".m-actionsheet-cnt").removeClass("in").addClass("out");

                        setTimeout(function () {
                                $(".m-actionsheet").remove();
                                m.router.ismask = false;
                                if (typeof nofun === "function") {
                                        nofun.call(self);
                                }
                        }, 400);
                });
                $(".m-actionsheet-cnt").on("tap", function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                });
                $(".m-actionsheet").on("tap", function (event) {
                        event.stopPropagation();
                        m(this).find(".m-actionsheet-cnt").removeClass("in").addClass("out");

                        setTimeout(function () {
                                $(".m-actionsheet").remove();
                                m.router.ismask = false;
                        }, 400);
                });
        }
}();

// m-Mpicker


+function () {

    window.pickerObj = null;
    m.extend({

        mPicker: Plugin
    });

    // define class
    var MPicker = function MPicker(el, options, okfn) {

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
        //  var $moveElement = $m_touch_tb.find(".m-picker-cnt");

        $m_touch_tb.find(".m-picker-item.active").each(function (i, v) {
            self.center.call(self, v); // 初始化选择第一项
        });

        m(".m-picker-item").on("tap", function (event) {
            event.preventDefault();
            event.stopPropagation();
            self.center.call(self, this); // 移动到center
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

        self.speedSetIntervalId = 0; // 计算速度定时器id

        $m_touch_tb.each(function (i, v) {
            m(v).touch(function (event, obj) {
                obj.$moveElment = m(this).find(".m-picker-cnt"); // $moveElement;
                obj.moveElmentY = obj.$moveElment.translateY();

                // obj.$moveElment.transition("none");
                self.obj = obj;
                self.speedlateY = obj.y = 0;
                clearInterval(self.speedSetIntervalId);
                self.speedSetIntervalFisrt = true;
                self.speedlateY = 0;
                self.speedScroll = 0;
                self.speedlateY2 = 0;
                self.speedlateY3 = 0;

                // 计算移动速度
                if (self.speedSetIntervalFisrt) {
                    self.speedSetIntervalFisrt = false;
                    self.speedSetIntervalId = obj.$moveElment.setInterval(function () {
                        self.speedlateY2 = obj.y || 0;
                        self.speedlateY3 = parseFloat(self.speedlateY2) - parseFloat(self.speedlateY);
                        self.speedlateY = self.speedlateY2;
                        self.speedScroll = self.speedlateY3;
                    }, 50);
                }
            }, function (event, obj) {

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
            }, function (event, obj) {

                if (obj.isY) {

                    var moveElmentHeigth = obj.$moveElment.outerHeight();
                    var wraperHeight = $m_touch_tb.outerHeight();
                    var moveYSpace = moveElmentHeigth - wraperHeight;
                    var target = obj.$moveElment.translateY();
                    var liHeight = obj.$moveElment.find("li").outerHeight();

                    self.speedSetIntervalFisrt = true;
                    clearInterval(self.speedSetIntervalId);
                    target = target + self.speedScroll * 11; // 修改速度值 

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

                        if (moveElmentHeigth + target < wraperHeight / 2) {
                            el = obj.$moveElment.find("li").last();
                        } else {

                            // first
                            var movetop = middelHeight + liHeight / 2;
                            if (target > movetop) {
                                el = obj.$moveElment.find(".m-picker-item").first();
                            }
                        }
                    }

                    self.center.call(self, el, true); // 移动到center
                }
            });
        });
    };

    MPicker.DEFAULTS = {
        cubicBezier: "cubic-bezier(.13,.77,.53,.93)"
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
        if (spaceMoveY < gudingVal) {
            ansTime = 600;
        }
        ansTime = ansTime > 2000 ? 2000 : ansTime;
        $ul.translateY(moveY);

        if (!bl) {
            $ul.transition("all", 600, "ease");
        } else {
            $ul.transition("transform  " + ansTime + "ms  " + MPicker.DEFAULTS.cubicBezier);
        }

        if (!$el.get(0)) {
            return;
        }
        clearTimeout($el.get(0).settimeoutId);
        var self = this;
        $el.get(0).settimeoutId = setTimeout(function () {
            $li.addClass("active").siblings().removeClass("active");

            // 触发自定义的事件
            $li.emit("select.m.picker", [item, $li.attr("data-val"), self.options.type]);
            m(".m-picker-btns-tip").html("选择的值：" + ("<span>" + $li.text() + "</span"));
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

        var ttl = "";
        var content = "";

        // select
        if (this.options.type === "select") {
            ttl = "" + (this.options.ttl ? "<div class=\"m-picker-box-ttl\">\n                <div>" + this.options.ttl + "</div>\n            </div>" : "");
            var list = this.options.list || [];
            list = list.constructor === Array ? list : [];
            content += MPicker.createInnerHtml(list);
        }

        // date
        if (this.options.type === "date" || this.options.type === "date1" || this.options.type === "date2" || this.options.type === "date3" || this.options.type === "date4" || this.options.type === "date5" || this.options.type === "date6" || this.options.type === "datetime") {
            ttl = " <div class=\"m-picker-box-ttl\">\n                    <div>\u5E74</div>\n                    \n            </div>";

            var year = [];
            var yearActive = new Date().getFullYear();
            for (var _date = yearActive - 100; _date < yearActive + 50; _date++) {
                year.push({ text: _date, val: _date, select: yearActive === _date ? true : false });
            }
            content += MPicker.createInnerHtml(year, "m-picker-year", this.options.type);
        }
        if (this.options.type === "date" || this.options.type === "date2" || this.options.type === "date3" || this.options.type === "date4" || this.options.type === "date5" || this.options.type === "date6" || this.options.type === "datetime") {
            ttl = " <div class=\"m-picker-box-ttl\">\n                    <div>\u5E74</div>\n                    <div>\u6708</div>\n                  \n            </div>";
            var month = [];
            var monthActive = new Date().getMonth() + 1;
            for (var _month = 1; _month <= 12; _month++) {
                month.push({ text: _month, val: _month, select: monthActive === _month ? true : false });
            }
            content += MPicker.createInnerHtml(month, "m-picker-month");
        }

        if (this.options.type === "date" || this.options.type === "date3" || this.options.type === "date4" || this.options.type === "date5" || this.options.type === "date6" || this.options.type === "datetime") {
            ttl = " <div class=\"m-picker-box-ttl\">\n                    <div>\u5E74</div>\n                    <div>\u6708</div>\n                    <div>\u65E5</div>\n            </div>";
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
            ttl = " <div class=\"m-picker-box-ttl\">\n                    <div>\u5E74</div>\n                    <div>\u6708</div>\n                    <div>\u65E5</div>\n                    <div>\u65F6</div>\n                   \n            </div>";
            var hour = [];
            var hourActive = new Date().getHours();
            for (var _hh = 0; _hh < 24; _hh++) {
                hour.push({ text: _hh, val: _hh, select: hourActive === _hh ? true : false });
            }
            content += MPicker.createInnerHtml(hour, "m-picker-hour", this.options.type);
        }

        if (this.options.type === "date5" || this.options.type === "date6" || this.options.type === "datetime") {
            ttl = " <div class=\"m-picker-box-ttl\">\n                    <div>\u5E74</div>\n                    <div>\u6708</div>\n                    <div>\u65E5</div>\n                    <div>\u65F6</div>\n                    <div>\u5206</div>\n                 \n            </div>";

            var mimu = [];
            var mimuhActive = new Date().getMinutes();
            for (var _mimu = 0; _mimu < 60; _mimu++) {
                mimu.push({ text: _mimu, val: _mimu, select: mimuhActive === _mimu ? true : false });
            }
            content += MPicker.createInnerHtml(mimu, "m-picker-mimu", this.options.type);
        }

        // datetime
        if (this.options.type === "datetime" || this.options.type === "date6") {
            ttl = " <div class=\"m-picker-box-ttl\">\n                    <div>\u5E74</div>\n                    <div>\u6708</div>\n                    <div>\u65E5</div>\n                    <div>\u65F6</div>\n                    <div>\u5206</div>\n                    <div>\u79D2</div>\n            </div>";

            var second = [];
            var secondActive = new Date().getSeconds();
            for (var _second = 0; _second < 60; _second++) {
                second.push({ text: _second, val: _second, select: secondActive === _second ? true : false });
            }
            content += MPicker.createInnerHtml(second, "m-picker-second", this.options.type);
        }

        if (this.options.type === "time" || this.options.type === "time2") {
            ttl = " <div class=\"m-picker-box-ttl\">\n                    <div>\u65F6</div>\n                    <div>\u5206</div>\n                  \n            </div>";

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
            ttl = " <div class=\"m-picker-box-ttl\">\n                    <div>\u65F6</div>\n                    <div>\u5206</div>\n                    <div>\u79D2</div>\n                  \n            </div>";

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

                return { text: item.text, val: item.value, select: index === 0 ? "active" : "" };
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

        var tophtml = "\n           \n                <div class=\"m-picker-box-cnt in\">\n                  " + (!(this.options.isShowTip && this.options.type === "select") ? " <div class=\"m-picker-box-btns\">\n                        <div class=\"m-picker-btn cancel\">\u53D6\u6D88</div>\n                        <div class=\"m-picker-btn ok\">\u786E\u5B9A</div>\n                    </div>" : "<div class=\"m-picker-btns-tip\">\u9009\u62E9\u7684\u503C:</div>\n                    ") + " \n                    " + (ttl ? ttl : "") + "\n                    <div class=\"m-picker-inners\">";
        var bottomhtml = "  </div></div>";
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
        var topthtml = "\n                    <nav class=\"m-picker-inner " + className + "\" data-type=\"" + type + "\">\n                        <div class=\"m-picker-line\"></div>\n                        <ul class=\"m-picker-cnt\"> ";

        var contenthtml = "";
        var bottomHtml = "</ul></nav>";

        list.forEach(function (item) {
            contenthtml += " <li class=\"m-picker-item " + (item.select ? "active" : "") + "\" data-val=\"" + item.val + "\">" + item.text + " </li>";
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
                if (y % 400 === 0 || y % 4 === 0 && y % 100 !== 0) {
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

        if (!$el.get(0)) {
            return;
        }
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
        var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
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
                var lis = "";
                for (var _day = 1; _day <= maxDays; _day++) {

                    lis += " <li class=\"m-picker-item " + (index === _day ? "active" : "") + " \" data-val=\"" + _day + "\">" + _day + " </li>";
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
                var cityObj = m.cityData.find(function (item) {
                    return item.value === cityActive;
                });
                city2Index = cityObj.children.length - 1 < city2Index ? cityObj.children.length - 1 : city2Index;

                var cityLis = "";
                cityObj.children.forEach(function (item, i) {
                    cityLis += " <li class=\"m-picker-item elp-1 " + (i === city2Index ? "active" : "") + " \" data-val=\"" + item.value + "\">" + item.text + " </li>";
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
                if (!city2Obj) {
                    return;
                }
                var city2Active = $ps2.find(".m-picker-city2 .m-picker-item.active").attr("data-val");
                var city3Index = $ps2.find(".m-picker-city3 .m-picker-item.active").index();
                city3Index = city3Index < 0 ? 0 : city3Index;
                var city3El = $ps2.find(".m-picker-city3 .m-picker-cnt");

                var city3Obj = city2Obj.children.find(function (item) {
                    return item.value === city2Active;
                });
                if (!city3Obj.children) {
                    city3El.html("");return;
                }

                city3Index = city3Obj.children.length - 1 < city3Index ? city3Obj.children.length - 1 : city3Index;
                var cityLis2 = "";
                city3Obj.children.forEach(function (item, i) {
                    cityLis2 += " <li class=\"m-picker-item  elp-1 " + (i === city3Index ? "active" : "") + " \" data-val=\"" + item.value + "\">" + item.text + " </li>";
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

/**
 * hqs  lazy.js

**/

+function () {

    var MLazy = function MLazy(el, options) {

        this.el = el;
        this.oldsrc = "";
        this.options = options;
        this.run();
    };

    MLazy.DEFAULTS = {
        timing: 400
    };

    MLazy.prototype.run = function () {

        if (this.el === window || this.el === document) {

            m(window).on("scroll", $.proxy(this._scrollImg, this));
        } else if (this.el.nodeType === 1) {
            $(this.el).css("position", "relative");
            $(this.el).on("scroll", $.proxy(this._scrollImgByElement, this));
        }
    };

    MLazy.prototype._scrollImgByElement = function (event) {

        var self = this;
        var $el = $(this.el);
        var $list = $el.find(".m-lazy-img");
        var el_h = parseFloat($el.outerHeight());
        var len = $list.length;
        var spaceTop = $el.rect().top;

        if (len === 0) {
            return;
        }
        $list.each(function () {
            var $this = $(this);
            var elTop = $this.rect().top - spaceTop;
            var img_h_min = -$this.outerHeight() / 2;
            var img_h_max = el_h - $this.outerHeight() / 10;

            if (elTop >= img_h_min && elTop < img_h_max) {

                self._loadFade($this);
            }
        });
    };

    MLazy.prototype.fade = function (event) {

        var self = this;
        var $el = $(this.el);
        var $list = $el.find(".m-lazy-img");

        $list.each(function () {
            var $this = $(this);
            self._loadFade($this);
        });
    };

    MLazy.prototype._loadFade = function ($this) {

        if (!$this.data("blLazy")) {
            $this.data("blLazy", true);
            var _src = $this.attr("data-lazy") || "";
            $this.attr("src", _src);
            $this.removeClass("m-lazy-img");
            $this.on("load", function () {

                $this.addClass("m-lazy-animation");
                $this.parent().addClass("m-lazy-end");
            });
        }
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
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;
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
    m.fn.mLazy = Plugin;

    m(window).on("load.m-lazy", function () {
        $("[data-toggle=m-lazy]").each(function () {
            var $this = $(this);
            var src = $this.attr("data-lazy") || "";
            if (src) {
                Plugin.call($this, "show");
            }
        });
    });
}();

+function () {

        //  m-info

        function _mLoading() {

                $(".m-loading").remove();

                var $loading = document.createElement("div");
                $loading.setAttribute("class", "m-loading");

                var $loading_cnt = document.createElement("div");
                $loading_cnt.setAttribute("class", "m-loading-cnt");

                var $loading_cnt_icon = document.createElement("div");
                $loading_cnt_icon.setAttribute("class", "m-loading-cnt-icon");
                $loading_cnt_icon.innerHTML = "<span class=\"iconfont iconloading\"></span>";

                var $loading_cnt_txt = document.createElement("div");
                $loading_cnt_txt.setAttribute("class", "m-loading-cnt-txt");
                $loading_cnt_txt.innerHTML = "正在加载";

                $loading_cnt.appendChild($loading_cnt_icon);
                $loading_cnt.appendChild($loading_cnt_txt);
                $loading.appendChild($loading_cnt);

                var $elm = document.body || document.documentElement; //m.router.getActiveEl();
                $elm.appendChild($loading);
                m.router.ismask = true;
        }
        function _mLoadingHide() {

                $(".m-loading").remove();
                m.router.ismask = false;
        }

        m.extend({
                mLoading: _mLoading,
                mLoadingHide: _mLoadingHide
        });
}();

// m-overflow-lr 左右原生overflow滑动

+function () {

    var MOverflowLr = function MOverflowLr(el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MOverflowLr.DEFAULT = {
        tapTime: 200,
        center: true
    };

    MOverflowLr.prototype.run = function () {
        var self = this;
        var $el = m(self.el).find(".m-overflow-lr-nav");
        $el.css("overflow-x", "scroll");
        var winW = $el.outerWidth();

        // 设置滑动条
        if (self.options.bar) {
            self.setBar();
        }

        $el.scroll(function (e) {

            var _el = e.target;
            var elW = _el.clientWidth;
            var srlW = _el.scrollWidth;
            var srlLeft = self.scrollLef = _el.scrollLeft; // _el.scrollLeft; 

            // 移动滑动条
            if (self.options.bar) {

                var moveElementW = $el.find(".m-overflow-lr-cnt").outerWidth();
                console.log(moveElementW);
                var ratio = winW / moveElementW;
                ratio = ratio > 1 ? 1 : ratio;
                $el.find(".m-overflow-lr-bar-item").width($el.find(".m-overflow-lr-bar").width() * ratio);
                self.moveBar(srlLeft);
            }

            // 滚动顶部触发的事件
            if (srlLeft <= 0) {

                $el.emit("reachleft.m.overflow.lr", [this, { elementWidth: elW, scrollWidth: srlW, scrollLeft: srlLeft }]);
            }

            // 滚动时触发的事件
            $el.emit("scroll.m.overflow.lr", [this, { elementWidth: elW, scrollWidth: srlW, scrollLeft: srlLeft }]);

            // 滚动的高度小于元素大框高度
            if (srlW < elW) {
                return;
            }

            // 滚动的真实高度
            var _left = srlW - elW;
            if (srlLeft >= _left) {

                // 滚动到底部 触发的事件
                $el.emit("reachright.m.overflow.lr", [this, { elementWidth: elW, scrollWidth: srlW, scrollLeft: srlLeft }]);
            }
        });

        // 移动阻止冒泡行为
        $el.touch(function (event) {
            event.stopPropagation();
        }, function (event, obj) {

            if (obj.isX) {
                event.stopPropagation();
            }
            if (obj.isY) {
                event.stopPropagation();
            }
        }, function (event) {
            event.stopPropagation();
        });

        // 点击router 跳转
        $el.find("a[data-link]").on("tap", function (event) {
            event.preventDefault();
            m.router.alink.call(this);
        });

        // 导航 m-overflow-lr-menu 
        var $el_parent = m(self.el).find(".m-overflow-lr-nav.m-overflow-lr-menu");

        $el_parent.on("tap", ".m-overflow-lr-item", function (event) {

            var index = m(this).index();
            self.set(index);

            // tap选中触发的事件
            m(this).emit("tap.m.overflow.lr", [this, index]);
        });
    };

    MOverflowLr.prototype.set = function () {
        var index = arguments.length > 0 ? arguments[0] : 0;
        index = isNaN(Number(index)) ? 0 : index;
        var $el_parent = m(this.el).find(".m-overflow-lr-nav.m-overflow-lr-menu");
        var $el_menu = $el_parent.find(".m-overflow-lr-item").eq(index);
        var $el_menu_w2 = $el_menu.outerWidth() / 2;
        var $el_parent_w = $el_parent.outerWidth() / 2;
        $el_menu.addClass("active").siblings().removeClass("active");

        // 定位到左边
        if (this.options.left) {
            $el_parent.scrollLeft($el_menu.offsetLeft(), MOverflowLr.DEFAULT.tapTime);
        } else {

            // 定位到中间
            $el_parent.scrollLeft($el_menu.offsetLeft() - ($el_parent_w - $el_menu_w2), MOverflowLr.DEFAULT.tapTime);
        }
    };

    MOverflowLr.prototype.setBar = function () {
        var $m_touch_lr = m(this.el);
        var pwr = document.createElement("div");
        pwr.classList.add("m-overflow-lr-bar-nav");
        var bar = document.createElement("div");
        bar.classList.add("m-overflow-lr-bar");
        var item = document.createElement("div");
        item.classList.add("m-overflow-lr-bar-item");
        bar.appendChild(item);
        pwr.appendChild(bar);
        $m_touch_lr.append(pwr);

        var winW = $m_touch_lr.outerWidth();
        var moveElementW = $m_touch_lr.find(".m-overflow-lr-cnt").outerWidth();
        var ratio = winW / moveElementW;
        ratio = ratio > 1 ? 1 : ratio;
        console.log($m_touch_lr.find(".m-overflow-lr-cnt"));

        $m_touch_lr.find(".m-overflow-lr-bar-item").width($m_touch_lr.find(".m-overflow-lr-bar").width() * ratio);
    };

    MOverflowLr.prototype.moveBar = function (x) {

        x = parseFloat(x) || 0;

        var $m_touch_lr = m(this.el);
        var winW = $m_touch_lr.outerWidth();
        var moveElementW = $m_touch_lr.find(".m-overflow-lr-cnt").outerWidth();
        if (moveElementW < winW) {
            return;
        }
        var moveLeft = moveElementW - winW;
        var ratio = x / moveLeft;
        //ratio = ratio > 1 ? 1 : ratio;
        var barW = $m_touch_lr.find(".m-overflow-lr-bar").width();
        var itemW = $m_touch_lr.find(".m-overflow-lr-bar-item").width();

        return $m_touch_lr.find(".m-overflow-lr-bar-item").translateX(ratio * (barW - itemW));
    };

    function Plugin(option, index) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-overflow-lr');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;

            if (!data) {
                var o = {};
                o.bar = $this.hasAttr("data-bar");
                o.left = $this.hasAttr("data-left");
                var p = $.extend({}, o, options);
                $this.data('m-overflow-lr', data = new MOverflowLr(this, p));
            }

            if (typeof option === 'string') {
                data[option](index);
            }
        });
    }

    var _mOverflowLr = $.fn.mOverflowLr;
    m.fn.mOverflowLr = Plugin;

    m("[data-toggle=m-overflow-lr]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });
}();

// m-overflow-tb 上下原生overflow滑动

+function () {

    var MOverflowTb = function MOverflowTb(el, options) {
        this.el = el;
        this.options = options;
        this.run();
    };

    MOverflowTb.prototype.run = function () {
        var $el = m(this.el);
        $el.css("overflow-y", "scroll");

        // document
        $el.scroll(function (e) {

            var _el = e.target;
            var elH = _el.clientHeight;
            var srlH = _el.scrollHeight;
            var srlTop = _el.scrollTop; // _el.scrollTop; 

            // 滚动顶部触发的事件
            if (srlTop <= 0) {
                $el.emit("reachtop.m.overflow.tb", [this, { elementHeight: elH, scrollHeight: srlH, scrollTop: srlTop }]);
            }

            // 滚动时触发的事件
            $el.emit("scroll.m.overflow.tb", [this, { elementHeight: elH, scrollHeight: srlH, scrollTop: srlTop }]);

            // 滚动的高度小于元素大框高度
            if (srlH < elH) {
                return;
            }

            // 滚动的真实高度
            var _top = srlH - elH;

            if (srlTop >= _top - 1) {

                // 滚动到底部 触发的事件
                $el.emit("reachbottom.m.overflow.tb", [this, { elementHeight: elH, scrollHeight: srlH, scrollTop: srlTop }]);
            }
        });
    };

    function Plugin(option) {

        return this.each(function () {

            var $this = $(this);
            var data = $this.data('m-overflow-tb');
            var options = (typeof option === "undefined" ? "undefined" : _typeof(option)) === 'object' && option;

            if (!data) {
                var o = {};
                var p = $.extend({}, o, options);
                $this.data('m-overflow-tb', data = new MOverflowTb(this, p));
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    }

    var _mOverflowTb = $.fn.mOverflowTb;
    m.fn.mOverflowTb = Plugin;

    m("[data-toggle=m-overflow-tb]").each(function (e) {
        var $this = $(this);
        Plugin.call($this);
    });
}();

// ���
// touch
// overflow
 //����overflow����

})));
