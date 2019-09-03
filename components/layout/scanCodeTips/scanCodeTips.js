import {
  scanQrcodeApi,
  scanLoginApi
} from '../../../api/pages/common.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showScanBox: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
          let uuid = res.result.split('&')[0].slice(5)
          let params = {uuid}

          if(wx.getStorageSync('choseType') === 'RECRUITER') {
            params = Object.assign(params, {isBusiness: 1})
          } else {
            params = Object.assign(params, {isBusiness: 0})
          }
          
          scanQrcodeApi({uuid}).then(res => scanLoginApi(params).then(() => this.setData({showScanBox: false})))
        }
      })
    },
    showTips() {
      this.setData({showScanBox: !this.data.showScanBox})
    }
  }
})
