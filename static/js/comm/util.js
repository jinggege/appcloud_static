define(function(require, exports, module){
	var $ = require('JQ');
	//继承
	exports.inherit = function(ctor,ctor2) {
         function f() {};
         f.prototype = ctor2.prototype;
         ctor.prototype = new f;
	}
    var merge = function merge (target, additional, deep, lastseen) {
        var seen = lastseen || [],
            depth = typeof deep == 'undefined' ? 2 : deep,
            prop;
        for (prop in additional) {
            if (additional.hasOwnProperty(prop) && exports.indexOf(seen, prop) < 0) {
                if (typeof target[prop] !== 'object' || !depth) {
                    target[prop] = additional[prop];
                    seen.push(additional[prop]);
                } 
                else {
                    merge(target[prop], additional[prop], depth - 1, seen);
                }   
            }
        }
        return target;
    };
    exports.mixin = function (ctor, ctor2) {
        merge(ctor.prototype, ctor2.prototype);
    };
	//设置cookie
	exports.setCookie = function(name, value, expires, path, domain) {
		var str = name + "=" + escape(value);
		if (expires != null || expires != '') {
			if (expires == 0) {expires = 100*365*24*60;}
			var exp = new Date();
			exp.setTime(exp.getTime() + expires*60*1000);
			str += "; expires=" + exp.toGMTString();
		}
        if (path) {str += "; path=" + path;}
		if (domain) {str += "; domain=" + domain;}
		document.cookie = str;
	}
	//获取cookie
	exports.getCookie = function(name) {
        var tmp, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)","gi");
		if((tmp = reg.exec(unescape(document.cookie)))){
			return tmp[2];
		}else{
			return null;	
		}
	}
	//删除cookie
	exports.delCookie = function(name,path,domain) {
        document.cookie = name + "=" +
			((path) ? "; path=" + path : "") +
			((domain) ? "; domain=" + domain : "") +
			"; expires=Thu, 01-Jan-70 00:00:01 GMT";	
	}
	//异步加载
	exports.loading = function(type,url,callback,id) {
	    if(type!=='img' && type!=='script'&&type!=='css') return;
		var road = null;
		if(type === 'img') {
		   road = new Image();
		   road.src = url;
		}
		else {
			if(type==='script') {
		       road = document.createElement('script');
			   road.type = 'text/javascript';
			   road.src = url;
			   if(typeof id !='undefined') road.id = id;
	        }
		    else {
		       road = document.createElement('link');
			   road.type = 'text/css';
			   road.rel = 'stylesheet';
			   road.href = url;
		    }
			document.getElementsByTagName('head')[0].appendChild(road);
		}
		if(road.readyState) {
		        road.onreadystatechange = function() {
				          if(road.readyState == 'loaded' || road.readyState == 'complete') {
						       road.onreadystatechange = null;
							   if(callback && Object.prototype.toString.call(callback)==='[object Function]') callback(road);
						  }
				}
		}
		else {
		        road.onload = function() {
				      callback(road);
				}
		}
    }
    

	//AJAX包装
    $.each(['get', 'post'], function(){
        var type = this;
        exports[type] = function(url, data, success, complete, error, dataType){
            success = success || function(){};
            return $.ajax({
                url : url,
                data : data,
                dataType : dataType || 'json',
                //contentType: "application/json",
                cache : false,
                timeout : 120000,
                xhrFields: {
                    withCredentials: true
                },
                complete : function(){
                    complete && complete.call(this);
                },
                type : type.toUpperCase(),
                error : function(){
                    error && error.call(this, {
                        code : 99
                    });
                },
                success : function(data){
                    if(data.response){
                        data = data.response;
                        if(data.code != undefined && data.code == 0){
                            success.call(this, data);
                        }else{
                            error && error.call(this, data);
                        }
                    }else{
                        error && error.call(this, {
                            code : 99
                        });
                    }
                }
            });
        }
    });

	//把普通数组转化为JQ对象包装集 [dom, dom, dom] => jQueryObject[dom, dom, dom]
	//把JQ数组转化为JQ对象包装集 [jQueryObject[dom], jQueryObject[dom], jQueryObject[dom] => jQueryObject[dom, dom, dom]
	exports.arrayToJq = function(arr){
		var collection = $([]);
		
		$.each(arr, function(){
			collection = collection.add(this);
		});
		
		return collection;
	}
	//返回字符长度
	exports.strLen = function(str) {
		return str.replace(/[^\x00-\xFF]/g,'**').length;
	}
	//POST,GET数据拼串提交字符过滤%,+,&
	exports.subDataStr = function(str) {
		return str.replace(/\%/g,'%25').replace(/\+/g,'%2B').replace(/\&/g,'%26');
	}
	//数组下标
	exports.indexOf = function(arr,value,mark) {
		for(var i = 0, len = arr.length; i < len; i++) {
			var name = arr[i];
			if(typeof mark!='undefined') {
				name = name[mark];
			}
			if(name == value) return i;
		}
		return -1;
	}
    //html转码
    exports.formatHTML = function(html) {
     	 return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }  
    //截字
    //比较胖的字符算一位
    exports.cutFont = function(_str, n) {
         var str = $.trim(_str);
     	 var len = str.replace(/[^\x00-\xFF]|@/g,'**').length;
     	 if(n*2<len) return str.substr(0,n)+'...';
     	 return str;
    }
     //比较胖的字符算两位
     exports.cutZhFont = function(_str, n) {
        var str = $.trim(_str);
     	var len = str.replace(/[^\x00-\xFF]|[\x00-\x2F]|[\x3A-\x40]|~/g,'**').length;
     	var _temp = str.split(""),
     		_n = n,
     		_pos = -1;

     	$.each(_temp, function(e){
     		if(/^[^\x00-\xFF]|[\x00-\x2F]|[\x3A-\x40]|~$/.test(this)){
     			//中文字符占2位
     			_n = _n - 2;
     		}else{
     			_n =_n - 1;
     		}

     		if(_n === 0){
     			//正好截取完成 返回截取长度
     			_pos = e + 1;
     			return false;
     		}else if(_n < 0){
     			//超过截取长度，少截一位
     			_pos = e;
     			return false;
     		}
     	});

     	if(n < len){
     	 	return str.substr(0, _pos)+'...';
     	}
     	return str;
     }
     //输入框消除默认底字
     exports.placeholder = function(input,classes) {
     	 var input = $(input);
     	 var classes = (typeof classes!='undefined')?classes:'';
     	 if (!('placeholder' in document.createElement('input'))){
     	 	  var tips = input.attr('placeholder');
     	 	  input.val(tips);
     	 	  input.addClass(classes);
     	 	  input.bind('focus',function(){
     	 	  	     if($.trim(this.value)===tips) {
     	 	  	     	 this.value = '';
     	 	  	     	 input.removeClass(classes);
     	 	  	     }
     	 	  }).bind('blur',function(){
     	 	  	     if($.trim(this.value)==='') {
     	 	  	     	 $(this).addClass(classes);
     	 	  	     	 this.value = tips;
     	 	  	     }
     	 	  });
     	 }
     }
     //分辨率
     exports.adjustPos = function(container) {
        var  _h = $(window).height();
        if(_h>740) container.css({bottom:_h-740});
        else {
            container.css({bottom:0});
        }
     }
    /**
     * 添加单位
     * @param num
     * @param maxLen 新增可选参数，达到最大长度才开始进行添加单位
     * @returns {string}
     */
     exports.toUnits = function(num, maxLen) {
     	 var str = num+'';
     	 var len = str.length;
         if(maxLen && len <= maxLen){
             return str;
         }
     	 if(len>=9) return str.substr(0,len-8)+'亿';
     	 if(len>=5) return str.substr(0,len-4)+'万';
     	 return str;
     };
     //四舍五入
     exports.roundOff = function(num) {
        if(num<10000) {
            return num;
        }
        if(num>=100000000) {
            var _n = ((num/100000000)+'').split('.');
            var _end = '00';
            if(_n[1]) _end = _n[1].substr(0,2);
            return _n[0]+'.'+_end+'亿';            
        }
        else {
            var _n = ((num/10000)+'').split('.');
            var _end = '00';
            if(_n[1]) _end = _n[1].substr(0,2);
            if(_end.length==1) {
                _end+='0';
            }       
            return _n[0]+'.'+_end+'万';
        }
     }
     //flash判断
     exports.checkFlash = function() {
     	     var hasFlash=0;
             var flashVersion=0;
             if(document.all) {
                try{
                    var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if(swf) {
                        hasFlash = 1;
                        var VSwf=swf.GetVariable("$version");
                        flashVersion=parseInt(VSwf.split(" ")[1].split(",")[0]);
                    }
                }
                catch(e) {}
             }
             else{
                 if (navigator.plugins && navigator.plugins.length > 0) {
                     var swf=navigator.plugins["Shockwave Flash"];
                     if (swf) {
                         hasFlash=1;
                         var words = swf.description.split(" ");
                         for (var i = 0; i < words.length; ++i) {
                             if (isNaN(parseInt(words[i]))) continue;
                                 flashVersion = parseInt(words[i]);
                         }
                     }
                 }
             }
             return {f:hasFlash,v:flashVersion};
             //安装flash插件：http://www.adobe.com/software/flash/about/
     };
     //TODO 后期改下两个URL操作，get加一个不传参数取全部，set加个去重
	 //获取路径参数值
	 exports.getUrlParams = function() {
         var arr = arguments;
	     var value = {};
	     var url = location.search;
	     if(url.indexOf('?')!=-1) {
	         var str = url.substr(1);
	         if(str.indexOf('&')!=-1) {
	             var v = str.split('&');
	             for(var i=0;i<arr.length;i++) {
		                 for(var j=0;j<v.length;j++) {
			                 if(arr[i]==v[j].split('=')[0]) value[arr[i]] = v[j].split('=')[1];
			             }          
		         }
	         }
	         else{
                 value[str.split('=')[0]] = str.split('=')[1];
             }
	     }
	     return value;	
	 };
	 //路径追加参数
	 exports.setUrlParams = function(url,args) {
		 if(typeof args == 'undefined') return url;
	     var u = (url.indexOf('?') != -1) ? (url + '&') : (url + '?');
		 var arr = [];
		 for(var name in args) {
		     arr.push(name+'='+args[name]);
		 }
		 u+=arr.join('&');
		 return u;
	 };
    //浏览器识别
	var Browser = {
		IE : window.ActiveXObject?true:false,
		FF:(navigator.userAgent.indexOf('Firefox') >= 0)?true:false,
		Chrome:(navigator.userAgent.indexOf('Chrome')>=0)?true:false,
		Ipad:(navigator.userAgent.indexOf('iPhone')>-1 || navigator.userAgent.indexOf('iPad')>-1)?true:false,
		version:function(v) {
			var nav = navigator.userAgent.toLowerCase();
			if(!v) return;
			switch(v) {
				case 'IE':return nav.match(/msie ([\d.]+)/)[1];break;
				case 'FF': return nav.match(/firefox\/([\d.]+)/)[1];break;
				case 'Chrome': return nav.match(/chrome\/([\d.]+)/)[1];break;
				case 'Opera': return nav.match(/opera\/([\d.]+)/)[1];break;
				case 'Safari': return nav.match(/version\/([\d.]+)/)[1];break;
			}
		}
	};

	Browser.IE6 = (function() { return !!(Browser.IE && parseInt(Browser.version('IE'))<7)})();
	Browser.lte7 = (function() { return !!(Browser.IE && parseInt(Browser.version('IE'))<8)})();
	Browser.lte8 = (function() {return !!(Browser.IE && parseInt(Browser.version('IE'))<9)})();

	exports.browser = Browser;

	//常用正则
	/*
	*URL正则
	*"^((https|http|ftp|rtsp|mms)?://)"      
	*"?(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?" //ftp的user@     
	*"(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184     
	*"|" // 允许IP和DOMAIN（域名)
	*"([0-9a-zA-Z_!~*'()-]+\.)*" // 域名- www.     
	*"([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\." // 二级域名     
	*"[a-zA-Z]{2,6})" // first level domain- .com or .museum     
	*"(:[0-9]{1,4})?"; // 端口- :80 
	*/

	var urlRegex = /^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+\.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\.[a-zA-Z]{2,6})(:[0-9]{1,4})?/;
	

	exports.REGS = {
		url : urlRegex,
		time :/^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
		numeric : /^\d*$/,
		nickname:/^([^\/&<>%='"\\])+$/,
        mobile : /^((\+86)|(86))?\d{11}$/
	}



    exports.getIpadHeight = function() {
        if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
            return window.innerHeight;
        }
        return $(window).height();
    }


    exports.formatDate = function(date, format) {
        /*
         * eg:format="YYYY-MM-dd hh:mm:ss";
         */
        var o = {
            "M+" : date.getMonth() + 1,  // month
            "d+" : date.getDate(),       // day
            "h+" : date.getHours(),      // hour
            "m+" : date.getMinutes(),    // minute
            "s+" : date.getSeconds(),    // second
            "q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
            "S"  : date.getMilliseconds() // millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
        }

        for ( var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
    /*
     *第三方接口
     */
    var otherApi = {
        sina : {
            key : 3785927493,
            secret : '7dd68c280b947bdbaa0b1b46a53ead51'
        },
        qq : {
            key : 100525909,
            secret: 'cd1f9bb8ba1f157b2df5b51e3bdece01'
        }
    }
    exports.otherApi = otherApi;
    /**
     * 城市数据查询
     * 需要啥接口自己加
     */
    var CITY = {};
    (function(EX){
        var data = [{"cities":[{"id":"0","name":"市"}],"province":{"id":"0","name":"省"}},{"cities":[{"id":"1102","name":"北京"}],"province":{"id":"11","name":"北京"}},{"cities":[{"id":"3102","name":"上海"}],"province":{"id":"31","name":"上海"}},{"cities":[{"id":"1202","name":"天津"}],"province":{"id":"12","name":"天津"}},{"cities":[{"id":"5002","name":"重庆"}],"province":{"id":"50","name":"重庆"}},{"cities":[{"id":"2301","name":"哈尔滨市"},{"id":"2302","name":"齐齐哈尔市"},{"id":"2303","name":"鸡西市"},{"id":"2304","name":"鹤岗市"},{"id":"2305","name":"双鸭山市"},{"id":"2306","name":"大庆市"},{"id":"2307","name":"伊春市"},{"id":"2308","name":"佳木斯市"},{"id":"2309","name":"七台河市"},{"id":"2310","name":"牡丹江市"},{"id":"2311","name":"黑河市"},{"id":"2312","name":"绥化市"},{"id":"2327","name":"大兴安岭地区"}],"province":{"id":"23","name":"黑龙江"}},{"cities":[{"id":"2201","name":"长春市"},{"id":"2202","name":"吉林市"},{"id":"2203","name":"四平市"},{"id":"2204","name":"辽源市"},{"id":"2205","name":"通化市"},{"id":"2206","name":"白山市"},{"id":"2207","name":"松原市"},{"id":"2208","name":"白城市"},{"id":"2224","name":"延边朝鲜族自治州"}],"province":{"id":"22","name":"吉林"}},{"cities":[{"id":"2101","name":"沈阳市"},{"id":"2102","name":"大连市"},{"id":"2103","name":"鞍山市"},{"id":"2104","name":"抚顺市"},{"id":"2105","name":"本溪市"},{"id":"2106","name":"丹东市"},{"id":"2107","name":"锦州市"},{"id":"2108","name":"营口市"},{"id":"2109","name":"阜新市"},{"id":"2110","name":"辽阳市"},{"id":"2111","name":"盘锦市"},{"id":"2112","name":"铁岭市"},{"id":"2113","name":"朝阳市"},{"id":"2114","name":"葫芦岛市"}],"province":{"id":"21","name":"辽宁"}},{"cities":[{"id":"3701","name":"济南市"},{"id":"3702","name":"青岛市"},{"id":"3703","name":"淄博市"},{"id":"3704","name":"枣庄市"},{"id":"3705","name":"东营市"},{"id":"3706","name":"烟台市"},{"id":"3707","name":"潍坊市"},{"id":"3708","name":"济宁市"},{"id":"3709","name":"泰安市"},{"id":"3710","name":"威海市"},{"id":"3711","name":"日照市"},{"id":"3712","name":"莱芜市"},{"id":"3713","name":"临沂市"},{"id":"3714","name":"德州市"},{"id":"3715","name":"聊城市"},{"id":"3716","name":"滨州市"},{"id":"3717","name":"菏泽市"}],"province":{"id":"37","name":"山东"}},{"cities":[{"id":"1401","name":"太原市"},{"id":"1402","name":"大同市"},{"id":"1403","name":"阳泉市"},{"id":"1404","name":"长治市"},{"id":"1405","name":"晋城市"},{"id":"1406","name":"朔州市"},{"id":"1407","name":"晋中市"},{"id":"1408","name":"运城市"},{"id":"1409","name":"忻州市"},{"id":"1410","name":"临汾市"},{"id":"1411","name":"吕梁市"}],"province":{"id":"14","name":"山西"}},{"cities":[{"id":"6101","name":"西安市"},{"id":"6102","name":"铜川市"},{"id":"6103","name":"宝鸡市"},{"id":"6104","name":"咸阳市"},{"id":"6105","name":"渭南市"},{"id":"6106","name":"延安市"},{"id":"6107","name":"汉中市"},{"id":"6108","name":"榆林市"},{"id":"6109","name":"安康市"},{"id":"6110","name":"商洛市"}],"province":{"id":"61","name":"陕西"}},{"cities":[{"id":"1301","name":"石家庄市"},{"id":"1302","name":"唐山市"},{"id":"1303","name":"秦皇岛市"},{"id":"1304","name":"邯郸市"},{"id":"1305","name":"邢台市"},{"id":"1306","name":"保定市"},{"id":"1307","name":"张家口市"},{"id":"1308","name":"承德市"},{"id":"1309","name":"沧州市"},{"id":"1310","name":"廊坊市"},{"id":"1311","name":"衡水市"}],"province":{"id":"13","name":"河北"}},{"cities":[{"id":"4101","name":"郑州市"},{"id":"4102","name":"开封市"},{"id":"4103","name":"洛阳市"},{"id":"4104","name":"平顶山市"},{"id":"4105","name":"安阳市"},{"id":"4106","name":"鹤壁市"},{"id":"4107","name":"新乡市"},{"id":"4108","name":"焦作市"},{"id":"4109","name":"濮阳市"},{"id":"4110","name":"许昌市"},{"id":"4111","name":"漯河市"},{"id":"4112","name":"三门峡市"},{"id":"4113","name":"南阳市"},{"id":"4114","name":"商丘市"},{"id":"4115","name":"信阳市"},{"id":"4116","name":"周口市"},{"id":"4117","name":"驻马店市"},{"id":"4118","name":"济源市"}],"province":{"id":"41","name":"河南"}},{"cities":[{"id":"4201","name":"武汉市"},{"id":"4202","name":"黄石市"},{"id":"4203","name":"十堰市"},{"id":"4205","name":"宜昌市"},{"id":"4206","name":"襄樊市"},{"id":"4207","name":"鄂州市"},{"id":"4208","name":"荆门市"},{"id":"4209","name":"孝感市"},{"id":"4210","name":"荆州市"},{"id":"4211","name":"黄冈市"},{"id":"4212","name":"咸宁市"},{"id":"4213","name":"随州市"},{"id":"4228","name":"恩施土家族苗族自治州"},{"id":"429004","name":"仙桃市"},{"id":"429005","name":"潜江市"},{"id":"429006","name":"天门市"},{"id":"429021","name":"神农架林区"}],"province":{"id":"42","name":"湖北"}},{"cities":[{"id":"4301","name":"长沙市"},{"id":"4302","name":"株洲市"},{"id":"4303","name":"湘潭市"},{"id":"4304","name":"衡阳市"},{"id":"4305","name":"邵阳市"},{"id":"4306","name":"岳阳市"},{"id":"4307","name":"常德市"},{"id":"4308","name":"张家界市"},{"id":"4309","name":"益阳市"},{"id":"4310","name":"郴州市"},{"id":"4311","name":"永州市"},{"id":"4312","name":"怀化市"},{"id":"4313","name":"娄底市"},{"id":"4331","name":"湘西土家族苗族自治州"}],"province":{"id":"43","name":"湖南"}},{"cities":[{"id":"4601","name":"海口市"},{"id":"4602","name":"三亚市"},{"id":"469001","name":"五指山市"},{"id":"469002","name":"琼海市"},{"id":"469003","name":"儋州市"},{"id":"469005","name":"文昌市"},{"id":"469006","name":"万宁市"},{"id":"469007","name":"东方市"},{"id":"469025","name":"定安县"},{"id":"469026","name":"屯昌县"},{"id":"469027","name":"澄迈县"},{"id":"469028","name":"临高县"},{"id":"469030","name":"白沙黎族自治县"},{"id":"469031","name":"昌江黎族自治县"},{"id":"469033","name":"乐东黎族自治县"},{"id":"469034","name":"陵水黎族自治县"},{"id":"469035","name":"保亭黎族苗族自治县"},{"id":"469036","name":"琼中黎族苗族自治县"}],"province":{"id":"46","name":"海南"}},{"cities":[{"id":"3201","name":"南京市"},{"id":"3202","name":"无锡市"},{"id":"3203","name":"徐州市"},{"id":"3204","name":"常州市"},{"id":"3205","name":"苏州市"},{"id":"3206","name":"南通市"},{"id":"3207","name":"连云港市"},{"id":"3208","name":"淮安市"},{"id":"3209","name":"盐城市"},{"id":"3210","name":"扬州市"},{"id":"3211","name":"镇江市"},{"id":"3212","name":"泰州市"},{"id":"3213","name":"宿迁市"}],"province":{"id":"32","name":"江苏"}},{"cities":[{"id":"3601","name":"南昌市"},{"id":"3602","name":"景德镇市"},{"id":"3603","name":"萍乡市"},{"id":"3604","name":"九江市"},{"id":"3605","name":"新余市"},{"id":"3606","name":"鹰潭市"},{"id":"3607","name":"赣州市"},{"id":"3608","name":"吉安市"},{"id":"3609","name":"宜春市"},{"id":"3610","name":"抚州市"},{"id":"3611","name":"上饶市"}],"province":{"id":"36","name":"江西"}},{"cities":[{"id":"4401","name":"广州市"},{"id":"4402","name":"韶关市"},{"id":"4403","name":"深圳市"},{"id":"4404","name":"珠海市"},{"id":"4405","name":"汕头市"},{"id":"4406","name":"佛山市"},{"id":"4407","name":"江门市"},{"id":"4408","name":"湛江市"},{"id":"4409","name":"茂名市"},{"id":"4412","name":"肇庆市"},{"id":"4413","name":"惠州市"},{"id":"4414","name":"梅州市"},{"id":"4415","name":"汕尾市"},{"id":"4416","name":"河源市"},{"id":"4417","name":"阳江市"},{"id":"4418","name":"清远市"},{"id":"4419","name":"东莞市"},{"id":"4420","name":"中山市"},{"id":"4451","name":"潮州市"},{"id":"4452","name":"揭阳市"},{"id":"4453","name":"云浮市"}],"province":{"id":"44","name":"广东"}},{"cities":[{"id":"4501","name":"南宁市"},{"id":"4502","name":"柳州市"},{"id":"4503","name":"桂林市"},{"id":"4504","name":"梧州市"},{"id":"4505","name":"北海市"},{"id":"4506","name":"防城港市"},{"id":"4507","name":"钦州市"},{"id":"4508","name":"贵港市"},{"id":"4509","name":"玉林市"},{"id":"4510","name":"百色市"},{"id":"4511","name":"贺州市"},{"id":"4512","name":"河池市"},{"id":"4513","name":"来宾市"},{"id":"4514","name":"崇左市"}],"province":{"id":"45","name":"广西"}},{"cities":[{"id":"5301","name":"昆明市"},{"id":"5303","name":"曲靖市"},{"id":"5304","name":"玉溪市"},{"id":"5305","name":"保山市"},{"id":"5306","name":"昭通市"},{"id":"5307","name":"丽江市"},{"id":"5308","name":"普洱市"},{"id":"5309","name":"临沧市"},{"id":"5323","name":"楚雄彝族自治州"},{"id":"5325","name":"红河哈尼族彝族自治州"},{"id":"5326","name":"文山壮族苗族自治州"},{"id":"5328","name":"西双版纳傣族自治州"},{"id":"5329","name":"大理白族自治州"},{"id":"5331","name":"德宏傣族景颇族自治州"},{"id":"5333","name":"怒江傈僳族自治州"},{"id":"5334","name":"迪庆藏族自治州"}],"province":{"id":"53","name":"云南"}},{"cities":[{"id":"5201","name":"贵阳市"},{"id":"5202","name":"六盘水市"},{"id":"5203","name":"遵义市"},{"id":"5204","name":"安顺市"},{"id":"5222","name":"铜仁地区"},{"id":"5223","name":"黔西南布依族黔西苗族自治州"},{"id":"5224","name":"毕节地区"},{"id":"5226","name":"黔东南苗族同族自治州"},{"id":"5227","name":"黔南布依族苗族自治州"}],"province":{"id":"52","name":"贵州"}},{"cities":[{"id":"5101","name":"成都市"},{"id":"5103","name":"自贡市"},{"id":"5104","name":"攀枝花市"},{"id":"5105","name":"泸州市"},{"id":"5106","name":"德阳市"},{"id":"5107","name":"绵阳市"},{"id":"5108","name":"广元市"},{"id":"5109","name":"遂宁市"},{"id":"5110","name":"内江市"},{"id":"5111","name":"乐山市"},{"id":"5113","name":"南充市"},{"id":"5114","name":"眉山市"},{"id":"5115","name":"宜宾市"},{"id":"5116","name":"广安市"},{"id":"5117","name":"达州市"},{"id":"5118","name":"雅安市"},{"id":"5119","name":"巴中市"},{"id":"5120","name":"资阳市"},{"id":"5132","name":"阿坝藏族羌族自治州"},{"id":"5133","name":"甘孜藏族自治州"},{"id":"5134","name":"凉山彝族自治州"}],"province":{"id":"51","name":"四川"}},{"cities":[{"id":"1501","name":"呼和浩特市"},{"id":"1502","name":"包头市"},{"id":"1503","name":"乌海市"},{"id":"1504","name":"赤峰市"},{"id":"1505","name":"通辽市"},{"id":"1506","name":"鄂尔多斯市"},{"id":"1507","name":"呼伦贝尔市"},{"id":"1508","name":"巴彦卓尔市"},{"id":"1509","name":"乌兰察布市"},{"id":"1522","name":"兴安盟"},{"id":"1525","name":"锡林郭勒盟"},{"id":"1529","name":"阿拉善盟"}],"province":{"id":"15","name":"内蒙古"}},{"cities":[{"id":"6401","name":"银川市"},{"id":"6402","name":"石嘴山市"},{"id":"6403","name":"吴忠市"},{"id":"6404","name":"固原市"},{"id":"6405","name":"中卫市"}],"province":{"id":"64","name":"宁夏"}},{"cities":[{"id":"6201","name":"兰州市"},{"id":"6202","name":"嘉峪关市"},{"id":"6203","name":"金昌市"},{"id":"6204","name":"白银市"},{"id":"6205","name":"天水市"},{"id":"6206","name":"武威市"},{"id":"6207","name":"张掖市"},{"id":"6208","name":"平凉市"},{"id":"6209","name":"酒泉市"},{"id":"6210","name":"庆阳市"},{"id":"6211","name":"定西市"},{"id":"6212","name":"陇南市"},{"id":"6229","name":"临夏回族自治州"},{"id":"6230","name":"甘南藏族自治州"}],"province":{"id":"62","name":"甘肃"}},{"cities":[{"id":"6301","name":"西宁市"},{"id":"6321","name":"海东地区"},{"id":"6322","name":"海北藏族自治州"},{"id":"6323","name":"黄南藏族自治州"},{"id":"6325","name":"海南藏族自治州"},{"id":"6326","name":"果洛藏族自治州"},{"id":"6327","name":"玉树藏族自治州"},{"id":"6328","name":"海西蒙古族藏族自治州"}],"province":{"id":"63","name":"青海"}},{"cities":[{"id":"5401","name":"拉萨市"},{"id":"5421","name":"昌都地区"},{"id":"5422","name":"山南地区"},{"id":"5423","name":"日喀则地区"},{"id":"5424","name":"那曲地区"},{"id":"5425","name":"阿里地区"},{"id":"5426","name":"林芝地区"}],"province":{"id":"54","name":"西藏"}},{"cities":[{"id":"6501","name":"乌鲁木齐市"},{"id":"6502","name":"克拉玛依市"},{"id":"6521","name":"吐鲁番地区"},{"id":"6522","name":"哈密地区"},{"id":"6523","name":"昌吉回族自治州"},{"id":"6527","name":"博尔塔拉蒙古自治州"},{"id":"6528","name":"巴音郭楞蒙古自治州"},{"id":"6529","name":"阿克苏地区"},{"id":"6530","name":"克孜勒苏柯尔克孜自治州"},{"id":"6531","name":"喀什地区"},{"id":"6532","name":"和田地区"},{"id":"6540","name":"伊犁哈萨克自治州"},{"id":"6542","name":"塔城地区"},{"id":"6543","name":"阿勒泰地区"},{"id":"659001","name":"石河子市"},{"id":"659002","name":"阿拉尔市"},{"id":"659003","name":"图木舒克市"},{"id":"659004","name":"五家渠市"}],"province":{"id":"65","name":"新疆"}},{"cities":[{"id":"3401","name":"合肥市"},{"id":"3402","name":"芜湖市"},{"id":"3403","name":"蚌埠市"},{"id":"3404","name":"淮南市"},{"id":"3405","name":"马鞍山市"},{"id":"3406","name":"淮北市"},{"id":"3407","name":"铜陵市"},{"id":"3408","name":"安庆市"},{"id":"3410","name":"黄山市"},{"id":"3411","name":"滁州市"},{"id":"3412","name":"阜阳市"},{"id":"3413","name":"宿州市"},{"id":"3414","name":"巢湖市"},{"id":"3415","name":"六安市"},{"id":"3416","name":"毫州市"},{"id":"3417","name":"池州市"},{"id":"3418","name":"宣城市"}],"province":{"id":"34","name":"安徽"}},{"cities":[{"id":"3301","name":"杭州市"},{"id":"3302","name":"宁波市"},{"id":"3303","name":"温州市"},{"id":"3304","name":"嘉兴市"},{"id":"3305","name":"湖州市"},{"id":"3306","name":"绍兴市"},{"id":"3307","name":"金华市"},{"id":"3308","name":"衢州市"},{"id":"3309","name":"舟山市"},{"id":"3310","name":"台州市"},{"id":"3311","name":"丽水市"}],"province":{"id":"33","name":"浙江"}},{"cities":[{"id":"3501","name":"福州市"},{"id":"3502","name":"厦门市"},{"id":"3503","name":"莆田市"},{"id":"3504","name":"三明市"},{"id":"3505","name":"泉州市"},{"id":"3506","name":"漳州市"},{"id":"3507","name":"南平市"},{"id":"3508","name":"龙岩市"},{"id":"3509","name":"宁德市"}],"province":{"id":"35","name":"福建"}},{"cities":[{"id":"7101","name":"台北市"},{"id":"7102","name":"高雄市"},{"id":"7103","name":"基隆市"},{"id":"7104","name":"台中市"},{"id":"7105","name":"台南市"},{"id":"7106","name":"新竹市"},{"id":"7107","name":"嘉义市"}],"province":{"id":"71","name":"台湾"}},{"cities":[{"id":"8101","name":"香港"}],"province":{"id":"81","name":"香港"}},{"cities":[{"id":"8201","name":"澳门"}],"province":{"id":"82","name":"澳门"}}];
        $.extend(EX, {
            /**
             * 获得全部省份列表
             * @returns {Array}
             */
            getProvinceList : function(){
                var res = [];
                $.each(data, function(){
                    res.push(this.province);
                });
                return res;
            },
            /**
             * 查找对应省份的城市列表
             * @param id
             * @returns {Array}
             */
            getCityListByProvinceId : function(id){
                var res = [];
                $.each(data, function(){
                    if(this.province.id == id){
                        res = this.cities;
                        return false;
                    }
                });
                return res;
            },
            /**
             * 根据城市ID获取省份
             * @param id
             * @returns {*}
             */
            getProvinceByCityId : function(id){
                var res = null;
                $.each(data, function(){
                    var _this = this;
                    $.each(this.cities, function(){
                        if(this.id == id){
                            res = _this.province;
                            return false;
                        }
                    });
                    if(res){
                        return false;
                    }
                });
                return res;
            }
        });
    })(CITY);
    exports.city = CITY;

    

    /*
     *过滤昵称控制符
     */
     exports.filterUnicode = function(str) {
            var reg = new RegExp(decodeURIComponent('%E2%80%AE'),'g');
            return str.replace(reg, '');
     }

     
     

    /*
     *md5加密
     */
    var MD = {};
    (function(EX){ 
        var rotateLeft = function(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        var addUnsigned = function(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }
        
        var F = function(x, y, z) {
            return (x & y) | ((~ x) & z);
        }
        
        var G = function(x, y, z) {
            return (x & z) | (y & (~ z));
        }
        
        var H = function(x, y, z) {
            return (x ^ y ^ z);
        }
        
        var I = function(x, y, z) {
            return (y ^ (x | (~ z)));
        }
        
        var FF = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        
        var GG = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        
        var HH = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        
        var II = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        
        var convertToWordArray = function(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWordsTempOne = lMessageLength + 8;
            var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
            var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        
        var wordToHex = function(lValue) {
            var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValueTemp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
            }
            return WordToHexValue;
        };
        
        var uTF8Encode = function(string) {
            string = string.replace(/\x0d\x0a/g, "\x0a");
            var output = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    output += String.fromCharCode((c >> 6) | 192);
                    output += String.fromCharCode((c & 63) | 128);
                } else {
                    output += String.fromCharCode((c >> 12) | 224);
                    output += String.fromCharCode(((c >> 6) & 63) | 128);
                    output += String.fromCharCode((c & 63) | 128);
                }
            }
            return output;
        };
        
        EX.md5 = function(string) {
                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11=7, S12=12, S13=17, S14=22;
                var S21=5, S22=9 , S23=14, S24=20;
                var S31=4, S32=11, S33=16, S34=23;
                var S41=6, S42=10, S43=15, S44=21;
                string = uTF8Encode(string);
                x = convertToWordArray(string);
                a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
                for (k = 0; k < x.length; k += 16) {
                    AA = a; BB = b; CC = c; DD = d;
                    a = FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
                    d = FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
                    c = FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
                    b = FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
                    a = FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
                    d = FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
                    c = FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
                    b = FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
                    a = FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
                    d = FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
                    c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
                    b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
                    a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
                    d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
                    c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
                    b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
                    a = GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
                    d = GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
                    c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
                    b = GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
                    a = GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
                    d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
                    c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
                    b = GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
                    a = GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
                    d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
                    c = GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
                    b = GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
                    a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
                    d = GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
                    c = GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
                    b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
                    a = HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
                    d = HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
                    c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
                    b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
                    a = HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
                    d = HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
                    c = HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
                    b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
                    a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
                    d = HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
                    c = HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
                    b = HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
                    a = HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
                    d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
                    c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
                    b = HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
                    a = II(a, b, c, d, x[k+0],  S41, 0xF4292244);
                    d = II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
                    c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
                    b = II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
                    a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
                    d = II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
                    c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
                    b = II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
                    a = II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
                    d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
                    c = II(c, d, a, b, x[k+6],  S43, 0xA3014314);
                    b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
                    a = II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
                    d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
                    c = II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
                    b = II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
                    a = addUnsigned(a, AA);
                    b = addUnsigned(b, BB);
                    c = addUnsigned(c, CC);
                    d = addUnsigned(d, DD);
                }
                var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
                return tempValue.toLowerCase();
            }
    })(MD);
    exports.MD = MD;

    // 订阅发布
    var PubSub = (function(namespace){
        var n = namespace || "__subscribers";  // 指定事件缓存命名空间
        var o = {
            // 为对象增加订阅者
            addSubscriber : function(obj, type, callback){
                if(callback){
                    if(!obj[n]){
                        obj[n] = {};
                    }
                    if(!obj[n][type]){
                        obj[n][type] = [];
                    }
                    var subscribers = obj[n][type],
                        len = subscribers.length, i = 0, flag = false;
                    for(; i < len; i++){
                        if(subscribers[i] == callback){
                            flag = true;
                            break ;
                        }
                    }
                    if(!flag){
                        obj[n][type].unshift(callback);
                    }
                }
            },

            // 为对象添加一次性订阅者
            addOnceSubscriber : function(obj, type, callback){
                if(callback){
                    var _this = this;
                    _this.addSubscriber(obj, type, function(){
                        var me = arguments.callee;
                        callback.apply(obj, arguments);
                        _this.removeSubscriber(obj, type, me);
                    });
                }
            },

            // 为对象移除订阅者
            removeSubscriber : function(obj, type, arg){
                var len = arguments.length;
                switch (len) {
                    case 3: // 传入三个参数时：移除一个确定的订阅者
                        if(obj[n] && obj[n][type]){
                            var sub = obj[n][type],
                                l = sub.length,
                                i = 0;
                            for(; i < l; i++){
                                if(sub[i] == arg){
                                    obj[n][type].splice(i, 1);
                                    break;
                                }
                            }
                        }
                        break;
                    case 2: // 传入两个参数时：移除某个消息所有的订阅者
                        if (obj[n] && obj[n][type]) {
                            obj[n][type].length = 0;
                        }
                        break;
                    case 1: // 传入一个参数时：移除所有消息的订阅者
                        if (obj[n]){
                            delete obj[n];
                            obj[n] = null;
                        }
                        break;
                }
            },

            // 对象发布消息
            publish : function(obj, type){
                if(obj[n] && obj[n][type]){
                    var subscribers = obj[n][type],
                        len = subscribers.length, i = len - 1;

                    for(; i >= 0; i --){
                        subscribers[i].apply(obj, Array.prototype.slice.call(arguments, 2));
                    }
                }
            }
        };

        return o;
    })("__subscribers");

    for(var i in PubSub){
        exports[i] = PubSub[i];
    }

    exports.queryToJson = function(query){
        var r = {}, t = query.split('&');
        for(var i = 0; i < t.length; i++){
            if(t[i]){
                var _t = t[i].split('=');
                if(_t.length >= 1){
                    r[_t[0]] = _t[1] || null;
                }
            }
        }

        return r;
    };
    exports.removeArrayValue = function(arr, value){
        for(var i = 0; i < arr.length; i++){
            if(arr[i] == value){
                arr.splice(i, 1);
            }
        }
    };
    exports.inArray = function(arr, value){
        for(var i = 0; i < arr.length; i++){
            if(arr[i] == value) return i;
        }
        return -1;
    };

    //设置radio 选中
    exports.setRadioSelected = function(radioName,value){
        $('input[name="'+radioName+'"][value="'+value+'"]').attr("checked",true); 
    };

    //重置radio 
    exports.resetRadio = function(radioName,value){
        $('input[name="'+radioName+'"][value="'+value+'"]').attr("checked",false); 
    };

    //替换radio 为新的radio
    exports.replaceRadio = function(radioName,value){
        var html = '<input type="radio" name="'+radioName+'" value="'+value+'">';
        $('input[name="'+radioName+'"][value="'+value+'"]').replaceWith(html); 
    };

    //获取radio 选中值
    exports.getRadioValue = function(radioName){
        return $('input[name="'+radioName+'"]:checked').val();
    };

    //获取二维码   todo 未测试
    exports.getQrurl = function(w,h,roomId){
        var domain = "http://btgfp.xianzhi365.com/login";
        var faceUrl = "http://pan.baidu.com/share/qrcode?";
        var url = faceUrl+"&w="+w+"&h="+h;
        url+="&url="+domain+"?&roomId="+roomId;
        return url;
    };


});

