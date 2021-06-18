/*
 hqs Router
 */

+ function () {

    /*����Router����*/
    var Router = function (selector, content) {

        if (typeof selector === "function") {
            if (window.addEventListener) {
                window.addEventListener("load", selector);
            } else {
                window.attachEvent("load", selector);
            }

        }
    };
 
    Router.extend = function (obj) {
        if (typeof obj === "object") {
            for (var i in obj) {
                this[i] = obj[i];
            }
        }
        return this;
    };

    // base url;
    Router.transitionTime = 250;
    Router.fineObjs = {};
    Router.baseUrl = "";
    Router.urls = [];           // js ���ؼ���
    Router.htmlUrls = [];       // html �ļ��� css js ����
    Router.caches = [];
    Router.ids = [];
    Router.tapTime = new Date().getTime(); // ��������ʱ��
    Router.ckUrl = function (url) {

        for (var i = 0; i < Router.urls.length; i++) {
            var _url = Router.urls[i];
            if (url === _url) {
                return false;
            }
        }

        return true;

    };

    Router.ckHtmlUrl = function (url) {

        for (var i = 0; i < Router.htmlUrls.length; i++) {
            var _url = Router.htmlUrls[i];
            if (url === _url) {
                return true;
            }
        }

        return false;

    };
    
    Router.emitOnly = true;
    Router.isOneMove = true;

    // ����ִ�к���
    window.define = Router.define = function () {

        var arg1;

        // ����ĺ���
        var name = "include_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000);
        if (arguments.length === 1 && typeof arguments[0] === "function") {

            arg1 = arguments[0];
        }

        // ����jquery
        if (arguments.length === 3 && typeof arguments[0] === "string" && arguments[1] instanceof Array && typeof arguments[
            2] === "function") {

            arg1 = arguments[2];
        }

        if (arguments.length >= 1) {
            var src = _getCurrentScript();
            Router.fineObjs[name] = {
                fn: arg1,
                isOnlyRun: true,
                url: src
            };
        }
        return this;
    };

    // amd module extend
    window.define.extend = function (obj) {

        if (typeof obj === "object") {
            for (var i in obj) {
                this[i] = obj[i];
            }
        }

        return this;
    };

    // �첽���м���js  ȫ�����������ִ�к���
    Router.req = function (obj, urls, fn) {
      
        obj = obj instanceof Object ? obj : {};
        if (typeof urls === "function") {
            fn = urls;
            urls = [];
        } else {
            urls = urls instanceof Array ? urls : [];
        }
            
        var $el = Router.getActiveEl(); //m( "#m-router-" + Router.getId());
        _setRouterObj($el, obj);
       // console.log(obj);
                   
         // ������
        var activeUrls = _activeUrls(urls);
            var itr = Router.iterator(activeUrls);
           
            for (var i = 0; i < activeUrls.length; i++) {
                if (Router.ckUrl(activeUrls[i])) {

                    _addAllIterator(itr, fn, activeUrls[i], urls);
                }
            }

        if (activeUrls.length === 0) {
            var parameter = _getUrlParameter($el);
            fn.call($el, $el, parameter);
          
            // ����ҳ����ʾ �������¼�
            $el.emit("m-router-show", [$el, Router.getId()]);  
        }

        return this;
    };

    // ͬ������js  ��˳����������ִ�к���
    Router.reqSync = function (obj, urls, fn) {
     
            obj = obj instanceof Object ? obj : {};
            if (typeof urls === "function") {
                fn = urls;
                urls = [];
            } else {
                urls = urls instanceof Array ? urls : [];
            }

        var $el = Router.getActiveEl(); //m("#m-router-" + Router.getId());
        _setRouterObj(el, obj);
           
            // ������
        var activeUrls = _activeUrls(urls);
            var itr = Router.iteratorSync(activeUrls);
            var itr2 = itr.next();
            if (!itr2.done) {
                _addAllIteratorSync(itr, fn, itr2.value, urls);
            }

        if (activeUrls.length === 0) {
            var parameter = _getUrlParameter($el);
            fn.apply($el, $el, parameter);
                // ����ҳ����ʾ �������¼�
                $el.emit("m-router-show", [$el, Router.getId()]); 
            }
        

        return this;
    };

    // run Router.define and  caches
    Router.runIncludeAndCache = function () {
        // console.log("fineObjs", Router.fineObjs);
        for (var name in Router.fineObjs) {
            var o = Router.fineObjs[name];
            if (typeof o === "object") {
                if (typeof o.fn === "function" && o.isOnlyRun === true) {

                    var res = o.fn();
                    o.isOnlyRun = false;
                    Router.caches.push({
                        v: res,
                        url: o.url
                    });
                }
            }
        }

    };

    // run Router.define
    Router.runInclude = function () {

        for (var name in Router.fineObjs) {
            var o = Router.fineObjs[name];

            if (typeof o === "object") {
                if (typeof o.fn === "function" && o.isOnlyRun === true) {
                    o.fn();
                    o.isOnlyRun = false;
                }
            }
        }
    };

    // ���������ɺ���
    Router.iterator = function (array) {
        var nextIndex = 0;
        return {
            next: function () {
                var _index = array.length - 1;
                var _nextIndex = nextIndex;
                return nextIndex < array.length ? {
                    value: array[nextIndex++],
                    done: _nextIndex >= _index ? true : false
                } : {
                        value: undefined,
                        done: true
                    };
            }
        };
    };

    // ���������ɺ���
    Router.iteratorSync = function (array) {
        var nextIndex = 0;
        return {
            next: function () {

                return nextIndex < array.length ? {
                    value: array[nextIndex++],
                    done: false
                } : {
                        value: undefined,
                        done: true
                    };
            }
        };
    };

    function _addAllIterator(itr, fn2, url, arrs) {

        var doc = document.body || document.getElementsByTagName('body')[0];
        var _url = Router.baseUrl + url;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = _url;
        script.setAttribute("data-src", _url);

        // js�������ִ�з��� ie9+
        if (window.addEventListener) {
            script.onload = function () {
                Router.urls.push(url);
                var itrObj = itr.next();
                if (itrObj.done) {
                    Router.runIncludeAndCache();
                    var $el = m("#m-router-" + Router.getId());
                    var parameter = _getUrlParameter($el);
                    fn2.apply($el, $el, parameter);

                    // ����ҳ����ʾ �������¼�
                    $el.emit("m-router-show", [$el, Router.getId()]);  
                }
            };
            doc.appendChild(script);
        }
    }

    function _addAllIteratorSync(itr, fn2, url, arrs) {

        var doc = document.body || document.getElementsByTagName('body')[0];
        var _url = Router.baseUrl + url;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = _url;
        script.setAttribute("data-src", _url);

        //js�������ִ�з��� ie9+
        if (window.addEventListener) {
            var $el = m("#m-router-" + Router.getId());
            script.onload = function () {
                Router.urls.push(url);
                var itrObj = itr.next();
                if (itrObj.done) {
                    Router.runIncludeAndCache();
                    var parameter = _getUrlParameter($el);
                    fn2.apply($el, $el, parameter);

                    // ����ҳ����ʾ �������¼�
                    $el.emit("m-router-show", [$el, Router.getId()]);  

                } else {
                    _addAllIteratorSync(itr, fn2, itrObj.value, arrs);
                }
            };
            doc.appendChild(script);

        }

    }

    // ����activeUrls
    function _activeUrls(list) {
        var arrs = [];
        for (var i = 0; i < list.length; i++) {
            var _url = list[i];

            var bl = true;
            for (var y = 0; y < Router.urls.length; y++) {
                var _url2 = Router.urls[y];
                if (_url === _url2) {
                    bl = false;
                }
            }

            if (bl) {
                arrs.push(_url);
            }
        }

        return arrs;
    }

    // getCurrentScript
    function _getCurrentScript() {

        if (document.currentScript) {

            return document.currentScript.getAttribute("data-src") || "";
        } else {
            var stack, e, nodes = document.getElementsByTagName("script");
            for (var i = 0, node; i < nodes.length; i++) {
                node = nodes[i];

                if (node.readyState === "interactive") {
                    // ie8 ,ie9 ie10
                    return node.getAttribute("data-src") || "";

                } else if (!node.readyState) {

                    // ie11
                    try {
                        throw Error("ǿ�Ʊ���,�Ա㲶��e.stack,��ȡJS·������");

                    } catch (e) {
                        stack = e.stack;

                        if (e.sourceURL) {
                            //safari
                            saf = e.sourceURL;
                        }
                    }
                    if (stack) {

                        e = stack.indexOf(' at ') !== -1 ? ' at ' : '@';
                        while (stack.indexOf(e) !== -1) {
                            stack = stack.substring(stack.indexOf(e) + e.length);
                        }

                        var mchs = stack.match(/(http|https):\/\/.*\.js/)[0];
                        mchs = mchs.split("/");
                        mchs = mchs[mchs.length - 1];
                        var mch = mchs.match(/.*\.js$/)[0];
                        var srp = _getScriptByFileName(mch);
                        var src = srp.getAttribute("data-src");
                        return src;
                    }


                }
            }
        }
    }

    // getScriptByFileName
    function _getScriptByFileName(fileName) {
        var srps = document.getElementsByTagName("script");
        var list = [];
        for (var i = 0; i < srps.length; i++) {
            var o = srps[i];
            var reg = new RegExp(fileName, "img");
            var src = o.getAttribute("src");
            if (reg.test(src)) {
                list.push(o);

            }
        }

        return list.length > 0 ? list[list.length - 1] : {};
    }

    function _compilerHtml(obj, src, prop, isReplace, fn,id) {
        prop = prop || {};
        Router.get(src, prop, function (data) {

            m(obj).find("._loading-dh").hide();
            var newElement = Router.htmlStringToDOM(data);

            /*----------------------��� style ��ǩ ���� ie9+--------------------------------*/
            var els_style = newElement.childNodes;
            var doc_style = document.createDocumentFragment();
            var _index_style = 0;
            for (var i0 = els_style.length - 1; i0 >= 0; i0--) {
                _index_style++;
                var el = els_style[i0];
                if (el.nodeType === 1 && el.nodeName === "STYLE") {
                    el.setAttribute("data-Router-id", id);
                    if (window.addEventListener) {
                        doc_style.insertBefore(el, doc_style.childNodes[0]);
                    } else {
                        doc_style.insertBefore(el, doc_style.firstChild);
                    }

                }
            }
            document.getElementsByTagName("head")[0].appendChild(doc_style);

            /* ----------------------��� link ��ǩ ���� ie9 + --------------------------------*/
            var els_link = newElement.childNodes;
            var doc_link = document.createDocumentFragment();

            for (var i1 = els_link.length - 1; i1 >= 0; i1--) {
                var el1 = els_link[i1];

                if (el1.nodeType === 1 && el1.tagName === "LINK") {
                    _index_link++;
                    // Router.htmlUrls ���ϼ��
                    var include_HtmlUrl1 = el1.getAttribute("href");
                    if (Router.ckHtmlUrl(include_HtmlUrl1)) {

                        // ɾ���ڵ�
                        if (el1.parentNode) {
                            var _link_p = el1.parentNode;
                            _link_p.removeChild(el1);
                        }
                        continue;
                    }
                    Router.htmlUrls.push(include_HtmlUrl1);

                    if (window.addEventListener) {
                        doc_link.insertBefore(el1, doc_link.childNodes[0]);
                    } else {
                        doc_link.insertBefore(el1, doc_link.firstChild);
                    }
                }
            }
            document.getElementsByTagName("head")[0].appendChild(doc_link);


            /*----------------------��� script ��ǩ ���� ie8+--------------------------------*/
            var els_scriprt = newElement.childNodes;
            var doc_script = document.createDocumentFragment();

            // ��� �½� script
            var _index_script = 0;
            var docDfgTypeInSrc = document.createDocumentFragment();
            var docDfgTypeInSrcIe8 = [];

            for (var i2 = 0; i2 < els_scriprt.length; i2++) {
                var el2 = els_scriprt[i2];

                if (el2.nodeType === 1 && el2.tagName === "SCRIPT") {

                    _index_script++;
                    var script = document.createElement("script");
                    script.type = "text/javascript";

                    // �� src����ֵ ����
                    if (el2.src) {

                        script.src = el2.getAttribute("src") || "";

                        // Router.htmlUrls ���ϼ��
                        var include_HtmlUrl2 = script.src;
                        if (Router.ckHtmlUrl(include_HtmlUrl2)) {
                            continue;
                        }
                        Router.htmlUrls.push(include_HtmlUrl2);

                        if (window.addEventListener) {
                            docDfgTypeInSrc.insertBefore(script, doc_script.childNodes[0]);
                        } else {
                            // doc.appendChild(script);
                            docDfgTypeInSrc.insertBefore(script, doc_script.firstChild);
                        }

                        // js�������ִ�з��� ie9+
                        if (window.addEventListener) {
                            script.onload = function () {
                                // ִ��define ����ĺ���
                                Router.runInclude();
                            };
                        }

                    } else {

                        // û��src����ֵ Ӧ��script Ϊ������
                        var jscontent = el2.innerHTML || "";
                        script.setAttribute("data-Router-id", id);
                        if (jscontent) {

                            // ie9+
                            if (window.addEventListener) {

                                docDfgTypeInSrc.insertBefore(script, doc_script.childNodes[0]);
                                script.innerHTML = jscontent;
                            } else {
                                // ie8
                                docDfgTypeInSrc.insertBefore(script, doc_script.firstChild);
                                script.jscode = jscontent;
                                docDfgTypeInSrcIe8.push(jscontent);

                            }

                        }
                    }
                }
            }

            // ɾ��ԭ�� script
            for (var i3 = els_scriprt.length - 1; i3 >= 0; i3--) {
                var el3 = els_scriprt[i3];
                if (el3.nodeType === 1 && el3.tagName === "SCRIPT") {

                    // ɾ���ڵ�
                    if (el3.parentNode) {
                        var els = el3.parentNode;
                        els.removeChild(el3);
                    }

                }
            }

            // <inlude>��ǩ ��ӵ�document
            if (isReplace) {

                var parent = obj.parentNode;
                if (window.addEventListener) {
                    parent.replaceChild(newElement, obj);

                } else {

                    // supper ie8
                    if ($) {
                        $(newElement).replaceAll($(obj));
                    }

                }

            } else {
                //  require ��ӵ�document
                obj.appendChild(newElement);

                // callback function
                if (typeof fn === "function") {
                    fn();
                }
            }

            // û��src����ֵ ����scriptԪ�ؼ��غ���� ����ӵ�ҳ��
            // ie9+
            if (window.addEventListener) {

                document.getElementsByTagName("body")[0].appendChild(docDfgTypeInSrc);

            }

        }, function () {
            // ����ʧ��
             var $p= m("#m-router-" + Router.getId());
                m(".m-hd-top-ttl", $p).html(`<div class="_fail"> ~<span class="icon icon-nanguo"></span>~</div>`);
                //m-router-cnt
                $p.find("._loading-dh").hide();
                $p.append(`<div class="_loading-fail">~���ݼ���ʧ����~</div>`);

        });
    }

    // router  move 
    function _moveEl(el,isOneMove) {

        m(el).touch(

            function (event, obj) {

                obj.$moveElment = m(this);
                obj.moveElmentX = obj.$moveElment.translateX();
                obj.$prevEl = Router.getPrevEl();
                var _id = Router.getId();
                obj.maskEl = m("[data-router-id=m-router-" + _id + "]");
            
                if (obj.x < (obj.$moveElment.width() * 0.95) ) {
                   
                    obj.isMove = true;
                }
               // obj.window_w = m(window).width();
                self.obj = obj;

            },

            function (event, obj) {
                if (obj.isX) {
                    if ( obj.oneTouch === 1) { return; }
                    if ((!obj.xlt) && (obj.x < 0) && (obj.oneTouch === undefined)) { obj.xlt = true; obj.oneTouch = 1; } else { obj.xlt = false; obj.oneTouch = 2; }
                   
                    if (obj.xlt && obj.oneTouch === 1) { return; }
                 
                    var id = parseInt(obj.$moveElment.attr("data-router-id") || -1);
                    var _id = Router.getId();
                    if (obj.isX && obj.isMove && id === _id) {
                        obj.$prevEl = Router.getPrevEl();

                        event.preventDefault();
                        obj.$moveElment.transition("none");
                        var translateX = obj.moveElmentX + obj.x;
                        obj.$moveElment.removeClass("in");
                        translateX = translateX <= 0 ? 0 : translateX;
                        if (translateX > 0) {
                            obj.$moveElment.addClass("m-router-box-move");
                        }

                        // �ƶ���ǰ��·��ҳ
                        obj.$moveElment.translateX(translateX).translateZ(0);

                        // ��һ��Ԫ�ص��ƶ�
                        Router.isOneMove = false;
                        obj.$prevEl.transition("none");
                        var rt = translateX / obj.$moveElment.width();
                        var prevWidth = -obj.$prevEl.width() / 2;
                        var movePrevWidth = prevWidth - prevWidth * rt;

                        if (movePrevWidth > 0) {
                            movePrevWidth = 0;
                        }

                        obj.$prevEl.removeClass("in").translateX(movePrevWidth).translateZ(0);

                        // �ƶ�maskҳ ͸����             
                        //obj.maskEl.css("opacity", (0.1 - translateX / (obj.window_w*10)));
                    }
                }
            },

            function (event, obj) {

                if (obj.isX) {
              
                    var t = 0.5;
                    var transition = "transform  " + Router.transitionTime * t + "ms ease";
                    if (obj.$moveElment.translateX() < obj.$moveElment.width() / 2) {
                        
                        obj.$moveElment.transition(transition);
                        if (!Router.isOneMove) { obj.$moveElment.translateX(0).translateZ(0); }
                        obj.$prevEl.transition(transition);
                        obj.$prevEl.translateX(-obj.$prevEl.width() / 2).translateZ(0);

                    } else {
                     
                       
                        Router.back(t); 
                       
                    }

                    obj.isMove = false;
                   

                }

                obj.xlt = null;
                obj.oneTouch = undefined;
                obj.$moveElment.removeClass("m-router-box-move");
            });
    }

    function _setRouterObj(el, obj) {
        
        m(".m-hd-top-ttl", el).html(obj.routerTilte || "");
        if (obj.routerTilteColor) { m(".m-hd-top-ttl", el).css("color", obj.routerTilteColor); }
        if (obj.routerClass) { m(el).addClass(obj.routerClass); }
        
    }

    function _setUrlParameter(url) {

        var obj = {};
        url = typeof url === "string" ? url : "";
        var urls = url.split("?");
        if (urls.length === 2) {
            var urlList = urls[1];

            var reg = /&+/img;
            var parameters = urlList.split(reg)||[];
            parameters.forEach(function (item) {
                var values= item.split("=");
                obj[values[0]] =  decodeURIComponent(values[1]);
               
            });
            
        }

        return obj;

    }

    function _getUrlParameter(el) {
      return  m(el).data("parameter");

    }

    // ҳ��������onload
    function _load(obj, urls, onload, isAmd) {

        isAmd = typeof isAmd === "boolean" ? isAmd : false;
        if (isAmd) {
            Router.req(obj, urls, onload);
        } else {
            Router.reqSync(obj, urls, onload);
        }

        // ִ��ҳ��ĺ���
        Router.runBindFn();

    }

    // bind ����
    Router.bindObj = {};
    Router.bindFn = function (fn) {

        if (typeof fn === "function") { Array.prototype.push.call(Router.bindObj, fn); };
       
    };

     // ִ�� ����
    Router.runBindFn = function (fn) {

        for (var pros in Router.bindObj) {

            if (typeof Router.bindObj[pros] === "function") { Router.bindObj[pros]();};
        }

    };

    Router.ajax = m.ajax;

    // get
    Router.get = m.get;

     // html�ַ���תdom����
    Router.htmlStringToDOM = function (txt) {

        var df2 = document.createDocumentFragment();
        var df = document.createElement("div");
        var div = document.createElement("div");
        div.innerHTML = txt;
        df.appendChild(div);
        var _nodes = df.getElementsByTagName("div")[0].childNodes;
        for (var i = _nodes.length; i > 0; i--) {
            if (window.addEventListener) {
                df2.insertBefore(_nodes[i - 1], df2.childNodes[0]);
            } else {
                df2.insertBefore(_nodes[i - 1], df2.firstChild);

            }

        }
        df = null;
        return df2;

    };

    // ��̬����html�ļ�
    Router.getHtml = function (obj, src, fn) {

        Router.compilerHtml(obj, src, {}, false, fn);
    };

    // ��ȡid
    Router.getId = function () {

        if (Router.ids.length > 0) {
            return Router.ids[Router.ids.length - 1];
        }
        return 0;

    };

    // ��ȡ��ǰ����·��ҳԪ��
    Router.getActiveEl = function () {

        return m("#m-router-" + m.router.getId());
    };

    // ����·��ҳtop����
    Router.setting = function (settingObj) {
        _setRouterObj(Router.getActiveEl(), settingObj);
    }

    //  a��ǩ ��������data-link ��ת
    Router.alink = function () {
       
        var isHref = m(this).hasAttr("href");
        var hrefValue = m(this).attr("href");
        if (isHref) {
            if (hrefValue.trim() === "" || hrefValue.trim() === "#" || hrefValue.trim() === "javascript:;") {
                return;
            } else {

                //if (m(this).hasAttr("data-router")) {
                m.router.link(hrefValue);
                return;
                //  }
                // window.location.href = hrefValue;
            }

        }
    }

    // ɾ��id
    Router.removeId = function (id) {

        if (Router.ids.length > 0) {
            var index = Router.ids.findIndex(function (item) { return item === id; });
            if (index !== -1) {
                return Router.ids.splice(index, 1);

            }
        }

    };

    // ��ȡ��һ��·��ҳ��
    Router.getPrevEl = function () {

        if (Router.ids.length >1) {

            var id = "#m-router-" + (Router.getId()-1);
            return m(id);
        }

        return m(".m-bd");
        
    };

    // ���·��
    Router.link = function (src, parameter, isShowBtn) {
        isShowBtn = typeof isShowBtn === "boolean" ? isShowBtn: true;
        var nowTime = new Date().getTime();
        // ����ӳ�ʱ��ĵ��
        if ((nowTime - Router.tapTime) > Router.transitionTime) {
            Router.tapTime = nowTime;

            var elm = document.body || document.documentElement;
            var id = Router.getId() + 1;
            var routerMask = document.createElement("div");
            routerMask.classList.add("m-router-mask");
            routerMask.style = "z-index:" + (100 + id);
            routerMask.setAttribute("data-Router-id", "m-router-"+id);
            elm.appendChild(routerMask);

            var routerEl = document.createElement("div");
            Router.ids.push(id);
            routerEl.id = "m-router-" + id;
            routerEl.classList.add("m-router");
            routerEl.classList.add("in");//
      
            routerEl.style = "z-index:" + (100 + id);
            routerEl.setAttribute("data-router-id", id);

            if (isShowBtn) {
            var topEl = document.createElement("div");
            topEl.classList.add("m-router-hd");
            topEl.innerHTML = `<div class="m-hd-top">
            <div class="m-hd-top-icon m-router-back">
                <span class="icon icon-back-left">
                </span>
            </div>
            <h4 class="m-hd-top-ttl">  
                <div class="m-ball-clip-rotate"><div></div>     
                </div> 
            </h4>
            </div>`;  
                routerEl.appendChild(topEl);

            }

            var contEl = document.createElement("div");
            contEl.classList.add("m-router-hd");
           
            elm.appendChild(routerEl);
          
            var $prevEl = Router.getPrevEl();
            var transition = "transform  " + (Router.transitionTime+150 )+ "ms linear ";
            $prevEl.removeClass("in").transition(transition).translateX(-$prevEl.width() / 2).translateZ(0);
            Router.isOneMove = true;
         
            var $el = m("#" + routerEl.id);
            $el.append(`<div class="_loading-dh"><div class="m-ball-clip-rotate"><div></div></div>`);

            // ����url�Ĳ���
            var urlParameter = _setUrlParameter(src);
            parameter = parameter || {};
            var p = m.extend({}, urlParameter, parameter);
            $el.data("parameter", p);

            // �����ǰ��·��ҳ
            console.log("��ǰ��·��ҳ��",src);

            _moveEl($el);
            _compilerHtml(m("#" + routerEl.id).get(0), src, {}, false, function () {
           
                m.setRouterLayout();

            }, routerEl.id);
        }
    };

    // ɾ��·��
    Router.remove = function (el) {

        var id = parseInt(m(el).attr("data-router-id") || -1);
        m(el).remove();
        Router.removeId(id);
        m("[data-router-id=m-router-" + id + "]").remove();
    };

    // ���ؼ�
    Router.back = function (t) {
        t = typeof t === "number"?t: 1;
        if (Router.ids.length <= 0) {
            return;
        }

        var nowTime = new Date().getTime();
        // ����ӳ�ʱ��ĵ��
        if ((nowTime - Router.tapTime) > Router.transitionTime) {
            Router.tapTime = nowTime;
            var id = "#m-router-" + Router.getId();
            var $p = m(id);
            var transition = "transform  " + Router.transitionTime*t + "ms linear";
             $p.removeClass("in").transition(transition).translateX($p.width()).translateZ(1);
            var _id = Router.getId();

            // ����ҳ������ �������¼�
            $p.emit("m-router-hide", [$p, _id]);  
          
            var $prevEl = Router.getPrevEl();
            $prevEl.transition(transition).translateX(0);
            setTimeout(function () {

                m("[data-router-id=m-router-" + _id + "]").remove();
                $p.remove();
                Router.removeId(_id);

                // ����ҳ����ʾ �������¼�
                var $preEl =m( "#m-router-" + Router.getId());
                $preEl.emit("m-router-show", [$preEl, Router.getId()]);  

            }, Router.transitionTime*t);
        }
    };

    // �������ں���
    Router.page = function (options) {

        var setting = options.setting instanceof Object ? options.setting : {};
        var loadJs = options.loadJs instanceof Array ? options.loadJs : [];
        var onLoad = typeof options.onLoad === "function" ? options.onLoad : function () { };
        var onShow = typeof options.onShow === "function" ? options.onShow : function () { };
        var isAmd = typeof options.isAmd === "boolean" ? options.isAmd : true;
        var id = "#m-router-" + Router.getId();

        // onHide
        if (typeof options.onHide === "function") {

            Router.onHide(m(id), options.onHide);
        }

        // onShow
        if (typeof onShow === "function") {
            Router.onShow(m(id), onShow);
        }

        // onLoad
        _load(setting, loadJs, onLoad, isAmd);

    };

    // �������ں���--����ҳ����ʾ
    Router.onShow = function (el, fn) {

        m(el).on("m-router-show", function (event, $p, id) {
            var _id = Number($p.attr("data-router-id") || -1);
            if (_id === id) { fn.call($p, $p); }

        });
    };

    // �������ں���--����ҳ������
    Router.onHide = function (el,fn) {

        m(el).on("m-router-hide", function (event, $p,id) {   
            if (Router.getId() === id) { fn.call($p, $p); }
        });
    };

    Router.app = {}; // ȫ�ֶ���

    // Router������չ
    m.extend({
        router: Router      
    });   

    // ��ʼ��Ĭ��Ϊm-bd ���idֵ
    if (Router.ids.length === 0) {
        var id = "m-router-" + Router.getId();
        m(".m-bd").attr("id", id).attr("data-router-id", Router.getId());
    }

  
    // ������һҳ
    function mBack() {
        m(document).on("tap", ".m-router-back", function (event) {
            event.preventDefault();
            Router.back();
        });
    }

    function setRouterLayout() {

        // ��������������height
        var $el = m.router.getActiveEl();
        var $bd =$el;
        var $header = $(".m-router-hd", $el);
        var $cont = $(".m-router-cnt", $el);

        var $bd_height = parseFloat($bd.height()),
            $header_height = parseFloat($header.height());

        var $cont_height = $bd_height - $header_height;
        $cont.height($cont_height); // set cnt height
        $cont.css("top", $header_height); // set cnt top

    }

    // ����ҳ�沼��
    m.extend({
        setRouterLayout: setRouterLayout
    });


    mBack(); //������һҳ 
    m.setRouterLayout(); //��������������
    m(window).on("resize", setRouterLayout);

}();