/* eslint-disable */
<template>
  <div>
    <div id="box1">
      <el-input v-model="movieId" placeholder="电影ID" style="width: 150px"></el-input>
      <el-button type="success" plain @click="play()">播放电影</el-button>
      <el-button type="danger" plain @click="clear()">取消播放</el-button>
    </div>
    <div id="box2">
      <video width="800px" height="500px" controls autoplay>
        <source :src="movie" type="video/mp4">
        您的浏览器不支持 video 标签。
      </video>
    </div>
    <div id="box3">
      <el-rate v-model="rating" :colors="colors"></el-rate>
      <el-input v-model="userId" placeholder="用户ID" style="width: 150px"></el-input>
      <el-button type="success" plain @click="rate()">确认评分</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Player',
  data () {
    return {
      movieId: null,
      movie: null,
      rating: null,
      userId: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  },
  methods: {
    play () {
      this.movie = require("@/assets/video/" + this.movieId + ".mp4")
    },
    clear () {
      this.movie = null
      this.movieId = null
      this.rating = null
      this.userId = null
    },
    rate () {
      axios.post('/player/rate', {"userId": this.userId, "movieId": this.movieId, "rating": this.rating})
      this.$message("评分成功")
      this.clear()
    }
  }
}
</script>

<style scoped>
#box1 {
  width: 40%;
  height: 100px;
  position: absolute;
  top: 12%;
  left: 15%;
}

#box2 {
  position: absolute;
  left: 30%;
  bottom: 10%;
}

#box3 {
  width: 40%;
  height: 100px;
  position: absolute;
  top: 10%;
  right: 5%;
}
</style>
