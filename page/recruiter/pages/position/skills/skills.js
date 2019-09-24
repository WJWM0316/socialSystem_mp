import { getLabelProfessionalSkillsApi } from '../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    professionalSkills: [],
    skills: [],
    limitNum: 4
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   选择职业类别
   * @return   {[type]}     [description]
   */
  onClick(e) {
    let params = e.currentTarget.dataset
    let professionalSkills = this.data.professionalSkills
    let activeSkills = professionalSkills.filter(field => field.active)
    if(activeSkills.length < this.data.limitNum) {
      professionalSkills.map(field => {
        if(field.labelId === params.item.labelId) field.active = !field.active
      })
    } else {
      if(!params.item.active ) app.wxToast({title: `最多只能添加${this.data.limitNum}个标签`})
      professionalSkills.map(field => {
        if(field.labelId === params.item.labelId) field.active = false
      })
    }
    activeSkills = professionalSkills.filter(field => field.active)
    this.setData({professionalSkills, skills: activeSkills, canClick: activeSkills.length > 0})
  },
  onLoad() {
    getLabelProfessionalSkillsApi().then(response => {
      let storage = wx.getStorageSync('createPosition')
      let typeId = parseInt(storage.parentType)

      let professionalSkills = response.data.labelProfessionalSkills.find(field => field.labelId === typeId).children
      let temLabelId = storage.skills.map(field => field.labelId)
      let canClick = false
      if(temLabelId.length) {
        professionalSkills.map(field => field.active = temLabelId.includes(field.labelId) ? true : false)
        canClick = true
      } else {
        professionalSkills.map(field => field.active = false)
        canClick = false
      }
      this.setData({professionalSkills, skills: storage.skills, canClick})
    })
  },
  submit() {
    let storage = wx.getStorageSync('createPosition')
    storage.skills = this.data.skills
    wx.setStorageSync('createPosition', storage)
    wx.navigateBack({delta: 1})
  }
})