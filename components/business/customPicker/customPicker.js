import {getAreaListApi} from '../../../api/pages/label.js'
let lock = false,
    pickerResult = {}, // 返回去的数据
    year = []
const curYear = new Date().getFullYear()
const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openPicker: {
      type: Boolean,
      value: false
    },
    pickerType: { // 组件内部数据展示
      type: Object,
      value: []
    },
    activeIndex: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal) {
        if (newVal < 0) return
        this.init()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pickerData: [] // picker数据
  },
  attached () {
    pickerResult = {}
    for (let i = 0; i < 65; i++) {
      year.push(curYear - i)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init () {
      let item = this.data.pickerType[this.data.activeIndex],
          index = this.data.activeIndex,
          pickerType = this.data.pickerType,
          pickerData = this.data.pickerData
      switch (item.type) {
        case 'region':
          this.getRegionData().then(res => {
            var result = []
            var list = res.data
            if (item.value) {
              for (var i = 0; i < list.length; i++) {
                if (list[i].areaId === item.pid) {
                  for (var j = 0; j < list[i].children.length; j++) {
                    if (list[i].children[j].title === item.value) {
                      result = [i, j]
                      break
                    }
                  }
                }
              }
            } else {
              result = [0, 0]
            }
            pickerData[index] = [list, list[result[0]].children]
            item.result = result
            item.created = true
            this.setData({pickerData, pickerType}, () => {
              if (this.data.activeIndex !== index) return 
              pickerResult['region'] = {
                pidIndex: result[0],
                index: result[1],
                pid: list[result[0]].children[result[1]].pid,
                key: list[result[0]].children[result[1]].title,
                value: list[result[0]].children[result[1]].areaId
              }
            })
          })
          break
        case 'birthday':
          var birthYear = [],
              result = [],
              getCurYear = new Date().getFullYear()
          for (let i = getCurYear - 15; i > getCurYear - 65; i--) {
            birthYear.push(`${i}`)
          }
          pickerData[index] = [birthYear, month]
          if (item.value) {
            result[0] = birthYear.indexOf(`${item.value.slice(0, 4)}`)
            result[1] = month.indexOf(item.value.slice(5, 8))
            if (result[0] === -1) result[0] = 0
            if (result[1] === -1) result[1] = 0
          } else {
            result = [0, 0]
          }
          item.result = result
          item.created = true
          item.unit = 'all'
          this.setData({pickerData, pickerType}, () => {
            if (this.data.activeIndex !== index) return 
            pickerResult['birthday'] = {
              pidIndex: result[0],
              index: result[1],
              key: `${birthYear[result[0]]}-${month[result[1]]}`,
              value: new Date(`${birthYear[result[0]]}-${month[result[1]]}`).getTime() / 1000
            }
          })
          break
        case 'workTime':
          var result = [],
              workTimeYear = [],
              key = '',
              timeStamp = 0
          workTimeYear = workTimeYear.concat(year)
          workTimeYear.unshift('暂无工作经历')
          if (item.value) {
            result[0] = workTimeYear.indexOf(`${item.value.slice(0, 4)}`)
            result[1] = month.indexOf(item.value.slice(5, 8))
            if (result[0] === -1) result[0] = 0
            if (result[1] === -1) result[1] = 0
          } else {
            result = [0, 0]
          }
          if (result[0] === 0) {
            pickerData[index] = [workTimeYear, ['暂无工作经历']]
            key = '暂无工作经历'
            timeStamp = 0
          } else {
            pickerData[index] = [workTimeYear, month]
            key = `${birthYear[result[0]]}-${pickerData[index][1][result[1]]}`
            timeStamp = new Date(`${birthYear[result[0]]}-${pickerData[index][1][result[1]]}`).getTime() / 1000
          }
          item.result = result
          item.created = true
          item.unit = 'first'
          this.setData({pickerData, pickerType}, () => {
            if (this.data.activeIndex !== index) return 
            pickerResult['workTime'] = {
              pidIndex: result[0],
              index: result[1],
              key: key,
              value: timeStamp
            }
          })
          break
      }
    },
    getRegionData () {
      return getAreaListApi()
    },
    bindChange (e) {
      let value = e.detail.value,
          pickerType = this.data.pickerType,
          pickerData = this.data.pickerData
      switch (pickerType[this.data.activeIndex].type) {
        case 'region':
          var children = pickerData[this.data.activeIndex][0][value[0]].children
          pickerData[this.data.activeIndex][1] = children
          this.setData({pickerData})
          if (value[1] > children.length - 1) value[1] = 0 // 防止第二项数据不够报错，所以定位到第一个
          pickerResult['region'] = {
            pidIndex: value[0],
            index: value[1],
            key: children[value[1]].title,
            value: children[value[1]].areaId
          }
          pickerType.forEach((item, index) => {
            if (item.type === 'region') {
              item.value = children[value[1]].title
              item.result = value
              item.pid = children[value[1]].pid
              return
            }
          })
          break
        case 'birthday':
          var timeStamp = 0,
              children = month
          pickerResult['birthday'] = {
            pidIndex: value[0],
            index: value[1],
            key: `${pickerData[this.data.activeIndex][0][value[0]]}-${children[value[1]]}`,
            value: new Date(`${pickerData[this.data.activeIndex][0][value[0]]}-${children[value[1]]}`).getTime() / 1000
          }
          pickerType.forEach((item, index) => {
            if (item.type === 'birthday') {
              item.value = `${pickerData[this.data.activeIndex][0][value[0]]}-${children[value[1]]}`
              item.result = value
              return
            }
          })
          break
        case 'workTime':
          var children = [],
              timeStamp = 0,
              key = ''
          if (value[0] === 0) {
            children = ['暂无工作经历']
            pickerData[this.data.activeIndex][1] = children
            timeStamp = 0
            key = '暂无工作经历'
            this.setData({pickerData})
          } else {
            if (value[1] < 0) value[1] = 0
            if (children = ['暂无工作经历']) {
              children = month
              pickerData[this.data.activeIndex][1] = month
              this.setData({pickerData})
            }
            key = `${pickerData[this.data.activeIndex][0][value[0]]}-${children[value[1]]}`
            timeStamp = new Date(`${pickerData[this.data.activeIndex][0][value[0]]}-${children[value[1]]}`).getTime() / 1000
          }
          pickerResult['workTime'] = {
            pidIndex: value[0],
            index: value[1],
            key: key,
            value: timeStamp
          }
          pickerType.forEach((item, index) => {
            if (item.type === 'workTime') {
              item.value = key
              item.result = value
              return
            }
          })
      }
      this.setData({pickerType})
    },
    bindpickstart () {
      if (!lock) lock = true
    },
    bindpickend (e) {
      if (lock) lock = false
    },
    toggle (e) {
      let activeIndex = e.currentTarget.dataset.index
      this.setData({activeIndex})
    },
    closePicker (e) {
      if (lock) return
      if (e.currentTarget.dataset.type === 'button') {
        let pickerType = this.data.pickerType,
            index = this.data.activeIndex
        switch (pickerType[index].type) {
          case 'region':
            pickerType[index].value = pickerResult['region'].key
            break
          case 'birthday':
            pickerType[index].value = pickerResult['birthday'].key
            break
          case 'workTime':
            pickerType[index].value = pickerResult['workTime'].key
            break
        }
        this.setData({pickerType}, () => {
          pickerResult['pickerType'] = this.data.pickerType
          this.triggerEvent('pickerResult', pickerResult)
          let lastOne = () => {
            index++
            if (index > this.data.pickerType.length - 1) index = 0
            if (!pickerType[index].value) {
              this.setData({activeIndex: index})
            } else {
              if (index === this.data.activeIndex) {
                this.setData({openPicker: false})
              } else {
                lastOne()
              }
            }
          }
          lastOne()
        })
      } else {
        this.setData({
          openPicker: false
        })
      }
    }
  }
})
