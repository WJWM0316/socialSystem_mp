// components/functional/avatarUpload/avatarUpload.js
import {COMMON} from '../../../config.js'
const app = getApp()
Component({
  externalClasses: ['avatar'],
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: ''
    },
    needBg: {
      type: Boolean,
      value: false
    },
    icon: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cdnImagePath: app.globalData.cdnImagePath
    // src: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upload () {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success (res) {
          const src = res.tempFilePaths[0]
          wx.navigateTo({
            url: `${COMMON}cutInside/cutInside?src=${src}`
          })
        }
      })
    }
  }
})
