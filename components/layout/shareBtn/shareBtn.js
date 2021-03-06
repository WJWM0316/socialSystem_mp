import {COMMON, RECRUITER} from '../../../config.js'
import localstorage from '../../../utils/localstorage.js'
const app = getApp()
const animation = wx.createAnimation({
  duration: 200,
  timingFunction: 'ease-in-out'
})
Component({
  properties: {
    posterData: {
      type: Object
    },
    posterType: {
      type: String
    },
    shareBtn: {
      type: Boolean,
      value: true
    },
    params: {
      type: String
    },
    isOwner: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showChoose: false,
    navHeight: app.globalData.navHeight,
    animationData: {},
    userInfo: app.globalData.userInfo
  },
  attached () {
    this.init()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init(){
      app.login().then(() => this.setData({userInfo: app.globalData.userInfo}))
    },
    onGotUserInfo(e) {
      app.onGotUserInfo(e, 'closePop').then(() => this.init())
    },
    oper() {
      this.setData({showChoose: true}, () => {
        let timer = setTimeout(() => {
          this.animation = animation
          animation.bottom(36).step()
          this.setData({
            animationData: animation.export()
          })
          clearTimeout(timer)
        }, 50)
      })
    },
    close() {
      this.animation = animation
      animation.bottom(-600).step()
      this.setData({
        animationData: animation.export()
      }, () => {
        let timer = setTimeout(() => {
          this.setData({showChoose: false})
          clearTimeout(timer)
        }, 300)
      })
    },
    jump(e) {
      let orgData = wx.getStorageSync('orgData')
      switch(this.data.posterType) {
        case 'position':
          if (e.currentTarget.dataset.type === 'position')
            wx.navigateTo({
              url: `${COMMON}poster/createPost/createPost?type=position&positionId=${this.data.params}`
            })
          else {
            wx.navigateTo({
              url: `${COMMON}poster/createPost/createPost?type=positionMin&positionId=${this.data.params}`
            })
          }
          break
        case 'applicant':
          wx.navigateTo({
            url: `${COMMON}poster/createPost/createPost?type=resume&uid=${this.data.params}`
          })
          break
        case 'recruiter':
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=recruiter&uid=${this.data.posterData.uid}&companyId=${this.data.posterData.currentCompanyId}`})
          break
        case 'company':
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=company&companyId=${this.data.posterData.id}`})
          break
        case 'specialJob':
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=rapidlyViwe`})
          break
        case 'production':
          if (e.currentTarget.dataset.type === 'chooseProduction') {
            wx.navigateTo({url: `${RECRUITER}company/productList/productList?type=choose&companyId=${app.globalData.recruiterDetails.companyTopId}`})
          }
          else {
            wx.navigateTo({url: `${RECRUITER}company/postProduct/postProduct`})
          }
          break
        case 'companyDesc':
          if(e.currentTarget.dataset.type === 'useCompanyDesc') {
            if(this.data.posterData.intro) {
              wx.navigateTo({url: `${RECRUITER}company/introducingEdit/introducingEdit?companyId=${app.globalData.recruiterDetails.companyInfo.id}&type=org&topId=${this.data.posterData.id}`})
            } else {
              app.wxToast({title: '公司尚未完善公司介绍信息'})
            }
          } else {
            wx.navigateTo({url: `${RECRUITER}company/introducingEdit/introducingEdit?companyId=${this.data.params}&type=org`})
          }
          break
        default:
          break
      }
      wx.setStorageSync('posterData', this.data.posterData)
      this.setData({showChoose: false})
    },
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    }
  }
})
