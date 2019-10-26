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

let app = getApp()

Page({
  data: {
    id: '',
    area_id: '',
    doorplate: '',
    address: '',
    lng: '',
    lat: '',
    title: '',
    detail: app.globalData.recruiterDetails
  },
  onLoad(options) {
    this.setData({options})
    if(Reflect.has(options, 'id')) this.read(options)
  },
  onShow() {
    this.setData({detail: app.globalData.recruiterDetails})
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
    let getPermission = () => {
      wx.getSetting({
        success: rtn => {
          let statu = rtn.authSetting
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
    reverseGeocoder(res).then(rtn => {
      let formData = {}
      formData.address = `${res.address} ${res.name}`
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
    let type = this.data.options.type === 'position' ? 'Position' : 'Company'
    let action = `delete${type}Address`
    let that = this
    app.wxConfirm({
      title: '删除地址',
      content: '地址删除后将无法恢复，是否确定删除？',
      confirmBack() {
        let storage = wx.getStorageSync('createPosition')
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
    let type = this.data.options.type === 'position' ? 'Position' : 'Company'
    let action = `edit${type}Address`
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   新增地址
   * @return   {[type]}   [description]
   */
  post() {
    let type = this.data.options.type === 'position' ? 'Position' : 'Company'
    let action = `post${type}Address`
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   获取地址详情
   * @return   {[type]}   [description]
   */
  read(options) {
    let type = this.data.options.type === 'position' ? 'Position' : 'Company'
    let action = `get${type}AddressDetail`
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
      let infos = res.data
      let formData = {
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
    let infos = res.data
    let formData = {
      id: infos.id,
      area_id: infos.areaId,
      address: infos.address,
      doorplate: infos.doorplate,
      lng: infos.lng,
      lat: infos.lat
    }
    let id = this.data.options.id
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
    let infos = this.data
    let formData = {
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
    let action = this.data.options.id ? 'edit' : 'post'
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   删除公司地址
   * @return   {[type]}   [description]
   */
  deleteCompanyAddress() {
    deleteCompanyAddressApi({id: this.data.options.id}).then(() => wx.navigateBack({delta: 1}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-09
   * @detail   删除职位地址
   * @return   {[type]}   [description]
   */
  deletePositionAddress() {
    deletePositionAddressApi({id: this.data.options.id}).then(() => wx.navigateBack({delta: 1}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   添加职位地址
   * @return   {[type]}   [description]
   */
  postPositionAddress() {
    let orgData = wx.getStorageSync('orgData')
    let infos = this.data
    let formData = {
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
    //加个机构id
    if(this.data.detail.isCompanyTopAdmin) {
      if(orgData) formData = Object.assign(formData, {company_id: orgData.id})
    }
    addPositionAddressApi(formData).then(res => wx.navigateBack({delta: 1}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   添加公司地址
   * @return   {[type]}   [description]
   */
  postCompanyAddress() {
    let infos = this.data
    let formData = {
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
    addCompanyAddressApi(formData).then(res => wx.navigateBack({delta: 1}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-14
   * @detail   编辑职位地址
   * @return   {[type]}   [description]
   */
  editPositionAddress() {
    let infos = this.data
    let formData = {
      id: infos.id,
      areaId: infos.area_id,
      address: infos.address,
      lng: infos.lng,
      lat: infos.lat,
      doorplate: infos.doorplate
    }
    editPositionAddressApi(formData).then(() => {
      let storage = wx.getStorageSync('createPosition') || {}
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
    let infos = this.data
    let formData = {
      id: infos.id,
      area_id: infos.area_id,
      address: infos.address,
      lng: infos.lng,
      lat: infos.lat,
      doorplate: infos.doorplate
    }
    editCompanyAddressApi(formData).then(() => wx.navigateBack({delta: 1}))
  }
})