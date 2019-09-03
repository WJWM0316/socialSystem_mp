import { request } from '../require.js'

export const getUserInfoApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/cur/user_info',
    data,
    hasLoading: false
  })
}

export const postFormIdApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/wechat/mini/formIds',
    data,
    hasLoading: false
  })
}

export const getUserRoleApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/user/roleinfo',
    data,
    hasLoading: true
  })
}

