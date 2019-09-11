import { request } from '../require.js'

// 生成职位二维码
export const getPositionQrcodeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/forward/position',
    data,
    hasLoading: hasLoading
  })
}

// 生成公司二维码
export const getCompanyQrcodeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/forward/company',
    data,
    hasLoading: hasLoading
  })
}

// 生成简历二维码
export const getResumerCodeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/forward/resume',
    data,
    hasLoading: hasLoading
  })
}

// 生成招聘官二维码
export const getRecruiterQrcodeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/forward/recruiter',
    data,
    hasLoading: hasLoading
  })
}

