UniTempl ��һ���ࡢ������javascript ģ�����档
## ʹ�÷�ʽ
```html 
<script src="jquery-1.12.4.js"></script>    
<script src="src/unitempl.js"></script> 
```

## ʹ������
1������ģ��
```html 
<script type="text/html" id="template2">
<div>	
	������<label attr-sid="this.sid" content="this.name"></label><br/>
	���䣺<label content="this.age"></label>	<span style="margin-left:5px;" if="this.age>=18">������</span><br/>
	�Ա�<label content="this.sex"></label><br/>
	���ã�<ul><li earch="item in this.likes"><label content="item"></label></li></ul>
	
	�鼮��<ul>
			<li earch="book in this.books">
				���:<label content="book._index"></label>&nbsp;&nbsp;
				������<label content="book.name"></label>&nbsp;&nbsp;
				�۸�<label content="book.price"></label>&nbsp;&nbsp; <label if="book.price>50" style="color:red;">�ù�</label>
				�����磺<label content="book.publish"></label>
			</li>
		</ul>
</div>
</script>
```
2����������
```js
var multData={
			sid:33333,
			name:'����',
			sex:'��',
			age:16,
			likes:['�Ķ�','�滭','��Ӱ'],
			books:[
				{name:'java ��������',price:21,publish:'xxx������'},
				{name:'spark ��������',price:76,publish:'yyy������'}
			]
		}
```    
3���������
```js
$('#template2').UniTempl(multData).to('#demo3');
```

