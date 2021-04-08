/* eslint-disable */
<template>
  <div>
    <div id="box1">
      <el-input v-model="movieId" placeholder="电影ID" @change="searchRating()" style="width: 150px" clearable></el-input>
      <el-input v-model="avgRating" placeholder="平均评分" style="width: 150px" label="平均分" readonly="true"></el-input>
      <el-button type="danger" plain @click="clear()">清除数据</el-button>
    </div>
    <div id="box2">
      <el-table stripe :data="ratingList" v-loading="loading" height="550px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="电影ID" prop="movieId"></el-table-column>
        <el-table-column label="电影名" prop="title"></el-table-column>
        <el-table-column label="用户ID" prop="userId"></el-table-column>
        <el-table-column label="用户评分" prop="rating"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'RatingQuery',
  data () {
    return {
      movieId: null,
      avgRating: null,
      ratingList: [],
      loading: false
    }
  },
  methods: {
    searchRating () {
      if (this.movieId) {
        if (this.loading) {
          this.$message('当前有查询正在进行，请稍后')
        } else {
          this.loading = true
          axios.post('/rating_query/query', {movieId: this.movieId}).then((res) => {
            if (res.data && this.loading) {
              this.ratingList = res.data
              var sum = 0
              var count = 0
              for (var i in this.ratingList) {
                sum += this.ratingList[i].rating
                count += 1
              }
              this.avgRating = (sum / count).toFixed(2)
              this.$message('查询成功')
            } else {
              this.$message('查询失败')
            }
            this.loading = false
          })
        }
      }
    },
    clear () {
      this.movieId = null
      this.avgRating = null
      this.ratingList = []
      this.loading = false
    }
  }
}
</script>

<style scoped>
#box1 {
  width: 40%;
  height: 100px;
  position: relative;
  top: 10%;
}
</style>
