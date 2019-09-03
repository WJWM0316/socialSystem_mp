// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editIntroduceApi } from '../../../../../../api/pages/center.js'
//let introduce = '' // 当前输入的内容
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limitNum: 20,
    imgList: [], // 图片数组
    introduce: '' // 当前输入的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id === 'undefined') {
      let limitNum = this.data.limitNum
      limitNum = limitNum - app.globalData.resumeInfo.moreIntroduce.imgs.length
      this.setData({
        isAdd: true,
        limitNum,
        imgList: app.globalData.resumeInfo.moreIntroduce.imgs,
        introduce: app.globalData.resumeInfo.moreIntroduce.introduce
      })
    }
  },
  // 上传图片
  getResult (e) {
    let limitNum = this.data.limitNum
    limitNum = limitNum - e.detail.length
    let imgList = [...this.data.imgList, ...e.detail]
    this.setData({
      imgList,
      limitNum
    })
  },
  delImg (e) {
    const index = e.currentTarget.dataset.imgindex
    let limitNum = this.data.limitNum
    limitNum++
    this.data.imgList.splice(index,1)
    const imgList = this.data.imgList
    this.setData({
      imgList,
      limitNum
    })
  },
  // 编辑自我介绍
  writeContent (e) {
    if (e.detail.value === ' ') {
      this.setData({
        introduce: ''
      })
    } else {
      this.setData({
        introduce: e.detail.value
      })
    }
  },
  previewImg(e) {
    let imgList = this.data.imgList
    let list = []
    imgList.map((item) => {
      list.push(item.url)
    })
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  // 编辑保存
  save () {
    let upLoadList = '' // 装用于上传的图片id
    this.data.imgList.map((item, index) => {
      if (!upLoadList) {
        upLoadList = `${item.id}`
      } else {
        upLoadList = `${upLoadList},${item.id}`
      }
    })
    const param = {
      introduce: this.data.introduce,
      attachIds: upLoadList
    }
    editIntroduceApi(param).then(res => {
      app.globalData.resumeInfo.moreIntroduce.imgs = this.data.imgList
      app.globalData.resumeInfo.moreIntroduce.introduce = this.data.introduce
      app.wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          wx.navigateBack({delta: 1})
        }
      })
    })
  }
})