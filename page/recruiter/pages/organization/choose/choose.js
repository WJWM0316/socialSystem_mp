import{getCompanyOrglistApi, setCompanyDefaultOrgApi} from '../../../../../api/pages/company.js'
import {COMMON, RECRUITER} from '../../../../../config.js'
const app = getApp()
let timer = null,
    keyword = null
Page({
  data: {
    placeholder: '\ue635 请输入机构名称',
    navH: app.globalData.navHeight,
    keyword: '',
    orgList: [],
    options: {},
    showModel: false,
    keyword2: '',
    activeItem: true,
    canClick: false,
    organization_name: '',
    onBottomStatus: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let cacheData = wx.getStorageSync('createdCompany')
    let organization_name = this.data.organization_name
    let canClick = this.data.canClick
    if(cacheData.isUserDefined) {
      organization_name = cacheData.organization_name
      canClick = true
    }
    this.setData({options, organization_name, canClick})
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
          company_id: app.globalData.recruiterDetails.companyTopId || this.data.options.companyId,
          keyword: keyword || '',
          hasKeyword: true
        }
    let chooseItem = wx.getStorageSync('orgData')
    getCompanyOrglistApi(parmas).then(res => {
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      orgList = res.data
      if (chooseItem && !this.data.options.type) {
        orgList.filter(item => {
          if (item.id === chooseItem.id) item.active = true
        })
      }
      this.setData({orgList, onBottomStatus})
    })
  },
  choose (e) {
    let index = e.currentTarget.dataset.index,
        item  = e.currentTarget.dataset.item,
        orgList = this.data.orgList,
        result = orgList.find(field => field.active)
    orgList.forEach((item) => {
      if (item.active) item.active = false
    })
    orgList[index].active = true
    this.setData({orgList, canClick: true}, () => {
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
          // wx.reLaunch({url: `${RECRUITER}user/company/apply/apply?type=${type}`})
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
    let keyword2 = this.data.keyword2
    let organization_name = this.data.organization_name
    let orgList = this.data.orgList
    orgList.map(field => field.active = false)
    organization_name = keyword2
    this.setData({canClick: true, activeItem: true, orgList, organization_name})
  },
  cancel() {},
  open() {
    this.setData({showModel: true})
  },
  change(e) {
    this.setData({keyword2: e.detail.value})
  },
  setActive() {
    let orgList = this.data.orgList
    orgList.map(field => field.active = false)
    this.setData({orgList, activeItem: true})
  },
  submit() {
    if(!this.data.canClick) return;
    let orgList = this.data.orgList
    let options = this.data.options
    let organization_name = this.data.organization_name
    let result = orgList.find(field => field.active)
    let url = result ? `${RECRUITER}user/company/apply/apply?type=join` : `${RECRUITER}user/company/apply/apply?type=createQr`
    let cacheData = wx.getStorageSync('createdCompany')
    cacheData = Object.assign(cacheData, {company_id: options.companyId})
    if(result) {
      cacheData.organization_name = result.companyName
      cacheData = Object.assign(cacheData, {orgId: result.id})
    } else {
      cacheData = Object.assign(cacheData, {isUserDefined: 1})
      cacheData.organization_name = organization_name
    }
    wx.setStorageSync('createdCompany', cacheData)
    wx.reLaunch({url})
  }
})