import {
  editCompanyAlbumApi,
  getCompanyInfosApi
} from '../../../../../api/pages/company.js'

let app = getApp()

Page({
  data: {
    imgList: [],
    options: {},
    limitNum: 20
  },
  onLoad(options) {
    this.setData({options})
    this.getCompanyDetail(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   获取公司详情
   * @return   {[type]}   [description]
   */
  getCompanyDetail(options) {
    getCompanyInfosApi({id: options.companyId})
      .then(res => {
        this.setData({imgList: res.data.albumInfo})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   上传图片
   * @return   {[type]}     [description]
   */
  upload(e) {
    const imgList = this.data.imgList
    e.detail.map((item, index) => {
      imgList.push(item)
    })
    this.setData({imgList, limitNum: 20 - this.data.imgList.length}) 
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   删除图片
   * @return   {[type]}     [description]
   */
  delete(e) {
    const params = e.currentTarget.dataset
    const imgList = this.data.imgList
    imgList.splice(params.index, 1)
    this.setData({imgList})
  },
  submit() {
    const images = this.data.imgList.map(field => field.id)
    const id = this.data.options.companyId
    editCompanyAlbumApi({id, images: images.join(',')})
      .then(() => {
        app.wxToast({title: '保存成功'})
        wx.navigateBack({delta: 1})
      })
  }
})