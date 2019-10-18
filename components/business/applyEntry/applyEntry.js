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
        const companyInfo = res.data.companyInfo
        const joinType = res.data.joinType
        wx.setStorageSync('choseType', 'RECRUITER')
        console.log(companyInfo,'companyInfo')
        if(joinType === 3) {
          wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join&identity=APPLICANT`})
        } else {
          // 还没有创建公司信息
          if(!Reflect.has(companyInfo, 'id')) {
            wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
          } else {
            if(companyInfo.status === 1) {
              wx.navigateTo({url: `${RECRUITER}index/index?identity=APPLICANT&type=${joinType === 1 ? 'company' : 'create_org'}`})
            } else {
              if(companyInfo.status === 3) {
                wx.navigateTo({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos?identity=APPLICANT&type=${joinType === 1 ? 'company' : 'create_org'}`})
              } else {
                wx.navigateTo({url: `${RECRUITER}user/company/status/status?identity=APPLICANT&from=${joinType === 1 ? 'company' : 'create_org'}`})
              }
            }
          }
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
