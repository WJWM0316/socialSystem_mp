Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array,
      default: []
    },
    showBoxShadow: {
      type: Boolean,
      value: true
    },
    listType: {
      type: String,
      value: ''
    },
    hasLogo: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    routeJump (e) {
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/page/common/pages/positionDetail/positionDetail?positionId=${item.id}&companyId=${item.companyId}`
      })
    },
    toCreate () {
      wx.navigateTo({
        url: `/page/applicant/pages/createUser/createUser?from=4`
      })
    },
    formSubmit(e) {
      getApp().postFormId(e.detail.formId)
    }
  }
})
