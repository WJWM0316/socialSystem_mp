import { request } from '../require.js'

// 生成职位二维码
export const getPositionQrcodeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/share/position_share',
    data,
    // host: 'PUBAPIHOST',
    hasLoading: hasLoading
  })
}

// 生成公司二维码
export const getCompanyQrcodeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/share/company_share',
    data,
    // host: 'PUBAPIHOST',
    hasLoading: hasLoading
  })
}

// 生成简历二维码
export const getResumerCodeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/share/resume_share',
    data,
    // host: 'PUBAPIHOST',
    hasLoading: hasLoading
  })
}

// 生成招聘官二维码
export const getRecruiterQrcodeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/share/recruiter_share',
    data,
    // host: 'PUBAPIHOST',
    hasLoading: hasLoading
  })
}

