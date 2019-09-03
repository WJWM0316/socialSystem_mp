// 通用接口api
import { request } from '../require'

export const unloadApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/cur/user_info',
    data,
    hasLoading: false
  })
}
export const upLoadApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/attaches',
    data,
    hasLoading: false
  })
}
// 职位列表数据接口
export const getPostionApi = (data) => {
  return request({
    method: 'get',
    data,
    url: '/label/positionType'
  })
}
// 职位标签接口
export const getJobLabelApi = (data) => {
  return request({
    method: 'get',
    data,
    url: '/label/professionalSkills'
  })
}
// 生活标签接口
export const getLifeLabelApi = (data) => {
  return request({
    method: 'get',
    data,
    url: '/label/life'
  })
}
// 城市标签
export const getCityLabelApi = (data) => {
  return request({
    method: 'get',
    data,
    url: '/area/hotArea',
  })
}
// 创建职位标签接口
export const addJobLabelApi = (data) => {
  return request({
    method: 'post',
    data,
    url: '/label/professionalSkills'
  })
}
// 创建生活标签接口
export const addLifeLabelApi = (data) => {
  return request({
    method: 'post',
    data,
    url: '/label/life'
  })
}
// 保存求职者标签
export const saveLabelApi = (data) => {
  return request({
    method: 'post',
    data,
    url: '/jobhunter/labels'
  })
}
// 保存招聘官标签
export const saveRecruiterLabelApi = (data) => {
  return request({
    method: 'post',
    data,
    url: '/recruiter/label'
  })
}

// 行业领域列表
export const getLabelFieldApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/label/field',
    data,
    hasLoading: false
  })
}


// 删除附件
export const removeFileApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/attaches/${data.id}`,
    data,
    hasLoading: false
  })
}

// 收集formID
export const formIdApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/wechat/mini/form_ids`,
    data,
    hasLoading: false
  })
}

// 获取上传附件
export const getAttachResumeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/jobhunter/attach_resume`,
    hasLoading: false
  })
}

// 扫码回调
export const scanQrcodeApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/qrcode/scan_qrcode`,
    data,
    hasLoading: false
  })
}


// 确认登录
export const scanLoginApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/qrcode/login`,
    data,
    hasLoading: false
  })
}

// 分享统计
export const shareStatistics  = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/share/share_event`,
    data,
    host: 'PUBAPIHOST',
    hasLoading: false
  })
}

// 浏览统计
export const readyStatistics  = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/share/check_in_event`,
    data,
    host: 'PUBAPIHOST',
    hasLoading: false
  })
}

// 获取banner
export const getAdBannerApi  = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/banner`,
    data,
    hasLoading: false
  })
}

// 获取广告位
export const getAdApi  = (data, hasLoading) => {
  return request({
    name: 'getAdApi',
    method: 'get',
    url: `/get/advertisement/lists`,
    data,
    host: 'PUBAPIHOST',
    hasLoading
  })
}

// 点击按钮记录
export const touchVkeyApi  = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/touch/${data.vkey}`,
    data,
    host: 'PUBAPIHOST',
    hasLoading: false
  })
}

// 获取缓存接口版本列表
export const getVersionListApi  = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/version/cache/lists`,
    data,
    host: 'PUBAPIHOST',
    hasLoading: false
  })
}

// 清除列表红点
export const clearReddotApi  = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/reddot/clear/${data.jobHunterUid}`,
    data,
    hasLoading: false
  })
}
