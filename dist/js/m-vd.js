!function(){"use strict";function t(e,r){this.submitText="正在提交中...",this.formName=void 0===e?".form":e,this.content=r||m(document),this.$p=$(this.content).find(this.formName),this.init=function(){this.addErrorStyle(!1,!0),this.checkObj(this.formName),this.addVidation()},this.baseRemoteUrl="",this.disabled=function(e){$(e).attr("disabled","disabled")},this.enabled=function(e){$(e).removeAttr("disabled")},this.arrs=[],this.vdbtnText="",this.compareEmit=function(e,r,t){var d=$(e+" [name="+r+"]",this.$p);if(""!==$.trim(d.val()))for(var s=0;s<this.arrs.length;s++)if($.trim(this.arrs[s].elName)===$.trim(r)){window.addEventListener?$(d).trigger("input"):$(d).trigger("keyup");break}},this.checkObj=function(p){void 0===p&&(p=".form"),this.arrs=[];var g=this;this.$p.find(p+" .vd-item").each(function(){var e=$(this).attr("name"),r=$(this).val(),t=$(this).attr("vd-req-msg"),d=$(this).attr("vd-pattern"),s=$(this).attr("vd-pattern-msg"),a=$(this).attr("vd-ck"),v=$(this).attr("vd-req"),o=$(this).attr("vd-ck-true")||$(this).val(),i="";if(void 0!==t&&""===r)i=t;else if(void 0!==s){new RegExp(d,"i").test(r)||(i=s)}else i="";if(""!==e&&"vd-btn"!==e){var l={};l.pName=p,l.elName=e,l.errorMsg=i,l.val=r,l.el=this,l.bl=!1,void 0===v&&(l.bl=!0),void 0!==a&&(this.checked?(l.bl=!0,l.val=o):(l.bl=void 0===v,l.val=$(this).attr("vd-ck-false")||!1)),g.arrs.push(l)}var n=$(this).attr("vd-ck-gp"),h=$(this).attr("vd-req"),m=$(this).attr("vd-req-msg");if(void 0!==n){var c=$(this).find("[type=checkbox]:checked").length;$(this).parents(".vd-box");c<=0&&void 0!==h?(l.bl=!1,l.val=[],l.errorMsg=m):(l.val=[],$(this).find("[type=checkbox]:checked").each(function(){var e=this.getAttribute("vd-ck-true")||""||this.value||"";l.val.push(e)}),l.bl=!0,l.errorMsg="")}var b=$(this).attr("vd-rd-gp"),u=$(this).attr("vd-req"),f=$(this).attr("vd-req-msg");if(void 0!==b){var C=$(this).find("[type=radio]:checked").length;$(this).parents(".vd-box"),C<=0&&void 0!==u?(l.bl=!1,l.val="",l.errorMsg=f):(l.val="",$(this).find("[type=radio]:checked").each(function(){var e=this.getAttribute("vd-ck-true")||""||this.value||"";l.val=e}),l.bl=!0,l.errorMsg="")}})},this.addVidation=function(){for(var e=this.$p,r=0;r<this.arrs.length;r++){var t=this.arrs[r],d=t.el,s=this;window.addEventListener?$(d).on("input",t,function(e){s.checkElement(e.data,e.target,!0,!0),s.addVdBtnStyle()}):$(d).on("keyup",t,function(e){s.checkElement(e.data,e.target,!0,!0),s.addVdBtnStyle()}),null===d.getAttribute("vd-remote")&&$(d).on("change",t,function(e){s.checkElement(e.data,e.target,!0,!0),s.addVdBtnStyle()});var a=$(".vd-btn",e);0<a.length&&a[0].hasAttribute("value")?this.vdbtnText=a.val():this.vdbtnText=a.text()}},this.checkElement=function(r,t,e,d){var s=this,a=t.getAttribute("vd-req"),v=t.getAttribute("vd-req-msg"),o=t.getAttribute("vd-pattern"),i=t.getAttribute("vd-pattern-msg"),l=t.getAttribute("vd-remote"),n=t.getAttribute("vd-remote-msg"),h=t.getAttribute("vd-remote-length"),m=t.getAttribute("vd-compare"),c=t.getAttribute("vd-compare-msg"),b=t.getAttribute("vd-compare-emit"),u=t.getAttribute("vd-ck"),f=t.getAttribute("value")||"",C=t.getAttribute("vd-ck-true"),p=t.getAttribute("vd-ck-false"),g=t.getAttribute("vd-req-msg"),k=t.getAttribute("vd-req"),x=$(t).closest(".vd-item"),y=x.attr("vd-ck-gp"),q=$(t).closest(".vd-item"),S=q.attr("vd-rd-gp"),A=$.trim(t.value),M=$(t).parents(".vd-box");if(null!==a&&void 0===y&&void 0===S){if(""===A)return r.bl=!1,r.val=A,r.errorMsg=v,M=$(t).parents(".vd-box"),$(M).removeClass("vd-pattern vd-remote vd-compare").addClass("vd-error  "),$(M).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error"),$(M).find(".vd-req").addClass("vd-error").text(v),$(t).addClass("vd-error"),$(M).removeClass("vd-ok "),void $(".vd-dep-btn",M).addClass("vd-error").removeClass("vd-ok");M=$(t).parents(".vd-box"),$(M).removeClass("vd-error "),$(M).find(".vd-req").removeClass("vd-error").text(""),$(t).removeClass("vd-error"),$(M).addClass("vd-ok"),$(".vd-dep-btn",M).removeClass("vd-error").addClass("vd-ok"),e&&!l&&(r.errorMsg="",r.val=A,r.bl=!0)}if(null!==b&&this.compareEmit(r.pName,b,A),null!==o&&""!==A){if(!new RegExp(o,"i").test(A))return r.errorMsg=i,r.bl=!1,r.val=A,M=$(t).parents(".vd-box"),$(M).addClass("vd-error"),$(M).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error"),$(M).find(".vd-pattern").addClass("vd-error").text(i),$(t).addClass("vd-error"),$(M).removeClass("vd-ok"),void $(".vd-dep-btn",M).addClass("vd-error").removeClass("vd-ok");r.errorMsg="",r.val=A,r.bl=!0,M=$(t).parents(".vd-box"),$(M).removeClass("vd-error "),$(M).find(".vd-pattern").removeClass("vd-error").text(""),$(t).removeClass("vd-error"),$(M).addClass("vd-ok"),$(".vd-dep-btn",M).removeClass("vd-error").addClass("vd-ok")}else l||(r.errorMsg="",r.val=A,r.bl=!0,M=$(t).parents(".vd-box"),$(M).removeClass("vd-error "),$(M).find(".vd-pattern").removeClass("vd-error").text(""),$(t).removeClass("vd-error"),$(M).addClass("vd-ok"),$(".vd-dep-btn",M).removeClass("vd-error").addClass("vd-ok"));if(null!==m){var E=$(r.pName+"  [name="+m+"]",this.$p);if(A!==$(E).val())return r.bl=!1,r.val=A,r.errorMsg=c,M=$(t).parents(".vd-box"),$(M).addClass("vd-error"),$(M).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error"),$(M).find(".vd-compare").addClass("vd-error").text(c),$(M).removeClass("vd-ok"),$(t).addClass("vd-error"),void $(".vd-dep-btn",M).addClass("vd-error").removeClass("vd-ok");r.errorMsg="",r.val=A,r.bl=!0,M=$(t).parents(".vd-box"),$(M).removeClass("vd-error vd-compare "),$(M).find(".vd-compare").removeClass("vd-error").text(""),$(t).removeClass("vd-error"),$(M).addClass("vd-ok"),$(".vd-dep-btn",M).removeClass("vd-error").addClass("vd-ok")}if(null!==l){var O=null!==h?h:0;if(A.length<O)return r.errorMsg=n,r.bl=!1,r.val=A,r.remote_bl=r.bl,M=$(t).parents(".vd-box"),$(M).addClass("vd-error "),$(M).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error"),$(M).find(".vd-remote").addClass("vd-error").text(n),$(t).addClass("vd-error"),$(M).removeClass("vd-ok"),void $(".vd-dep-btn",M).removeClass("vd-ok").addClass("vd-error");var j=this;if(e){$(t).trigger("onremotebefore",[t]);var V=$(t).attr("vd-remote-obj"),B=($(t).attr("vd-remote-method")||"get").toLowerCase(),N=($(t).attr("vd-remote-name")||"").toLowerCase(),w=$(t).attr("vd-remote-res")||"true",F={};F[t.name]=A,$.extend(F,s.getObjectByString(N)),"application/json"===$.ajaxSetup().contentType&&"get"!==B&&(F=JSON.stringify(F)),$.ajax({url:s.baseRemoteUrl+l+"?rand="+Math.random(),type:B,data:F,timeout:1e4,success:function(e){if(V&&(e=s.getObjectPropByString(e,V)),e=!!e,$(t).trigger("onremoteafter",[t,e]),"true"===w){if(!e)return j.remoteFunError(r,t,n),void j.addVdBtnStyle(t);j.remoteFunOk(r,t),j.addVdBtnStyle(t)}if("false"===w){if(e)return j.remoteFunError(r,t,n),void j.addVdBtnStyle(t);j.remoteFunOk(r,t),j.addVdBtnStyle(t)}},error:function(e){j.remoteFunError(r,t,n)}})}else r.bl=r.remoteVal||!1,r.bl?j.remoteFunOk(r,t):j.remoteFunError(r,t,n),j.addVdBtnStyle(t)}if(null!==u){if(!t.checked)return r.val=null!==p?p:0,r.errorMsg=g,void(null!==k?(M=$(t).parents(".vd-box"),$(M).addClass("vd-error vd-ck "),$(M).removeClass("vd-ok"),$(t).addClass("vd-error"),r.bl=!1,$(M).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(g)):(r.bl=!0,$(M).find(".vd-req").removeClass("vd-error").addClass("vd-ok").text("")));r.errorMsg="",r.val=null!==C?C:f,M=$(t).parents(".vd-box"),$(M).removeClass("vd-error  "),$(t).removeClass("vd-error"),$(M).addClass("vd-ok"),$(M).find(".vd-req").removeClass("vd-error").addClass("vd-ok").text(""),r.bl=!0}if(void 0!==y){var T=x.attr("vd-ck-gp"),_=x.attr("vd-req-msg"),I=x.attr("vd-req");if(void 0!==T){var L=x.find("[type=checkbox]:checked").length;M=x.parents(".vd-box"),L<=0&&void 0!==I?(M.removeClass("vd-ok"),M.addClass("vd-error"),r.bl=!1,r.val=[],A="",r.errorMsg=_,$(M).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(_)):(r.val=[],A=[],x.find("[type=checkbox]:checked").each(function(){var e=this.getAttribute("vd-ck-true")||""||this.value||"";r.val.push(e)}),r.bl=!0,r.errorMsg="",M.removeClass("vd-error"),M.addClass("vd-ok"),$(M).find(".vd-req").removeClass("vd-error").addClass("vd-ok"))}}var R=q.attr("vd-rd-gp"),P=q.attr("vd-req"),U=q.attr("vd-req-msg");if(void 0!==R){q.attr("name");var J=q.find("[type=radio]:checked").length;M=$(t).parents(".vd-box"),J<=0&&null!==P?(M.removeClass("vd-ok"),M.addClass("vd-error"),r.bl=!1,r.val="",r.errorMsg=U,$(M).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(U)):(r.val="",q.find("[type=radio]:checked").each(function(){var e=this.getAttribute("vd-ck-true")||""||this.value||"";r.val=e}),r.bl=!0,r.errorMsg="",M.removeClass("vd-error"),M.addClass("vd-ok"),$(M).find(".vd-req").removeClass("vd-error").addClass("vd-ok"))}},this.isSubmit=!0,this.isSuccess=function(e,r){this.addErrorStyle(!1,!1);for(var t=!0,d=0;d<this.arrs.length;d++){var s=this.arrs[d];if(!1===s.bl)return"function"==typeof r&&(this.isSubmit=!0,r(s)),!1}if(t){var a=this.getNewObjs();if("function"==typeof e&&this.isSubmit){this.isSubmit=!1;var v=$(".vd-btn",this.$p);0<v.length&&v[0].hasAttribute("value")?v.val(this.submitText):v.text(this.submitText),e(a)}}return!0},this.getNewObjs=function(){for(var e={},r=0;r<this.arrs.length;r++){var t=this.arrs[r];t.bl&&(e[t.elName]=t.val)}return e},this.getObj=function(e){for(var r={},t=0;t<this.arrs.length;t++)if($.trim(e)===$.trim(this.arrs[t].elName)){r=this.arrs[t];break}return r},this.addErrorStyle=function(e,r){for(var t=0;t<this.arrs.length;t++){var d=this.arrs[t]||{},s=d.el;this.checkElement(d,s,e,r),this.addVdBtnStyle()}},this.remoteFunOk=function(e,r){e.errorMsg="",e.bl=!0,e.val=$(r).val(),e.remote_bl=e.bl,e.remoteVal=!0;var t=$(r).parents(".vd-box");$(t).removeClass("vd-error "),$(t).find(".vd-remote").removeClass("vd-error").text(""),$(r).removeClass("vd-error"),$(t).addClass("vd-ok"),$(".vd-dep-btn",t).removeClass("vd-error").addClass("vd-ok")},this.remoteFunError=function(e,r,t){e.errorMsg=t,e.bl=!1,e.val=$(r).val(),e.remote_bl=e.bl,e.remoteVal=!1;var d=$(r).parents(".vd-box");$(d).addClass("vd-error "),$(d).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error"),$(d).find(".vd-remote").addClass("vd-error").text(t),$(r).addClass("vd-error"),$(d).removeClass("vd-ok"),$(".vd-dep-btn",d).removeClass("vd-ok").addClass("vd-error")},this.vdIsOk=function(){for(var e=!0,r=0;r<this.arrs.length;r++){if(!1===this.arrs[r].bl)return!1}return e},this.addVdBtnStyle=function(){var e=$(".vd-btn",this.$p);this.vdIsOk()?(this.$p.removeClass("vd-error").addClass("vd-ok"),e.removeClass("vd-error").addClass("vd-ok")):(this.$p.removeClass("vd-ok").addClass("vd-error"),e.removeClass("vd-ok").addClass("vd-error"))},this.check=function(e){if(e){var r=$(e).closest(".vd-box");if(1<=arguments.length){for(var t=e||"",d=r.find(".vd-item").attr("name")||"",s=0;s<this.arrs.length;s++){var a=this.arrs[s];if(a.elName===d){t=a.el,this.checkElement(a,t,!1,!1);break}}var v=this.getObj(d);return v&&v.bl&&(r.removeClass("vd-error").addClass("vd-ok"),$(".vd-req",r).removeClass("vd-error"),$(".vd-pattern",r).removeClass("vd-error"),$(".vd-remote",r).removeClass("vd-error"),$(".vd-compare",r).removeClass("vd-error"),$(".vd-dep-btn ",r).removeClass("vd-error")),void(this.vdIsOk()&&this.$p.find(".vd-btn").removeClass("vd-error"))}}},this.validate=function(){this.isSuccess()},this.reset=function(){this.isSubmit=!0;var e=this.$p;$(".vd-item",e).each(function(e){$(this).val(""),$(this)[0].hasAttribute("vd-ck")&&$(this).val(0)}),$("[type=checkbox]",e).each(function(){$(this)[0].checked=!1}),$("[type=radio]",e).each(function(){$(this)[0].checked=!1}),this.check(),this._valStyle(e);var r=$(".vd-btn",e);0<r.length&&r[0].hasAttribute("value")?r.val(this.vdbtnText):r.text(this.vdbtnText)},this.disabledItem=function(){this.disabled(this.$p.find("input")),this.disabled(this.$p.find("select")),this.disabled(this.$p.find("textarea"))},this._valStyle=function(e){$(".vd-box",e).removeClass("vd-error "),$(".vd-btn",e).removeClass("vd-error "),$(".vd-box",e).removeClass("vd-ok"),$(".vd-btn",e).removeClass("vd-ok"),$(".vd-req",e).removeClass("vd-error"),$(".vd-pattern",e).removeClass("vd-error"),$(".vd-remote",e).removeClass("vd-error"),$(".vd-compare",e).removeClass("vd-error"),$(".vd-dep-btn ",e).removeClass("vd-error"),this.enabled(this.$p.find("input")),this.enabled(this.$p.find("select")),this.enabled(this.$p.find("textarea"))},this.getObjectPropByString=function(e,r){for(var t=(r=r||"").split("."),d=null,s="",a=0,v=t.length;a<v&&void 0!==e[s=t[a]];a++)d=e[s];return d},this.getObjectByString=function(e){for(var r=(e=e||"").split(","),t={},d="",s=0,a=r.length;s<a;s++){var v=r[s].split("=")||[],o=2<=v.length?v[1]:v[0];d=v[0];var i=this.getObj(d);i&&(t[o]=i.val)}return t}}m.vd={create:function(e,r){return new t(e,r)}}}();