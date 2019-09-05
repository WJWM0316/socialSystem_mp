import * as echarts from '../../../../ec-canvas/echarts'

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
      nameLocation: 'start'
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      show: true
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