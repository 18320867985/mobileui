
// m-message 信息框

+function () {

//  m-info
    m.extend({
        mInfo: _info
    });
    var info_setTimeout_id = 0;
    function _info(mess, type,positon) {

        mess = mess || "信息提示框";
        positon = positon || "center";
       
        $(".m-info").remove();
        var _class = "";
        if (typeof type === "string") {
            switch (type) {
                case "default":
                    _class = "";
                    break;
                case "primary":
                    _class = "text-primary";
                    break;
                case "success":
                    _class = "text-success";
                    break;
                case "warning":
                    _class = "text-warning";
                    break;
                case "danger":
                    _class = "text-danger";
                    break;
                default:
                    _class = "default";
            }

        }

        _class += " "+positon;
        // 创建v-message
        var info = document.createElement("div");
        info.setAttribute("class", "m-info in " + _class);

        var info_text = document.createElement("div");
        info_text.setAttribute("class", "m-info-text");
        info_text.innerHTML = mess;
        info.appendChild(info_text);

        var elm = document.body || document.documentElement;
        elm.appendChild(info);
        clearTimeout(info_setTimeout_id);
        info_setTimeout_id= setTimeout(function () {

              $(".m-info").remove();

        }, 1500);

    }

    // m-alert
    m.extend({

        mAlert: _alert
    });

    function _alert(mess, okfun, obj) {
        $(".m-alert").remove();
        if (arguments.length ===0) {

            throw new Error("参数不能为空！");
        }


        obj = obj || {};
        var _okText = obj.ok || "确定";

        mess = mess || "这是提示信息";
        var alert = document.createElement("div");
        alert.setAttribute("class", "m-alert in");

     
        var alert_cnt = document.createElement("div");
        alert_cnt.setAttribute("class", "m-alert-cnt");

   
        var ttl = document.createElement("div");
        ttl.setAttribute("class", "m-alert-cnt-ttl");

        var txt = document.createElement("div");
        txt.setAttribute("class", "_txt");
        txt.innerText = mess;

        var ok_btn = document.createElement("div");
        ok_btn.setAttribute("class", "m-alert-cnt-btn ok");
        ok_btn.innerText = _okText;
 

        ttl.appendChild(txt);
        alert_cnt.appendChild(ttl);
        alert_cnt.appendChild(ok_btn);
        alert.appendChild(alert_cnt);

        var elm = document.body || document.documentElement;
        elm.appendChild(alert);

        $(".m-alert-cnt-btn.ok").focus();
        $(".m-alert-cnt-btn.ok").on("tap",function (e) {
           
            if (typeof okfun === "function") {
                okfun.call(this);
              
            }
            $(".m-alert").remove();

        });

        $(".m-alert-cnt").on("tap", function (event) {
            event.stopPropagation();
            event.preventDefault();

        });
      

    }

    // m-confirm
    m.extend({

        mConfirm: _confirm
    });

    function _confirm(mess, okfun,nofun, obj) {
        $(".m-confirm").remove();
        if (arguments.length === 0) {

            throw new Error("参数不能为空！");
        }


        obj = obj || {};
        var _okText = obj.ok || "确定";
        var _noText = obj.no || "取消";

        mess = mess || "这是提示信息";
        var alert = document.createElement("div");
        alert.setAttribute("class", "m-confirm in");


        var alert_cnt = document.createElement("div");
        alert_cnt.setAttribute("class", "m-confirm-cnt");


        var ttl = document.createElement("div");
        ttl.setAttribute("class", "m-confirm-cnt-ttl");

        var txt = document.createElement("div");
        txt.setAttribute("class", "_txt");
        txt.innerText = mess;

        var btns = document.createElement("div");
        btns.setAttribute("class", "m-confirm-cnt-btns");


        var ok_btn = document.createElement("div");
        ok_btn.setAttribute("class", "m-confirm-cnt-btn ok");
        ok_btn.innerText = _okText;

        var no_btn = document.createElement("div");
        no_btn.setAttribute("class", "m-confirm-cnt-btn no");
        no_btn.innerText = _noText;


        ttl.appendChild(txt);
        alert_cnt.appendChild(ttl);
        btns.appendChild(no_btn);
        btns.appendChild(ok_btn);
        alert_cnt.appendChild(btns);
        alert.appendChild(alert_cnt);

        var elm = document.body || document.documentElement;
        elm.appendChild(alert);

        $(".m-confirm-cnt-btn.ok").focus();
        $(".m-confirm-cnt-btn.ok").on("tap", function (e) {

            if (typeof okfun === "function") {
                okfun.call(this);

            }
            $(".m-confirm").remove();

        });
        $(".m-confirm-cnt-btn.no").on("tap", function (e) {

            if (typeof nofun === "function") {
                nofun.call(this);

            }
            $(".m-confirm").remove();

        });
        $(".m-confirm-cnt").on("tap", function (event) {
            event.stopPropagation();
            event.preventDefault();

        });

    }

    // m-confirm2 下弹出的信息框
    m.extend({

        mConfirm2: _confirm2
    });

    function _confirm2(mess, okfun, nofun, obj) {
        $(".m-confirm2").remove();
        if (arguments.length === 0) {

            throw new Error("参数不能为空！");
        }

        obj = obj || {};
        var _okText = obj.ok || "确定";
        var _noText = obj.no || "取消";

        mess = mess || "这是提示信息";
        var alert = document.createElement("div");
        alert.setAttribute("class", "m-confirm2 in");

        var alert_cnt = document.createElement("div");
        alert_cnt.setAttribute("class", "m-confirm2-cnt in");

        var ttl = document.createElement("div");
        ttl.setAttribute("class", "m-confirm2-cnt-ttl");

        var txt = document.createElement("div");
        txt.setAttribute("class", "_txt");
        txt.innerText = mess;

        var body = document.createElement("div");
        body.setAttribute("class", "m-confirm2-body");

        var ok_btn = document.createElement("div");
        ok_btn.setAttribute("class", "m-confirm2-cnt-btn ok");
        ok_btn.innerText = _okText;

        var no_btn = document.createElement("div");
        no_btn.setAttribute("class", "m-confirm2-cnt-cancel");
        no_btn.innerText = _noText;

        ttl.appendChild(txt);
        body.appendChild(ttl);
        body.appendChild(ok_btn);
        alert_cnt.appendChild(body);
        alert.appendChild(alert_cnt);
        alert_cnt.appendChild(no_btn);

        var elm = document.body || document.documentElement;
        elm.appendChild(alert);

        $(".m-confirm2-cnt-btn.ok").focus();
        $(".m-confirm2-cnt-btn.ok").on("tap", function (event) {
            event.stopPropagation();
            var self = this;
            m(this).parents(".m-confirm2-cnt").removeClass("in").addClass("out");
            setTimeout(function () {
                $(".m-confirm2").remove();
                if (typeof okfun === "function") {
                    okfun.call(self);
                }
            }, 400);
            
        });

        $(".m-confirm2-cnt-cancel").on("tap", function (event) {
            event.stopPropagation();
            var self = this;
            m(this).parents(".m-confirm2-cnt").removeClass("in").addClass("out");

            setTimeout(function () {
                $(".m-confirm2").remove();
                if (typeof nofun === "function") {
                    nofun.call(self);

                }
            }, 400);

        });
        $(".m-confirm2-cnt").on("tap", function (event) {
            event.stopPropagation();
            event.preventDefault();
       
        });
        $(".m-confirm2").on("tap", function (event) {
            event.stopPropagation();
            m(this).find(".m-confirm2-cnt").removeClass("in").addClass("out");

            setTimeout(function () {
                $(".m-confirm2").remove();
            }, 400);

        });

    }


    // m-actionsheet 下弹出的信息框
    m.extend({

        mActionsheet: _actionsheet
    });

    function _actionsheet(list, nofun, obj) {
        
        list = list || [];
        list = list.length === 0 ? [{ txt:"actionsheet下弹出的信息框", fn: function() { }}] : list;
        $(".m-actionsheet").remove();
      
        obj = obj || {};
        var _noText = obj.no || "取消";

        var actionsheet = document.createElement("div");
        actionsheet.setAttribute("class", "m-actionsheet in");
        var actionsheet_cnt = document.createElement("div");
        actionsheet_cnt.setAttribute("class", "m-actionsheet-cnt in");

        var body = document.createElement("div");
        body.setAttribute("class", "m-actionsheet-body");
      

        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var ok_btn = document.createElement("div");
            ok_btn.setAttribute("class", "m-actionsheet-cnt-btn ok");
            ok_btn.innerHTML = item.txt;
            ok_btn.item = item;
            body.appendChild(ok_btn);
        }
       
        var no_btn = document.createElement("div");
        no_btn.setAttribute("class", "m-actionsheet-cnt-cancel");
        no_btn.innerText = _noText;

        actionsheet_cnt.appendChild(body);
        actionsheet.appendChild(actionsheet_cnt);
        actionsheet_cnt.appendChild(no_btn);

        var elm = document.body || document.documentElement;
        elm.appendChild(actionsheet);

        $(".m-actionsheet-cnt-btn.ok").on("tap", function (event) {
            event.stopPropagation();
            m(this).parents(".m-actionsheet-cnt").removeClass("in").addClass("out");
            var item = m(this).get(0).item;
            setTimeout(function () {
                item.fn.call(item);
                $(".m-actionsheet").remove();
            }, 400);
            
        });

        $(".m-actionsheet-cnt-cancel").on("tap", function (event) {
            event.stopPropagation();
            var self = this;
            m(this).parents(".m-actionsheet-cnt").removeClass("in").addClass("out");

            setTimeout(function () {
                $(".m-actionsheet").remove();
                if (typeof nofun === "function") {
                    nofun.call(self);

                }
            }, 400);

        });
        $(".m-actionsheet-cnt").on("tap", function (event) {
            event.stopPropagation();
            event.preventDefault();
       
        });
        $(".m-actionsheet").on("tap", function (event) {
            event.stopPropagation();
            m(this).find(".m-actionsheet-cnt").removeClass("in").addClass("out");

            setTimeout(function () {
                $(".m-actionsheet").remove();
            }, 400);

        });


    }

}();

