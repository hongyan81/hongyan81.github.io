//copy from:http://www.cnblogs.com/hustlzp/archive/2011/08/22/a-js-tool-for-auto-blog-title-content-generate.html

//获取元素位置
function getPos(e) {        
  var t = l = 0;       
	while (e)
	{              
		t += e.offsetTop;
		l += e.offsetLeft;        
		e = e.offsetParent;     
	}  
	return {top:t, left:l}; 
}

//获取滚动条信息 
function getScroll() {      
	return document.body.scrollTop | document.documentElement.scrollTop; 
}  

//移动窗体
function moveWindow(finalpos, interval) {

	//若不支持此方法，则退出
	if(!window.scrollTo) return false;

	//窗体滚动时，禁用鼠标滚轮
	window.onmousewheel = function(){
		return false;
	};
  	
	//清除计时
	if (document.body.movement) { 
		clearTimeout(document.body.movement); 
	} 

	var currentpos = getScroll(); 	//获取滚动条信息

	var dist = 0; 
	if (currentpos == finalpos) { 	//到达预定位置，则解禁鼠标滚轮，并退出
		window.onmousewheel = function(){
			return true;
		}
		return true; 
	} 
	if (currentpos < finalpos) { 	//未到达，则计算下一步所要移动的距离
    	dist = Math.ceil((finalpos - currentpos)/10); 
		currentpos += dist; 
	} 
	if (currentpos > finalpos) { 
		dist = Math.ceil((currentpos - finalpos)/10); 
		currentpos -= dist; 
	}
	
	var scrTop = getScroll();			//获取滚动条信息
	window.scrollTo(0, currentpos);	               //移动窗口
	if(getScroll() == scrTop)		               //若已到底部，则解禁鼠标滚轮，并退出
	{
		window.onmousewheel = function(){
			return true;
		}
		return true;
	}
	
	//进行下一步移动
	var repeat = "moveWindow(" + finalpos + "," + interval + ")"; 
	document.body.movement = setTimeout(repeat, interval); 
} 

//移动绝对定位元素
function moveFixElement(elementID, finalTop, finalRight, interval)
{
	var elem = document.getElementById(elementID);
	if(elem.movement){
		clearTimeout(elem.movement);
	}
	
	finalTop = parseInt(finalTop);
	finalRight = parseInt(finalRight);
	
	var xpos = parseInt(elem.style.right);
	var ypos = parseInt(elem.style.top);
	
	var dist = 0;
	
	if(xpos == finalRight && ypos == finalTop){
		return true;
	}
	
	if(xpos < finalRight){
		dist = Math.ceil((finalRight - xpos) / 10);
		xpos += dist;
	}
	if(xpos > finalRight){
		dist = Math.ceil((xpos - finalRight) / 10);
		xpos -= dist;
	}
	
	if(ypos < finalTop){
		dist = Math.ceil((finalTop - ypos) / 10);
		ypos += dist;
	}
	if(ypos > finalTop){
		dist = Math.ceil((ypos - finalTop) / 10);
		ypos -= dist;
	}
	
	elem.style.right = xpos + "px";
	elem.style.top = ypos + "px";
	
	var repeat = "moveFixElement('" + elementID + "'," + finalTop + "," + finalRight + "," + interval + ")";
	elem.movement = setTimeout(repeat, interval);
}


//创建菜单
function createContent(id, mt, st, interval)
{	
	//获取博文正文div容器
	var elem = document.getElementById(id);
	if(!elem) return false;
	
	//获取div中所有元素结点
	var nodes = elem.getElementsByTagName("*");
	
	var myindex = document.body.getElementsByTagName("blogindex")[0];
	if(!myindex) return false;
	
	//创建自定义列表
	var dlist = document.createElement("dl");
	
	//创建div容器
	var blogContent = document.createElement("div");
	blogContent.setAttribute("id","blogContent");
	var title = document.createElement("div");
	title.setAttribute("id","contentTitle");
	var dldiv = document.createElement("div");
	dldiv.setAttribute("id", "dldiv");
	
	var num = 0;
	
	//遍历所有元素结点
	for(var i=0; i<nodes.length; i++)
	{
		if(nodes[i].nodeName == mt || nodes[i].nodeName == st)	
		{
			//获取标题文本
			var nodetext = nodes[i].firstChild.nodeValue;
			//插入锚		
			nodes[i].setAttribute("id", "blogTitle" + num);
			
			switch(nodes[i].nodeName)
			{
				case mt:	//若为主标题 
					var item = document.createElement("dt");
					break;
				case st:	//若为子标题
					var item = document.createElement("dd");
					break;
			}
			
			//创建锚链接
			var itemtext = document.createTextNode(nodetext);
			item.appendChild(itemtext);
			item.setAttribute("name", num);
			item.onclick = function(){		//添加鼠标点击触发函数
				var pos = getPos(document.getElementById("blogTitle" + this.getAttribute("name")));
				if(!moveWindow(pos.top, interval)) return false;
			};			
			
			//将自定义表项加入自定义列表中
			dlist.appendChild(item);
			num++;
		}
	}
	
	if(num == 0) return false;
		
	
	//将自定义列表加入文档中
	dldiv.appendChild(dlist);
	
	blogContent.appendChild(title);
	blogContent.appendChild(dldiv);
	myindex.appendChild(blogContent);
	
	//点击title，目录伸缩
	title.onclick = function(){
		var blogContent = document.getElementById("blogContent");
		var dldiv = document.getElementById("dldiv");
		if(parseInt(blogContent.style.right) == 0){
			moveFixElement("blogContent", blogContent.style.top, -dldiv.offsetWidth, 20);
		}
		else{
			moveFixElement("blogContent", blogContent.style.top, 0, 20);
		}
	};
	
}
