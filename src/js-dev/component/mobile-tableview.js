/*table-view*/

var tableview = (function(m) {

	m(".mobile-table-view ").tap(".mobile-table-view-ttl", function(event) {
		event.preventDefault();
		tableviewfn.call(this, event)

	});

	m(".mobile-table-view ").tap(".iconfont", function(event) {
		event.preventDefault();
		tableviewfn.call(this, event)

	});

	function tableviewfn(event) {
		var p = m(this).closest(".mobile-table-view-cell");
		p.siblings().find(".mobile-table-view-collapse").hide();
		p.siblings().find(".mobile-table-view-ttl").removeClass("active");
		p.find(".mobile-table-view-ttl").toggleClass("active");
		p.siblings().find(".iconfont").removeClass("active");
		p.find(".iconfont").toggleClass("active")

		p.siblings().find(".mobile-table-view-collapse").removeClass("active");
		var curt = m(this).parents(".mobile-table-view-cell").find(".mobile-table-view-collapse");
		curt.fadeToggle();
		curt.addClass("active");
	}
})(mobile);

export {
	tableview
}