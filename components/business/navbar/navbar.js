import {APPLICANT,RECRUITER,COMMON} from "../../../config.js"
import localstorage from "../../../utils/localstorage.js"
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
      value: '店长多多'
    },
    showNav: {
      type: Boolean,
      value:true
    },
    showBack: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: false
    },
    background: {
      type: String,
      value: '#652791'
    },
    color: {
      type: String,
      value: '#fff'
    },
    customBack: {
      type: Boolean,
      value: false
    },
    isFixed: {
      type: Boolean,
      value: true
    },
    showScanIcon: {
      type: Boolean,
      value: false
    },
    mustBack: {
      type: Boolean,
      value: false
    }
  },
  data: {
    showBackBtn: false,
    navH: app.globalData.navHeight,
    positionStatus: 'fixed',
    cdnImagePath: app.globalData.cdnImagePath,
    firstClick: false,
    homeBubble: false,
    choseType: 'APPLICANT',
    showScanBox: false
  },
  attached() {
    let positionStatus = this.data.positionStatus
    let firstClick = wx.getStorageSync('firstClick')
    let homeBubble = localstorage.get('backHomeTip')
    let route = getCurrentPages()
    if (!this.data.isFixed) {
      positionStatus = 'relative'
    }
    if (route.length > 1) {
      this.setData({showBackBtn: true, positionStatus})
    } else {
      this.setData({positionStatus})
    }
    if(!firstClick) {
      this.setData({firstClick: true})
    }
    if (!homeBubble) {
      this.setData({homeBubble: true})
    }
    this.setData({choseType: wx.getStorageSync('choseType')})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack() {
      if (this.data.customBack) {
        this.triggerEvent('backEvent')
      } else {
        wx.navigateBack({delta: 1})
      }
    },
    // 回到首页
    backHome() {
      let identity = wx.getStorageSync('choseType')
      if (identity === 'RECRUITER') {
        wx.reLaunch({
          url: `${RECRUITER}index/index`
        })
        wx.removeStorageSync('isReback')
      } else {
        wx.reLaunch({
          url: `${COMMON}homepage/homepage`
        })
      }
    },
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    },
    closeTips(e) {
      switch (e.currentTarget.dataset.type) {
        case 'scanCode':
          this.setData({firstClick: false}, () => wx.setStorageSync('firstClick', 1))
          break
        case 'homeBubble':
          this.setData({homeBubble: false}, () => localstorage.set('backHomeTip', {type: 'resetTheDay'}))
          break
      }
    },
    showScan() {
      this.setData({showScanBox: true})
    }
  },
  pageLifetimes: {
    hide () {
      if (!localstorage.get('backHomeTip')) {
        let e = {
          currentTarget: {
            dataset: {
              type : 'homeBubble'
            }
          }
        }
        this.closeTips(e)
      }
    }
  }
})