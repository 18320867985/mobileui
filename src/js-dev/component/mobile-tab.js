// tab
var tab = (function(m) {

	m(function() {
		var wrap = m(".mobile-tab-slide");
		wrap.each(function(i, v) {
			tabSlide(v);
		});

		// mobile-tab-nav 标签下面线条 
		mobile_tab_nav_line();

	});

	m(window).resize(function() {
		reset()
	});

	function reset() {

		var tab = m(".mobile-tab-slide");
		if(tab.length > 0) {
			var window_w = m(tab).parent().width(); //m(window).width();
			tab.width(window_w);

			tab.each(function() {
				var wrap = m(this);
				var list = wrap.find(".mobile-tab-slide-list");
				var liNodes = wrap.find(".mobile-tab-slide-item");
				var wrap_w = wrap.width();
				list.width(wrap_w * liNodes.length);
				liNodes.width(wrap_w);

			});

		}

	}

	function tabSlide(mobile_slide) {
		var window_w = m(mobile_slide).width();
		var wrap = m(mobile_slide);
		var list = wrap.find(".mobile-tab-slide-list");
		var liNodes = wrap.find(".mobile-tab-slide-item");

		wrap.width(window_w);
		var wrap_w = wrap.width();
		list.width(wrap_w * liNodes.length);
		liNodes.width(wrap_w);
		var isDrag = wrap.hasAttr("data-drag"); //左右两边回弹
		var tab_nav_slide_lineX = 0; // 滑动下面的线条

		var elementX = 0;
		var startX = 0;
		var startY = 0;
		var now = 0;
		var isLink = true;
		var isAddMoveEvent = false; // 判断是否往上拖动
		var isAddMoveEventFirst = true; // 判断是否第一往上拖动

		m(list).setTransform('translateZ', 0.01)
		wrap.touchstart(start);

		// start
		function start(event) {
			event.preventDefault();
			var touch = event.changedTouches[0];
			list = wrap.find(".mobile-tab-slide-list");
			liNodes = wrap.find(".mobile-tab-slide-item");

			isLink = true;
			list.transition("none");
			var left = m(list).getTransform("translateX");
			 now = Math.round(-left / m(mobile_slide).width());

			isAddMoveEvent = false; // 判断是否top拖动
			isAddMoveEventFirst = true; // 判断是否第一往上拖动

			m(list).setTransform('translateX', -now * m(mobile_slide).width());
			startX = touch.clientX;
			startY = touch.clientY;
			elementX = m(list).getTransform('translateX');

			// 滑动下面的线条
			var tab_nav = m(".mobile-tab-nav");
			var isSlieLine = tab_nav.hasAttr("data-line");
			if(isSlieLine) {
				tab_nav_slide_lineX = tab_nav.find(".mobile-tab-slide-line").getTransform("translateX");
			}

		}

		wrap.touchmove(move);

		function move(event) {
			event.preventDefault();
			var touch = event.changedTouches[0];
			var nowX = touch.clientX;
			var nowY = touch.clientY;
			var disX = nowX - startX;
			var line_SlideX = disX

			if(Math.abs(nowX - startX) > 1 || Math.abs(nowY - startY) > 1) {
				isLink = false;
			}

			// 检查是否向上移动
			var _x = Math.abs(nowX - startX);
			var _y = Math.abs(nowY - startY);
			if(isAddMoveEventFirst && (_x != _y)) {
				isAddMoveEventFirst = false;
				if(_y > _x) {
					isAddMoveEvent = true;
				}
			}
			if(isAddMoveEvent) {

				return;
			}

			// 回弹
			window_w = m(mobile_slide).width();
			var minX = Math.abs(list.width() - window_w);
			//console.log(minX)
			var translateX = elementX + disX;
			if(isDrag) {

				if(translateX > 0) {
					var scale = 1 - translateX / window_w;
					translateX = translateX * scale;

					line_SlideX = translateX - scale * elementX;

				} else if(Math.abs(translateX) > minX) {
					var over = Math.abs(translateX) - Math.abs(minX);
					var scale = 1 - over / window_w;
					translateX = -minX - over * scale;

					line_SlideX = translateX - elementX
				}

				m(list).setTransform('translateX', translateX);
			} else {
				if(translateX > 0) {
					translateX = 0;
					line_SlideX = 0;
				} else if(Math.abs(translateX) > Math.abs(minX)) {
					translateX = -minX;
					line_SlideX = translateX - elementX;
				}

				m(list).setTransform('translateX', translateX);

			}

			//tab tabend左右滑动move发生的事件
			m(this).trigger("tabmove", {
				el: liNodes.eq(now),
				translateX: line_SlideX,
				lineX: tab_nav_slide_lineX

			});

		}

		wrap.touchendcancel(end);

		//touchend
		function end(event) {
			event.preventDefault();
			var touch = event.changedTouches[0];
			var nowX = touch.clientX;
			var nowY = touch.clientY;

			var left = m(list).getTransform("translateX");
			var ratio = -left / m(mobile_slide).width();
			if(nowX > startX) {

				now = m.round(ratio, 0.7);
				

			} else {
				now = m.round(ratio, 0.3);
				
			}
			//now = m.round(ratio);

			if(now < 0) {
				now = 0
			} else if(now > liNodes.length - 1) {
				now = liNodes.length - 1
			}
			//tab tabend左右滑动结束发生的事件
			m(this).trigger("tabend", {
				el: liNodes.eq(now)

			});

			list.transition("all", 500);
			m(list).setTransform('translateX', -now * m(mobile_slide).width());

		}

	}

	// mobile-tab-slide滑动touchend触发的事件
	m(".mobile-tab-slide").on("tabmove", function(event) {
		event.preventDefault();
		var el = m(event.detail.el);
		var translateX = event.detail.translateX;
		var id = el.attr("id") || el.attr("data-id");
		var dataId = '[data-target=\\#' + id + ']';
		var target = m(".mobile-tab").find(dataId);
		var isSlide_line = m(".mobile-tab .mobile-tab-nav").hasAttr("data-line");
		if(isSlide_line) {
			var li_w = target.width();
			var tab_slide_w = m(this).width();
			var sp = translateX / tab_slide_w;
			var line = m(".mobile-tab-slide-line");
			var lineX = event.detail.lineX;
			var sp_v = li_w * sp;
			var line_slideX = -sp_v + lineX;
			line.setTransform("translateX", line_slideX);
			line.transition("none");
			//console.log("line")

		}

	});

	// mobile-tab-slide滑动touchend触发的事件
	m(".mobile-tab-slide").on("tabend", function(event) {
		event.preventDefault();

		var el = m(event.detail.el);
		el.parents(".mobile-tab-slide-list").find(".mobile-tab-slide-item ").removeClass("active");
		el.addClass("active");
		var id = el.attr("id") || el.attr("data-id");
		var dataId = '[data-target=\\#' + id + ']';
		var target = m(".mobile-tab").find(dataId);
		m(target).siblings().removeClass("active");
		m(target).addClass("active");
		var p = m(target).parents(".mobile-tab-nav");
		var isleft = p.hasAttr("data-position-left");
		var isCenter = p.hasAttr("data-position-center");

		if(isleft) {
			positionLeft(target)
		} else if(isCenter) {
			positionCenter(target);
		}

		// 是否允许触发事件
		var isTrigger = el.parents(".mobile-tab-slide").hasAttr("data-trigger");
		var el_content = el.find(".mobile-scroll-content");
		if(el_content.length <= 0) {
			el_content = el;
		}

		if(isTrigger) {
			if(!el_content.hasAttr("data-trigger")) {
				el.emit("scrollloading", {
					el: el_content.eq(0),
					isLoading: true,
					loading: el_content.find(".mobile-loading"),
				});
			}
		}

		// 标签下面线条
		setLineTransleateX(target);

	});

	// position center
	function positionCenter(p) {
		var window_w = m(window).width();
		var navsList = m(p).parents(".mobile-scroll-content");
		var navsList_w = navsList.outerWidth();
		var current_left = m(p).offset().left;
		var current_w = m(p).outerWidth();
		var current_center = Math.abs(window_w / 2);
		var offsetCenter = (current_left - current_center) + current_w / 2;
		var scroll_left = navsList_w - window_w;

		if(navsList_w > window_w) {

			if(Math.abs(current_left) > Math.abs(current_center)) {
				if(Math.abs(scroll_left) < offsetCenter) {
					m(navsList).setTransform("translateX", -Math.abs(scroll_left));
				} else {
					m(navsList).setTransform("translateX", -offsetCenter);
				}

			} else {
				m(navsList).setTransform("translateX", 0);
			}
			m(navsList).transition("all", 800, "ease");
		}

	}
	// position left
	function positionLeft(p) {
		var window_w = m(window).width();
		var navsList = m(p).parents(".mobile-scroll-content");
		var navsList_w = navsList.width();
		var current_left = m(p).offset().left;
		var scroll_left = navsList_w - window_w;
		if(navsList_w > window_w) {
			if(Math.abs(current_left) < Math.abs(scroll_left)) {
				m(navsList).setTransform("translateX", -current_left);
			} else {
				m(navsList).setTransform("translateX", -scroll_left);
			}
			m(navsList).transition("all", 800, "ease");
		}

	}

	
		m(".mobile-tab-nav").tap("li", function(event) {

			// 添加样式
			var $this = m(this);
			$this.siblings().removeClass("active");
			$this.addClass("active");

			var id = $this.attr("data-target");
			var obj = m(id);

			// tuochend 发生的事件
			$this.emit("tabnavend", {
				el: this
			});

			var p = obj.parents(".mobile-tab-slide-list");
			// add active
			p.find(".mobile-tab-slide-item").removeClass("active");
			obj.addClass("active");
			var left = m(obj).offset().left;
			m(p).setTransform("translateX", -left);
			var istransition = m(obj).parents(".mobile-tab-slide").hasAttr("data-transition");
			if(istransition) {
				m(p).transition("all", 500);
			} else {
				m(p).transition("none");
			}

			// 是否允许触发事件
			var isTrigger = $this.parents(".mobile-tab-nav").hasAttr("data-trigger");
			var el_content = obj.find(".mobile-scroll-content");

			if(el_content.length <= 0) {
				el_content = obj;
			}

			if(isTrigger) {
				if(!el_content.hasAttr("data-trigger")) {
					el_content.emit("scrollloading", {
						el: el_content.eq(0),
						isLoading: true,
						loading: el_content.find(".mobile-loading"),

					});
				}
			}

			// 标签下面线条
			setLineTransleateX($this);

	

	});

	//mobile-tab-nav 标签下面线条 
	function mobile_tab_nav_line() {
		var tab_nav = m(".mobile-tab-nav");
		tab_nav.each(function(i, v) {

			var ul = m(v);
			var isLine = ul.hasAttr("data-line");
			if(isLine) {
				var line = document.createElement("div");
				line.classList.add("mobile-tab-slide-line");
				ul.append(line);

				var li = ul.find("li");
				var line = ul.find(".mobile-tab-slide-line");
				line.width(li.width());
				line.css("left", ul.css("padding-left"));
				setLineTransleateX(ul.find("li.active"));
			}

		});

	}

	function setLineTransleateX($this) {

		var li_w = $this.outerWidth();
		var li_index = $this.index();
		var line = $this.parents(".mobile-tab-nav").find(".mobile-tab-slide-line");
		line.setTransform("translateX", li_w * li_index);
		line.transition("transform", 500);

	}

	m.tab = {
		reset: reset
	}

})(mobile);

export {
	tab
}