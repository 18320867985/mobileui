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
			
			if(translateY>=0){
				var scroll_top=topbottomContent[0].scrollTop;
			if(scroll_top===0){
				event.preventDefault();
				
				topbottomContent.css("overflow","hidden");
			}
			}
		
		}

		m(scrolltb).touchendcancel(end);

		function end(event) {
			topbottomContent.css("overflow","scroll");
		}

	}

})(mobile);

export {

	overflow
}