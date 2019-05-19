# Happy-spare-money-back-end

## 运行说明

1. 安装cnpm

    ```bash
    $ npm install -g cnpm --registry=https://registry.npm.taobao.org
    ```

2. 在根目录执行

    ```bash
    cnpm install
    ```

    如果遇到问题，可以把根目录下的node_modules文件夹删除，重新`cnpm install`

3. session的存储
    session的存储使用了Redis              
    Windows操作系统下安装：         
    - 下载地址：https://github.com/dmajkic/redis/downloads
    - 下载到的Redis支持32bit和64bit。根据自己实际情况选择，将64bit的内容cp到自定义盘符安装目录取名redis。 如 C:\reids
    打开一个cmd窗口 使用cd命令切换目录到 C:\redis 运行 redis-server.exe redis.conf 。
    如果想方便的话，可以把redis的路径加到系统的环境变量里，这样就省得再输路径了，后面的那个redis.conf可以省略，如果省略，会启用默认的。输入之后，会显示如下界面：        
    ![]('iamge/image1.png)


> 执行测试文件
> 
> ```
> node bin/www
> ```
> 
> 正常的话会有输出

## 目录结构

```bash

├─bin               // 自动生成的程序执行入口，里边只有一个www文件  
├─config            // 配置文件，现在只有数据库的配置
├─controller        // 控制器文件夹
├─docs              // 文档
├─node_modules      // 被gitignore了，使用时安装的包
├─public            // 公共资源，使用vue的话，还不不知道怎么使用这里的资源
│  ├─images         
│  ├─javascripts    
│  └─stylesheets    
├─routes            // 路由，负责解析url后的分发任务
└─views             // html模板文件，使用vue可能不需要

```

## Notes
