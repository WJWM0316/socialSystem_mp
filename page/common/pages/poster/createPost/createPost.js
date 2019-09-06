import {getRapidlyViwePostApi, getPositionPostApi, getPositionMinPostApi, getResumePostApi, getRecruiterPostApi} from '../../../../../api/pages/poster.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    title: '保存图片',
    openSet: true,
    timerSecond: 30000,
    guidePop: true,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let getImgFun = null,
        type = options.type,
        title = '',
        params = {}
    switch (type) {
      case 'rapidlyViwe':
        getImgFun = getRapidlyViwePostApi
        title = '急速约面'
        break
      case 'position':
        getImgFun = getPositionPostApi
        title = '职位分享'
        params.id = options.positionId
        break
      case 'positionMin':
        getImgFun = getPositionMinPostApi
        params.id = options.positionId
        title = '职位分享'
        break
      case 'resume':
        getImgFun = getResumePostApi
        title = '简历分享'
        params.uid = options.uid
        break
      case 'recruiter':
        getImgFun = getRecruiterPostApi
        title = '招聘官分享'
        params.uid = options.uid
        break
    }
    this.setData({title, options})
    getImgFun(params).then(res => {
      if (res.data.posterData) wx.setStorageSync('posterData', res.data.posterData)
      
      this.setData({imgUrl: res.data.url})
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let guidePop = wx.getStorageSync('guidePop') || false
    this.setData({guidePop})
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.setData({openSet: true})
        }
      }
    })
  },
  onGotUserInfo(e) {
    app.onGotUserInfo(e, true).then(res => {
      this.setData({userInfo: app.globalData.userInfo})
    })
  },
  hidePop (e) {
    this.setData({guidePop: true})
  },
  saveImg () {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.setData({openSet: true})
              svae()
            },
            fail (res) {
              if (res.errMsg.indexOf('fail') !== -1) {
                that.setData({openSet: false})
              } 
            }
          })
        } else {
          svae()
        }
       }
    })
    function svae () {
      var save = wx.getFileSystemManager();
      var number = Math.random();
      save.writeFile({
        filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
        data: that.data.imgUrl.slice(22),
        encoding: 'base64',
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: wx.env.USER_DATA_PATH + '/pic' +number+'.png',
            success: function (e) {
              app.wxToast({
                title: '已保存至相册',
                icon: 'success',
                callback () {
                  let paramsType = '',
                      paramsChannel = '',
                      options = that.data.options,
                      id = 0
                  switch (options.type) {
                    case 'position':
                      paramsType = 'position'
                      paramsChannel = 'qrpl'
                      id = options.positionId
                      break
                    case 'positionMin':
                      paramsType = 'position'
                      paramsChannel = 'qrpe'
                      id = options.positionId
                      break
                    case 'rapidlyViwe':
                      paramsType = 'surface_rapidly'
                      paramsChannel = 'qrpl'
                      break
                    case 'recruiter':
                      paramsType = 'recruiter'
                      paramsChannel = 'qrpl'
                      id = options.uid
                      break
                    case 'resume':
                      paramsType = 'resume'
                      paramsChannel = 'qrpl'
                      id = options.uid
                      break
                  }
                  app.shareStatistics({
                    id: id,
                    type: paramsType,
                    channel: paramsChannel
                  })
                }
              })
            },
            fail: function (e) {
              console.log(e)
              app.wxToast({
                title: '保存失败'
              })
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('posterData')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  }
})