---
layout: wp
title: ���ڷ��ʷ�����(Nginx)����502����
---

# ���ڷ��ʷ�����(Nginx) ����502����
<br />
##����
 ����ʹ��Yii2.0,��Ҫ����php�汾Ϊ5.4�������ɹ��󣬷��ʱ������е�վ�㶼����502 Bad Gateway����
 <br />
##˵����
    �����Ϳ�ʼ���ֶ��google,�е�˵php-cgi�������������е�˵php-fpm���õ�max_children��max_requestsֵ���ԣ���������˵timeoutʱ��
 ���Եģ�Ȼ��ֱ�鿴��ngnix��php��errorlog,����N���޹���
    �������php-fpm.conf�ļ����˿����õ���Nginx����վ���µ�fastcgi_pass �еĶ˿ڲ�һ�¡���Ϊһ�º������������ڿ������������ˡ�
 <br />
 ##��ע��
 1����β鿴��ǰphp-cgi���� 
    ps -ef |grep php 


time:2016-12-07