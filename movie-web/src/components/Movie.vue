/* eslint-disable */
<template>
  <div>
    <div class="block">
      <span style="color: green; font-size: 20px; font-weight: bold">猜你喜欢</span>
      <el-carousel :interval="3000" type="card" height="300px" style="padding-top: 10px">
        <el-carousel-item v-for="poster in this.posters" :key="poster">
          <el-image :src="poster" fit="cover" style="width: 210px; height: 300px"></el-image>
        </el-carousel-item>
      </el-carousel>
      <el-table stripe :data="recommend" height="300px" style="width: 650px; position: absolute; left: 5%">
        <el-table-column label="电影ID" prop="movieId"></el-table-column>
        <el-table-column label="电影名" prop="title"></el-table-column>
        <el-table-column label="平均评分" prop="avgRating"></el-table-column>
      </el-table>
    </div>
    <div id="box2">
      <span style="color: green">最近热播 Hot（10s 更新一次）</span>
      <el-table stripe :data="hot" v-loading="loading" height="650px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="电影ID" prop="movieId"></el-table-column>
        <el-table-column label="电影名" prop="title"></el-table-column>
        <el-table-column label="播放次数" prop="count"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Movie',
  data () {
    return {
      timer: null,
      posters: [],
      // 示例数据
      movies: {
        1: {movieId: 1, title: "你的名字", avgRating: 4.82},
        2: {movieId: 2, title: "超凡蜘蛛侠", avgRating: 4.3},
        3: {movieId: 3, title: "毒液：致命守护者", avgRating: 4.44},
        4: {movieId: 4, title: "硬汉", avgRating: 3.98},
        5: {movieId: 5, title: "不明身份", avgRating: 3.99},
        6: {movieId: 6, title: "天下无贼", avgRating: 4.52},
        7: {movieId: 7, title: "蝙蝠侠：黑暗骑士", avgRating: 4.51},
        8: {movieId: 8, title: "釜山行", avgRating: 4.03},
        9: {movieId: 9, title: "寂静岭", avgRating: 3.87},
        10: {movieId: 10, title: "我是传奇", avgRating: 3.92},
        11: {movieId: 11, title: "泰坦尼克", avgRating: 4.91},
        12: {movieId: 12, title: "翻译疑云", avgRating: 3.69},
        13: {movieId: 13, title: "禁闭岛", avgRating: 4.61},
        14: {movieId: 14, title: "绣春刀", avgRating: 3.98}
      },
      recommend: [],
      hot: []
    }
  },
  created () {
    var posterNames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    for (var i = 0; i < 5; i++) {
      var id = parseInt(Math.random() * posterNames.length)
      this.posters.push(require("@/assets/" + posterNames[id] + ".jpeg"))
      this.recommend.push(this.movies[posterNames[id]])
      posterNames.splice(id, 1)
    }
    this.init()
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    init () {
      this.timer = setInterval(() => {
        axios.post('/movie/hot').then((res) => {
          if (res.data) {
            this.hot = res.data
          } else {
            this.$message("查询数据失败")
            this.hot = []
          }
        })
      }, 10000)
    }
  }
}
</script>

<style scoped>
.block {
  width: 50%;
  position: absolute;
  top: 10%;
  left: 20%
}

#box2 {
  width: 25%;
  position: absolute;
  top: 10%;
  left: 72%;
}
</style>