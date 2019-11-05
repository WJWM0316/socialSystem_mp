import * as echarts from '../ec-canvas/echarts.min.js'

let app = getApp()
let a="今日"
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
        return chartLine
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
        top: 15,
        left: 'left',
        backgroundColor: 'yellow',
        z: 100
      },
      grid: {
        containLabel: true,
        left: '0%',
        bottom: '0%',
        right: '8%',
        top: '4%'
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor:'#FBFBFF',
        color:'black',
        borderWidth:10,
        borderColor:'#dcdcdc',
        textStyle:{
          color:'#282828'
        },
        padding: 8,
        formatter(params) {
          return [
            Number(params[0].name.slice(0,2)) + '月' + Number(params[0].name.slice(-2)) + '日' + '\n',
            params[0].seriesName + ': ' + params[0].data + '次' + '\n',
            params[1].seriesName + ': ' + params[1].data + '人'
            // params[0].marker + params[0].seriesName + ': ' + params[0].data + '人' + '\n',
            // params[1].marker + params[1].seriesName + ': ' + params[1].data + '次'
          ].join(' ')
        },
        axisPointer: {
          show: false,
          lineStyle: {
            color: '#dcdcdc'
          }
        }
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: {readOnly: false},
          magicType: {type: ['line', 'bar']},
          restore: {},
          saveAsImage: {}
        }
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
      this.data.options.legend.data = ['访问次数', '访问人数']
      this.data.options.xAxis.data = key
      value.map((field, index) => {
        this.data.options.series.push({
          name: this.data.options.legend.data[index],
          type: 'line',
          smooth: true,
          data: field
        })
      })
    }
  }
})
