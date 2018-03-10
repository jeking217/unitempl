UniTempl 是一款简洁、轻量的javascript 模版引擎。
## 使用方式
```html 
<script src="jquery-1.12.4.js"></script>    
<script src="src/unitempl.js"></script> 
```

## 使用例子
1、定义模版
```html 
<script type="text/html" id="template2">
<div>	
	姓名：<label attr-sid="this.sid" content="this.name"></label><br/>
	年龄：<label content="this.age"></label>	<span style="margin-left:5px;" if="this.age>=18">成年人</span><br/>
	性别：<label content="this.sex"></label><br/>
	爱好：<ul><li earch="item in this.likes"><label content="item"></label></li></ul>
	
	书籍：<ul>
			<li earch="book in this.books">
				序号:<label content="book._index"></label>&nbsp;&nbsp;
				书名：<label content="book.name"></label>&nbsp;&nbsp;
				价格：<label content="book.price"></label>&nbsp;&nbsp; <label if="book.price>50" style="color:red;">好贵啊</label>
				出版社：<label content="book.publish"></label>
			</li>
		</ul>
</div>
</script>
```
2、定义数据
```js
var multData={
			sid:33333,
			name:'张三',
			sex:'男',
			age:16,
			likes:['阅读','绘画','摄影'],
			books:[
				{name:'java 基础入门',price:21,publish:'xxx出版社'},
				{name:'spark 基础入门',price:76,publish:'yyy出版社'}
			]
		}
```    
3、调用组件
```js
$('#template2').UniTempl(multData).to('#demo3');
```

