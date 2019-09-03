import {
  getAttachResumeApi,
  scanQrcodeApi,
  scanLoginApi
} from '../../../../../api/pages/common.js'

let app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    cdnPath: app.globalData.cdnImagePath,
    attachResume: {vkey: ''},
    hasReFresh: false
  },
  onLoad() {
    const attachResume = app.globalData.resumeInfo.resumeAttach
    this.setData({attachResume})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-28
   * @detail   扫码上传
   * @return   {[type]}   [description]
   */
  scanCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        const uuid = res.result.split('&')[0].slice(5)
        const params = {uuid, isBusiness: 0}
        console.log(res, '扫码结果')
        scanQrcodeApi({uuid}).then(res => scanLoginApi(params))
      }
    })
  },
  preview(e) {
    let that = this
    app.previewResume(e)
  },
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true})
    app.getAllInfo().then(() => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  }
})