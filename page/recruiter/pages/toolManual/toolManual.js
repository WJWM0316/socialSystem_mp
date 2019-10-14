let app = getApp()
Page({
  data: {
    lists: [
      {
        id: 1,
        msg: '路径用途',
        active: true
      },
      {
        id: 2,
        msg: '使用前提',
        active: false
      },
      {
        id: 3,
        msg: '获取路径',
        active: false
      },
      {
        id: 4,
        msg: '配置路径',
        active: false
      }
    ]
  },
  onLoad() {
    wx.setStorageSync('choseType', 'RECRUITER')
  },
  onClick(e) {
    let params = e.currentTarget.dataset
    let lists = this.data.lists
    lists.map((field, index) => field.active = index === params.index ? true : false)
    this.setData({lists})
  }
})