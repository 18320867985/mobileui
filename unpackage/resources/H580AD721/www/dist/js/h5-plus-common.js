!function(o){function t(){return!1}document.addEventListener("touchstart",t,!1),document.oncontextmenu=t;var e=null;function n(){e=plus.webview.currentWebview(),plus.key.addEventListener("backbutton",function(){back()},!1)}o.plus?n():document.addEventListener("plusready",n,!1),document.addEventListener("DOMContentLoaded",function(){gInit(),document.body.onselectstart=t},!1),o.back=function(t){o.plus?(e=e||plus.webview.currentWebview(),t||e.preate?e.hide("auto"):e.close("auto")):1<history.length?history.back():o.close()};var i=null;o.clicked=function(t,e,n){return i?null:o.plus?((n=n||{}).scrollIndicator||(n.scrollIndicator="none"),n.scalable||(n.scalable=!1),n.backButtonAutoControl||(n.backButtonAutoControl="close"),n.titleNView=n.titleNView||{autoBackButton:!0},n.titleNView.backgroundColor="#D74B28",n.titleNView.titleColor="#CCCCCC",n.doc&&(n.titleNView.buttons=n.titleNView.buttons||[],n.titleNView.buttons.push({fontSrc:"_www/helloh5.ttf",text:"",fontSize:"20px",onclick:"javascript:openDoc()"})),e&&(n.titleNView.titleText=e),(i=plus.webview.create(t,t,n)).addEventListener("loaded",function(){i.show("pop-in")},!1),i.addEventListener("close",function(){i=null},!1),i):(o.open(t),null)},o.createWithoutTitle=function(t,e){return i?null:o.plus?((e=e||{}).scrollIndicator||(e.scrollIndicator="none"),e.scalable||(e.scalable=!1),e.backButtonAutoControl||(e.backButtonAutoControl="close"),(i=plus.webview.create(t,t,e)).addEventListener("close",function(){i=null},!1),i):(o.open(t),null)},o.openDoc=function(t){plus.webview.create(t,"document",{titleNView:{autoBackButton:!0,backgroundColor:"#D74B28",titleColor:"#CCCCCC"},backButtonAutoControl:"close",scalable:!1}).show("pop-in")},o.compatibleConfirm=function(){plus.nativeUI.confirm("本OS原生层面不提供该控件，需使用mui框架实现类似效果。请点击“确定”下载Hello mui示例",function(t){0==t.index&&plus.runtime.openURL("http://www.dcloud.io/hellomui/")},"",["确定","取消"])};var r=null;o.gInit=function(){r=document.getElementById("output")},o.outClean=function(){r.innerText="",r.scrollTop=0},o.outSet=function(t){console.log(t),r.innerText=t+"\n",0==r.scrollTop&&(r.scrollTop=1)},o.outLine=function(t){console.log(t),r.innerText+=t+"\n",0==r.scrollTop&&(r.scrollTop=1)},o.timeToStr=function(t){if(isNaN(t))return"--:--:--";var e=parseInt(t/3600),n=parseInt(t%3600/60),t=parseInt(t%60);return ultZeroize(e)+":"+ultZeroize(n)+":"+ultZeroize(t)},o.dateToStr=function(t){return t.getFullYear()+"-"+ultZeroize(t.getMonth()+1)+"-"+ultZeroize(t.getDate())+" "+ultZeroize(t.getHours())+":"+ultZeroize(t.getMinutes())+":"+ultZeroize(t.getSeconds())},o.ultZeroize=function(t,e){var n="";e=e||2,t=String(t);for(var o=0;o<e-t.length;o++)n+="0";return n+t}}(window),function(){"use strict";function a(i,t){var e;if(t=t||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=t.touchBoundary||10,this.layer=i,this.tapDelay=t.tapDelay||200,this.tapTimeout=t.tapTimeout||700,!a.notNeeded(i)){for(var n=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],o=this,r=0,c=n.length;r<c;r++)o[n[r]]=function(t,e){return function(){return t.apply(e,arguments)}}(o[n[r]],o);l&&(i.addEventListener("mouseover",this.onMouse,!0),i.addEventListener("mousedown",this.onMouse,!0),i.addEventListener("mouseup",this.onMouse,!0)),i.addEventListener("click",this.onClick,!0),i.addEventListener("touchstart",this.onTouchStart,!1),i.addEventListener("touchmove",this.onTouchMove,!1),i.addEventListener("touchend",this.onTouchEnd,!1),i.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(i.removeEventListener=function(t,e,n){var o=Node.prototype.removeEventListener;"click"===t?o.call(i,t,e.hijacked||e,n):o.call(i,t,e,n)},i.addEventListener=function(t,e,n){var o=Node.prototype.addEventListener;"click"===t?o.call(i,t,e.hijacked||(e.hijacked=function(t){t.propagationStopped||e(t)}),n):o.call(i,t,e,n)}),"function"==typeof i.onclick&&(e=i.onclick,i.addEventListener("click",function(t){e(t)},!1),i.onclick=null)}}var t=0<=navigator.userAgent.indexOf("Windows Phone"),l=0<navigator.userAgent.indexOf("Android")&&!t,c=/iP(ad|hone|od)/.test(navigator.userAgent)&&!t,u=c&&/OS 4_\d(_\d)?/.test(navigator.userAgent),s=c&&/OS [6-7]_\d/.test(navigator.userAgent),i=0<navigator.userAgent.indexOf("BB10");a.prototype.needsClick=function(t){switch(t.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(t.disabled)return!0;break;case"input":if(c&&"file"===t.type||t.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(t.className)},a.prototype.needsFocus=function(t){switch(t.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!l;case"input":switch(t.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!t.disabled&&!t.readOnly;default:return/\bneedsfocus\b/.test(t.className)}},a.prototype.sendClick=function(t,e){var n;document.activeElement&&document.activeElement!==t&&document.activeElement.blur(),n=e.changedTouches[0],(e=document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(t),!0,!0,window,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null),e.forwardedTouchEvent=!0,t.dispatchEvent(e)},a.prototype.determineEventType=function(t){return l&&"select"===t.tagName.toLowerCase()?"mousedown":"click"},a.prototype.focus=function(t){var e;c&&t.setSelectionRange&&0!==t.type.indexOf("date")&&"time"!==t.type&&"month"!==t.type?(e=t.value.length,t.setSelectionRange(e,e)):t.focus()},a.prototype.updateScrollParent=function(t){var e,n=t.fastClickScrollParent;if(!n||!n.contains(t)){e=t;do{if(e.scrollHeight>e.offsetHeight){t.fastClickScrollParent=n=e;break}}while(e=e.parentElement)}n&&(n.fastClickLastScrollTop=n.scrollTop)},a.prototype.getTargetElementFromEventTarget=function(t){return t.nodeType===Node.TEXT_NODE?t.parentNode:t},a.prototype.onTouchStart=function(t){var e,n,o;if(1<t.targetTouches.length)return!0;if(e=this.getTargetElementFromEventTarget(t.target),n=t.targetTouches[0],c){if((o=window.getSelection()).rangeCount&&!o.isCollapsed)return!0;if(!u){if(n.identifier&&n.identifier===this.lastTouchIdentifier)return t.preventDefault(),!1;this.lastTouchIdentifier=n.identifier,this.updateScrollParent(e)}}return this.trackingClick=!0,this.trackingClickStart=t.timeStamp,this.targetElement=e,this.touchStartX=n.pageX,this.touchStartY=n.pageY,t.timeStamp-this.lastClickTime<this.tapDelay&&t.preventDefault(),!0},a.prototype.touchHasMoved=function(t){var e=t.changedTouches[0],t=this.touchBoundary;return Math.abs(e.pageX-this.touchStartX)>t||Math.abs(e.pageY-this.touchStartY)>t},a.prototype.onTouchMove=function(t){return this.trackingClick&&(this.targetElement===this.getTargetElementFromEventTarget(t.target)&&!this.touchHasMoved(t)||(this.trackingClick=!1,this.targetElement=null)),!0},a.prototype.findControl=function(t){return void 0!==t.control?t.control:t.htmlFor?document.getElementById(t.htmlFor):t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},a.prototype.onTouchEnd=function(t){var e,n,o,i,r=this.targetElement;if(!this.trackingClick)return!0;if(t.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0;if(t.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;if(this.cancelNextClick=!1,this.lastClickTime=t.timeStamp,e=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,s&&(i=t.changedTouches[0],(r=document.elementFromPoint(i.pageX-window.pageXOffset,i.pageY-window.pageYOffset)||r).fastClickScrollParent=this.targetElement.fastClickScrollParent),"label"===(n=r.tagName.toLowerCase())){if(i=this.findControl(r)){if(this.focus(r),l)return!1;r=i}}else if(this.needsFocus(r))return 100<t.timeStamp-e||c&&window.top!==window&&"input"===n?this.targetElement=null:(this.focus(r),this.sendClick(r,t),c&&"select"===n||(this.targetElement=null,t.preventDefault())),!1;return!(!c||u||!(o=r.fastClickScrollParent)||o.fastClickLastScrollTop===o.scrollTop)||(this.needsClick(r)||(t.preventDefault(),this.sendClick(r,t)),!1)},a.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},a.prototype.onMouse=function(t){return!this.targetElement||(!!t.forwardedTouchEvent||(!t.cancelable||(!(!this.needsClick(this.targetElement)||this.cancelNextClick)||(t.stopImmediatePropagation?t.stopImmediatePropagation():t.propagationStopped=!0,t.stopPropagation(),t.preventDefault(),!1))))},a.prototype.onClick=function(t){return this.trackingClick?(this.targetElement=null,!(this.trackingClick=!1)):"submit"===t.target.type&&0===t.detail||((t=this.onMouse(t))||(this.targetElement=null),t)},a.prototype.destroy=function(){var t=this.layer;l&&(t.removeEventListener("mouseover",this.onMouse,!0),t.removeEventListener("mousedown",this.onMouse,!0),t.removeEventListener("mouseup",this.onMouse,!0)),t.removeEventListener("click",this.onClick,!0),t.removeEventListener("touchstart",this.onTouchStart,!1),t.removeEventListener("touchmove",this.onTouchMove,!1),t.removeEventListener("touchend",this.onTouchEnd,!1),t.removeEventListener("touchcancel",this.onTouchCancel,!1)},a.notNeeded=function(t){var e,n,o;if(void 0===window.ontouchstart)return!0;if(n=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!l)return!0;if(e=document.querySelector("meta[name=viewport]")){if(-1!==e.content.indexOf("user-scalable=no"))return!0;if(31<n&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(i&&10<=(o=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1]&&3<=o[2]&&(e=document.querySelector("meta[name=viewport]"))){if(-1!==e.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===t.style.msTouchAction||"manipulation"===t.style.touchAction||(!!(27<=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]&&(e=document.querySelector("meta[name=viewport]"))&&(-1!==e.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth))||("none"===t.style.touchAction||"manipulation"===t.style.touchAction))},a.attach=function(t,e){return new a(t,e)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return a}):"undefined"!=typeof module&&module.exports?(module.exports=a.attach,module.exports.FastClick=a):window.FastClick=a,document.addEventListener("DOMContentLoaded",function(){a.attach(document.body)},!1)}();