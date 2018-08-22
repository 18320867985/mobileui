var scrollTopBottom = (function(m) {

	m(function() {
		topBottom();
	})

	//导航拖拽
	function topBottom() {
		var scrolltb = m(".mobile-scroll-topbottom");
		scrolltb.each(function(i, v) {
			topBottomFun(v);

		});

	}

	//导航拖拽fun
	function topBottomFun(scrolltb) {

		var topbottomContent = m(scrolltb).find(".mobile-scroll-content");
		var many = m(scrolltb).find(".mobile-scroll-content-many.active");
		var isManyContent = false; //是否显示多内容
		if(topbottomContent.length === 0) {
			topbottomContent = many;
			isManyContent = true;
		}

		m(topbottomContent).setTransform('translateZ', 0.05);
		var isScrollTop = m(scrolltb).hasAttr("data-scroll-top"); // 是否下拉
		var isScrollBottom = m(scrolltb).hasAttr("data-scroll-bottom"); // 是否上拉

		var isScrollBar = m(scrolltb).hasAttr("data-scroll-bar") // 是否显示滚动条
		if(isScrollBar) {
			var scrollBar = document.createElement("div"); // 创建滚动条
			scrollBar.classList.add("mobile-scroll-bar");
			scrolltb.appendChild(scrollBar)
		}

		
		var eleY = 0; // 元素初始位置
		var startY = 0;
		var startX = 0;
		var dis = 0;

		// a链接
		var isLink = true;
		var isLinkFirst = true;
		
		// 是否上拖动
		var isAddMoveEvent = false; // 判断是否往上拖动
		var isAddMoveEventFirst = true; // 判断是否第一往上拖动
				
		//速度方向
		var speedDcrt = "auto"; 

		var window_h = m(scrolltb).height();
		var minY = window_h - topbottomContent.height();

		// 滚动条
		var bar_h = m(topbottomContent).height();
		var bar_wrap_h = m(scrolltb).height();
		var sale_bar = bar_wrap_h / bar_h;
		var scroll_bar_h = window_h * sale_bar;
		var mobile_scroll_bar = m(scrolltb).find(".mobile-scroll-bar");
		if(isScrollBar) {
			if(window_h < bar_h) {
				mobile_scroll_bar.height(scroll_bar_h);
			}

		}
		var isMOve = false; // 计算速度定时器id
		var speedSetIntervalId = 0;
		var speedSetIntervalFisrt = true;
		var speedScroll = 0;
		var speedlateY = 0;
		var speedlateYOld = 0;

		// 是否下拉加载
		var loading = m(topbottomContent).find(".mobile-loading");
		var isLoading = m(scrolltb).hasAttr("data-loading");
		var loadingY = 0;
		if(isLoading) {
			loadingY = loading.offsetTop();
		}

		m(scrolltb).touchstart(start);

		function start(event) {

			event.preventDefault();
			var touch = event.changedTouches[0];
			startY = touch.clientY;
			startX = touch.clientX;
			isLink = true;
			isLinkFirst = true;
			speedDcrt = "auto"; //速度方向

			if(isManyContent) {
				topbottomContent = m(scrolltb).find(".mobile-scroll-content-many.active");
				loading = m(topbottomContent).find(".mobile-loading");
			}

			eleY = m(topbottomContent).getTransform("translateY");

			isAddMoveEvent = false; // 判断是否往上拖动
			isAddMoveEventFirst = true; // 判断是否第一往上拖动

			// 计算移动速度
			clearInterval(speedSetIntervalId);
			speedSetIntervalFisrt = true;
			speedlateY = eleY;
			speedScroll = 0;

			window_h = m(scrolltb).height();
			// 过度时间0s
			//topbottomContent.transition("transform",200,"ease-out");

			// 滚动条
			if(isScrollBar) {

				bar_h = m(topbottomContent).height();
				bar_wrap_h = m(scrolltb).height();
				sale_bar = bar_wrap_h / bar_h;
				scroll_bar_h = window_h * sale_bar;
				mobile_scroll_bar = m(scrolltb).find(".mobile-scroll-bar");

				if(window_h < bar_h) {
					mobile_scroll_bar.height(scroll_bar_h);
				}
				mobile_scroll_bar.css("opacity", 1);

				//mobile_scroll_bar.transition("transform",200,"ease-out");

			}

		};

		m(scrolltb).touchmove(move);

		function move(event) {
			event.preventDefault();
			window_h = m(scrolltb).height();
			topbottomContent.transition("none");
			mobile_scroll_bar.transition("none");

			var touch = event.changedTouches[0];
			var nowY = touch.clientY;
			dis = nowY - startY;
			var nowX = touch.clientX;
			var disX = nowX - startX;
			var disY = nowY - startY

			var _x = Math.abs(disX);
			var _y = Math.abs(disY);

			if((_x > 1 || _y > 1) && isLinkFirst) {

				isLink = false;
				isLinkFirst = false;
			}

			// 滚动条
			if(isScrollBar) {

				var scroll_Y = m(topbottomContent).getTransform("translateY");
				var scroll_box_h = m(topbottomContent).height();
				var scroll_box_sale = scroll_Y / scroll_box_h;
				mobile_scroll_bar.setTransform("translateY", -bar_wrap_h * scroll_box_sale);
			}

			// 检查是否向上移动
			if(isAddMoveEventFirst && (_x != _y)) {
				isAddMoveEventFirst = false;
				if(_x > _y) {
					isAddMoveEvent = true;
				}
			}

			if(isAddMoveEvent) {
				return;
			}

			// 计算移动速度
			if(speedSetIntervalFisrt) {
				speedSetIntervalFisrt = false;
				var speedlateY2 = 0;
				var speedlateY3 = 0;
				speedSetIntervalId = setInterval(function() {
					speedlateY2 = m(topbottomContent).getTransform("translateY") || 0;
					speedlateY3 = speedlateY2 - speedlateY;
					speedlateY = speedlateY2;
					speedScroll = speedlateY3;

				}, 20);
			}

			minY = window_h - topbottomContent.height();
			var translateY = eleY + dis;

			// 是否下拉加载
			if(isLoading) {
				loadingY = loading.offsetTop();

				// scroll上下滚动加载数据scrollloading自定义事件
				m(this).trigger("scrollloading", {
					el: topbottomContent.eq(0),
					resetBar: scrollBarFun,
					translateY: translateY, // 滚动translateY
					loading: loading,
					loadingY: loadingY, // loanding offsetTop值
					isLoading: (Math.abs(translateY)) >= (loadingY - window_h)

				});
			}

			// scroll上下滚动scrolltopbottom自定义事件
			if(Math.abs(speedScroll) === 0) {
				m(this).trigger("scrolltopbottom", {
					el: topbottomContent.eq(0),
					translateY: translateY,
					resetBar: scrollBarFun,

				});
			}
			speedDcrt = "auto"; //速度方向
			if(translateY > 0) {
				var scale = 1 - translateY / window_h;
				translateY = translateY * scale;
				speedDcrt = "down"; //速度方向

				// 是否下拉
				if(!isScrollTop) {
					translateY = 0;

				}

				// scroll顶部 scrolltop自定义事件
				m(this).trigger("scrolltop", {
					el: topbottomContent.eq(0),
					resetBar: scrollBarFun,
					translateY: translateY,

				});

			} else if(translateY < minY) {
				var over = Math.abs(translateY - minY);
				var scale = 1 - over / window_h;
				translateY = minY - over * scale;
				speedDcrt = "up"; //速度方向
				// 是否上拉
				if(!isScrollBottom) {
					translateY = minY;

				}

				// scroll底部 scrollbottom自定义事件
				m(this).trigger("scrollbottom", {
					el: topbottomContent.eq(0),
					resetBar: scrollBarFun,
					translateY: translateY,

				});

				if((m(topbottomContent).height()) < (window_h)) {
					translateY = 0;
				}

			}

			m(topbottomContent).setTransform("translateY", translateY);

		}

		m(scrolltb).touchendcancel(end)

		function end(event) {
			event.preventDefault();
			var touch = event.changedTouches[0];

			// 计算移动速度
			speedSetIntervalFisrt = true;
			clearInterval(speedSetIntervalId);

			var setTimeoutId = setTimeout(function() {
				clearInterval(speedSetIntervalId);
				clearTimeout(setTimeoutId);
			}, 100); // 意外处理

			// a链接
			if(isLink) {

				var _a = m(event.target).closest("a");
				var isHasParent = m(event.target).closest(".mobile-link");
				if(isHasParent.length > 0) {
					var href = _a.attr("href") || "javascript:;";
					window.location.assign(href);
				}

			}
			// 检查是否向上移动
			if(isAddMoveEvent) {
				return;
			}

			// 计算移动速度
			if(speedScroll > 80) {
				speedScroll = 80;
			} else if(speedScroll < -80) {
				speedScroll = -80;
			}

			var speedHeight = m(scrolltb).height();
			minY = window_h - topbottomContent.height();
			var _target = m(topbottomContent).getTransform("translateY");
			var target = _target + speedScroll * (speedHeight / 28);
			var bezier = 'ease-out';

			if(speedDcrt == "auto") {
				if(target > 0) {
					target = 0;
					m(topbottomContent).transition("all", 500, bezier);

				} else if(target < minY) {
					target = minY;
					if(m(topbottomContent).height() < window_h) {
						target = 0;
					}
					m(topbottomContent).transition("all", 500, bezier);

				} else {
					m(topbottomContent).transition("all", 800, bezier);
				}

			}

			//速度方向
			else if(speedDcrt == "up") {
				target = minY;
				m(topbottomContent).transition("all", 500, bezier);
			} else if(speedDcrt == "down") {
				target = 0;
				m(topbottomContent).transition("all", 500, bezier);
			}

			// 滚动条
			if(isScrollBar) {
				var scroll_Y = target;
				var scroll_box_h = m(topbottomContent).height();
				var scroll_box_sale = scroll_Y / scroll_box_h;
				mobile_scroll_bar.setTransform("translateY", -m(scrolltb).height() * scroll_box_sale);
				mobile_scroll_bar.transition("all", 800);

			}

			// 是否下拉加载
			if(isLoading) {
				loadingY = loading.offsetTop();

				// scroll上下滚动加载数据scrollloading自定义事件
				m(this).trigger("scrollloading", {
					el: topbottomContent.eq(0),
					resetBar: scrollBarFun,
					translateY: target, // 滚动translateY
					loading: loading,
					loadingY: loadingY, // loanding offsetTop值
					isLoading: (Math.abs(target)) >= (loadingY - window_h)

				});
			}

			// scroll上下滚动scrolltopbottom自定义事件
			if(Math.abs(speedScroll) != 0) {
				m(this).trigger("scrolltopbottom", {
					el: topbottomContent.eq(0),
					translateY: target,
					resetBar: scrollBarFun,

				});
			}

			//m(".mobile-head-ttl").html(speedScroll);
			m(topbottomContent).setTransform("translateY", target);

		}

		function scrollBarFun(event) {
			clearInterval(speedSetIntervalId);
			// 滚动条
			if(isScrollBar) {
				var scroll_Y = m(topbottomContent).getTransform("translateY");
				var scroll_box_h = m(topbottomContent).height();
				var scroll_box_sale = scroll_Y / scroll_box_h;
				mobile_scroll_bar.setTransform("translateY", -bar_wrap_h * scroll_box_sale);

				mobile_scroll_bar.transition("none");
				bar_h = m(topbottomContent).height();
				bar_wrap_h = m(scrolltb).height();
				sale_bar = bar_wrap_h / bar_h;
				scroll_bar_h = window_h * sale_bar;
				mobile_scroll_bar = m(scrolltb).find(".mobile-scroll-bar");
				mobile_scroll_bar.height(scroll_bar_h);
				//				mobile_scroll_bar.css("opacity",0);
				//				mobile_scroll_bar.transition("transform 1s,opacity 1s ease 1s");

			}

		}

	}

})(mobile);

export {

	scrollTopBottom
}