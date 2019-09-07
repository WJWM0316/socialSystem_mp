import {
  getPositionAddressDetailApi,
  getCompanyAddressDetailApi,
  editCompanyAddressApi,
  editPositionAddressApi ,
  addCompanyAddressApi,
  addPositionAddressApi,
  deletePositionAddressApi,
  deleteCompanyAddressApi
} from "../../../../../api/pages/company.js"

import {COMMON, RECRUITER} from '../../../../../config.js'

import { reverseGeocoder } from '../../../../../utils/map.js'

const app = getApp()

Page({
  data: {
    id: '',
    area_id: '',
    doorplate: '',
    address: '',
    lng: '',
    lat: '',
    title: ''
  },
  onLoad(options) {
    this.setData({options})
    if(options.id) this.read(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    this.setData({doorplate: e.detail.value})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   选择地址
   * @return   {[type]}   [description]
   */
  selectAddress() {
    let that = this
    // 获取权限
    const getPermission = () => {
      wx.getSetting({
        success: rtn => {
          const statu = rtn.authSetting
          if(!statu['scope.userLocation']) {
            app.wxConfirm({
              title: '是否授权当前位置',
              content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
              confirmBack() {
                wx.openSetting({
                  success: res1 => {
                    if(res1.authSetting['scope.userLocation'] === true) {
                      app.wxToast({title: '授权成功'})
                      //授权成功之后，再调用chooseLocation选择地方
                      wx.chooseLocation({success: res => {
                        that.reverseGeocoder(res)
                        }
                      })
                    } else {
                      app.wxToast({title: '授权失败'})
                    }
                  }
                })
              }
            })
          }
        },
        fail: fail => {
          app.wxToast({title: '调用授权窗口失败'})
        }
      })
    }

    wx.chooseLocation({
      success: res => that.reverseGeocoder(res),
      fail: res => {
        getPermission()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   转换地址信息
   * @return   {[type]}       [description]
   */
  reverseGeocoder(res) {
    const storage = wx.getStorageSync('createPosition')
    const formData = {}
    formData.address = `${res.address} ${res.name}`
    formData.lat = res.latitude
    formData.lng = res.longitude
    Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
    reverseGeocoder(res)
      .then(rtn => {
        const formData = {}
        formData.address = `${rtn.result.address} ${rtn.result.address_reference.landmark_l2.title}`
        formData.area_id = rtn.result.ad_info.adcode
        formData.lat = rtn.result.ad_info.location.lat
        formData.lng = rtn.result.ad_info.location.lng
        formData.title = rtn.result.ad_info.location.lng
        Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   删除地址
   * @return   {[type]}   [description]
   */
  delete() {
    const type = this.data.options.type === 'position' ? 'Position' : 'Company'
    const action = `delete${type}Address`
    const that = this
    app.wxConfirm({
      title: '删除地址',
      content: '地址删除后将无法恢复，是否确定删除？',
      confirmBack() {
        const storage = wx.getStorageSync('createPosition')
        // 如果删除的地址于之前选择的地址
        if(storage.address_id === that.data.id) {
          storage.address = ''
          storage.address_id = ''
          wx.setStorageSync('createPosition', storage)
        }
        that[action]()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   编辑地址
   * @return   {[type]}   [description]
   */
  edit() {
    const type = this.data.options.type === 'position' ? 'Position' : 'Company'
    const action = `edit${type}Address`
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   新增地址
   * @return   {[type]}   [description]
   */
  post() {
    const type = this.data.options.type === 'position' ? 'Position' : 'Company'
    const action = `post${type}Address`
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   获取地址详情
   * @return   {[type]}   [description]
   */
  read(options) {
    const type = this.data.options.type === 'position' ? 'Position' : 'Company'
    const action = `get${type}AddressDetail`
    this[action](options)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   获取职位地址
   * @return   {[type]}   [description]
   */
  getPositionAddressDetail(options) {
    getPositionAddressDetailApi({id: options.id}).then(res => {
      const infos = res.data
      const formData = {
        id: infos.id,
        area_id: infos.areaId,
        address: infos.address,
        doorplate: infos.doorplate,
        lng: infos.lng,
        lat: infos.lat
      }
      Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   获取公司地址
   * @return   {[type]}   [description]
   */
  getCompanyAddressDetail(options) {
    const infos = res.data
    const formData = {
      id: infos.id,
      area_id: infos.areaId,
      address: infos.address,
      doorplate: infos.doorplate,
      lng: infos.lng,
      lat: infos.lat
    }
    const id = this.data.options.id
    getCompanyAddressDetailApi({id}).then(res => {
      
      Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   提交地址
   * @return   {[type]}   [description]
   */
  submit() {
    const infos = this.data
    const formData = {
      areaId: infos.area_id,
      address: infos.address,
      doorplate: infos.doorplate,
      lng: infos.lng,
      lat: infos.lat
    }
    if(!formData.address) {
      app.wxToast({title: '请选择公司地址'})
      return
    }
    if (this.data.options.type === 'addOrganization') {
      wx.setStorageSync('addAddress', formData)
      wx.navigateBack({delta: 1})
      return
    }
    const action = this.data.options.id ? 'edit' : 'post'
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   删除公司地址
   * @return   {[type]}   [description]
   */
  deleteCompanyAddress() {
    deleteCompanyAddressApi({id: this.data.options.id}).then(() => {
      wx.navigateBack({delta: 1})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   删除职位地址
   * @return   {[type]}   [description]
   */
  deletePositionAddress() {
    deletePositionAddressApi({id: this.data.options.id}).then(() => {
      wx.navigateBack({delta: 1})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   添加职位地址
   * @return   {[type]}   [description]
   */
  postPositionAddress() {
    const infos = this.data
    const formData = {
      areaId: infos.area_id,
      address: infos.address,
      doorplate: infos.doorplate,
      lng: infos.lng,
      lat: infos.lat
    }
    if(!formData.address) {
      app.wxToast({title: '请选择公司地址'})
      return
    }
    if (this.data.options.type === 'addOrganization') {
      wx.setStorageSync('addAddRess', formData)
      return
    }
    addPositionAddressApi(formData).then(res => {
      wx.navigateBack({delta: 1})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   添加公司地址
   * @return   {[type]}   [description]
   */
  postCompanyAddress() {
    const infos = this.data
    const formData = {
      area_id: infos.area_id,
      address: infos.address,
      doorplate: infos.doorplate,
      lng: infos.lng,
      lat: infos.lat,
      id: app.globalData.recruiterDetails.companyInfo.id
    }
    if(!formData.address) {
      app.wxToast({title: '请选择公司地址'})
      return
    }
    addCompanyAddressApi(formData).then(res => {
      wx.navigateBack({delta: 1})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-14
   * @detail   编辑职位地址
   * @return   {[type]}   [description]
   */
  editPositionAddress() {
    const infos = this.data
    const formData = {
      id: infos.id,
      areaId: infos.area_id,
      address: infos.address,
      lng: infos.lng,
      lat: infos.lat,
      doorplate: infos.doorplate
    }
    editPositionAddressApi(formData).then(() => {
      const storage = wx.getStorageSync('createPosition') || {}
      storage.address_id = infos.id
      storage.address = infos.address
      wx.setStorageSync('createPosition', storage)
      wx.navigateBack({delta: 1})
      // wx.redirectTo({url: `${RECRUITER}position/addressList/addressList?type=position&selected=${this.data.options.selected}`})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-14
   * @detail   编辑公司地址
   * @return   {[type]}   [description]
   */
  editCompanyAddress() {
    const infos = this.data
    const formData = {
      id: infos.id,
      area_id: infos.area_id,
      address: infos.address,
      lng: infos.lng,
      lat: infos.lat,
      doorplate: infos.doorplate
    }
    editCompanyAddressApi(formData).then(() => {
      wx.navigateBack({delta: 1})
      // wx.redirectTo({url: `${RECRUITER}position/addressList/addressList?type=company&selected=${this.data.options.selected}`})
    })
  }
})