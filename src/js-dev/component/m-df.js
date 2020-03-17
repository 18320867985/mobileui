

$(function () {
   
    // 返回上一页的函数
    function mBack() {
        m(document).on("tap", ".m-back", function (event) {
          window.history.back();
        });
    }

    mBack();

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

        $cont.height($cont_height); // set cnt height
        $cont.css("top", $header_height); // set cnt top

    }

    // 设置页面布局
    m.extend({
        setLayout: setLayout
    });

    m.setLayout();
    m(window).on("resize", m.setLayout);

    // a标签链接
    m(document).on("tap", "a", function (event) {
        event.preventDefault();

        var isHref = m(this).hasAttr("href");
        var hrefValue = m(this).attr("href");
        if (isHref) {
            if (hrefValue.trim() === "" || hrefValue.trim() === "#" || hrefValue.trim() === "javascript;") {
                return;
            } else {

                if (m(this).hasAttr("data-router")) {
                    m.router.link(hrefValue);
                    return;
                }
                window.location.href = hrefValue;
            }

        }
    });

});