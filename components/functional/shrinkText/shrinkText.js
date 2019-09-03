import {getSelectorQuery} from '../../../utils/util.js'
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    textData: {
      type: String,
      value: ''
    },
    line: {
      type: Number,
      value: 6
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShrink: false,
    needShrink: false,
    btnTxt: '展开内容'
  },
  ready() {
    let that = this
    const query = wx.createSelectorQuery().in(this)
    query.select('.msg').boundingClientRect(function (res) {
      if (!res) return
      if (res.height > 143) {
        that.setData({isShrink: true, needShrink: true})
      } else {
        that.setData({isShrink: false, needShrink: false})
      }
    }).exec()
  },
  attached() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggle() {
      let isShrink = this.data.isShrink
      let btnTxt = ''
      isShrink = !isShrink
      if (!isShrink) {
        btnTxt = '收起内容'
      } else {
        btnTxt = '展开内容'
      }
      this.setData({isShrink, btnTxt})
    }
  }
})
