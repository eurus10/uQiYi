# movie
uQiYi --基于Flink的电影数据实时统计平台

项目前后端分离，前端项目为`movie-web`，后端项目为`movie`

* `movie-web`：包含完整的`Vue 2`项目，在目录下使用`npm run dev`可直接运行

* `movie`：集成了`Maven`,`Spring Boot`,`Flink`,`JDBC`,`Kafka`等技术的后端。包含三个入口类：

  * `MovieApplication.java`：启动`Spring Boot`程序，实现如下功能
  
    * 前端进行交互
  
    * 从`MySQL`查询数据
  
    * 将数据发送到`Kafka`
  
  * `ServerApplication.java`：`Flink`计算程序，用于从`Kafka`读取数据进行流计算，并将各项计算结果存储到`MySQL`中
 
  * `DataSimulator.java`：评分数据模拟程序，可以完成两种任务：
  
    * `init`：初始化数据库
  
    * `produce`：模拟用户的评分行为，不断地产生大量的评分数据并发送到`Kafka`

项目UI：

* 前台观影：

  * 电影首页：猜你喜欢（推荐系统）、最近热播（流计算）

  * 播放电影：播放电影（HTML video）、电影评分（Kafka）

* 数据查询：

  * 电影筛选（JDBC、MySQL）
 
  * 评分细查（JDBC、MySQL）
 
  * 可视化数据（流计算、JDBC、MySQL）

* 用户中心

  * 用户信息

由于时间原因，上述UI中的推荐系统和用户中心尚未实现，"猜你喜欢"目前使用的是随机伪推荐，用户中心页面则尚未构建。

另外，播放电影使用的是HTML原生的video标签，性能较差，并且尚未实现后端的连接查询
