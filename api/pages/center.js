// 个人中心接口
import { request } from '../require'

// 获取当前用户微名片
export const getMicroCardApi = (data) => {
  return request({
    method: 'get',
    url: '/jobhunter/cur/card',
    data
  })
}
// 个人中心首页接口
export const getMyInfoApi = (data) => {
  return request({
    method: 'get',
    url: '/jobhunter/myInfo',
    data
  })
}
// 求职者个人基本信息
export const getBaseInfoApi = (data) => {
  return request({
    method: 'get',
    url: '/jobhunter/baseInfo',
    data
  })
}
// 编辑求职者个人基本信息
export const editBaseInfoApi = (data) => {
  return request({
    method: 'post',
    url: '/jobhunter/baseInfo',
    data
  })
}
// 查询当前简历完善度
export const getResumeStepApi = (data) => {
  return request({
    method: 'get',
    url: '/jobhunter/resume/step',
    data
  })
}
// 完善简历第一步
export const postfirstStepApi = (data) => {
  return request({
    method: 'post',
    url: '/jobhunter/resume/firstStep',
    data
  })
}
// 完善简历第二步
export const postSecondStepApi = (data) => {
  return request({
    method: 'post',
    url: '/jobhunter/resume/secondStep',
    data
  })
}
// 完善简历第三步
export const postThirdStepApi = (data) => {
  return request({
    method: 'post',
    url: '/jobhunter/resume/thirdStep',
    data
  })
}

// 求职端个人简历接口
export const getPersonalResumeApi = (data) => {
  return request({
    method: 'get',
    url: '/jobhunter/cur/resume',
    data,
    hasLoading: false
  })
}

// 获取他人简历接口
export const getOtherResumeApi = (data) => {
  return request({
    method: 'get',
    url: '/jobhunter/resume',
    data,
    hasLoading: true
  })
}

// 个人简历意向修改
export const editExpectApi = (data) => {
  return request({
    method: 'post',
    url: `/jobhunter/expect/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历意向删除
export const removeExpectApi = (data) => {
  return request({
    method: 'delete',
    url: `/jobhunter/expect/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历意向新增
export const addExpectApi = (data) => {
  return request({
    method: 'put',
    url: `/jobhunter/expect`,
    data,
    hasLoading: false
  })
}

// 个人简历工作经验修改
export const editCareerApi = (data) => {
  return request({
    method: 'post',
    url: `/jobhunter/career/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历工作经验新增
export const addCareerApi = (data) => {
  return request({
    method: 'put',
    url: `/jobhunter/career`,
    data,
    hasLoading: false
  })
}

// 个人简历工作经验删除
export const deleteCareerApi = (data) => {
  return request({
    method: 'delete',
    url: `/jobhunter/career/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历项目经验修改
export const editProjectApi = (data) => {
  return request({
    method: 'post',
    url: `/jobhunter/project/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历项目经验增加
export const addProjectApi = (data) => {
  return request({
    method: 'put',
    url: `/jobhunter/project`,
    data,
    hasLoading: false
  })
}

// 个人简历项目经验删除
export const deleteProjectApi = (data) => {
  return request({
    method: 'delete',
    url: `/jobhunter/project/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历教育经历修改
export const editEducationApi = (data) => {
  return request({
    method: 'post',
    url: `/jobhunter/education/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历教育经历增加
export const addEducationApi = (data) => {
  return request({
    method: 'put',
    url: `/jobhunter/education`,
    data,
    hasLoading: false
  })
}

// 个人简历教育经历删除
export const deleteEducationApi = (data) => {
  return request({
    method: 'delete',
    url: `/jobhunter/education/${data.id}`,
    data,
    hasLoading: false
  })
}

// 个人简历设置更多介绍
export const editIntroduceApi = (data) => {
  return request({
    method: 'post',
    url: `/jobhunter/introduce`,
    data,
    hasLoading: false
  })
}

// 获取步数
export const getStepApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/jobhunter/resume/four/step`,
    data,
    hasLoading: false
  })
}
// 创建第一步
export const getCreatFirstStepApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/jobhunter/resume/four/firstStep`,
    data,
    hasLoading: false
  })
}
export const postCreatFirstStepApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/jobhunter/resume/four/firstStep`,
    data,
    hasLoading: false
  })
}
// 创建第二步
export const getCreatSecondStepApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/jobhunter/resume/four/secondStep`,
    data,
    hasLoading: false
  })
}
export const postCreatSecondStepApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/jobhunter/resume/four/secondStep`,
    data,
    hasLoading: false
  })
}
// 创建第三步
export const getCreatThirdStepApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/jobhunter/resume/four/thirdStep`,
    data,
    hasLoading: false
  })
}
export const postCreatThirdStepApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/jobhunter/resume/four/thirdStep`,
    data,
    hasLoading: false
  })
}
// 创建第四步
export const getCreatFourthStepApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/jobhunter/resume/four/fourthStep`,
    data,
    hasLoading: false
  })
}
export const postCreatFourthStepApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/jobhunter/resume/four/fourthStep`,
    data,
    hasLoading: false
  })
}
export const postMicroApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/jobhunter/card`,
    data,
    hasLoading: hasLoading
  })
}

