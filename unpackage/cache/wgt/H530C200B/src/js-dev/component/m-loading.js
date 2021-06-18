+function () {

    //  m-info
   
    function _mLoading() {

        $(".m-loading").remove();

        var $loading = document.createElement("div");
        $loading.setAttribute("class", "m-loading");

        var $loading_cnt = document.createElement("div");
        $loading_cnt.setAttribute("class", "m-loading-cnt");

        var $loading_cnt_icon = document.createElement("div");
        $loading_cnt_icon.setAttribute("class", "m-loading-cnt-icon");
        $loading_cnt_icon.innerHTML = `<span class="iconfont iconloading"></span>`;

        var $loading_cnt_txt = document.createElement("div");
        $loading_cnt_txt.setAttribute("class", "m-loading-cnt-txt");
        $loading_cnt_txt.innerHTML = "正在加载";

        $loading_cnt.appendChild($loading_cnt_icon);
        $loading_cnt.appendChild($loading_cnt_txt);
        $loading.appendChild($loading_cnt);

        var $elm = document.body || document.documentElement;//m.router.getActiveEl();
        $elm.appendChild($loading);
		m.router.ismask=true;
        
    }
    function _mLoadingHide() {

        $(".m-loading").remove();
        m.router.ismask = false;


    }
  
    m.extend({
        mLoading: _mLoading,
        mLoadingHide: _mLoadingHide
    });

    
}();