import { request } from '../require.js'


// 获取融资数据列表
export const getFinancingApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/company/financing',
    data,
    hasLoading: false
  })
}

//获取员工数据列表
export const getEmployeesApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/company/employees',
    data,
    hasLoading: false
  })
}

//获取所有学历定义
export const getDegreeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/degree/all',
    data,
    hasLoading: false
  })
}

//获取所有求职状态定义
export const getJobstatusApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/jobhunt_status/all',
    data,
    hasLoading: false
  })
}

//获取工作经验数据列表
export const getExperienceApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position/experience',
    data,
    hasLoading: false
  })
}
