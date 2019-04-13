# Happy-spare-money-back-end

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

* 2019.4.13 4:23
    更新了数据库连接的内容，数据库的配置文件在 `config/database_config.js` 中，测试连接代码在 `controller/test_database_connect.js` 中，请查看

    > 过几天删了这个文件吧？感觉是没用的玩意