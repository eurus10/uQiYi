# movie
uQiYi --基于Flink的电影数据实时统计平台

项目前后端分离，前端项目为`movie-web`，后端项目为`movie`

* `movie-web`：包含完整的`Vue 2`项目，在目录下使用`npm run dev`可直接运行

* `movie`：集成了`Maven`,`Spring Boot`,`Flink`,`JDBC`,`Kafka`等技术的后端。包含三个入口类：

  * `MovieApplication.java`：启动`Spring Boot`程序，用于
