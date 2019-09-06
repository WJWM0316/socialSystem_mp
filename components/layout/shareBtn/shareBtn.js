import {COMMON} from '../../../config.js'
import localstorage from '../../../utils/localstorage.js'
const app = getApp()
const animation = wx.createAnimation({
  duration: 200,
  timingFunction: 'ease-in-out'
})
Component({
  /**
   * 组件的属性列表
   */
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showChoose: false,
    navHeight: app.globalData.navHeight,
    animationData: {}
  },
  attached () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=recruiter&uid=${this.data.params}`})
          break
        case 'specialJob':
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=rapidlyViwe`})
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
