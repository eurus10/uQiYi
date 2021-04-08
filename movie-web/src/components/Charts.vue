/* eslint-disable */
<template>
  <div>
    <el-tabs v-model="active" type="border-card" @tab-click="handleClick" style="height: 700px">
      <el-tab-pane label="信息概览" name="A" style="height: 630px; width: 1070px;">
        <div id="chart1"></div>
        <div id="chart2"></div>
        <div id="chart3"></div>
        <div id="chart4"></div>
      </el-tab-pane>
      <el-tab-pane label="电影数据" name="B" style="height: 630px; width: 1070px;">
        <div id="chart5"></div>
        <div id="chart6"></div>
        <div id="chart7"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import * as echarts from 'echarts'
export default {
  name: 'Charts',
  data () {
    return {
      timer: null,
      active: "A",
      chart1x: [],
      chart1y: [],
      chart2data: [],
      chart3x: [],
      chart3y: [],
      chart4x: [],
      chart4y: [],
      chart5x: [],
      chart5y: [],
      chart6x: [],
      chart6y: [],
      chart7data: []
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    init () {
      this.timer = setInterval(() => {
        axios.post('/charts/query').then((res) => {
          if (res.data) {
            this.chart1x = res.data.chart1.x
            this.chart1y = res.data.chart1.y
            this.chart2data = res.data.chart2.data
            this.chart3x = res.data.chart3.x
            this.chart3y = res.data.chart3.y
            this.chart4x = res.data.chart4.x
            this.chart4y = res.data.chart4.y
            this.chart5x = res.data.chart5.x
            this.chart5y = res.data.chart5.y
            this.chart6x = res.data.chart6.x
            this.chart6y = res.data.chart6.y
            this.chart7data = res.data.chart7.data
            this.drawLine()
          } else {
            this.$message("查询数据失败")
          }
        })
      }, 1000)
    },
    drawLine () {
      var chart1 = echarts.init(document.getElementById('chart1'))
      chart1.setOption({
        title: {text: '评分分布'},
        color: ['#67C23A'],
        tooltip: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chart1x
        },
        yAxis: {},
        series: [{
          name: '电影评分',
          type: 'bar',
          data: this.chart1y
        }]
      })
      var chart2 = echarts.init(document.getElementById('chart2'))
      chart2.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [{
          name: '评分分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.chart2data
        }]
      })
      var chart3 = echarts.init(document.getElementById('chart3'))
      chart3.setOption({
        title: {text: '每 10s 平台电影评分次数'},
        color: ['#67C23A'],
        tooltip: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chart3x
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '评分次数',
          type: 'line',
          data: this.chart3y,
          smooth: true
        }]
      })
      var chart4 = echarts.init(document.getElementById('chart4'))
      chart4.setOption({
        title: {text: '平台电影评分总次数'},
        color: ['#67C23A'],
        tooltip: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chart4x
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '评分次数',
          type: 'line',
          data: this.chart4y,
          smooth: true
        }]
      })
      var chart5 = echarts.init(document.getElementById('chart5'))
      chart5.setOption({
        title: {text: '电影评分 Top5'},
        color: ['#67C23A'],
        tooltip: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chart5x
        },
        yAxis: {},
        series: [{
          name: '电影评分',
          type: 'bar',
          data: this.chart5y
        }]
      })
      var chart6 = echarts.init(document.getElementById('chart6'))
      chart6.setOption({
        title: {text: '评分次数 Top5'},
        color: ['#67C23A'],
        tooltip: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chart6x
        },
        yAxis: {},
        series: [{
          name: '电影评分',
          type: 'bar',
          data: this.chart6y
        }]
      })
      var chart7 = echarts.init(document.getElementById('chart7'))
      chart7.setOption({
        legend: {
          top: 'bottom'
        },
        tooltip: {},
        series: [{
          name: '评分次数',
          type: 'pie',
          radius: [50, 250],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: this.chart7data
        }]
      })
    }
  }
}
</script>

<style scoped>
#chart1 {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 20px;
  left: 40px;
}

#chart2 {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 340px;
  left: 40px;
}

#chart3 {
  width: 600px;
  height: 300px;
  position: absolute;
  top: 20px;
  left: 380px;
}

#chart4 {
  width: 600px;
  height: 300px;
  position: absolute;
  top: 340px;
  left: 380px;
}

#chart5 {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 20px;
  left: 40px;
}

#chart6 {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 340px;
  left: 40px;
}

#chart7 {
  width: 650px;
  height: 600px;
  position: absolute;
  top: 20px;
  left: 400px;
}
</style>