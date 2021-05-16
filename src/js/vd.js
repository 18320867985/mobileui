

/* 	
   作者：hqs
   时间：2017-10-08
   描述：表单验证    

*/

(function () {
    "use strict";
    
    var Validate = function (formName, content) {

        this.submitText="正在提交中...";

        this.formName = typeof formName === "undefined" ? ".form" : formName;
        this.content = content || m(document);
        this.$p = $(this.content).find(this.formName);
        this.init = function () {

            this.addErrorStyle(false, true);
            this.checkObj(this.formName);
            this.addVidation();

        };

        this.baseRemoteUrl="",

        this.disabled = function (obj) {

            $(obj).attr("disabled", "disabled");

        };

        this.enabled = function (obj) {

            $(obj).removeAttr("disabled");
        };

        this.arrs = [];

        this.vdbtnText = "";

        this.compareEmit = function (pName, compareName, value) {
            var el = $("" + pName + " [name=" + compareName + "]",this.$p);
            if ($.trim(el.val()) === "") {
                return;
            }
            for (var i = 0; i < this.arrs.length; i++) {
                if ($.trim(this.arrs[i].elName) === $.trim(compareName)) {
                    if (window.addEventListener) {
                        $(el).trigger("input");

                    } else {
                        $(el).trigger("keyup");
                    }

                    break;
                }

            }

        };

        this.checkObj = function (formName) {
   
            if (typeof formName === "undefined") {
                formName = ".form";
            }

            this.arrs = [];
            var $this = this;

            this.$p.find("" + formName + " .vd-item").each(function () {
                var name = $(this).attr("name");
                var v = $(this).val();
                var req_msg = $(this).attr("vd-req-msg");
                var pattern = $(this).attr("vd-pattern");
                var pattern_msg = $(this).attr("vd-pattern-msg");

                // type=checkbox 复选框
                var _ck = $(this).attr("vd-ck");
                var _ck_req = $(this).attr("vd-req");
                var _ck_checked = $(this).attr("vd-ck-true") || $(this).val();

                var errorMsg = "";
                if (typeof req_msg !== "undefined" && v === "") {
                    errorMsg = req_msg;
                } else if (typeof pattern_msg !== "undefined") {
                    var reg = new RegExp(pattern, "i");
                    if (!reg.test(v)) {
                        errorMsg = pattern_msg;
                    }

                } else {
                    errorMsg = "";

                }

                if (name !== "" && name !== "vd-btn") {
                    var obj = {};
                    obj.pName = formName; //表单name
                    obj.elName = name; // 元素name
                    obj.errorMsg = errorMsg; // 验证错误提示信息
                    obj.val = v;
                    obj.el = this; // document.forms[formName][name];
                    obj.bl = false;
                    if (typeof _ck_req === "undefined") {
                        obj.bl = true;
                    }

                    if (typeof _ck !== "undefined") {

                        if (this.checked) {
                            obj.bl = true;
                            obj.val = _ck_checked;

                        } else {

                            if (typeof _ck_req !== "undefined") {
                                obj.bl = false;
                            } else {
                                obj.bl = true;
                            }

                            obj.val = $(this).attr("vd-ck-false") || false;
                        }

                    }

                    $this.arrs.push(obj);

                }

                // 复选组框
                var _ck_gp_attr = $(this).attr("vd-ck-gp");
                var _vd_gp_req = $(this).attr("vd-req"); //  必填项
                var _ck_gp_msg = $(this).attr("vd-req-msg");
                if (typeof _ck_gp_attr !== "undefined") {

                    var _ck_gp_length = $(this).find("[type=checkbox]:checked").length;

                    var p = $(this).parents(".vd-box");
                    // 没有选择
                    if (_ck_gp_length <= 0 && typeof _vd_gp_req !== "undefined") {

                        //p.removeClass("vd-ok");
                        //p.addClass("vd-error");

                        obj.bl = false;
                        obj.val = [];
                        obj.errorMsg = _ck_gp_msg;
                        //$(p).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(_ck_gp_msg);

                    } else {

                        obj.val = [];

                        $(this).find("[type=checkbox]:checked").each(function () {
                            var _ck_gp_true = this.getAttribute("vd-ck-true") || "";
                            var v = _ck_gp_true || this.value || "";
                            obj.val.push(v);

                        });
                        obj.bl = true;
                        obj.errorMsg = "";
                        //p.removeClass("vd-error");
                        //p.addClass("vd-ok");

                        //$(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok");

                    }
                }

                // 单选组框
                var _rd_gp_attr = $(this).attr("vd-rd-gp");
                var _rd_gp_req = $(this).attr("vd-req"); //  必填项
                var _rd_gp_msg = $(this).attr("vd-req-msg");

                if (typeof _rd_gp_attr !== "undefined") {

                    var _rd_gp_length = $(this).find("[type=radio]:checked").length;
                    p = $(this).parents(".vd-box");
                    // 没有选择
                    if (_rd_gp_length <= 0 && typeof _rd_gp_req !== "undefined") {

                        obj.bl = false;
                        obj.val = "";
                        obj.errorMsg = _rd_gp_msg;

                    } else {

                        obj.val = "";
                        $(this).find("[type=radio]:checked").each(function () {
                            var _ck_gp_true = this.getAttribute("vd-ck-true") || "";
                            var v = _ck_gp_true || this.value || "";
                            obj.val = v;
                        });
                        obj.bl = true;
                        obj.errorMsg = "";

                    }
                }

            });

        };

        this.addVidation = function () {
            var p = this.$p;
            for (var i = 0; i < this.arrs.length; i++) {
                var _obj = this.arrs[i];
                var el = _obj.el; // document.forms[_obj.pName][_obj.elName];
                var $this = this;
                if (window.addEventListener) {
                    $(el).on("input", _obj, function (event) {
                        $this.checkElement(event.data, event.target, true, true);
                        $this.addVdBtnStyle();
                    });
                } else {
                    $(el).on("keyup", _obj, function (event) {
                        $this.checkElement(event.data, event.target, true, true);
                        $this.addVdBtnStyle();
                    });
                }


                var remote = el.getAttribute("vd-remote");
                if (remote === null) {
                    $(el).on("change", _obj, function (event) {
                        $this.checkElement(event.data, event.target, true, true);
                        $this.addVdBtnStyle();
                    });
                }

                var vdBtn = $(".vd-btn", p);
                if (vdBtn.length > 0 && vdBtn[0].hasAttribute("value")) {
                    this.vdbtnText = vdBtn.val();
                } else {
                    this.vdbtnText = vdBtn.text();
                }

            }

        };

        this.checkElement = function (_obj2, el, isRemote, isRadio) {
            var self=this;
            // req
            var _req = el.getAttribute("vd-req");
            var _req_msg = el.getAttribute("vd-req-msg");

            // pattern
            var _pattern = el.getAttribute("vd-pattern");
            var _pattern_msg = el.getAttribute("vd-pattern-msg");

            // remote
            var _remote = el.getAttribute("vd-remote");
            var _remote_msg = el.getAttribute("vd-remote-msg");
            var _remote_length = el.getAttribute("vd-remote-length");

            // compare 
            var _compare = el.getAttribute("vd-compare");
            var _compare_msg = el.getAttribute("vd-compare-msg");
            var _compare_emit = el.getAttribute("vd-compare-emit"); // 触发目标对象

            // 复选框
            var _ck = el.getAttribute("vd-ck");
            var _ck_value = el.getAttribute("value") || ""; // 选中的值
            var _ck_true = el.getAttribute("vd-ck-true"); // 选中的值
            var _ck_false = el.getAttribute("vd-ck-false"); // 没选中的值
            var _ck_msg = el.getAttribute("vd-req-msg");
            var _vd_req = el.getAttribute("vd-req"); //  必填项

            // 复选组框
            var _ck_parent = $(el).closest(".vd-item");
            var _ck_gp_attr = _ck_parent.attr("vd-ck-gp");

            // 单选组框
            var _rd_parent = $(el).closest(".vd-item");
            var _rd_gp_attr = _rd_parent.attr("vd-rd-gp");

            // 当前的值
            var v = $.trim(el.value);
            var p = $(el).parents(".vd-box");

            // 非空验证
            if (_req !== null) {
                if (!(typeof _ck_gp_attr !== "undefined" || typeof _rd_gp_attr !== "undefined")) {

                    if (v === "") {
                        _obj2.bl = false;
                        _obj2.val = v;
                        _obj2.errorMsg = _req_msg;
                        p = $(el).parents(".vd-box");
                        $(p).removeClass("vd-pattern vd-remote vd-compare").addClass("vd-error  ");

                        $(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");
                        $(p).find(".vd-req").addClass("vd-error").text(_req_msg);
                        $(el).addClass("vd-error");
                        $(p).removeClass("vd-ok ");

                        $(".vd-dep-btn", p).addClass("vd-error").removeClass("vd-ok"); //依赖按钮

                        return;
                    } else {
                        p = $(el).parents(".vd-box");
                        $(p).removeClass("vd-error ");

                        $(p).find(".vd-req").removeClass("vd-error").text("");
                        $(el).removeClass("vd-error");
                        $(p).addClass("vd-ok");
                        $(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮

                        if (isRemote && (!_remote)) { //远程不去比较
                            _obj2.errorMsg = "";
                            _obj2.val = v;
                            _obj2.bl = true;
                        }

                    }

                }

            }

            // 触发比较对象
            if (_compare_emit !== null) {
                this.compareEmit(_obj2.pName, _compare_emit, v);
            }

            // 正则验证
            if (_pattern !== null && v !== "") {

                var reg = new RegExp(_pattern, "i");
                if (!reg.test(v)) {
                    _obj2.errorMsg = _pattern_msg;
                    _obj2.bl = false;
                    _obj2.val = v;
                    p = $(el).parents(".vd-box");
                    $(p).addClass("vd-error");

                    $(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");

                    $(p).find(".vd-pattern").addClass("vd-error").text(_pattern_msg);
                    $(el).addClass("vd-error");
                    $(p).removeClass("vd-ok");
                    $(".vd-dep-btn", p).addClass("vd-error").removeClass("vd-ok"); //依赖按钮

                    return;
                } else {
                    _obj2.errorMsg = "";
                    _obj2.val = v;
                    _obj2.bl = true;
                    p = $(el).parents(".vd-box");
                    $(p).removeClass("vd-error ");

                    $(p).find(".vd-pattern").removeClass("vd-error").text("");
                    $(el).removeClass("vd-error");
                    $(p).addClass("vd-ok");
                    $(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮

                }

            } else {

                if (!_remote) { //远程不去比较

                    _obj2.errorMsg = "";
                    _obj2.val = v;
                    _obj2.bl = true;
                    p = $(el).parents(".vd-box");
                    $(p).removeClass("vd-error ");

                    $(p).find(".vd-pattern").removeClass("vd-error").text("");
                    $(el).removeClass("vd-error");
                    $(p).addClass("vd-ok");
                    $(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮
                }
            }

            // 比较验证
            if (_compare !== null) {

                var _compare_obj = $("" + _obj2.pName + "  [name=" + _compare + "]",this.$p);

                //var _compare_obj = document.forms[_obj2.pName][_compare];
                if (v !== $(_compare_obj).val()) {
                    _obj2.bl = false;
                    _obj2.val = v;
                    _obj2.errorMsg = _compare_msg;
                    p = $(el).parents(".vd-box");
                    $(p).addClass("vd-error");

                    $(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");
                    $(p).find(".vd-compare").addClass("vd-error").text(_compare_msg);
                    $(p).removeClass("vd-ok");
                    $(el).addClass("vd-error");
                    $(".vd-dep-btn", p).addClass("vd-error").removeClass("vd-ok");; //依赖按钮

                    return;
                } else {

                    _obj2.errorMsg = "";
                    _obj2.val = v;
                    _obj2.bl = true;
                    p = $(el).parents(".vd-box");
                    $(p).removeClass("vd-error vd-compare ");

                    $(p).find(".vd-compare").removeClass("vd-error").text("");
                    $(el).removeClass("vd-error");
                    $(p).addClass("vd-ok");
                    $(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮

                }

            }

            if (_remote !== null) {

                var _index = _remote_length !== null ? _remote_length : 0;
                if (v.length < _index) {
                    _obj2.errorMsg = _remote_msg;
                    _obj2.bl = false;
                    _obj2.val = v;
                    _obj2.remote_bl = _obj2.bl;

                    p = $(el).parents(".vd-box");
                    $(p).addClass("vd-error ");

                    $(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");
                    $(p).find(".vd-remote").addClass("vd-error").text(_remote_msg);
                    $(el).addClass("vd-error");
                    $(p).removeClass("vd-ok");
                    $(".vd-dep-btn", p).removeClass("vd-ok").addClass("vd-error"); //依赖按钮

                    return;
                }

                var $remote = this;
               
                if (isRemote) {
                    $(el).trigger("onremotebefore", [el]);
                    var remoteObjectString=$(el).attr("vd-remote-obj");
                    var remoteMethod=($(el).attr("vd-remote-method")||"get").toLowerCase();
                    var remoteName=($(el).attr("vd-remote-name")||"").toLowerCase();
                    var remoteRes=($(el).attr("vd-remote-res")||"true");  // 为真或假结果判断 默认为真
                     
                    var props={};
                    props[el.name]=v;
                    $.extend(props, self.getObjectByString(remoteName));
                    if( $.ajaxSetup().contentType==="application/json" && remoteMethod!=="get"){
                        props=JSON.stringify(props);
                    }
               //  console.log(   self.getObj("name"))
                    $.ajax({
                        url: self.baseRemoteUrl+_remote + "?rand=" + Math.random(),
                        type: remoteMethod,
                        data:props,
                        timeout: 10000,
                        success: function (data) {
                            // 获取校验指定的属性
                           if(remoteObjectString){
                              data= self.getObjectPropByString(data,remoteObjectString);
                            }

                            data = Number(data);
                            data = !!data;
                            //console.log(data)
                            $(el).trigger("onremoteafter", [el,data]);

                            // 真
                            if(remoteRes==="true"){
                                if (!data) {
                                    $remote.remoteFunError(_obj2, el, _remote_msg);
                                    $remote.addVdBtnStyle(el);
                                    return;
                                } else {
                                    $remote.remoteFunOk(_obj2, el);
                                    $remote.addVdBtnStyle(el);

                                }
                             }

                              // 假
                            if(remoteRes==="false"){
                                if (data) {
                                    $remote.remoteFunError(_obj2, el, _remote_msg);
                                    $remote.addVdBtnStyle(el);
                                    return;
                                } else {
                                    $remote.remoteFunOk(_obj2, el);
                                    $remote.addVdBtnStyle(el);

                                }
                             }



                        },
                        error: function (data) {
                            $remote.remoteFunError(_obj2, el, _remote_msg);
                            return;
                        }

                    });

                } else {
                    _obj2.bl = _obj2.remoteVal || false;
                    if (_obj2.bl) {
                        $remote.remoteFunOk(_obj2, el);
                        $remote.addVdBtnStyle(el);
                    } else {
                        $remote.remoteFunError(_obj2, el, _remote_msg);
                        $remote.addVdBtnStyle(el);
                    }
                }

            }

            // 复选框
            if (_ck !== null) {

                if (el.checked) {
                    _obj2.errorMsg = "";
                    _obj2.val = _ck_true !== null ? _ck_true : _ck_value;
                    p = $(el).parents(".vd-box");
                    $(p).removeClass("vd-error  ");
                    $(el).removeClass("vd-error");
                    $(p).addClass("vd-ok");
                    $(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok").text("");
                    //$(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮
                    _obj2.bl = true;

                } else {

                    _obj2.val = _ck_false !== null ? _ck_false : 0;
                    _obj2.errorMsg = _ck_msg;
                    if (_vd_req !== null) {
                        p = $(el).parents(".vd-box");
                        $(p).addClass("vd-error vd-ck ");
                        $(p).removeClass("vd-ok");
                        $(el).addClass("vd-error");

                        _obj2.bl = false;
                        $(p).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(_ck_msg);
                        //	$(".vd-dep-btn", p).addClass("vd-error").removeClass("vd-ok"); //依赖按钮	

                    } else {
                        _obj2.bl = true;
                        $(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok").text("");
                        //$(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮

                    }

                    return;

                }

            }

            // 复选组框
            if (typeof _ck_gp_attr !== "undefined") {

                var _ck_gp = _ck_parent.attr("vd-ck-gp");
                var _ck_gp_msg = _ck_parent.attr("vd-req-msg");
                var _vd_gp_req = _ck_parent.attr("vd-req"); //  必填项

                if (typeof _ck_gp !== "undefined") {

                    var _ck_gp_length = _ck_parent.find("[type=checkbox]:checked").length;

                    p = _ck_parent.parents(".vd-box");
                    // 没有选择
                    if (_ck_gp_length <= 0 && typeof _vd_gp_req !== "undefined") {

                        p.removeClass("vd-ok");
                        p.addClass("vd-error");

                        _obj2.bl = false;
                        _obj2.val = [];
                        v = "";
                        _obj2.errorMsg = _ck_gp_msg;

                        $(p).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(_ck_gp_msg);

                    } else {

                        _obj2.val = [];
                        v = [];
                        _ck_parent.find("[type=checkbox]:checked").each(function () {
                            var _ck_gp_true = this.getAttribute("vd-ck-true") || "";
                            var v = _ck_gp_true || this.value || "";
                            _obj2.val.push(v);

                        });
                        _obj2.bl = true;
                        _obj2.errorMsg = "";
                        p.removeClass("vd-error");
                        p.addClass("vd-ok");

                        $(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok");

                    }

                }

            }

            // 单选组框
            var _rd_gp = _rd_parent.attr("vd-rd-gp");
            // var _rd_gp_true = _rd_parent.attr("vd-ck-true");
            var _rd_gp_req = _rd_parent.attr("vd-req");
            var _rd_gp_msg = _rd_parent.attr("vd-req-msg");
            if (typeof _rd_gp !== "undefined") {

                var _rd_name = _rd_parent.attr("name");
                var _rd_gp_length = _rd_parent.find("[type=radio]:checked").length;
                p = $(el).parents(".vd-box");

                // 没有选择
                if (_rd_gp_length <= 0 && _rd_gp_req !== null) {

                    p.removeClass("vd-ok");
                    p.addClass("vd-error");

                    _obj2.bl = false;
                    _obj2.val = "";

                    _obj2.errorMsg = _rd_gp_msg;

                    $(p).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(_rd_gp_msg);

                } else {

                    _obj2.val = "";
                    _rd_parent.find("[type=radio]:checked").each(function () {
                        var _ck_gp_true = this.getAttribute("vd-ck-true") || "";
                        var v = _ck_gp_true || this.value || "";
                        _obj2.val = v;

                    });
                    _obj2.bl = true;
                    _obj2.errorMsg = "";
                    p.removeClass("vd-error");
                    p.addClass("vd-ok");

                    $(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok");

                }

            }

        };

        this.isSubmit = true;

        this.isSuccess = function (successFun, errorFun) {

            // 添加错误样式
            this.addErrorStyle(false, false);

            // 是否全部验证成功
            var baseBl = true;
            // var arr_rd = {};
            for (var i = 0; i < this.arrs.length; i++) {
                var _obj = this.arrs[i];

                if (_obj.bl === false) {

                    if (typeof errorFun === "function") {
                        this.isSubmit = true;
                        errorFun(_obj);
                    }
                    return baseBl = false;
                }

            }
            // var isFirst = true;
            if (baseBl) {
                var newObj = this.getNewObjs();
                if (typeof successFun === "function") {
                    if (this.isSubmit) {
                        this.isSubmit = false;
                        var vdBtn = $(".vd-btn",this.$p);
                        if (vdBtn.length > 0 && vdBtn[0].hasAttribute("value")) {
                            vdBtn.val(this.submitText);
                        } else {
                            vdBtn.text(this.submitText);
                        }
                        successFun(newObj);
                    }

                }

            }

            return true;
        };

        this.getNewObjs = function () {

            // 是否全部验证成功
            var newObj = {};
            for (var i = 0; i < this.arrs.length; i++) {
                var obj = this.arrs[i];
                if (obj.bl) {
                    newObj[obj.elName] = obj.val;
                }

            }

            return newObj;

        };

        this.getObj = function (name) {

            // 是否全部验证成功
            var obj = {};
            for (var i = 0; i < this.arrs.length; i++) {

                if ($.trim(name) === $.trim(this.arrs[i].elName)) {

                    obj = this.arrs[i];
                    break;
                }

            }

            return obj;

        };

        this.addErrorStyle = function (isRemote, isRadio) {

            for (var i = 0; i < this.arrs.length; i++) {
                var obj = this.arrs[i] || {};
                var el = obj.el;
                this.checkElement(obj, el, isRemote, isRadio); // false 不去remote验证    isRadio不做比
                this.addVdBtnStyle(); // 添加vd-btn提交按钮样式
            }
        };

        this.remoteFunOk = function (_obj2, el) {
            _obj2.errorMsg = "";
            _obj2.bl = true;
            _obj2.val = $(el).val();
            _obj2.remote_bl = _obj2.bl;
            _obj2.remoteVal = true;

            var p = $(el).parents(".vd-box");
            $(p).removeClass("vd-error ");

            $(p).find(".vd-remote").removeClass("vd-error").text("");
            $(el).removeClass("vd-error");
            $(p).addClass("vd-ok");
            $(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮

        };

        this.remoteFunError = function (_obj2, el, _remote_msg) {
            _obj2.errorMsg = _remote_msg;
            _obj2.bl = false;
            _obj2.val = $(el).val();
            _obj2.remote_bl = _obj2.bl;
            _obj2.remoteVal = false;

            var p = $(el).parents(".vd-box");
            $(p).addClass("vd-error ");

            $(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");
            $(p).find(".vd-remote").addClass("vd-error").text(_remote_msg);
            $(el).addClass("vd-error");
            $(p).removeClass("vd-ok");
            $(".vd-dep-btn", p).removeClass("vd-ok").addClass("vd-error"); //依赖按钮

        };

        this.vdIsOk = function () {

            // 是否全部验证成功
            var baseBl = true;
            for (var i = 0; i < this.arrs.length; i++) {
                var _obj = this.arrs[i];

                if (_obj.bl === false) {
                    return baseBl = false;
                }

            }

            return baseBl;
        };

        this.addVdBtnStyle = function () {

            // 提交按钮
            var $vd_btn = $(".vd-btn", this.$p);

            if (this.vdIsOk()) {
                this.$p.removeClass("vd-error").addClass("vd-ok");
                $vd_btn.removeClass("vd-error").addClass("vd-ok");

            } else {
                this.$p.removeClass("vd-ok").addClass("vd-error");
                $vd_btn.removeClass("vd-ok").addClass("vd-error");

            }


        };

        this.check = function (v) {
            if (!v) { return; }
            var p = $(v).closest(".vd-box");
            if (arguments.length >= 1) {
                 var el = arguments[0] || "";

                var crt_el = p.find(".vd-item");
                var name = crt_el.attr("name") || "";

                for (var i = 0; i < this.arrs.length; i++) {
                    var obj = this.arrs[i];
                    if (obj.elName === name) {
                        el = obj.el;
                        this.checkElement(obj, el, false, false); // false 不去remote验证    isRadio不做比
                        break;
                    }

                }

                var valObj = this.getObj(name);
                if (valObj && valObj.bl) {
                    p.removeClass("vd-error").addClass("vd-ok");
                    $(".vd-req", p).removeClass("vd-error");
                    $(".vd-pattern", p).removeClass("vd-error");
                    $(".vd-remote", p).removeClass("vd-error");
                    $(".vd-compare", p).removeClass("vd-error");
                    $(".vd-dep-btn ", p).removeClass("vd-error");
                }
                //else {
                //    p.addClass("vd-ok");

                //}

                if (this.vdIsOk()) {
                   this.$p.find(".vd-btn").removeClass("vd-error");
                } 
                return;
            }

        };

        this.validate = function () {
            this.isSuccess();
        };

        this.reset = function () {

            this.isSubmit = true;
            var p = this.$p;
            $(".vd-item", p).each(function (item) {

                $(this).val("");

                if ($(this)[0].hasAttribute("vd-ck")) {
                    $(this).val(0);
                }
            });



            $("[type=checkbox]", p).each(function () {
                $(this)[0].checked = false;

            });
            $("[type=radio]", p).each(function () {
                $(this)[0].checked = false;

            });

            this.check();
            this._valStyle(p);
            var vdBtn = $(".vd-btn",p);
            if (vdBtn.length > 0 && vdBtn[0].hasAttribute("value")) {
                vdBtn.val(this.vdbtnText);
            } else {
                vdBtn.text(this.vdbtnText);
            }
        };

        this.disabledItem=function(){
            this.disabled(this.$p.find("input")); //禁用
            this.disabled(this.$p.find("select")); //禁用
            this.disabled(this.$p.find("textarea")); //禁用
        };

        this._valStyle = function (p) {

            $(".vd-box", p).removeClass("vd-error ");
            $(".vd-btn", p).removeClass("vd-error ");
            $(".vd-box", p).removeClass("vd-ok");
            $(".vd-btn", p).removeClass("vd-ok");

            //error
            $(".vd-req", p).removeClass("vd-error");
            $(".vd-pattern", p).removeClass("vd-error");
            $(".vd-remote", p).removeClass("vd-error");
            $(".vd-compare", p).removeClass("vd-error");
            $(".vd-dep-btn ", p).removeClass("vd-error");
            this.enabled(this.$p.find("input")); //激活
            this.enabled(this.$p.find("select")); //激活
            this.enabled(this.$p.find("textarea")); //激活
        };

        this.getObjectPropByString=function(obj,str){
            str=str||"";
           var arrs= str.split(".");
           var tempObj=null,propName="";

           for(var i=0,len=arrs.length;i<len;i++){
                propName=arrs[i];
                if(typeof obj[propName]==="undefined"){ break;}
                tempObj=obj[propName];
           }

           return tempObj;

        }; // 根据对字符串获取对象的属性值

        this.getObjectByString=function(str){
            str=str||"";
            var arrs= str.split(",");
            var o={},propName="";

           for(var i=0,len=arrs.length;i<len;i++){
                var names= arrs[i].split("=")||[];
                var objName=names.length>=2?names[1]:names[0];
                propName=names[0];
                 var _obj=this.getObj(propName);
                if(_obj){
                    o[objName]=_obj.val;
                }
              
           }

           return o;

        }; // 根据对字符串转换成对象


    };

    m.vd = {
        create: function (formName,content) {

            return new Validate(formName, content);
        }
    };

})();