!function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=10)}({10:function(e,t){$((function(){var e=$("select#class");e.on({change:function(){var e=$(this).val().split("\\").join("");$("div#settings-"+e).show().siblings().hide()}}),e.trigger("change");var t=$("#name");t.val().length||t.on({keyup:function(){$("#handle").val(function(e){var t=e.replace("/<(.*?)>/g","");t=(t=t.replace(/['"‘’“”[\](){}:]/g,"")).toLowerCase(),t=(t=Craft.asciiString(t)).replace(/^[^a-z]+/,"");var r=Craft.filterArray(t.split(/[^a-z0-9]+/));t="";for(var n=0;n<r.length;n++)t+=0===n?r[n]:r[n].charAt(0).toUpperCase()+r[n].substr(1);return t}($(this).val())).trigger("change")}});var r=$("input.setting-return_uri"),n=$("#integration-type").data("type");$("#handle").on({change:function(){var e=$(this).val(),t=Craft.getCpUrl("freeform/settings/"+n+"/"+e);r.val(t)},keyup:function(){$(this).trigger("change")}});var a=$("#auth-checker"),o=$(".pending-status-check",a),i=o.data("id"),u=o.data("type");if(i){var c={id:i};c[Craft.csrfTokenName]=Craft.csrfTokenValue,$.ajax({url:Craft.getCpUrl("freeform/"+u+"/check"),data:c,type:"post",dataType:"json",success:function(e){if(o.hide(),e.success)$(".authorized",a).show();else if($(".not-authorized",a).show(),e.errors){var t=e.errors;"string"!=typeof t&&(t=t.join(". ")),$(".not-authorized .errors",a).empty().text(t)}}})}}))}});