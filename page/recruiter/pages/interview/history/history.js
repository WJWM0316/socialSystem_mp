import {
  getNewHistoryApi,
  getPositionTypeListApi
} from '../../../../../api/pages/interview.js'

import {RECRUITER, APPLICANT, COMMON} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    hasReFresh: false,
    onBottomStatus: 0,
    tab: 'positionList',
    navH: app.globalData.navHeight,
    pageCount: 20,
    timeSelected: false,
    positionSelected: false,
    interviewList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      total: 0
    },
    timeModel: {
      show: false
    },
    positionModel: {
      show: false,
      value: ''
    },
    startTime: {
      date: '',
      active: false
    },
    endTime: {
      date: '',
      active: false
    },
    dateRange: {
      value: ''
    },
    typeList: [],
    dateList: [
      {
        id: 1,
        text: '全部',
        active: true
      },
      {
        id: 7,
        text: '近7天',
        active: false
      },
      {
        id: 15,
        text: '近15天',
        active: false
      },
      {
        id: 30,
        text: '近30天',
        active: false
      }
    ]
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   获取在线的职位类型
   * @return   {[type]}   [description]
   */
  getPositionTypeList() {
    getPositionTypeListApi({level: 3}).then(res => {
      let typeList = res.data
      typeList.map(field => field.active = false)
      let appendHeadder = [
        {
          id: 'all',
          name: '全部',
          active: true
        },
        {
          id: 'none',
          name: '无职位约面',
          active: false
        }
      ]
      typeList = appendHeadder.concat(typeList)
      this.setData({typeList})
    })
  },
  closeModal() {
    let timeModel = this.data.timeModel
    let positionModel = this.data.positionModel
    timeModel.show = false
    positionModel.show = false
    this.setData({timeModel, positionModel})
  },
  onTapTime(e) {
    let positionModel = this.data.positionModel
    let timeModel = this.data.timeModel
    timeModel.show = !timeModel.show
    if(timeModel.show) positionModel.show = false
    this.setData({positionModel, timeModel})
  },
  onTapPosition(e) {
    let positionModel = this.data.positionModel
    let timeModel = this.data.timeModel
    positionModel.show = !positionModel.show
    if(positionModel.show) timeModel.show = false
    this.setData({positionModel, timeModel})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-26
   * @detail   时间范围搜索
   * @return   {[type]}     [description]
   */
  changeSearch(e) {
    let dateList = this.data.dateList
    let params = e.currentTarget.dataset
    let interviewList = this.data.interviewList
    dateList.map(field => field.active = field.id === params.id ? true : false)
    this.setData({dateList}, () => {
      let startTime = this.data.startTime
      let endTime = this.data.endTime
      startTime.date = ''
      startTime.active = false
      endTime.date = ''
      endTime.active = false
      interviewList.pageNum = 1
      interviewList.list = []
      this.setData({startTime, endTime, interviewList}, () => this.getLists())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   赛选职位类型
   */
  selectType(e) {
    let params = e.currentTarget.dataset
    let typeList = this.data.typeList
    let item = typeList.find(field => params.id === field.id)

    if(params.id === 'all' || params.id === 'none') {
      typeList.map(field => {
        field.active = false
        if(field.id === params.id) field.active = !field.active
      })
    } else {
      typeList.map((field, index, arr) => {
        if(field.id === params.id) field.active = !field.active
        // 如果当前选中的id为数字 则 全部何无职位不能激活
        if(typeof field.id === 'number') {
          arr.map(field2 => {
            if(typeof field2.id === 'string') field2.active = false
          })
        }
      })
    }
    this.setData({typeList})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   重置职位赛选
   * @return   {[type]}   [description]
   */
  resetSelectType() {
    let typeList = this.data.typeList
    let positionModel = this.data.positionModel
    let interviewList = this.data.interviewList 
    typeList.map(field => field.active = false)
    positionModel.show = false
    interviewList.pageNum = 1
    interviewList.list = []
    positionModel.value = ''
    this.setData({typeList, positionModel, interviewList}, () => this.getLists())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   确认选中的职位类型
   * @return   {[type]}   [description]
   */
  confirmChoose() {
    let typeList = this.data.typeList
    let activeList = typeList.filter(field => field.active)
    let positionModel = this.data.positionModel
    let labelArray = activeList.map(field => field.id)
    let interviewList = this.data.interviewList
    positionModel.show = false
    positionModel.value = labelArray.join(',')
    interviewList.pageNum = 1
    interviewList.list = []
    this.setData({positionModel, interviewList}, () => this.getLists())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   自定义的开始时间改变
   */
  bindStartDateChange(e) {
    let date = e.detail.value
    let startTime = this.data.startTime
    let endTime = this.data.endTime
    let interviewList = this.data.interviewList

    startTime.date = date
    startTime.active = true

    // 开始时间不能大于结束时间
    if(endTime.active && new Date(date).getTime() > new Date(endTime.date).getTime()) {
      app.wxToast({title: '开始时间不能大于结束时间'})
      return
    }

    if(endTime.active && this.timeStampToDay(startTime, endTime)) {
      app.wxToast({title: '时间范围不能超过30天'})
      return
    }
    
    this.setData({ startTime }, () => {
      let endTime = this.data.endTime
      let dateList = this.data.dateList
      if(startTime.active && endTime.active) {
        dateList.map(field => field.active = false)
        interviewList.pageNum = 1
        interviewList.list = []
        this.setData({ dateList, interviewList }, () => this.getLists())
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   时间戳转化成天数
   */
  timeStampToDay(startTime, endTime) {
    let start = new Date(startTime.date).getTime()
    let end = new Date(endTime.date).getTime()
    let timeStamp = end - start
    let day = Math.floor(timeStamp / 86400000)
    console.log(day)
    return day > 30
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   自定义的结束时间改变
   */
  bindEndDateChange(e) {

    let date = e.detail.value
    let startTime = this.data.startTime
    let endTime = this.data.endTime
    let interviewList = this.data.interviewList

    endTime.date = e.detail.value
    endTime.active = true

    if(startTime.active && new Date(date).getTime() < new Date(startTime.date).getTime()) {
      app.wxToast({title: '结束时间不能早于开始时间'})
      return
    }

    // 当前操作时选择开始时间
    // 要判断跟结束时间的间隔
    if(startTime.active && this.timeStampToDay(startTime, endTime)) {
      app.wxToast({title: '时间范围不能超过30天'})
      return
    }

    this.setData({ endTime }, () => {
      let endTime = this.data.endTime
      let dateList = this.data.dateList
      if(startTime.active && endTime.active) {
        dateList.map(field => field.active = false)
        interviewList.pageNum = 1
        interviewList.list = []
        this.setData({dateList, interviewList}, () => this.getLists())
      }
    })
  },
  onShow(options) {
    let interviewList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      total: 0
    }
    this.setData({interviewList}, () => this.getLists())
    this.getPositionTypeList()
  },
  onPullDownRefresh() {
    let interviewList = {list: [], pageNum: 1, isLastPage: false, isRequire: false, total: 0}
    this.setData({interviewList, hasReFresh: true})
    return this.getLists(false).then(res => {
      let interviewList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      interviewList.list = res.data
      interviewList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      interviewList.pageNum = 2
      interviewList.isRequire = true
      interviewList.total = res.meta.total
      this.setData({interviewList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-27
   * @detail   获取列表数据
   */
  getLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {}
      let startTime = this.data.startTime
      let endTime = this.data.endTime
      let dateList = this.data.dateList
      let activeItem = dateList.find(field => field.active)
      let start = ''
      let end = ''
      let positionModel = this.data.positionModel
      let position_label_id = ''

      params = {count: this.data.pageCount, page: this.data.interviewList.pageNum, hasLoading}

      // 选择时间范围
      if(activeItem && activeItem.active) {
        // 默认拿全部
        params = parseInt(activeItem.id) === 1 ? params : Object.assign(params, {gap: activeItem.id})
      }

      // 职位类型赛选
      if(positionModel.value) {

        position_label_id = positionModel.value

        if(positionModel.value === 'all') {
          position_label_id = ''
        }

        if(positionModel.value === 'none') {
          position_label_id = 0
        }
        params = Object.assign(params, {position_label_id})
      }

      // 自定义时间范围
      if(startTime.active && endTime.active) {
        start = new Date(startTime.date).getTime() / 1000
        end = new Date(endTime.date).getTime() / 1000
        params = Object.assign(params, {start, end})
      }

      if(positionModel.value && positionModel.value !== 'all') {
        this.setData({positionSelected: true})
      } else {
        this.setData({positionSelected: false})
      }

      console.log(this.data)
      if((activeItem && activeItem.active && activeItem.id !== 1) || (startTime.active && endTime.active)) {
        this.setData({timeSelected: true})
      } else {
        this.setData({timeSelected: false})
      }

      getNewHistoryApi(params).then(res => {
        let interviewList = this.data.interviewList
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        interviewList.list = interviewList.list.concat(res.data)
        interviewList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        interviewList.pageNum = interviewList.pageNum + 1
        interviewList.isRequire = true
        interviewList.total = res.meta.total
        this.setData({interviewList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let interviewList = this.data.interviewList
    if (!interviewList.isLastPage) {
      this.getLists(false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-01
   * @detail   detail
   */
  routeJump(e) {
    let params = e.currentTarget.dataset
    // 不知道什么情款  有时候拿不到数据
    if(!Object.keys(params).length) return
    wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  }
})
