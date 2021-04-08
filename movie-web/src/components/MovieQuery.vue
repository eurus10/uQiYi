/* eslint-disable */
<template>
  <div>
    <div id="box1">
      <el-input v-model="minAvgRating" placeholder="平均分≥" style="width: 150px"></el-input>
      <el-input v-model="minCount" placeholder="评分次数≥" style="width: 150px; padding-right: 20px"></el-input>
      <el-switch v-model="useCount" active-text="评分次数" inactive-text="平均分"></el-switch>
      <el-button type="primary" plain @click="query()" style="margin-left: 30px">查询结果</el-button>
      <el-button type="danger" plain @click="clear()">清除查询</el-button>
    </div>
    <div id="box2">
      <el-table stripe :data="movieList" v-loading="loading" height="550px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="电影ID" prop="movieId"></el-table-column>
        <el-table-column label="电影名" prop="title"></el-table-column>
        <el-table-column label="电影题材" prop="genres"></el-table-column>
        <el-table-column label="平均评分" prop="avgRating"></el-table-column>
        <el-table-column label="评分次数" prop="count"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MovieQuery',
  data () {
    return {
      minAvgRating: null,
      minCount: null,
      useCount: null,
      movieList: [],
      loading: false
    }
  },
  methods: {
    query () {
      if (this.loading) {
        this.$message('当前有查询正在进行，请稍后')
      } else {
        this.loading = true
        axios.post('/movie_query/query', {minAvgRating: this.minAvgRating, minCount: this.minCount, useCount: this.useCount}).then((res) => {
          if (res.data && this.loading) {
            this.movieList = res.data
            this.$message('查询成功')
          } else {
            this.$message('查询失败')
          }
          this.loading = false
        })
      }
    },
    clear () {
      this.minAvgRating = null
      this.minCount = null
      this.useCount = null
      this.movieList = []
      this.loading = false
    }
  }
}
</script>

<style scoped>
#adv {
  height: 20%;
  width: 79.62%;
  position: absolute;
  top: 7.3%;
  left: 20.38%;
}

#box1 {
  width: 70%;
  height: 100px;
  position: relative;
  top: 10%;
}
</style>
