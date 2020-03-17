

$(function () {
   
    // ������һҳ�ĺ���
    function mBack() {
        m(document).on("tap", ".m-back", function (event) {
          window.history.back();
        });
    }

    mBack();

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