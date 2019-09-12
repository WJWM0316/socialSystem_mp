import {
  getSocialDataCompanyApi,
  getSocialDataTypeApi
} from '../../../../api/pages/common'

let app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    dataBox: {
      key: [],
      value: []
    },
    scrollLists: [],
    tabBar: [],
    btnLists: []
  },
  onShow() {
    let detail = app.globalData.recruiterDetails
    this.setData({detail}, () => {
      this.setDateLists()
      this.getSocialDataType().then(() => this.getSocialDataCompany())
    })
  },
  getSocialDataCompany(data) {
    let params = {}
    let item1 = this.data.scrollLists.find(field => field.active)
    let item2 = this.data.tabBar.find(field => field.active)
    let item3 = this.data.btnLists.find(field => field.active)
    params.contentType = item2.value
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
      let key = []
      let value = [[],[]]
      res.data.dateData.map((v,i,arr) => {
        let date = new Date(v.date)
        let item = null
        item = i === 0 ? date.getMonth() + 1 + '月' + date.getDate() + '日' : date.getDate()
        key.push(item)
        value[0].push(v.uv)
        value[1].push(v.pv)
      })
      dataBox.key = key
      dataBox.value = value
      this.setData({dataBox}, () => this.selectComponent('#dataEchart').init())
    })
  },
  getSocialDataType() {
    return getSocialDataTypeApi().then(res => {
      let scrollLists = res.data.firstTab
      let tabBar = res.data.secondTab
      scrollLists[0].active = true
      tabBar[0].active = true
      this.setData({scrollLists, tabBar})
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
      startDate1,
      endDate1,
      active: true,
      text: '近7天'
    }

    let start2 = new Date()
    let end2 = new Date()
    start2.setTime(start2.getTime() - 24 * 7 * 60 * 60 * 2000)
    end2.setTime(end2.getTime() - 2 * 24 * 60 * 60 * 2000)
    let startDate2 = this.formatDate(new Date(start2))
    let endDate2 = this.formatDate(new Date(end2))
    let item2 = {
      startDate2,
      endDate2,
      active: false,
      text: '近30天'
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
    tabBar.map(v => v.active = v.value === params.value ? true : false)
    this.setData({tabBar}, () => this.getSocialDataCompany())
  }
})