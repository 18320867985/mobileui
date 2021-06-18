

$(function () {
   
    function setLayout() {

        // 整体框架设置内容height
        var $bd = $(".m-bd");
        var $header = $(".m-hd");
        var $cont = $(".m-cnt");
        var $footer = $(".m-ft");

        var $bd_height = parseFloat($bd.height()),
            $header_height = parseFloat($header.height()),
            $foote_height = parseFloat($footer.height());
        var $cont_height = $bd_height - ($header_height + $foote_height);

        $cont.height($cont_height);         // set cnt height
        $cont.css("top", $header_height);   // set cnt top

    }

    // 设置页面布局
    m.extend({
        setLayout: setLayout
    });

    m.setLayout();
    m(window).on("resize", m.setLayout);

    m(document).on("touchstart",function (event) {
         event.preventDefault();
    });

    m(document).on("touchmove", function (event) {
        event.preventDefault();
    });
   
    m(document).on("click", "a", function (event) {
        if (!m(this).hasAttr("data-open")) {
            event.preventDefault();	
		}
           
    });

    // 绑定函数 router.link 运行时执行 
    m.router.bindFn(function () {

        //获取当前激活路由页元素
        var $activeEl = m.router.getActiveEl();

        // m-media组件 a[data-link] 链接跳转
        m(".m-media-list", $activeEl).on("tap", "a[data-link]", function (event) {

            event.preventDefault();
            event.stopPropagation();
            m.router.alink.call(this);

        });

        // m-slide组件 a[data-link] 链接跳转
        m(".m-slide", $activeEl).on("tap", "a[data-link]", function (event) {

            event.preventDefault();
            event.stopPropagation();
            m.router.alink.call(this);

        });

        // m-listoption组件 a[data-link] 链接跳转
        m(".m-listoption", $activeEl).on("tap", "a[data-link]", function (event) {

            event.preventDefault();
            event.stopPropagation();
            m.router.alink.call(this);

        });


    });


    // 移动端

    //if (!m.isMobile()) {
    //    location.href = "./demo/not_mobile.html";
    //}

    // 微信端
    //if (!m.isWeixn()) {
    //    location.href = "./demo/not_weixin.html";
    //}


  
	/*************** h5+ 应用以下**************/

	// 扩展API是否准备好，如果没有则监听“plusready"事件
	if(window.plus){  
        plusReady();
    }
    else {   
        document.addEventListener("plusready", plusReady, false);
    } 
	
	// 是否手指触摸页面
    m.router.istouch = false;

	m(document).touch(function(){},function(event,obj){if(obj.isX){m.router.istouch=true;  }}, function () {m.router.istouch=false;});
	
	function  plusReady(){
		
		// 监听“返回”按钮事件
		plus.key.addEventListener("backbutton",function(){
		
			if(m.router.istouch){return;} // 是否手指触摸页面
			if(m.router.ismask){return;} // 是否已经显示mask
			m.router.back();
			
			// 退出app应用 
			if(m.router.getId()===0){
				// 退出应用
				if(!m.router._quitOne){
					
					m.router._quitTime1 =new Date().getTime();
					m.router._quitOne=true;
					//console.log(m.router._quitTime1);
				}else{
					m.router._quitTime2 =new Date().getTime();
					
					if((m.router._quitTime2-m.router._quitTime1)<3000)
					{
						plus.runtime.quit(); return;
					}
					m.router._quitTime1 =new Date().getTime();
	
				}

			}
		});
		

	};


});