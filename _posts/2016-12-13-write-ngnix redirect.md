---
layout: wp
title: about nginx rewrite
---   


# 基于Nginx服务器的重定向问题（为什么入口是index.php）

## 一、首先有几个前置说明

1、首先nginx的配置有很多的模块，当master进程fork出若干个workr子进程后，每个worker子进程都会在自己的for死循环中不断调用事件模块
块配置项由一个块配置项名和一对大括号组成。具体示例如下

```
		events {
		...
		}

		http {
			upstream backend {
				server 127.0.0.1:8080;
			}

			gzip on;
			server {
				
				server 127.0.0.1:8080;
				}
		}
```
	
Nginx在运行时，至少必须加载几个核心模块和一个事件类模块。这些模块运行时所支持的配置项称为基本配置——所有其他模块执行时都依赖的配置项。有这么一些 配置项，即使没有显式地进行配置，它们也会有默认的值，如daemon，即使在nginx.conf中没有对它进行配置，也相当于打开了这个功能

2、http模块
事件模块检测是否有TCP连接请求，当收到一个SYN包后，由事件模块建立一条TCP连接。连接建立成功后，交由HTTP框架处理，HTTP框架负责接收HTTP头部，并根据头 部信息将HTTP请求分发到不同的HTTP模块。

## 二、关于我的项目说明和重定向的问题

### 我的项目:Myweb（YII框架2.0）

项目根目录：index页
web目录：有index.php（yii框架的入口脚本，没有任何输出）、index2.php(输出 你好)
site目录:有index.php （输出欢迎）


### nginx.conf配置如下

root /home/work/data/www/myweb/web;

```

    if (!-e $request_filename){
        rewrite ^/(.+)$ /index.php break;
    }

```

### 现象

.a 无论直接访问顶级域名还是不存在的目录都返回了site目录下的index页 <br>
访问 http://www.myweb.cn : 输出欢迎（返回的site目录下的index） <br>
访问不存在的目录 http://www.myweb.cn/aa : 输出欢迎（返回的site目录下的index） <br>

.b 直接用域名访问web目录下的index2,无法正常访问，返回错误页 <br>
访问 http://www.myweb.cn/index2.php ： 无法正常访问，返回错误页 <br>
访问 http://www.myweb.cn/web/index2.php ： 依旧输出欢迎（返回的site目录下的index）<br>
 
.c 访问http://www.myweb.cn/web/index.php?r=tmalltrade  返回正确业务页面 <br>
访问 http://www.myweb.cn/web/?r=tmalltrade      返回正确业务页面,页面同以上链接 <br>
访问 http://www.myweb.cn/?r=tmalltrade      返回正确业务页面,页面同以上链接<br>


原因：<br>
.现象a<br>
	因为root配置的路径为/home/work/data/www/myweb/web，所以直接访问域名时，先访问的是web下的index，然后yii框架指向了site目录下的index
	做了如下配置了（在location外面写的）,所以依旧输出了欢迎

```

    if (!-e $request_filename){
        rewrite ^/(.+)$ /index.php break;当前目录不存在时，会指向上级目录下的index.php文件，然后跳出，不在匹配下面的规则
    }

```

.现象b<br>
	同上，因为配置了root的目录为web，所以域名+index2 =  http://www.myweb.cn/web/index2.php, 实际是不存的

.现象c
	同现象a，配置了root的目录，同时yii框架匹配到了相应的controler

另外，我把rewrite相关内容注释掉，直接返回了No input file specified，这就是因为nginx的运行机制
下面location又没有适合的分发规则，所以nginx直接报错了<br>


## 三、尝试更改nginx配置，使用try_files替换rewrite

注释掉rewrite相关配置后，ngnixn会因为没有相应的分发规则而返回了No input file specified<br>
这时使用try_files如下，达到了和rewrite一样的效果

try_files $uri $uri/ /index.php;

继续更改配置如下，同时在web目录下去掉index2，增加index3页面<br>
此时输出了index3的信息，因为按照顺寻匹配到了index3 <br>
try_files $uri $uri/index2.php $uri/index3.php;


### 备注：

try_files

语法: try_files file ... uri 或 try_files file ... = code

默认值: 无

作用域: server location

按顺序检查文件是否存在，返回第一个找到的文件。结尾的斜线表示为文件夹 -$uri/。如果所有的文件都找不到，会进行一个内部重定向到最后一个参数。

务必确认只有最后一个参数可以引起一个内部重定向，之前的参数只设置内部URI的指向。 最后一个参数是回退URI且必须存在，否则将会出现内部500错误。

命名的location也可以使用在最后一个参数中。与rewrite指令不同，如果回退URI不是命名的location那么$args不会自动保留，如果你想保留$args，必须明确声明。

