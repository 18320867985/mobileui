var spy = (function(m) {

	m(function() {
		var wrap = m(".mobile-spy");
		wrap.each(function(i, v) {
			spyFun(v);
		});

	});

	function spyFun(spyitem) {
		// scrolltopbottom上下scroll监听 
		var wrap = m(spyitem);
		var p = wrap.find(".mobile-scroll-topbottom");
		var content = p.find(".mobile-scroll-content")
		var lastY = content.height() - p.height();
		var isSpy = p.hasAttr("data-spy");
		var items = [];
		if(!isSpy) {
			return;
		}

		wrap.find(".mobile-scroll-topbottom").on("touchstart", function(event) {
			lastY = content.height() - p.height();
			var spys = wrap.find(".mobile-spy-item");
			spys.each(function(i, v) {
				var top = m(v).offsetTop();
				var name = m(v).attr("data-group");
				var o = {};
				o.top = top;
				o.name = name;
				items.push(o);
			});

		});

		wrap.find(".mobile-scroll-topbottom").on("scrolltopbottom", function(event) {
			var el = m(event.detail.el);
			var translateY = event.detail.translateY;
			translateY = translateY > 0 ? 0 : translateY;
			translateY = Math.abs(translateY);
			if(translateY >= Math.abs(lastY)) {
				setindexlistTop(items.length - 1, items);
				return;
			}
			for(var i = 0; i < items.length; i++) {

				if(i < (items.length - 1)) {
					if(translateY >= items[i].top && translateY < items[i + 1].top) {
						setindexlistTop(i, items);
						break;
					}
				} else if(i === items.length - 1) {
					setindexlistTop(i, items);
					break;

				}
			}

		});

		function setindexlistTop(i, items) {
			var group = "[data-spy=" + items[i].name + "]";
			var spy_curt = wrap.find(".mobile-spy-ttl" + group);
			var spy_ttl = wrap.find(".mobile-spy-ttl");
			spy_ttl.removeClass("active");
			spy_curt.addClass("active");

		}

	}

})(mobile);

export {

	spy
}