

$(function () {
   
    function setLayout() {

        // ��������������height
        var $bd = $(".m-bd");
        var $header = $(".m-hd");
        var $cont = $(".m-cnt");
        var $footer = $(".m-ft");

        var $bd_height = parseFloat($bd.height()),
            $header_height = parseFloat($header.height()),
            $foote_height = parseFloat($footer.height());
        var $cont_height = $bd_height - ($header_height + $foote_height);

        $cont.height($cont_height); // set cnt height
        $cont.css("top", $header_height); // set cnt top

    }

    // ����ҳ�沼��
    m.extend({
        setLayout: setLayout
    });

    m.setLayout();
    m(window).on("resize", m.setLayout);

    // a��ǩ����
   
    m("a").click(function (event) {
        event.preventDefault();
    });

    m(document).on("click", "a", function (event) {
        event.preventDefault();
       
    });

    m("a").tap(function (event) {
        event.preventDefault();
    });

    m(document).on("tap", "a[data-link-btn]", function (event) {

        event.preventDefault();

        var isHref = m(this).hasAttr("href");
        var hrefValue = m(this).attr("href");
        if (isHref) {
            if (hrefValue.trim() === "" || hrefValue.trim() === "#" || hrefValue.trim() === "javascript;") {
                return;
            } else {

                //if (m(this).hasAttr("data-router")) {
                    m.router.link(hrefValue);
                    return;
              //  }
               // window.location.href = hrefValue;
            }

        }
    });


    // �ƶ���

    //if (!m.isMobile()) {
    //    location.href = "./demo/not_mobile.html";
    //}

    // ΢�Ŷ�
    //if (!m.isweixn()) {
    //    location.href = "./demo/not_weixin.html";
    //}
  

	/*************** h5+ Ӧ������**************/

	// ��չAPI�Ƿ�׼���ã����û���������plusready"�¼�
	if(window.plus){  
	    plusReady();  
	}else{   
	    document.addEventListener("plusready", plusReady, false);  
	} 
	
	// �Ƿ���ָ����ҳ��
	m.router.istouch=false;
	 m(document).touch(function(){},function(event,obj){
		 if(obj.isX){m.router.istouch=true;  }
		 },function(){
		  m.router.istouch=false;
	 });
	
	function  plusReady(){
		
		// ���������ء���ť�¼�
		plus.key.addEventListener("backbutton",function(){
		
			if(m.router.istouch){return;} // �Ƿ���ָ����ҳ��
			if(m.router.ismask){return;} // �Ƿ��Ѿ���ʾmask
			m.router.back();
			
			//Ӧ���л�����̨����
			if(m.router.getId()===0){
			
			}
		});
		

	};


});