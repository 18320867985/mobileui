!function(o){function t(){return!1}document.addEventListener("touchstart",t,!1),document.oncontextmenu=t;var e=null;function n(){e=plus.webview.currentWebview(),plus.key.addEventListener("backbutton",function(){back()},!1)}o.plus?n():document.addEventListener("plusready",n,!1),document.addEventListener("DOMContentLoaded",function(){gInit(),document.body.onselectstart=t},!1),o.back=function(t){o.plus?(e=e||plus.webview.currentWebview(),t||e.preate?e.hide("auto"):e.close("auto")):1<history.length?history.back():o.close()};var i=null;o.clicked=function(t,e,n){return i?null:o.plus?((n=n||{}).scrollIndicator||(n.scrollIndicator="none"),n.scalable||(n.scalable=!1),n.backButtonAutoControl||(n.backButtonAutoControl="close"),n.titleNView=n.titleNView||{autoBackButton:!0},n.titleNView.backgroundColor="#D74B28",n.titleNView.titleColor="#CCCCCC",n.doc&&(n.titleNView.buttons=n.titleNView.buttons||[],n.titleNView.buttons.push({fontSrc:"_www/helloh5.ttf",text:"",fontSize:"20px",onclick:"javascript:openDoc()"})),e&&(n.titleNView.titleText=e),(i=plus.webview.create(t,t,n)).addEventListener("loaded",function(){i.show("pop-in")},!1),i.addEventListener("close",function(){i=null},!1),i):(o.open(t),null)},o.createWithoutTitle=function(t,e){return i?null:o.plus?((e=e||{}).scrollIndicator||(e.scrollIndicator="none"),e.scalable||(e.scalable=!1),e.backButtonAutoControl||(e.backButtonAutoControl="close"),(i=plus.webview.create(t,t,e)).addEventListener("close",function(){i=null},!1),i):(o.open(t),null)},o.openDoc=function(t){plus.webview.create(t,"document",{titleNView:{autoBackButton:!0,backgroundColor:"#D74B28",titleColor:"#CCCCCC"},backButtonAutoControl:"close",scalable:!1}).show("pop-in")},o.compatibleConfirm=function(){plus.nativeUI.confirm("本OS原生层面不提供该控件，需使用mui框架实现类似效果。请点击“确定”下载Hello mui示例",function(t){0==t.index&&plus.runtime.openURL("http://www.dcloud.io/hellomui/")},"",["确定","取消"])};var r=null;o.gInit=function(){r=document.getElementById("output")},o.outClean=function(){r.innerText="",r.scrollTop=0},o.outSet=function(t){console.log(t),r.innerText=t+"\n",0==r.scrollTop&&(r.scrollTop=1)},o.outLine=function(t){console.log(t),r.innerText+=t+"\n",0==r.scrollTop&&(r.scrollTop=1)},o.timeToStr=function(t){if(isNaN(t))return"--:--:--";var e=parseInt(t/3600),n=parseInt(t%3600/60),o=parseInt(t%60);return ultZeroize(e)+":"+ultZeroize(n)+":"+ultZeroize(o)},o.dateToStr=function(t){return t.getFullYear()+"-"+ultZeroize(t.getMonth()+1)+"-"+ultZeroize(t.getDate())+" "+ultZeroize(t.getHours())+":"+ultZeroize(t.getMinutes())+":"+ultZeroize(t.getSeconds())},o.ultZeroize=function(t,e){var n="";e=e||2,t=String(t);for(var o=0;o<e-t.length;o++)n+="0";return n+t}}(window),function(){"use strict";function l(i,t){var e;if(t=t||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=t.touchBoundary||10,this.layer=i,this.tapDelay=t.tapDelay||200,this.tapTimeout=t.tapTimeout||700,!l.notNeeded(i)){for(var n=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],o=this,r=0,c=n.length;r<c;r++)o[n[r]]=a(o[n[r]],o);u&&(i.addEventListener("mouseover",this.onMouse,!0),i.addEventListener("mousedown",this.onMouse,!0),i.addEventListener("mouseup",this.onMouse,!0)),i.addEventListener("click",this.onClick,!0),i.addEventListener("touchstart",this.onTouchStart,!1),i.addEventListener("touchmove",this.onTouchMove,!1),i.addEventListener("touchend",this.onTouchEnd,!1),i.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(i.removeEventListener=function(t,e,n){var o=Node.prototype.removeEventListener;"click"===t?o.call(i,t,e.hijacked||e,n):o.call(i,t,e,n)},i.addEventListener=function(t,e,n){var o=Node.prototype.addEventListener;"click"===t?o.call(i,t,e.hijacked||(e.hijacked=function(t){t.propagationStopped||e(t)}),n):o.call(i,t,e,n)}),"function"==typeof i.onclick&&(e=i.onclick,i.addEventListener("click",function(t){e(t)},!1),i.onclick=null)}function a(t,e){return function(){return t.apply(e,arguments)}}}var t=0<=navigator.userAgent.indexOf("Windows Phone"),u=0<navigator.userAgent.indexOf("Android")&&!t,a=/iP(ad|hone|od)/.test(navigator.userAgent)&&!t,s=a&&/OS 4_\d(_\d)?/.test(navigator.userAgent),d=a&&/OS [6-7]_\d/.test(navigator.userAgent),i=0<navigator.userAgent.indexOf("BB10");l.prototype.needsClick=function(t){switch(t.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(t.disabled)return!0;break;case"input":if(a&&"file"===t.type||t.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(t.className)},l.prototype.needsFocus=function(t){switch(t.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!u;case"input":switch(t.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!t.disabled&&!t.readOnly;default:return/\bneedsfocus\b/.test(t.className)}},l.prototype.sendClick=function(t,e){var n,o;document.activeElement&&document.activeElement!==t&&document.activeElement.blur(),o=e.changedTouches[0],(n=document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(t),!0,!0,window,1,o.screenX,o.screenY,o.clientX,o.clientY,!1,!1,!1,!1,0,null),n.forwardedTouchEvent=!0,t.dispatchEvent(n)},l.prototype.determineEventType=function(t){return u&&"select"===t.tagName.toLowerCase()?"mousedown":"click"},l.prototype.focus=function(t){var e;a&&t.setSelectionRange&&0!==t.type.indexOf("date")&&"time"!==t.type&&"month"!==t.type?(e=t.value.length,t.setSelectionRange(e,e)):t.focus()},l.prototype.updateScrollParent=function(t){var e,n;if(!(e=t.fastClickScrollParent)||!e.contains(t)){n=t;do{if(n.scrollHeight>n.offsetHeight){e=n,t.fastClickScrollParent=n;break}n=n.parentElement}while(n)}e&&(e.fastClickLastScrollTop=e.scrollTop)},l.prototype.getTargetElementFromEventTarget=function(t){return t.nodeType===Node.TEXT_NODE?t.parentNode:t},l.prototype.onTouchStart=function(t){var e,n,o;if(1<t.targetTouches.length)return!0;if(e=this.getTargetElementFromEventTarget(t.target),n=t.targetTouches[0],a){if((o=window.getSelection()).rangeCount&&!o.isCollapsed)return!0;if(!s){if(n.identifier&&n.identifier===this.lastTouchIdentifier)return t.preventDefault(),!1;this.lastTouchIdentifier=n.identifier,this.updateScrollParent(e)}}return this.trackingClick=!0,this.trackingClickStart=t.timeStamp,this.targetElement=e,this.touchStartX=n.pageX,this.touchStartY=n.pageY,t.timeStamp-this.lastClickTime<this.tapDelay&&t.preventDefault(),!0},l.prototype.touchHasMoved=function(t){var e=t.changedTouches[0],n=this.touchBoundary;return Math.abs(e.pageX-this.touchStartX)>n||Math.abs(e.pageY-this.touchStartY)>n},l.prototype.onTouchMove=function(t){return this.trackingClick&&(this.targetElement===this.getTargetElementFromEventTarget(t.target)&&!this.touchHasMoved(t)||(this.trackingClick=!1,this.targetElement=null)),!0},l.prototype.findControl=function(t){return void 0!==t.control?t.control:t.htmlFor?document.getElementById(t.htmlFor):t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},l.prototype.onTouchEnd=function(t){var e,n,o,i,r,c=this.targetElement;if(!this.trackingClick)return!0;if(t.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0;if(t.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;if(this.cancelNextClick=!1,this.lastClickTime=t.timeStamp,n=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,d&&(r=t.changedTouches[0],(c=document.elementFromPoint(r.pageX-window.pageXOffset,r.pageY-window.pageYOffset)||c).fastClickScrollParent=this.targetElement.fastClickScrollParent),"label"===(o=c.tagName.toLowerCase())){if(e=this.findControl(c)){if(this.focus(c),u)return!1;c=e}}else if(this.needsFocus(c))return 100<t.timeStamp-n||a&&window.top!==window&&"input"===o?this.targetElement=null:(this.focus(c),this.sendClick(c,t),a&&"select"===o||(this.targetElement=null,t.preventDefault())),!1;return!(!a||s||!(i=c.fastClickScrollParent)||i.fastClickLastScrollTop===i.scrollTop)||(this.needsClick(c)||(t.preventDefault(),this.sendClick(c,t)),!1)},l.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},l.prototype.onMouse=function(t){return!this.targetElement||(!!t.forwardedTouchEvent||(!t.cancelable||(!(!this.needsClick(this.targetElement)||this.cancelNextClick)||(t.stopImmediatePropagation?t.stopImmediatePropagation():t.propagationStopped=!0,t.stopPropagation(),t.preventDefault(),!1))))},l.prototype.onClick=function(t){var e;return this.trackingClick?(this.targetElement=null,!(this.trackingClick=!1)):"submit"===t.target.type&&0===t.detail||((e=this.onMouse(t))||(this.targetElement=null),e)},l.prototype.destroy=function(){var t=this.layer;u&&(t.removeEventListener("mouseover",this.onMouse,!0),t.removeEventListener("mousedown",this.onMouse,!0),t.removeEventListener("mouseup",this.onMouse,!0)),t.removeEventListener("click",this.onClick,!0),t.removeEventListener("touchstart",this.onTouchStart,!1),t.removeEventListener("touchmove",this.onTouchMove,!1),t.removeEventListener("touchend",this.onTouchEnd,!1),t.removeEventListener("touchcancel",this.onTouchCancel,!1)},l.notNeeded=function(t){var e,n,o;if(void 0===window.ontouchstart)return!0;if(n=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!u)return!0;if(e=document.querySelector("meta[name=viewport]")){if(-1!==e.content.indexOf("user-scalable=no"))return!0;if(31<n&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(i&&10<=(o=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1]&&3<=o[2]&&(e=document.querySelector("meta[name=viewport]"))){if(-1!==e.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===t.style.msTouchAction||"manipulation"===t.style.touchAction||(!!(27<=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]&&(e=document.querySelector("meta[name=viewport]"))&&(-1!==e.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth))||("none"===t.style.touchAction||"manipulation"===t.style.touchAction))},l.attach=function(t,e){return new l(t,e)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return l}):"undefined"!=typeof module&&module.exports?(module.exports=l.attach,module.exports.FastClick=l):window.FastClick=l,document.addEventListener("DOMContentLoaded",function(){l.attach(document.body)},!1)}();