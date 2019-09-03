import { getLabelProfessionalSkillsApi, getFieldListApi } from '../../../../../../api/pages/label.js'

import {RECRUITER} from '../../../../../../config.js'
let app = getApp()
Page({
  data: {
    professionalSkills: [],
    skills: [],
    limitNum: 3
  },
  /**
   * @return   {[type]}     [description]
   */
  onClick(e) {
    const params = e.currentTarget.dataset.item
    let professionalSkills = this.data.professionalSkills
    let skills = this.data.skills
    if (!params.active && skills.length >= this.data.limitNum) {
      app.wxToast({title: '最多可选择3个领域'})
      return
    }
    professionalSkills.map(field => {
      if(field.labelId === parseInt(params.fieldId) || field.labelId === parseInt(params.labelId)) field.active = !field.active
    })
    skills = professionalSkills.filter(field => field.active)
    this.setData({professionalSkills, skills})
  },
  onLoad(options) {
    this.getLabel(options)
  },
  /* positionTypeTopPid: 职业类型id */
  getLabel (options) {
    if (options.target === '2') {
      getFieldListApi().then(response => {
        const professionalSkills = response.data
        let skills = wx.getStorageSync('skillsLabel') || []
        skills.map((item, index) => {
          skills[index].active = true
          professionalSkills.map((n ,j) => {
            if (parseInt(item.fieldId) === n.labelId || item.labelId === n.labelId) {
              professionalSkills[j].active = true
            }
          })
        })
        this.setData({professionalSkills, skills})
      })
    } else {
      getLabelProfessionalSkillsApi().then(response => {
        let professionalSkills = []
        response.data.labelProfessionalSkills.forEach(item => {
          if (item.labelId === parseInt(options.positionTypeTopPid)) {
            professionalSkills = item.children
          }
        })
        let skills = wx.getStorageSync('skillsLabel') || []
        if (skills) { // 编辑职业技能标签
          skills.map((item, index) => {
            professionalSkills.map((n ,j) => {
              if (parseInt(item.labelId) === n.labelId) {
                professionalSkills[j].active = true
              }
            })
          })
          skills = professionalSkills.filter(field => field.active)
        }
        this.setData({professionalSkills, skills})   
      })
    }
  },
  submit() {
    if (this.data.skills.length === 0) {
      app.wxToast({
        title: '请选择标签'
      })
      return
    }
    wx.setStorageSync('skillsLabel', this.data.skills)
    app.wxToast({
      title: '保存成功',
      icon: 'success',
      callback() {
        wx.navigateBack({delta: 1})
      }
    })   
  }
})