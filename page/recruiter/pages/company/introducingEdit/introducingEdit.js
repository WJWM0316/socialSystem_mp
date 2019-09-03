import {
  putCompanyBriefApi, 
  getCompanyInfosApi
} from '../../../../../api/pages/company.js'

import {companyIntroReg} from '../../../../../utils/fieldRegular.js'

let app = getApp()

Page({
  data: {
    intro: '',
    options: {}
  },
  onLoad(options) {
    this.setData({options})
    if(options.companyId) this.getCompanyDetail()
  },
  onShow() {
    const storage = wx.getStorageSync('createdCompany')
    this.setData({intro: storage.intro })
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
   * @DateTime 2019-01-02
   * @detail   获取公司详情
   * @return   {[type]}   [description]
   */
  getCompanyDetail() {
    const options = this.data.options
    getCompanyInfosApi({id: options.companyId}).then(res => {
      const intro = res.data.intro.replace(/\\n/g, '\n')
      this.setData({intro, options})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    const name = e.detail.value
    this.debounce(this.bindChange, null, 500, name)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   绑定值得改变
   * @return   {[type]}        [description]
   */
  bindChange(intro) {
    this.setData({intro})
  },
  save() {
    let id = this.data.options.companyId
    let intro = this.data.intro
    putCompanyBriefApi({id, intro}).then(res => {
      app.wxToast({title: '保存成功'})
      wx.navigateBack({delta: 1})
    })
  },

  submit() {
    const infos = this.data
    const storage = wx.getStorageSync('createdCompany')
    if(infos.options.companyId) {
      this.save()
    } else {
      storage.intro = infos.intro
      wx.setStorageSync('createdCompany', storage)
      wx.navigateBack({delta: 1})
    }
  }
})