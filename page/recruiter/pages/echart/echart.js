import * as echarts from '../../../../ec-canvas/echarts.min.js'

let app = getApp()

let initChart = (canvas, width, height) => {

  let chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })

  canvas.setChart(chart)

  let option = {
    // title: {
    //   text: '近期趋势',
    //   left: 'left'
    // },
    color: [
      '#9C5EC7',
      '#FF7F4C'
    ],
    legend: {
      data: [
        'A',
        'B'
      ],
      top: 15,
      left: 'left',
      // backgroundColor: 'yellow',
      z: 100
    },
    grid: {
      containLabel: true,
      left: '0%',
      bottom: '20%'
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid',
          color: '#E8E9EB'
        }
      },
      data: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
        '周日'
      ],
      show: true,
      nameLocation: 'start',
      // 坐标轴的颜色
      axisLine: {
        lineStyle: {
          type: 'solid',
          color: '#8452A7',
          width: 1
        }
      },
      //坐标值得具体的颜色
      axisLabel: {
        textStyle: {
          color: '#8452A7'
        }
      },
      // 不现实刻度尺
      axisTick: {
        show: false
      }
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        show: false,
        lineStyle: {
          type: 'solid'
        }
      },
      show: true,
      // 坐标轴的颜色
      axisLine: {
        lineStyle: {
          type: 'solid',
          color: '#E8E9EB',
          width: 1
        }
      },
      // 坐标值得具体的颜色
      axisLabel: {
        textStyle: {
          color: '#5C565D'
        }
      },
      // 不现实刻度尺
      axisTick: {
        show: false
      }
    },
    series: [
      {
        name: 'A',
        type: 'line',
        smooth: true,
        data: [18, 36, 65, 30, 78, 40, 33]
      },
      {
        name: 'B',
        type: 'line',
        smooth: true,
        data: [12, 50, 51, 35, 70, 30, 20]
      }
    ]
  }

  chart.setOption(option)
  return chart
}

Page({
  data: {
    navH: app.globalData.navHeight,
    ec: {
      onInit: initChart
    }
  }
})