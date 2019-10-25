# LMS
---
**程序启动方法** 安装nodejs，完成mysql配置并启动mysql后，在app.js级目录下启动命令行或PS，输入指令 `npm start`并按下回车键，服务程序启动。

在浏览器中输入`localhost:3000`或`本机ipv4地址:3000`即可访问系统主页，开始使用，**建议使用chrome浏览器**。

### 模块功能说明
---
模块名称|功能说明
:--|:--
db|数据库命令  
model|上传文件模块  
public|本地保存的各项文件  
routes|服务器执行逻辑  
views|前端页面  
app.js|程序启动入口

### mysql
---
本程序采用mysql为数据库，需要提前安装mysql。

推荐mysql采用5.7及以上版本。

#### mysql配置
1. 安装mysql
2. 右键我的电脑 -> 高级系统设置 -> 环境变量 -> 系统变量 -> 添加*D:\mysql-5.7.23-win32\bin;*(即mysql的bin目录)
3. 在mysql根目录下新建文件夹*data*
4. 如果mysql根目录下有*my-default.ini*，重命名为*my.ini*，并将文件内容修改为如下:
```

    [mysql]

	# 设置mysql客户端默认字符集

	default-character-set=utf8 

	[mysqld]

	#设置3306端口

	port = 3306 

	# 设置mysql的安装目录

	basedir=D:\Apps\mysql-5.7.21-winx64 

	# 设置mysql数据库的数据的存放目录

	datadir=D:\Apps\mysql-5.7.21-winx64\data

	# 允许最大连接数

	max_connections=200

	# 服务端使用的字符集默认为8比特编码的latin1字符集

	character-set-server=utf8

	# 创建新表时将使用的默认存储引擎

	default-storage-engine=INNODB
```
  **注意:将*basedir*和*datadir*改为本机mysql路径**
5. 以**管理员身份**启动命令行或PS，切换到*mysql\bin*目录下，输入`mysqld -install`，成功会出现下图:
![](https://images2017.cnblogs.com/blog/1013082/201711/1013082-20171129200703745-1678069599.png)
6. 输入`net start mysql`启动mysql，也可在windows服务中启动mysql，输入`net stop mysql`关闭mysql
![](https://images2017.cnblogs.com/blog/1013082/201711/1013082-20171129201043401-962847995.png)
7. 完成mysql配置
 
#### 设置mysql密码
1. 启动命令行或PS，切换到*mysql\bin*目录下输入`net start mysql`启动mysql
2. 输入`mysql -uroot -p`登陆mysql，第一次登陆密码为空，直接回车
3. 输入`set password for root@localhost=password('123456');`将密码设为*123456*
4. 完成mysql密码设置

### nodejs
---
本程序采用nodejs为运行环境，需要提前安装nodejs。

推荐到nodejs官网下载最新版本。

#### nodejs配置
1. 启动命令行或PS，切换到*MysqlDemo*目录下输入`npm body-parser`，等待安装完成
2. 输入`npm ejs`，等待安装完成
3. 输入`npm silly-datetime`，等待安装完成
4. 输入`npm dateformat`，等待安装完成
5. 输入`npm formidable`，等待安装完成
6. 完成nodejs配置

### 启动流程
---
1. 启动命令行或PS，切换到*mysql\bin*目录下输入`net start mysql`启动mysql
2. 再开启一个命令行或PS，切换到*MysqlDemo*目录下输入`npm start`
3. 在浏览器中输入`localhost:3000`或`本机ipv4地址:3000`即可访问系统主页，开始使用