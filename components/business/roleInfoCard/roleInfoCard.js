import {COMMON,RECRUITER} from "../../../config.js"
let app = getApp()
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    roleType: {
      type: String
    },
    cardData: {
      type: Object
    },
    isMain: {
      type: Boolean,
      value: false
    },
    glass: {
      type: Boolean,
      value: false
    },
    options: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    choseType: '',
    isCompanyAdmin: false,
    cdnImagePath: app.globalData.cdnImagePath
  },
  attached() {
    let choseType = wx.getStorageSync('choseType'),
        isCompanyAdmin = 0
    if (app.getRoleInit) {
      isCompanyAdmin = app.globalData.recruiterDetails.isCompanyAdmin || 0
      this.setData({isCompanyAdmin, choseType})
    } else {
      app.getRoleInit = () => {
        isCompanyAdmin = app.globalData.recruiterDetails.isCompanyAdmin || 0
        this.setData({isCompanyAdmin, choseType})
      }
    }
    
    this.setData({isCompanyAdmin, choseType})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: this.data.cardData.mobile
      })
    },
    setClipboardData() {
      wx.setClipboardData({
        data: this.data.cardData.wechat,
        success(res) {
          getApp().wxToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    },
    jumpEditBase() {
      console.log(this.data.options)
      let url = `${RECRUITER}company/homepageEdit/homepageEdit?companyId=${this.data.cardData.id}&type=${this.data.options.type}`
      if(this.data.options.from) {
        url += `&from=${this.data.options.from}` 
      }
      wx.redirectTo({url })
    },
    jumpCompany() {
      if (this.data.isMain) { return }
      wx.navigateTo({
        url: `${COMMON}homepage/homepage?companyId=${this.data.cardData.id}`
      })
    },
    jumpApplicant() {
      wx.navigateTo({
        url: `${COMMON}resumeDetail/resumeDetail?uid=${this.data.cardData.uid}`
      })
    },
    jumpRecruiter() {
      if (!this.data.isMain) {
        wx.navigateTo({
          url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.cardData.uid}`
        })
      }
    },
    jumpEdit() {
      wx.navigateTo({
        url: `${RECRUITER}user/userInfoEdit/userInfoEdit`
      })
    }
  }
})
