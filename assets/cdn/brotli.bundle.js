(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

    /**[ツ]	brotli-experiments 0.0.1
        @url		http://github.com/replete/brotli-experiments
        @author		Phil Ricketts <phil@replete.nu> @replete
        @license	Unlicense
    */
    var text = document.getElementById('text');
    var timing = document.getElementById('timing');
    
    function logXHR(t){
        var load = 'load time: ' +  (t.xhrFinish - t.xhrStart) + 'ms'
        var decompress = 'decompress time: ' +  (t.decompressFinish - t.decompressFinish) + 'ms'
        console.log(load);
        console.log(decompress);
        timing.textContent = load + '\n' + decompress;
    }
    
    function getAndDecompressBrotliText(filename,length) {
    
        var decompress = require('brotli/decompress');
    
        var t={};
    
        t.xhrStart = window.performance.now();
        var oReq = new XMLHttpRequest();
        oReq.open("GET", filename);
        oReq.overrideMimeType("text/plain; charset=x-user-defined");
        oReq.responseType = 'arraybuffer';
        oReq.onload = function(e) {
    
            t.xhrFinish = window.performance.now();
    
            var arrayBuffer = this.response;
            var responseArray = new Uint8Array(arrayBuffer);
    
            t.decompressStart = window.performance.now();
            var decompressedBuffer = decompress(responseArray, length).buffer;
            t.decompressFinish = window.performance.now();
    
            var dataView = new DataView(decompressedBuffer);
            var decoder = new TextDecoder();
    
            logXHR(t);
    
            text.textContent = decoder.decode(dataView);
        }
        oReq.send();
    }
    
    function clicky(e){
        var target = e.target;
        var load = target.getAttribute('data-load').split(',') || '';
        load[0] = load[0].replace(/\'/g,"");
        load[1] = parseInt(load[1],10);
    
        if (load) {
            getAndDecompressBrotliText(load[0],load[1]);
        }
    }
    var buttons = document.getElementsByTagName('button');
    
    for (var i=0, button; button = buttons[i]; i++) {
        button.addEventListener('click',clicky, true);
    
    }
    },{"brotli/decompress":4}],2:[function(require,module,exports){
    var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    ;(function (exports) {
        'use strict';
    
      var Arr = (typeof Uint8Array !== 'undefined')
        ? Uint8Array
        : Array
    
        var PLUS   = '+'.charCodeAt(0)
        var SLASH  = '/'.charCodeAt(0)
        var NUMBER = '0'.charCodeAt(0)
        var LOWER  = 'a'.charCodeAt(0)
        var UPPER  = 'A'.charCodeAt(0)
        var PLUS_URL_SAFE = '-'.charCodeAt(0)
        var SLASH_URL_SAFE = '_'.charCodeAt(0)
    
        function decode (elt) {
            var code = elt.charCodeAt(0)
            if (code === PLUS ||
                code === PLUS_URL_SAFE)
                return 62 // '+'
            if (code === SLASH ||
                code === SLASH_URL_SAFE)
                return 63 // '/'
            if (code < NUMBER)
                return -1 //no match
            if (code < NUMBER + 10)
                return code - NUMBER + 26 + 26
            if (code < UPPER + 26)
                return code - UPPER
            if (code < LOWER + 26)
                return code - LOWER + 26
        }
    
        function b64ToByteArray (b64) {
            var i, j, l, tmp, placeHolders, arr
    
            if (b64.length % 4 > 0) {
                throw new Error('Invalid string. Length must be a multiple of 4')
            }
    
            // the number of equal signs (place holders)
            // if there are two placeholders, than the two characters before it
            // represent one byte
            // if there is only one, then the three characters before it represent 2 bytes
            // this is just a cheap hack to not do indexOf twice
            var len = b64.length
            placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
    
            // base64 is 4/3 + up to two characters of the original data
            arr = new Arr(b64.length * 3 / 4 - placeHolders)
    
            // if there are placeholders, only get up to the last complete 4 chars
            l = placeHolders > 0 ? b64.length - 4 : b64.length
    
            var L = 0
    
            function push (v) {
                arr[L++] = v
            }
    
            for (i = 0, j = 0; i < l; i += 4, j += 3) {
                tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
                push((tmp & 0xFF0000) >> 16)
                push((tmp & 0xFF00) >> 8)
                push(tmp & 0xFF)
            }
    
            if (placeHolders === 2) {
                tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
                push(tmp & 0xFF)
            } else if (placeHolders === 1) {
                tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
                push((tmp >> 8) & 0xFF)
                push(tmp & 0xFF)
            }
    
            return arr
        }
    
        function uint8ToBase64 (uint8) {
            var i,
                extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
                output = "",
                temp, length
    
            function encode (num) {
                return lookup.charAt(num)
            }
    
            function tripletToBase64 (num) {
                return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
            }
    
            // go through the array every three bytes, we'll deal with trailing stuff later
            for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
                temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
                output += tripletToBase64(temp)
            }
    
            // pad the end with zeros, but make sure to not forget the extra bytes
            switch (extraBytes) {
                case 1:
                    temp = uint8[uint8.length - 1]
                    output += encode(temp >> 2)
                    output += encode((temp << 4) & 0x3F)
                    output += '=='
                    break
                case 2:
                    temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
                    output += encode(temp >> 10)
                    output += encode((temp >> 4) & 0x3F)
                    output += encode((temp << 2) & 0x3F)
                    output += '='
                    break
            }
    
            return output
        }
    
        exports.toByteArray = b64ToByteArray
        exports.fromByteArray = uint8ToBase64
    }(typeof exports === 'undefined' ? (this.base64js = {}) : exports))
    
    },{}],3:[function(require,module,exports){
    (function (process,__dirname){
    function e(a){throw a;}var j=void 0,m=!0,p=null,s=!1,t,v={};v.readBinary=require("../src/read_memory");v||(v=eval("(function() { try { return Module || {} } catch(e) { return {} } })()"));var aa={},w;for(w in v)v.hasOwnProperty(w)&&(aa[w]=v[w]);var ba="object"===typeof process&&"function"===typeof require,ca="object"===typeof window,da="function"===typeof importScripts,ea=!ca&&!ba&&!da;
    if(ba){v.print||(v.print=function(a){process.stdout.write(a+"\n")});v.printErr||(v.printErr=function(a){process.stderr.write(a+"\n")});var fa=require("fs"),ga=require("path");v.read=function(a,c){var a=ga.normalize(a),b=fa.readFileSync(a);!b&&a!=ga.resolve(a)&&(a=path.join(__dirname,"..","src",a),b=fa.readFileSync(a));b&&!c&&(b=b.toString());return b};v.readBinary=function(a){return v.read(a,m)};v.load=function(a){ha(read(a))};v.thisProgram=process.argv[1].replace(/\\/g,"/");v.arguments=process.argv.slice(2);
    "undefined"!==typeof module&&(module.exports=v);process.on("uncaughtException",function(a){a instanceof ia||e(a)})}else ea?(v.print||(v.print=print),"undefined"!=typeof printErr&&(v.printErr=printErr),v.read="undefined"!=typeof read?read:function(){e("no read() available (jsc?)")},v.readBinary=function(a){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(a));a=read(a,"binary");y("object"===typeof a);return a},"undefined"!=typeof scriptArgs?v.arguments=scriptArgs:"undefined"!=typeof arguments&&
    (v.arguments=arguments),this.Module=v,eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined")):ca||da?(v.read=function(a){var c=new XMLHttpRequest;c.open("GET",a,s);c.send(p);return c.responseText},"undefined"!=typeof arguments&&(v.arguments=arguments),"undefined"!==typeof console?(v.print||(v.print=function(a){console.log(a)}),v.printErr||(v.printErr=function(a){console.log(a)})):v.print||(v.print=function(){}),ca?window.Module=v:v.load=importScripts):
    e("Unknown runtime environment. Where are we?");function ha(a){eval.call(p,a)}!v.load&&v.read&&(v.load=function(a){ha(v.read(a))});v.print||(v.print=function(){});v.printErr||(v.printErr=v.print);v.arguments||(v.arguments=[]);v.thisProgram||(v.thisProgram="./this.program");v.print=v.print;v.K=v.printErr;v.preRun=[];v.postRun=[];for(w in aa)aa.hasOwnProperty(w)&&(v[w]=aa[w]);
    var B={Ya:function(a){ja=a},Na:function(){return ja},T:function(){return A},ga:function(a){A=a},ua:function(a){switch(a){case "i1":case "i8":return 1;case "i16":return 2;case "i32":return 4;case "i64":return 8;case "float":return 4;case "double":return 8;default:return"*"===a[a.length-1]?B.V:"i"===a[0]?(a=parseInt(a.substr(1)),y(0===a%8),a/8):0}},ta:function(a){return Math.max(B.ua(a),B.V)},bb:16,rb:function(a,c,b){return!b&&("i64"==a||"double"==a)?8:!a?Math.min(c,8):Math.min(c||(a?B.ta(a):0),B.V)},
    ca:function(a,c,b){return b&&b.length?(b.splice||(b=Array.prototype.slice.call(b)),b.splice(0,0,c),v["dynCall_"+a].apply(p,b)):v["dynCall_"+a].call(p,c)},R:[],Ea:function(a){for(var c=0;c<B.R.length;c++)if(!B.R[c])return B.R[c]=a,2*(1+c);e("Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.")},Xa:function(a){B.R[(a-2)/2]=p},sb:function(a,c){B.$||(B.$={});var b=B.$[a];if(b)return b;for(var b=[],d=0;d<c;d++)b.push(String.fromCharCode(36)+d);d=E(a);'"'===d[0]&&
    (d.indexOf('"',1)===d.length-1?d=d.substr(1,d.length-2):F("invalid EM_ASM input |"+d+"|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)"));try{var f=eval("(function(Module, FS) { return function("+b.join(",")+"){ "+d+" } })")(v,"undefined"!==typeof G?G:p)}catch(g){v.K("error in executing inline EM_ASM code: "+g+" on: \n\n"+d+"\n\nwith args |"+b+"| (make sure to use the right one out of EM_ASM, EM_ASM_ARGS, etc.)"),e(g)}return B.$[a]=f},N:function(a){B.N.ea||
    (B.N.ea={});B.N.ea[a]||(B.N.ea[a]=1,v.K(a))},da:{},ub:function(a,c){y(c);B.da[c]||(B.da[c]={});var b=B.da[c];b[a]||(b[a]=function(){return B.ca(c,a,arguments)});return b[a]},na:function(){var a=[],c=0;this.Ua=function(b){b&=255;if(0==a.length){if(0==(b&128))return String.fromCharCode(b);a.push(b);c=192==(b&224)?1:224==(b&240)?2:3;return""}if(c&&(a.push(b),c--,0<c))return"";var b=a[0],d=a[1],f=a[2],g=a[3];2==a.length?b=String.fromCharCode((b&31)<<6|d&63):3==a.length?b=String.fromCharCode((b&15)<<12|
    (d&63)<<6|f&63):(b=(b&7)<<18|(d&63)<<12|(f&63)<<6|g&63,b=String.fromCharCode(((b-65536)/1024|0)+55296,(b-65536)%1024+56320));a.length=0;return b};this.Va=function(a){for(var a=unescape(encodeURIComponent(a)),c=[],f=0;f<a.length;f++)c.push(a.charCodeAt(f));return c}},tb:function(){e("You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work")},S:function(a){var c=A;A=A+a|0;A=A+15&-16;return c},za:function(a){var c=H;H=H+a|0;H=H+15&-16;
    return c},Q:function(a){var c=I;I=I+a|0;I=I+15&-16;I>=J&&F("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value "+J+", (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.");return c},O:function(a,c){return Math.ceil(a/(c?c:16))*(c?c:16)},Ra:function(a,c,b){return b?+(a>>>0)+4294967296*+(c>>>0):+(a>>>0)+4294967296*+(c|0)},ab:8,V:4,gb:0};
    v.Runtime=B;B.addFunction=B.Ea;B.removeFunction=B.Xa;var ka=s,la,ma,ja;function y(a,c){a||F("Assertion failed: "+c)}function na(a){var c=v["_"+a];if(!c)try{c=eval("_"+a)}catch(b){}y(c,"Cannot call unknown function "+a+" (perhaps LLVM optimizations or closure removed it?)");return c}var oa,pa;
    (function(){function a(a){a=a.toString().match(f).slice(1);return{arguments:a[0],body:a[1],returnValue:a[2]}}var c=0,b={stackSave:function(){c=B.T()},stackRestore:function(){B.ga(c)},arrayToC:function(a){var b=B.S(a.length);qa(a,b);return b},stringToC:function(a){var b=0;a!==p&&(a!==j&&0!==a)&&(b=B.S((a.length<<2)+1),ra(a,b));return b}},d={string:b.stringToC,array:b.arrayToC};pa=function(a,g,f,i){var a=na(a),n=[];if(i)for(var u=0;u<i.length;u++){var C=d[f[u]];C?(0===c&&(c=B.T()),n[u]=C(i[u])):n[u]=
    i[u]}f=a.apply(p,n);"string"===g&&(f=E(f));0!==c&&b.stackRestore();return f};var f=/^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/,g={},i;for(i in b)b.hasOwnProperty(i)&&(g[i]=a(b[i]));oa=function(b,c,d){var d=d||[],f=na(b),b=d.every(function(a){return"number"===a}),i="string"!==c;if(i&&b)return f;var u=d.map(function(a,b){return"$"+b}),c="(function("+u.join(",")+") {",C=d.length;if(!b)for(var c=c+(g.stackSave.body+";"),D=0;D<C;D++){var N=u[D],z=d[D];"number"!==z&&(z=g[z+
    "ToC"],c+="var "+z.arguments+" = "+N+";",c+=z.body+";",c+=N+"="+z.returnValue+";")}d=a(function(){return f}).returnValue;c+="var ret = "+d+"("+u.join(",")+");";i||(d=a(function(){return E}).returnValue,c+="ret = "+d+"(ret);");b||(c+=g.stackRestore.body+";");return eval(c+"return ret})")}})();v.cwrap=oa;v.ccall=pa;
    function sa(a,c,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":L[a>>0]=c;break;case "i8":L[a>>0]=c;break;case "i16":ta[a>>1]=c;break;case "i32":M[a>>2]=c;break;case "i64":ma=[c>>>0,(la=c,1<=+ua(la)?0<la?(va(+wa(la/4294967296),4294967295)|0)>>>0:~~+xa((la-+(~~la>>>0))/4294967296)>>>0:0)];M[a>>2]=ma[0];M[a+4>>2]=ma[1];break;case "float":ya[a>>2]=c;break;case "double":za[a>>3]=c;break;default:F("invalid type for setValue: "+b)}}v.setValue=sa;
    function Aa(a,c){c=c||"i8";"*"===c.charAt(c.length-1)&&(c="i32");switch(c){case "i1":return L[a>>0];case "i8":return L[a>>0];case "i16":return ta[a>>1];case "i32":return M[a>>2];case "i64":return M[a>>2];case "float":return ya[a>>2];case "double":return za[a>>3];default:F("invalid type for setValue: "+c)}return p}v.getValue=Aa;var Ba=2,Ca=4;v.ALLOC_NORMAL=0;v.ALLOC_STACK=1;v.ALLOC_STATIC=Ba;v.ALLOC_DYNAMIC=3;v.ALLOC_NONE=Ca;
    function O(a,c,b,d){var f,g;"number"===typeof a?(f=m,g=a):(f=s,g=a.length);var i="string"===typeof c?c:p,b=b==Ca?d:[Da,B.S,B.za,B.Q][b===j?Ba:b](Math.max(g,i?1:c.length));if(f){d=b;y(0==(b&3));for(a=b+(g&-4);d<a;d+=4)M[d>>2]=0;for(a=b+g;d<a;)L[d++>>0]=0;return b}if("i8"===i)return a.subarray||a.slice?P.set(a,b):P.set(new Uint8Array(a),b),b;for(var d=0,h,l;d<g;){var r=a[d];"function"===typeof r&&(r=B.vb(r));f=i||c[d];0===f?d++:("i64"==f&&(f="i32"),sa(b+d,r,f),l!==f&&(h=B.ua(f),l=f),d+=h)}return b}
    v.allocate=O;function E(a,c){for(var b=s,d,f=0;;){d=P[a+f>>0];if(128<=d)b=m;else if(0==d&&!c)break;f++;if(c&&f==c)break}c||(c=f);var g="";if(!b){for(;0<c;)d=String.fromCharCode.apply(String,P.subarray(a,a+Math.min(c,1024))),g=g?g+d:d,a+=1024,c-=1024;return g}b=new B.na;for(f=0;f<c;f++)d=P[a+f>>0],g+=b.Ua(d);return g}v.Pointer_stringify=E;v.UTF16ToString=function(a){for(var c=0,b="";;){var d=ta[a+2*c>>1];if(0==d)return b;++c;b+=String.fromCharCode(d)}};
    v.stringToUTF16=function(a,c){for(var b=0;b<a.length;++b)ta[c+2*b>>1]=a.charCodeAt(b);ta[c+2*a.length>>1]=0};v.UTF32ToString=function(a){for(var c=0,b="";;){var d=M[a+4*c>>2];if(0==d)return b;++c;65536<=d?(d-=65536,b+=String.fromCharCode(55296|d>>10,56320|d&1023)):b+=String.fromCharCode(d)}};v.stringToUTF32=function(a,c){for(var b=0,d=0;d<a.length;++d){var f=a.charCodeAt(d);if(55296<=f&&57343>=f)var g=a.charCodeAt(++d),f=65536+((f&1023)<<10)|g&1023;M[c+4*b>>2]=f;++b}M[c+4*b>>2]=0};
    function Ea(a){function c(b,d,g){var d=d||Infinity,f="",i=[],q;if("N"===a[h]){h++;"K"===a[h]&&h++;for(q=[];"E"!==a[h];)if("S"===a[h]){h++;var n=a.indexOf("_",h);q.push(r[a.substring(h,n)||0]||"?");h=n+1}else if("C"===a[h])q.push(q[q.length-1]),h+=2;else{var n=parseInt(a.substr(h)),k=n.toString().length;if(!n||!k){h--;break}var W=a.substr(h+k,n);q.push(W);r.push(W);h+=k+n}h++;q=q.join("::");d--;if(0===d)return b?[q]:q}else if(("K"===a[h]||x&&"L"===a[h])&&h++,n=parseInt(a.substr(h)))k=n.toString().length,
    q=a.substr(h+k,n),h+=k+n;x=s;"I"===a[h]?(h++,n=c(m),k=c(m,1,m),f+=k[0]+" "+q+"<"+n.join(", ")+">"):f=q;a:for(;h<a.length&&0<d--;)if(q=a[h++],q in l)i.push(l[q]);else switch(q){case "P":i.push(c(m,1,m)[0]+"*");break;case "R":i.push(c(m,1,m)[0]+"&");break;case "L":h++;n=a.indexOf("E",h)-h;i.push(a.substr(h,n));h+=n+2;break;case "A":n=parseInt(a.substr(h));h+=n.toString().length;"_"!==a[h]&&e("?");h++;i.push(c(m,1,m)[0]+" ["+n+"]");break;case "E":break a;default:f+="?"+q;break a}!g&&(1===i.length&&"void"===
    i[0])&&(i=[]);return b?(f&&i.push(f+"?"),i):f+("("+i.join(", ")+")")}var b=!!v.___cxa_demangle;if(b)try{var d=Da(a.length);ra(a.substr(1),d);var f=Da(4),g=v.___cxa_demangle(d,0,0,f);if(0===Aa(f,"i32")&&g)return E(g)}catch(i){}finally{d&&Fa(d),f&&Fa(f),g&&Fa(g)}var h=3,l={v:"void",b:"bool",c:"char",s:"short",i:"int",l:"long",f:"float",d:"double",w:"wchar_t",a:"signed char",h:"unsigned char",t:"unsigned short",j:"unsigned int",m:"unsigned long",x:"long long",y:"unsigned long long",z:"..."},r=[],x=m,
    d=a;try{if("Object._main"==a||"_main"==a)return"main()";"number"===typeof a&&(a=E(a));if("_"!==a[0]||"_"!==a[1]||"Z"!==a[2])return a;switch(a[3]){case "n":return"operator new()";case "d":return"operator delete()"}d=c()}catch(n){d+="?"}0<=d.indexOf("?")&&!b&&B.N("warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");return d}
    function Ga(){var a;a:{a=Error();if(!a.stack){try{e(Error(0))}catch(c){a=c}if(!a.stack){a="(no stack trace available)";break a}}a=a.stack.toString()}return a.replace(/__Z[\w\d_]+/g,function(a){var c=Ea(a);return a===c?a:a+" ["+c+"]"})}v.stackTrace=function(){return Ga()};for(var L,P,ta,Ha,M,Ia,ya,za,Ja=0,H=0,Ka=0,A=0,La=0,Ma=0,I=0,Na=v.TOTAL_STACK||5242880,J=v.TOTAL_MEMORY||318767104,Q=65536;Q<J||Q<2*Na;)Q=16777216>Q?2*Q:Q+16777216;
    Q!==J&&(v.K("increasing TOTAL_MEMORY to "+Q+" to be more reasonable"),J=Q);y("undefined"!==typeof Int32Array&&"undefined"!==typeof Float64Array&&!!(new Int32Array(1)).subarray&&!!(new Int32Array(1)).set,"JS engine does not provide full typed array support");var R=new ArrayBuffer(J);L=new Int8Array(R);ta=new Int16Array(R);M=new Int32Array(R);P=new Uint8Array(R);Ha=new Uint16Array(R);Ia=new Uint32Array(R);ya=new Float32Array(R);za=new Float64Array(R);M[0]=255;y(255===P[0]&&0===P[3],"Typed arrays 2 must be run on a little-endian system");
    v.HEAP=j;v.HEAP8=L;v.HEAP16=ta;v.HEAP32=M;v.HEAPU8=P;v.HEAPU16=Ha;v.HEAPU32=Ia;v.HEAPF32=ya;v.HEAPF64=za;function Oa(a){for(;0<a.length;){var c=a.shift();if("function"==typeof c)c();else{var b=c.qb;"number"===typeof b?c.Z===j?B.ca("v",b):B.ca("vi",b,[c.Z]):b(c.Z===j?p:c.Z)}}}var Pa=[],Qa=[],Ra=[],Sa=[],Ta=[],Ua=s;function Va(a){Pa.unshift(a)}v.addOnPreRun=v.lb=Va;v.addOnInit=v.ib=function(a){Qa.unshift(a)};v.addOnPreMain=v.kb=function(a){Ra.unshift(a)};v.addOnExit=v.hb=function(a){Sa.unshift(a)};
    function Wa(a){Ta.unshift(a)}v.addOnPostRun=v.jb=Wa;function Xa(a,c,b){a=(new B.na).Va(a);b&&(a.length=b);c||a.push(0);return a}v.intArrayFromString=Xa;function Ya(a){for(var c=[],b=0;b<a.length;b++){var d=a[b];255<d&&(d&=255);c.push(String.fromCharCode(d))}return c.join("")}v.intArrayToString=Ya;function ra(a,c,b){a=Xa(a,b);for(b=0;b<a.length;)L[c+b>>0]=a[b],b+=1}v.writeStringToMemory=ra;function qa(a,c){for(var b=0;b<a.length;b++)L[c+b>>0]=a[b]}v.writeArrayToMemory=qa;
    v.writeAsciiToMemory=function(a,c,b){for(var d=0;d<a.length;d++)L[c+d>>0]=a.charCodeAt(d);b||(L[c+a.length>>0]=0)};function Za(a,c){return 0<=a?a:32>=c?2*Math.abs(1<<c-1)+a:Math.pow(2,c)+a}function $a(a,c){if(0>=a)return a;var b=32>=c?Math.abs(1<<c-1):Math.pow(2,c-1);if(a>=b&&(32>=c||a>b))a=-2*b+a;return a}if(!Math.imul||-5!==Math.imul(4294967295,5))Math.imul=function(a,c){var b=a&65535,d=c&65535;return b*d+((a>>>16)*d+b*(c>>>16)<<16)|0};Math.xb=Math.imul;
    var ua=Math.abs,xa=Math.ceil,wa=Math.floor,va=Math.min,S=0,ab=p,bb=p;function cb(){S++;v.monitorRunDependencies&&v.monitorRunDependencies(S)}v.addRunDependency=cb;function db(){S--;v.monitorRunDependencies&&v.monitorRunDependencies(S);if(0==S&&(ab!==p&&(clearInterval(ab),ab=p),bb)){var a=bb;bb=p;a()}}v.removeRunDependency=db;v.preloadedImages={};v.preloadedAudios={};var T=p,Ja=8,H=Ja+B.O(128835);Qa.push();var T="decode.js.mem",U=B.O(O(12,"i8",Ba),8);y(0==U%8);var G=j,eb=0;
    function fb(a){return M[eb>>2]=a}var gb=9;function hb(a,c,b){a=G.La(a);if(!a)return fb(gb),-1;try{return G.write(a,L,c,b)}catch(d){return G.Qa(d),-1}}function ib(a){a=G.Ma(a);return!a?-1:a.pb}function jb(a,c,b,d){b*=c;if(0==b)return 0;var f=ib(d),a=hb(f,a,b);if(-1==a){if(c=G.Ma(d))c.error=m;return 0}return a/c|0}v._strlen=kb;function lb(a){return 0>a||0===a&&-Infinity===1/a}
    function mb(a,c){function b(a){var b;"double"===a?b=(M[U>>2]=M[c+f>>2],M[U+4>>2]=M[c+(f+4)>>2],+za[U>>3]):"i64"==a?b=[M[c+f>>2],M[c+(f+4)>>2]]:(a="i32",b=M[c+f>>2]);f+=B.ta(a);return b}for(var d=a,f=0,g=[],i,h;;){var l=d;i=L[d>>0];if(0===i)break;h=L[d+1>>0];if(37==i){var r=s,x=s,n=s,u=s,C=s;a:for(;;){switch(h){case 43:r=m;break;case 45:x=m;break;case 35:n=m;break;case 48:if(u)break a;else{u=m;break}case 32:C=m;break;default:break a}d++;h=L[d+1>>0]}var D=0;if(42==h)D=b("i32"),d++,h=L[d+1>>0];else for(;48<=
    h&&57>=h;)D=10*D+(h-48),d++,h=L[d+1>>0];var N=s,z=-1;if(46==h){z=0;N=m;d++;h=L[d+1>>0];if(42==h)z=b("i32"),d++;else for(;;){h=L[d+1>>0];if(48>h||57<h)break;z=10*z+(h-48);d++}h=L[d+1>>0]}0>z&&(z=6,N=s);var q;switch(String.fromCharCode(h)){case "h":h=L[d+2>>0];104==h?(d++,q=1):q=2;break;case "l":h=L[d+2>>0];108==h?(d++,q=8):q=4;break;case "L":case "q":case "j":q=8;break;case "z":case "t":case "I":q=4;break;default:q=p}q&&d++;h=L[d+1>>0];switch(String.fromCharCode(h)){case "d":case "i":case "u":case "o":case "x":case "X":case "p":l=
    100==h||105==h;q=q||4;var K=i=b("i"+8*q),k;8==q&&(i=B.Ra(i[0],i[1],117==h));4>=q&&(i=(l?$a:Za)(i&Math.pow(256,q)-1,8*q));var W=Math.abs(i),l="";if(100==h||105==h)k=8==q&&nb?nb.stringify(K[0],K[1],p):$a(i,8*q).toString(10);else if(117==h)k=8==q&&nb?nb.stringify(K[0],K[1],m):Za(i,8*q).toString(10),i=Math.abs(i);else if(111==h)k=(n?"0":"")+W.toString(8);else if(120==h||88==h){l=n&&0!=i?"0x":"";if(8==q&&nb)if(K[1]){k=(K[1]>>>0).toString(16);for(n=(K[0]>>>0).toString(16);8>n.length;)n="0"+n;k+=n}else k=
    (K[0]>>>0).toString(16);else if(0>i){i=-i;k=(W-1).toString(16);K=[];for(n=0;n<k.length;n++)K.push((15-parseInt(k[n],16)).toString(16));for(k=K.join("");k.length<2*q;)k="f"+k}else k=W.toString(16);88==h&&(l=l.toUpperCase(),k=k.toUpperCase())}else 112==h&&(0===W?k="(nil)":(l="0x",k=W.toString(16)));if(N)for(;k.length<z;)k="0"+k;0<=i&&(r?l="+"+l:C&&(l=" "+l));"-"==k.charAt(0)&&(l="-"+l,k=k.substr(1));for(;l.length+k.length<D;)x?k+=" ":u?k="0"+k:l=" "+l;k=l+k;k.split("").forEach(function(a){g.push(a.charCodeAt(0))});
    break;case "f":case "F":case "e":case "E":case "g":case "G":i=b("double");if(isNaN(i))k="nan",u=s;else if(isFinite(i)){N=s;q=Math.min(z,20);if(103==h||71==h)N=m,z=z||1,q=parseInt(i.toExponential(q).split("e")[1],10),z>q&&-4<=q?(h=(103==h?"f":"F").charCodeAt(0),z-=q+1):(h=(103==h?"e":"E").charCodeAt(0),z--),q=Math.min(z,20);if(101==h||69==h)k=i.toExponential(q),/[eE][-+]\d$/.test(k)&&(k=k.slice(0,-1)+"0"+k.slice(-1));else if(102==h||70==h)k=i.toFixed(q),0===i&&lb(i)&&(k="-"+k);l=k.split("e");if(N&&
    !n)for(;1<l[0].length&&-1!=l[0].indexOf(".")&&("0"==l[0].slice(-1)||"."==l[0].slice(-1));)l[0]=l[0].slice(0,-1);else for(n&&-1==k.indexOf(".")&&(l[0]+=".");z>q++;)l[0]+="0";k=l[0]+(1<l.length?"e"+l[1]:"");69==h&&(k=k.toUpperCase());0<=i&&(r?k="+"+k:C&&(k=" "+k))}else k=(0>i?"-":"")+"inf",u=s;for(;k.length<D;)k=x?k+" ":u&&("-"==k[0]||"+"==k[0])?k[0]+"0"+k.slice(1):(u?"0":" ")+k;97>h&&(k=k.toUpperCase());k.split("").forEach(function(a){g.push(a.charCodeAt(0))});break;case "s":u=(r=b("i8*"))?kb(r):6;
    N&&(u=Math.min(u,z));if(!x)for(;u<D--;)g.push(32);if(r)for(n=0;n<u;n++)g.push(P[r++>>0]);else g=g.concat(Xa("(null)".substr(0,u),m));if(x)for(;u<D--;)g.push(32);break;case "c":for(x&&g.push(b("i8"));0<--D;)g.push(32);x||g.push(b("i8"));break;case "n":x=b("i32*");M[x>>2]=g.length;break;case "%":g.push(i);break;default:for(n=l;n<d+2;n++)g.push(L[n>>0])}d+=2}else g.push(i),d+=1}return g}
    function ob(a){ob.Ga||(I=I+4095&-4096,ob.Ga=m,y(B.Q),ob.Fa=B.Q,B.Q=function(){F("cannot dynamically allocate, sbrk now has control")});var c=I;0!=a&&ob.Fa(a);return c}v._memset=pb;v._bitshift64Lshr=qb;v._bitshift64Shl=rb;v._memcpy=sb;eb=B.za(4);M[eb>>2]=0;Ka=A=B.O(H);La=Ka+Na;Ma=I=B.O(La);y(Ma<J,"TOTAL_MEMORY not big enough for stack");
    var tb=O([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0],"i8",3),ub=O([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,
    0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0],"i8",3),va=Math.min;
    var V=(function(global,env,buffer) {
    // EMSCRIPTEN_START_ASM
    "use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=env.ctlz_i8|0;var o=0;var p=0;var q=0;var r=0;var s=+env.NaN,t=+env.Infinity;var u=0,v=0,w=0,x=0,y=0.0,z=0,A=0,B=0,C=0.0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=global.Math.floor;var O=global.Math.abs;var P=global.Math.sqrt;var Q=global.Math.pow;var R=global.Math.cos;var S=global.Math.sin;var T=global.Math.tan;var U=global.Math.acos;var V=global.Math.asin;var W=global.Math.atan;var X=global.Math.atan2;var Y=global.Math.exp;var Z=global.Math.log;var _=global.Math.ceil;var $=global.Math.imul;var aa=env.abort;var ba=env.assert;var ca=env.min;var da=env.invoke_iiii;var ea=env._sysconf;var fa=env.__formatString;var ga=env._time;var ha=env._send;var ia=env._pwrite;var ja=env._abort;var ka=env.___setErrNo;var la=env._fwrite;var ma=env._sbrk;var na=env._printf;var oa=env._fprintf;var pa=env.__reallyNegative;var qa=env._emscripten_memcpy_big;var ra=env._fileno;var sa=env._write;var ta=env.___assert_fail;var ua=env.___errno_location;var va=0.0;
    // EMSCRIPTEN_START_FUNCS
    function xa(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+15&-16;return b|0}function ya(){return i|0}function za(a){a=a|0;i=a}function Aa(a,b){a=a|0;b=b|0;if((o|0)==0){o=a;p=b}}function Ba(b){b=b|0;a[k>>0]=a[b>>0];a[k+1>>0]=a[b+1>>0];a[k+2>>0]=a[b+2>>0];a[k+3>>0]=a[b+3>>0]}function Ca(b){b=b|0;a[k>>0]=a[b>>0];a[k+1>>0]=a[b+1>>0];a[k+2>>0]=a[b+2>>0];a[k+3>>0]=a[b+3>>0];a[k+4>>0]=a[b+4>>0];a[k+5>>0]=a[b+5>>0];a[k+6>>0]=a[b+6>>0];a[k+7>>0]=a[b+7>>0]}function Da(a){a=a|0;D=a}function Ea(){return D|0}function Fa(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;i=i+32|0;g=f+16|0;l=f+12|0;k=f+8|0;h=f+4|0;j=f;c[l>>2]=a;c[k>>2]=b;c[h>>2]=d;c[j>>2]=e;if((Qa(c[l>>2]|0,c[k>>2]|0,h,c[j>>2]|0)|0)!=0){c[g>>2]=c[h>>2];l=c[g>>2]|0;i=f;return l|0}else{c[g>>2]=-1;l=c[g>>2]|0;i=f;return l|0}return 0}function Ga(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0;f=i;i=i+16|0;e=f+8|0;h=f+4|0;g=f;c[h>>2]=a;if((c[h>>2]|0)==0)ta(8,24,29,56);c[(c[h>>2]|0)+8224>>2]=c[h>>2];a=(c[h>>2]|0)+8228|0;c[a+0>>2]=c[b+0>>2];c[a+4>>2]=c[b+4>>2];a=(c[h>>2]|0)+8240|0;c[a>>2]=0;c[a+4>>2]=0;c[(c[h>>2]|0)+8248>>2]=0;c[(c[h>>2]|0)+8252>>2]=0;c[(c[h>>2]|0)+8256>>2]=0;c[(c[h>>2]|0)+8260>>2]=0;if((Ha(c[h>>2]|0)|0)==0){c[e>>2]=0;a=c[e>>2]|0;i=f;return a|0}c[g>>2]=0;while(1){b=c[h>>2]|0;if(!((c[g>>2]|0)>>>0<8))break;j=zb(d[(c[h>>2]|0)+(c[b+8248>>2]|0)>>0]|0|0,0,c[g>>2]<<3|0)|0;a=(c[h>>2]|0)+8240|0;k=a;b=c[k+4>>2]|D;c[a>>2]=c[k>>2]|j;c[a+4>>2]=b;a=(c[h>>2]|0)+8248|0;c[a>>2]=(c[a>>2]|0)+1;c[g>>2]=(c[g>>2]|0)+1}c[e>>2]=(c[b+8256>>2]|0)>>>0>0&1;k=c[e>>2]|0;i=f;return k|0}function Ha(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;g=i;i=i+32|0;j=g+16|0;e=g+12|0;f=g+8|0;h=g+4|0;d=g;c[f>>2]=b;if((c[(c[f>>2]|0)+8256>>2]|0)>>>0>256){c[e>>2]=1;b=c[e>>2]|0;i=g;return b|0}b=c[f>>2]|0;if((c[(c[f>>2]|0)+8260>>2]|0)!=0){c[e>>2]=(c[b+8252>>2]|0)>>>0<=(c[(c[f>>2]|0)+8256>>2]|0)>>>0&1;b=c[e>>2]|0;i=g;return b|0}c[h>>2]=c[b+8224>>2];k=(c[f>>2]|0)+8228|0;b=c[h>>2]|0;c[j+0>>2]=c[k+0>>2];c[j+4>>2]=c[k+4>>2];c[d>>2]=Ia(j,b,4096)|0;if((c[d>>2]|0)<0){c[e>>2]=0;k=c[e>>2]|0;i=g;return k|0}if((c[d>>2]|0)<4096){c[(c[f>>2]|0)+8260>>2]=1;b=(c[h>>2]|0)+(c[d>>2]|0)+0|0;j=b+32|0;do{a[b>>0]=0;b=b+1|0}while((b|0)<(j|0))}j=c[f>>2]|0;if((c[h>>2]|0)==(c[f>>2]|0)){b=j+8192|0;h=(c[f>>2]|0)+0|0;j=b+32|0;do{a[b>>0]=a[h>>0]|0;b=b+1|0;h=h+1|0}while((b|0)<(j|0));c[(c[f>>2]|0)+8224>>2]=(c[f>>2]|0)+4096}else c[(c[f>>2]|0)+8224>>2]=j;k=(c[f>>2]|0)+8256|0;c[k>>2]=(c[k>>2]|0)+(c[d>>2]<<3);c[e>>2]=1;k=c[e>>2]|0;i=g;return k|0}function Ia(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+16|0;g=e+4|0;f=e;c[g>>2]=b;c[f>>2]=d;b=wa[c[a>>2]&3](c[a+4>>2]|0,c[g>>2]|0,c[f>>2]|0)|0;i=e;return b|0}function Ja(b,d,e,f,g,h){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;s=i;i=i+64|0;q=s+48|0;k=s+36|0;m=s+20|0;x=s+16|0;o=s+32|0;w=s+40|0;r=s+56|0;n=s+8|0;p=s+4|0;l=s+24|0;j=s+12|0;t=s+28|0;u=s;c[m>>2]=d;c[x>>2]=e;c[o>>2]=f;c[w>>2]=g;c[r>>2]=h;c[n>>2]=(c[w>>2]|0)+1;c[p>>2]=(c[o>>2]|0)+(c[n>>2]|0);c[l>>2]=c[x>>2]&c[w>>2];c[j>>2]=c[(c[r>>2]|0)+8248>>2]&8191;if((c[m>>2]|0)>=8?!(((c[(c[r>>2]|0)+8252>>2]|0)+(c[m>>2]<<3)|0)>>>0<(c[(c[r>>2]|0)+8256>>2]|0)>>>0):0){if((c[(c[r>>2]|0)+8256>>2]|0)>>>0<64){c[k>>2]=0;x=c[k>>2]|0;i=s;return x|0}while(1){h=c[r>>2]|0;if(!((c[(c[r>>2]|0)+8252>>2]|0)>>>0<64))break;x=h+8240|0;x=yb(c[x>>2]|0,c[x+4>>2]|0,c[(c[r>>2]|0)+8252>>2]|0)|0;a[(c[o>>2]|0)+(c[l>>2]|0)>>0]=x;x=(c[r>>2]|0)+8252|0;c[x>>2]=(c[x>>2]|0)+8;c[l>>2]=(c[l>>2]|0)+1;c[m>>2]=(c[m>>2]|0)+ -1}c[t>>2]=(c[h+8256>>2]|0)-(c[(c[r>>2]|0)+8252>>2]|0)>>3;if(((c[j>>2]|0)+(c[t>>2]|0)|0)>8191){c[u>>2]=8192-(c[j>>2]|0);Ab((c[o>>2]|0)+(c[l>>2]|0)|0,(c[r>>2]|0)+(c[j>>2]|0)|0,c[u>>2]|0)|0;c[t>>2]=(c[t>>2]|0)-(c[u>>2]|0);c[l>>2]=(c[l>>2]|0)+(c[u>>2]|0);c[m>>2]=(c[m>>2]|0)-(c[u>>2]|0);c[j>>2]=0}Ab((c[o>>2]|0)+(c[l>>2]|0)|0,(c[r>>2]|0)+(c[j>>2]|0)|0,c[t>>2]|0)|0;c[l>>2]=(c[l>>2]|0)+(c[t>>2]|0);c[m>>2]=(c[m>>2]|0)-(c[t>>2]|0);do if((c[l>>2]|0)>=(c[n>>2]|0)){w=c[o>>2]|0;x=c[n>>2]|0;c[q+0>>2]=c[b+0>>2];c[q+4>>2]=c[b+4>>2];x=Ma(q,w,x)|0;if((x|0)>=(c[n>>2]|0)){c[l>>2]=(c[l>>2]|0)-(c[n>>2]|0);Ab(c[o>>2]|0,c[p>>2]|0,c[l>>2]|0)|0;break}c[k>>2]=0;x=c[k>>2]|0;i=s;return x|0}while(0);while(1){if(((c[l>>2]|0)+(c[m>>2]|0)|0)<(c[n>>2]|0))break;c[t>>2]=(c[n>>2]|0)-(c[l>>2]|0);d=(c[r>>2]|0)+8228|0;w=(c[o>>2]|0)+(c[l>>2]|0)|0;x=c[t>>2]|0;c[q+0>>2]=c[d+0>>2];c[q+4>>2]=c[d+4>>2];x=Na(q,w,x)|0;if((x|0)<(c[t>>2]|0)){v=24;break}w=c[o>>2]|0;x=c[n>>2]|0;c[q+0>>2]=c[b+0>>2];c[q+4>>2]=c[b+4>>2];x=Ma(q,w,x)|0;if((x|0)<(c[t>>2]|0)){v=24;break}c[m>>2]=(c[m>>2]|0)-(c[t>>2]|0);c[l>>2]=0}if((v|0)==24){c[k>>2]=0;x=c[k>>2]|0;i=s;return x|0}d=(c[r>>2]|0)+8228|0;w=(c[o>>2]|0)+(c[l>>2]|0)|0;x=c[m>>2]|0;c[q+0>>2]=c[d+0>>2];c[q+4>>2]=c[d+4>>2];x=Na(q,w,x)|0;if((x|0)<(c[m>>2]|0)){c[k>>2]=0;x=c[k>>2]|0;i=s;return x|0}else{x=c[r>>2]|0;w=(c[r>>2]|0)+8228|0;c[q+0>>2]=c[w+0>>2];c[q+4>>2]=c[w+4>>2];Ga(x,q)|0;c[k>>2]=1;x=c[k>>2]|0;i=s;return x|0}}while(1){x=c[m>>2]|0;c[m>>2]=x+ -1;if((x|0)<=0){v=10;break}if((Ka(c[r>>2]|0)|0)==0){v=5;break}w=(La(c[r>>2]|0,8)|0)&255;x=c[l>>2]|0;c[l>>2]=x+1;a[(c[o>>2]|0)+x>>0]=w;if((c[l>>2]|0)!=(c[n>>2]|0))continue;w=c[o>>2]|0;x=c[n>>2]|0;c[q+0>>2]=c[b+0>>2];c[q+4>>2]=c[b+4>>2];x=Ma(q,w,x)|0;if((x|0)<(c[n>>2]|0)){v=8;break}c[l>>2]=0}if((v|0)==5){c[k>>2]=0;x=c[k>>2]|0;i=s;return x|0}else if((v|0)==8){c[k>>2]=0;x=c[k>>2]|0;i=s;return x|0}else if((v|0)==10){c[k>>2]=1;x=c[k>>2]|0;i=s;return x|0}return 0}function Ka(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;g=i;i=i+32|0;j=g+16|0;e=g+12|0;f=g+8|0;h=g+4|0;d=g;c[f>>2]=b;if((c[(c[f>>2]|0)+8256>>2]|0)>>>0>256){c[e>>2]=1;b=c[e>>2]|0;i=g;return b|0}b=c[f>>2]|0;if((c[(c[f>>2]|0)+8260>>2]|0)!=0){c[e>>2]=(c[b+8252>>2]|0)>>>0<=(c[(c[f>>2]|0)+8256>>2]|0)>>>0&1;b=c[e>>2]|0;i=g;return b|0}c[h>>2]=c[b+8224>>2];k=(c[f>>2]|0)+8228|0;b=c[h>>2]|0;c[j+0>>2]=c[k+0>>2];c[j+4>>2]=c[k+4>>2];c[d>>2]=Na(j,b,4096)|0;if((c[d>>2]|0)<0){c[e>>2]=0;k=c[e>>2]|0;i=g;return k|0}if((c[d>>2]|0)<4096){c[(c[f>>2]|0)+8260>>2]=1;b=(c[h>>2]|0)+(c[d>>2]|0)+0|0;j=b+32|0;do{a[b>>0]=0;b=b+1|0}while((b|0)<(j|0))}j=c[f>>2]|0;if((c[h>>2]|0)==(c[f>>2]|0)){b=j+8192|0;h=(c[f>>2]|0)+0|0;j=b+32|0;do{a[b>>0]=a[h>>0]|0;b=b+1|0;h=h+1|0}while((b|0)<(j|0));c[(c[f>>2]|0)+8224>>2]=(c[f>>2]|0)+4096}else c[(c[f>>2]|0)+8224>>2]=j;k=(c[f>>2]|0)+8256|0;c[k>>2]=(c[k>>2]|0)+(c[d>>2]<<3);c[e>>2]=1;k=c[e>>2]|0;i=g;return k|0}function La(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;e=i;i=i+16|0;g=e+8|0;f=e+4|0;d=e;c[g>>2]=a;c[f>>2]=b;db(c[g>>2]|0);a=(c[g>>2]|0)+8240|0;a=yb(c[a>>2]|0,c[a+4>>2]|0,c[(c[g>>2]|0)+8252>>2]|0)|0;c[d>>2]=a&c[128160+(c[f>>2]<<2)>>2];a=(c[g>>2]|0)+8252|0;c[a>>2]=(c[a>>2]|0)+(c[f>>2]|0);i=e;return c[d>>2]|0}function Ma(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+16|0;g=e+4|0;f=e;c[g>>2]=b;c[f>>2]=d;b=wa[c[a>>2]&3](c[a+4>>2]|0,c[g>>2]|0,c[f>>2]|0)|0;i=e;return b|0}function Na(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0;e=i;i=i+16|0;g=e+4|0;f=e;c[g>>2]=b;c[f>>2]=d;b=wa[c[a>>2]&3](c[a+4>>2]|0,c[g>>2]|0,c[f>>2]|0)|0;i=e;return b|0}function Oa(a){a=a|0;var b=0,d=0,e=0;b=i;i=i+16|0;d=b+4|0;e=b;c[e>>2]=a;if((La(c[e>>2]|0,1)|0)!=0){c[d>>2]=17+(La(c[e>>2]|0,3)|0);e=c[d>>2]|0;i=b;return e|0}else{c[d>>2]=16;e=c[d>>2]|0;i=b;return e|0}return 0}function Pa(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;k=i;i=i+32|0;g=k+20|0;j=k+16|0;f=k+12|0;h=k+8|0;m=k+4|0;l=k;c[g>>2]=a;c[j>>2]=b;c[f>>2]=d;c[h>>2]=e;a=La(c[g>>2]|0,1)|0;c[c[f>>2]>>2]=a;c[c[j>>2]>>2]=0;c[c[h>>2]>>2]=0;if((c[c[f>>2]>>2]|0)!=0?(La(c[g>>2]|0,1)|0)!=0:0){i=k;return}c[m>>2]=(La(c[g>>2]|0,2)|0)+4;c[l>>2]=0;while(1){if((c[l>>2]|0)>=(c[m>>2]|0))break;b=La(c[g>>2]|0,4)|0;a=c[j>>2]|0;c[a>>2]=c[a>>2]|b<<(c[l>>2]<<2);c[l>>2]=(c[l>>2]|0)+1}a=c[j>>2]|0;c[a>>2]=(c[a>>2]|0)+1;if((c[c[f>>2]>>2]|0)!=0){i=k;return}a=La(c[g>>2]|0,1)|0;c[c[h>>2]>>2]=a;i=k;return}function Qa(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;g=i;i=i+96|0;k=g+72|0;l=g+32|0;p=g;q=g+64|0;h=g+68|0;o=g+80|0;n=g+56|0;j=g+40|0;m=g+8|0;f=g+4|0;c[p>>2]=a;c[q>>2]=b;c[h>>2]=d;c[o>>2]=e;qb(n,c[q>>2]|0,c[p>>2]|0,g+16|0);sb(m,c[o>>2]|0,c[c[h>>2]>>2]|0,j);c[l+0>>2]=c[n+0>>2];c[l+4>>2]=c[n+4>>2];c[k+0>>2]=c[m+0>>2];c[k+4>>2]=c[m+4>>2];c[f>>2]=Ra(l,k)|0;c[c[h>>2]>>2]=c[j+8>>2];i=g;return c[f>>2]|0}function Ra(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0;S=i;i=i+8656|0;o=S+8264|0;g=S+8620|0;p=S+8512|0;ta=S+8280|0;m=S+8492|0;ya=S+8344|0;Aa=S+8612|0;B=S+8500|0;t=S+8296|0;aa=S+8304|0;n=S+8308|0;h=S+8312|0;Z=S+8316|0;C=S+8320|0;D=S+8336|0;ca=S+8643|0;ea=S+8640|0;N=S+8352|0;Q=S+8400|0;U=S+8404|0;k=S;l=S+8412|0;xa=S+8416|0;O=S+8420|0;R=S+8432|0;P=S+8444|0;f=S+8456|0;T=S+8592|0;H=S+8608|0;E=S+8616|0;F=S+8624|0;va=S+8632|0;ja=S+8584|0;j=S+8504|0;ua=S+8508|0;W=S+8636|0;wa=S+8516|0;ia=S+8520|0;ga=S+8524|0;ha=S+8641|0;V=S+8532|0;L=S+8408|0;M=S+8646|0;ba=S+8544|0;da=S+8548|0;ka=S+8645|0;ra=S+8556|0;oa=S+8560|0;ma=S+8564|0;pa=S+8568|0;qa=S+8572|0;_=S+8576|0;q=S+8288|0;z=S+8580|0;s=S+8340|0;fa=S+8644|0;la=S+8480|0;sa=S+8588|0;A=S+8484|0;K=S+8642|0;I=S+8536|0;G=S+8284|0;J=S+8488|0;r=S+8628|0;u=S+8604|0;v=S+8292|0;w=S+8552|0;x=S+8540|0;y=S+8528|0;X=S+8300|0;Y=S+8496|0;c[p>>2]=1;c[m>>2]=0;c[ya>>2]=0;c[Aa>>2]=0;c[t>>2]=0;c[C+0>>2]=c[20];c[C+4>>2]=c[21];c[C+8>>2]=c[22];c[C+12>>2]=c[23];c[D>>2]=0;a[ca>>0]=0;a[ea>>0]=0;c[Q>>2]=0;c[U>>2]=0;c[o+0>>2]=c[b+0>>2];c[o+4>>2]=c[b+4>>2];if((Ga(k,o)|0)==0){c[g>>2]=0;b=c[g>>2]|0;i=S;return b|0}c[Aa>>2]=Oa(k)|0;c[B>>2]=(1<<c[Aa>>2])-16;c[aa>>2]=1<<c[Aa>>2];c[n>>2]=(c[aa>>2]|0)-1;c[h>>2]=tb((c[aa>>2]|0)+4248|0)|0;if((c[h>>2]|0)==0)c[p>>2]=0;c[Z>>2]=(c[h>>2]|0)+(c[aa>>2]|0);do if((c[p>>2]|0)!=0){c[Q>>2]=tb(24576)|0;c[U>>2]=tb(24576)|0;if((c[Q>>2]|0)!=0?(c[U>>2]|0)!=0:0)break;c[p>>2]=0}while(0);a:while(1){if((c[ya>>2]|0)!=0)break;if((c[p>>2]|0)==0)break;c[l>>2]=0;c[O+0>>2]=c[24];c[O+4>>2]=c[25];c[O+8>>2]=c[26];c[R+0>>2]=0;c[R+4>>2]=0;c[R+8>>2]=0;c[P+0>>2]=c[28];c[P+4>>2]=c[29];c[P+8>>2]=c[30];c[f+0>>2]=c[32];c[f+4>>2]=c[33];c[f+8>>2]=c[34];c[f+12>>2]=c[35];c[f+16>>2]=c[36];c[f+20>>2]=c[37];c[T+0>>2]=0;c[T+4>>2]=0;c[T+8>>2]=0;c[ja>>2]=0;c[j>>2]=0;c[W>>2]=0;c[ia>>2]=0;c[ga>>2]=0;a[ha>>0]=0;c[V>>2]=0;c[L>>2]=0;a[M>>0]=0;c[ba>>2]=0;c[da>>2]=0;c[ta>>2]=0;while(1){if((c[ta>>2]|0)>=3)break;c[N+(c[ta>>2]<<4)+8>>2]=0;c[N+(c[ta>>2]<<4)+12>>2]=0;c[ta>>2]=(c[ta>>2]|0)+1}b:do if((Ka(k)|0)!=0){Pa(k,l,ya,xa);if((c[l>>2]|0)!=0){if((c[xa>>2]|0)!=0){Sa(k,(c[k+8252>>2]|0)+7&-8);Ca=c[l>>2]|0;Ba=c[m>>2]|0;Aa=c[h>>2]|0;b=c[n>>2]|0;c[o+0>>2]=c[e+0>>2];c[o+4>>2]=c[e+4>>2];c[p>>2]=Ja(o,Ca,Ba,Aa,b,k)|0;c[m>>2]=(c[m>>2]|0)+(c[l>>2]|0);break}c[ta>>2]=0;while(1){if((c[ta>>2]|0)>=3)break;Ca=(Ta(k)|0)+1|0;c[P+(c[ta>>2]<<2)>>2]=Ca;if((c[P+(c[ta>>2]<<2)>>2]|0)>=2){if((Ua((c[P+(c[ta>>2]<<2)>>2]|0)+2|0,(c[Q>>2]|0)+(c[ta>>2]<<11<<2)|0,k)|0)==0){za=24;break}if((Ua(26,(c[U>>2]|0)+(c[ta>>2]<<11<<2)|0,k)|0)==0){za=24;break}Ca=Va((c[U>>2]|0)+(c[ta>>2]<<11<<2)|0,k)|0;c[O+(c[ta>>2]<<2)>>2]=Ca;c[T+(c[ta>>2]<<2)>>2]=1}c[ta>>2]=(c[ta>>2]|0)+1}if((za|0)==24){za=0;c[p>>2]=0;break}if((Ka(k)|0)==0){na(152,o|0)|0;c[p>>2]=0;break}c[H>>2]=La(k,2)|0;Ca=La(k,4)|0;c[E>>2]=16+(Ca<<c[H>>2]);c[F>>2]=(1<<c[H>>2])-1;c[va>>2]=(c[E>>2]|0)+(48<<c[H>>2]);c[j>>2]=tb(c[P>>2]|0)|0;if((c[j>>2]|0)==0){c[p>>2]=0;break}c[ta>>2]=0;while(1){if((c[ta>>2]|0)>=(c[P>>2]|0))break;Ca=(La(k,2)|0)<<1&255;a[(c[j>>2]|0)+(c[ta>>2]|0)>>0]=Ca;c[ta>>2]=(c[ta>>2]|0)+1}if((Wa(c[P>>2]<<6,ua,ja,k)|0)!=0?(Wa(c[P+8>>2]<<2,wa,W,k)|0)!=0:0){Xa(N,256,c[ua>>2]|0);Xa(N+16|0,704,c[P+4>>2]|0);Xa(N+32|0,c[va>>2]|0,c[wa>>2]|0);c[ta>>2]=0;while(1){if((c[ta>>2]|0)>=3)break;if((Ya(N+(c[ta>>2]<<4)|0,k)|0)==0){za=40;break}c[ta>>2]=(c[ta>>2]|0)+1}if((za|0)==40){za=0;c[p>>2]=0;break}c[ga>>2]=c[ja>>2];c[L>>2]=c[W>>2];a[ka>>0]=a[(c[j>>2]|0)+(c[R>>2]|0)>>0]|0;c[ba>>2]=c[200+((d[ka>>0]|0)<<2)>>2];c[da>>2]=c[200+((d[ka>>0]|0)+1<<2)>>2];c[ra>>2]=c[c[N+28>>2]>>2];c:while(1){if((c[l>>2]|0)<=0){za=97;break}if((Ka(k)|0)==0){za=45;break}if((c[O+4>>2]|0)==0){Za(c[P+4>>2]|0,c[Q>>2]|0,1,R,f,T,k);c[O+4>>2]=Va((c[U>>2]|0)+8192|0,k)|0;c[ra>>2]=c[(c[N+28>>2]|0)+(c[R+4>>2]<<2)>>2]}Ca=O+4|0;c[Ca>>2]=(c[Ca>>2]|0)+ -1;c[oa>>2]=_a(c[ra>>2]|0,k)|0;c[ma>>2]=c[oa>>2]>>6;if((c[ma>>2]|0)>=2){c[ma>>2]=(c[ma>>2]|0)-2;c[z>>2]=-1}else c[z>>2]=0;c[pa>>2]=(c[232+(c[ma>>2]<<2)>>2]|0)+(c[oa>>2]>>3&7);c[qa>>2]=(c[272+(c[ma>>2]<<2)>>2]|0)+(c[oa>>2]&7);Ca=c[312+(c[pa>>2]<<3)>>2]|0;c[_>>2]=Ca+(La(k,c[316+(c[pa>>2]<<3)>>2]|0)|0);Ca=c[504+(c[qa>>2]<<3)>>2]|0;c[q>>2]=Ca+(La(k,c[508+(c[qa>>2]<<3)>>2]|0)|0);c[la>>2]=0;while(1){if((c[la>>2]|0)>=(c[_>>2]|0))break;if((Ka(k)|0)==0){za=54;break c}if((c[O>>2]|0)==0){Za(c[P>>2]|0,c[Q>>2]|0,0,R,f,T,k);c[O>>2]=Va(c[U>>2]|0,k)|0;c[ia>>2]=c[R>>2]<<6;c[ga>>2]=(c[ja>>2]|0)+(c[ia>>2]|0);a[ka>>0]=a[(c[j>>2]|0)+(c[R>>2]|0)>>0]|0;c[ba>>2]=c[200+((d[ka>>0]|0)<<2)>>2];c[da>>2]=c[200+((d[ka>>0]|0)+1<<2)>>2]}a[fa>>0]=d[696+((c[ba>>2]|0)+(d[ca>>0]|0))>>0]|0|(d[696+((c[da>>2]|0)+(d[ea>>0]|0))>>0]|0);a[ha>>0]=a[(c[ga>>2]|0)+(d[fa>>0]|0)>>0]|0;c[O>>2]=(c[O>>2]|0)+ -1;a[ea>>0]=a[ca>>0]|0;a[ca>>0]=_a(c[(c[N+12>>2]|0)+((d[ha>>0]|0)<<2)>>2]|0,k)|0;a[(c[h>>2]|0)+(c[m>>2]&c[n>>2])>>0]=a[ca>>0]|0;if((c[m>>2]&c[n>>2]|0)==(c[n>>2]|0)){Ba=c[h>>2]|0;Ca=c[aa>>2]|0;c[o+0>>2]=c[e+0>>2];c[o+4>>2]=c[e+4>>2];if((Ma(o,Ba,Ca)|0)<0){za=59;break c}}c[m>>2]=(c[m>>2]|0)+1;c[la>>2]=(c[la>>2]|0)+1}c[l>>2]=(c[l>>2]|0)-(c[_>>2]|0);if((c[l>>2]|0)<=0){za=97;break}do if((c[z>>2]|0)<0){if((Ka(k)|0)==0){za=64;break c}if((c[O+8>>2]|0)==0){Za(c[P+8>>2]|0,c[Q>>2]|0,2,R,f,T,k);c[O+8>>2]=Va((c[U>>2]|0)+16384|0,k)|0;a[M>>0]=c[R+8>>2];c[V>>2]=c[R+8>>2]<<2;c[L>>2]=(c[W>>2]|0)+(c[V>>2]|0)}Ca=O+8|0;c[Ca>>2]=(c[Ca>>2]|0)+ -1;if((c[q>>2]|0)>4)Aa=3;else Aa=(c[q>>2]|0)-2|0;a[K>>0]=Aa;a[M>>0]=a[(c[L>>2]|0)+(d[K>>0]|0)>>0]|0;c[z>>2]=_a(c[(c[N+44>>2]|0)+((d[M>>0]|0)<<2)>>2]|0,k)|0;if((c[z>>2]|0)<(c[E>>2]|0))break;c[z>>2]=(c[z>>2]|0)-(c[E>>2]|0);c[G>>2]=c[z>>2]&c[F>>2];c[z>>2]=c[z>>2]>>c[H>>2];c[I>>2]=(c[z>>2]>>1)+1;c[J>>2]=(2+(c[z>>2]&1)<<c[I>>2])-4;Ba=c[E>>2]|0;Ca=c[J>>2]|0;Ca=Ca+(La(k,c[I>>2]|0)|0)|0;c[z>>2]=Ba+(Ca<<c[H>>2])+(c[G>>2]|0)}while(0);c[s>>2]=$a(c[z>>2]|0,C,c[D>>2]|0)|0;if((c[s>>2]|0)<0){za=72;break}do if((c[m>>2]|0)<(c[B>>2]|0)){if((c[t>>2]|0)==(c[B>>2]|0)){za=76;break}c[t>>2]=c[m>>2]}else za=76;while(0);if((za|0)==76){za=0;c[t>>2]=c[B>>2]}c[A>>2]=(c[h>>2]|0)+(c[m>>2]&c[n>>2]);d:do if((c[s>>2]|0)>(c[t>>2]|0)){if(!((c[q>>2]|0)>=4&(c[q>>2]|0)<=24)){za=85;break c}c[r>>2]=c[2488+(c[q>>2]<<2)>>2];c[u>>2]=(c[s>>2]|0)-(c[t>>2]|0)-1;c[v>>2]=c[2592+(c[q>>2]<<2)>>2];c[w>>2]=(1<<c[v>>2])-1;c[x>>2]=c[u>>2]&c[w>>2];c[y>>2]=c[u>>2]>>c[v>>2];Ca=$(c[x>>2]|0,c[q>>2]|0)|0;c[r>>2]=(c[r>>2]|0)+Ca;if((c[y>>2]|0)>=121){za=84;break c}c[X>>2]=2696+(c[r>>2]|0);c[Y>>2]=ab(c[A>>2]|0,c[X>>2]|0,c[q>>2]|0,c[y>>2]|0)|0;c[A>>2]=(c[A>>2]|0)+(c[Y>>2]|0);c[m>>2]=(c[m>>2]|0)+(c[Y>>2]|0);c[l>>2]=(c[l>>2]|0)-(c[Y>>2]|0);if(!((c[A>>2]|0)>>>0>=(c[Z>>2]|0)>>>0))break;Ba=c[h>>2]|0;Ca=c[aa>>2]|0;c[o+0>>2]=c[e+0>>2];c[o+4>>2]=c[e+4>>2];if((Ma(o,Ba,Ca)|0)<0){za=82;break c}Ab(c[h>>2]|0,c[Z>>2]|0,(c[A>>2]|0)-(c[Z>>2]|0)|0)|0}else{if((c[z>>2]|0)>0){c[C+((c[D>>2]&3)<<2)>>2]=c[s>>2];c[D>>2]=(c[D>>2]|0)+1}Aa=c[m>>2]|0;b=c[s>>2]|0;if((c[q>>2]|0)>(c[l>>2]|0)){za=89;break c}c[sa>>2]=(c[h>>2]|0)+(Aa-b&c[n>>2]);c[la>>2]=0;while(1){if((c[la>>2]|0)>=(c[q>>2]|0))break d;a[(c[h>>2]|0)+(c[m>>2]&c[n>>2])>>0]=a[(c[h>>2]|0)+((c[m>>2]|0)-(c[s>>2]|0)&c[n>>2])>>0]|0;if((c[m>>2]&c[n>>2]|0)==(c[n>>2]|0)){Ba=c[h>>2]|0;Ca=c[aa>>2]|0;c[o+0>>2]=c[e+0>>2];c[o+4>>2]=c[e+4>>2];if((Ma(o,Ba,Ca)|0)<0){za=94;break c}}c[m>>2]=(c[m>>2]|0)+1;c[l>>2]=(c[l>>2]|0)+ -1;c[la>>2]=(c[la>>2]|0)+1}}while(0);a[ca>>0]=a[(c[h>>2]|0)+((c[m>>2]|0)-1&c[n>>2])>>0]|0;a[ea>>0]=a[(c[h>>2]|0)+((c[m>>2]|0)-2&c[n>>2])>>0]|0}switch(za|0){case 45:{za=0;na(152,o|0)|0;c[p>>2]=0;break b};case 54:{za=0;na(152,o|0)|0;c[p>>2]=0;break b};case 59:{za=0;c[p>>2]=0;break b};case 64:{za=0;na(152,o|0)|0;c[p>>2]=0;break b};case 72:{za=0;c[p>>2]=0;break b};case 82:{za=0;c[p>>2]=0;break b};case 84:{za=0;b=c[s>>2]|0;Ba=c[q>>2]|0;Ca=c[l>>2]|0;c[o>>2]=c[m>>2];c[o+4>>2]=b;c[o+8>>2]=Ba;c[o+12>>2]=Ca;na(125480,o|0)|0;c[p>>2]=0;break b};case 85:{za=0;b=c[s>>2]|0;Ba=c[q>>2]|0;Ca=c[l>>2]|0;c[o>>2]=c[m>>2];c[o+4>>2]=b;c[o+8>>2]=Ba;c[o+12>>2]=Ca;na(125480,o|0)|0;c[p>>2]=0;break b};case 89:{za=0;Ba=c[q>>2]|0;Ca=c[l>>2]|0;c[o>>2]=Aa;c[o+4>>2]=b;c[o+8>>2]=Ba;c[o+12>>2]=Ca;na(125480,o|0)|0;c[p>>2]=0;break b};case 94:{za=0;c[p>>2]=0;break b};case 97:{za=0;c[m>>2]=c[m>>2]&1073741823;break b}}}c[p>>2]=0}}else{na(152,o|0)|0;c[p>>2]=0}while(0);if((c[j>>2]|0)!=0)ub(c[j>>2]|0);if((c[ja>>2]|0)!=0)ub(c[ja>>2]|0);if((c[W>>2]|0)!=0)ub(c[W>>2]|0);c[ta>>2]=0;while(1){if((c[ta>>2]|0)>=3)continue a;bb(N+(c[ta>>2]<<4)|0);c[ta>>2]=(c[ta>>2]|0)+1}}if((c[h>>2]|0)!=0){Ba=c[h>>2]|0;Ca=c[m>>2]&c[n>>2];c[o+0>>2]=c[e+0>>2];c[o+4>>2]=c[e+4>>2];if((Ma(o,Ba,Ca)|0)<0)c[p>>2]=0;ub(c[h>>2]|0)}if((c[Q>>2]|0)!=0)ub(c[Q>>2]|0);if((c[U>>2]|0)!=0)ub(c[U>>2]|0);c[g>>2]=c[p>>2];Ca=c[g>>2]|0;i=S;return Ca|0}function Sa(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;i=i+16|0;e=d+4|0;f=d;c[e>>2]=a;c[f>>2]=b;c[(c[e>>2]|0)+8252>>2]=c[f>>2];i=d;return}function Ta(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;i=i+16|0;d=b+8|0;e=b+4|0;f=b;c[e>>2]=a;if((La(c[e>>2]|0,1)|0)==0){c[d>>2]=0;f=c[d>>2]|0;i=b;return f|0}c[f>>2]=La(c[e>>2]|0,3)|0;if((c[f>>2]|0)==0){c[d>>2]=1;f=c[d>>2]|0;i=b;return f|0}else{e=La(c[e>>2]|0,c[f>>2]|0)|0;c[d>>2]=e+(1<<c[f>>2]);f=c[d>>2]|0;i=b;return f|0}return 0}function Ua(e,f,g){e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;o=i;i=i+112|0;j=o;n=o+8|0;m=o+60|0;p=o+76|0;q=o+12|0;k=o+16|0;h=o+64|0;s=o+72|0;l=o+80|0;A=o+84|0;D=o+88|0;B=o+24|0;r=o+40|0;C=o+4|0;t=o+56|0;x=o+94|0;y=o+68|0;z=o+28|0;u=o+32|0;v=o+20|0;w=o+92|0;c[m>>2]=e;c[p>>2]=f;c[q>>2]=g;c[k>>2]=1;c[h>>2]=0;c[l>>2]=0;e=c[m>>2]|0;c[l>>2]=nb(e,((e|0)<0)<<31>>31,1)|0;if((c[l>>2]|0)==0){c[n>>2]=0;e=c[n>>2]|0;i=o;return e|0}if((Ka(c[q>>2]|0)|0)==0){na(127808,j|0)|0;c[n>>2]=0;e=c[n>>2]|0;i=o;return e|0}c[s>>2]=La(c[q>>2]|0,2)|0;do if((c[s>>2]|0)==1){c[D>>2]=(c[m>>2]|0)-1;c[B>>2]=0;c[r+0>>2]=0;c[r+4>>2]=0;c[r+8>>2]=0;c[r+12>>2]=0;c[C>>2]=(La(c[q>>2]|0,2)|0)+1;while(1){if((c[D>>2]|0)==0)break;c[D>>2]=c[D>>2]>>1;c[B>>2]=(c[B>>2]|0)+1}xb(c[l>>2]|0,0,c[m>>2]|0)|0;c[A>>2]=0;while(1){if((c[A>>2]|0)>=(c[C>>2]|0))break;e=La(c[q>>2]|0,c[B>>2]|0)|0;c[r+(c[A>>2]<<2)>>2]=(e|0)%(c[m>>2]|0)|0;a[(c[l>>2]|0)+(c[r+(c[A>>2]<<2)>>2]|0)>>0]=2;c[A>>2]=(c[A>>2]|0)+1}a[(c[l>>2]|0)+(c[r>>2]|0)>>0]=1;s=c[C>>2]|0;if((s|0)==3){if((c[r>>2]|0)!=(c[r+4>>2]|0)?(c[r>>2]|0)!=(c[r+8>>2]|0):0)q=(c[r+4>>2]|0)!=(c[r+8>>2]|0);else q=0;c[k>>2]=q&1;break}else if((s|0)==2){c[k>>2]=(c[r>>2]|0)!=(c[r+4>>2]|0)&1;a[(c[l>>2]|0)+(c[r+4>>2]|0)>>0]=1;break}else if((s|0)==4){if(((((c[r>>2]|0)!=(c[r+4>>2]|0)?(c[r>>2]|0)!=(c[r+8>>2]|0):0)?(c[r>>2]|0)!=(c[r+12>>2]|0):0)?(c[r+4>>2]|0)!=(c[r+8>>2]|0):0)?(c[r+4>>2]|0)!=(c[r+12>>2]|0):0)s=(c[r+8>>2]|0)!=(c[r+12>>2]|0);else s=0;c[k>>2]=s&1;if((La(c[q>>2]|0,1)|0)!=0){a[(c[l>>2]|0)+(c[r+8>>2]|0)>>0]=3;a[(c[l>>2]|0)+(c[r+12>>2]|0)>>0]=3;break}else{a[(c[l>>2]|0)+(c[r>>2]|0)>>0]=2;break}}else break}else{A=x+0|0;r=A+18|0;do{a[A>>0]=0;A=A+1|0}while((A|0)<(r|0));c[y>>2]=32;c[z>>2]=0;c[t>>2]=c[s>>2];while(1){if((c[t>>2]|0)>=18)break;if((c[y>>2]|0)<=0)break;c[u>>2]=d[127920+(c[t>>2]|0)>>0];c[v>>2]=127856;db(c[q>>2]|0);e=(c[q>>2]|0)+8240|0;e=yb(c[e>>2]|0,c[e+4>>2]|0,c[(c[q>>2]|0)+8252>>2]|0)|0;c[v>>2]=(c[v>>2]|0)+((e&15)<<2);e=(c[q>>2]|0)+8252|0;c[e>>2]=(c[e>>2]|0)+(d[c[v>>2]>>0]|0);a[w>>0]=b[(c[v>>2]|0)+2>>1];a[x+(c[u>>2]|0)>>0]=a[w>>0]|0;if((d[w>>0]|0|0)!=0){c[y>>2]=(c[y>>2]|0)-(32>>(d[w>>0]|0));c[z>>2]=(c[z>>2]|0)+1}c[t>>2]=(c[t>>2]|0)+1}if((c[z>>2]|0)!=1?(c[y>>2]|0)!=0:0)q=0;else q=(hb(x,c[m>>2]|0,c[l>>2]|0,c[q>>2]|0)|0)!=0;c[k>>2]=q&1}while(0);if((c[k>>2]|0)!=0?(c[h>>2]=jb(c[p>>2]|0,8,c[l>>2]|0,c[m>>2]|0)|0,(c[h>>2]|0)==0):0){na(127944,j|0)|0;ib(c[l>>2]|0,c[m>>2]|0)}ub(c[l>>2]|0);c[n>>2]=c[h>>2];e=c[n>>2]|0;i=o;return e|0}function Va(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;i=i+16|0;h=d+12|0;f=d+8|0;g=d+4|0;e=d;c[h>>2]=a;c[f>>2]=b;c[g>>2]=_a(c[h>>2]|0,c[f>>2]|0)|0;c[e>>2]=c[127604+(c[g>>2]<<3)>>2];a=c[127600+(c[g>>2]<<3)>>2]|0;a=a+(La(c[f>>2]|0,c[e>>2]|0)|0)|0;i=d;return a|0}function Wa(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;n=i;i=i+64|0;h=n;m=n+4|0;k=n+12|0;t=n+8|0;j=n+24|0;o=n+16|0;g=n+20|0;u=n+28|0;r=n+32|0;l=n+36|0;q=n+40|0;p=n+44|0;s=n+48|0;c[k>>2]=b;c[t>>2]=d;c[j>>2]=e;c[o>>2]=f;c[g>>2]=1;c[r>>2]=0;if((Ka(c[o>>2]|0)|0)==0){na(127552,h|0)|0;c[m>>2]=0;b=c[m>>2]|0;i=n;return b|0}b=(Ta(c[o>>2]|0)|0)+1|0;c[c[t>>2]>>2]=b;b=tb(c[k>>2]|0)|0;c[c[j>>2]>>2]=b;if((c[c[j>>2]>>2]|0)==0){c[m>>2]=0;b=c[m>>2]|0;i=n;return b|0}if((c[c[t>>2]>>2]|0)<=1){xb(c[c[j>>2]>>2]|0,0,c[k>>2]|0)|0;c[m>>2]=1;b=c[m>>2]|0;i=n;return b|0}c[u>>2]=La(c[o>>2]|0,1)|0;if((c[u>>2]|0)!=0)c[r>>2]=(La(c[o>>2]|0,4)|0)+1;c[l>>2]=tb(8192)|0;if((c[l>>2]|0)==0){c[m>>2]=0;b=c[m>>2]|0;i=n;return b|0}do if((Ua((c[c[t>>2]>>2]|0)+(c[r>>2]|0)|0,c[l>>2]|0,c[o>>2]|0)|0)!=0){c[q>>2]=0;a:while(1){f=c[o>>2]|0;if((c[q>>2]|0)>=(c[k>>2]|0)){o=26;break}if((Ka(f)|0)==0){o=16;break}c[p>>2]=_a(c[l>>2]|0,c[o>>2]|0)|0;if((c[p>>2]|0)==0){a[(c[c[j>>2]>>2]|0)+(c[q>>2]|0)>>0]=0;c[q>>2]=(c[q>>2]|0)+1;continue}f=c[p>>2]|0;if((c[p>>2]|0)>(c[r>>2]|0)){a[(c[c[j>>2]>>2]|0)+(c[q>>2]|0)>>0]=f-(c[r>>2]|0);c[q>>2]=(c[q>>2]|0)+1;continue}c[s>>2]=1+(1<<f)+(La(c[o>>2]|0,c[p>>2]|0)|0);while(1){b=(c[s>>2]|0)+ -1|0;c[s>>2]=b;if((b|0)==0)continue a;if((c[q>>2]|0)>=(c[k>>2]|0)){o=23;break a}a[(c[c[j>>2]>>2]|0)+(c[q>>2]|0)>>0]=0;c[q>>2]=(c[q>>2]|0)+1}}if((o|0)==16){na(127552,h|0)|0;c[g>>2]=0;break}else if((o|0)==23){c[g>>2]=0;break}else if((o|0)==26){if((La(f,1)|0)==0)break;fb(c[c[j>>2]>>2]|0,c[k>>2]|0);break}}else c[g>>2]=0;while(0);ub(c[l>>2]|0);c[m>>2]=c[g>>2];b=c[m>>2]|0;i=n;return b|0}function Xa(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;i=i+16|0;f=e+8|0;h=e+4|0;g=e;c[f>>2]=a;c[h>>2]=b;c[g>>2]=d;c[c[f>>2]>>2]=c[h>>2];c[(c[f>>2]|0)+4>>2]=c[g>>2];a=tb(c[g>>2]<<11<<2)|0;c[(c[f>>2]|0)+8>>2]=a;a=tb(c[g>>2]<<2)|0;c[(c[f>>2]|0)+12>>2]=a;i=e;return}function Ya(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+32|0;d=e+20|0;g=e+16|0;j=e+12|0;h=e+8|0;k=e+4|0;f=e;c[g>>2]=a;c[j>>2]=b;c[f>>2]=c[(c[g>>2]|0)+8>>2];c[h>>2]=0;while(1){if((c[h>>2]|0)>=(c[(c[g>>2]|0)+4>>2]|0)){b=6;break}c[(c[(c[g>>2]|0)+12>>2]|0)+(c[h>>2]<<2)>>2]=c[f>>2];c[k>>2]=Ua(c[c[g>>2]>>2]|0,c[f>>2]|0,c[j>>2]|0)|0;c[f>>2]=(c[f>>2]|0)+(c[k>>2]<<2);if((c[k>>2]|0)==0){b=4;break}c[h>>2]=(c[h>>2]|0)+1}if((b|0)==4){c[d>>2]=0;a=c[d>>2]|0;i=e;return a|0}else if((b|0)==6){c[d>>2]=1;a=c[d>>2]|0;i=e;return a|0}return 0}function Za(a,b,d,e,f,g,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;o=i;i=i+48|0;j=o+36|0;s=o+16|0;l=o;k=o+28|0;u=o+32|0;t=o+40|0;r=o+12|0;m=o+24|0;n=o+20|0;q=o+8|0;p=o+4|0;c[j>>2]=a;c[s>>2]=b;c[l>>2]=d;c[k>>2]=e;c[u>>2]=f;c[t>>2]=g;c[r>>2]=h;c[m>>2]=(c[u>>2]|0)+(c[l>>2]<<1<<2);c[n>>2]=(c[t>>2]|0)+(c[l>>2]<<2);c[q>>2]=_a((c[s>>2]|0)+(c[l>>2]<<11<<2)|0,c[r>>2]|0)|0;do if((c[q>>2]|0)!=0)if((c[q>>2]|0)==1){c[p>>2]=(c[(c[m>>2]|0)+(((c[c[n>>2]>>2]|0)-1&1)<<2)>>2]|0)+1;break}else{c[p>>2]=(c[q>>2]|0)-2;break}else c[p>>2]=c[(c[m>>2]|0)+((c[c[n>>2]>>2]&1)<<2)>>2];while(0);if((c[p>>2]|0)>=(c[j>>2]|0))c[p>>2]=(c[p>>2]|0)-(c[j>>2]|0);c[(c[k>>2]|0)+(c[l>>2]<<2)>>2]=c[p>>2];c[(c[m>>2]|0)+((c[c[n>>2]>>2]&1)<<2)>>2]=c[p>>2];u=c[n>>2]|0;c[u>>2]=(c[u>>2]|0)+1;i=o;return}function _a(f,g){f=f|0;g=g|0;var h=0,j=0,k=0,l=0;h=i;i=i+16|0;j=h+8|0;k=h+4|0;l=h;c[j>>2]=f;c[k>>2]=g;db(c[k>>2]|0);f=(c[k>>2]|0)+8240|0;f=yb(c[f>>2]|0,c[f+4>>2]|0,c[(c[k>>2]|0)+8252>>2]|0)|0;c[j>>2]=(c[j>>2]|0)+((f&255)<<2);c[l>>2]=(d[c[j>>2]>>0]|0)-8;if((c[l>>2]|0)<=0){l=c[j>>2]|0;l=a[l>>0]|0;l=l&255;f=c[k>>2]|0;f=f+8252|0;k=c[f>>2]|0;l=k+l|0;c[f>>2]=l;f=c[j>>2]|0;f=f+2|0;f=b[f>>1]|0;f=f&65535;i=h;return f|0}f=(c[k>>2]|0)+8252|0;c[f>>2]=(c[f>>2]|0)+8;c[j>>2]=(c[j>>2]|0)+((e[(c[j>>2]|0)+2>>1]|0)<<2);f=(c[k>>2]|0)+8240|0;f=yb(c[f>>2]|0,c[f+4>>2]|0,c[(c[k>>2]|0)+8252>>2]|0)|0;c[j>>2]=(c[j>>2]|0)+((f&(1<<c[l>>2])-1)<<2);l=c[j>>2]|0;l=a[l>>0]|0;l=l&255;f=c[k>>2]|0;f=f+8252|0;k=c[f>>2]|0;l=k+l|0;c[f>>2]=l;f=c[j>>2]|0;f=f+2|0;f=b[f>>1]|0;f=f&65535;i=h;return f|0}function $a(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;i=i+16|0;g=e+12|0;j=e+8|0;h=e+4|0;f=e;c[g>>2]=a;c[j>>2]=b;c[h>>2]=d;d=c[g>>2]|0;if((c[g>>2]|0)<16){c[h>>2]=(c[h>>2]|0)+(c[127424+(d<<2)>>2]|0);c[h>>2]=c[h>>2]&3;c[f>>2]=(c[(c[j>>2]|0)+(c[h>>2]<<2)>>2]|0)+(c[127488+(c[g>>2]<<2)>>2]|0);a=c[f>>2]|0;i=e;return a|0}else{c[f>>2]=d-16+1;a=c[f>>2]|0;i=e;return a|0}return 0}function ab(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;m=i;i=i+48|0;h=m+4|0;q=m+16|0;n=m+36|0;t=m;s=m+32|0;o=m+40|0;l=m+44|0;r=m+24|0;g=m+20|0;p=m+8|0;j=m+12|0;k=m+28|0;c[h>>2]=b;c[q>>2]=d;c[n>>2]=e;c[t>>2]=f;c[s>>2]=c[125560+((c[t>>2]|0)*12|0)>>2];c[o>>2]=c[125568+((c[t>>2]|0)*12|0)>>2];c[l>>2]=c[125564+((c[t>>2]|0)*12|0)>>2];if((c[l>>2]|0)<12)f=0;else f=(c[l>>2]|0)-11|0;c[r>>2]=f;c[g>>2]=0;c[p>>2]=0;if((c[r>>2]|0)>(c[n>>2]|0))c[r>>2]=c[n>>2];while(1){if((a[c[s>>2]>>0]|0)==0)break;b=c[s>>2]|0;c[s>>2]=b+1;b=a[b>>0]|0;t=c[g>>2]|0;c[g>>2]=t+1;a[(c[h>>2]|0)+t>>0]=b}c[q>>2]=(c[q>>2]|0)+(c[r>>2]|0);c[n>>2]=(c[n>>2]|0)-(c[r>>2]|0);if((c[l>>2]|0)<=9)c[n>>2]=(c[n>>2]|0)-(c[l>>2]|0);while(1){if((c[p>>2]|0)>=(c[n>>2]|0))break;b=c[p>>2]|0;c[p>>2]=b+1;b=a[(c[q>>2]|0)+b>>0]|0;t=c[g>>2]|0;c[g>>2]=t+1;a[(c[h>>2]|0)+t>>0]=b}c[j>>2]=(c[h>>2]|0)+((c[g>>2]|0)-(c[n>>2]|0));a:do if((c[l>>2]|0)!=10){if((c[l>>2]|0)==11)while(1){if((c[n>>2]|0)<=0)break a;c[k>>2]=cb(c[j>>2]|0,c[n>>2]|0)|0;c[j>>2]=(c[j>>2]|0)+(c[k>>2]|0);c[n>>2]=(c[n>>2]|0)-(c[k>>2]|0)}}else cb(c[j>>2]|0,c[n>>2]|0)|0;while(0);while(1){if((a[c[o>>2]>>0]|0)==0)break;b=c[o>>2]|0;c[o>>2]=b+1;b=a[b>>0]|0;t=c[g>>2]|0;c[g>>2]=t+1;a[(c[h>>2]|0)+t>>0]=b}i=m;return c[g>>2]|0}function bb(a){a=a|0;var b=0,d=0;b=i;i=i+16|0;d=b;c[d>>2]=a;if((c[(c[d>>2]|0)+8>>2]|0)!=0)ub(c[(c[d>>2]|0)+8>>2]|0);if((c[(c[d>>2]|0)+12>>2]|0)==0){i=b;return}ub(c[(c[d>>2]|0)+12>>2]|0);i=b;return}function cb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0;f=i;i=i+16|0;g=f+8|0;h=f+4|0;c[h>>2]=b;c[f>>2]=e;e=d[c[h>>2]>>0]|0;if((d[c[h>>2]>>0]|0|0)>=192){h=c[h>>2]|0;if((e|0)<224){b=h+1|0;a[b>>0]=(d[b>>0]|0)^32;c[g>>2]=2;b=c[g>>2]|0;i=f;return b|0}else{b=h+2|0;a[b>>0]=(d[b>>0]|0)^5;c[g>>2]=3;b=c[g>>2]|0;i=f;return b|0}}else{if((e|0)>=97?(d[c[h>>2]>>0]|0|0)<=122:0){b=c[h>>2]|0;a[b>>0]=(d[b>>0]|0)^32}c[g>>2]=1;b=c[g>>2]|0;i=f;return b|0}return 0}function db(a){a=a|0;var b=0,d=0;b=i;i=i+16|0;d=b;c[d>>2]=a;if(!((c[(c[d>>2]|0)+8252>>2]|0)>>>0>=40)){i=b;return}eb(c[d>>2]|0);i=b;return}function eb(a){a=a|0;var b=0,e=0,f=0,g=0,h=0;b=i;i=i+16|0;e=b;c[e>>2]=a;while(1){if(!((c[(c[e>>2]|0)+8252>>2]|0)>>>0>=8))break;g=(c[e>>2]|0)+8240|0;a=g;a=yb(c[a>>2]|0,c[a+4>>2]|0,8)|0;c[g>>2]=a;c[g+4>>2]=D;g=zb(d[(c[e>>2]|0)+(c[(c[e>>2]|0)+8248>>2]&8191)>>0]|0|0,0,56)|0;a=(c[e>>2]|0)+8240|0;h=a;f=c[h+4>>2]|D;c[a>>2]=c[h>>2]|g;c[a+4>>2]=f;a=(c[e>>2]|0)+8248|0;c[a>>2]=(c[a>>2]|0)+1;a=(c[e>>2]|0)+8252|0;c[a>>2]=(c[a>>2]|0)-8;a=(c[e>>2]|0)+8256|0;c[a>>2]=(c[a>>2]|0)-8}i=b;return}function fb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;i=i+272|0;g=f+8|0;l=f+4|0;k=f+16|0;h=f;j=f+12|0;c[g>>2]=b;c[l>>2]=e;c[h>>2]=0;while(1){if((c[h>>2]|0)>=256)break;a[k+(c[h>>2]|0)>>0]=c[h>>2];c[h>>2]=(c[h>>2]|0)+1}c[h>>2]=0;while(1){if((c[h>>2]|0)>=(c[l>>2]|0))break;a[j>>0]=a[(c[g>>2]|0)+(c[h>>2]|0)>>0]|0;a[(c[g>>2]|0)+(c[h>>2]|0)>>0]=a[k+(d[j>>0]|0)>>0]|0;if((a[j>>0]|0)!=0)gb(k,a[j>>0]|0);c[h>>2]=(c[h>>2]|0)+1}i=f;return}function gb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;h=i;i=i+16|0;g=h;k=h+6|0;f=h+5|0;j=h+4|0;c[g>>2]=b;a[k>>0]=e;a[f>>0]=a[(c[g>>2]|0)+(d[k>>0]|0)>>0]|0;a[j>>0]=a[k>>0]|0;while(1){if((a[j>>0]|0)==0)break;a[(c[g>>2]|0)+(d[j>>0]|0)>>0]=a[(c[g>>2]|0)+((d[j>>0]|0)-1)>>0]|0;a[j>>0]=(a[j>>0]|0)+ -1<<24>>24}a[c[g>>2]>>0]=a[f>>0]|0;i=h;return}function hb(e,f,g,h){e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;n=i;i=i+192|0;k=n;j=n+32|0;x=n+12|0;p=n+36|0;m=n+16|0;t=n+40|0;l=n+44|0;y=n+184|0;u=n+8|0;z=n+185|0;o=n+24|0;v=n+56|0;q=n+4|0;w=n+186|0;r=n+28|0;A=n+20|0;B=n+48|0;s=n+187|0;c[x>>2]=e;c[p>>2]=f;c[m>>2]=g;c[t>>2]=h;c[l>>2]=0;a[y>>0]=8;c[u>>2]=0;a[z>>0]=0;c[o>>2]=32768;if((jb(v,5,c[x>>2]|0,18)|0)==0){na(128e3,k|0)|0;ib(c[x>>2]|0,18);c[j>>2]=0;e=c[j>>2]|0;i=n;return e|0}while(1){if((c[l>>2]|0)>=(c[p>>2]|0)){q=20;break}if((c[o>>2]|0)<=0){q=20;break}c[q>>2]=v;if((Ka(c[t>>2]|0)|0)==0){q=6;break}db(c[t>>2]|0);e=(c[t>>2]|0)+8240|0;e=yb(c[e>>2]|0,c[e+4>>2]|0,c[(c[t>>2]|0)+8252>>2]|0)|0;c[q>>2]=(c[q>>2]|0)+((e&31)<<2);e=(c[t>>2]|0)+8252|0;c[e>>2]=(c[e>>2]|0)+(d[c[q>>2]>>0]|0);a[w>>0]=b[(c[q>>2]|0)+2>>1];if((d[w>>0]|0|0)<16){c[u>>2]=0;f=a[w>>0]|0;e=c[l>>2]|0;c[l>>2]=e+1;a[(c[m>>2]|0)+e>>0]=f;if((d[w>>0]|0|0)==0)continue;a[y>>0]=a[w>>0]|0;c[o>>2]=(c[o>>2]|0)-(32768>>(d[w>>0]|0));continue}c[r>>2]=(d[w>>0]|0)-14;a[s>>0]=0;if((d[w>>0]|0|0)==16)a[s>>0]=a[y>>0]|0;if((d[z>>0]|0|0)!=(d[s>>0]|0|0)){c[u>>2]=0;a[z>>0]=a[s>>0]|0}c[A>>2]=c[u>>2];if((c[u>>2]|0)>0){c[u>>2]=(c[u>>2]|0)-2;c[u>>2]=c[u>>2]<<c[r>>2]}e=(La(c[t>>2]|0,c[r>>2]|0)|0)+3|0;c[u>>2]=(c[u>>2]|0)+e;c[B>>2]=(c[u>>2]|0)-(c[A>>2]|0);if(((c[l>>2]|0)+(c[B>>2]|0)|0)>(c[p>>2]|0)){q=17;break}xb((c[m>>2]|0)+(c[l>>2]|0)|0,(d[z>>0]|0)&255|0,c[B>>2]|0)|0;c[l>>2]=(c[l>>2]|0)+(c[B>>2]|0);if((d[z>>0]|0|0)==0)continue;c[o>>2]=(c[o>>2]|0)-(c[B>>2]<<15-(d[z>>0]|0))}if((q|0)==6){na(128064,k|0)|0;c[j>>2]=0;e=c[j>>2]|0;i=n;return e|0}else if((q|0)==17){c[j>>2]=0;e=c[j>>2]|0;i=n;return e|0}else if((q|0)==20)if((c[o>>2]|0)!=0){c[k>>2]=c[o>>2];na(128120,k|0)|0;c[j>>2]=0;e=c[j>>2]|0;i=n;return e|0}else{xb((c[m>>2]|0)+(c[l>>2]|0)|0,0,(c[p>>2]|0)-(c[l>>2]|0)|0)|0;c[j>>2]=1;e=c[j>>2]|0;i=n;return e|0}return 0}function ib(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0;f=i;i=i+16|0;e=f;h=f+8|0;g=f+4|0;c[h>>2]=a;c[g>>2]=b;while(1){a=c[g>>2]|0;c[g>>2]=a+ -1;if((a|0)<=0)break;a=c[h>>2]|0;c[h>>2]=a+1;c[e>>2]=d[a>>0];na(127992,e|0)|0}na(127120,e|0)|0;i=f;return}function jb(e,f,g,h){e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;m=i;i=i+208|0;A=m+200|0;l=m+104|0;s=m+84|0;u=m+88|0;C=m+72|0;B=m+100|0;y=m+196|0;j=m+180|0;p=m+188|0;n=m+92|0;z=m+192|0;w=m+4|0;o=m;r=m+96|0;v=m+76|0;k=m+80|0;x=m+176|0;t=m+184|0;q=m+8|0;D=m+112|0;c[s>>2]=e;c[u>>2]=f;c[C>>2]=g;c[B>>2]=h;g=q+0|0;h=g+64|0;do{c[g>>2]=0;g=g+4|0}while((g|0)<(h|0));c[t>>2]=tb(c[B>>2]<<2)|0;if((c[t>>2]|0)==0){c[l>>2]=0;e=c[l>>2]|0;i=m;return e|0}c[n>>2]=0;while(1){if((c[n>>2]|0)>=(c[B>>2]|0))break;e=q+((d[(c[C>>2]|0)+(c[n>>2]|0)>>0]|0)<<2)|0;c[e>>2]=(c[e>>2]|0)+1;c[n>>2]=(c[n>>2]|0)+1}c[D+4>>2]=0;c[p>>2]=1;while(1){if((c[p>>2]|0)>=15)break;c[D+((c[p>>2]|0)+1<<2)>>2]=(c[D+(c[p>>2]<<2)>>2]|0)+(c[q+(c[p>>2]<<2)>>2]|0);c[p>>2]=(c[p>>2]|0)+1}c[n>>2]=0;while(1){if((c[n>>2]|0)>=(c[B>>2]|0))break;if((d[(c[C>>2]|0)+(c[n>>2]|0)>>0]|0|0)!=0){f=c[n>>2]|0;g=D+((d[(c[C>>2]|0)+(c[n>>2]|0)>>0]|0)<<2)|0;e=c[g>>2]|0;c[g>>2]=e+1;c[(c[t>>2]|0)+(e<<2)>>2]=f}c[n>>2]=(c[n>>2]|0)+1}c[j>>2]=c[s>>2];c[v>>2]=c[u>>2];c[k>>2]=1<<c[v>>2];c[x>>2]=c[k>>2];if((c[D+60>>2]|0)==1){a[y>>0]=0;b[y+2>>1]=c[c[t>>2]>>2];c[z>>2]=0;while(1){if((c[z>>2]|0)>=(c[x>>2]|0))break;e=(c[j>>2]|0)+(c[z>>2]<<2)|0;b[e+0>>1]=b[y+0>>1]|0;b[e+2>>1]=b[y+2>>1]|0;c[z>>2]=(c[z>>2]|0)+1}ub(c[t>>2]|0);c[l>>2]=c[x>>2];e=c[l>>2]|0;i=m;return e|0}c[z>>2]=0;c[n>>2]=0;c[p>>2]=1;c[w>>2]=2;while(1){if((c[p>>2]|0)>(c[u>>2]|0))break;while(1){B=c[p>>2]|0;if((c[q+(c[p>>2]<<2)>>2]|0)<=0)break;a[y>>0]=B;g=c[n>>2]|0;c[n>>2]=g+1;b[y+2>>1]=c[(c[t>>2]|0)+(g<<2)>>2];g=(c[j>>2]|0)+(c[z>>2]<<2)|0;f=c[w>>2]|0;e=c[k>>2]|0;b[A+0>>1]=b[y+0>>1]|0;b[A+2>>1]=b[y+2>>1]|0;kb(g,f,e,A);c[z>>2]=lb(c[z>>2]|0,c[p>>2]|0)|0;e=q+(c[p>>2]<<2)|0;c[e>>2]=(c[e>>2]|0)+ -1}c[p>>2]=B+1;c[w>>2]=c[w>>2]<<1}c[r>>2]=(c[x>>2]|0)-1;c[o>>2]=-1;c[p>>2]=(c[u>>2]|0)+1;c[w>>2]=2;while(1){if((c[p>>2]|0)>15)break;while(1){if((c[q+(c[p>>2]<<2)>>2]|0)<=0)break;if((c[z>>2]&c[r>>2]|0)!=(c[o>>2]|0)){c[j>>2]=(c[j>>2]|0)+(c[k>>2]<<2);c[v>>2]=mb(q,c[p>>2]|0,c[u>>2]|0)|0;c[k>>2]=1<<c[v>>2];c[x>>2]=(c[x>>2]|0)+(c[k>>2]|0);c[o>>2]=c[z>>2]&c[r>>2];a[(c[s>>2]|0)+(c[o>>2]<<2)>>0]=(c[v>>2]|0)+(c[u>>2]|0);b[(c[s>>2]|0)+(c[o>>2]<<2)+2>>1]=(((c[j>>2]|0)-(c[s>>2]|0)|0)/4|0)-(c[o>>2]|0)}a[y>>0]=(c[p>>2]|0)-(c[u>>2]|0);g=c[n>>2]|0;c[n>>2]=g+1;b[y+2>>1]=c[(c[t>>2]|0)+(g<<2)>>2];g=(c[j>>2]|0)+(c[z>>2]>>c[u>>2]<<2)|0;f=c[w>>2]|0;e=c[k>>2]|0;b[A+0>>1]=b[y+0>>1]|0;b[A+2>>1]=b[y+2>>1]|0;kb(g,f,e,A);c[z>>2]=lb(c[z>>2]|0,c[p>>2]|0)|0;e=q+(c[p>>2]<<2)|0;c[e>>2]=(c[e>>2]|0)+ -1}c[p>>2]=(c[p>>2]|0)+1;c[w>>2]=c[w>>2]<<1}ub(c[t>>2]|0);c[l>>2]=c[x>>2];e=c[l>>2]|0;i=m;return e|0}function kb(a,d,e,f){a=a|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0;g=i;i=i+16|0;k=g+8|0;j=g+4|0;h=g;c[k>>2]=a;c[j>>2]=d;c[h>>2]=e;do{c[h>>2]=(c[h>>2]|0)-(c[j>>2]|0);a=(c[k>>2]|0)+(c[h>>2]<<2)|0;b[a+0>>1]=b[f+0>>1]|0;b[a+2>>1]=b[f+2>>1]|0}while((c[h>>2]|0)>0);i=g;return}function lb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;i=i+16|0;e=d+8|0;g=d+4|0;f=d;c[e>>2]=a;c[g>>2]=b;c[f>>2]=1<<(c[g>>2]|0)-1;while(1){if((c[e>>2]&c[f>>2]|0)==0)break;c[f>>2]=c[f>>2]>>1}i=d;return(c[e>>2]&(c[f>>2]|0)-1)+(c[f>>2]|0)|0}function mb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;i=i+16|0;j=e+12|0;f=e+8|0;g=e+4|0;h=e;c[j>>2]=a;c[f>>2]=b;c[g>>2]=d;c[h>>2]=1<<(c[f>>2]|0)-(c[g>>2]|0);while(1){if((c[f>>2]|0)>=15){d=5;break}c[h>>2]=(c[h>>2]|0)-(c[(c[j>>2]|0)+(c[f>>2]<<2)>>2]|0);if((c[h>>2]|0)<=0){d=5;break}c[f>>2]=(c[f>>2]|0)+1;c[h>>2]=c[h>>2]<<1}if((d|0)==5){i=e;return(c[f>>2]|0)-(c[g>>2]|0)|0}return 0}function nb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0;e=i;i=i+16|0;f=e+12|0;g=e;h=e+8|0;j=g;c[j>>2]=a;c[j+4>>2]=b;c[h>>2]=d;a=g;if((ob(c[a>>2]|0,c[a+4>>2]|0,c[h>>2]|0)|0)==0){c[f>>2]=0;j=c[f>>2]|0;i=e;return j|0}j=g;j=Jb(c[j>>2]|0,c[j+4>>2]|0,c[h>>2]|0,0)|0;a=D;if(!(a>>>0>0|(a|0)==0&j>>>0>0))ta(128264,128288,36,128320);j=g;j=Jb(c[j>>2]|0,c[j+4>>2]|0,c[h>>2]|0,0)|0;c[f>>2]=tb(j)|0;j=c[f>>2]|0;i=e;return j|0}function ob(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+32|0;f=e+20|0;j=e+8|0;h=e+16|0;g=e;k=j;c[k>>2]=a;c[k+4>>2]=b;c[h>>2]=d;b=j;b=Jb(c[b>>2]|0,c[b+4>>2]|0,c[h>>2]|0,0)|0;a=g;c[a>>2]=b;c[a+4>>2]=D;a=j;if((c[a>>2]|0)==0&(c[a+4>>2]|0)==0){c[f>>2]=1;k=c[f>>2]|0;i=e;return k|0}a=c[h>>2]|0;k=j;k=Kb(1073741824,0,c[k>>2]|0,c[k+4>>2]|0)|0;b=D;if(0>b>>>0|0==(b|0)&a>>>0>k>>>0){c[f>>2]=0;k=c[f>>2]|0;i=e;return k|0}k=g;if((c[k+4>>2]|0)!=0?1:(c[k>>2]|0)!=(c[g>>2]|0)){c[f>>2]=0;k=c[f>>2]|0;i=e;return k|0}else{c[f>>2]=1;k=c[f>>2]|0;i=e;return k|0}return 0}function pb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+32|0;f=e+16|0;k=e+12|0;g=e+8|0;j=e+4|0;h=e;c[k>>2]=a;c[g>>2]=b;c[j>>2]=d;c[h>>2]=c[k>>2];if((c[(c[h>>2]|0)+8>>2]|0)>>>0>(c[(c[h>>2]|0)+4>>2]|0)>>>0){c[f>>2]=-1;k=c[f>>2]|0;i=e;return k|0}if(((c[(c[h>>2]|0)+8>>2]|0)+(c[j>>2]|0)|0)>>>0>(c[(c[h>>2]|0)+4>>2]|0)>>>0)c[j>>2]=(c[(c[h>>2]|0)+4>>2]|0)-(c[(c[h>>2]|0)+8>>2]|0);Ab(c[g>>2]|0,(c[c[h>>2]>>2]|0)+(c[(c[h>>2]|0)+8>>2]|0)|0,c[j>>2]|0)|0;k=(c[h>>2]|0)+8|0;c[k>>2]=(c[k>>2]|0)+(c[j>>2]|0);c[f>>2]=c[j>>2];k=c[f>>2]|0;i=e;return k|0}function qb(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+32|0;k=f+16|0;j=f+12|0;h=f+8|0;g=f;c[k>>2]=b;c[j>>2]=d;c[h>>2]=e;c[c[h>>2]>>2]=c[k>>2];c[(c[h>>2]|0)+4>>2]=c[j>>2];c[(c[h>>2]|0)+8>>2]=0;c[g>>2]=1;c[g+4>>2]=c[h>>2];c[a+0>>2]=c[g+0>>2];c[a+4>>2]=c[g+4>>2];i=f;return}function rb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+32|0;f=e+16|0;k=e+12|0;j=e+8|0;g=e+4|0;h=e;c[k>>2]=a;c[j>>2]=b;c[g>>2]=d;c[h>>2]=c[k>>2];if(((c[(c[h>>2]|0)+8>>2]|0)+(c[g>>2]|0)|0)>>>0>(c[(c[h>>2]|0)+4>>2]|0)>>>0){c[f>>2]=-1;k=c[f>>2]|0;i=e;return k|0}else{Ab((c[c[h>>2]>>2]|0)+(c[(c[h>>2]|0)+8>>2]|0)|0,c[j>>2]|0,c[g>>2]|0)|0;k=(c[h>>2]|0)+8|0;c[k>>2]=(c[k>>2]|0)+(c[g>>2]|0);c[f>>2]=c[g>>2];k=c[f>>2]|0;i=e;return k|0}return 0}function sb(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0;f=i;i=i+32|0;k=f+16|0;j=f+12|0;h=f+8|0;g=f;c[k>>2]=b;c[j>>2]=d;c[h>>2]=e;c[c[h>>2]>>2]=c[k>>2];c[(c[h>>2]|0)+4>>2]=c[j>>2];c[(c[h>>2]|0)+8>>2]=0;c[g>>2]=2;c[g+4>>2]=c[h>>2];c[a+0>>2]=c[g+0>>2];c[a+4>>2]=c[g+4>>2];i=f;return}function tb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;b=i;do if(a>>>0<245){if(a>>>0<11)a=16;else a=a+11&-8;v=a>>>3;p=c[32086]|0;w=p>>>v;if((w&3|0)!=0){h=(w&1^1)+v|0;g=h<<1;e=128384+(g<<2)|0;g=128384+(g+2<<2)|0;j=c[g>>2]|0;d=j+8|0;f=c[d>>2]|0;do if((e|0)!=(f|0)){if(f>>>0<(c[32090]|0)>>>0)ja();k=f+12|0;if((c[k>>2]|0)==(j|0)){c[k>>2]=e;c[g>>2]=f;break}else ja()}else c[32086]=p&~(1<<h);while(0);H=h<<3;c[j+4>>2]=H|3;H=j+(H|4)|0;c[H>>2]=c[H>>2]|1;H=d;i=b;return H|0}if(a>>>0>(c[32088]|0)>>>0){if((w|0)!=0){h=2<<v;h=w<<v&(h|0-h);h=(h&0-h)+ -1|0;d=h>>>12&16;h=h>>>d;f=h>>>5&8;h=h>>>f;g=h>>>2&4;h=h>>>g;e=h>>>1&2;h=h>>>e;j=h>>>1&1;j=(f|d|g|e|j)+(h>>>j)|0;h=j<<1;e=128384+(h<<2)|0;h=128384+(h+2<<2)|0;g=c[h>>2]|0;d=g+8|0;f=c[d>>2]|0;do if((e|0)!=(f|0)){if(f>>>0<(c[32090]|0)>>>0)ja();k=f+12|0;if((c[k>>2]|0)==(g|0)){c[k>>2]=e;c[h>>2]=f;break}else ja()}else c[32086]=p&~(1<<j);while(0);h=j<<3;f=h-a|0;c[g+4>>2]=a|3;e=g+a|0;c[g+(a|4)>>2]=f|1;c[g+h>>2]=f;h=c[32088]|0;if((h|0)!=0){g=c[32091]|0;k=h>>>3;j=k<<1;h=128384+(j<<2)|0;l=c[32086]|0;k=1<<k;if((l&k|0)!=0){j=128384+(j+2<<2)|0;k=c[j>>2]|0;if(k>>>0<(c[32090]|0)>>>0)ja();else{D=j;C=k}}else{c[32086]=l|k;D=128384+(j+2<<2)|0;C=h}c[D>>2]=g;c[C+12>>2]=g;c[g+8>>2]=C;c[g+12>>2]=h}c[32088]=f;c[32091]=e;H=d;i=b;return H|0}p=c[32087]|0;if((p|0)!=0){e=(p&0-p)+ -1|0;G=e>>>12&16;e=e>>>G;F=e>>>5&8;e=e>>>F;H=e>>>2&4;e=e>>>H;f=e>>>1&2;e=e>>>f;d=e>>>1&1;d=c[128648+((F|G|H|f|d)+(e>>>d)<<2)>>2]|0;e=(c[d+4>>2]&-8)-a|0;f=d;while(1){g=c[f+16>>2]|0;if((g|0)==0){g=c[f+20>>2]|0;if((g|0)==0)break}f=(c[g+4>>2]&-8)-a|0;H=f>>>0<e>>>0;e=H?f:e;f=g;d=H?g:d}h=c[32090]|0;if(d>>>0<h>>>0)ja();f=d+a|0;if(!(d>>>0<f>>>0))ja();g=c[d+24>>2]|0;k=c[d+12>>2]|0;do if((k|0)==(d|0)){k=d+20|0;j=c[k>>2]|0;if((j|0)==0){k=d+16|0;j=c[k>>2]|0;if((j|0)==0){B=0;break}}while(1){l=j+20|0;m=c[l>>2]|0;if((m|0)!=0){j=m;k=l;continue}m=j+16|0;l=c[m>>2]|0;if((l|0)==0)break;else{j=l;k=m}}if(k>>>0<h>>>0)ja();else{c[k>>2]=0;B=j;break}}else{j=c[d+8>>2]|0;if(j>>>0<h>>>0)ja();h=j+12|0;if((c[h>>2]|0)!=(d|0))ja();l=k+8|0;if((c[l>>2]|0)==(d|0)){c[h>>2]=k;c[l>>2]=j;B=k;break}else ja()}while(0);do if((g|0)!=0){h=c[d+28>>2]|0;j=128648+(h<<2)|0;if((d|0)==(c[j>>2]|0)){c[j>>2]=B;if((B|0)==0){c[32087]=c[32087]&~(1<<h);break}}else{if(g>>>0<(c[32090]|0)>>>0)ja();h=g+16|0;if((c[h>>2]|0)==(d|0))c[h>>2]=B;else c[g+20>>2]=B;if((B|0)==0)break}if(B>>>0<(c[32090]|0)>>>0)ja();c[B+24>>2]=g;g=c[d+16>>2]|0;do if((g|0)!=0)if(g>>>0<(c[32090]|0)>>>0)ja();else{c[B+16>>2]=g;c[g+24>>2]=B;break}while(0);g=c[d+20>>2]|0;if((g|0)!=0)if(g>>>0<(c[32090]|0)>>>0)ja();else{c[B+20>>2]=g;c[g+24>>2]=B;break}}while(0);if(e>>>0<16){H=e+a|0;c[d+4>>2]=H|3;H=d+(H+4)|0;c[H>>2]=c[H>>2]|1}else{c[d+4>>2]=a|3;c[d+(a|4)>>2]=e|1;c[d+(e+a)>>2]=e;h=c[32088]|0;if((h|0)!=0){g=c[32091]|0;l=h>>>3;j=l<<1;h=128384+(j<<2)|0;k=c[32086]|0;l=1<<l;if((k&l|0)!=0){j=128384+(j+2<<2)|0;k=c[j>>2]|0;if(k>>>0<(c[32090]|0)>>>0)ja();else{A=j;z=k}}else{c[32086]=k|l;A=128384+(j+2<<2)|0;z=h}c[A>>2]=g;c[z+12>>2]=g;c[g+8>>2]=z;c[g+12>>2]=h}c[32088]=e;c[32091]=f}H=d+8|0;i=b;return H|0}}}else if(!(a>>>0>4294967231)){z=a+11|0;a=z&-8;B=c[32087]|0;if((B|0)!=0){A=0-a|0;z=z>>>8;if((z|0)!=0)if(a>>>0>16777215)C=31;else{G=(z+1048320|0)>>>16&8;H=z<<G;F=(H+520192|0)>>>16&4;H=H<<F;C=(H+245760|0)>>>16&2;C=14-(F|G|C)+(H<<C>>>15)|0;C=a>>>(C+7|0)&1|C<<1}else C=0;D=c[128648+(C<<2)>>2]|0;a:do if((D|0)==0){F=0;z=0}else{if((C|0)==31)z=0;else z=25-(C>>>1)|0;F=0;E=a<<z;z=0;while(1){H=c[D+4>>2]&-8;G=H-a|0;if(G>>>0<A>>>0)if((H|0)==(a|0)){A=G;F=D;z=D;break a}else{A=G;z=D}H=c[D+20>>2]|0;D=c[D+(E>>>31<<2)+16>>2]|0;F=(H|0)==0|(H|0)==(D|0)?F:H;if((D|0)==0)break;else E=E<<1}}while(0);if((F|0)==0&(z|0)==0){H=2<<C;B=B&(H|0-H);if((B|0)==0)break;H=(B&0-B)+ -1|0;D=H>>>12&16;H=H>>>D;C=H>>>5&8;H=H>>>C;E=H>>>2&4;H=H>>>E;G=H>>>1&2;H=H>>>G;F=H>>>1&1;F=c[128648+((C|D|E|G|F)+(H>>>F)<<2)>>2]|0}if((F|0)!=0)while(1){H=(c[F+4>>2]&-8)-a|0;B=H>>>0<A>>>0;A=B?H:A;z=B?F:z;B=c[F+16>>2]|0;if((B|0)!=0){F=B;continue}F=c[F+20>>2]|0;if((F|0)==0)break}if((z|0)!=0?A>>>0<((c[32088]|0)-a|0)>>>0:0){f=c[32090]|0;if(z>>>0<f>>>0)ja();d=z+a|0;if(!(z>>>0<d>>>0))ja();e=c[z+24>>2]|0;h=c[z+12>>2]|0;do if((h|0)==(z|0)){h=z+20|0;g=c[h>>2]|0;if((g|0)==0){h=z+16|0;g=c[h>>2]|0;if((g|0)==0){x=0;break}}while(1){j=g+20|0;k=c[j>>2]|0;if((k|0)!=0){g=k;h=j;continue}j=g+16|0;k=c[j>>2]|0;if((k|0)==0)break;else{g=k;h=j}}if(h>>>0<f>>>0)ja();else{c[h>>2]=0;x=g;break}}else{g=c[z+8>>2]|0;if(g>>>0<f>>>0)ja();f=g+12|0;if((c[f>>2]|0)!=(z|0))ja();j=h+8|0;if((c[j>>2]|0)==(z|0)){c[f>>2]=h;c[j>>2]=g;x=h;break}else ja()}while(0);do if((e|0)!=0){g=c[z+28>>2]|0;f=128648+(g<<2)|0;if((z|0)==(c[f>>2]|0)){c[f>>2]=x;if((x|0)==0){c[32087]=c[32087]&~(1<<g);break}}else{if(e>>>0<(c[32090]|0)>>>0)ja();f=e+16|0;if((c[f>>2]|0)==(z|0))c[f>>2]=x;else c[e+20>>2]=x;if((x|0)==0)break}if(x>>>0<(c[32090]|0)>>>0)ja();c[x+24>>2]=e;e=c[z+16>>2]|0;do if((e|0)!=0)if(e>>>0<(c[32090]|0)>>>0)ja();else{c[x+16>>2]=e;c[e+24>>2]=x;break}while(0);e=c[z+20>>2]|0;if((e|0)!=0)if(e>>>0<(c[32090]|0)>>>0)ja();else{c[x+20>>2]=e;c[e+24>>2]=x;break}}while(0);b:do if(!(A>>>0<16)){c[z+4>>2]=a|3;c[z+(a|4)>>2]=A|1;c[z+(A+a)>>2]=A;f=A>>>3;if(A>>>0<256){h=f<<1;e=128384+(h<<2)|0;g=c[32086]|0;f=1<<f;do if((g&f|0)==0){c[32086]=g|f;w=128384+(h+2<<2)|0;v=e}else{f=128384+(h+2<<2)|0;g=c[f>>2]|0;if(!(g>>>0<(c[32090]|0)>>>0)){w=f;v=g;break}ja()}while(0);c[w>>2]=d;c[v+12>>2]=d;c[z+(a+8)>>2]=v;c[z+(a+12)>>2]=e;break}e=A>>>8;if((e|0)!=0)if(A>>>0>16777215)e=31;else{G=(e+1048320|0)>>>16&8;H=e<<G;F=(H+520192|0)>>>16&4;H=H<<F;e=(H+245760|0)>>>16&2;e=14-(F|G|e)+(H<<e>>>15)|0;e=A>>>(e+7|0)&1|e<<1}else e=0;f=128648+(e<<2)|0;c[z+(a+28)>>2]=e;c[z+(a+20)>>2]=0;c[z+(a+16)>>2]=0;h=c[32087]|0;g=1<<e;if((h&g|0)==0){c[32087]=h|g;c[f>>2]=d;c[z+(a+24)>>2]=f;c[z+(a+12)>>2]=d;c[z+(a+8)>>2]=d;break}f=c[f>>2]|0;if((e|0)==31)e=0;else e=25-(e>>>1)|0;c:do if((c[f+4>>2]&-8|0)!=(A|0)){e=A<<e;while(1){g=f+(e>>>31<<2)+16|0;h=c[g>>2]|0;if((h|0)==0)break;if((c[h+4>>2]&-8|0)==(A|0)){p=h;break c}else{e=e<<1;f=h}}if(g>>>0<(c[32090]|0)>>>0)ja();else{c[g>>2]=d;c[z+(a+24)>>2]=f;c[z+(a+12)>>2]=d;c[z+(a+8)>>2]=d;break b}}else p=f;while(0);f=p+8|0;e=c[f>>2]|0;g=c[32090]|0;if(p>>>0<g>>>0)ja();if(e>>>0<g>>>0)ja();else{c[e+12>>2]=d;c[f>>2]=d;c[z+(a+8)>>2]=e;c[z+(a+12)>>2]=p;c[z+(a+24)>>2]=0;break}}else{H=A+a|0;c[z+4>>2]=H|3;H=z+(H+4)|0;c[H>>2]=c[H>>2]|1}while(0);H=z+8|0;i=b;return H|0}}}else a=-1;while(0);p=c[32088]|0;if(!(a>>>0>p>>>0)){e=p-a|0;d=c[32091]|0;if(e>>>0>15){c[32091]=d+a;c[32088]=e;c[d+(a+4)>>2]=e|1;c[d+p>>2]=e;c[d+4>>2]=a|3}else{c[32088]=0;c[32091]=0;c[d+4>>2]=p|3;H=d+(p+4)|0;c[H>>2]=c[H>>2]|1}H=d+8|0;i=b;return H|0}p=c[32089]|0;if(a>>>0<p>>>0){G=p-a|0;c[32089]=G;H=c[32092]|0;c[32092]=H+a;c[H+(a+4)>>2]=G|1;c[H+4>>2]=a|3;H=H+8|0;i=b;return H|0}do if((c[32204]|0)==0){p=ea(30)|0;if((p+ -1&p|0)==0){c[32206]=p;c[32205]=p;c[32207]=-1;c[32208]=-1;c[32209]=0;c[32197]=0;c[32204]=(ga(0)|0)&-16^1431655768;break}else ja()}while(0);w=a+48|0;p=c[32206]|0;x=a+47|0;z=p+x|0;p=0-p|0;v=z&p;if(!(v>>>0>a>>>0)){H=0;i=b;return H|0}A=c[32196]|0;if((A|0)!=0?(G=c[32194]|0,H=G+v|0,H>>>0<=G>>>0|H>>>0>A>>>0):0){H=0;i=b;return H|0}d:do if((c[32197]&4|0)==0){B=c[32092]|0;e:do if((B|0)!=0){A=128792|0;while(1){C=c[A>>2]|0;if(!(C>>>0>B>>>0)?(y=A+4|0,(C+(c[y>>2]|0)|0)>>>0>B>>>0):0)break;A=c[A+8>>2]|0;if((A|0)==0){o=182;break e}}if((A|0)!=0){B=z-(c[32089]|0)&p;if(B>>>0<2147483647){p=ma(B|0)|0;A=(p|0)==((c[A>>2]|0)+(c[y>>2]|0)|0);y=p;z=B;p=A?p:-1;A=A?B:0;o=191}else A=0}else o=182}else o=182;while(0);do if((o|0)==182){p=ma(0)|0;if((p|0)!=(-1|0)){z=p;A=c[32205]|0;y=A+ -1|0;if((y&z|0)==0)A=v;else A=v-z+(y+z&0-A)|0;y=c[32194]|0;z=y+A|0;if(A>>>0>a>>>0&A>>>0<2147483647){H=c[32196]|0;if((H|0)!=0?z>>>0<=y>>>0|z>>>0>H>>>0:0){A=0;break}y=ma(A|0)|0;o=(y|0)==(p|0);z=A;p=o?p:-1;A=o?A:0;o=191}else A=0}else A=0}while(0);f:do if((o|0)==191){o=0-z|0;if((p|0)!=(-1|0)){q=A;o=202;break d}do if((y|0)!=(-1|0)&z>>>0<2147483647&z>>>0<w>>>0?(u=c[32206]|0,u=x-z+u&0-u,u>>>0<2147483647):0)if((ma(u|0)|0)==(-1|0)){ma(o|0)|0;break f}else{z=u+z|0;break}while(0);if((y|0)!=(-1|0)){p=y;q=z;o=202;break d}}while(0);c[32197]=c[32197]|4;o=199}else{A=0;o=199}while(0);if((((o|0)==199?v>>>0<2147483647:0)?(t=ma(v|0)|0,s=ma(0)|0,(s|0)!=(-1|0)&(t|0)!=(-1|0)&t>>>0<s>>>0):0)?(r=s-t|0,q=r>>>0>(a+40|0)>>>0,q):0){p=t;q=q?r:A;o=202}if((o|0)==202){r=(c[32194]|0)+q|0;c[32194]=r;if(r>>>0>(c[32195]|0)>>>0)c[32195]=r;r=c[32092]|0;g:do if((r|0)!=0){v=128792|0;while(1){t=c[v>>2]|0;u=v+4|0;s=c[u>>2]|0;if((p|0)==(t+s|0)){o=214;break}w=c[v+8>>2]|0;if((w|0)==0)break;else v=w}if(((o|0)==214?(c[v+12>>2]&8|0)==0:0)?r>>>0>=t>>>0&r>>>0<p>>>0:0){c[u>>2]=s+q;d=(c[32089]|0)+q|0;e=r+8|0;if((e&7|0)==0)e=0;else e=0-e&7;H=d-e|0;c[32092]=r+e;c[32089]=H;c[r+(e+4)>>2]=H|1;c[r+(d+4)>>2]=40;c[32093]=c[32208];break}if(p>>>0<(c[32090]|0)>>>0)c[32090]=p;t=p+q|0;s=128792|0;while(1){if((c[s>>2]|0)==(t|0)){o=224;break}u=c[s+8>>2]|0;if((u|0)==0)break;else s=u}if((o|0)==224?(c[s+12>>2]&8|0)==0:0){c[s>>2]=p;h=s+4|0;c[h>>2]=(c[h>>2]|0)+q;h=p+8|0;if((h&7|0)==0)h=0;else h=0-h&7;j=p+(q+8)|0;if((j&7|0)==0)n=0;else n=0-j&7;o=p+(n+q)|0;j=h+a|0;k=p+j|0;m=o-(p+h)-a|0;c[p+(h+4)>>2]=a|3;h:do if((o|0)!=(c[32092]|0)){if((o|0)==(c[32091]|0)){H=(c[32088]|0)+m|0;c[32088]=H;c[32091]=k;c[p+(j+4)>>2]=H|1;c[p+(H+j)>>2]=H;break}r=q+4|0;t=c[p+(r+n)>>2]|0;if((t&3|0)==1){a=t&-8;s=t>>>3;i:do if(!(t>>>0<256)){l=c[p+((n|24)+q)>>2]|0;u=c[p+(q+12+n)>>2]|0;do if((u|0)==(o|0)){u=n|16;t=p+(r+u)|0;s=c[t>>2]|0;if((s|0)==0){t=p+(u+q)|0;s=c[t>>2]|0;if((s|0)==0){g=0;break}}while(1){u=s+20|0;v=c[u>>2]|0;if((v|0)!=0){s=v;t=u;continue}u=s+16|0;v=c[u>>2]|0;if((v|0)==0)break;else{s=v;t=u}}if(t>>>0<(c[32090]|0)>>>0)ja();else{c[t>>2]=0;g=s;break}}else{t=c[p+((n|8)+q)>>2]|0;if(t>>>0<(c[32090]|0)>>>0)ja();v=t+12|0;if((c[v>>2]|0)!=(o|0))ja();s=u+8|0;if((c[s>>2]|0)==(o|0)){c[v>>2]=u;c[s>>2]=t;g=u;break}else ja()}while(0);if((l|0)==0)break;t=c[p+(q+28+n)>>2]|0;s=128648+(t<<2)|0;do if((o|0)!=(c[s>>2]|0)){if(l>>>0<(c[32090]|0)>>>0)ja();s=l+16|0;if((c[s>>2]|0)==(o|0))c[s>>2]=g;else c[l+20>>2]=g;if((g|0)==0)break i}else{c[s>>2]=g;if((g|0)!=0)break;c[32087]=c[32087]&~(1<<t);break i}while(0);if(g>>>0<(c[32090]|0)>>>0)ja();c[g+24>>2]=l;l=n|16;o=c[p+(l+q)>>2]|0;do if((o|0)!=0)if(o>>>0<(c[32090]|0)>>>0)ja();else{c[g+16>>2]=o;c[o+24>>2]=g;break}while(0);l=c[p+(r+l)>>2]|0;if((l|0)==0)break;if(l>>>0<(c[32090]|0)>>>0)ja();else{c[g+20>>2]=l;c[l+24>>2]=g;break}}else{r=c[p+((n|8)+q)>>2]|0;g=c[p+(q+12+n)>>2]|0;t=128384+(s<<1<<2)|0;do if((r|0)!=(t|0)){if(r>>>0<(c[32090]|0)>>>0)ja();if((c[r+12>>2]|0)==(o|0))break;ja()}while(0);if((g|0)==(r|0)){c[32086]=c[32086]&~(1<<s);break}do if((g|0)==(t|0))l=g+8|0;else{if(g>>>0<(c[32090]|0)>>>0)ja();s=g+8|0;if((c[s>>2]|0)==(o|0)){l=s;break}ja()}while(0);c[r+12>>2]=g;c[l>>2]=r}while(0);o=p+((a|n)+q)|0;m=a+m|0}g=o+4|0;c[g>>2]=c[g>>2]&-2;c[p+(j+4)>>2]=m|1;c[p+(m+j)>>2]=m;g=m>>>3;if(m>>>0<256){m=g<<1;d=128384+(m<<2)|0;l=c[32086]|0;g=1<<g;do if((l&g|0)==0){c[32086]=l|g;f=128384+(m+2<<2)|0;e=d}else{l=128384+(m+2<<2)|0;g=c[l>>2]|0;if(!(g>>>0<(c[32090]|0)>>>0)){f=l;e=g;break}ja()}while(0);c[f>>2]=k;c[e+12>>2]=k;c[p+(j+8)>>2]=e;c[p+(j+12)>>2]=d;break}e=m>>>8;do if((e|0)==0)e=0;else{if(m>>>0>16777215){e=31;break}G=(e+1048320|0)>>>16&8;H=e<<G;F=(H+520192|0)>>>16&4;H=H<<F;e=(H+245760|0)>>>16&2;e=14-(F|G|e)+(H<<e>>>15)|0;e=m>>>(e+7|0)&1|e<<1}while(0);l=128648+(e<<2)|0;c[p+(j+28)>>2]=e;c[p+(j+20)>>2]=0;c[p+(j+16)>>2]=0;f=c[32087]|0;g=1<<e;if((f&g|0)==0){c[32087]=f|g;c[l>>2]=k;c[p+(j+24)>>2]=l;c[p+(j+12)>>2]=k;c[p+(j+8)>>2]=k;break}l=c[l>>2]|0;if((e|0)==31)e=0;else e=25-(e>>>1)|0;j:do if((c[l+4>>2]&-8|0)!=(m|0)){e=m<<e;while(1){g=l+(e>>>31<<2)+16|0;f=c[g>>2]|0;if((f|0)==0)break;if((c[f+4>>2]&-8|0)==(m|0)){d=f;break j}else{e=e<<1;l=f}}if(g>>>0<(c[32090]|0)>>>0)ja();else{c[g>>2]=k;c[p+(j+24)>>2]=l;c[p+(j+12)>>2]=k;c[p+(j+8)>>2]=k;break h}}else d=l;while(0);f=d+8|0;e=c[f>>2]|0;g=c[32090]|0;if(d>>>0<g>>>0)ja();if(e>>>0<g>>>0)ja();else{c[e+12>>2]=k;c[f>>2]=k;c[p+(j+8)>>2]=e;c[p+(j+12)>>2]=d;c[p+(j+24)>>2]=0;break}}else{H=(c[32089]|0)+m|0;c[32089]=H;c[32092]=k;c[p+(j+4)>>2]=H|1}while(0);H=p+(h|8)|0;i=b;return H|0}e=128792|0;while(1){d=c[e>>2]|0;if(!(d>>>0>r>>>0)?(n=c[e+4>>2]|0,m=d+n|0,m>>>0>r>>>0):0)break;e=c[e+8>>2]|0}e=d+(n+ -39)|0;if((e&7|0)==0)e=0;else e=0-e&7;d=d+(n+ -47+e)|0;d=d>>>0<(r+16|0)>>>0?r:d;e=d+8|0;f=p+8|0;if((f&7|0)==0)f=0;else f=0-f&7;H=q+ -40-f|0;c[32092]=p+f;c[32089]=H;c[p+(f+4)>>2]=H|1;c[p+(q+ -36)>>2]=40;c[32093]=c[32208];c[d+4>>2]=27;c[e+0>>2]=c[32198];c[e+4>>2]=c[32199];c[e+8>>2]=c[32200];c[e+12>>2]=c[32201];c[32198]=p;c[32199]=q;c[32201]=0;c[32200]=e;e=d+28|0;c[e>>2]=7;if((d+32|0)>>>0<m>>>0)do{H=e;e=e+4|0;c[e>>2]=7}while((H+8|0)>>>0<m>>>0);if((d|0)!=(r|0)){d=d-r|0;e=r+(d+4)|0;c[e>>2]=c[e>>2]&-2;c[r+4>>2]=d|1;c[r+d>>2]=d;e=d>>>3;if(d>>>0<256){g=e<<1;d=128384+(g<<2)|0;f=c[32086]|0;e=1<<e;do if((f&e|0)==0){c[32086]=f|e;k=128384+(g+2<<2)|0;j=d}else{f=128384+(g+2<<2)|0;e=c[f>>2]|0;if(!(e>>>0<(c[32090]|0)>>>0)){k=f;j=e;break}ja()}while(0);c[k>>2]=r;c[j+12>>2]=r;c[r+8>>2]=j;c[r+12>>2]=d;break}e=d>>>8;if((e|0)!=0)if(d>>>0>16777215)e=31;else{G=(e+1048320|0)>>>16&8;H=e<<G;F=(H+520192|0)>>>16&4;H=H<<F;e=(H+245760|0)>>>16&2;e=14-(F|G|e)+(H<<e>>>15)|0;e=d>>>(e+7|0)&1|e<<1}else e=0;j=128648+(e<<2)|0;c[r+28>>2]=e;c[r+20>>2]=0;c[r+16>>2]=0;f=c[32087]|0;g=1<<e;if((f&g|0)==0){c[32087]=f|g;c[j>>2]=r;c[r+24>>2]=j;c[r+12>>2]=r;c[r+8>>2]=r;break}f=c[j>>2]|0;if((e|0)==31)e=0;else e=25-(e>>>1)|0;k:do if((c[f+4>>2]&-8|0)!=(d|0)){e=d<<e;while(1){j=f+(e>>>31<<2)+16|0;g=c[j>>2]|0;if((g|0)==0)break;if((c[g+4>>2]&-8|0)==(d|0)){h=g;break k}else{e=e<<1;f=g}}if(j>>>0<(c[32090]|0)>>>0)ja();else{c[j>>2]=r;c[r+24>>2]=f;c[r+12>>2]=r;c[r+8>>2]=r;break g}}else h=f;while(0);f=h+8|0;e=c[f>>2]|0;d=c[32090]|0;if(h>>>0<d>>>0)ja();if(e>>>0<d>>>0)ja();else{c[e+12>>2]=r;c[f>>2]=r;c[r+8>>2]=e;c[r+12>>2]=h;c[r+24>>2]=0;break}}}else{H=c[32090]|0;if((H|0)==0|p>>>0<H>>>0)c[32090]=p;c[32198]=p;c[32199]=q;c[32201]=0;c[32095]=c[32204];c[32094]=-1;d=0;do{H=d<<1;G=128384+(H<<2)|0;c[128384+(H+3<<2)>>2]=G;c[128384+(H+2<<2)>>2]=G;d=d+1|0}while((d|0)!=32);d=p+8|0;if((d&7|0)==0)d=0;else d=0-d&7;H=q+ -40-d|0;c[32092]=p+d;c[32089]=H;c[p+(d+4)>>2]=H|1;c[p+(q+ -36)>>2]=40;c[32093]=c[32208]}while(0);d=c[32089]|0;if(d>>>0>a>>>0){G=d-a|0;c[32089]=G;H=c[32092]|0;c[32092]=H+a;c[H+(a+4)>>2]=G|1;c[H+4>>2]=a|3;H=H+8|0;i=b;return H|0}}c[(ua()|0)>>2]=12;H=0;i=b;return H|0}function ub(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;b=i;if((a|0)==0){i=b;return}q=a+ -8|0;r=c[32090]|0;if(q>>>0<r>>>0)ja();o=c[a+ -4>>2]|0;n=o&3;if((n|0)==1)ja();j=o&-8;h=a+(j+ -8)|0;do if((o&1|0)==0){u=c[q>>2]|0;if((n|0)==0){i=b;return}q=-8-u|0;o=a+q|0;n=u+j|0;if(o>>>0<r>>>0)ja();if((o|0)==(c[32091]|0)){d=a+(j+ -4)|0;if((c[d>>2]&3|0)!=3){d=o;m=n;break}c[32088]=n;c[d>>2]=c[d>>2]&-2;c[a+(q+4)>>2]=n|1;c[h>>2]=n;i=b;return}t=u>>>3;if(u>>>0<256){d=c[a+(q+8)>>2]|0;m=c[a+(q+12)>>2]|0;p=128384+(t<<1<<2)|0;if((d|0)!=(p|0)){if(d>>>0<r>>>0)ja();if((c[d+12>>2]|0)!=(o|0))ja()}if((m|0)==(d|0)){c[32086]=c[32086]&~(1<<t);d=o;m=n;break}if((m|0)!=(p|0)){if(m>>>0<r>>>0)ja();p=m+8|0;if((c[p>>2]|0)==(o|0))s=p;else ja()}else s=m+8|0;c[d+12>>2]=m;c[s>>2]=d;d=o;m=n;break}s=c[a+(q+24)>>2]|0;t=c[a+(q+12)>>2]|0;do if((t|0)==(o|0)){u=a+(q+20)|0;t=c[u>>2]|0;if((t|0)==0){u=a+(q+16)|0;t=c[u>>2]|0;if((t|0)==0){p=0;break}}while(1){w=t+20|0;v=c[w>>2]|0;if((v|0)!=0){t=v;u=w;continue}v=t+16|0;w=c[v>>2]|0;if((w|0)==0)break;else{t=w;u=v}}if(u>>>0<r>>>0)ja();else{c[u>>2]=0;p=t;break}}else{u=c[a+(q+8)>>2]|0;if(u>>>0<r>>>0)ja();r=u+12|0;if((c[r>>2]|0)!=(o|0))ja();v=t+8|0;if((c[v>>2]|0)==(o|0)){c[r>>2]=t;c[v>>2]=u;p=t;break}else ja()}while(0);if((s|0)!=0){t=c[a+(q+28)>>2]|0;r=128648+(t<<2)|0;if((o|0)==(c[r>>2]|0)){c[r>>2]=p;if((p|0)==0){c[32087]=c[32087]&~(1<<t);d=o;m=n;break}}else{if(s>>>0<(c[32090]|0)>>>0)ja();r=s+16|0;if((c[r>>2]|0)==(o|0))c[r>>2]=p;else c[s+20>>2]=p;if((p|0)==0){d=o;m=n;break}}if(p>>>0<(c[32090]|0)>>>0)ja();c[p+24>>2]=s;r=c[a+(q+16)>>2]|0;do if((r|0)!=0)if(r>>>0<(c[32090]|0)>>>0)ja();else{c[p+16>>2]=r;c[r+24>>2]=p;break}while(0);q=c[a+(q+20)>>2]|0;if((q|0)!=0)if(q>>>0<(c[32090]|0)>>>0)ja();else{c[p+20>>2]=q;c[q+24>>2]=p;d=o;m=n;break}else{d=o;m=n}}else{d=o;m=n}}else{d=q;m=j}while(0);if(!(d>>>0<h>>>0))ja();n=a+(j+ -4)|0;o=c[n>>2]|0;if((o&1|0)==0)ja();if((o&2|0)==0){if((h|0)==(c[32092]|0)){w=(c[32089]|0)+m|0;c[32089]=w;c[32092]=d;c[d+4>>2]=w|1;if((d|0)!=(c[32091]|0)){i=b;return}c[32091]=0;c[32088]=0;i=b;return}if((h|0)==(c[32091]|0)){w=(c[32088]|0)+m|0;c[32088]=w;c[32091]=d;c[d+4>>2]=w|1;c[d+w>>2]=w;i=b;return}m=(o&-8)+m|0;n=o>>>3;do if(!(o>>>0<256)){l=c[a+(j+16)>>2]|0;q=c[a+(j|4)>>2]|0;do if((q|0)==(h|0)){o=a+(j+12)|0;n=c[o>>2]|0;if((n|0)==0){o=a+(j+8)|0;n=c[o>>2]|0;if((n|0)==0){k=0;break}}while(1){p=n+20|0;q=c[p>>2]|0;if((q|0)!=0){n=q;o=p;continue}p=n+16|0;q=c[p>>2]|0;if((q|0)==0)break;else{n=q;o=p}}if(o>>>0<(c[32090]|0)>>>0)ja();else{c[o>>2]=0;k=n;break}}else{o=c[a+j>>2]|0;if(o>>>0<(c[32090]|0)>>>0)ja();p=o+12|0;if((c[p>>2]|0)!=(h|0))ja();n=q+8|0;if((c[n>>2]|0)==(h|0)){c[p>>2]=q;c[n>>2]=o;k=q;break}else ja()}while(0);if((l|0)!=0){n=c[a+(j+20)>>2]|0;o=128648+(n<<2)|0;if((h|0)==(c[o>>2]|0)){c[o>>2]=k;if((k|0)==0){c[32087]=c[32087]&~(1<<n);break}}else{if(l>>>0<(c[32090]|0)>>>0)ja();n=l+16|0;if((c[n>>2]|0)==(h|0))c[n>>2]=k;else c[l+20>>2]=k;if((k|0)==0)break}if(k>>>0<(c[32090]|0)>>>0)ja();c[k+24>>2]=l;h=c[a+(j+8)>>2]|0;do if((h|0)!=0)if(h>>>0<(c[32090]|0)>>>0)ja();else{c[k+16>>2]=h;c[h+24>>2]=k;break}while(0);h=c[a+(j+12)>>2]|0;if((h|0)!=0)if(h>>>0<(c[32090]|0)>>>0)ja();else{c[k+20>>2]=h;c[h+24>>2]=k;break}}}else{k=c[a+j>>2]|0;a=c[a+(j|4)>>2]|0;j=128384+(n<<1<<2)|0;if((k|0)!=(j|0)){if(k>>>0<(c[32090]|0)>>>0)ja();if((c[k+12>>2]|0)!=(h|0))ja()}if((a|0)==(k|0)){c[32086]=c[32086]&~(1<<n);break}if((a|0)!=(j|0)){if(a>>>0<(c[32090]|0)>>>0)ja();j=a+8|0;if((c[j>>2]|0)==(h|0))l=j;else ja()}else l=a+8|0;c[k+12>>2]=a;c[l>>2]=k}while(0);c[d+4>>2]=m|1;c[d+m>>2]=m;if((d|0)==(c[32091]|0)){c[32088]=m;i=b;return}}else{c[n>>2]=o&-2;c[d+4>>2]=m|1;c[d+m>>2]=m}h=m>>>3;if(m>>>0<256){a=h<<1;e=128384+(a<<2)|0;j=c[32086]|0;h=1<<h;if((j&h|0)!=0){h=128384+(a+2<<2)|0;a=c[h>>2]|0;if(a>>>0<(c[32090]|0)>>>0)ja();else{f=h;g=a}}else{c[32086]=j|h;f=128384+(a+2<<2)|0;g=e}c[f>>2]=d;c[g+12>>2]=d;c[d+8>>2]=g;c[d+12>>2]=e;i=b;return}f=m>>>8;if((f|0)!=0)if(m>>>0>16777215)f=31;else{v=(f+1048320|0)>>>16&8;w=f<<v;u=(w+520192|0)>>>16&4;w=w<<u;f=(w+245760|0)>>>16&2;f=14-(u|v|f)+(w<<f>>>15)|0;f=m>>>(f+7|0)&1|f<<1}else f=0;g=128648+(f<<2)|0;c[d+28>>2]=f;c[d+20>>2]=0;c[d+16>>2]=0;a=c[32087]|0;h=1<<f;a:do if((a&h|0)!=0){g=c[g>>2]|0;if((f|0)==31)f=0;else f=25-(f>>>1)|0;b:do if((c[g+4>>2]&-8|0)!=(m|0)){f=m<<f;a=g;while(1){h=a+(f>>>31<<2)+16|0;g=c[h>>2]|0;if((g|0)==0)break;if((c[g+4>>2]&-8|0)==(m|0)){e=g;break b}else{f=f<<1;a=g}}if(h>>>0<(c[32090]|0)>>>0)ja();else{c[h>>2]=d;c[d+24>>2]=a;c[d+12>>2]=d;c[d+8>>2]=d;break a}}else e=g;while(0);g=e+8|0;f=c[g>>2]|0;h=c[32090]|0;if(e>>>0<h>>>0)ja();if(f>>>0<h>>>0)ja();else{c[f+12>>2]=d;c[g>>2]=d;c[d+8>>2]=f;c[d+12>>2]=e;c[d+24>>2]=0;break}}else{c[32087]=a|h;c[g>>2]=d;c[d+24>>2]=g;c[d+12>>2]=d;c[d+8>>2]=d}while(0);w=(c[32094]|0)+ -1|0;c[32094]=w;if((w|0)==0)d=128800|0;else{i=b;return}while(1){d=c[d>>2]|0;if((d|0)==0)break;else d=d+8|0}c[32094]=-1;i=b;return}function vb(){}function wb(b){b=b|0;var c=0;c=b;while(a[c>>0]|0)c=c+1|0;return c-b|0}function xb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;i=b&3;h=d|d<<8|d<<16|d<<24;g=f&~3;if(i){i=b+4-i|0;while((b|0)<(i|0)){a[b>>0]=d;b=b+1|0}}while((b|0)<(g|0)){c[b>>2]=h;b=b+4|0}}while((b|0)<(f|0)){a[b>>0]=d;b=b+1|0}return b-e|0}function yb(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){D=b>>>c;return a>>>c|(b&(1<<c)-1)<<32-c}D=0;return b>>>c-32|0}function zb(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){D=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;return a<<c}D=a<<c-32;return 0}function Ab(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;if((e|0)>=4096)return qa(b|0,d|0,e|0)|0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b>>0]=a[d>>0]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b>>0]=a[d>>0]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function Bb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;c=a+c>>>0;return(D=b+d+(c>>>0<a>>>0|0)>>>0,c|0)|0}function Cb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;b=b-d-(c>>>0>a>>>0|0)>>>0;return(D=b,a-c>>>0|0)|0}function Db(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){D=b>>c;return a>>>c|(b&(1<<c)-1)<<32-c}D=(b|0)<0?-1:0;return b>>c-32|0}function Eb(b){b=b|0;var c=0;c=a[n+(b>>>24)>>0]|0;if((c|0)<8)return c|0;c=a[n+(b>>16&255)>>0]|0;if((c|0)<8)return c+8|0;c=a[n+(b>>8&255)>>0]|0;if((c|0)<8)return c+16|0;return(a[n+(b&255)>>0]|0)+24|0}function Fb(b){b=b|0;var c=0;c=a[m+(b&255)>>0]|0;if((c|0)<8)return c|0;c=a[m+(b>>8&255)>>0]|0;if((c|0)<8)return c+8|0;c=a[m+(b>>16&255)>>0]|0;if((c|0)<8)return c+16|0;return(a[m+(b>>>24)>>0]|0)+24|0}function Gb(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;f=a&65535;d=b&65535;c=$(d,f)|0;e=a>>>16;d=(c>>>16)+($(d,e)|0)|0;b=b>>>16;a=$(b,f)|0;return(D=(d>>>16)+($(b,e)|0)+(((d&65535)+a|0)>>>16)|0,d+a<<16|c&65535|0)|0}function Hb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;j=b>>31|((b|0)<0?-1:0)<<1;i=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;f=d>>31|((d|0)<0?-1:0)<<1;e=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;h=Cb(j^a,i^b,j,i)|0;g=D;b=f^j;a=e^i;a=Cb((Mb(h,g,Cb(f^c,e^d,f,e)|0,D,0)|0)^b,D^a,b,a)|0;return a|0}function Ib(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;i=i+8|0;j=f|0;h=b>>31|((b|0)<0?-1:0)<<1;g=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;l=e>>31|((e|0)<0?-1:0)<<1;k=((e|0)<0?-1:0)>>31|((e|0)<0?-1:0)<<1;b=Cb(h^a,g^b,h,g)|0;a=D;Mb(b,a,Cb(l^d,k^e,l,k)|0,D,j)|0;a=Cb(c[j>>2]^h,c[j+4>>2]^g,h,g)|0;b=D;i=f;return(D=b,a)|0}function Jb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=a;f=c;a=Gb(e,f)|0;c=D;return(D=($(b,f)|0)+($(d,e)|0)+c|c&0,a|0|0)|0}function Kb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;a=Mb(a,b,c,d,0)|0;return a|0}function Lb(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;g=i;i=i+8|0;f=g|0;Mb(a,b,d,e,f)|0;i=g;return(D=c[f+4>>2]|0,c[f>>2]|0)|0}function Mb(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;h=a;j=b;i=j;l=d;g=e;k=g;if((i|0)==0){g=(f|0)!=0;if((k|0)==0){if(g){c[f>>2]=(h>>>0)%(l>>>0);c[f+4>>2]=0}k=0;m=(h>>>0)/(l>>>0)>>>0;return(D=k,m)|0}else{if(!g){l=0;m=0;return(D=l,m)|0}c[f>>2]=a|0;c[f+4>>2]=b&0;l=0;m=0;return(D=l,m)|0}}m=(k|0)==0;do if((l|0)!=0){if(!m){k=(Eb(k|0)|0)-(Eb(i|0)|0)|0;if(k>>>0<=31){m=k+1|0;l=31-k|0;a=k-31>>31;j=m;b=h>>>(m>>>0)&a|i<<l;a=i>>>(m>>>0)&a;k=0;l=h<<l;break}if((f|0)==0){l=0;m=0;return(D=l,m)|0}c[f>>2]=a|0;c[f+4>>2]=j|b&0;l=0;m=0;return(D=l,m)|0}k=l-1|0;if((k&l|0)!=0){l=(Eb(l|0)|0)+33-(Eb(i|0)|0)|0;p=64-l|0;m=32-l|0;n=m>>31;o=l-32|0;a=o>>31;j=l;b=m-1>>31&i>>>(o>>>0)|(i<<m|h>>>(l>>>0))&a;a=a&i>>>(l>>>0);k=h<<p&n;l=(i<<p|h>>>(o>>>0))&n|h<<m&l-33>>31;break}if((f|0)!=0){c[f>>2]=k&h;c[f+4>>2]=0}if((l|0)==1){o=j|b&0;p=a|0|0;return(D=o,p)|0}else{p=Fb(l|0)|0;o=i>>>(p>>>0)|0;p=i<<32-p|h>>>(p>>>0)|0;return(D=o,p)|0}}else{if(m){if((f|0)!=0){c[f>>2]=(i>>>0)%(l>>>0);c[f+4>>2]=0}o=0;p=(i>>>0)/(l>>>0)>>>0;return(D=o,p)|0}if((h|0)==0){if((f|0)!=0){c[f>>2]=0;c[f+4>>2]=(i>>>0)%(k>>>0)}o=0;p=(i>>>0)/(k>>>0)>>>0;return(D=o,p)|0}l=k-1|0;if((l&k|0)==0){if((f|0)!=0){c[f>>2]=a|0;c[f+4>>2]=l&i|b&0}o=0;p=i>>>((Fb(k|0)|0)>>>0);return(D=o,p)|0}k=(Eb(k|0)|0)-(Eb(i|0)|0)|0;if(k>>>0<=30){a=k+1|0;l=31-k|0;j=a;b=i<<l|h>>>(a>>>0);a=i>>>(a>>>0);k=0;l=h<<l;break}if((f|0)==0){o=0;p=0;return(D=o,p)|0}c[f>>2]=a|0;c[f+4>>2]=j|b&0;o=0;p=0;return(D=o,p)|0}while(0);if((j|0)==0){g=l;e=0;i=0}else{h=d|0|0;g=g|e&0;e=Bb(h,g,-1,-1)|0;d=D;i=0;do{m=l;l=k>>>31|l<<1;k=i|k<<1;m=b<<1|m>>>31|0;n=b>>>31|a<<1|0;Cb(e,d,m,n)|0;p=D;o=p>>31|((p|0)<0?-1:0)<<1;i=o&1;b=Cb(m,n,o&h,(((p|0)<0?-1:0)>>31|((p|0)<0?-1:0)<<1)&g)|0;a=D;j=j-1|0}while((j|0)!=0);g=l;e=0}h=0;if((f|0)!=0){c[f>>2]=b;c[f+4>>2]=a}o=(k|0)>>>31|(g|h)<<1|(h<<1|k>>>31)&0|e;p=(k<<1|0>>>31)&-2|i;return(D=o,p)|0}function Nb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return wa[a&3](b|0,c|0,d|0)|0}function Ob(a,b,c){a=a|0;b=b|0;c=c|0;aa(0);return 0}
    
    
    
    
    // EMSCRIPTEN_END_FUNCS
    var wa=[Ob,pb,rb,Ob];return{_strlen:wb,_free:ub,_decode:Fa,_memset:xb,_malloc:tb,_memcpy:Ab,_bitshift64Lshr:yb,_bitshift64Shl:zb,runPostSets:vb,stackAlloc:xa,stackSave:ya,stackRestore:za,setThrew:Aa,setTempRet0:Da,getTempRet0:Ea,dynCall_iiii:Nb}
    // EMSCRIPTEN_END_ASM
    
    })({Math:Math,Int8Array:Int8Array,Int16Array:Int16Array,Int32Array:Int32Array,Uint8Array:Uint8Array,Uint16Array:Uint16Array,Uint32Array:Uint32Array,Float32Array:Float32Array,Float64Array:Float64Array},{abort:F,assert:y,min:va,invoke_iiii:function(a,c,b,d){try{return v.dynCall_iiii(a,c,b,d)}catch(f){"number"!==typeof f&&"longjmp"!==f&&e(f),V.setThrew(1,0)}},_sysconf:function(a){switch(a){case 30:return 4096;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 79:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;
    case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;
    case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1E3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:return"object"===typeof navigator?navigator.hardwareConcurrency||1:1}fb(22);return-1},
    __formatString:mb,_time:function(a){var c=Date.now()/1E3|0;a&&(M[a>>2]=c);return c},_send:function(a,c,b){return!j.wb(a)?(fb(gb),-1):hb(a,c,b)},_pwrite:function(a,c,b,d){a=G.La(a);if(!a)return fb(gb),-1;try{return G.write(a,L,c,b,d)}catch(f){return G.Qa(f),-1}},_abort:function(){v.abort()},___setErrNo:fb,_fwrite:jb,_sbrk:ob,_printf:function(a,c){var b=mb(a,c),d=Ya(b);"\n"===d[d.length-1]&&(d=d.substr(0,d.length-1));v.print(d);return b.length},_fprintf:function(a,c,b){b=mb(c,b);c=B.T();a=jb(O(b,"i8",
    1),1,b.length,a);B.ga(c);return a},__reallyNegative:lb,_emscripten_memcpy_big:function(a,c,b){P.set(P.subarray(c,c+b),a);return a},_fileno:ib,_write:hb,___assert_fail:function(a,c,b,d){ka=m;e("Assertion failed: "+E(a)+", at: "+[c?E(c):"unknown filename",b,d?E(d):"unknown function"]+" at "+Ga())},___errno_location:function(){return eb},STACKTOP:A,STACK_MAX:La,tempDoublePtr:U,ABORT:ka,cttz_i8:ub,ctlz_i8:tb,NaN:NaN,Infinity:Infinity},R),kb=v._strlen=V._strlen,Fa=v._free=V._free;v._decode=V._decode;
    var pb=v._memset=V._memset,Da=v._malloc=V._malloc,sb=v._memcpy=V._memcpy,qb=v._bitshift64Lshr=V._bitshift64Lshr,rb=v._bitshift64Shl=V._bitshift64Shl;v.runPostSets=V.runPostSets;v.dynCall_iiii=V.dynCall_iiii;B.S=V.stackAlloc;B.T=V.stackSave;B.ga=V.stackRestore;B.Ya=V.setTempRet0;B.Na=V.getTempRet0;var nb;function X(a,c){a!=p&&("number"==typeof a?this.A(a):c==p&&"string"!=typeof a?this.q(a,256):this.q(a,c))}function vb(){return new X(p)}function wb(a,c){var b=xb[a.charCodeAt(c)];return b==p?-1:b}
    function yb(a){var c=vb();c.H(a);return c}function Y(a,c){this.n=a|0;this.p=c|0}Y.ka={};Y.H=function(a){if(-128<=a&&128>a){var c=Y.ka[a];if(c)return c}c=new Y(a|0,0>a?-1:0);-128<=a&&128>a&&(Y.ka[a]=c);return c};Y.A=function(a){return isNaN(a)||!isFinite(a)?Y.ZERO:a<=-Y.ma?Y.MIN_VALUE:a+1>=Y.ma?Y.MAX_VALUE:0>a?Y.A(-a).o():new Y(a%Y.F|0,a/Y.F|0)};Y.D=function(a,c){return new Y(a,c)};
    Y.q=function(a,c){0==a.length&&e(Error("number format error: empty string"));var b=c||10;(2>b||36<b)&&e(Error("radix out of range: "+b));if("-"==a.charAt(0))return Y.q(a.substring(1),b).o();0<=a.indexOf("-")&&e(Error('number format error: interior "-" character: '+a));for(var d=Y.A(Math.pow(b,8)),f=Y.ZERO,g=0;g<a.length;g+=8){var i=Math.min(8,a.length-g),h=parseInt(a.substring(g,g+i),b);8>i?(i=Y.A(Math.pow(b,i)),f=f.multiply(i).add(Y.A(h))):(f=f.multiply(d),f=f.add(Y.A(h)))}return f};Y.W=65536;
    Y.cb=16777216;Y.F=Y.W*Y.W;Y.eb=Y.F/2;Y.fb=Y.F*Y.W;Y.Da=Y.F*Y.F;Y.ma=Y.Da/2;Y.ZERO=Y.H(0);Y.ONE=Y.H(1);Y.la=Y.H(-1);Y.MAX_VALUE=Y.D(-1,2147483647);Y.MIN_VALUE=Y.D(0,-2147483648);Y.Ca=Y.H(16777216);t=Y.prototype;t.U=function(){return this.p*Y.F+this.Ka()};
    t.toString=function(a){a=a||10;(2>a||36<a)&&e(Error("radix out of range: "+a));if(this.J())return"0";if(this.r()){if(this.u(Y.MIN_VALUE)){var c=Y.A(a),b=this.I(c),c=b.multiply(c).M(this);return b.toString(a)+c.n.toString(a)}return"-"+this.o().toString(a)}for(var b=Y.A(Math.pow(a,6)),c=this,d="";;){var f=c.I(b),g=c.M(f.multiply(b)).n.toString(a),c=f;if(c.J())return g+d;for(;6>g.length;)g="0"+g;d=""+g+d}};t.Ka=function(){return 0<=this.n?this.n:Y.F+this.n};t.J=function(){return 0==this.p&&0==this.n};
    t.r=function(){return 0>this.p};t.wa=function(){return 1==(this.n&1)};t.u=function(a){return this.p==a.p&&this.n==a.n};t.ya=function(){return 0>this.aa(Y.Ca)};t.Oa=function(a){return 0<this.aa(a)};t.Pa=function(a){return 0<=this.aa(a)};t.aa=function(a){if(this.u(a))return 0;var c=this.r(),b=a.r();return c&&!b?-1:!c&&b?1:this.M(a).r()?-1:1};t.o=function(){return this.u(Y.MIN_VALUE)?Y.MIN_VALUE:this.Ta().add(Y.ONE)};
    t.add=function(a){var c=this.p>>>16,b=this.p&65535,d=this.n>>>16,f=a.p>>>16,g=a.p&65535,i=a.n>>>16,h;h=0+((this.n&65535)+(a.n&65535));a=0+(h>>>16);a+=d+i;d=0+(a>>>16);d+=b+g;b=0+(d>>>16);b=b+(c+f)&65535;return Y.D((a&65535)<<16|h&65535,b<<16|d&65535)};t.M=function(a){return this.add(a.o())};
    t.multiply=function(a){if(this.J()||a.J())return Y.ZERO;if(this.u(Y.MIN_VALUE))return a.wa()?Y.MIN_VALUE:Y.ZERO;if(a.u(Y.MIN_VALUE))return this.wa()?Y.MIN_VALUE:Y.ZERO;if(this.r())return a.r()?this.o().multiply(a.o()):this.o().multiply(a).o();if(a.r())return this.multiply(a.o()).o();if(this.ya()&&a.ya())return Y.A(this.U()*a.U());var c=this.p>>>16,b=this.p&65535,d=this.n>>>16,f=this.n&65535,g=a.p>>>16,i=a.p&65535,h=a.n>>>16,a=a.n&65535,l,r,x,n;n=0+f*a;x=0+(n>>>16);x+=d*a;r=0+(x>>>16);x=(x&65535)+
    f*h;r+=x>>>16;x&=65535;r+=b*a;l=0+(r>>>16);r=(r&65535)+d*h;l+=r>>>16;r&=65535;r+=f*i;l+=r>>>16;r&=65535;l=l+(c*a+b*h+d*i+f*g)&65535;return Y.D(x<<16|n&65535,l<<16|r)};
    t.I=function(a){a.J()&&e(Error("division by zero"));if(this.J())return Y.ZERO;if(this.u(Y.MIN_VALUE)){if(a.u(Y.ONE)||a.u(Y.la))return Y.MIN_VALUE;if(a.u(Y.MIN_VALUE))return Y.ONE;var c=this.Za().I(a).shiftLeft(1);if(c.u(Y.ZERO))return a.r()?Y.ONE:Y.la;var b=this.M(a.multiply(c));return c.add(b.I(a))}if(a.u(Y.MIN_VALUE))return Y.ZERO;if(this.r())return a.r()?this.o().I(a.o()):this.o().I(a).o();if(a.r())return this.I(a.o()).o();for(var d=Y.ZERO,b=this;b.Pa(a);){for(var c=Math.max(1,Math.floor(b.U()/
    a.U())),f=Math.ceil(Math.log(c)/Math.LN2),f=48>=f?1:Math.pow(2,f-48),g=Y.A(c),i=g.multiply(a);i.r()||i.Oa(b);)c-=f,g=Y.A(c),i=g.multiply(a);g.J()&&(g=Y.ONE);d=d.add(g);b=b.M(i)}return d};t.Ta=function(){return Y.D(~this.n,~this.p)};t.shiftLeft=function(a){a&=63;if(0==a)return this;var c=this.n;return 32>a?Y.D(c<<a,this.p<<a|c>>>32-a):Y.D(0,c<<a-32)};t.Za=function(){var a;a=1;if(0==a)return this;var c=this.p;return 32>a?Y.D(this.n>>>a|c<<32-a,c>>a):Y.D(c>>a-32,0<=c?0:-1)};t=X.prototype;
    t.Y=function(a,c,b,d){for(var f=0,g=0;0<=--d;){var i=a*this[f++]+c[b]+g,g=Math.floor(i/67108864);c[b++]=i&67108863}return g};t.k=26;t.C=67108863;t.L=67108864;t.Ba=Math.pow(2,52);t.ia=26;t.ja=0;var xb=[],zb,Z;zb=48;for(Z=0;9>=Z;++Z)xb[zb++]=Z;zb=97;for(Z=10;36>Z;++Z)xb[zb++]=Z;zb=65;for(Z=10;36>Z;++Z)xb[zb++]=Z;t=X.prototype;t.copyTo=function(a){for(var c=this.e-1;0<=c;--c)a[c]=this[c];a.e=this.e;a.g=this.g};t.H=function(a){this.e=1;this.g=0>a?-1:0;0<a?this[0]=a:-1>a?this[0]=a+DV:this.e=0};
    t.q=function(a,c){var b;if(16==c)b=4;else if(8==c)b=3;else if(256==c)b=8;else if(2==c)b=1;else if(32==c)b=5;else if(4==c)b=2;else{this.Ja(a,c);return}this.g=this.e=0;for(var d=a.length,f=s,g=0;0<=--d;){var i=8==b?a[d]&255:wb(a,d);0>i?"-"==a.charAt(d)&&(f=m):(f=s,0==g?this[this.e++]=i:g+b>this.k?(this[this.e-1]|=(i&(1<<this.k-g)-1)<<g,this[this.e++]=i>>this.k-g):this[this.e-1]|=i<<g,g+=b,g>=this.k&&(g-=this.k))}8==b&&0!=(a[0]&128)&&(this.g=-1,0<g&&(this[this.e-1]|=(1<<this.k-g)-1<<g));this.G();f&&
    X.ZERO.B(this,this)};t.G=function(){for(var a=this.g&this.C;0<this.e&&this[this.e-1]==a;)--this.e};t.ba=function(a,c){var b;for(b=this.e-1;0<=b;--b)c[b+a]=this[b];for(b=a-1;0<=b;--b)c[b]=0;c.e=this.e+a;c.g=this.g};t.Ha=function(a,c){for(var b=a;b<this.e;++b)c[b-a]=this[b];c.e=Math.max(this.e-a,0);c.g=this.g};
    t.xa=function(a,c){var b=a%this.k,d=this.k-b,f=(1<<d)-1,g=Math.floor(a/this.k),i=this.g<<b&this.C,h;for(h=this.e-1;0<=h;--h)c[h+g+1]=this[h]>>d|i,i=(this[h]&f)<<b;for(h=g-1;0<=h;--h)c[h]=0;c[g]=i;c.e=this.e+g+1;c.g=this.g;c.G()};t.Wa=function(a,c){c.g=this.g;var b=Math.floor(a/this.k);if(b>=this.e)c.e=0;else{var d=a%this.k,f=this.k-d,g=(1<<d)-1;c[0]=this[b]>>d;for(var i=b+1;i<this.e;++i)c[i-b-1]|=(this[i]&g)<<f,c[i-b]=this[i]>>d;0<d&&(c[this.e-b-1]|=(this.g&g)<<f);c.e=this.e-b;c.G()}};
    t.B=function(a,c){for(var b=0,d=0,f=Math.min(a.e,this.e);b<f;)d+=this[b]-a[b],c[b++]=d&this.C,d>>=this.k;if(a.e<this.e){for(d-=a.g;b<this.e;)d+=this[b],c[b++]=d&this.C,d>>=this.k;d+=this.g}else{for(d+=this.g;b<a.e;)d-=a[b],c[b++]=d&this.C,d>>=this.k;d-=a.g}c.g=0>d?-1:0;-1>d?c[b++]=this.L+d:0<d&&(c[b++]=d);c.e=b;c.G()};t.Sa=function(a){var c=$.Aa,b=this.abs(),d=c.abs(),f=b.e;for(a.e=f+d.e;0<=--f;)a[f]=0;for(f=0;f<d.e;++f)a[f+b.e]=b.Y(d[f],a,f,b.e);a.g=0;a.G();this.g!=c.g&&X.ZERO.B(a,a)};
    t.ra=function(a,c,b){var d=a.abs();if(!(0>=d.e)){var f=this.abs();if(f.e<d.e)c!=p&&c.H(0),b!=p&&this.copyTo(b);else{b==p&&(b=vb());var g=vb(),i=this.g,a=a.g,h=d[d.e-1],l=1,r;if(0!=(r=h>>>16))h=r,l+=16;if(0!=(r=h>>8))h=r,l+=8;if(0!=(r=h>>4))h=r,l+=4;if(0!=(r=h>>2))h=r,l+=2;0!=h>>1&&(l+=1);h=this.k-l;0<h?(d.xa(h,g),f.xa(h,b)):(d.copyTo(g),f.copyTo(b));d=g.e;f=g[d-1];if(0!=f){r=f*(1<<this.ia)+(1<d?g[d-2]>>this.ja:0);l=this.Ba/r;r=(1<<this.ia)/r;var x=1<<this.ja,n=b.e,u=n-d,C=c==p?vb():c;g.ba(u,C);0<=
    b.P(C)&&(b[b.e++]=1,b.B(C,b));X.ONE.ba(d,C);for(C.B(g,g);g.e<d;)g[g.e++]=0;for(;0<=--u;){var D=b[--n]==f?this.C:Math.floor(b[n]*l+(b[n-1]+x)*r);if((b[n]+=g.Y(D,b,u,d))<D){g.ba(u,C);for(b.B(C,b);b[n]<--D;)b.B(C,b)}}c!=p&&(b.Ha(d,c),i!=a&&X.ZERO.B(c,c));b.e=d;b.G();0<h&&b.Wa(h,b);0>i&&X.ZERO.B(b,b)}}}};
    t.toString=function(a){if(0>this.g)return"-"+this.o().toString(a);if(16==a)a=4;else if(8==a)a=3;else if(2==a)a=1;else if(32==a)a=5;else if(4==a)a=2;else return this.$a(a);var c=(1<<a)-1,b,d=s,f="",g=this.e,i=this.k-g*this.k%a;if(0<g--){if(i<this.k&&0<(b=this[g]>>i))d=m,f="0123456789abcdefghijklmnopqrstuvwxyz".charAt(b);for(;0<=g;)i<a?(b=(this[g]&(1<<i)-1)<<a-i,b|=this[--g]>>(i+=this.k-a)):(b=this[g]>>(i-=a)&c,0>=i&&(i+=this.k,--g)),0<b&&(d=m),d&&(f+="0123456789abcdefghijklmnopqrstuvwxyz".charAt(b))}return d?
    f:"0"};t.o=function(){var a=vb();X.ZERO.B(this,a);return a};t.abs=function(){return 0>this.g?this.o():this};t.P=function(a){var c=this.g-a.g;if(0!=c)return c;var b=this.e,c=b-a.e;if(0!=c)return 0>this.g?-c:c;for(;0<=--b;)if(0!=(c=this[b]-a[b]))return c;return 0};X.ZERO=yb(0);X.ONE=yb(1);t=X.prototype;
    t.Ja=function(a,c){this.H(0);c==p&&(c=10);for(var b=this.oa(c),d=Math.pow(c,b),f=s,g=0,i=0,h=0;h<a.length;++h){var l=wb(a,h);0>l?"-"==a.charAt(h)&&0==this.fa()&&(f=m):(i=c*i+l,++g>=b&&(this.qa(d),this.pa(i),i=g=0))}0<g&&(this.qa(Math.pow(c,g)),this.pa(i));f&&X.ZERO.B(this,this)};t.oa=function(a){return Math.floor(Math.LN2*this.k/Math.log(a))};t.fa=function(){return 0>this.g?-1:0>=this.e||1==this.e&&0>=this[0]?0:1};t.qa=function(a){this[this.e]=this.Y(a-1,this,0,this.e);++this.e;this.G()};
    t.pa=function(a){var c=0;if(0!=a){for(;this.e<=c;)this[this.e++]=0;for(this[c]+=a;this[c]>=this.L;)this[c]-=this.L,++c>=this.e&&(this[this.e++]=0),++this[c]}};t.$a=function(a){a==p&&(a=10);if(0==this.fa()||2>a||36<a)return"0";var c=this.oa(a),c=Math.pow(a,c),b=yb(c),d=vb(),f=vb(),g="";for(this.ra(b,d,f);0<d.fa();)g=(c+f.va()).toString(a).substr(1)+g,d.ra(b,d,f);return f.va().toString(a)+g};
    t.va=function(){if(0>this.g){if(1==this.e)return this[0]-this.L;if(0==this.e)return-1}else{if(1==this.e)return this[0];if(0==this.e)return 0}return(this[1]&(1<<32-this.k)-1)<<this.k|this[0]};
    t.X=function(a,c){for(var b=0,d=0,f=Math.min(a.e,this.e);b<f;)d+=this[b]+a[b],c[b++]=d&this.C,d>>=this.k;if(a.e<this.e){for(d+=a.g;b<this.e;)d+=this[b],c[b++]=d&this.C,d>>=this.k;d+=this.g}else{for(d+=this.g;b<a.e;)d+=a[b],c[b++]=d&this.C,d>>=this.k;d+=a.g}c.g=0>d?-1:0;0<d?c[b++]=d:-1>d&&(c[b++]=this.L+d);c.e=b;c.G()};
    var $={abs:function(a,c){var b=new Y(a,c),b=b.r()?b.o():b;M[U>>2]=b.n;M[U+4>>2]=b.p},sa:function(){$.Ia||($.Ia=m,$.Aa=new X,$.Aa.q("4294967296",10),$.ha=new X,$.ha.q("18446744073709551616",10),$.Ab=new X,$.Bb=new X)},yb:function(a,c){var b=new X;b.q(c.toString(),10);var d=new X;b.Sa(d);b=new X;b.q(a.toString(),10);var f=new X;b.X(d,f);return f},stringify:function(a,c,b){a=(new Y(a,c)).toString();b&&"-"==a[0]&&($.sa(),b=new X,b.q(a,10),a=new X,$.ha.X(b,a),a=a.toString(10));return a},q:function(a,c,
    b,d,f){$.sa();var g=new X;g.q(a,c);a=new X;a.q(b,10);b=new X;b.q(d,10);f&&0>g.P(X.ZERO)&&(d=new X,g.X($.ha,d),g=d);d=s;0>g.P(a)?(g=a,d=m):0<g.P(b)&&(g=b,d=m);g=Y.q(g.toString());M[U>>2]=g.n;M[U+4>>2]=g.p;d&&e("range error")}};nb=$;
    if(T)if("function"===typeof v.locateFile?T=v.locateFile(T):v.memoryInitializerPrefixURL&&(T=v.memoryInitializerPrefixURL+T),ba||ea){var Ab=v.readBinary(T);P.set(Ab,Ja)}else cb(),Browser.mb(T,function(a){P.set(a,Ja);db()},function(){e("could not load memory initializer "+T)});function ia(a){this.name="ExitStatus";this.message="Program terminated with exit("+a+")";this.status=a}ia.prototype=Error();var Bb,Cb=p,bb=function Db(){!v.calledRun&&Eb&&Fb();v.calledRun||(bb=Db)};
    v.callMain=v.nb=function(a){function c(){for(var a=0;3>a;a++)d.push(0)}y(0==S,"cannot call main when async dependencies remain! (listen on __ATMAIN__)");y(0==Pa.length,"cannot call main when preRun functions remain to be called");a=a||[];Ua||(Ua=m,Oa(Qa));var b=a.length+1,d=[O(Xa(v.thisProgram),"i8",0)];c();for(var f=0;f<b-1;f+=1)d.push(O(Xa(a[f]),"i8",0)),c();d.push(0);d=O(d,"i32",0);Bb=A;try{var g=v._main(b,d,0);Gb(g)}catch(i){i instanceof ia||("SimulateInfiniteLoop"==i?v.noExitRuntime=m:(i&&("object"===
    typeof i&&i.stack)&&v.K("exception thrown: "+[i,i.stack]),e(i)))}finally{}};
    function Fb(a){function c(){if(!v.calledRun&&(v.calledRun=m,!ka)){Ua||(Ua=m,Oa(Qa));Oa(Ra);ca&&Cb!==p&&v.K("pre-main prep time: "+(Date.now()-Cb)+" ms");v._main&&Eb&&v.callMain(a);if(v.postRun)for("function"==typeof v.postRun&&(v.postRun=[v.postRun]);v.postRun.length;)Wa(v.postRun.shift());Oa(Ta)}}a=a||v.arguments;Cb===p&&(Cb=Date.now());if(0<S)v.K("run() called, but dependencies remain, so not running");else{if(v.preRun)for("function"==typeof v.preRun&&(v.preRun=[v.preRun]);v.preRun.length;)Va(v.preRun.shift());
    Oa(Pa);!(0<S)&&!v.calledRun&&(v.setStatus?(v.setStatus("Running..."),setTimeout(function(){setTimeout(function(){v.setStatus("")},1);c()},1)):c())}}v.run=v.zb=Fb;function Gb(a){v.noExitRuntime||(ka=m,A=Bb,Oa(Sa),ba?(process.stdout.once("drain",function(){process.exit(a)}),console.log(" "),setTimeout(function(){process.exit(a)},500)):ea&&"function"===typeof quit&&quit(a),e(new ia(a)))}v.exit=v.ob=Gb;
    function F(a){a&&(v.print(a),v.K(a));ka=m;e("abort() at "+Ga()+"\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.")}v.abort=v.abort=F;if(v.preInit)for("function"==typeof v.preInit&&(v.preInit=[v.preInit]);0<v.preInit.length;)v.preInit.pop()();var Eb=m;v.noInitialRun&&(Eb=s);Fb();
    
    
    }).call(this,require('_process'),"/node_modules/brotli/build")
    },{"../src/read_memory":6,"_process":24,"fs":7,"path":23}],4:[function(require,module,exports){
    var brotli = require('./build/decode');
    module.exports = require('./src/decompress').bind(brotli);
    
    },{"./build/decode":3,"./src/decompress":5}],5:[function(require,module,exports){
    /**
     * Decompresses the given buffer
     * If outSize is given, it is used as the output buffer size,
     * otherwise the size must be guessed.
     * Returns null on error or if the output buffer wasn't big enough
     */
    module.exports = function(buffer, outSize) {
      // If no output size was given, guess one
      if (!outSize)
        outSize = 4 * buffer.length;
      
      // allocate input buffer and copy data to it
      var buf = this._malloc(buffer.length);
      this.HEAPU8.set(buffer, buf);
        
      // allocate output buffer, and decode
      var outBuf = this._malloc(outSize);
      var decodedSize = this._decode(buffer.length, buf, outSize, outBuf);
      
      var outBuffer = null;
      if (decodedSize !== -1) {
        // allocate and copy data to an output buffer
        outBuffer = new Uint8Array(decodedSize);
        outBuffer.set(this.HEAPU8.subarray(outBuf, outBuf + decodedSize));
      }
      
      // free malloc'd buffers
      this._free(buf);
      this._free(outBuf);
      
      return outBuffer;
    };
    
    },{}],6:[function(require,module,exports){
    (function (Buffer){
    
    var inflate = require('pako/lib/inflate').inflate;
    
    module.exports = function(memoryFile) {
      var src = Buffer("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","base64");
      return inflate(src);
    };
    
    }).call(this,require("buffer").Buffer)
    },{"buffer":8,"pako/lib/inflate":11}],7:[function(require,module,exports){
    
    },{}],8:[function(require,module,exports){
    (function (global){
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */
    /* eslint-disable no-proto */
    
    var base64 = require('base64-js')
    var ieee754 = require('ieee754')
    var isArray = require('is-array')
    
    exports.Buffer = Buffer
    exports.SlowBuffer = SlowBuffer
    exports.INSPECT_MAX_BYTES = 50
    Buffer.poolSize = 8192 // not used by this implementation
    
    var rootParent = {}
    
    /**
     * If `Buffer.TYPED_ARRAY_SUPPORT`:
     *   === true    Use Uint8Array implementation (fastest)
     *   === false   Use Object implementation (most compatible, even IE6)
     *
     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
     * Opera 11.6+, iOS 4.2+.
     *
     * Due to various browser bugs, sometimes the Object implementation will be used even
     * when the browser supports typed arrays.
     *
     * Note:
     *
     *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
     *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
     *
     *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
     *     on objects.
     *
     *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
     *
     *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
     *     incorrect length in some situations.
    
     * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
     * get the Object implementation, which is slower but behaves correctly.
     */
    Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
      ? global.TYPED_ARRAY_SUPPORT
      : typedArraySupport()
    
    function typedArraySupport () {
      function Bar () {}
      try {
        var arr = new Uint8Array(1)
        arr.foo = function () { return 42 }
        arr.constructor = Bar
        return arr.foo() === 42 && // typed array instances can be augmented
            arr.constructor === Bar && // constructor can be set
            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
            arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
      } catch (e) {
        return false
      }
    }
    
    function kMaxLength () {
      return Buffer.TYPED_ARRAY_SUPPORT
        ? 0x7fffffff
        : 0x3fffffff
    }
    
    /**
     * Class: Buffer
     * =============
     *
     * The Buffer constructor returns instances of `Uint8Array` that are augmented
     * with function properties for all the node `Buffer` API functions. We use
     * `Uint8Array` so that square bracket notation works as expected -- it returns
     * a single octet.
     *
     * By augmenting the instances, we can avoid modifying the `Uint8Array`
     * prototype.
     */
    function Buffer (arg) {
      if (!(this instanceof Buffer)) {
        // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
        if (arguments.length > 1) return new Buffer(arg, arguments[1])
        return new Buffer(arg)
      }
    
      this.length = 0
      this.parent = undefined
    
      // Common case.
      if (typeof arg === 'number') {
        return fromNumber(this, arg)
      }
    
      // Slightly less common case.
      if (typeof arg === 'string') {
        return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
      }
    
      // Unusual.
      return fromObject(this, arg)
    }
    
    function fromNumber (that, length) {
      that = allocate(that, length < 0 ? 0 : checked(length) | 0)
      if (!Buffer.TYPED_ARRAY_SUPPORT) {
        for (var i = 0; i < length; i++) {
          that[i] = 0
        }
      }
      return that
    }
    
    function fromString (that, string, encoding) {
      if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'
    
      // Assumption: byteLength() return value is always < kMaxLength.
      var length = byteLength(string, encoding) | 0
      that = allocate(that, length)
    
      that.write(string, encoding)
      return that
    }
    
    function fromObject (that, object) {
      if (Buffer.isBuffer(object)) return fromBuffer(that, object)
    
      if (isArray(object)) return fromArray(that, object)
    
      if (object == null) {
        throw new TypeError('must start with number, buffer, array or string')
      }
    
      if (typeof ArrayBuffer !== 'undefined') {
        if (object.buffer instanceof ArrayBuffer) {
          return fromTypedArray(that, object)
        }
        if (object instanceof ArrayBuffer) {
          return fromArrayBuffer(that, object)
        }
      }
    
      if (object.length) return fromArrayLike(that, object)
    
      return fromJsonObject(that, object)
    }
    
    function fromBuffer (that, buffer) {
      var length = checked(buffer.length) | 0
      that = allocate(that, length)
      buffer.copy(that, 0, 0, length)
      return that
    }
    
    function fromArray (that, array) {
      var length = checked(array.length) | 0
      that = allocate(that, length)
      for (var i = 0; i < length; i += 1) {
        that[i] = array[i] & 255
      }
      return that
    }
    
    // Duplicate of fromArray() to keep fromArray() monomorphic.
    function fromTypedArray (that, array) {
      var length = checked(array.length) | 0
      that = allocate(that, length)
      // Truncating the elements is probably not what people expect from typed
      // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
      // of the old Buffer constructor.
      for (var i = 0; i < length; i += 1) {
        that[i] = array[i] & 255
      }
      return that
    }
    
    function fromArrayBuffer (that, array) {
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        array.byteLength
        that = Buffer._augment(new Uint8Array(array))
      } else {
        // Fallback: Return an object instance of the Buffer class
        that = fromTypedArray(that, new Uint8Array(array))
      }
      return that
    }
    
    function fromArrayLike (that, array) {
      var length = checked(array.length) | 0
      that = allocate(that, length)
      for (var i = 0; i < length; i += 1) {
        that[i] = array[i] & 255
      }
      return that
    }
    
    // Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
    // Returns a zero-length buffer for inputs that don't conform to the spec.
    function fromJsonObject (that, object) {
      var array
      var length = 0
    
      if (object.type === 'Buffer' && isArray(object.data)) {
        array = object.data
        length = checked(array.length) | 0
      }
      that = allocate(that, length)
    
      for (var i = 0; i < length; i += 1) {
        that[i] = array[i] & 255
      }
      return that
    }
    
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      Buffer.prototype.__proto__ = Uint8Array.prototype
      Buffer.__proto__ = Uint8Array
    }
    
    function allocate (that, length) {
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        that = Buffer._augment(new Uint8Array(length))
        that.__proto__ = Buffer.prototype
      } else {
        // Fallback: Return an object instance of the Buffer class
        that.length = length
        that._isBuffer = true
      }
    
      var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
      if (fromPool) that.parent = rootParent
    
      return that
    }
    
    function checked (length) {
      // Note: cannot use `length < kMaxLength` here because that fails when
      // length is NaN (which is otherwise coerced to zero.)
      if (length >= kMaxLength()) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                             'size: 0x' + kMaxLength().toString(16) + ' bytes')
      }
      return length | 0
    }
    
    function SlowBuffer (subject, encoding) {
      if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)
    
      var buf = new Buffer(subject, encoding)
      delete buf.parent
      return buf
    }
    
    Buffer.isBuffer = function isBuffer (b) {
      return !!(b != null && b._isBuffer)
    }
    
    Buffer.compare = function compare (a, b) {
      if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        throw new TypeError('Arguments must be Buffers')
      }
    
      if (a === b) return 0
    
      var x = a.length
      var y = b.length
    
      var i = 0
      var len = Math.min(x, y)
      while (i < len) {
        if (a[i] !== b[i]) break
    
        ++i
      }
    
      if (i !== len) {
        x = a[i]
        y = b[i]
      }
    
      if (x < y) return -1
      if (y < x) return 1
      return 0
    }
    
    Buffer.isEncoding = function isEncoding (encoding) {
      switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'binary':
        case 'base64':
        case 'raw':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return true
        default:
          return false
      }
    }
    
    Buffer.concat = function concat (list, length) {
      if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')
    
      if (list.length === 0) {
        return new Buffer(0)
      }
    
      var i
      if (length === undefined) {
        length = 0
        for (i = 0; i < list.length; i++) {
          length += list[i].length
        }
      }
    
      var buf = new Buffer(length)
      var pos = 0
      for (i = 0; i < list.length; i++) {
        var item = list[i]
        item.copy(buf, pos)
        pos += item.length
      }
      return buf
    }
    
    function byteLength (string, encoding) {
      if (typeof string !== 'string') string = '' + string
    
      var len = string.length
      if (len === 0) return 0
    
      // Use a for loop to avoid recursion
      var loweredCase = false
      for (;;) {
        switch (encoding) {
          case 'ascii':
          case 'binary':
          // Deprecated
          case 'raw':
          case 'raws':
            return len
          case 'utf8':
          case 'utf-8':
            return utf8ToBytes(string).length
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return len * 2
          case 'hex':
            return len >>> 1
          case 'base64':
            return base64ToBytes(string).length
          default:
            if (loweredCase) return utf8ToBytes(string).length // assume utf8
            encoding = ('' + encoding).toLowerCase()
            loweredCase = true
        }
      }
    }
    Buffer.byteLength = byteLength
    
    // pre-set for values that may exist in the future
    Buffer.prototype.length = undefined
    Buffer.prototype.parent = undefined
    
    function slowToString (encoding, start, end) {
      var loweredCase = false
    
      start = start | 0
      end = end === undefined || end === Infinity ? this.length : end | 0
    
      if (!encoding) encoding = 'utf8'
      if (start < 0) start = 0
      if (end > this.length) end = this.length
      if (end <= start) return ''
    
      while (true) {
        switch (encoding) {
          case 'hex':
            return hexSlice(this, start, end)
    
          case 'utf8':
          case 'utf-8':
            return utf8Slice(this, start, end)
    
          case 'ascii':
            return asciiSlice(this, start, end)
    
          case 'binary':
            return binarySlice(this, start, end)
    
          case 'base64':
            return base64Slice(this, start, end)
    
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return utf16leSlice(this, start, end)
    
          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = (encoding + '').toLowerCase()
            loweredCase = true
        }
      }
    }
    
    Buffer.prototype.toString = function toString () {
      var length = this.length | 0
      if (length === 0) return ''
      if (arguments.length === 0) return utf8Slice(this, 0, length)
      return slowToString.apply(this, arguments)
    }
    
    Buffer.prototype.equals = function equals (b) {
      if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
      if (this === b) return true
      return Buffer.compare(this, b) === 0
    }
    
    Buffer.prototype.inspect = function inspect () {
      var str = ''
      var max = exports.INSPECT_MAX_BYTES
      if (this.length > 0) {
        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
        if (this.length > max) str += ' ... '
      }
      return '<Buffer ' + str + '>'
    }
    
    Buffer.prototype.compare = function compare (b) {
      if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
      if (this === b) return 0
      return Buffer.compare(this, b)
    }
    
    Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
      if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
      else if (byteOffset < -0x80000000) byteOffset = -0x80000000
      byteOffset >>= 0
    
      if (this.length === 0) return -1
      if (byteOffset >= this.length) return -1
    
      // Negative offsets start from the end of the buffer
      if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)
    
      if (typeof val === 'string') {
        if (val.length === 0) return -1 // special case: looking for empty string always fails
        return String.prototype.indexOf.call(this, val, byteOffset)
      }
      if (Buffer.isBuffer(val)) {
        return arrayIndexOf(this, val, byteOffset)
      }
      if (typeof val === 'number') {
        if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
          return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
        }
        return arrayIndexOf(this, [ val ], byteOffset)
      }
    
      function arrayIndexOf (arr, val, byteOffset) {
        var foundIndex = -1
        for (var i = 0; byteOffset + i < arr.length; i++) {
          if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
            if (foundIndex === -1) foundIndex = i
            if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
          } else {
            foundIndex = -1
          }
        }
        return -1
      }
    
      throw new TypeError('val must be string, number or Buffer')
    }
    
    // `get` is deprecated
    Buffer.prototype.get = function get (offset) {
      console.log('.get() is deprecated. Access using array indexes instead.')
      return this.readUInt8(offset)
    }
    
    // `set` is deprecated
    Buffer.prototype.set = function set (v, offset) {
      console.log('.set() is deprecated. Access using array indexes instead.')
      return this.writeUInt8(v, offset)
    }
    
    function hexWrite (buf, string, offset, length) {
      offset = Number(offset) || 0
      var remaining = buf.length - offset
      if (!length) {
        length = remaining
      } else {
        length = Number(length)
        if (length > remaining) {
          length = remaining
        }
      }
    
      // must be an even number of digits
      var strLen = string.length
      if (strLen % 2 !== 0) throw new Error('Invalid hex string')
    
      if (length > strLen / 2) {
        length = strLen / 2
      }
      for (var i = 0; i < length; i++) {
        var parsed = parseInt(string.substr(i * 2, 2), 16)
        if (isNaN(parsed)) throw new Error('Invalid hex string')
        buf[offset + i] = parsed
      }
      return i
    }
    
    function utf8Write (buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
    }
    
    function asciiWrite (buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length)
    }
    
    function binaryWrite (buf, string, offset, length) {
      return asciiWrite(buf, string, offset, length)
    }
    
    function base64Write (buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length)
    }
    
    function ucs2Write (buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
    }
    
    Buffer.prototype.write = function write (string, offset, length, encoding) {
      // Buffer#write(string)
      if (offset === undefined) {
        encoding = 'utf8'
        length = this.length
        offset = 0
      // Buffer#write(string, encoding)
      } else if (length === undefined && typeof offset === 'string') {
        encoding = offset
        length = this.length
        offset = 0
      // Buffer#write(string, offset[, length][, encoding])
      } else if (isFinite(offset)) {
        offset = offset | 0
        if (isFinite(length)) {
          length = length | 0
          if (encoding === undefined) encoding = 'utf8'
        } else {
          encoding = length
          length = undefined
        }
      // legacy write(string, encoding, offset, length) - remove in v0.13
      } else {
        var swap = encoding
        encoding = offset
        offset = length | 0
        length = swap
      }
    
      var remaining = this.length - offset
      if (length === undefined || length > remaining) length = remaining
    
      if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
        throw new RangeError('attempt to write outside buffer bounds')
      }
    
      if (!encoding) encoding = 'utf8'
    
      var loweredCase = false
      for (;;) {
        switch (encoding) {
          case 'hex':
            return hexWrite(this, string, offset, length)
    
          case 'utf8':
          case 'utf-8':
            return utf8Write(this, string, offset, length)
    
          case 'ascii':
            return asciiWrite(this, string, offset, length)
    
          case 'binary':
            return binaryWrite(this, string, offset, length)
    
          case 'base64':
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length)
    
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return ucs2Write(this, string, offset, length)
    
          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = ('' + encoding).toLowerCase()
            loweredCase = true
        }
      }
    }
    
    Buffer.prototype.toJSON = function toJSON () {
      return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
      }
    }
    
    function base64Slice (buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf)
      } else {
        return base64.fromByteArray(buf.slice(start, end))
      }
    }
    
    function utf8Slice (buf, start, end) {
      end = Math.min(buf.length, end)
      var res = []
    
      var i = start
      while (i < end) {
        var firstByte = buf[i]
        var codePoint = null
        var bytesPerSequence = (firstByte > 0xEF) ? 4
          : (firstByte > 0xDF) ? 3
          : (firstByte > 0xBF) ? 2
          : 1
    
        if (i + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint
    
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 0x80) {
                codePoint = firstByte
              }
              break
            case 2:
              secondByte = buf[i + 1]
              if ((secondByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                if (tempCodePoint > 0x7F) {
                  codePoint = tempCodePoint
                }
              }
              break
            case 3:
              secondByte = buf[i + 1]
              thirdByte = buf[i + 2]
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                  codePoint = tempCodePoint
                }
              }
              break
            case 4:
              secondByte = buf[i + 1]
              thirdByte = buf[i + 2]
              fourthByte = buf[i + 3]
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                  codePoint = tempCodePoint
                }
              }
          }
        }
    
        if (codePoint === null) {
          // we did not generate a valid codePoint so insert a
          // replacement char (U+FFFD) and advance only 1 byte
          codePoint = 0xFFFD
          bytesPerSequence = 1
        } else if (codePoint > 0xFFFF) {
          // encode to utf16 (surrogate pair dance)
          codePoint -= 0x10000
          res.push(codePoint >>> 10 & 0x3FF | 0xD800)
          codePoint = 0xDC00 | codePoint & 0x3FF
        }
    
        res.push(codePoint)
        i += bytesPerSequence
      }
    
      return decodeCodePointsArray(res)
    }
    
    // Based on http://stackoverflow.com/a/22747272/680742, the browser with
    // the lowest limit is Chrome, with 0x10000 args.
    // We go 1 magnitude less, for safety
    var MAX_ARGUMENTS_LENGTH = 0x1000
    
    function decodeCodePointsArray (codePoints) {
      var len = codePoints.length
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
      }
    
      // Decode in chunks to avoid "call stack size exceeded".
      var res = ''
      var i = 0
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        )
      }
      return res
    }
    
    function asciiSlice (buf, start, end) {
      var ret = ''
      end = Math.min(buf.length, end)
    
      for (var i = start; i < end; i++) {
        ret += String.fromCharCode(buf[i] & 0x7F)
      }
      return ret
    }
    
    function binarySlice (buf, start, end) {
      var ret = ''
      end = Math.min(buf.length, end)
    
      for (var i = start; i < end; i++) {
        ret += String.fromCharCode(buf[i])
      }
      return ret
    }
    
    function hexSlice (buf, start, end) {
      var len = buf.length
    
      if (!start || start < 0) start = 0
      if (!end || end < 0 || end > len) end = len
    
      var out = ''
      for (var i = start; i < end; i++) {
        out += toHex(buf[i])
      }
      return out
    }
    
    function utf16leSlice (buf, start, end) {
      var bytes = buf.slice(start, end)
      var res = ''
      for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
      }
      return res
    }
    
    Buffer.prototype.slice = function slice (start, end) {
      var len = this.length
      start = ~~start
      end = end === undefined ? len : ~~end
    
      if (start < 0) {
        start += len
        if (start < 0) start = 0
      } else if (start > len) {
        start = len
      }
    
      if (end < 0) {
        end += len
        if (end < 0) end = 0
      } else if (end > len) {
        end = len
      }
    
      if (end < start) end = start
    
      var newBuf
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        newBuf = Buffer._augment(this.subarray(start, end))
      } else {
        var sliceLen = end - start
        newBuf = new Buffer(sliceLen, undefined)
        for (var i = 0; i < sliceLen; i++) {
          newBuf[i] = this[i + start]
        }
      }
    
      if (newBuf.length) newBuf.parent = this.parent || this
    
      return newBuf
    }
    
    /*
     * Need to make sure that buffer isn't trying to write out of bounds.
     */
    function checkOffset (offset, ext, length) {
      if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
      if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
    }
    
    Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) checkOffset(offset, byteLength, this.length)
    
      var val = this[offset]
      var mul = 1
      var i = 0
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul
      }
    
      return val
    }
    
    Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) {
        checkOffset(offset, byteLength, this.length)
      }
    
      var val = this[offset + --byteLength]
      var mul = 1
      while (byteLength > 0 && (mul *= 0x100)) {
        val += this[offset + --byteLength] * mul
      }
    
      return val
    }
    
    Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 1, this.length)
      return this[offset]
    }
    
    Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length)
      return this[offset] | (this[offset + 1] << 8)
    }
    
    Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length)
      return (this[offset] << 8) | this[offset + 1]
    }
    
    Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)
    
      return ((this[offset]) |
          (this[offset + 1] << 8) |
          (this[offset + 2] << 16)) +
          (this[offset + 3] * 0x1000000)
    }
    
    Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)
    
      return (this[offset] * 0x1000000) +
        ((this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        this[offset + 3])
    }
    
    Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) checkOffset(offset, byteLength, this.length)
    
      var val = this[offset]
      var mul = 1
      var i = 0
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul
      }
      mul *= 0x80
    
      if (val >= mul) val -= Math.pow(2, 8 * byteLength)
    
      return val
    }
    
    Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) checkOffset(offset, byteLength, this.length)
    
      var i = byteLength
      var mul = 1
      var val = this[offset + --i]
      while (i > 0 && (mul *= 0x100)) {
        val += this[offset + --i] * mul
      }
      mul *= 0x80
    
      if (val >= mul) val -= Math.pow(2, 8 * byteLength)
    
      return val
    }
    
    Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 1, this.length)
      if (!(this[offset] & 0x80)) return (this[offset])
      return ((0xff - this[offset] + 1) * -1)
    }
    
    Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length)
      var val = this[offset] | (this[offset + 1] << 8)
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    }
    
    Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length)
      var val = this[offset + 1] | (this[offset] << 8)
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    }
    
    Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)
    
      return (this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16) |
        (this[offset + 3] << 24)
    }
    
    Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)
    
      return (this[offset] << 24) |
        (this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        (this[offset + 3])
    }
    
    Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)
      return ieee754.read(this, offset, true, 23, 4)
    }
    
    Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)
      return ieee754.read(this, offset, false, 23, 4)
    }
    
    Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 8, this.length)
      return ieee754.read(this, offset, true, 52, 8)
    }
    
    Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 8, this.length)
      return ieee754.read(this, offset, false, 52, 8)
    }
    
    function checkInt (buf, value, offset, ext, max, min) {
      if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
      if (value > max || value < min) throw new RangeError('value is out of bounds')
      if (offset + ext > buf.length) throw new RangeError('index out of range')
    }
    
    Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
    
      var mul = 1
      var i = 0
      this[offset] = value & 0xFF
      while (++i < byteLength && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF
      }
    
      return offset + byteLength
    }
    
    Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
    
      var i = byteLength - 1
      var mul = 1
      this[offset + i] = value & 0xFF
      while (--i >= 0 && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF
      }
    
      return offset + byteLength
    }
    
    Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
      if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
      this[offset] = (value & 0xff)
      return offset + 1
    }
    
    function objectWriteUInt16 (buf, value, offset, littleEndian) {
      if (value < 0) value = 0xffff + value + 1
      for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
        buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
          (littleEndian ? i : 1 - i) * 8
      }
    }
    
    Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff)
        this[offset + 1] = (value >>> 8)
      } else {
        objectWriteUInt16(this, value, offset, true)
      }
      return offset + 2
    }
    
    Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 8)
        this[offset + 1] = (value & 0xff)
      } else {
        objectWriteUInt16(this, value, offset, false)
      }
      return offset + 2
    }
    
    function objectWriteUInt32 (buf, value, offset, littleEndian) {
      if (value < 0) value = 0xffffffff + value + 1
      for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
        buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
      }
    }
    
    Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset + 3] = (value >>> 24)
        this[offset + 2] = (value >>> 16)
        this[offset + 1] = (value >>> 8)
        this[offset] = (value & 0xff)
      } else {
        objectWriteUInt32(this, value, offset, true)
      }
      return offset + 4
    }
    
    Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 24)
        this[offset + 1] = (value >>> 16)
        this[offset + 2] = (value >>> 8)
        this[offset + 3] = (value & 0xff)
      } else {
        objectWriteUInt32(this, value, offset, false)
      }
      return offset + 4
    }
    
    Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1)
    
        checkInt(this, value, offset, byteLength, limit - 1, -limit)
      }
    
      var i = 0
      var mul = 1
      var sub = value < 0 ? 1 : 0
      this[offset] = value & 0xFF
      while (++i < byteLength && (mul *= 0x100)) {
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
      }
    
      return offset + byteLength
    }
    
    Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1)
    
        checkInt(this, value, offset, byteLength, limit - 1, -limit)
      }
    
      var i = byteLength - 1
      var mul = 1
      var sub = value < 0 ? 1 : 0
      this[offset + i] = value & 0xFF
      while (--i >= 0 && (mul *= 0x100)) {
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
      }
    
      return offset + byteLength
    }
    
    Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
      if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
      if (value < 0) value = 0xff + value + 1
      this[offset] = (value & 0xff)
      return offset + 1
    }
    
    Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff)
        this[offset + 1] = (value >>> 8)
      } else {
        objectWriteUInt16(this, value, offset, true)
      }
      return offset + 2
    }
    
    Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 8)
        this[offset + 1] = (value & 0xff)
      } else {
        objectWriteUInt16(this, value, offset, false)
      }
      return offset + 2
    }
    
    Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff)
        this[offset + 1] = (value >>> 8)
        this[offset + 2] = (value >>> 16)
        this[offset + 3] = (value >>> 24)
      } else {
        objectWriteUInt32(this, value, offset, true)
      }
      return offset + 4
    }
    
    Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
      if (value < 0) value = 0xffffffff + value + 1
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 24)
        this[offset + 1] = (value >>> 16)
        this[offset + 2] = (value >>> 8)
        this[offset + 3] = (value & 0xff)
      } else {
        objectWriteUInt32(this, value, offset, false)
      }
      return offset + 4
    }
    
    function checkIEEE754 (buf, value, offset, ext, max, min) {
      if (value > max || value < min) throw new RangeError('value is out of bounds')
      if (offset + ext > buf.length) throw new RangeError('index out of range')
      if (offset < 0) throw new RangeError('index out of range')
    }
    
    function writeFloat (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4)
      return offset + 4
    }
    
    Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert)
    }
    
    function writeDouble (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8)
      return offset + 8
    }
    
    Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert)
    }
    
    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
    Buffer.prototype.copy = function copy (target, targetStart, start, end) {
      if (!start) start = 0
      if (!end && end !== 0) end = this.length
      if (targetStart >= target.length) targetStart = target.length
      if (!targetStart) targetStart = 0
      if (end > 0 && end < start) end = start
    
      // Copy 0 bytes; we're done
      if (end === start) return 0
      if (target.length === 0 || this.length === 0) return 0
    
      // Fatal error conditions
      if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds')
      }
      if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
      if (end < 0) throw new RangeError('sourceEnd out of bounds')
    
      // Are we oob?
      if (end > this.length) end = this.length
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start
      }
    
      var len = end - start
      var i
    
      if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (i = len - 1; i >= 0; i--) {
          target[i + targetStart] = this[i + start]
        }
      } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
        // ascending copy from start
        for (i = 0; i < len; i++) {
          target[i + targetStart] = this[i + start]
        }
      } else {
        target._set(this.subarray(start, start + len), targetStart)
      }
    
      return len
    }
    
    // fill(value, start=0, end=buffer.length)
    Buffer.prototype.fill = function fill (value, start, end) {
      if (!value) value = 0
      if (!start) start = 0
      if (!end) end = this.length
    
      if (end < start) throw new RangeError('end < start')
    
      // Fill 0 bytes; we're done
      if (end === start) return
      if (this.length === 0) return
    
      if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
      if (end < 0 || end > this.length) throw new RangeError('end out of bounds')
    
      var i
      if (typeof value === 'number') {
        for (i = start; i < end; i++) {
          this[i] = value
        }
      } else {
        var bytes = utf8ToBytes(value.toString())
        var len = bytes.length
        for (i = start; i < end; i++) {
          this[i] = bytes[i % len]
        }
      }
    
      return this
    }
    
    /**
     * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
     * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
     */
    Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
      if (typeof Uint8Array !== 'undefined') {
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          return (new Buffer(this)).buffer
        } else {
          var buf = new Uint8Array(this.length)
          for (var i = 0, len = buf.length; i < len; i += 1) {
            buf[i] = this[i]
          }
          return buf.buffer
        }
      } else {
        throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
      }
    }
    
    // HELPER FUNCTIONS
    // ================
    
    var BP = Buffer.prototype
    
    /**
     * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
     */
    Buffer._augment = function _augment (arr) {
      arr.constructor = Buffer
      arr._isBuffer = true
    
      // save reference to original Uint8Array set method before overwriting
      arr._set = arr.set
    
      // deprecated
      arr.get = BP.get
      arr.set = BP.set
    
      arr.write = BP.write
      arr.toString = BP.toString
      arr.toLocaleString = BP.toString
      arr.toJSON = BP.toJSON
      arr.equals = BP.equals
      arr.compare = BP.compare
      arr.indexOf = BP.indexOf
      arr.copy = BP.copy
      arr.slice = BP.slice
      arr.readUIntLE = BP.readUIntLE
      arr.readUIntBE = BP.readUIntBE
      arr.readUInt8 = BP.readUInt8
      arr.readUInt16LE = BP.readUInt16LE
      arr.readUInt16BE = BP.readUInt16BE
      arr.readUInt32LE = BP.readUInt32LE
      arr.readUInt32BE = BP.readUInt32BE
      arr.readIntLE = BP.readIntLE
      arr.readIntBE = BP.readIntBE
      arr.readInt8 = BP.readInt8
      arr.readInt16LE = BP.readInt16LE
      arr.readInt16BE = BP.readInt16BE
      arr.readInt32LE = BP.readInt32LE
      arr.readInt32BE = BP.readInt32BE
      arr.readFloatLE = BP.readFloatLE
      arr.readFloatBE = BP.readFloatBE
      arr.readDoubleLE = BP.readDoubleLE
      arr.readDoubleBE = BP.readDoubleBE
      arr.writeUInt8 = BP.writeUInt8
      arr.writeUIntLE = BP.writeUIntLE
      arr.writeUIntBE = BP.writeUIntBE
      arr.writeUInt16LE = BP.writeUInt16LE
      arr.writeUInt16BE = BP.writeUInt16BE
      arr.writeUInt32LE = BP.writeUInt32LE
      arr.writeUInt32BE = BP.writeUInt32BE
      arr.writeIntLE = BP.writeIntLE
      arr.writeIntBE = BP.writeIntBE
      arr.writeInt8 = BP.writeInt8
      arr.writeInt16LE = BP.writeInt16LE
      arr.writeInt16BE = BP.writeInt16BE
      arr.writeInt32LE = BP.writeInt32LE
      arr.writeInt32BE = BP.writeInt32BE
      arr.writeFloatLE = BP.writeFloatLE
      arr.writeFloatBE = BP.writeFloatBE
      arr.writeDoubleLE = BP.writeDoubleLE
      arr.writeDoubleBE = BP.writeDoubleBE
      arr.fill = BP.fill
      arr.inspect = BP.inspect
      arr.toArrayBuffer = BP.toArrayBuffer
    
      return arr
    }
    
    var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
    
    function base64clean (str) {
      // Node strips out invalid characters like \n and \t from the string, base64-js does not
      str = stringtrim(str).replace(INVALID_BASE64_RE, '')
      // Node converts strings with length < 2 to ''
      if (str.length < 2) return ''
      // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
      while (str.length % 4 !== 0) {
        str = str + '='
      }
      return str
    }
    
    function stringtrim (str) {
      if (str.trim) return str.trim()
      return str.replace(/^\s+|\s+$/g, '')
    }
    
    function toHex (n) {
      if (n < 16) return '0' + n.toString(16)
      return n.toString(16)
    }
    
    function utf8ToBytes (string, units) {
      units = units || Infinity
      var codePoint
      var length = string.length
      var leadSurrogate = null
      var bytes = []
    
      for (var i = 0; i < length; i++) {
        codePoint = string.charCodeAt(i)
    
        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
          // last char was a lead
          if (!leadSurrogate) {
            // no lead yet
            if (codePoint > 0xDBFF) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              continue
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              continue
            }
    
            // valid lead
            leadSurrogate = codePoint
    
            continue
          }
    
          // 2 leads in a row
          if (codePoint < 0xDC00) {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            leadSurrogate = codePoint
            continue
          }
    
          // valid surrogate pair
          codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        }
    
        leadSurrogate = null
    
        // encode utf8
        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break
          bytes.push(codePoint)
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break
          bytes.push(
            codePoint >> 0x6 | 0xC0,
            codePoint & 0x3F | 0x80
          )
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break
          bytes.push(
            codePoint >> 0xC | 0xE0,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          )
        } else if (codePoint < 0x110000) {
          if ((units -= 4) < 0) break
          bytes.push(
            codePoint >> 0x12 | 0xF0,
            codePoint >> 0xC & 0x3F | 0x80,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          )
        } else {
          throw new Error('Invalid code point')
        }
      }
    
      return bytes
    }
    
    function asciiToBytes (str) {
      var byteArray = []
      for (var i = 0; i < str.length; i++) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF)
      }
      return byteArray
    }
    
    function utf16leToBytes (str, units) {
      var c, hi, lo
      var byteArray = []
      for (var i = 0; i < str.length; i++) {
        if ((units -= 2) < 0) break
    
        c = str.charCodeAt(i)
        hi = c >> 8
        lo = c % 256
        byteArray.push(lo)
        byteArray.push(hi)
      }
    
      return byteArray
    }
    
    function base64ToBytes (str) {
      return base64.toByteArray(base64clean(str))
    }
    
    function blitBuffer (src, dst, offset, length) {
      for (var i = 0; i < length; i++) {
        if ((i + offset >= dst.length) || (i >= src.length)) break
        dst[i + offset] = src[i]
      }
      return i
    }
    
    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"base64-js":2,"ieee754":9,"is-array":10}],9:[function(require,module,exports){
    exports.read = function (buffer, offset, isLE, mLen, nBytes) {
      var e, m
      var eLen = nBytes * 8 - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var nBits = -7
      var i = isLE ? (nBytes - 1) : 0
      var d = isLE ? -1 : 1
      var s = buffer[offset + i]
    
      i += d
    
      e = s & ((1 << (-nBits)) - 1)
      s >>= (-nBits)
      nBits += eLen
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
    
      m = e & ((1 << (-nBits)) - 1)
      e >>= (-nBits)
      nBits += mLen
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
    
      if (e === 0) {
        e = 1 - eBias
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity)
      } else {
        m = m + Math.pow(2, mLen)
        e = e - eBias
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    }
    
    exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c
      var eLen = nBytes * 8 - mLen - 1
      var eMax = (1 << eLen) - 1
      var eBias = eMax >> 1
      var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
      var i = isLE ? 0 : (nBytes - 1)
      var d = isLE ? 1 : -1
      var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
    
      value = Math.abs(value)
    
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0
        e = eMax
      } else {
        e = Math.floor(Math.log(value) / Math.LN2)
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--
          c *= 2
        }
        if (e + eBias >= 1) {
          value += rt / c
        } else {
          value += rt * Math.pow(2, 1 - eBias)
        }
        if (value * c >= 2) {
          e++
          c /= 2
        }
    
        if (e + eBias >= eMax) {
          m = 0
          e = eMax
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen)
          e = e + eBias
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
          e = 0
        }
      }
    
      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
    
      e = (e << mLen) | m
      eLen += mLen
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
    
      buffer[offset + i - d] |= s * 128
    }
    
    },{}],10:[function(require,module,exports){
    
    /**
     * isArray
     */
    
    var isArray = Array.isArray;
    
    /**
     * toString
     */
    
    var str = Object.prototype.toString;
    
    /**
     * Whether or not the given `val`
     * is an array.
     *
     * example:
     *
     *        isArray([]);
     *        // > true
     *        isArray(arguments);
     *        // > false
     *        isArray('');
     *        // > false
     *
     * @param {mixed} val
     * @return {bool}
     */
    
    module.exports = isArray || function (val) {
      return !! val && '[object Array]' == str.call(val);
    };
    
    },{}],11:[function(require,module,exports){
    'use strict';
    
    
    var zlib_inflate = require('./zlib/inflate.js');
    var utils = require('./utils/common');
    var strings = require('./utils/strings');
    var c = require('./zlib/constants');
    var msg = require('./zlib/messages');
    var zstream = require('./zlib/zstream');
    var gzheader = require('./zlib/gzheader');
    
    var toString = Object.prototype.toString;
    
    /**
     * class Inflate
     *
     * Generic JS-style wrapper for zlib calls. If you don't need
     * streaming behaviour - use more simple functions: [[inflate]]
     * and [[inflateRaw]].
     **/
    
    /* internal
     * inflate.chunks -> Array
     *
     * Chunks of output data, if [[Inflate#onData]] not overriden.
     **/
    
    /**
     * Inflate.result -> Uint8Array|Array|String
     *
     * Uncompressed result, generated by default [[Inflate#onData]]
     * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
     * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
     * push a chunk with explicit flush (call [[Inflate#push]] with
     * `Z_SYNC_FLUSH` param).
     **/
    
    /**
     * Inflate.err -> Number
     *
     * Error code after inflate finished. 0 (Z_OK) on success.
     * Should be checked if broken data possible.
     **/
    
    /**
     * Inflate.msg -> String
     *
     * Error message, if [[Inflate.err]] != 0
     **/
    
    
    /**
     * new Inflate(options)
     * - options (Object): zlib inflate options.
     *
     * Creates new inflator instance with specified params. Throws exception
     * on bad params. Supported options:
     *
     * - `windowBits`
     *
     * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
     * for more information on these.
     *
     * Additional options, for internal needs:
     *
     * - `chunkSize` - size of generated data chunks (16K by default)
     * - `raw` (Boolean) - do raw inflate
     * - `to` (String) - if equal to 'string', then result will be converted
     *   from utf8 to utf16 (javascript) string. When string output requested,
     *   chunk length can differ from `chunkSize`, depending on content.
     *
     * By default, when no options set, autodetect deflate/gzip data format via
     * wrapper header.
     *
     * ##### Example:
     *
     * ```javascript
     * var pako = require('pako')
     *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
     *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
     *
     * var inflate = new pako.Inflate({ level: 3});
     *
     * inflate.push(chunk1, false);
     * inflate.push(chunk2, true);  // true -> last chunk
     *
     * if (inflate.err) { throw new Error(inflate.err); }
     *
     * console.log(inflate.result);
     * ```
     **/
    var Inflate = function(options) {
    
      this.options = utils.assign({
        chunkSize: 16384,
        windowBits: 0,
        to: ''
      }, options || {});
    
      var opt = this.options;
    
      // Force window size for `raw` data, if not set directly,
      // because we have no header for autodetect.
      if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) { opt.windowBits = -15; }
      }
    
      // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
      if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
          !(options && options.windowBits)) {
        opt.windowBits += 32;
      }
    
      // Gzip header has no info about windows size, we can do autodetect only
      // for deflate. So, if window size not set, force it to max when gzip possible
      if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
        // bit 3 (16) -> gzipped data
        // bit 4 (32) -> autodetect gzip/deflate
        if ((opt.windowBits & 15) === 0) {
          opt.windowBits |= 15;
        }
      }
    
      this.err    = 0;      // error code, if happens (0 = Z_OK)
      this.msg    = '';     // error message
      this.ended  = false;  // used to avoid multiple onEnd() calls
      this.chunks = [];     // chunks of compressed data
    
      this.strm   = new zstream();
      this.strm.avail_out = 0;
    
      var status  = zlib_inflate.inflateInit2(
        this.strm,
        opt.windowBits
      );
    
      if (status !== c.Z_OK) {
        throw new Error(msg[status]);
      }
    
      this.header = new gzheader();
    
      zlib_inflate.inflateGetHeader(this.strm, this.header);
    };
    
    /**
     * Inflate#push(data[, mode]) -> Boolean
     * - data (Uint8Array|Array|ArrayBuffer|String): input data
     * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
     *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
     *
     * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
     * new output chunks. Returns `true` on success. The last data block must have
     * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
     * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
     * can use mode Z_SYNC_FLUSH, keeping the decompression context.
     *
     * On fail call [[Inflate#onEnd]] with error code and return false.
     *
     * We strongly recommend to use `Uint8Array` on input for best speed (output
     * format is detected automatically). Also, don't skip last param and always
     * use the same type in your code (boolean or number). That will improve JS speed.
     *
     * For regular `Array`-s make sure all elements are [0..255].
     *
     * ##### Example
     *
     * ```javascript
     * push(chunk, false); // push one of data chunks
     * ...
     * push(chunk, true);  // push last chunk
     * ```
     **/
    Inflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var status, _mode;
      var next_out_utf8, tail, utf8str;
    
      // Flag to properly process Z_BUF_ERROR on testing inflate call
      // when we check that all output data was flushed.
      var allowBufError = false;
    
      if (this.ended) { return false; }
      _mode = (mode === ~~mode) ? mode : ((mode === true) ? c.Z_FINISH : c.Z_NO_FLUSH);
    
      // Convert data if needed
      if (typeof data === 'string') {
        // Only binary strings can be decompressed on practice
        strm.input = strings.binstring2buf(data);
      } else if (toString.call(data) === '[object ArrayBuffer]') {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
    
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
    
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
    
        status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);    /* no bad return value */
    
        if (status === c.Z_BUF_ERROR && allowBufError === true) {
          status = c.Z_OK;
          allowBufError = false;
        }
    
        if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
    
        if (strm.next_out) {
          if (strm.avail_out === 0 || status === c.Z_STREAM_END || (strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))) {
    
            if (this.options.to === 'string') {
    
              next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
    
              tail = strm.next_out - next_out_utf8;
              utf8str = strings.buf2string(strm.output, next_out_utf8);
    
              // move tail
              strm.next_out = tail;
              strm.avail_out = chunkSize - tail;
              if (tail) { utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }
    
              this.onData(utf8str);
    
            } else {
              this.onData(utils.shrinkBuf(strm.output, strm.next_out));
            }
          }
        }
    
        // When no more input data, we should check that internal inflate buffers
        // are flushed. The only way to do it when avail_out = 0 - run one more
        // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
        // Here we set flag to process this error properly.
        //
        // NOTE. Deflate does not return error in this case and does not needs such
        // logic.
        if (strm.avail_in === 0 && strm.avail_out === 0) {
          allowBufError = true;
        }
    
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
    
      if (status === c.Z_STREAM_END) {
        _mode = c.Z_FINISH;
      }
    
      // Finalize on the last chunk.
      if (_mode === c.Z_FINISH) {
        status = zlib_inflate.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === c.Z_OK;
      }
    
      // callback interim results if Z_SYNC_FLUSH.
      if (_mode === c.Z_SYNC_FLUSH) {
        this.onEnd(c.Z_OK);
        strm.avail_out = 0;
        return true;
      }
    
      return true;
    };
    
    
    /**
     * Inflate#onData(chunk) -> Void
     * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
     *   on js engine support. When string output requested, each chunk
     *   will be string.
     *
     * By default, stores data blocks in `chunks[]` property and glue
     * those in `onEnd`. Override this handler, if you need another behaviour.
     **/
    Inflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    
    
    /**
     * Inflate#onEnd(status) -> Void
     * - status (Number): inflate status. 0 (Z_OK) on success,
     *   other if not.
     *
     * Called either after you tell inflate that the input stream is
     * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
     * or if an error happened. By default - join collected chunks,
     * free memory and fill `results` / `err` properties.
     **/
    Inflate.prototype.onEnd = function(status) {
      // On success - join
      if (status === c.Z_OK) {
        if (this.options.to === 'string') {
          // Glue & convert here, until we teach pako to send
          // utf8 alligned strings to onData
          this.result = this.chunks.join('');
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    
    
    /**
     * inflate(data[, options]) -> Uint8Array|Array|String
     * - data (Uint8Array|Array|String): input data to decompress.
     * - options (Object): zlib inflate options.
     *
     * Decompress `data` with inflate/ungzip and `options`. Autodetect
     * format via wrapper header by default. That's why we don't provide
     * separate `ungzip` method.
     *
     * Supported options are:
     *
     * - windowBits
     *
     * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
     * for more information.
     *
     * Sugar (options):
     *
     * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
     *   negative windowBits implicitly.
     * - `to` (String) - if equal to 'string', then result will be converted
     *   from utf8 to utf16 (javascript) string. When string output requested,
     *   chunk length can differ from `chunkSize`, depending on content.
     *
     *
     * ##### Example:
     *
     * ```javascript
     * var pako = require('pako')
     *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
     *   , output;
     *
     * try {
     *   output = pako.inflate(input);
     * } catch (err)
     *   console.log(err);
     * }
     * ```
     **/
    function inflate(input, options) {
      var inflator = new Inflate(options);
    
      inflator.push(input, true);
    
      // That will never happens, if you don't cheat with options :)
      if (inflator.err) { throw inflator.msg; }
    
      return inflator.result;
    }
    
    
    /**
     * inflateRaw(data[, options]) -> Uint8Array|Array|String
     * - data (Uint8Array|Array|String): input data to decompress.
     * - options (Object): zlib inflate options.
     *
     * The same as [[inflate]], but creates raw data, without wrapper
     * (header and adler32 crc).
     **/
    function inflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return inflate(input, options);
    }
    
    
    /**
     * ungzip(data[, options]) -> Uint8Array|Array|String
     * - data (Uint8Array|Array|String): input data to decompress.
     * - options (Object): zlib inflate options.
     *
     * Just shortcut to [[inflate]], because it autodetects format
     * by header.content. Done for convenience.
     **/
    
    
    exports.Inflate = Inflate;
    exports.inflate = inflate;
    exports.inflateRaw = inflateRaw;
    exports.ungzip  = inflate;
    
    },{"./utils/common":12,"./utils/strings":13,"./zlib/constants":15,"./zlib/gzheader":17,"./zlib/inflate.js":19,"./zlib/messages":21,"./zlib/zstream":22}],12:[function(require,module,exports){
    'use strict';
    
    
    var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
                    (typeof Uint16Array !== 'undefined') &&
                    (typeof Int32Array !== 'undefined');
    
    
    exports.assign = function (obj /*from1, from2, from3, ...*/) {
      var sources = Array.prototype.slice.call(arguments, 1);
      while (sources.length) {
        var source = sources.shift();
        if (!source) { continue; }
    
        if (typeof source !== 'object') {
          throw new TypeError(source + 'must be non-object');
        }
    
        for (var p in source) {
          if (source.hasOwnProperty(p)) {
            obj[p] = source[p];
          }
        }
      }
    
      return obj;
    };
    
    
    // reduce buffer size, avoiding mem copy
    exports.shrinkBuf = function (buf, size) {
      if (buf.length === size) { return buf; }
      if (buf.subarray) { return buf.subarray(0, size); }
      buf.length = size;
      return buf;
    };
    
    
    var fnTyped = {
      arraySet: function (dest, src, src_offs, len, dest_offs) {
        if (src.subarray && dest.subarray) {
          dest.set(src.subarray(src_offs, src_offs+len), dest_offs);
          return;
        }
        // Fallback to ordinary array
        for (var i=0; i<len; i++) {
          dest[dest_offs + i] = src[src_offs + i];
        }
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        var i, l, len, pos, chunk, result;
    
        // calculate data length
        len = 0;
        for (i=0, l=chunks.length; i<l; i++) {
          len += chunks[i].length;
        }
    
        // join chunks
        result = new Uint8Array(len);
        pos = 0;
        for (i=0, l=chunks.length; i<l; i++) {
          chunk = chunks[i];
          result.set(chunk, pos);
          pos += chunk.length;
        }
    
        return result;
      }
    };
    
    var fnUntyped = {
      arraySet: function (dest, src, src_offs, len, dest_offs) {
        for (var i=0; i<len; i++) {
          dest[dest_offs + i] = src[src_offs + i];
        }
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        return [].concat.apply([], chunks);
      }
    };
    
    
    // Enable/Disable typed arrays use, for testing
    //
    exports.setTyped = function (on) {
      if (on) {
        exports.Buf8  = Uint8Array;
        exports.Buf16 = Uint16Array;
        exports.Buf32 = Int32Array;
        exports.assign(exports, fnTyped);
      } else {
        exports.Buf8  = Array;
        exports.Buf16 = Array;
        exports.Buf32 = Array;
        exports.assign(exports, fnUntyped);
      }
    };
    
    exports.setTyped(TYPED_OK);
    
    },{}],13:[function(require,module,exports){
    // String encode/decode helpers
    'use strict';
    
    
    var utils = require('./common');
    
    
    // Quick check if we can use fast array to bin string conversion
    //
    // - apply(Array) can fail on Android 2.2
    // - apply(Uint8Array) can fail on iOS 5.1 Safary
    //
    var STR_APPLY_OK = true;
    var STR_APPLY_UIA_OK = true;
    
    try { String.fromCharCode.apply(null, [0]); } catch(__) { STR_APPLY_OK = false; }
    try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch(__) { STR_APPLY_UIA_OK = false; }
    
    
    // Table with utf8 lengths (calculated by first byte of sequence)
    // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
    // because max possible codepoint is 0x10ffff
    var _utf8len = new utils.Buf8(256);
    for (var q=0; q<256; q++) {
      _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
    }
    _utf8len[254]=_utf8len[254]=1; // Invalid sequence start
    
    
    // convert string to array (typed, when possible)
    exports.string2buf = function (str) {
      var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    
      // count binary size
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
          c2 = str.charCodeAt(m_pos+1);
          if ((c2 & 0xfc00) === 0xdc00) {
            c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
            m_pos++;
          }
        }
        buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
      }
    
      // allocate buffer
      buf = new utils.Buf8(buf_len);
    
      // convert
      for (i=0, m_pos = 0; i < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
          c2 = str.charCodeAt(m_pos+1);
          if ((c2 & 0xfc00) === 0xdc00) {
            c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
            m_pos++;
          }
        }
        if (c < 0x80) {
          /* one byte */
          buf[i++] = c;
        } else if (c < 0x800) {
          /* two bytes */
          buf[i++] = 0xC0 | (c >>> 6);
          buf[i++] = 0x80 | (c & 0x3f);
        } else if (c < 0x10000) {
          /* three bytes */
          buf[i++] = 0xE0 | (c >>> 12);
          buf[i++] = 0x80 | (c >>> 6 & 0x3f);
          buf[i++] = 0x80 | (c & 0x3f);
        } else {
          /* four bytes */
          buf[i++] = 0xf0 | (c >>> 18);
          buf[i++] = 0x80 | (c >>> 12 & 0x3f);
          buf[i++] = 0x80 | (c >>> 6 & 0x3f);
          buf[i++] = 0x80 | (c & 0x3f);
        }
      }
    
      return buf;
    };
    
    // Helper (used in 2 places)
    function buf2binstring(buf, len) {
      // use fallback for big arrays to avoid stack overflow
      if (len < 65537) {
        if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
          return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
        }
      }
    
      var result = '';
      for (var i=0; i < len; i++) {
        result += String.fromCharCode(buf[i]);
      }
      return result;
    }
    
    
    // Convert byte array to binary string
    exports.buf2binstring = function(buf) {
      return buf2binstring(buf, buf.length);
    };
    
    
    // Convert binary string (typed, when possible)
    exports.binstring2buf = function(str) {
      var buf = new utils.Buf8(str.length);
      for (var i=0, len=buf.length; i < len; i++) {
        buf[i] = str.charCodeAt(i);
      }
      return buf;
    };
    
    
    // convert array to string
    exports.buf2string = function (buf, max) {
      var i, out, c, c_len;
      var len = max || buf.length;
    
      // Reserve max possible length (2 words per char)
      // NB: by unknown reasons, Array is significantly faster for
      //     String.fromCharCode.apply than Uint16Array.
      var utf16buf = new Array(len*2);
    
      for (out=0, i=0; i<len;) {
        c = buf[i++];
        // quick process ascii
        if (c < 0x80) { utf16buf[out++] = c; continue; }
    
        c_len = _utf8len[c];
        // skip 5 & 6 byte codes
        if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len-1; continue; }
    
        // apply mask on first byte
        c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
        // join the rest
        while (c_len > 1 && i < len) {
          c = (c << 6) | (buf[i++] & 0x3f);
          c_len--;
        }
    
        // terminated by end of string?
        if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }
    
        if (c < 0x10000) {
          utf16buf[out++] = c;
        } else {
          c -= 0x10000;
          utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
          utf16buf[out++] = 0xdc00 | (c & 0x3ff);
        }
      }
    
      return buf2binstring(utf16buf, out);
    };
    
    
    // Calculate max possible position in utf8 buffer,
    // that will not break sequence. If that's not possible
    // - (very small limits) return max size as is.
    //
    // buf[] - utf8 bytes array
    // max   - length limit (mandatory);
    exports.utf8border = function(buf, max) {
      var pos;
    
      max = max || buf.length;
      if (max > buf.length) { max = buf.length; }
    
      // go back from last position, until start of sequence found
      pos = max-1;
      while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }
    
      // Fuckup - very small and broken sequence,
      // return max, because we should return something anyway.
      if (pos < 0) { return max; }
    
      // If we came to start of buffer - that means vuffer is too small,
      // return max too.
      if (pos === 0) { return max; }
    
      return (pos + _utf8len[buf[pos]] > max) ? pos : max;
    };
    
    },{"./common":12}],14:[function(require,module,exports){
    'use strict';
    
    // Note: adler32 takes 12% for level 0 and 2% for level 6.
    // It doesn't worth to make additional optimizationa as in original.
    // Small size is preferable.
    
    function adler32(adler, buf, len, pos) {
      var s1 = (adler & 0xffff) |0,
          s2 = ((adler >>> 16) & 0xffff) |0,
          n = 0;
    
      while (len !== 0) {
        // Set limit ~ twice less than 5552, to keep
        // s2 in 31-bits, because we force signed ints.
        // in other case %= will fail.
        n = len > 2000 ? 2000 : len;
        len -= n;
    
        do {
          s1 = (s1 + buf[pos++]) |0;
          s2 = (s2 + s1) |0;
        } while (--n);
    
        s1 %= 65521;
        s2 %= 65521;
      }
    
      return (s1 | (s2 << 16)) |0;
    }
    
    
    module.exports = adler32;
    
    },{}],15:[function(require,module,exports){
    module.exports = {
    
      /* Allowed flush values; see deflate() and inflate() below for details */
      Z_NO_FLUSH:         0,
      Z_PARTIAL_FLUSH:    1,
      Z_SYNC_FLUSH:       2,
      Z_FULL_FLUSH:       3,
      Z_FINISH:           4,
      Z_BLOCK:            5,
      Z_TREES:            6,
    
      /* Return codes for the compression/decompression functions. Negative values
      * are errors, positive values are used for special but normal events.
      */
      Z_OK:               0,
      Z_STREAM_END:       1,
      Z_NEED_DICT:        2,
      Z_ERRNO:           -1,
      Z_STREAM_ERROR:    -2,
      Z_DATA_ERROR:      -3,
      //Z_MEM_ERROR:     -4,
      Z_BUF_ERROR:       -5,
      //Z_VERSION_ERROR: -6,
    
      /* compression levels */
      Z_NO_COMPRESSION:         0,
      Z_BEST_SPEED:             1,
      Z_BEST_COMPRESSION:       9,
      Z_DEFAULT_COMPRESSION:   -1,
    
    
      Z_FILTERED:               1,
      Z_HUFFMAN_ONLY:           2,
      Z_RLE:                    3,
      Z_FIXED:                  4,
      Z_DEFAULT_STRATEGY:       0,
    
      /* Possible values of the data_type field (though see inflate()) */
      Z_BINARY:                 0,
      Z_TEXT:                   1,
      //Z_ASCII:                1, // = Z_TEXT (deprecated)
      Z_UNKNOWN:                2,
    
      /* The deflate compression method */
      Z_DEFLATED:               8
      //Z_NULL:                 null // Use -1 or null inline, depending on var type
    };
    
    },{}],16:[function(require,module,exports){
    'use strict';
    
    // Note: we can't get significant speed boost here.
    // So write code to minimize size - no pregenerated tables
    // and array tools dependencies.
    
    
    // Use ordinary array, since untyped makes no boost here
    function makeTable() {
      var c, table = [];
    
      for (var n =0; n < 256; n++) {
        c = n;
        for (var k =0; k < 8; k++) {
          c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        table[n] = c;
      }
    
      return table;
    }
    
    // Create table on load. Just 255 signed longs. Not a problem.
    var crcTable = makeTable();
    
    
    function crc32(crc, buf, len, pos) {
      var t = crcTable,
          end = pos + len;
    
      crc = crc ^ (-1);
    
      for (var i = pos; i < end; i++) {
        crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
      }
    
      return (crc ^ (-1)); // >>> 0;
    }
    
    
    module.exports = crc32;
    
    },{}],17:[function(require,module,exports){
    'use strict';
    
    
    function GZheader() {
      /* true if compressed data believed to be text */
      this.text       = 0;
      /* modification time */
      this.time       = 0;
      /* extra flags (not used when writing a gzip file) */
      this.xflags     = 0;
      /* operating system */
      this.os         = 0;
      /* pointer to extra field or Z_NULL if none */
      this.extra      = null;
      /* extra field length (valid if extra != Z_NULL) */
      this.extra_len  = 0; // Actually, we don't need it in JS,
                           // but leave for few code modifications
    
      //
      // Setup limits is not necessary because in js we should not preallocate memory
      // for inflate use constant limit in 65536 bytes
      //
    
      /* space at extra (only when reading header) */
      // this.extra_max  = 0;
      /* pointer to zero-terminated file name or Z_NULL */
      this.name       = '';
      /* space at name (only when reading header) */
      // this.name_max   = 0;
      /* pointer to zero-terminated comment or Z_NULL */
      this.comment    = '';
      /* space at comment (only when reading header) */
      // this.comm_max   = 0;
      /* true if there was or will be a header crc */
      this.hcrc       = 0;
      /* true when done reading gzip header (not used when writing a gzip file) */
      this.done       = false;
    }
    
    module.exports = GZheader;
    
    },{}],18:[function(require,module,exports){
    'use strict';
    
    // See state defs from inflate.js
    var BAD = 30;       /* got a data error -- remain here until reset */
    var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
    
    /*
       Decode literal, length, and distance codes and write out the resulting
       literal and match bytes until either not enough input or output is
       available, an end-of-block is encountered, or a data error is encountered.
       When large enough input and output buffers are supplied to inflate(), for
       example, a 16K input buffer and a 64K output buffer, more than 95% of the
       inflate execution time is spent in this routine.
    
       Entry assumptions:
    
            state.mode === LEN
            strm.avail_in >= 6
            strm.avail_out >= 258
            start >= strm.avail_out
            state.bits < 8
    
       On return, state.mode is one of:
    
            LEN -- ran out of enough output space or enough available input
            TYPE -- reached end of block code, inflate() to interpret next block
            BAD -- error in block data
    
       Notes:
    
        - The maximum input bits used by a length/distance pair is 15 bits for the
          length code, 5 bits for the length extra, 15 bits for the distance code,
          and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
          Therefore if strm.avail_in >= 6, then there is enough input to avoid
          checking for available input while decoding.
    
        - The maximum bytes that a single length/distance pair can output is 258
          bytes, which is the maximum length that can be coded.  inflate_fast()
          requires strm.avail_out >= 258 for each loop to avoid checking for
          output space.
     */
    module.exports = function inflate_fast(strm, start) {
      var state;
      var _in;                    /* local strm.input */
      var last;                   /* have enough input while in < last */
      var _out;                   /* local strm.output */
      var beg;                    /* inflate()'s initial strm.output */
      var end;                    /* while out < end, enough space available */
    //#ifdef INFLATE_STRICT
      var dmax;                   /* maximum distance from zlib header */
    //#endif
      var wsize;                  /* window size or zero if not using window */
      var whave;                  /* valid bytes in the window */
      var wnext;                  /* window write index */
      // Use `s_window` instead `window`, avoid conflict with instrumentation tools
      var s_window;               /* allocated sliding window, if wsize != 0 */
      var hold;                   /* local strm.hold */
      var bits;                   /* local strm.bits */
      var lcode;                  /* local strm.lencode */
      var dcode;                  /* local strm.distcode */
      var lmask;                  /* mask for first level of length codes */
      var dmask;                  /* mask for first level of distance codes */
      var here;                   /* retrieved table entry */
      var op;                     /* code bits, operation, extra bits, or */
                                  /*  window position, window bytes to copy */
      var len;                    /* match length, unused bytes */
      var dist;                   /* match distance */
      var from;                   /* where to copy match from */
      var from_source;
    
    
      var input, output; // JS specific, because we have no pointers
    
      /* copy state to local variables */
      state = strm.state;
      //here = state.here;
      _in = strm.next_in;
      input = strm.input;
      last = _in + (strm.avail_in - 5);
      _out = strm.next_out;
      output = strm.output;
      beg = _out - (start - strm.avail_out);
      end = _out + (strm.avail_out - 257);
    //#ifdef INFLATE_STRICT
      dmax = state.dmax;
    //#endif
      wsize = state.wsize;
      whave = state.whave;
      wnext = state.wnext;
      s_window = state.window;
      hold = state.hold;
      bits = state.bits;
      lcode = state.lencode;
      dcode = state.distcode;
      lmask = (1 << state.lenbits) - 1;
      dmask = (1 << state.distbits) - 1;
    
    
      /* decode literals and length/distances until end-of-block or not enough
         input data or output space */
    
      top:
      do {
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
    
        here = lcode[hold & lmask];
    
        dolen:
        for (;;) { // Goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;
          if (op === 0) {                          /* literal */
            //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
            //        "inflate:         literal '%c'\n" :
            //        "inflate:         literal 0x%02x\n", here.val));
            output[_out++] = here & 0xffff/*here.val*/;
          }
          else if (op & 16) {                     /* length base */
            len = here & 0xffff/*here.val*/;
            op &= 15;                           /* number of extra bits */
            if (op) {
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
              len += hold & ((1 << op) - 1);
              hold >>>= op;
              bits -= op;
            }
            //Tracevv((stderr, "inflate:         length %u\n", len));
            if (bits < 15) {
              hold += input[_in++] << bits;
              bits += 8;
              hold += input[_in++] << bits;
              bits += 8;
            }
            here = dcode[hold & dmask];
    
            dodist:
            for (;;) { // goto emulation
              op = here >>> 24/*here.bits*/;
              hold >>>= op;
              bits -= op;
              op = (here >>> 16) & 0xff/*here.op*/;
    
              if (op & 16) {                      /* distance base */
                dist = here & 0xffff/*here.val*/;
                op &= 15;                       /* number of extra bits */
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                  }
                }
                dist += hold & ((1 << op) - 1);
    //#ifdef INFLATE_STRICT
                if (dist > dmax) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                }
    //#endif
                hold >>>= op;
                bits -= op;
                //Tracevv((stderr, "inflate:         distance %u\n", dist));
                op = _out - beg;                /* max distance in output */
                if (dist > op) {                /* see if copy from window */
                  op = dist - op;               /* distance back in window */
                  if (op > whave) {
                    if (state.sane) {
                      strm.msg = 'invalid distance too far back';
                      state.mode = BAD;
                      break top;
                    }
    
    // (!) This block is disabled in zlib defailts,
    // don't enable it for binary compatibility
    //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
    //                if (len <= op - whave) {
    //                  do {
    //                    output[_out++] = 0;
    //                  } while (--len);
    //                  continue top;
    //                }
    //                len -= op - whave;
    //                do {
    //                  output[_out++] = 0;
    //                } while (--op > whave);
    //                if (op === 0) {
    //                  from = _out - dist;
    //                  do {
    //                    output[_out++] = output[from++];
    //                  } while (--len);
    //                  continue top;
    //                }
    //#endif
                  }
                  from = 0; // window index
                  from_source = s_window;
                  if (wnext === 0) {           /* very common case */
                    from += wsize - op;
                    if (op < len) {         /* some from window */
                      len -= op;
                      do {
                        output[_out++] = s_window[from++];
                      } while (--op);
                      from = _out - dist;  /* rest from output */
                      from_source = output;
                    }
                  }
                  else if (wnext < op) {      /* wrap around window */
                    from += wsize + wnext - op;
                    op -= wnext;
                    if (op < len) {         /* some from end of window */
                      len -= op;
                      do {
                        output[_out++] = s_window[from++];
                      } while (--op);
                      from = 0;
                      if (wnext < len) {  /* some from start of window */
                        op = wnext;
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;      /* rest from output */
                        from_source = output;
                      }
                    }
                  }
                  else {                      /* contiguous in window */
                    from += wnext - op;
                    if (op < len) {         /* some from window */
                      len -= op;
                      do {
                        output[_out++] = s_window[from++];
                      } while (--op);
                      from = _out - dist;  /* rest from output */
                      from_source = output;
                    }
                  }
                  while (len > 2) {
                    output[_out++] = from_source[from++];
                    output[_out++] = from_source[from++];
                    output[_out++] = from_source[from++];
                    len -= 3;
                  }
                  if (len) {
                    output[_out++] = from_source[from++];
                    if (len > 1) {
                      output[_out++] = from_source[from++];
                    }
                  }
                }
                else {
                  from = _out - dist;          /* copy direct from output */
                  do {                        /* minimum length is three */
                    output[_out++] = output[from++];
                    output[_out++] = output[from++];
                    output[_out++] = output[from++];
                    len -= 3;
                  } while (len > 2);
                  if (len) {
                    output[_out++] = output[from++];
                    if (len > 1) {
                      output[_out++] = output[from++];
                    }
                  }
                }
              }
              else if ((op & 64) === 0) {          /* 2nd level distance code */
                here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
                continue dodist;
              }
              else {
                strm.msg = 'invalid distance code';
                state.mode = BAD;
                break top;
              }
    
              break; // need to emulate goto via "continue"
            }
          }
          else if ((op & 64) === 0) {              /* 2nd level length code */
            here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dolen;
          }
          else if (op & 32) {                     /* end-of-block */
            //Tracevv((stderr, "inflate:         end of block\n"));
            state.mode = TYPE;
            break top;
          }
          else {
            strm.msg = 'invalid literal/length code';
            state.mode = BAD;
            break top;
          }
    
          break; // need to emulate goto via "continue"
        }
      } while (_in < last && _out < end);
    
      /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
      len = bits >> 3;
      _in -= len;
      bits -= len << 3;
      hold &= (1 << bits) - 1;
    
      /* update state and return */
      strm.next_in = _in;
      strm.next_out = _out;
      strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
      strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
      state.hold = hold;
      state.bits = bits;
      return;
    };
    
    },{}],19:[function(require,module,exports){
    'use strict';
    
    
    var utils = require('../utils/common');
    var adler32 = require('./adler32');
    var crc32   = require('./crc32');
    var inflate_fast = require('./inffast');
    var inflate_table = require('./inftrees');
    
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    
    /* Public constants ==========================================================*/
    /* ===========================================================================*/
    
    
    /* Allowed flush values; see deflate() and inflate() below for details */
    //var Z_NO_FLUSH      = 0;
    //var Z_PARTIAL_FLUSH = 1;
    //var Z_SYNC_FLUSH    = 2;
    //var Z_FULL_FLUSH    = 3;
    var Z_FINISH        = 4;
    var Z_BLOCK         = 5;
    var Z_TREES         = 6;
    
    
    /* Return codes for the compression/decompression functions. Negative values
     * are errors, positive values are used for special but normal events.
     */
    var Z_OK            = 0;
    var Z_STREAM_END    = 1;
    var Z_NEED_DICT     = 2;
    //var Z_ERRNO         = -1;
    var Z_STREAM_ERROR  = -2;
    var Z_DATA_ERROR    = -3;
    var Z_MEM_ERROR     = -4;
    var Z_BUF_ERROR     = -5;
    //var Z_VERSION_ERROR = -6;
    
    /* The deflate compression method */
    var Z_DEFLATED  = 8;
    
    
    /* STATES ====================================================================*/
    /* ===========================================================================*/
    
    
    var    HEAD = 1;       /* i: waiting for magic header */
    var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
    var    TIME = 3;       /* i: waiting for modification time (gzip) */
    var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
    var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
    var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
    var    NAME = 7;       /* i: waiting for end of file name (gzip) */
    var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
    var    HCRC = 9;       /* i: waiting for header crc (gzip) */
    var    DICTID = 10;    /* i: waiting for dictionary check value */
    var    DICT = 11;      /* waiting for inflateSetDictionary() call */
    var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
    var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
    var        STORED = 14;    /* i: waiting for stored size (length and complement) */
    var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
    var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
    var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
    var        LENLENS = 18;   /* i: waiting for code length code lengths */
    var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
    var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
    var            LEN = 21;       /* i: waiting for length/lit/eob code */
    var            LENEXT = 22;    /* i: waiting for length extra bits */
    var            DIST = 23;      /* i: waiting for distance code */
    var            DISTEXT = 24;   /* i: waiting for distance extra bits */
    var            MATCH = 25;     /* o: waiting for output space to copy string */
    var            LIT = 26;       /* o: waiting for output space to write literal */
    var    CHECK = 27;     /* i: waiting for 32-bit check value */
    var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
    var    DONE = 29;      /* finished check, done -- remain here until reset */
    var    BAD = 30;       /* got a data error -- remain here until reset */
    var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
    var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */
    
    /* ===========================================================================*/
    
    
    
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    //var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);
    
    var MAX_WBITS = 15;
    /* 32K LZ77 window */
    var DEF_WBITS = MAX_WBITS;
    
    
    function ZSWAP32(q) {
      return  (((q >>> 24) & 0xff) +
              ((q >>> 8) & 0xff00) +
              ((q & 0xff00) << 8) +
              ((q & 0xff) << 24));
    }
    
    
    function InflateState() {
      this.mode = 0;             /* current inflate mode */
      this.last = false;          /* true if processing last block */
      this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
      this.havedict = false;      /* true if dictionary provided */
      this.flags = 0;             /* gzip header method and flags (0 if zlib) */
      this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
      this.check = 0;             /* protected copy of check value */
      this.total = 0;             /* protected copy of output count */
      // TODO: may be {}
      this.head = null;           /* where to save gzip header information */
    
      /* sliding window */
      this.wbits = 0;             /* log base 2 of requested window size */
      this.wsize = 0;             /* window size or zero if not using window */
      this.whave = 0;             /* valid bytes in the window */
      this.wnext = 0;             /* window write index */
      this.window = null;         /* allocated sliding window, if needed */
    
      /* bit accumulator */
      this.hold = 0;              /* input bit accumulator */
      this.bits = 0;              /* number of bits in "in" */
    
      /* for string and stored block copying */
      this.length = 0;            /* literal or length of data to copy */
      this.offset = 0;            /* distance back to copy string from */
    
      /* for table and code decoding */
      this.extra = 0;             /* extra bits needed */
    
      /* fixed and dynamic code tables */
      this.lencode = null;          /* starting table for length/literal codes */
      this.distcode = null;         /* starting table for distance codes */
      this.lenbits = 0;           /* index bits for lencode */
      this.distbits = 0;          /* index bits for distcode */
    
      /* dynamic table building */
      this.ncode = 0;             /* number of code length code lengths */
      this.nlen = 0;              /* number of length code lengths */
      this.ndist = 0;             /* number of distance code lengths */
      this.have = 0;              /* number of code lengths in lens[] */
      this.next = null;              /* next available space in codes[] */
    
      this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
      this.work = new utils.Buf16(288); /* work area for code table building */
    
      /*
       because we don't have pointers in js, we use lencode and distcode directly
       as buffers so we don't need codes
      */
      //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
      this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
      this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
      this.sane = 0;                   /* if false, allow invalid distance too far */
      this.back = 0;                   /* bits back of last unprocessed length/lit */
      this.was = 0;                    /* initial length of match */
    }
    
    function inflateResetKeep(strm) {
      var state;
    
      if (!strm || !strm.state) { return Z_STREAM_ERROR; }
      state = strm.state;
      strm.total_in = strm.total_out = state.total = 0;
      strm.msg = ''; /*Z_NULL*/
      if (state.wrap) {       /* to support ill-conceived Java test suite */
        strm.adler = state.wrap & 1;
      }
      state.mode = HEAD;
      state.last = 0;
      state.havedict = 0;
      state.dmax = 32768;
      state.head = null/*Z_NULL*/;
      state.hold = 0;
      state.bits = 0;
      //state.lencode = state.distcode = state.next = state.codes;
      state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
      state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
    
      state.sane = 1;
      state.back = -1;
      //Tracev((stderr, "inflate: reset\n"));
      return Z_OK;
    }
    
    function inflateReset(strm) {
      var state;
    
      if (!strm || !strm.state) { return Z_STREAM_ERROR; }
      state = strm.state;
      state.wsize = 0;
      state.whave = 0;
      state.wnext = 0;
      return inflateResetKeep(strm);
    
    }
    
    function inflateReset2(strm, windowBits) {
      var wrap;
      var state;
    
      /* get the state */
      if (!strm || !strm.state) { return Z_STREAM_ERROR; }
      state = strm.state;
    
      /* extract wrap request from windowBits parameter */
      if (windowBits < 0) {
        wrap = 0;
        windowBits = -windowBits;
      }
      else {
        wrap = (windowBits >> 4) + 1;
        if (windowBits < 48) {
          windowBits &= 15;
        }
      }
    
      /* set number of window bits, free window if different */
      if (windowBits && (windowBits < 8 || windowBits > 15)) {
        return Z_STREAM_ERROR;
      }
      if (state.window !== null && state.wbits !== windowBits) {
        state.window = null;
      }
    
      /* update state and reset the rest of it */
      state.wrap = wrap;
      state.wbits = windowBits;
      return inflateReset(strm);
    }
    
    function inflateInit2(strm, windowBits) {
      var ret;
      var state;
    
      if (!strm) { return Z_STREAM_ERROR; }
      //strm.msg = Z_NULL;                 /* in case we return an error */
    
      state = new InflateState();
    
      //if (state === Z_NULL) return Z_MEM_ERROR;
      //Tracev((stderr, "inflate: allocated\n"));
      strm.state = state;
      state.window = null/*Z_NULL*/;
      ret = inflateReset2(strm, windowBits);
      if (ret !== Z_OK) {
        strm.state = null/*Z_NULL*/;
      }
      return ret;
    }
    
    function inflateInit(strm) {
      return inflateInit2(strm, DEF_WBITS);
    }
    
    
    /*
     Return state with length and distance decoding tables and index sizes set to
     fixed code decoding.  Normally this returns fixed tables from inffixed.h.
     If BUILDFIXED is defined, then instead this routine builds the tables the
     first time it's called, and returns those tables the first time and
     thereafter.  This reduces the size of the code by about 2K bytes, in
     exchange for a little execution time.  However, BUILDFIXED should not be
     used for threaded applications, since the rewriting of the tables and virgin
     may not be thread-safe.
     */
    var virgin = true;
    
    var lenfix, distfix; // We have no pointers in JS, so keep tables separate
    
    function fixedtables(state) {
      /* build fixed huffman tables if first call (may not be thread safe) */
      if (virgin) {
        var sym;
    
        lenfix = new utils.Buf32(512);
        distfix = new utils.Buf32(32);
    
        /* literal/length table */
        sym = 0;
        while (sym < 144) { state.lens[sym++] = 8; }
        while (sym < 256) { state.lens[sym++] = 9; }
        while (sym < 280) { state.lens[sym++] = 7; }
        while (sym < 288) { state.lens[sym++] = 8; }
    
        inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, {bits: 9});
    
        /* distance table */
        sym = 0;
        while (sym < 32) { state.lens[sym++] = 5; }
    
        inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, {bits: 5});
    
        /* do this just once */
        virgin = false;
      }
    
      state.lencode = lenfix;
      state.lenbits = 9;
      state.distcode = distfix;
      state.distbits = 5;
    }
    
    
    /*
     Update the window with the last wsize (normally 32K) bytes written before
     returning.  If window does not exist yet, create it.  This is only called
     when a window is already in use, or when output has been written during this
     inflate call, but the end of the deflate stream has not been reached yet.
     It is also called to create a window for dictionary data when a dictionary
     is loaded.
    
     Providing output buffers larger than 32K to inflate() should provide a speed
     advantage, since only the last 32K of output is copied to the sliding window
     upon return from inflate(), and since all distances after the first 32K of
     output will fall in the output data, making match copies simpler and faster.
     The advantage may be dependent on the size of the processor's data caches.
     */
    function updatewindow(strm, src, end, copy) {
      var dist;
      var state = strm.state;
    
      /* if it hasn't been done already, allocate space for the window */
      if (state.window === null) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
    
        state.window = new utils.Buf8(state.wsize);
      }
    
      /* copy state->wsize or less output bytes into the circular window */
      if (copy >= state.wsize) {
        utils.arraySet(state.window,src, end - state.wsize, state.wsize, 0);
        state.wnext = 0;
        state.whave = state.wsize;
      }
      else {
        dist = state.wsize - state.wnext;
        if (dist > copy) {
          dist = copy;
        }
        //zmemcpy(state->window + state->wnext, end - copy, dist);
        utils.arraySet(state.window,src, end - copy, dist, state.wnext);
        copy -= dist;
        if (copy) {
          //zmemcpy(state->window, end - copy, copy);
          utils.arraySet(state.window,src, end - copy, copy, 0);
          state.wnext = copy;
          state.whave = state.wsize;
        }
        else {
          state.wnext += dist;
          if (state.wnext === state.wsize) { state.wnext = 0; }
          if (state.whave < state.wsize) { state.whave += dist; }
        }
      }
      return 0;
    }
    
    function inflate(strm, flush) {
      var state;
      var input, output;          // input/output buffers
      var next;                   /* next input INDEX */
      var put;                    /* next output INDEX */
      var have, left;             /* available input and output */
      var hold;                   /* bit buffer */
      var bits;                   /* bits in bit buffer */
      var _in, _out;              /* save starting available input and output */
      var copy;                   /* number of stored or match bytes to copy */
      var from;                   /* where to copy match bytes from */
      var from_source;
      var here = 0;               /* current decoding table entry */
      var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
      //var last;                   /* parent table entry */
      var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
      var len;                    /* length to copy for repeats, bits to drop */
      var ret;                    /* return code */
      var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
      var opts;
    
      var n; // temporary var for NEED_BITS
    
      var order = /* permutation of code lengths */
        [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    
    
      if (!strm || !strm.state || !strm.output ||
          (!strm.input && strm.avail_in !== 0)) {
        return Z_STREAM_ERROR;
      }
    
      state = strm.state;
      if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */
    
    
      //--- LOAD() ---
      put = strm.next_out;
      output = strm.output;
      left = strm.avail_out;
      next = strm.next_in;
      input = strm.input;
      have = strm.avail_in;
      hold = state.hold;
      bits = state.bits;
      //---
    
      _in = have;
      _out = left;
      ret = Z_OK;
    
      inf_leave: // goto emulation
      for (;;) {
        switch (state.mode) {
        case HEAD:
          if (state.wrap === 0) {
            state.mode = TYPEDO;
            break;
          }
          //=== NEEDBITS(16);
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
            state.check = 0/*crc32(0L, Z_NULL, 0)*/;
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            //===//
    
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = FLAGS;
            break;
          }
          state.flags = 0;           /* expect zlib header */
          if (state.head) {
            state.head.done = false;
          }
          if (!(state.wrap & 1) ||   /* check if zlib header allowed */
            (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
            strm.msg = 'incorrect header check';
            state.mode = BAD;
            break;
          }
          if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
            strm.msg = 'unknown compression method';
            state.mode = BAD;
            break;
          }
          //--- DROPBITS(4) ---//
          hold >>>= 4;
          bits -= 4;
          //---//
          len = (hold & 0x0f)/*BITS(4)*/ + 8;
          if (state.wbits === 0) {
            state.wbits = len;
          }
          else if (len > state.wbits) {
            strm.msg = 'invalid window size';
            state.mode = BAD;
            break;
          }
          state.dmax = 1 << len;
          //Tracev((stderr, "inflate:   zlib header ok\n"));
          strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
          state.mode = hold & 0x200 ? DICTID : TYPE;
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          break;
        case FLAGS:
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.flags = hold;
          if ((state.flags & 0xff) !== Z_DEFLATED) {
            strm.msg = 'unknown compression method';
            state.mode = BAD;
            break;
          }
          if (state.flags & 0xe000) {
            strm.msg = 'unknown header flags set';
            state.mode = BAD;
            break;
          }
          if (state.head) {
            state.head.text = ((hold >> 8) & 1);
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = TIME;
          /* falls through */
        case TIME:
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (state.head) {
            state.head.time = hold;
          }
          if (state.flags & 0x0200) {
            //=== CRC4(state.check, hold)
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            hbuf[2] = (hold >>> 16) & 0xff;
            hbuf[3] = (hold >>> 24) & 0xff;
            state.check = crc32(state.check, hbuf, 4, 0);
            //===
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = OS;
          /* falls through */
        case OS:
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (state.head) {
            state.head.xflags = (hold & 0xff);
            state.head.os = (hold >> 8);
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = EXLEN;
          /* falls through */
        case EXLEN:
          if (state.flags & 0x0400) {
            //=== NEEDBITS(16); */
            while (bits < 16) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.length = hold;
            if (state.head) {
              state.head.extra_len = hold;
            }
            if (state.flags & 0x0200) {
              //=== CRC2(state.check, hold);
              hbuf[0] = hold & 0xff;
              hbuf[1] = (hold >>> 8) & 0xff;
              state.check = crc32(state.check, hbuf, 2, 0);
              //===//
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
          }
          else if (state.head) {
            state.head.extra = null/*Z_NULL*/;
          }
          state.mode = EXTRA;
          /* falls through */
        case EXTRA:
          if (state.flags & 0x0400) {
            copy = state.length;
            if (copy > have) { copy = have; }
            if (copy) {
              if (state.head) {
                len = state.head.extra_len - state.length;
                if (!state.head.extra) {
                  // Use untyped array for more conveniend processing later
                  state.head.extra = new Array(state.head.extra_len);
                }
                utils.arraySet(
                  state.head.extra,
                  input,
                  next,
                  // extra field is limited to 65536 bytes
                  // - no need for additional size check
                  copy,
                  /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                  len
                );
                //zmemcpy(state.head.extra + len, next,
                //        len + copy > state.head.extra_max ?
                //        state.head.extra_max - len : copy);
              }
              if (state.flags & 0x0200) {
                state.check = crc32(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              state.length -= copy;
            }
            if (state.length) { break inf_leave; }
          }
          state.length = 0;
          state.mode = NAME;
          /* falls through */
        case NAME:
          if (state.flags & 0x0800) {
            if (have === 0) { break inf_leave; }
            copy = 0;
            do {
              // TODO: 2 or 1 bytes?
              len = input[next + copy++];
              /* use constant limit because in js we should not preallocate memory */
              if (state.head && len &&
                  (state.length < 65536 /*state.head.name_max*/)) {
                state.head.name += String.fromCharCode(len);
              }
            } while (len && copy < have);
    
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) { break inf_leave; }
          }
          else if (state.head) {
            state.head.name = null;
          }
          state.length = 0;
          state.mode = COMMENT;
          /* falls through */
        case COMMENT:
          if (state.flags & 0x1000) {
            if (have === 0) { break inf_leave; }
            copy = 0;
            do {
              len = input[next + copy++];
              /* use constant limit because in js we should not preallocate memory */
              if (state.head && len &&
                  (state.length < 65536 /*state.head.comm_max*/)) {
                state.head.comment += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) { break inf_leave; }
          }
          else if (state.head) {
            state.head.comment = null;
          }
          state.mode = HCRC;
          /* falls through */
        case HCRC:
          if (state.flags & 0x0200) {
            //=== NEEDBITS(16); */
            while (bits < 16) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            if (hold !== (state.check & 0xffff)) {
              strm.msg = 'header crc mismatch';
              state.mode = BAD;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
          }
          if (state.head) {
            state.head.hcrc = ((state.flags >> 9) & 1);
            state.head.done = true;
          }
          strm.adler = state.check = 0 /*crc32(0L, Z_NULL, 0)*/;
          state.mode = TYPE;
          break;
        case DICTID:
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          strm.adler = state.check = ZSWAP32(hold);
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = DICT;
          /* falls through */
        case DICT:
          if (state.havedict === 0) {
            //--- RESTORE() ---
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            //---
            return Z_NEED_DICT;
          }
          strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
          state.mode = TYPE;
          /* falls through */
        case TYPE:
          if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
          /* falls through */
        case TYPEDO:
          if (state.last) {
            //--- BYTEBITS() ---//
            hold >>>= bits & 7;
            bits -= bits & 7;
            //---//
            state.mode = CHECK;
            break;
          }
          //=== NEEDBITS(3); */
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.last = (hold & 0x01)/*BITS(1)*/;
          //--- DROPBITS(1) ---//
          hold >>>= 1;
          bits -= 1;
          //---//
    
          switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
          }
          //--- DROPBITS(2) ---//
          hold >>>= 2;
          bits -= 2;
          //---//
          break;
        case STORED:
          //--- BYTEBITS() ---// /* go to byte boundary */
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
            strm.msg = 'invalid stored block lengths';
            state.mode = BAD;
            break;
          }
          state.length = hold & 0xffff;
          //Tracev((stderr, "inflate:       stored length %u\n",
          //        state.length));
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = COPY_;
          if (flush === Z_TREES) { break inf_leave; }
          /* falls through */
        case COPY_:
          state.mode = COPY;
          /* falls through */
        case COPY:
          copy = state.length;
          if (copy) {
            if (copy > have) { copy = have; }
            if (copy > left) { copy = left; }
            if (copy === 0) { break inf_leave; }
            //--- zmemcpy(put, next, copy); ---
            utils.arraySet(output, input, next, copy, put);
            //---//
            have -= copy;
            next += copy;
            left -= copy;
            put += copy;
            state.length -= copy;
            break;
          }
          //Tracev((stderr, "inflate:       stored end\n"));
          state.mode = TYPE;
          break;
        case TABLE:
          //=== NEEDBITS(14); */
          while (bits < 14) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
          //--- DROPBITS(5) ---//
          hold >>>= 5;
          bits -= 5;
          //---//
          state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
          //--- DROPBITS(5) ---//
          hold >>>= 5;
          bits -= 5;
          //---//
          state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
          //--- DROPBITS(4) ---//
          hold >>>= 4;
          bits -= 4;
          //---//
    //#ifndef PKZIP_BUG_WORKAROUND
          if (state.nlen > 286 || state.ndist > 30) {
            strm.msg = 'too many length or distance symbols';
            state.mode = BAD;
            break;
          }
    //#endif
          //Tracev((stderr, "inflate:       table sizes ok\n"));
          state.have = 0;
          state.mode = LENLENS;
          /* falls through */
        case LENLENS:
          while (state.have < state.ncode) {
            //=== NEEDBITS(3);
            while (bits < 3) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
            //--- DROPBITS(3) ---//
            hold >>>= 3;
            bits -= 3;
            //---//
          }
          while (state.have < 19) {
            state.lens[order[state.have++]] = 0;
          }
          // We have separate tables & no pointers. 2 commented lines below not needed.
          //state.next = state.codes;
          //state.lencode = state.next;
          // Switch to use dynamic table
          state.lencode = state.lendyn;
          state.lenbits = 7;
    
          opts = {bits: state.lenbits};
          ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
    
          if (ret) {
            strm.msg = 'invalid code lengths set';
            state.mode = BAD;
            break;
          }
          //Tracev((stderr, "inflate:       code lengths ok\n"));
          state.have = 0;
          state.mode = CODELENS;
          /* falls through */
        case CODELENS:
          while (state.have < state.nlen + state.ndist) {
            for (;;) {
              here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
              here_bits = here >>> 24;
              here_op = (here >>> 16) & 0xff;
              here_val = here & 0xffff;
    
              if ((here_bits) <= bits) { break; }
              //--- PULLBYTE() ---//
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            if (here_val < 16) {
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              state.lens[state.have++] = here_val;
            }
            else {
              if (here_val === 16) {
                //=== NEEDBITS(here.bits + 2);
                n = here_bits + 2;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                if (state.have === 0) {
                  strm.msg = 'invalid bit length repeat';
                  state.mode = BAD;
                  break;
                }
                len = state.lens[state.have - 1];
                copy = 3 + (hold & 0x03);//BITS(2);
                //--- DROPBITS(2) ---//
                hold >>>= 2;
                bits -= 2;
                //---//
              }
              else if (here_val === 17) {
                //=== NEEDBITS(here.bits + 3);
                n = here_bits + 3;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                len = 0;
                copy = 3 + (hold & 0x07);//BITS(3);
                //--- DROPBITS(3) ---//
                hold >>>= 3;
                bits -= 3;
                //---//
              }
              else {
                //=== NEEDBITS(here.bits + 7);
                n = here_bits + 7;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                len = 0;
                copy = 11 + (hold & 0x7f);//BITS(7);
                //--- DROPBITS(7) ---//
                hold >>>= 7;
                bits -= 7;
                //---//
              }
              if (state.have + copy > state.nlen + state.ndist) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              while (copy--) {
                state.lens[state.have++] = len;
              }
            }
          }
    
          /* handle error breaks in while */
          if (state.mode === BAD) { break; }
    
          /* check for end-of-block code (better have one) */
          if (state.lens[256] === 0) {
            strm.msg = 'invalid code -- missing end-of-block';
            state.mode = BAD;
            break;
          }
    
          /* build code tables -- note: do not change the lenbits or distbits
             values here (9 and 6) without reading the comments in inftrees.h
             concerning the ENOUGH constants, which depend on those values */
          state.lenbits = 9;
    
          opts = {bits: state.lenbits};
          ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
          // We have separate tables & no pointers. 2 commented lines below not needed.
          // state.next_index = opts.table_index;
          state.lenbits = opts.bits;
          // state.lencode = state.next;
    
          if (ret) {
            strm.msg = 'invalid literal/lengths set';
            state.mode = BAD;
            break;
          }
    
          state.distbits = 6;
          //state.distcode.copy(state.codes);
          // Switch to use dynamic table
          state.distcode = state.distdyn;
          opts = {bits: state.distbits};
          ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
          // We have separate tables & no pointers. 2 commented lines below not needed.
          // state.next_index = opts.table_index;
          state.distbits = opts.bits;
          // state.distcode = state.next;
    
          if (ret) {
            strm.msg = 'invalid distances set';
            state.mode = BAD;
            break;
          }
          //Tracev((stderr, 'inflate:       codes ok\n'));
          state.mode = LEN_;
          if (flush === Z_TREES) { break inf_leave; }
          /* falls through */
        case LEN_:
          state.mode = LEN;
          /* falls through */
        case LEN:
          if (have >= 6 && left >= 258) {
            //--- RESTORE() ---
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            //---
            inflate_fast(strm, _out);
            //--- LOAD() ---
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            //---
    
            if (state.mode === TYPE) {
              state.back = -1;
            }
            break;
          }
          state.back = 0;
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) -1)];  /*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;
    
            if (here_bits <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_op && (here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.lencode[last_val +
                      ((hold & ((1 << (last_bits + last_op)) -1))/*BITS(last.bits + last.op)*/ >> last_bits)];
              here_bits = here >>> 24;
              here_op = (here >>> 16) & 0xff;
              here_val = here & 0xffff;
    
              if ((last_bits + here_bits) <= bits) { break; }
              //--- PULLBYTE() ---//
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            //--- DROPBITS(last.bits) ---//
            hold >>>= last_bits;
            bits -= last_bits;
            //---//
            state.back += last_bits;
          }
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.back += here_bits;
          state.length = here_val;
          if (here_op === 0) {
            //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
            //        "inflate:         literal '%c'\n" :
            //        "inflate:         literal 0x%02x\n", here.val));
            state.mode = LIT;
            break;
          }
          if (here_op & 32) {
            //Tracevv((stderr, "inflate:         end of block\n"));
            state.back = -1;
            state.mode = TYPE;
            break;
          }
          if (here_op & 64) {
            strm.msg = 'invalid literal/length code';
            state.mode = BAD;
            break;
          }
          state.extra = here_op & 15;
          state.mode = LENEXT;
          /* falls through */
        case LENEXT:
          if (state.extra) {
            //=== NEEDBITS(state.extra);
            n = state.extra;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.length += hold & ((1 << state.extra) -1)/*BITS(state.extra)*/;
            //--- DROPBITS(state.extra) ---//
            hold >>>= state.extra;
            bits -= state.extra;
            //---//
            state.back += state.extra;
          }
          //Tracevv((stderr, "inflate:         length %u\n", state.length));
          state.was = state.length;
          state.mode = DIST;
          /* falls through */
        case DIST:
          for (;;) {
            here = state.distcode[hold & ((1 << state.distbits) -1)];/*BITS(state.distbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;
    
            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if ((here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.distcode[last_val +
                      ((hold & ((1 << (last_bits + last_op)) -1))/*BITS(last.bits + last.op)*/ >> last_bits)];
              here_bits = here >>> 24;
              here_op = (here >>> 16) & 0xff;
              here_val = here & 0xffff;
    
              if ((last_bits + here_bits) <= bits) { break; }
              //--- PULLBYTE() ---//
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            //--- DROPBITS(last.bits) ---//
            hold >>>= last_bits;
            bits -= last_bits;
            //---//
            state.back += last_bits;
          }
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.back += here_bits;
          if (here_op & 64) {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break;
          }
          state.offset = here_val;
          state.extra = (here_op) & 15;
          state.mode = DISTEXT;
          /* falls through */
        case DISTEXT:
          if (state.extra) {
            //=== NEEDBITS(state.extra);
            n = state.extra;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.offset += hold & ((1 << state.extra) -1)/*BITS(state.extra)*/;
            //--- DROPBITS(state.extra) ---//
            hold >>>= state.extra;
            bits -= state.extra;
            //---//
            state.back += state.extra;
          }
    //#ifdef INFLATE_STRICT
          if (state.offset > state.dmax) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD;
            break;
          }
    //#endif
          //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
          state.mode = MATCH;
          /* falls through */
        case MATCH:
          if (left === 0) { break inf_leave; }
          copy = _out - left;
          if (state.offset > copy) {         /* copy from window */
            copy = state.offset - copy;
            if (copy > state.whave) {
              if (state.sane) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD;
                break;
              }
    // (!) This block is disabled in zlib defailts,
    // don't enable it for binary compatibility
    //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
    //          Trace((stderr, "inflate.c too far\n"));
    //          copy -= state.whave;
    //          if (copy > state.length) { copy = state.length; }
    //          if (copy > left) { copy = left; }
    //          left -= copy;
    //          state.length -= copy;
    //          do {
    //            output[put++] = 0;
    //          } while (--copy);
    //          if (state.length === 0) { state.mode = LEN; }
    //          break;
    //#endif
            }
            if (copy > state.wnext) {
              copy -= state.wnext;
              from = state.wsize - copy;
            }
            else {
              from = state.wnext - copy;
            }
            if (copy > state.length) { copy = state.length; }
            from_source = state.window;
          }
          else {                              /* copy from output */
            from_source = output;
            from = put - state.offset;
            copy = state.length;
          }
          if (copy > left) { copy = left; }
          left -= copy;
          state.length -= copy;
          do {
            output[put++] = from_source[from++];
          } while (--copy);
          if (state.length === 0) { state.mode = LEN; }
          break;
        case LIT:
          if (left === 0) { break inf_leave; }
          output[put++] = state.length;
          left--;
          state.mode = LEN;
          break;
        case CHECK:
          if (state.wrap) {
            //=== NEEDBITS(32);
            while (bits < 32) {
              if (have === 0) { break inf_leave; }
              have--;
              // Use '|' insdead of '+' to make sure that result is signed
              hold |= input[next++] << bits;
              bits += 8;
            }
            //===//
            _out -= left;
            strm.total_out += _out;
            state.total += _out;
            if (_out) {
              strm.adler = state.check =
                  /*UPDATE(state.check, put - _out, _out);*/
                  (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));
    
            }
            _out = left;
            // NB: crc32 stored as signed 32-bit int, ZSWAP32 returns signed too
            if ((state.flags ? hold : ZSWAP32(hold)) !== state.check) {
              strm.msg = 'incorrect data check';
              state.mode = BAD;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            //Tracev((stderr, "inflate:   check matches trailer\n"));
          }
          state.mode = LENGTH;
          /* falls through */
        case LENGTH:
          if (state.wrap && state.flags) {
            //=== NEEDBITS(32);
            while (bits < 32) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            if (hold !== (state.total & 0xffffffff)) {
              strm.msg = 'incorrect length check';
              state.mode = BAD;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            //Tracev((stderr, "inflate:   length matches trailer\n"));
          }
          state.mode = DONE;
          /* falls through */
        case DONE:
          ret = Z_STREAM_END;
          break inf_leave;
        case BAD:
          ret = Z_DATA_ERROR;
          break inf_leave;
        case MEM:
          return Z_MEM_ERROR;
        case SYNC:
          /* falls through */
        default:
          return Z_STREAM_ERROR;
        }
      }
    
      // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"
    
      /*
         Return from inflate(), updating the total counts and the check value.
         If there was no progress during the inflate() call, return a buffer
         error.  Call updatewindow() to create and/or update the window state.
         Note: a memory error from inflate() is non-recoverable.
       */
    
      //--- RESTORE() ---
      strm.next_out = put;
      strm.avail_out = left;
      strm.next_in = next;
      strm.avail_in = have;
      state.hold = hold;
      state.bits = bits;
      //---
    
      if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                          (state.mode < CHECK || flush !== Z_FINISH))) {
        if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
          state.mode = MEM;
          return Z_MEM_ERROR;
        }
      }
      _in -= strm.avail_in;
      _out -= strm.avail_out;
      strm.total_in += _in;
      strm.total_out += _out;
      state.total += _out;
      if (state.wrap && _out) {
        strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
          (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
      }
      strm.data_type = state.bits + (state.last ? 64 : 0) +
                        (state.mode === TYPE ? 128 : 0) +
                        (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
      if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
        ret = Z_BUF_ERROR;
      }
      return ret;
    }
    
    function inflateEnd(strm) {
    
      if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
        return Z_STREAM_ERROR;
      }
    
      var state = strm.state;
      if (state.window) {
        state.window = null;
      }
      strm.state = null;
      return Z_OK;
    }
    
    function inflateGetHeader(strm, head) {
      var state;
    
      /* check state */
      if (!strm || !strm.state) { return Z_STREAM_ERROR; }
      state = strm.state;
      if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }
    
      /* save header structure */
      state.head = head;
      head.done = false;
      return Z_OK;
    }
    
    
    exports.inflateReset = inflateReset;
    exports.inflateReset2 = inflateReset2;
    exports.inflateResetKeep = inflateResetKeep;
    exports.inflateInit = inflateInit;
    exports.inflateInit2 = inflateInit2;
    exports.inflate = inflate;
    exports.inflateEnd = inflateEnd;
    exports.inflateGetHeader = inflateGetHeader;
    exports.inflateInfo = 'pako inflate (from Nodeca project)';
    
    /* Not implemented
    exports.inflateCopy = inflateCopy;
    exports.inflateGetDictionary = inflateGetDictionary;
    exports.inflateMark = inflateMark;
    exports.inflatePrime = inflatePrime;
    exports.inflateSetDictionary = inflateSetDictionary;
    exports.inflateSync = inflateSync;
    exports.inflateSyncPoint = inflateSyncPoint;
    exports.inflateUndermine = inflateUndermine;
    */
    
    },{"../utils/common":12,"./adler32":14,"./crc32":16,"./inffast":18,"./inftrees":20}],20:[function(require,module,exports){
    'use strict';
    
    
    var utils = require('../utils/common');
    
    var MAXBITS = 15;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    //var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);
    
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    
    var lbase = [ /* Length codes 257..285 base */
      3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
      35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
    ];
    
    var lext = [ /* Length codes 257..285 extra */
      16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
      19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
    ];
    
    var dbase = [ /* Distance codes 0..29 base */
      1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
      257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
      8193, 12289, 16385, 24577, 0, 0
    ];
    
    var dext = [ /* Distance codes 0..29 extra */
      16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
      23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
      28, 28, 29, 29, 64, 64
    ];
    
    module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
    {
      var bits = opts.bits;
          //here = opts.here; /* table entry for duplication */
    
      var len = 0;               /* a code's length in bits */
      var sym = 0;               /* index of code symbols */
      var min = 0, max = 0;          /* minimum and maximum code lengths */
      var root = 0;              /* number of index bits for root table */
      var curr = 0;              /* number of index bits for current table */
      var drop = 0;              /* code bits to drop for sub-table */
      var left = 0;                   /* number of prefix codes available */
      var used = 0;              /* code entries in table used */
      var huff = 0;              /* Huffman code */
      var incr;              /* for incrementing code, index */
      var fill;              /* index for replicating entries */
      var low;               /* low bits for current root entry */
      var mask;              /* mask for low root bits */
      var next;             /* next available space in table */
      var base = null;     /* base value table to use */
      var base_index = 0;
    //  var shoextra;    /* extra bits table to use */
      var end;                    /* use base and extra for symbol > end */
      var count = new utils.Buf16(MAXBITS+1); //[MAXBITS+1];    /* number of codes of each length */
      var offs = new utils.Buf16(MAXBITS+1); //[MAXBITS+1];     /* offsets in table for each length */
      var extra = null;
      var extra_index = 0;
    
      var here_bits, here_op, here_val;
    
      /*
       Process a set of code lengths to create a canonical Huffman code.  The
       code lengths are lens[0..codes-1].  Each length corresponds to the
       symbols 0..codes-1.  The Huffman code is generated by first sorting the
       symbols by length from short to long, and retaining the symbol order
       for codes with equal lengths.  Then the code starts with all zero bits
       for the first code of the shortest length, and the codes are integer
       increments for the same length, and zeros are appended as the length
       increases.  For the deflate format, these bits are stored backwards
       from their more natural integer increment ordering, and so when the
       decoding tables are built in the large loop below, the integer codes
       are incremented backwards.
    
       This routine assumes, but does not check, that all of the entries in
       lens[] are in the range 0..MAXBITS.  The caller must assure this.
       1..MAXBITS is interpreted as that code length.  zero means that that
       symbol does not occur in this code.
    
       The codes are sorted by computing a count of codes for each length,
       creating from that a table of starting indices for each length in the
       sorted table, and then entering the symbols in order in the sorted
       table.  The sorted table is work[], with that space being provided by
       the caller.
    
       The length counts are used for other purposes as well, i.e. finding
       the minimum and maximum length codes, determining if there are any
       codes at all, checking for a valid set of lengths, and looking ahead
       at length counts to determine sub-table sizes when building the
       decoding tables.
       */
    
      /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
      for (len = 0; len <= MAXBITS; len++) {
        count[len] = 0;
      }
      for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++;
      }
    
      /* bound code lengths, force root to be within code lengths */
      root = bits;
      for (max = MAXBITS; max >= 1; max--) {
        if (count[max] !== 0) { break; }
      }
      if (root > max) {
        root = max;
      }
      if (max === 0) {                     /* no symbols to code at all */
        //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
        //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
        //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
        table[table_index++] = (1 << 24) | (64 << 16) | 0;
    
    
        //table.op[opts.table_index] = 64;
        //table.bits[opts.table_index] = 1;
        //table.val[opts.table_index++] = 0;
        table[table_index++] = (1 << 24) | (64 << 16) | 0;
    
        opts.bits = 1;
        return 0;     /* no symbols, but wait for decoding to report error */
      }
      for (min = 1; min < max; min++) {
        if (count[min] !== 0) { break; }
      }
      if (root < min) {
        root = min;
      }
    
      /* check for an over-subscribed or incomplete set of lengths */
      left = 1;
      for (len = 1; len <= MAXBITS; len++) {
        left <<= 1;
        left -= count[len];
        if (left < 0) {
          return -1;
        }        /* over-subscribed */
      }
      if (left > 0 && (type === CODES || max !== 1)) {
        return -1;                      /* incomplete set */
      }
    
      /* generate offsets into symbol table for each length for sorting */
      offs[1] = 0;
      for (len = 1; len < MAXBITS; len++) {
        offs[len + 1] = offs[len] + count[len];
      }
    
      /* sort symbols by length, by symbol order within each length */
      for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
          work[offs[lens[lens_index + sym]]++] = sym;
        }
      }
    
      /*
       Create and fill in decoding tables.  In this loop, the table being
       filled is at next and has curr index bits.  The code being used is huff
       with length len.  That code is converted to an index by dropping drop
       bits off of the bottom.  For codes where len is less than drop + curr,
       those top drop + curr - len bits are incremented through all values to
       fill the table with replicated entries.
    
       root is the number of index bits for the root table.  When len exceeds
       root, sub-tables are created pointed to by the root entry with an index
       of the low root bits of huff.  This is saved in low to check for when a
       new sub-table should be started.  drop is zero when the root table is
       being filled, and drop is root when sub-tables are being filled.
    
       When a new sub-table is needed, it is necessary to look ahead in the
       code lengths to determine what size sub-table is needed.  The length
       counts are used for this, and so count[] is decremented as codes are
       entered in the tables.
    
       used keeps track of how many table entries have been allocated from the
       provided *table space.  It is checked for LENS and DIST tables against
       the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
       the initial root table size constants.  See the comments in inftrees.h
       for more information.
    
       sym increments through all symbols, and the loop terminates when
       all codes of length max, i.e. all codes, have been processed.  This
       routine permits incomplete codes, so another loop after this one fills
       in the rest of the decoding tables with invalid code markers.
       */
    
      /* set up for code type */
      // poor man optimization - use if-else instead of switch,
      // to avoid deopts in old v8
      if (type === CODES) {
        base = extra = work;    /* dummy value--not used */
        end = 19;
    
      } else if (type === LENS) {
        base = lbase;
        base_index -= 257;
        extra = lext;
        extra_index -= 257;
        end = 256;
    
      } else {                    /* DISTS */
        base = dbase;
        extra = dext;
        end = -1;
      }
    
      /* initialize opts for loop */
      huff = 0;                   /* starting code */
      sym = 0;                    /* starting code symbol */
      len = min;                  /* starting code length */
      next = table_index;              /* current table to fill in */
      curr = root;                /* current table index bits */
      drop = 0;                   /* current bits to drop from code for index */
      low = -1;                   /* trigger new sub-table when len > root */
      used = 1 << root;          /* use root table entries */
      mask = used - 1;            /* mask for comparing low */
    
      /* check available table space */
      if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
        return 1;
      }
    
      var i=0;
      /* process all codes and make table entries */
      for (;;) {
        i++;
        /* create table entry */
        here_bits = len - drop;
        if (work[sym] < end) {
          here_op = 0;
          here_val = work[sym];
        }
        else if (work[sym] > end) {
          here_op = extra[extra_index + work[sym]];
          here_val = base[base_index + work[sym]];
        }
        else {
          here_op = 32 + 64;         /* end of block */
          here_val = 0;
        }
    
        /* replicate for those indices with low len bits equal to huff */
        incr = 1 << (len - drop);
        fill = 1 << curr;
        min = fill;                 /* save offset to next table */
        do {
          fill -= incr;
          table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
        } while (fill !== 0);
    
        /* backwards increment the len-bit code huff */
        incr = 1 << (len - 1);
        while (huff & incr) {
          incr >>= 1;
        }
        if (incr !== 0) {
          huff &= incr - 1;
          huff += incr;
        } else {
          huff = 0;
        }
    
        /* go to next symbol, update count, len */
        sym++;
        if (--count[len] === 0) {
          if (len === max) { break; }
          len = lens[lens_index + work[sym]];
        }
    
        /* create new sub-table if needed */
        if (len > root && (huff & mask) !== low) {
          /* if first time, transition to sub-tables */
          if (drop === 0) {
            drop = root;
          }
    
          /* increment past last table */
          next += min;            /* here min is 1 << curr */
    
          /* determine length of next table */
          curr = len - drop;
          left = 1 << curr;
          while (curr + drop < max) {
            left -= count[curr + drop];
            if (left <= 0) { break; }
            curr++;
            left <<= 1;
          }
    
          /* check for enough space */
          used += 1 << curr;
          if ((type === LENS && used > ENOUGH_LENS) ||
            (type === DISTS && used > ENOUGH_DISTS)) {
            return 1;
          }
    
          /* point entry in root table to sub-table */
          low = huff & mask;
          /*table.op[low] = curr;
          table.bits[low] = root;
          table.val[low] = next - opts.table_index;*/
          table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
        }
      }
    
      /* fill in remaining table entry if code is incomplete (guaranteed to have
       at most one remaining entry, since if the code is incomplete, the
       maximum code length that was allowed to get this far is one bit) */
      if (huff !== 0) {
        //table.op[next + huff] = 64;            /* invalid code marker */
        //table.bits[next + huff] = len - drop;
        //table.val[next + huff] = 0;
        table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
      }
    
      /* set return parameters */
      //opts.table_index += used;
      opts.bits = root;
      return 0;
    };
    
    },{"../utils/common":12}],21:[function(require,module,exports){
    'use strict';
    
    module.exports = {
      '2':    'need dictionary',     /* Z_NEED_DICT       2  */
      '1':    'stream end',          /* Z_STREAM_END      1  */
      '0':    '',                    /* Z_OK              0  */
      '-1':   'file error',          /* Z_ERRNO         (-1) */
      '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
      '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
      '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
      '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
      '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
    };
    
    },{}],22:[function(require,module,exports){
    'use strict';
    
    
    function ZStream() {
      /* next input byte */
      this.input = null; // JS specific, because we have no pointers
      this.next_in = 0;
      /* number of bytes available at input */
      this.avail_in = 0;
      /* total number of input bytes read so far */
      this.total_in = 0;
      /* next output byte should be put there */
      this.output = null; // JS specific, because we have no pointers
      this.next_out = 0;
      /* remaining free space at output */
      this.avail_out = 0;
      /* total number of bytes output so far */
      this.total_out = 0;
      /* last error message, NULL if no error */
      this.msg = ''/*Z_NULL*/;
      /* not visible by applications */
      this.state = null;
      /* best guess about the data type: binary or text */
      this.data_type = 2/*Z_UNKNOWN*/;
      /* adler32 value of the uncompressed data */
      this.adler = 0;
    }
    
    module.exports = ZStream;
    
    },{}],23:[function(require,module,exports){
    (function (process){
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    // resolves . and .. elements in a path array with directory names there
    // must be no slashes, empty elements, or device names (c:\) in the array
    // (so also no leading and trailing slashes - it does not distinguish
    // relative and absolute paths)
    function normalizeArray(parts, allowAboveRoot) {
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }
    
      // if the path is allowed to go above the root, restore leading ..s
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }
    
      return parts;
    }
    
    // Split a filename into [root, dir, basename, ext], unix version
    // 'root' is just a slash, or nothing.
    var splitPathRe =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var splitPath = function(filename) {
      return splitPathRe.exec(filename).slice(1);
    };
    
    // path.resolve([from ...], to)
    // posix version
    exports.resolve = function() {
      var resolvedPath = '',
          resolvedAbsolute = false;
    
      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = (i >= 0) ? arguments[i] : process.cwd();
    
        // Skip empty and invalid entries
        if (typeof path !== 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          continue;
        }
    
        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = path.charAt(0) === '/';
      }
    
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
    
      // Normalize the path
      resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
        return !!p;
      }), !resolvedAbsolute).join('/');
    
      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    };
    
    // path.normalize(path)
    // posix version
    exports.normalize = function(path) {
      var isAbsolute = exports.isAbsolute(path),
          trailingSlash = substr(path, -1) === '/';
    
      // Normalize the path
      path = normalizeArray(filter(path.split('/'), function(p) {
        return !!p;
      }), !isAbsolute).join('/');
    
      if (!path && !isAbsolute) {
        path = '.';
      }
      if (path && trailingSlash) {
        path += '/';
      }
    
      return (isAbsolute ? '/' : '') + path;
    };
    
    // posix version
    exports.isAbsolute = function(path) {
      return path.charAt(0) === '/';
    };
    
    // posix version
    exports.join = function() {
      var paths = Array.prototype.slice.call(arguments, 0);
      return exports.normalize(filter(paths, function(p, index) {
        if (typeof p !== 'string') {
          throw new TypeError('Arguments to path.join must be strings');
        }
        return p;
      }).join('/'));
    };
    
    
    // path.relative(from, to)
    // posix version
    exports.relative = function(from, to) {
      from = exports.resolve(from).substr(1);
      to = exports.resolve(to).substr(1);
    
      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '') break;
        }
    
        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '') break;
        }
    
        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }
    
      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));
    
      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }
    
      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
      }
    
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
    
      return outputParts.join('/');
    };
    
    exports.sep = '/';
    exports.delimiter = ':';
    
    exports.dirname = function(path) {
      var result = splitPath(path),
          root = result[0],
          dir = result[1];
    
      if (!root && !dir) {
        // No dirname whatsoever
        return '.';
      }
    
      if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.substr(0, dir.length - 1);
      }
    
      return root + dir;
    };
    
    
    exports.basename = function(path, ext) {
      var f = splitPath(path)[2];
      // TODO: make this comparison case-insensitive on windows?
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    };
    
    
    exports.extname = function(path) {
      return splitPath(path)[3];
    };
    
    function filter (xs, f) {
        if (xs.filter) return xs.filter(f);
        var res = [];
        for (var i = 0; i < xs.length; i++) {
            if (f(xs[i], i, xs)) res.push(xs[i]);
        }
        return res;
    }
    
    // String.prototype.substr - negative index don't work in IE8
    var substr = 'ab'.substr(-1) === 'b'
        ? function (str, start, len) { return str.substr(start, len) }
        : function (str, start, len) {
            if (start < 0) start = str.length + start;
            return str.substr(start, len);
        }
    ;
    
    }).call(this,require('_process'))
    },{"_process":24}],24:[function(require,module,exports){
    // shim for using process in browser
    
    var process = module.exports = {};
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    
    function cleanUpNextTick() {
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
    
    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = setTimeout(cleanUpNextTick);
        draining = true;
    
        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        clearTimeout(timeout);
    }
    
    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            setTimeout(drainQueue, 0);
        }
    };
    
    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};
    
    function noop() {}
    
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    
    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };
    
    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };
    
    },{}]},{},[1]);
    