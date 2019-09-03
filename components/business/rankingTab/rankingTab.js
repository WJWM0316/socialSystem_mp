
// 
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object,
    index:{
      type: Number,
      default: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cdnImagePath: app.globalData.cdnImagePath
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toRecruitment (e) {
      wx.navigateTo({ // 去招聘官主页
        url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${this.properties.item.uid}`
      })
    }
  }
})
