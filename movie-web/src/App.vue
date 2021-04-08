<template>
  <div id="app">
    <el-header id="header" height="60px">
      <div id="title">
        <span id="big-title">uQiYi</span>
        <span id="small-title">v1.0.1</span>
      </div>
      <div id="userinfo">
        <span id="user-name">Hello, Chiak1</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="20%">
        <el-menu default-active="1">
          <el-submenu index="1">
            <template slot="title">前台观影</template>
            <el-menu-item index="movie" @click="goTo('/movie')">电影首页</el-menu-item>
            <el-menu-item index="rating" @click="goTo('/player')">播放电影</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">数据查询</template>
            <el-menu-item index="movie_query" @click="goTo('/movie_query')">电影筛选</el-menu-item>
            <el-menu-item index="rating_query" @click="goTo('/rating_query')">评分细查</el-menu-item>
            <el-menu-item index="charts" @click="goTo('/charts')">可视化数据</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">用户中心</template>
            <el-menu-item index="userinfo">用户信息</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    goTo (url) {
      this.$router.replace(url)
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#header {
  height: 10%;
  background-color: #67C23A;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
}

#title {
  position: absolute;
  top: 10px;
  left: 50px;
}

#big-title {
  font-size: 30px;
  color: white;
}

#small-title {
  padding-left: 10px;
  font-size: 14px;
  color: white;
}

#userinfo {
  position: absolute;
  top: 18px;
  right: 50px;
}

#user-name {
  font-size: 20px;
  color: white;
}

span {
  font-size: 14px;
}
</style>
