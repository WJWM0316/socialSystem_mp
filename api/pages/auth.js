import { request } from '../require.js'

export const getSessionKeyApi = (data, hasLoading) => {
  return request({
    url: '/wechat/oauth/mini',
    data,
    hasLoading: false
  })
}
export const checkSessionKeyApi = (data, hasLoading) => {
  return request({
    url: '/wechat/check/session',
    data,
    hasLoading: false
  })
}
export const loginApi = (data, hasLoading) => {
  return request({
  	method: 'post',
    url: '/wechat/login/mini',
    data,
    hasLoading: false
  })
}

// 用户退出
export const uploginApi = data => {
  return request({
    method: 'get',
    url: '/auth/wechat/mini/logout',
    data
  })
}
export const testLoginApi = data => {
  return request({
    method: 'post',
    url: '/auth/login',
    data
  })
}

export const sendCodeApi = data => {
  return request({
    method: 'post',
    url: '/bind/sendMessage',
    data,
    hasLoading: false
  })
}

export const bindPhoneApi = data => {
  return request({
    method: 'post',
    url: '/bind/register',
    data
  })
}
export const quickLoginApi = data => {
  return request({
    method: 'post',
    url: '/bind/quick_login',
    data
  })
}
export const changePhoneApi = data => {
  return request({
    method: 'post',
    url: '/bind/modify_mobile',
    data
  })
}
export const changeNewCaptchaApi = data => {
  return request({
    method: 'get',
    url: '/bind/new_captcha',
    data
  })
}

