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
