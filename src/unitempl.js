/*!
 * UniTempl JavaScript Template Engine v1.0.0
 * https://github.com/jeking217/unitempl
 *
 * Copyright 2018 @ jeking217
 *
 * Date: 2018-03-09
 */
(function ($) {
    "use strict";
    
    function UniTempl(template,props) {
    	
		this.template=$($(template).html());
		this.props=props;
		
		this.innerAttrs=['content','text','src','href','id','sid','title','alt','class','css','target','name'];
		
		this.funCache=$(template).data('funCache') || {};
		$(template).data('funCache',this.funCache);
		
		this.parse();
		
	}
    
    UniTempl.prototype.parse=function(){
    	var $this=this;
    	
    	// 处理 if 表达式
    	this.runIf(this.template,'this',this.props);
    	
    	// 输出 this.属性 的value
    	this.runWrite(this.template,'this',this.props);
    	
    	// 输出 this. 属性的 attr
    	this.runAttr(this.template,'this',this.props);
    	
    	// 处理 each 表达式
    	this.runEach(this.template,'this',this.props);
    	
    	return this;
    }
    
    UniTempl.prototype.runWrite=function(element,scope,data){
    	var express='';
    	var attrMap={};
    	var len=this.innerAttrs.length;
    	for(var i in this.innerAttrs){
    		var attr=this.innerAttrs[i];
    		express+='['+attr+'*='+scope+']'+(i<(len-1)?',':'');
    		attrMap[attr]=true;
    	}
    	
    	// 处理当前标签
		var attrs=$(element)[0].attributes;
		$(attrs).each(function(i,attr){
			if(attrMap[attr.name] && attr.value){
				var filedName=attr.value.replace(scope+'.','');
				process(element,attr.name,filedName);
			}
		});
    	
		// 处理下级标签
    	$(express,element).each(function(){
    		var target=$(this);
    		var attrs=$(this)[0].attributes;
    		$(attrs).each(function(i,attr){
    			if(attrMap[attr.name] && attr.value){
    				var filedName=attr.value.replace(scope+'.','');
    				process(target,attr.name,filedName);
    			}
    		});
    	});
    	
    	function process(target,attrName,fieldName){
    		$(target).removeAttr(attrName);
    		if(typeof data === 'object'){
    			if(attrName=='content'){
    				$(target).html(data[fieldName]);
    			}else if(attrName=='text'){
    				$(target).text(data[fieldName]);
    			}else{
    				$(target).attr(attrName,data[fieldName]);
    			}
    		}else{
    			if(attrName=='content'){
    				$(target).html(data);
    			}else if(attrName=='text'){
    				$(target).text(data);
    			}else{
    				$(target).attr(attrName,data);
    			}
    		}
    	}
    	
    	return this;
    }
    
    UniTempl.prototype.runAttr=function(element,scope,data){
    	var $this=this;
    	
    	// 处理当前标签
    	process(element);
    	
    	// 处理下级标签
    	var express='[attr*='+scope+']';
    	$(express,element).each(function(){
    		process(this);
    	});
    	
    	function process(target){
    		var attrs=$(target).attr('attr');
    		if(!attrs){
    			return;
    		}
    		$(target).removeAttr('attr');
    		attrs=attrs.split(',');
    		for(var i in attrs){
    			var attr=attrs[i].split(':');
    			var attrName=attr[0];
    			var fieldName=attr[1].replace(scope+'.','');
    			if(typeof data === 'object'){
    				$(target).attr(attrName,data[fieldName]);
    			}else{
    				$(target).attr(attrName,data);
    			}
    		}
    	}
    	
    	return this;
    }
    
    UniTempl.prototype.runIf=function(element,scope,data){
    	var $this=this;
    	
    	// 处理当前标签
    	process(element);
    	
    	// 处理下级标签
    	var express='[if*='+scope+']';
    	$(express,element).each(function(){
    		process(this);
    	});
    	
    	function process(target){
    		var exp=$(target).attr('if');
    		if(!exp){
    			return;
    		}
    		if(scope=='this'){
    			exp=exp.replace('this.','data.');
    			scope='data';
    		}
    		var ifFun=$this.funCache[scope+'_iffun_'+exp] ||  new Function(scope,'return '+exp);
    		$this.funCache[scope+'_iffun_'+exp]=ifFun;
    		
    		var flag=ifFun.call($this,data);
    		if(!flag){
    			$(target).remove();
    		}else{
    			$(target).removeAttr('if');
    		}
    	}
    	
    	return this;
    }
    
    UniTempl.prototype.runEach=function(element,scope,data){
    	var $this=this;
    	
    	// 处理当前标签
    	process(element);
    	
    	// 处理下级标签
    	var express='[earch*='+scope+']';
    	$(express,element).each(function(){
    		process(this);
    	});
    	
    	
    	function process(target){
    		var exp=$(target).attr('earch');
    		if(!exp){
    			return;
    		}
    		exp=exp.replace('this.','')
    		$(target).removeAttr('earch');
    		
    		var varname=exp.split(' ')[0];
    		var valname=exp.split(' ')[2];
    		if(!data[valname] || data[valname].length==0){
    			$(target).remove();
    			return;
    		}
    		
    		var eachFun=$this.funCache[scope+'_eachfun_'+exp] ||  new Function('element',valname,
    			'for(var i=0;i<'+valname+'.length;i++){'+
    				'var target=element.clone();element.before(target);'+
    				''+valname+'[i]._index=i;'+
    				'this.runIf(target,"'+varname+'",'+valname+'[i]);'+
    				'this.runWrite(target,"'+varname+'",'+valname+'[i]);'+
    				'this.runAttr(target,"'+varname+'",'+valname+'[i]);'+
    				'this.runEach(target,"'+varname+'",'+valname+'[i]);'+
    			'}'
    		);
    		$this.funCache[scope+'_eachfun_'+exp]=eachFun;
    		
    		eachFun.call($this,$(target),data[valname]);
    		$(target).remove();
    	}
    	
    	return this;
    }
    
    UniTempl.prototype.to=function(target){
    	$(target).append(this.template);
    	return this;
    }
    
    
    $.fn.UniTempl = function(props){
    	return new UniTempl(this,props);
    };
    
    if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = UniTempl;
	}
    
    
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	if ( typeof define === "function" && define.amd ) {
		define( "UniTempl", [], function() {
			return UniTempl;
		} );
	}
    
})(jQuery);    
