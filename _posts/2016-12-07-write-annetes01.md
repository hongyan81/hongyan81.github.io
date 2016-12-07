---
layout: wp
title: 关于访问服务器(Nginx)返回502错误
---

# 关于访问服务器(Nginx) 返回502错误
<br />
##起因：
 由于使用Yii2.0,需要升级php版本为5.4，升级成功后，访问本机所有的站点都返回502 Bad Gateway错误
 <br />
##说明：
    后来就开始各种度娘、google,有的说php-cgi进程数不够，有的说php-fpm配置的max_children和max_requests值不对，甚至还有说timeout时间
 不对的，然后分别查看了ngnix和php的errorlog,重启N次无果。
    最后发现是php-fpm.conf的监听端口配置的与Nginx各个站点下的fastcgi_pass 中的端口不一致。改为一致后重启服务，终于可以正常访问了。
 <br />
 ##备注：
 1、如何查看当前php-cgi进程 
    ps -ef |grep php 


time:2016-12-07