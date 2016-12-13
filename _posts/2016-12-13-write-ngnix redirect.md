# 基于Nginx服务器的重定向问题

## 一、首先有几个前置说明

1、首先nginx的配置有很多的模块，当master进程fork出若干个workr子进程后，每个worker子进程都会在自己的for死循环中不断调用事件模块
块配置项由一个块配置项名和一对大括号组成。具体示例如下

		events {<br>
		...<br>
		}<br>

		http {<br>
			upstream backend {<br>
				server 127.0.0.1:8080;<br>
			}<br>

			gzip on;<br>
			server {<br>
				
				server 127.0.0.1:8080;<br>
				}<br>
		}<br>
	
Nginx在运行时，至少必须加载几个核心模块和一个事件类模块。这些模块运行时所支持的配置项称为基本配置——所有其他模块执行时都依赖的配置项。有这么一些 配置项，即使没有显式地进行配置，它们也会有默认的值，如daemon，即使在nginx.conf中没有对它进行配置，也相当于打开了这个功能

2、http模块<br>
事件模块检测是否有TCP连接请求，当收到一个SYN包后，由事件模块建立一条TCP连接。连接建立成功后，交由HTTP框架处理，HTTP框架负责接收HTTP头部，并根据头 部信息将HTTP请求分发到不同的HTTP模块。

## 二、关于我的项目说明和重定向的问题

我的项目:Myweb<br>
根目录下有个简单的index页（输出“hellow”）<br>
web目录下同样有个index页，是Yii框架的入口文件<br>

现象：
访问 http://www.myweb.cn ， 返回根目录的index页<br>
访问不存在的目录 http://www.myweb.cn/aa ，返回根目录的index页<br>
访问http://www.myweb.cn/web/index.php?r=tmalltrade  返回正确业务页面<br>
访问 http://www.myweb.cn/web/?r=tmalltrade     返回同上页面<br>

原因：<br>
nginix在处理http请求的时候，会进行分发,根据nginx。conf内http模块下server内的相关配置，匹配虚拟主机以及其他相应配置规则<br>

我这里配置了（在location外面写的）<br>


    if (!-e $request_filename){
        rewrite ^/(.+)$ /index.php break;
    }

当前目录不存在时，会指向上级目录下的index.php文件，然后跳出，不在匹配下面的规则<br>
