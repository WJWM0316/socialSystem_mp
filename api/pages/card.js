import { request } from '../require.js'

// 职位长图
export const getPositionCardApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/sharecard',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 精美职位
export const getPositionMinCardApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/sharecard',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 简历
export const getResumeCardApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/sharecard',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 招聘官
export const getRecruiterCardApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/sharecard',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}

// 公司
export const getCompanyCardApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/sharecard',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}


// 面试
export const getInterviewCardApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/sharecard',
    data,
    host: 'NODEHOST',
    hasLoading: hasLoading
  })
}
