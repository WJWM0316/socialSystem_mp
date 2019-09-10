import * as echarts from '../../../ec-canvas/echarts.min.js'

let app = getApp()

let onInit = (canvas, width, height) => {

  let chart = echarts.init(canvas, null, {
    width,
    height
  })

  canvas.setChart(chart)
  console.log(this);return
  let option = {
    // title: {
    //   text: '近期趋势',
    //   left: 'left'
    // },
    color: [
      '#9C5EC7',
      '#FF7F4C'
    ],
    // legend: {
    //   data: [
    //     'A',
    //     'B'
    //   ],
    //   top: 15,
    //   left: 'left',
    //   // backgroundColor: 'yellow',
    //   z: 100
    // },
    grid: {
      containLabel: true,
      left: '0%',
      bottom: '0%',
      right: '4%',
      top: '4%'
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
      data: this.data.key,
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
        data: value[0]
      },
      {
        name: 'B',
        type: 'line',
        smooth: true,
        data: value[1]
      }
    ]
  }

  chart.setOption(option)
  return chart
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: String,
      value: '375rpx'
    },
    key: {
      type: Array,
      default: []
    },
    value: {
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      onInit: onInit
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
