import {
  getSocialDataCompanyApi,
  getSocialDataTypeApi
} from '../../../../api/pages/common'

let app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    hasReFresh: false,
    dataBox: {
      list: [],
      activeIndex: 0
    },
    scrollLists: [],
    tabBar: [
      {
        name: '机构主页',
        active: true
      },
      {
        name: '职位详情页',
        active: false
      },
      {
        name: '招聘官主页',
        active: false
      }
    ],
    btnLists: [],
    currentData: {
      countPv: "0",
      countUv: "0"
    },
    detail: app.globalData.recruiterDetails
  },
  onShow() {
    let detail = app.globalData.recruiterDetails
    this.setData({detail}, () => {
      let btnLists = []
      this.setData({btnLists}, () => {
        this.setDateLists()
        this.getSocialDataType().then(() => this.getSocialDataCompany())
      })
    })
  },
  getSocialDataCompany() {
    let orgData = wx.getStorageSync('orgData')
    let params = {}
    let item1 = this.data.scrollLists.find(field => field.active)
    let item3 = this.data.btnLists.find(field => field.active)
    let index = this.data.tabBar.findIndex(field => field.active)
    let dataBox = this.data.dataBox

    let tem = [
      {
        key: [],
        value: [[],[]]
      },
      {
        key: [],
        value: [[],[]]
      },
      {
        key: [],
        value: [[],[]]
      }
    ]

    let setDefault = () => {
      let tem = {}
      let key = []
      let value = [[],[]]

      for(let i = item3.id; i > 0; i--) {
        let start = new Date(), day
        start.setTime(start.getTime() - 24 * i * 60 * 60 * 1000)
        day = start.getDate()
        if(i === item3.id) day = start.getMonth() + 1 + '月' + start.getDate() + '日'
        key.push(day)
      }

      for(let i = item3.id; i > 0; i--) {
        value[0].push(0)
        value[1].push(0)
      }
      return {key, value}
    }
    
    params.dataType = item1.value

    if(this.data.detail.isCompanyTopAdmin) {
      params.companyId = orgData.id
    } else {
      params.companyId = app.globalData.recruiterDetails.companyInfo.id
    }
    params.startDate = item3.startDate
    params.endDate = item3.endDate

    return getSocialDataCompanyApi(params).then(res => {

      let dataBox = this.data.dataBox
      let currentData = this.data.currentData
      let defaultData = setDefault()
      let company = res.data.data.company
      let position = res.data.data.position
      let recruiter = res.data.data.recruiter

      // 机构主页
      if(company.data.length) {
        company.data.map((v,i,arr) => {
          let date = new Date(v.date)
          let item = null
          item = i === 0 ? date.getMonth() + 1 + '月' + date.getDate() + '日' : date.getDate()
          tem[0].key.push(item)
          tem[0].value[0].push(v.companyVisitPv)
          tem[0].value[1].push(v.companyVisitUv)
          tem[0].pv = company.pv
          tem[0].uv = company.uv
        })
      } else {
        tem[0].key = defaultData.key
        tem[0].value = defaultData.value
        tem[0].pv = 0
        tem[0].uv = 0
      }

      // 职位详情
      if(position.data.length) {
        position.data.map((v,i,arr) => {
          let date = new Date(v.date)
          let item = null
          item = i === 0 ? date.getMonth() + 1 + '月' + date.getDate() + '日' : date.getDate()
          tem[1].key.push(item)
          tem[1].value[0].push(v.recruiterVisitPv)
          tem[1].value[1].push(v.recruiterVisitUv)
          tem[1].pv = position.pv
          tem[1].uv = position.uv
        })
      } else {
        tem[1].key = defaultData.key
        tem[1].value = defaultData.value
        tem[1].pv = 0
        tem[1].uv = 0
      }

      // 招聘管主页
      if(recruiter.data.length) {
        recruiter.data.map((v,i,arr) => {
          let date = new Date(v.date)
          let item = null
          item = i === 0 ? date.getMonth() + 1 + '月' + date.getDate() + '日' : date.getDate()
          tem[2].key.push(item)
          tem[2].value[0].push(v.recruiterVisitPv)
          tem[2].value[1].push(v.recruiterVisitUv)
          tem[2].pv = recruiter.pv
          tem[2].uv = recruiter.uv
        })
      } else {
        tem[2].key = defaultData.key
        tem[2].value = defaultData.value
        tem[2].pv = 0
        tem[2].uv = 0
      }

      tem.map((v,i,arr) => dataBox.list[i] = v)
      dataBox.activeIndex = index
      currentData.countPv = tem[index].pv
      currentData.countUv = tem[index].uv
      this.setData({dataBox, currentData}, () => this.selectComponent('#dataEchart').init())
    })
  },
  getSocialDataType() {
    return getSocialDataTypeApi().then(res => {
      let scrollLists = res.data.firstTab
      scrollLists[0].active = true
      this.setData({scrollLists})
    })
  },
  onTabClick(e) {
    let params = e.currentTarget.dataset
    let btnLists = this.data.btnLists
    btnLists.map((v, i) => v.active = i === params.index ? true : false)
    this.setData({btnLists}, () => this.getSocialDataCompany())
  },
  formatDate(timestamp) {
    let date = new Date(timestamp)
    let YY = date.getFullYear() + '-'
    let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
    return YY + MM + DD
  },
  setDateLists() {
    let btnLists = this.data.btnLists
    let start1 = new Date()
    let end1 = new Date()
    start1.setTime(start1.getTime() - 24 * 7 * 60 * 60 * 1000)
    end1.setTime(end1.getTime() - 1 * 24 * 60 * 60 * 1000)
    let startDate1 = this.formatDate(new Date(start1))
    let endDate1 = this.formatDate(new Date(end1))
    let item1 = {
      startDate: startDate1,
      endDate: endDate1,
      active: true,
      text: '近7天',
      id: 7
    }

    let start2 = new Date()
    let end2 = new Date()
    start2.setTime(start2.getTime() - 24 * 7 * 60 * 60 * 2000)
    end2.setTime(end2.getTime() - 2 * 24 * 60 * 60 * 2000)
    let startDate2 = this.formatDate(new Date(start2))
    let endDate2 = this.formatDate(new Date(end2))
    let item2 = {
      startDate: startDate2,
      endDate: endDate2,
      active: false,
      text: '近30天',
      id: 30
    }

    btnLists.push(item1, item2)
    this.setData({btnLists})
  },
  onTabClick1(e) {
    let params = e.currentTarget.dataset
    let scrollLists = this.data.scrollLists
    scrollLists.map(v => v.active = v.value === params.value ? true : false)
    this.setData({scrollLists}, () => this.getSocialDataCompany())
  },
  onTabClick2(e) {
    let params = e.currentTarget.dataset
    let tabBar = this.data.tabBar
    let dataBox = this.data.dataBox
    tabBar.map((v,i) => v.active = i === params.index ? true : false)
    this.setData({tabBar, dataBox}, () => this.getSocialDataCompany())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    let callback = () => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }
    this.setData({hasReFresh: true}, () => {
      this.getSocialDataCompany().then(res => callback()).catch(e => callback())
    })
  }
})