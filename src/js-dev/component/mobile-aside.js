var aside = (function(m) {

	// tab 左右滑动点击
	var isMOve_ttl = true;
	var startX_ttl = 0;
	var startY_ttl = 0;
	m(".mobile-aside-menu").on("touchstart", ".mobile-aside-ttl", function(event) {

		var touch = event.changedTouches[0];
		startX_ttl = touch.clientX;
		startY_ttl = touch.clientY;
		isMOve_ttl = true;

	});
	m(".mobile-aside-menu").on("touchmove", ".mobile-aside-ttl", function(event) {
		var touch = event.changedTouches[0];
		var nowX = touch.clientX;
		var nowY = touch.clientY;
		var dis = nowX - startX;
		if(Math.abs(nowX - startX_ttl) > 1 || Math.abs(nowY - startY_ttl) > 1) {
			isMOve_ttl = false;
		}

	});
	m(".mobile-aside-menu").on("touchend", ".mobile-aside-ttl", function(event) {

		if(isMOve_ttl) {

			// 添加样式
			$(this).siblings().removeClass("active");
			$(this).addClass("active");

			var id = m(this).attr("data-target");
			var obj = m(id); //mobile-scroll-content-many 
			obj.parents(".mobile-aside-content").find(".mobile-scroll-content-many").removeClass("active").hide();
			obj.parents(".mobile-aside-content").find(".mobile-scroll-bar").css("opacity",0).transition("null");
			m(obj).addClass("active").show();

			var navsList = m(this).parents(".mobile-scroll-content");
			var parent = m(this).parents(".mobile-aside-menu");
			var isCenter = parent.hasAttr("data-position-center");
			var isTop = parent.hasAttr("data-position-top");
			if(isCenter) {
				positionCenter(this, navsList);
			}
			if(isTop) {
				positionTop(this, navsList);
			}
			
			// 事件
			var isTrigger=parent.hasAttr("data-trigger");
			if(isTrigger){
				if(!$(obj).hasAttr("data-trigger")){
					$(obj).trigger("scrollloading",{
						el:obj,
						isLoading:true,
						loading:obj.find(".mobile-loading")
						
					});
				}
				
			}
			
		}

	});

	// position center
	function positionCenter(p, navsList) {
		var window_h = m(p).parents(".mobile-scroll-topbottom").height();
		var navsList_h = m(navsList).outerHeight();
		var current_top = m(p).offset().top;
		var current_h = m(p).outerHeight();
		var current_center = Math.abs(window_h / 2);
		var offsetCenter = (current_top - current_center) + current_h / 2;
		var scroll_top = navsList_h - window_h;
		if(navsList_h > window_h) {
			if(Math.abs(current_top) > Math.abs(current_center)) {
				if(Math.abs(scroll_top) < offsetCenter) {
					m(navsList).setTransform("translateY", -Math.abs(scroll_top));
				} else {
					m(navsList).setTransform("translateY", -offsetCenter);
				}

			} else {
				m(navsList).setTransform("translateY", 0);
			}
			m(navsList).transition("all", 800, "ease");
		}

	}

	// position top
	function positionTop(p, navsList) {
		var window_h = m(p).parents(".mobile-scroll-topbottom").height();
		var navsList_h = m(navsList).height();
		var current_top = m(p).offset().top;
		var scroll_top = navsList_h - window_h;
		if(navsList_h > window_h) {
			if(Math.abs(current_top) < Math.abs(scroll_top)) {
				m(navsList).setTransform("translateY", -current_top);
			} else {
				m(navsList).setTransform("translateY", -scroll_top);
			}
			m(navsList).transition("all", 800, "ease");
		}

	}

})(mobile);

export {
	aside
}