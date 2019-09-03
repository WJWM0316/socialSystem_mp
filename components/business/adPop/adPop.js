import {getAdApi, touchVkeyApi} from '../../../api/pages/common.js'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showPop: false,
    adData: {}
  },
  attached () {
    getAdApi().then(res => {
      if (res.data.length > 0) {
        let adData = res.data[0]
        this.setData({adData, showPop: true})
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jump () {
      wx.navigateTo({
        url: `/${this.data.adData.path}`
      })
      this.close()
    },
    close () {
      touchVkeyApi({vkey: this.data.adData.vkey}).then(res => {
        this.setData({showPop: false})
      })
    }
  }
})
