var overflow = (function(m) {

	m(function() {
		topBottom();
	})

	//导航拖拽
	function topBottom() {
		var scrolltb = m(".mobile-overflow");
		scrolltb.each(function(i, v) {
			topBottomFun(v);

		});

	}

	//导航拖拽fun
	function topBottomFun(scrolltb) {

		var topbottomContent = m(scrolltb).find(".mobile-overflow-content");

		m(topbottomContent).setTransform('translateZ', 0.01);

		var eleY = 0; // 元素初始位置
		var startY = 0;
		var startX = 0;
		var isLink = true;
		var isLinkFirst = true;
		var isAddMoveEvent = false; // 判断是否往上拖动
		var isAddMoveEventFirst = true; // 判断是否第一往上拖动
		var dis = 0;
		
		var isScrollTop = m(scrolltb).hasAttr("data-scroll-top"); // 是否下拉
		var isScrollBottom = m(scrolltb).hasAttr("data-scroll-bottom"); // 是否上拉


		var window_h = m(scrolltb).height();
		var minY = window_h - topbottomContent.height();

		m(scrolltb).touchstart(start);

		function start(event) {

			var touch = event.changedTouches[0]
			startY = touch.clientY;
			startX = touch.clientX;
			isLink = true;
			isLinkFirst = true;

			eleY = m(topbottomContent).getTransform("translateY");
			m(topbottomContent).css("overflow-y", "scroll");

			isAddMoveEvent = false; // 判断是否往上拖动
			isAddMoveEventFirst = true; // 判断是否第一往上拖动

			window_h = m(scrolltb).height();
			// 过度时间0s
			topbottomContent.transition("none");

		};

		m(scrolltb).touchmove(move);

		function move(event) {

			window_h = m(scrolltb).height();
			var touch = event.changedTouches[0]
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

			// 检查是否向上移动
			if(isAddMoveEventFirst && (_x != _y)) {
				isAddMoveEventFirst = false;
				if(_x > _y) {
					isAddMoveEvent = true;
				}
			}

			if(isAddMoveEvent) {
				event.preventDefault();
				return;
			}

			minY = window_h - topbottomContent.height();
			var translateY = eleY + dis;

//			if(translateY >= 0) {
//				var scroll_top = topbottomContent[0].scrollTop;
//				if(scroll_top === 0) {
//					event.preventDefault();
//					topbottomContent.css("overflow", "hidden");
//				}
//			}

		if(translateY > 0) {
				var scale = 1 - translateY / window_h;
				translateY = translateY * scale;
				speedDcrt = "down"; //速度方向

				// 是否下拉
				if(!isScrollTop) {
					translateY = 0;

				}
				m(topbottomContent).setTransform("translateY", translateY);
				

			} else if(translateY < minY) {
				var over = Math.abs(translateY - minY);
				var scale = 1 - over / window_h;
				translateY = minY - over * scale;
				speedDcrt = "up"; //速度方向
				// 是否上拉
				if(!isScrollBottom) {
					translateY = minY;

				}

				

				if((m(topbottomContent).height()) < (window_h)) {
					translateY = 0;
				}

			}

		
		}

		m(scrolltb).touchendcancel(end);

		function end(event) {
			
			var touch = event.changedTouches[0];
			topbottomContent.css("overflow", "scroll");
			
			minY = window_h - topbottomContent.height();
			var target = m(topbottomContent).getTransform("translateY");
		
			var bezier = 'ease-out';
				if(target > 0) {
						console.log(target)
					target = 0;
					m(topbottomContent).setTransform("translateY", target);
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
		
		m(scrolltb).windowcancel(function(event){
				//console.log(this)
		});
			
			

	}


	

})(mobile);

export {

	overflow
}