// components/business/myCalendar/myCalendar.js
import {getSelectorQuery}  from '../../../utils/util.js'
const app = getApp()
let isLoadData = false  // 由于setData是异步的需要加个锁来控制
let itemWidth = 0 // 计算单个item的宽度
let nextMonth = 0 // 下个月份保存
let prevMonth = 0 // 上个月份保存
let nextYear = 0 // 下个年份保存
let prevYear = 0 // 上个年份保存
let curYear = new Date().getFullYear()
let curMonth = new Date().getMonth() + 1
if (curMonth < 10) {
  curMonth = `0${curMonth}`
}
let curDay = new Date().getDate()
let curDayTimeStamp = parseInt(new Date().getTime()/1000)
let firstWeek = 0
let toggleYear = curYear
let toggleMonth = curMonth
if (curDay < 10) {
  curDay = `0${curDay}`
}
Component({
  externalClasses: ['myCalendar', 'jidian'],
  /**
   * 组件的属性列表
   */
  properties: {
    setDateList: {
      type: Array,
      observer() {
        this.tagging()
      }
    },
    calendarType: {
      type: String,
      value: 'normal' // normal 标准日历 ， roll 横向滚动日历,  
    },
    switchable: { // 两种日历是否可切换
      type: Boolean
    },
    isClick: { // 是否可以点击日期
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollLeft: 0,
    curDate: `${curYear}年${curMonth}月${curDay}日`,
    weeks_ch: ['日', '一', '二', '三', '四', '五', '六'],
    choseDate: null,
    list: [],
    calendarBody: [],
    headYear: curYear,
    headMonth: curMonth,
    choseType: '',
    iphoneX: app.globalData.isIphoneX,
    choseOtherDate: false
  },
  attached () {
    nextMonth = 0 // 下个月份保存
    prevMonth = 0 // 上个月份保存
    nextYear = 0 // 下个年份保存
    prevYear = 0 // 上个年份保存
    let choseType = wx.getStorageSync('choseType')
    let list = this.getThisMonthDays(curYear, curMonth) 
    if (this.data.switchable || this.data.calendarType === 'roll') {
      this.setData({list, choseDate: this.data.curDate, choseType})
    } else {
      this.setData({choseDate: this.data.curDate, choseType})
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    scrollLeft() {
      let systemInfo = getApp().globalData.systemInfo
      itemWidth = 0.14285 * systemInfo.windowWidth
      let scrollLeft = 0
      for(let i = 0; i < this.data.list.length; i++) {
        if (this.data.list[i].date === this.data.curDate) {
          scrollLeft = itemWidth * (i - 3)
          this.setData({scrollLeft})
          return
        }
      }
    },
    toggle (e) {
      if (!this.data.isClick) return
      let { year, month, days } = e.currentTarget.dataset
      let choseDate = `${year}年${month}月${days}日`
      let timeStamp = new Date(`${year}/${month}/${days}`).getTime()/1000
      let choseOtherDate = true
      if (choseDate === this.data.curDate) {
        choseOtherDate = false
      }
      this.setData({choseDate, choseOtherDate})
      this.triggerEvent('resultEvent', {year, month, days, timeStamp})
    },
    backToday() {
      this.setData({choseDate: this.data.curDate, choseOtherDate: false}, function() {
        let timeStamp = curDayTimeStamp
        this.triggerEvent('resultEvent', {timeStamp})
        this.scrollLeft()
      })
    },
    changeType () {
      if (this.data.calendarType === 'roll') {
        let calendarBody = this.data.calendarBody
        if (calendarBody.length === 0) {
          calendarBody = this.getThisMonthDays(curYear, curMonth, 'seq', true)
          calendarBody.splice(0, 1)
        }
        this.setData({
          calendarType: 'normal',
          calendarBody
        })
        this.tagging()
      } else if (this.data.calendarType === 'normal') {
        this.setData({
          calendarType: 'roll'
        })
      }
      // 两个端的面试列表的日历展开需要重新计算高度 需要出发父级的一个方法
      this.triggerEvent('resultEvent')
    },
    // 下个月
    nextMonth () {
      if (this.data.calendarType === 'roll') {
        let month = parseInt(curMonth)
        if (!nextMonth) {
          nextMonth = month
        }
        if (!nextYear) {
          nextYear = curYear
        }
        nextMonth++
        if (nextMonth > 12) {
          nextMonth = 1
          nextYear++
        }
        let list = this.getThisMonthDays(nextYear, nextMonth, 'seq')
        this.setData({list})
      } else {
        toggleMonth++
        if (toggleMonth > 12) {
          toggleMonth = 1
          toggleYear++
        }
        let calendarBody = this.getThisMonthDays(toggleYear, toggleMonth, 'seq', true)
        this.setData({calendarBody, headYear: toggleYear, headMonth: toggleMonth})
      }
    },
    // 上个月
    prevMonth () {
      if (this.data.calendarType === 'roll') {
        let month = parseInt(curMonth)
        if (isLoadData) return
        isLoadData = true
        if (!prevMonth) {
          prevMonth = month
        }
        if (!prevYear) {
          prevYear = curYear
        }
        prevMonth--
        if (prevMonth === 0) {
          prevMonth = 12
          prevYear--
        }
        let scrollLeft = itemWidth * 28
        let list = this.getThisMonthDays(prevYear, prevMonth, 'ord')
        this.setData({list}, function() {
          setTimeout(() => {
            this.setData({scrollLeft})
            isLoadData = false
          }, 300)
        })
      } else {
        toggleMonth--
        if (toggleMonth === 0) {
          toggleMonth = 12
          toggleYear--
        }
        let calendarBody = this.getThisMonthDays(toggleYear, toggleMonth, 'ord', true)
        this.setData({calendarBody, headYear: toggleYear, headMonth: toggleMonth})
      }
    },
    // 获取当月共多少天
    getThisMonthDays (year, month, sort, onlyOne) {
      let dayNum = new Date(year, parseInt(month), 0).getDate()
      let firstDayWeek = this.getFirstDayOfWeek(year, parseInt(month))
      firstWeek = firstDayWeek
      let thisMonthlist = [{'month': month}]
      let list = this.data.list
      if (parseInt(month) < 10) {
        month = `0${parseInt(month)}`
      }
      for(let i = 1; i < dayNum + 1; i++) {
        let j = i
        if (j < 10) {
          j = `0${j}`
        }
        let obj = {
          year,
          month,
          day: i,
          days: j,
          date: `${year}年${month}月${j}日`
        }
        obj.week = this.data.weeks_ch[firstDayWeek]
        firstDayWeek++
        if (firstDayWeek > 6) {
          firstDayWeek = 0
        }
        thisMonthlist.push(obj)
      }
      if (!onlyOne) {
        if (sort === 'seq') {
          list = list.concat(thisMonthlist)
        } else {
          list = thisMonthlist.concat(list)
        }
        this.data.setDateList.map((item, index) => {
          list.map((obj, j) => {
            if (item.date === obj.date) {
              obj.haveView = true
              // 已过期的面试时间
              let curTime = `${curYear}/${curMonth}/${curDay}`
              let objTime = `${obj.year}/${obj.month}/${obj.days}`
              if (new Date(curTime).getTime() > new Date(objTime).getTime()) {
                obj.haveViewed = true
              }
              return
            }
          })
        })
        return list
      } else {
        this.data.setDateList.map((item, index) => {
          thisMonthlist.map((obj, j) => {
            if (item.date === obj.date) {
              obj.haveView = true
              // 已过期的面试时间
              let curTime = `${curYear}/${curMonth}/${curDay}`
              let objTime = `${obj.year}/${obj.month}/${obj.days}`
              if (new Date(curTime).getTime() > new Date(objTime).getTime()) {
                obj.haveViewed = true
              }
              return
            }
          })
        })
        return thisMonthlist
      }
    },
    // 获取当月第一天星期几
    getFirstDayOfWeek (year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },
    tagging() {
      let list = this.data.list
      let calendarBody = this.data.calendarBody
      this.data.setDateList.map((item, index) => {
        list.map((obj, j) => {
          if (item.date === obj.date) {
            obj.haveView = true
            // 已过期的面试时间
            let curTime = `${curYear}/${curMonth}/${curDay}`
            let objTime = `${obj.year}/${obj.month}/${obj.days}`
            if (new Date(curTime).getTime() > new Date(objTime).getTime()) {
              obj.haveViewed = true
            }
            return
          }
        })
        calendarBody.map((obj, j) => {
          if (item.date === obj.date) {
            obj.haveView = true
            // 已过期的面试时间
            let curTime = `${curYear}/${curMonth}/${curDay}`
            let objTime = `${obj.year}/${obj.month}/${obj.days}`
            if (new Date(curTime).getTime() > new Date(objTime).getTime()) {
              obj.haveViewed = true
            }
            return
          }
        })
      })
      this.setData({list, calendarBody})
    }
  }
})
