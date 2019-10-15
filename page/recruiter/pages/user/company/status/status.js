import {
  getCompanyIdentityInfosApi,
  getCompanyPerfectApi,
  notifyadminApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER, COMMON} from '../../../../../../config.js'

let app = getApp()

Page({
  data: {
    identityInfos: {},
    companyInfos: {},
    pageTitle: '',
    options: {
      showBack: true
    },
    hasReFresh: false,
    cdnImagePath: app.globalData.cdnImagePath,
    telePhone: app.globalData.telePhone,
    showHome: false
  },
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
    this.setData({options})
  },
  onShow() {
    this.getCompanyIdentityInfos()
  },
  todoAction(e) {
  	let params = e.currentTarget.dataset
    let companyInfos = this.data.companyInfos
    let options = this.data.options
    let identityInfos = this.data.identityInfos

  	switch(params.action) {
  		case 'modifyCompany':
        wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
  			break
      case 'email':
        wx.navigateTo({url: `${RECRUITER}user/company/email/email?id=${app.globalData.recruiterDetails.companyInfo.id}`})
        break
      case 'position':
        wx.redirectTo({url: `${RECRUITER}position/post/post`})
        break
      case 'perfect':
        wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${app.globalData.recruiterDetails.uid}`})
        break
      case 'applyModify':
        wx.navigateTo({url: `${RECRUITER}user/company/apply/apply?type=join`})
        break
      case 'createOrgModify':
        wx.navigateTo({url: `${RECRUITER}user/company/apply/apply?type=create_org`})
        break
      case 'recruitment':        
        if(companyInfos.status === 1) {
          wx.reLaunch({url: `${RECRUITER}index/index`})
        }
        break
      case 'call':
        wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
        break
      case 'notice':
        notifyadminApi().then(() => {
          app.wxToast({title: '通知成功'})
        })
        .catch(err => {
          if(err.code === 420) {
            app.wxConfirm({
              title: '温馨提示',
              content: err.msg,
              showCancel: false,
              confirmText: '知道了',
              confirmBack:() => {}
            })
          }
        })
        break
  		default:
  			break
  	}
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-16
   * @detail   获取公司状态和个人身份状态
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos(hasLoading = true) {
    return new Promise((resolve, reject) => {
      getCompanyIdentityInfosApi({...app.getSource()}, hasLoading).then(res => {
        // 公司信息
        let companyInfos = res.data.companyInfo
        let pageTitle = ''
        let options = this.data.options
        // 个人身份信息
        let identityInfos = res.data
        // 是否返回上一页
        let isReturnBack = false
        // 是否返回上一页
        let showHome = this.data.showHome

        switch(res.data.joinType) {
          case 1:
            pageTitle = '创建公司审核'
            break
          case 2:
            pageTitle = '创建机构审核'
            break
          case 3:
            pageTitle = '加入机构审核'
            break
          default:
            break
        }

        if(companyInfos.status === 1) {
          options.showBack = false
        }

        if(identityInfos.status === 1 && companyInfos.status === 1) {
          showHome = true
        }
        this.setData({identityInfos, companyInfos, pageTitle, options, showHome}, () => resolve(res))
      })
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    let callback = () => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }
    this.setData({hasReFresh: true})
    this.getCompanyIdentityInfos(false).then(res => callback()).catch(e => callback())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   切换身份
   * @return   {[type]}   [description]
   */
  toggle() {
    app.wxConfirm({
      title: '切换身份',
      content: '是否继续前往求职端？',
      confirmBack() {
        app.toggleIdentity()
      },
      cancelBack: () => {}
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   拨打电话
   * @return   {[type]}   [description]
   */
  callPhone() {
    wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
  },
  backEvent() {
    wx.navigateBack({delta: 1})
  }
})