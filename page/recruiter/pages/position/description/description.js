import {RECRUITER} from '../../../../../config.js'
import {othersPositionTxtB} from '../../../../../utils/randomCopy.js'
import {
  getPositionDescribeListsApi
} from '../../../../../api/pages/position.js'
let app = getApp()

Page({
	data: {
		describe: '',
    canClick: false,
    randomCopy: {},
    show: false,
    positionDescribeLists: []
	},
	onLoad(options) {
    let storage = wx.getStorageSync('createPosition')
    if(storage.describe) this.setData({ describe: storage.describe, canClick: true })
    this.setData({randomCopy: othersPositionTxtB()})
	},
  onShow() {
    this.getPositionDescribeLists()
  },
  getRandomItem() {
    let positionDescribeLists = this.data.positionDescribeLists
    let item = positionDescribeLists[(Math.floor(Math.random() * (positionDescribeLists.length)))]
    this.setData({randomCopy: item})
  },
  getPositionDescribeLists() {
    getPositionDescribeListsApi({company_id: app.globalData.recruiterDetails.companyTopId}).then(res => {
      this.setData({positionDescribeLists: res.data.positionDescribeList}, () => this.getRandomItem())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   防抖
   * @return   {[type]}   [description]
   */
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   绑定文本域输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let name = e.detail.value
    this.debounce(this.bindChange, null, 500, name)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   绑定值得改变
   * @return   {[type]}        [description]
   */
  bindChange(describe) {
    this.setData({describe})
    this.bindButtonStatus()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindButtonStatus() {
    this.setData({canClick: this.data.describe})
  },
  submit(e) {
    let storage = wx.getStorageSync('createPosition')
    storage.describe = this.data.describe
    if(this.data.describe.length < 6) {
      app.wxToast({title: '职位描述最少6个字'})
      return;
    }
    wx.setStorageSync('createPosition', storage)
    wx.navigateBack({delta: 1})
  },
  next() {
    this.getRandomItem()
  },
  view() {
    this.setData({show: !this.data.show})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-29
   * @detail   复制
   * @return   {[type]}   [description]
   */
  copyText() {
    wx.setClipboardData({data: this.data.randomCopy.intro })
  }
})