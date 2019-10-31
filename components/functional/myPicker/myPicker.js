// components/layout/myPicker/myPicker.js
import {getJobLabelApi} from '../../../api/pages/common.js'
import {getAreaListApi} from '../../../api/pages/label.js'
import {getFinancingApi, getEmployeesApi, getDegreeApi, getJobstatusApi, getExperienceApi} from '../../../api/pages/picker.js'
let curDate = new Date().getTime()
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    pickerType: {
      type: String,
      value: ''
    },
    needWatch: {
      type: Boolean,
      value: false
    },
    setResult: {
      type: String,
      observer: function(newVal, oldVal) {
        if (this.data.needWatch) this.init()
      }
    },
    rangeKey: {
      type: String,
      value: null
    },
    needSlot: {
      type: Boolean,
      value: false
    },
    isTriangle: {
      type: Boolean,
      value: false
    },
    styleObj: {
      type: String,
      value: ''
    },
    placeholderTxt: {
      type: String,
      value: ''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    result: 0, // picker选择value
    list: [], // picker列表
    mode: '', // picker mode
    firstOption: '', // 自定义选型
    placeholder: '', // placeholder
    provice: '', // 省份
    financing: [],
    staffMembers: [],
    experience: [],
    jobStatus: [],
    education: [],
    sex: [{name: '男', value: 1}, {name:'女', value: 2}],
    dateType: ['startTime', 'endTime', 'workTime', 'dateTime', 'birthday'],
    year: [],
    month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    days: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
    hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
    minutes: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
  },
  ready: function () {
    this.init()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init () {
      let list = []
      let result = 0
      let firstOption = 0
      let curYear = new Date().getFullYear()
      let curMonth = new Date().getMonth() + 1
      let year = []
      if (this.data.dateType.indexOf(this.data.pickerType) !== -1) {
        for (let i = 0; i < 65; i++) {
          year.push(`${curYear}`)
          curYear--
        }
      }
      const setResult = () => {
        result = []
        if (this.data.setResult === '至今' || this.data.setResult === '暂无工作经历') {
          result = [0, 0]
        } else {
          result[0] = year.indexOf(this.data.setResult.slice(0, 4))
          result[1] = this.data.month.indexOf(this.data.setResult.slice(5, 8))
        }
        if (result[0] === -1) { // 开启palceholder
          result = 0
        }
        return result
      }
      switch (this.data.pickerType) {
        case 'birthday':
          year = []
          curYear = new Date().getFullYear()
          for (let i = curYear - 15; i > curYear - 65; i--) {
            year.push(`${i}`)
          }
          list.push(year)
          list.push(this.data.month)
          result = setResult()
          this.setData({list, year, result, mode: 'multiSelector', placeholder: this.data.placeholderTxt || '选择你的出生年月'})
          break
        case 'startTime':
          list.push(year)
          list.push(this.data.month)
          result = setResult()
          this.setData({list, year, result, mode: 'multiSelector', placeholder: this.data.placeholderTxt || '开始时间'})
          break
        case 'endTime':
          firstOption = '至今'
          year.unshift(firstOption)
          list.push(year)
          result = setResult()
          if (result !== 0) {
            list.push(this.data.month)
          } else {
            list.push([firstOption])
          }
          this.setData({list, year, result, mode: 'multiSelector', firstOption, placeholder: this.data.placeholderTxt || '结束时间'})
          break
        case 'workTime':
          firstOption = '暂无工作经历'
          year.unshift(firstOption)
          list.push(year)
          result = setResult()
          if (result !== 0) {
            list.push(this.data.month)
          } else {
            list.push([firstOption])
          }
          this.setData({list, year, result, mode: 'multiSelector', firstOption, placeholder: this.data.placeholderTxt || '选择参加工作时间'})
          break
        case 'dateTime':
          if (!this.data.setResult) {
            let setResult = parseInt(curDate / 1000)
            this.setData({setResult: this.dateFormat(setResult, 'YYYY-MM-DD hh:mm')})
          }
          result = []
          result[0] = year.indexOf(this.data.setResult.slice(0, 4))
          result[1] = this.data.month.indexOf(this.data.setResult.slice(5, 7))
          if (result[0] === -1) result[0] = 0
          if (result[1] === -1) result[1] = 0
          let days = this.getThisMonthDays(parseInt(year[result[0]]), parseInt(this.data.month[result[1]]))
          result[2] = days.indexOf(this.data.setResult.slice(8, 10))
          result[3] = this.data.hours.indexOf(this.data.setResult.slice(11, 13))
          result[4] = this.data.minutes.indexOf(this.data.setResult.slice(14, 16))
          if (result[2] === -1) result = 0 // 开启palceholder
          list.push(year, this.data.month, days, this.data.hours, this.data.minutes)
          this.setData({list, year, days, result, mode: 'multiSelector', placeholder: this.data.placeholderTxt || '请选择面试时间'})
          break
        case 'education':
          getDegreeApi().then(res => {
            list = res.data
            result = 0 
            list.map((item, index) => {
              if (item.text === this.data.setResult) {
                result = `${index}`
                return
              }
            })
            this.setData({list, result, mode: 'selector', placeholder: this.data.placeholderTxt || '选择学历'})
          })
          break
        case 'sex':
          list = this.data.sex
          result = `${list.indexOf(this.data.setResult)}`
          if (result === `-1`) { result = 0 }
          this.setData({list, result, mode: 'selector', placeholder: this.data.placeholderTxt || '请选择性别'})
          break
        case 'jobStatus':
          getJobstatusApi().then(res => {
            list = res.data
            result = 0 
            list.map((item, index) => {
              if (item.text === this.data.setResult) {
                result = `${index}`
                return
              }
            })
            this.setData({list, result, mode: 'selector', placeholder: this.data.placeholderTxt || '请选择求职状态'})
          })
          break
        case 'experience':
          getExperienceApi().then(res => {
            list = res.data
            result = 0 
            list.map((item, index) => {
              if (item.text === this.data.setResult) {
                result = `${index}`
                return
              }
            })
            this.setData({list, result, mode: 'selector', placeholder: this.data.placeholderTxt || '请选择经验要求'})
          })
          break
        case 'staffMembers':
          getEmployeesApi().then(res => {
            list = res.data
            result = 0
            list.map((item, index) => {
              if (item.text === this.data.setResult) {
                result = `${index}`
                return
              }
            })
            this.setData({list, result, mode: 'selector', placeholder: this.data.placeholderTxt || '请选择人员规模'})
          })
          break
        case 'financing':
          getFinancingApi().then(res => {
            list = res.data
            result = 0
            list.map((item, index) => {
              if (item.text === this.data.setResult) {
                result = `${index}`
                return
              }
            })
            this.setData({list, result, mode: 'selector', placeholder: this.data.placeholderTxt || '请选择融资情况'})
          })
          
          break
        case 'salaryRangeC':
          let startNum = []
          let endNum = []
          for (let i = 1; i <= 60; i++) {
            startNum.push(i * 1000)
          }
          result = []
          result[0] = startNum.indexOf(parseInt(this.data.setResult.split('~')[0]))
          if (result[0] === -1) result[0] = 0
          for (let i = parseInt(startNum[result[0]]) + 1000; i <= parseInt(startNum[result[0]]) * 2; i+=1000) {
            endNum.push(i)
          }
          result[1] = endNum.indexOf(parseInt(this.data.setResult.split('~')[1]))
          if (result[1] === -1) result = 0
          list = [startNum, endNum]
          this.setData({list, result, mode: 'multiSelector', placeholder: this.data.placeholderTxt || '请选择期望薪资'})
          break
        case 'salaryRangeB':
          let startNumB = []
          let endNumB = []
          for (let i = 1; i <= 29; i++) {
            startNumB.push(i * 1000)
          }
          for (let i = 30; i <= 95; i+=5) {
            startNumB.push(i * 1000)
          }
          for (let i = 100; i <= 250; i+=10) {
            startNumB.push(i * 1000)
          }
          result = []
          result[0] = startNumB.indexOf(parseInt(this.data.setResult.split('~')[0]))
          if (result[0] === -1) result[0] = 0
          for (let i = parseInt(startNumB[result[0]]) + 1000; i <= 500000; i+=1000) {
            if (i <= 260 * 1000) {
              endNumB.push(i)
            }
          }
          result[1] = endNumB.indexOf(parseInt(this.data.setResult.split('~')[1]))
          if (result[1] === -1) result = 0
          list = [startNumB, endNumB]
          this.setData({list, result, mode: 'multiSelector', placeholder: this.data.placeholderTxt || '请选择期望薪资'})
          // console.log({list, result, mode: 'multiSelector', placeholder: this.data.placeholderTxt || '请选择期望薪资'})
          break
        case 'occupation':
          getJobLabelApi({type: 'skills'}).then(res => {
            list = res.data.labelProfessionalSkills
            let propsResult = null
            list.map((item, index) => {
              if (item.name === this.data.setResult) {
                result = `${index}`
                propsResult = item
              }
            })
            this.triggerEvent('resultevent', {propsResult})
            this.setData({list, result, mode: 'selector', placeholder: this.data.placeholderTxt || '请选择职业'})
          })
          break
        case 'region':
          let provice = []
          let getResult = this.data.setResult.split(' ')
          getAreaListApi().then(res => {
            provice = res.data
            provice.map((item, index) => {
              if (item.title === getResult[0]) {
                item.children.map((items, indexs) => {
                  if (items.title === getResult[1]) {
                    result = [index, indexs]
                    return
                  }
                  return
                })
              }
            })
            if (result) {
              list = [provice, provice[result[0]].children]
            } else {
              list = [provice, provice[0].children]
            }
            this.setData({list, result, provice, mode: 'multiSelector', placeholder: this.data.placeholderTxt || '请选择城市'})
          })
      }
    },
    // 封装返回给父组件的数据
    setResult() {
      let propsResult = ''
      let propsDesc = ''
      let list = this.data.list
      let result = this.data.result
      if (this.data.mode === 'multiSelector') {
        if (this.data.dateType.indexOf(this.data.pickerType) !== -1) {
          if (this.data.pickerType === 'dateTime') {
            propsDesc = `${list[0][result[0]]}-${list[1][result[1]]}-${list[2][result[2]]} ${list[3][result[3]]}:${list[4][result[4]]}`
            let changeDesc = `${list[0][result[0]]}/${list[1][result[1]]}/${list[2][result[2]]} ${list[3][result[3]]}:${list[4][result[4]]}`
            propsResult = new Date(changeDesc).getTime() / 1000
          } else {
            if ((this.data.pickerType === 'endTime' && this.data.result[0] === 0) || (this.data.pickerType === 'workTime' && this.data.result[0] === 0)) {
              propsResult = 0
              propsDesc = list[0][0]
            } else {
              propsDesc = `${list[0][result[0]]}-${list[1][result[1]]}`
              let changeDesc = `${list[0][result[0]]}/${list[1][result[1]]}/01`
              propsResult = new Date(changeDesc).getTime() / 1000
            }
          }
        } else if (this.data.pickerType === 'salaryRangeB' || this.data.pickerType === 'salaryRangeC') {
          propsResult = [list[0][result[0]] / 1000, list[1][result[1]] / 1000]
          propsDesc = `${list[0][result[0]]}~${list[1][result[1]]}元/月`
          console.log(propsResult, propsDesc)
        } else if (this.data.pickerType === 'region') {
          propsResult = [list[0][result[0].areaId], list[1][result[1]].areaId]
          propsDesc = [list[0][result[0].title], list[1][result[1]].title]
        }
      } else {
        if (this.data.pickerType === 'occupation') {
          propsResult = list[parseInt(result)]
        } else {
          propsResult = list[result].value
          propsDesc = list[result].name || list[result].text
        }
      }
      this.triggerEvent('resultevent', {propsResult, propsDesc})
    },
    // picker 变动监听
    change(e) {
      if (this.data.mode === 'multiSelector') {
        e.detail.value.map((item, index) => {
          if (item === null) {
            e.detail.value[index] = 0
          }
        })
      }
      this.setData({result: e.detail.value})
      this.setResult()
    },
    // picker 某一项数据滚动监听
    changeColumn(e) {
      if (this.data.mode !== 'multiSelector') return
      let list = []
      const changeData = (year, month) => {
        list = this.data.list
        list[2] = this.getThisMonthDays(parseInt(year), parseInt(month))
        this.setData({list})
      }
      if (this.data.pickerType === 'dateTime') {
        let result = this.data.result
        if (this.data.result === 0) {
          result = [0, 0, 0, 0, 0]
        }
        let year = this.data.year[result[0]]
        let month = this.data.month[result[1]]
        if (e.detail.column === 0) { // 选择年份
          year = this.data.year[e.detail.value]
          changeData(year, month)
        } else if (e.detail.column === 1) { // 选择月份
          month = this.data.month[e.detail.value]
          changeData(year, month)
        }
      } else {
        // 有自定义选型的
        if (this.data.firstOption) {
          list.push(this.data.year)
          // 滑动第一项的时候
          if (e.detail.column === 0) {
            if (e.detail.value === 0) {
              list.push([this.data.firstOption])
            } else {
              list.push(this.data.month)
            }
            this.setData({list})
          }
        }
        if (this.data.pickerType === 'salaryRangeC') {
          if (e.detail.column === 0) { // 选择起始工资
            list = this.data.list
            let startNum = list[0][e.detail.value]
            let endNum = []
            for (let i = parseInt(startNum) + 1000; i <= parseInt(startNum) * 2; i+=1000) {
              endNum.push(i)
            }
            list[1] = endNum
            this.setData({list})
          }
        }
        if (this.data.pickerType === 'salaryRangeB') {
          if (e.detail.column === 0) { // 选择起始工资
            list = this.data.list
            let startNum = parseInt(list[0][e.detail.value])
            let endNum = []
            if (startNum >= 1 * 1000 && startNum <= 10 * 1000) {
              for (let i = startNum + 1 * 1000; i <= startNum + 5 * 1000; i+=1000) {
                endNum.push(i)
              }
            } else if (startNum >= 11 * 1000 && startNum <= 30 * 1000) {
              for (let i = startNum + 1 * 1000; i <= 2*startNum; i+=1000) {
                endNum.push(i)
              }
            } else if (startNum >= 35 * 1000 && startNum <= 70 * 1000) {
              for (let i = startNum + 1 * 1000; i <= startNum + 30 * 1000; i+=1000) {
                endNum.push(i)
              }
            } else if (startNum >= 75 * 1000 && startNum <= 95 * 1000) {
              for (let i = startNum + 1 * 1000; i <= startNum + 30 * 1000; i+=1000) {
                endNum.push(i)
              }
            } else if (startNum >= 100 * 1000 && startNum <= 250 * 1000) {
              for (let i = startNum + 1 * 1000; i <= 2*startNum; i+=1000) {
                endNum.push(i)
              }
            }
            list[1] = endNum
            this.setData({list})
          }
        }
        if (this.data.pickerType === 'region') {
          if (e.detail.column === 0) { // 选择省份
            list = [this.data.provice, this.data.provice[e.detail.value].children]
            this.setData({list})
          }
        }
      }
    },
    // 获取某某的天数
    getThisMonthDays(year, month) {
      let dayNum = new Date(year, month, 0).getDate()
      let days = []
      for (let i = 1; i < dayNum + 1; i++) {
        if (i < 10) {
          days.push(`0${i}`)
        } else {
          days.push(`${i}`)
        }
      }
      return days
    },
    dateFormat(timestamp, format) {
      var date = new Date(timestamp * 1000)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      var hour = function() {
        if(date.getHours() < 10) {
          return '0' + date.getHours()
        }
        return date.getHours()
      }

      var minute = function() {
        if(date.getMinutes() < 10) {
          return '0' + date.getMinutes()
        }
        return date.getMinutes()
      }

      var second = function() {
        if(date.getSeconds() < 10) {
          return '0' + date.getSeconds()
        }
        return date.getSeconds()
      }
      switch(format) {
        case 'YYYY-MM-DD':
        return year + '-' + month + '-' + day
        case 'YYYY-MM-DD hh:mm':
        return year + '-' + month + '-' + day + ' ' + hour() + ':' + minute()
        case 'yyyy-mm-dd hh:mm':
        return year + '年' + month + '月' + day + '日' + ' ' + hour() + ':' + minute()
        case 'MM-DD':
        return month + '-' + day
        case 'YYYY.MM':
        return year + '.' + month
        case 'YM':
        return year+'年'+month+'月'
      }
    }
  }
})
