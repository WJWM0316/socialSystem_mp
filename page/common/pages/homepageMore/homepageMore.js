import {
  RECRUITERHOST,
  COMMON,
  RECRUITER
} from '../../../../config.js'
Page({
  data: {
    companyInfos: {},
    map: {
      longitude: 0,
      latitude: 0,
      markers: []
    }
  },
  onLoad(options) {
    let companyInfos = wx.getStorageSync('companyInfos')
    let map = this.data.map
    const longitude = companyInfos.address.length ? companyInfos.address[0].lng : 0
    const latitude = companyInfos.address.length ? companyInfos.address[0].lat : 0
    const address = companyInfos.address.length ? companyInfos.address[0].address : ''
    const doorplate = companyInfos.address.length ? companyInfos.address[0].doorplate : ''
    map.longitude = longitude
    map.latitude = latitude
    map.address = address
    map.doorplate = doorplate
    map.enableScroll = false
    map.markers.push({
      id: 1,
      longitude,
      latitude,
      label: {
        content: companyInfos.companyShortname,
        fontSize:'18rpx',
        color:'#282828',
        anchorX: '30rpx',
        anchorY: '-60rpx'
      }
    })
    this.setData({companyInfos, map}, () => {
      wx.removeStorageSync('companyInfos')
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-29
   * @detail   复制
   * @return   {[type]}   [description]
   */
  copyLink() {
    wx.setClipboardData({data: this.data.companyInfos.website, icon: 'success'})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-29
   * @detail   离开当前页面
   * @return   {[type]}   [description]
   */
  routeJump(e) {
    const route = e.currentTarget.dataset.route
    switch(route) {
      case 'map':
        wx.navigateTo({url: `${COMMON}map/map`})
        break
      case 'recruitersList':
        wx.navigateTo({url: `${RECRUITER}user/company/recruiterList/recruiterList?companyId=${this.data.companyInfos.id}`})
        break
      default:
        break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   查看地址
   * @return   {[type]}     [description]
   */
  viewMap(e) {
    const params = e.currentTarget.dataset
    wx.openLocation({
      latitude: Number(params.latitude),
      longitude: Number(params.longitude),
      scale: 14,
      address: `${params.address} ${params.doorplate}`,
      fail: res => {
        app.wxToast({title: '获取位置失败'})
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   查看大图
   * @return   {[type]}   [description]
   */
  previewImage(e) {
    let albumInfo = this.data.companyInfos.albumInfo.map(field => field.url)
    let current = albumInfo.find((value, now, arr) => now === this.data.swiperIndex)
    wx.previewImage({current, urls: albumInfo})
  }
})