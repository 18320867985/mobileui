// 菜单左右滑动
var scrollLeftRight = (function(m) {

	m(function() {
		navSlide();
	})

	//导航拖拽
	function navSlide() {
		var navs = m(".mobile-scroll-leftright");
		for(var i = 0; i < navs.length; i++) {
			navsListFun(navs[i]);
		}

	}

	//导航拖拽fun
	function navsListFun(navs) {

		var navsList = m(navs).find(".mobile-scroll-content");
		if(navsList.length === 0) {
			return;
		}
		navsList.setTransform('translateZ', 0.01);
		var beginTime = 0;
		var beginValue = 0;
		var endTime = 0;
		var endValue = 0;
		var disTime = 0;
		var disValue = 0;
		var eleX = 0; // 元素初始位置
		var startX = 0;
		var startY = 0;
		var isMOve = true;

		// 定位到left
		var isPositionLeft = m(navs).hasAttr("data-position-left");
		// 定位到center
		var isPositionCenter = m(navs).hasAttr("data-position-center");

		var window_w =m(navs).width();

		var isAddMoveEvent = false; // 判断是否top拖动
		var isAddMoveEventFirst = true; // 判断是否第一往上拖动

		m(navs).touchstart(start);

		function start(event) {
			event.preventDefault();
			var touch = event.changedTouches[0];
			startX = touch.clientX;
			startY = touch.clientY;
			isMOve = true;
			eleX = m(navsList).getTransform("translateX");
			beginTime = new Date().getTime();
			beginValue = eleX;
			disValue = 0;

			// 过度时间0s
			m(navsList).transition("none");
		};

		m(navs).touchmove(move);

		function move(event) {
			event.preventDefault();
			var touch = event.changedTouches[0];
			var nowX = touch.clientX;
			var nowY = touch.clientY;
			var dis = nowX - startX;

			if(Math.abs(nowX - startX) > 1 || Math.abs(nowY - startY) > 1) {
				isMOve = false;
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

			window_w =m(navs).width();

			var minX = window_w - navsList.width();

			var translateX = eleX + dis;
			if(translateX > 0) {
				var scale = 1 - translateX / window_w;
				translateX = translateX * scale;

			} else if(translateX < minX) {
				var over = Math.abs(translateX - minX);
				var scale = 1 - over / window_w;
				translateX = minX - over * scale;
				if(m(navsList).width() < window_w) {
					translateX = 0;
				}

			}

			m(navsList).setTransform("translateX", translateX);
			endTime = new Date().getTime();
			endValue = translateX;
			disTime = endTime - beginTime;
			disValue = endValue - beginValue;
		}

		m(navs).touchendcancel(end);

		function end(event) {
			event.preventDefault();
			var touch = event.changedTouches[0];
			var speed = disValue / (endTime - beginTime);
			window_w = m(navs).width();

			if(isMOve) {

				// 单击选中样式
				var p = m(event.target).closest("li");
				if(p.length > 0) {
					m(this).find("li").removeClass("active");
					p.addClass("active");

					// scroll单击选中样式自定义事件
					m(this).trigger("scrollselect", p[0]);

					// 选中的样式移动
					if(isPositionLeft) {
						positionLeft(p); // 移动到left
					}
					else if(isPositionCenter){
						positionCenter(p) // 移动到center
					}
				
					
					// a链接
					var href = m(event.target).closest("a").attr("href") || "javascript:;";
					window.location.assign(href);
					return;

				}

			}

			isAddMoveEvent = false; // 判断是否top拖动
			isAddMoveEventFirst = true; // 判断是否第一往上拖动

			var minX = window_w - navsList.width();
			var target = m(navsList).getTransform("translateX") + speed * 150;
			var bezier = '';
			bezier = 'cubic-bezier(.17,.67,.81,.9)';
			if(target > 0) {
				target = 0;

			} else if(target < minX) {
				target = minX;
				if(m(navsList).width() < window_w) {
					target = 0;
				}
			}
			// 过度时间0.5s
			navsList[0].style.transition = '0.8s ' + bezier;
			m(navsList).setTransform("translateX", target);

		}

		// position left
		function positionLeft(p) {
			
				var navsList_w = m(navsList).width();
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

		// position center
		function positionCenter(p) {
			
				var navsList_w = m(navsList).outerWidth();
				var current_left = m(p).offset().left;
				var current_w = m(p).outerWidth();
				var current_center = Math.abs(window_w/2);
				var offsetCenter=(current_left-current_center)+current_w/2;
				var scroll_left = navsList_w - window_w;
				//console.log(current_center);
				if(navsList_w > window_w) {
					if(Math.abs(current_left) > Math.abs(current_center)) {
						if(Math.abs(scroll_left)<offsetCenter){
							m(navsList).setTransform("translateX", -Math.abs(scroll_left));
						}else{
							m(navsList).setTransform("translateX", -offsetCenter);
						}
						

					} else {
						m(navsList).setTransform("translateX", 0);
					}
					m(navsList).transition("all", 800, "ease");
				}
			
		}

	}

})(mobile)

export {
	scrollLeftRight
}