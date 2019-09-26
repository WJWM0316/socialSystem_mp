import {
  getCompanyApplyInfoApi
} from '../../../api/pages/company.js'


import {
  APPLICANT,
  COMMON,
  RECRUITER
} from '../../../config.js'

let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    companyId: {
      type: String,
      value: ''
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
    getCompanyApplyInfo() {
      getCompanyApplyInfoApi({company_id: this.data.companyId}).then(res => {
        wx.setStorageSync('choseType', 'RECRUITER')
        switch(res.data.step) {
          case 1:
            wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
            break
          case 2:
            wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos`})
            break
          default:
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=${res.data.status === 1 ?'company' : 'join'}`})
            break
        }
      }).catch(e => {
        switch(e.code) {
          case 1:
            app.wxConfirm({
              title: '身份切换',
              content: `是否切换为招聘官身份`,
              cancelText: '取消',
              confirmText: '确定',
              confirmBack: () => {
                app.toggleIdentity()
              },
              cancelBack: () => {}
            })
            break
          case 2:
            app.wxConfirm({
              title: '提示',
              content: `你已经是招聘官，请前往你的企业专属招聘小程序登录使用。`,
              showCancel: false,
              confirmText: '关闭',
              confirmBack: () => {},
              cancelBack: () => {}
            })
            break
          default:
            break
        }
      })
    }
  }
})
