/*
      hqs-ajax
*/

+ function (Mobile) {

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
		success: function () {},
		error: function () {},
		dataType: "text",
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		timeout: 0,
		//progress: {},
		headers: {},
		xhr: function () {
			return Mobile.createXHR();

		}
	};

	// ajax type
	function _ajaxFun(url, type, data, _arguments) {
		var success;
		var error;
		//var progress;
		if (typeof data === "object" && _arguments.length > 2) {
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
			data: typeof data === "object" ? data : null,
			dataType: _dataType,
			success: success,
			error: error,
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
					if (typeof data3 === "object") {
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
		createXHR: function () {

			if (window.XMLHttpRequest) {
				//IE7+、Firefox、Opera、Chrome 和Safari
				return new window.XMLHttpRequest();
			}

		},

		ajaxSetup: function (options) {

			options = typeof options === "object" ? options : {};
			$.extend(_ajaxSetup, options);
			return _ajaxSetup;

		},
		ajax: function (options) {

			options = typeof options === "object" ? options : {};
			var opt = $.extend({}, _ajaxSetup, options);

			// setting timeout
			var abortTimeoutId = 0;
			var abort = function () {
				if (opt.timeout > 0) {
					abortTimeoutId = setTimeout(function () {
						xhr.onreadystatechange = function () { };
						try {
							xhr.abort();
							opt.error("timeout");
						} catch (exp) { console.log("timeout"); }

					}, opt.timeout);
				}
			};

			var xhr = null;
			var _xhrObj = opt.xhr();
			if (typeof _xhrObj === "object") {
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
				opt.url = opt.url.indexOf("?") === -1 ? opt.url + "?" + "_=" + Math.random() + postData : opt.url + "&_=" +
					Math.random() + postData;
                
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
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
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
		get: function (url, data) {
			_ajaxFun(url, "get", data, arguments);
		},

		// post
		post: function (url, data) {
			_ajaxFun(url, "post", data, arguments);
		},

		// put
		put: function (url, data) {
			_ajaxFun(url, "put", data, arguments);
		},

		// delete
		delete: function (url, data) {
			_ajaxFun(url, "delete", data, arguments);
		},

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