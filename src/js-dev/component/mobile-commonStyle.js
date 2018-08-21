/*公共js设置样式*/
var commonStyle = (function(m) {
	

		m(".mobile-head,.mobile-footer,.mobile-tab").touchstart(function(event) {
			event.preventDefault();

		});
		m(".mobile-head,.mobile-footer,.mobile-tab").touchmove(function(event) {
			event.preventDefault();

		});
		m(".mobile-head,.mobile-footer,.mobile-tab").touchend(function(event) {
			event.preventDefault();

		});
		m(".mobile-head,.mobile-footer,.mobile-tab").touchcancel(function(event) {
			event.preventDefault();

		});

	

	// 设置主题内容样式
	m(function() {
		reset();
		m(window).resize(function() {
			reset();
		});

		// 返回上一页
		m(".mobile-back").on("touchend", function(event) {
			event.preventDefault();
			if(history.back) {
				history.back();
			}
		});

	});

	function reset() {
		mobileContent();
		mobileTab();
	}

	// scroll-content内容
	function mobileContent() {
		var tab = m(".mobile-tab");
		var head = m(".mobile-head");
		var content = m(".mobile-content");
		var footer = m(".mobile-footer");
		var window_h = m(window).height();
		var head_h = head.height() || 0;
		var footer_h = footer.height() || 0;

		var tab_h = 0;
		m(tab).each(function() {
			var _h = m(this).height() || 0;
			tab_h += _h;

		});

		var content_h = window_h - (head_h + footer_h + tab_h);
		content.height(content_h);
		var tab_top = m(".mobile-tab-top");
		var tab_top_h = tab_top.height() || 0;
		content.css("top", head_h + tab_top_h);

		//		console.log(head_h);
		//		console.log(footer_h)
		//		console.log(tab_h)
		//		console.log(content_h)
		//		console.log(window_h)

	}

	// scroll-tab
	function mobileTab() {
		var tab_top = m(".mobile-tab-top");
		var head = m(".mobile-head");
		var head_h = head.height() || 0;
		tab_top.css("top", head_h);

		var tab_bottom = m(".mobile-tab-bottom");
		var footer = m(".mobile-footer");
		var footer_h = footer.height() || 0;
		tab_bottom.css("bottom", footer_h);

	}

	m.commonStyle = {
		reset: reset
	}

})(mobile);

export {
	commonStyle
}