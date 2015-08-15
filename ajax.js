/* 
* ajax实现
* @author lq9328@126.com
* @date 2015/6/5
* @param url 必选，请求路劲
* @param type 可选，请求类型，默认post
* @param data 可选，发送给服务器的数据，json类型
* @param async 可选，同步，默认同步执行（true）
* @param callback 可选，function回调函数
* @param dataType 可选，预期返回的数据类型，默认为text
* @param jsonp 可选，jsonp回调参数，默认为"jsonp"用于服务器端接收，
*				如jsonp:"callback"，php端输出echo $_GET['callback']."(这里是要输出的数据)"
*/ 
var ajax = function(){
	var GLOBAL = {};

	//获取XMLHttpRequest对象
	var getXMLHttpReq = function () {  
		var xhr = null;
	    try {  
	        xhr = new ActiveXObject("Msxml2.XMLHTTP");//IE高版本创建XMLHTTP  
	    }  
	    catch(E) {  
	        try {  
	            xhr = new ActiveXObject("Microsoft.XMLHTTP");//IE低版本创建XMLHTTP  
	        }  
	        catch(E) {  
	            xhr = new XMLHttpRequest();//兼容非IE浏览器，直接创建XMLHTTP对象  
	        }  
	    }  
	  return xhr;
	};

	//格式化用户输入数据参数，防止不合法参数，返回json对象
	//TODO 试图格式化数据时使用eval，可能运行不合法的脚本，造成安全问题
	var parseData = function(data){
		if(!data) return {};	
		if(typeof data != 'object'){
			try{
				data = JSON.parse(data);
			}catch(e){
				data = eval("("+data+")");
			}
		}
		return data;
	};

	//判断空对象
	var isEmptyObject = function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	};

	
	return the = {

		//ajax查询方法
	 	request : function(arg){
			var url = arg.url || null;  
			var dataType = arg.dataType || 'text'; 
			var type = arg.type || 'post'; 
			var async = arg.async || true;
			var callback = arg.callback || null;
			var data = arg.data || null;

			if(!url) return null;
			var XMLHttpReq = getXMLHttpReq();
			data = parseData(data);
			if(type.toLowerCase() === "jsonp"){
				if(!arg.jsonp) arg.jsonp = "jsonp";
				url += url.indexOf('?') == -1 ? '?' : '&';
				if(!isEmptyObject(data)){					
					for(var o in data){
						url += o + "=" + data[o] + '&';
					}
					url = url.substring(0, url.length-1);
				}
				url += "&" + arg.jsonp + "=ajax.jsonpCallback";
				var JSONP = document.createElement("script");  
    			JSONP.type = "text/javascript"; 
    			JSONP.id = 'jsonp'; 
    			JSONP.src = url;  
    			document.getElementsByTagName("head")[0].appendChild(JSONP);
    			if(callback) GLOBAL.callback = callback;
    			return;
			}else if(type.toLowerCase() === 'get'){
				if(!isEmptyObject(data)){					
					url += url.indexOf('?') == -1 ? '?' : '&';
					for(var o in data){
						url += o + "=" + data[o] + '&';
					}
					url = url.substring(0, url.length-1);
				}
				var sendData = null;
				XMLHttpReq.open(type, url, async); 
			}else{
	    		XMLHttpReq.open(type, url, async); 
				XMLHttpReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				if(!isEmptyObject(data)){
					var sendData = '';
					for(var o in data){
						sendData += o + "=" + data[o] + '&';  
					}
					sendData = sendData.substring(0, sendData.length - 1);
				}else{
					var sendData = null;
				}
			}
			XMLHttpReq.send(sendData);         
		    XMLHttpReq.onreadystatechange = function(){				//指定响应函数 
		    	if (XMLHttpReq.readyState == 4) {  
			        if (XMLHttpReq.status == 200) { 
			        	switch(dataType.toLowerCase()){
			        		case 'json' :
			        			var res = XMLHttpReq.responseText;
			        			res = JSON.parse(res);
			        			break;
			        		case 'xml' :
			        			var res = XMLHttpReq.responseXML;	
			        			break;
			        		default :
			        			var res = XMLHttpReq.responseText;
			        	}
			 			if(callback){
			 				callback(res);
			 			}
			        }  
		    	} 
		    };
		},

		//jsonp回调函数
		jsonpCallback : function(data){
			document.getElementsByTagName("head")[0].removeChild(document.getElementById("jsonp"));
			if(GLOBAL.callback){
				GLOBAL.callback(data);
			}
		}


	}

}();
