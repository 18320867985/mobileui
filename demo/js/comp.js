var mobileui = (function() {

	// css3 transform 函数
	var transformCss = function(node, name, value) {
		if(!node.transform) {
			node.transform = {};
		}
		if(arguments.length > 2) {
			//写
			//把名值对添加到对象
			node.transform[name] = value;
			var result = '';
			for(var item in node.transform) {
				switch(item) {
					case 'rotate':
					case 'rotateX':
					case 'rotateY':
					case 'rotateZ':
					case 'skew':
					case 'skewX':
					case 'skewY':
					case 'skewZ':
						result += item + '(' + node.transform[item] + 'deg)  ';
						break;
					case 'scale':
					case 'scaleX':
					case 'scaleY':
					case 'scaleZ':
						result += item + '(' + node.transform[item] + ')  ';
						break;
					case 'translate':
					case 'translateX':
					case 'translateY':
					case 'translateZ':
						result += item + '(' + node.transform[item] + 'px)  ';
						break;

				};

			};
			node.style.transform = result;

		} else {
			//读
			if(typeof node.transform[name] == 'undefined') {
				if(name == 'scale' || name == 'scaleX' || name == 'scaleY') {
					value = 1

				} else {
					value = 0
				}

			} else {
				value = node.transform[name];

			}
			return value;

		}

	}

	// 菜单滑动
	var _scroll = function(fn) {

		window.addEventListener("load", function() {
			navSlide(fn);

		});
		//导航拖拽
		function navSlide(fn) {
			var navs = document.querySelectorAll(".mobile-scroll");

			for(var i = 0; i < navs.length; i++) {
				navsListFun(navs[i]);
				changeColor(navs[i], fn);

			}

		}

		//导航拖拽fun
		function navsListFun(navs) {

			var navsList = navs.querySelector(".mobile-scroll-list");
			transformCss(navsList, 'translateZ', 0.01)
			var beginTime = 0;
			var beginValue = 0;
			var endTime = 0;
			var endValue = 0;
			var disTime = 0;
			var disValue = 0;
			var eleX = 0; // 元素初始位置
			var startX = 0;
			var startY = 0;
			var isFirst = true; //手指初始位置
			var isX = true;
			var isAddMoveEvent = true; // 判断是否top拖动
			var isAddMoveEventFirst = true; // 判断是否第一往上拖动

			navs.addEventListener("touchstart", start);

			function start(event) {
				var touch = event.changedTouches[0];
				startX = touch.clientX;
				startY = touch.clientY;
				eleX = transformCss(navsList, "translateX");
				beginTime = new Date().getTime();
				beginValue = eleX;
				disValue = 0;
				isX = true;
			 isAddMoveEvent = true; // 判断是否top拖动
			 isAddMoveEventFirst = true; // 判断是否第一往上拖动

				// 过度时间0s
				navsList.style.transition = 'none';
				navs.addEventListener("touchmove", move);

			};

			//navs.addEventListener("touchmove", move);
			function move(event) {

				var touch = event.changedTouches[0];
				var nowX = touch.clientX;
				var nowY = touch.clientY;
				var dis = nowX - startX;

				// 检查是否向上移动
				if(Math.abs(nowY - startY) > Math.abs(nowX - startX) && isAddMoveEventFirst) {
					// 取消 浏览器默认行为
					navs.removeEventListener("touchmove", move);
					isAddMoveEvent = true;
					isAddMoveEventFirst = false;

					return;
				} else {
					if(isAddMoveEventFirst) {
						event.preventDefault();
						isAddMoveEvent = false;

					}

				}

				var window_w = window.innerWidth ||
					document.documentElement.clientWidth ||
					document.body.clientWidth;

				var minX = window_w - navsList.offsetWidth;

				var translateX = eleX + dis;
				if(translateX > 0) {
					var scale = 1 - translateX / window_w;
					translateX = translateX * scale;

				} else if(translateX < minX) {
					var over = minX - translateX;
					var scale = 1 - over / window_w;
					translateX = minX - over * scale;

				}

				transformCss(navsList, "translateX", translateX);
				endTime = new Date().getTime();
				endValue = translateX;
				disTime = endTime - beginTime;
				disValue = endValue - beginValue;
			}

			navs.addEventListener("touchend", end);

			function end(event) {

				// 检查是否向上移动
				if(isAddMoveEventFirst === false) {
					isAddMoveEventFirst = true;
					return;
				}
				var touch = event.changedTouches[0];
				var speed = disValue / (endTime - beginTime);
				var window_w = window.innerWidth ||
					document.documentElement.clientWidth ||
					document.body.clientWidth;
				var minX = window_w - navsList.offsetWidth;
				var target = transformCss(navsList, "translateX") + speed * 250;
				var bezier = '';

				if(target > 0) {
					target = 0;

					bezier = 'cubic-bezier(.17,.67,.81,.9)';
				} else if(target < minX) {
					target = minX;
					bezier = 'cubic-bezier(.17,.67,.81,.9)';
				}
				// 过度时间0.5s
				navsList.style.transition = '.8s ' + bezier;
				transformCss(navsList, "translateX", target);
			}

			//系统取消 重新加载页面
			navs.addEventListener("touchcancel", function() {
				window.location.reload();

			});

		}

		///导航点击选中样式
		function changeColor(navs, fn) {
			var Linodes = navs.querySelectorAll(".mobile-scroll-list li ");
			var isLink = navs.getAttribute("data-link");
			// 对li进行遍历
			for(var i = 0; i < Linodes.length; i++) {

				//误触解决
				Linodes[i].addEventListener("touchmove", function() {
					if(!this.isMove) {
						this.isMove = true;

					}

				});

				Linodes[i].addEventListener("touchend", function(event) {

					//对每个li绑定touchend，添加classname
					if(!this.isMove) {
						for(var j = 0; j < Linodes.length; j++) {

							Linodes[j].classList.remove("active");
						}

						this.classList.add("active");
						// a链接
						if(isLink !== null) {
							var href = event.target.getAttribute("href") || "javascript:;";
							window.location.assign(href);
						}

						// 点击回调函数
						if(typeof fn === "function") {
							fn(this);
						}
					}
					this.isMove = false;

				});

			}

		}

	}

	// 图片轮播
	var _slide = function() {

		window.addEventListener("load", function() {
			var wrap = document.querySelectorAll(".mobile-slide");
			for(var i = 0; i < wrap.length; i++) {
				banner(wrap[i]);
			}

		});

		function banner(mobile_slide) {

			var wrap = mobile_slide; //document.querySelector(".mobile-slide");
			var list = wrap.querySelector(".mobile-slide-list");

			// 轮播时间 
			var time = wrap.getAttribute("data-time") || "3000";
			var isAuto = wrap.getAttribute("data-auto"); //自动播放

			time = parseInt(time);
			var timerId = 0;
			var elementX = 0;
			var startX = 0;
			var startY = 0;
			var now = 0;
			var isLink = true;
			var isAddMoveEvent = true; // 判断是否往上拖动
			var isAddMoveEventFirst = true; // 判断是否第一往上拖动

			// 小圆点
			var spanNodes = wrap.querySelectorAll(".mobile-slide-radius span");
			transformCss(list, 'translateZ', 0.01)
			list.innerHTML += list.innerHTML
			var liNodes = wrap.querySelectorAll(".mobile-slide-list li")

			// 添加样式
			mobile_slide.style.overflow = "hidden"
			list.style.width = liNodes.length + '00%';

			for(var l = 0; l < liNodes.length; l++) {
				liNodes[l].style.width = (1 / liNodes.length * 100) + '%';
			};

			wrap.addEventListener("touchstart", start);

			// start
			function start(event) {

				var touch = event.changedTouches[0];
				isLink = true;
				clearInterval(timerId);
				list.style.transition = 'none';
				var left = transformCss(list, "translateX")
				var now = Math.round(-left / document.documentElement.clientWidth)

				if(now == 0) {
					now = spanNodes.length
				} else if(now == liNodes.length - 1) {
					now = spanNodes.length - 1
				}
				transformCss(list, 'translateX', -now * document.documentElement.clientWidth)

				startX = touch.clientX;
				startY = touch.clientY;

				elementX = transformCss(list, 'translateX');
				wrap.addEventListener("touchmove", move);
			}

			//wrap.addEventListener("touchmove", move);
			function move(event) {
				var touch = event.changedTouches[0];
				var nowX = touch.clientX;
				var nowY = touch.clientY;
				var disX = nowX - startX

				// 检查是否向上移动
				if(Math.abs(nowY - startY) > Math.abs(nowX - startX) && isAddMoveEventFirst) {
					// 取消 浏览器默认行为
					wrap.removeEventListener("touchmove", move);
					isAddMoveEvent = true;
					isAddMoveEventFirst = false;

					return;
				} else {
					if(isAddMoveEventFirst) {
						event.preventDefault();
						isAddMoveEvent = false;
					}

				}

				clearInterval(timerId);
				isLink = false;
				transformCss(list, 'translateX', elementX + disX);

			}

			wrap.addEventListener("touchend", end);

			//touchend
			function end(event) {

				var touch = event.changedTouches[0];
				var nowX = touch.clientX;
				var nowY = touch.clientY;

				// 自动播放
				if(isAuto !== null) {

					timerId = auto(time);
				}

				// 检查是否向上移动
				if(isAddMoveEventFirst === false) {
					isAddMoveEventFirst = true;
					return;
				}

				// a链接
				if(isLink) {
					isLink = true;
					var href = "";
					if(event.target.parentElement.nodeName == "A") {
						// 包裹一层
						href = event.target.parentElement.getAttribute("href") || "javascript:;";
					} else {
						// 包裹两层
						href = event.target.parentElement.parentElement.getAttribute("href") || "javascript:;";
					}

					window.location.assign(href);
				}

				var left = transformCss(list, "translateX");
				now = Math.round(-left / document.documentElement.clientWidth)
				if(now < 0) {
					now = 0
				} else if(now > liNodes.length - 1) {
					now = liNodes.length - 1
				}

				list.style.transition = '0.5s';
				transformCss(list, 'translateX', -now * document.documentElement.clientWidth);

				//同步小圆点
				for(var i = 0; i < spanNodes.length; i++) {
					spanNodes[i].className = '';
				}

				spanNodes[now % spanNodes.length].className = 'active';
			}

			//系统取消 重新加载页面
			wrap.addEventListener("touchcancel", function() {
				window.location.reload();
			});

			// 自动播放

			if(isAuto !== null) {

				timerId = auto(time);
			}

			function auto(t) {

				return setInterval(function() {
					list.style.transition = 'none';
					if(now == liNodes.length - 1) {
						now = spanNodes.length - 1;
					}
					transformCss(list, 'translateX', -now * document.documentElement.clientWidth)
					setTimeout(function() {
						now++;
						list.style.transition = '.8s ease-in-out';
						transformCss(list, 'translateX', -now * document.documentElement.clientWidth)
						for(var i = 0; i < spanNodes.length; i++) {
							spanNodes[i].className = '';
						}
						spanNodes[now % spanNodes.length].className = 'active';

					}, 20)

				}, t);
			}

		}

	}

	//tab 选项卡
	var _tab = function() {

		window.addEventListener("load", function() {
			var wrap = document.querySelectorAll(".mobile-tab");
			for(var i = 0; i < wrap.length; i++) {
				tabFn(wrap[i]);
			}

		});

		function tabFn(mobile_slide) {
			var wrap = mobile_slide; //document.querySelector(".mobile-slide");
			var list = wrap.querySelector(".mobile-tab-list");
			var items = list.querySelectorAll(".mobile-tab-list-item");
			// 设置tab 高度
			setTabHeight() ;
			function setTabHeight() {
				
				var window_w = Number(window.innerHeight);
				var tab_heade = document.querySelector(".mobile-tab-head-h");
				var tab_footer = document.querySelector(".mobile-tab-footer-h");
				var tab_nav = document.querySelector(".mobile-tab-nav-h");

				var tab_heade_h = tab_heade ? Number(tab_heade.offsetHeight) : 0;
				var tab_footer_h = tab_footer ? Number(tab_footer.offsetHeight) : 0;
				var tab_nav_h = tab_nav ? Number(tab_nav.offsetHeight) : 0;
				var tab_h = window_w - tab_heade_h - tab_footer_h - tab_nav_h;
				mobile_slide.style.height = tab_h + "px";
				list.style.height = tab_h + "px";

				for(var i = 0; i < items.length; i++) {

					items[i].style.height = tab_h + "px";
					items[i].style.overflowY = "scroll";
				}

			}
		
			// 轮播时间 
			var time = wrap.getAttribute("data-time") || "3000";
			var isAuto = wrap.getAttribute("data-auto"); //自动播放

			time = parseInt(time);
			var timerId = 0;
			var elementX = 0;
			var startX = 0;
			var startY = 0;
			var now = 0;
			var isLink = true;
			var isAddMoveEvent = true; // 判断是否往上拖动
			var isAddMoveEventFirst = true; // 判断是否第一往上拖动

			transformCss(list, 'translateZ', 0.01)
			list.innerHTML += list.innerHTML
			var liNodes = wrap.querySelectorAll(".mobile-tab-list-item")

			// 添加样式
			mobile_slide.style.overflow = "hidden"
			list.style.width = liNodes.length + '00%';

			for(var l = 0; l < liNodes.length; l++) {
				liNodes[l].style.width = (1 / liNodes.length * 100) + '%';
			};

			wrap.addEventListener("touchstart", start);

			// start
			function start(event) {

				var touch = event.changedTouches[0];
				isLink = true;
				clearInterval(timerId);
				list.style.transition = 'none';
				var left = transformCss(list, "translateX")
				var now = Math.round(-left / document.documentElement.clientWidth)

				if(now == 0) {
					now = liNodes.length / 2;
				} else if(now == liNodes.length - 1) {
					now = liNodes.length / 2 - 1
				}
				transformCss(list, 'translateX', -now * document.documentElement.clientWidth)

				startX = touch.clientX;
				startY = touch.clientY;

				elementX = transformCss(list, 'translateX');
				wrap.addEventListener("touchmove", move);
			}

			//wrap.addEventListener("touchmove", move);
			function move(event) {
				var touch = event.changedTouches[0];
				var nowX = touch.clientX;
				var nowY = touch.clientY;
				var disX = nowX - startX

				// 检查是否向上移动
				if(Math.abs(nowY - startY) > Math.abs(nowX - startX) && isAddMoveEventFirst) {
					// 取消 浏览器默认行为
					wrap.removeEventListener("touchmove", move);
					isAddMoveEvent = true;
					isAddMoveEventFirst = false;

					return;
				} else {
					if(isAddMoveEventFirst) {
						event.preventDefault();
						isAddMoveEvent = false;
					}

				}

				clearInterval(timerId);
				isLink = false;
				transformCss(list, 'translateX', elementX + disX);

			}

			wrap.addEventListener("touchend", end);

			//touchend
			function end(event) {

				var touch = event.changedTouches[0];
				var nowX = touch.clientX;
				var nowY = touch.clientY;

				// 自动播放
				if(isAuto !== null) {

					timerId = auto(time);
				}

				// 检查是否向上移动
				if(isAddMoveEventFirst === false) {
					isAddMoveEventFirst = true;
					return;
				}

				// a链接
				if(isLink) {
					isLink = true;
					var href = "";
					if(event.target.parentElement.nodeName == "A") {
						// 包裹一层
						href = event.target.parentElement.getAttribute("href") || "javascript:;";
					} else {
						// 包裹两层
						href = event.target.parentElement.parentElement.getAttribute("href") || "javascript:;";
					}

					window.location.assign(href);
				}

				var left = transformCss(list, "translateX");
				now = Math.round(-left / document.documentElement.clientWidth)
				if(now < 0) {
					now = 0
				} else if(now > liNodes.length - 1) {
					now = liNodes.length - 1
				}

				list.style.transition = '0.5s';
				transformCss(list, 'translateX', -now * document.documentElement.clientWidth);

			}

			//系统取消 重新加载页面
			wrap.addEventListener("touchcancel", function() {
				window.location.reload();
			});

		}

	}

	return {
		scroll: _scroll,
		slide: _slide,
		tab: _tab

	}

})();