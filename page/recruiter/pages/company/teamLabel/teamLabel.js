// page/common/pages/tabsPage/tabsPage.js
import {getTeamlightspotApi,diyTeamlabApi,saveTeamlabApi} from '../../../../../api/pages/label.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamList: [],
    choseList: [],
    limitNum: 8,
    customLabel: '', // 自定义标签
    hidePop: true // 打开自定pop
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getTeamlightspotApi().then(res => {
      let choseList = []
      res.data.map((item, index) => {
        if (item.select) {
          choseList.push(item)
        }
      })
      this.setData({teamList: res.data, choseList})
    })
  },
  openPop () {
    if (this.data.choseList.length < this.data.limitNum) {
      this.setData({hidePop: false})
    } else {
      app.wxToast({
        title: '选择标签已达上限'
      })
    }
  },
  closePop() {
    this.setData({hidePop: true})
  },
  getCustomLabel(e) {
    this.setData({
      customLabel: e.detail.value
    })
  }, 
  choseTab(e) {
    let choseData = e.target.dataset.tabdata
    let teamList = this.data.teamList
    let choseList = this.data.choseList
    teamList.map((item, index) => {
      if (item.id === choseData.id) {
        choseData.index = index
        return
      }
    })
    if (choseData.select) {
      choseList.map((item, index) => {
        if (item.id === choseData.id) {
          choseList.splice(index, 1)
          return
        }
      })
      teamList[choseData.index].select = false
    // 要选中的
    } else {
      if (choseList.length === this.data.limitNum) { // 超过8个不给选择了
        app.wxToast({
          title: '选择标签已达上限'
        })
        return
      } else {
        choseData.select = true
        choseList.push(choseData) // 不超过五个的，且没被选择的添加进去
        teamList[choseData.index].select = true
      }
    }
    this.setData({choseList, teamList})
  },
  getCustomLabel(e) {
    this.setData({customLabel: e.detail.value})
  },
  addLabel() {
    if (this.data.customLabel === '') return
    let data = {
      title: this.data.customLabel
    }
    let list = this.data.choseList
    let teamList = this.data.teamList
    let isRepeat = false
    list.map((item, index) => {
      if (item.title === this.data.customLabel) {
        app.wxToast({
          title: '标签重复，添加失败'
        })
        this.setData({
          customLabel: '',
          hidePop: true
        })
        isRepeat = true
        return
      }
    })
    if (isRepeat) return
    diyTeamlabApi(data).then(res => {
      let data = res.data
      data.title = this.data.customLabel
      data.select = true
      list.push(data)
      teamList.push(data)
      this.setData({
        customLabel: '',
        choseList: list,
        teamList,
        hidePop: true
      })
    }).catch((e) => {
      if (e.data.code === 413) {
        app.wxToast({
          title: '便签库已有此标签'
        })
        this.setData({
          customLabel: '',
          hidePop: true
        })
      }
    })
  },
  saveLabel() {
    if (this.data.choseList.length === 0) {
      app.wxToast({
        title: '请选择标签'
      })
      return
    }
    let listId = []
    this.data.choseList.map((item, index) => {
      listId.push(item.id)
    })
    let data = {
      labels: JSON.stringify(listId)
    }
    saveTeamlabApi(data).then(res => {
      app.wxToast({
        title: '提交成功',
        icon: "success",
        callback() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})