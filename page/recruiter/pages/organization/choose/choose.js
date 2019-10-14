import{getCompanyOrglistApi, setCompanyDefaultOrgApi} from '../../../../../api/pages/company.js'
import {COMMON, RECRUITER} from '../../../../../config.js'
const app = getApp()
let timer = null,
    keyword = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '\ue635 请输入机构名称',
    navH: app.globalData.navHeight,
    keyword: '',
    orgList: [],
    options: {},
    title: '添加机构',
    showModel: false,
    keyword2: '',
    activeItem: true,
    organization: {
      companyName: '',
      id: ''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({options})
    this.getList()
  },
  bindInput (e) {
    clearTimeout(timer)
    let value = e.detail.value
    keyword = value

    timer = setTimeout(() => {
      this.getList()
      clearTimeout(timer)
    }, 100)
  },
  getList () {
    let orgList = this.data.orgList,
        parmas = {
          company_id: app.globalData.recruiterDetails.companyTopId || 1,
          keyword: keyword || '',
          hasKeyword: true
        }
    let chooseItem = wx.getStorageSync('orgData')
    getCompanyOrglistApi(parmas).then(res => {
      orgList = res.data
      if (chooseItem && !this.data.options.type) {
        orgList.filter(item => {
          if (item.id === chooseItem.id) item.active = true
        })
      }
      this.setData({orgList})
    })
  },
  choose (e) {
    let index = e.currentTarget.dataset.index,
        item  = e.currentTarget.dataset.item,
        orgList = this.data.orgList
    orgList.forEach((item) => {
      if (item.active) item.active = false
    })
    orgList[index].active = true
    this.setData({orgList}, () => {
      if (!this.data.options.type) {
        wx.setStorageSync('orgData', item)
        wx.navigateBack({delta: 1})
      } else {
        if (this.data.options.type === 'createQr') {
          wx.setStorageSync('orgData', item)
          wx.redirectTo({url: `${RECRUITER}createQr/createQr?type=qr-mechanism&companyId=${item.id}`})
        } else if(this.data.options.type === 'setOrg'){
          this.setCompanyDefaultOrg(item)
        } else if(this.data.options.type === 'org') {
          this.setData({activeItem: false})
        } else {
          wx.redirectTo({url: `${COMMON}poster/createPost/createPost?type=company&companyId=${item.id}`})
        }
      }
    })
  },
  setCompanyDefaultOrg(item) {
    setCompanyDefaultOrgApi({company_id: item.id }).then(() => {
      app.globalData.recruiterDetails.companyInfo.defaultOrgInfo = {
        id: item.id,
        companyName: item.companyName
      }
      wx.navigateBack({delta: 1})
    })
  },
  onUnload: function () {
    timer = null
    keyword = null
  },
  confirm() {
    let organization = this.data.organization
    organization.id = 2
    organization.companyName = this.data.keyword2
    this.setData({organization})
  },
  cancel() {
    let organization = this.data.organization
    organization.id = ''
    this.setData({organization})
  },
  open() {
    let organization = this.data.organization
    // organization.id = 2
    this.setData({showModel: true, organization})
  },
  change(e) {
    this.setData({keyword2: e.detail.value})
  },
  setActive() {
    let orgList = this.data.orgList
    orgList.map(field => field.active = false)
    this.setData({orgList, activeItem: true})
  }
})