import * as echarts from '../../../ec-canvas/echarts.min.js'

let app = getApp()

let chartLine = null
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: String,
      value: '375rpx'
    },
    infos: {
      type: Object,
      value: {}
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    echart: {
      onInit(canvas, width, height) {
        chartLine = echarts.init(canvas, null, {width: width, height: height})
        canvas.setChart(chartLine)
      }
    },
    options: {
      title: {
        text: '近期趋势',
        left: 'left'
      },
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
        data: [],
        // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
      series: []
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      this.setOptions(this.data.infos.key, this.data.infos.value)
      if(chartLine) chartLine.setOption(this.data.options)
    },
    setOptions(key, value) {
      this.data.options.series = []
      this.data.options.xAxis.data = key
      value.map(field => {
        this.data.options.series.push({
          // name: 'A',
          type: 'line',
          smooth: true,
          data: field
        })
      })
    }
  }
})
