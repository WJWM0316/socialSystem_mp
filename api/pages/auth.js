import { request } from '../require.js'



export const authLoginApi = (data, hasLoading) => {
  return request({
    url: '/auth/login',
    data,
    host: 'PUBAPIHOST',
    hasLoading: false
  })
}
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
export const checkSmsCodeApi = data => {
  return request({
    method: 'post',
    url: '/auth/check/sms/code',
    data
  })
}
export const getAuthCaptchaApi = data => {
  return request({
    method: 'get',
    url: '/auth/captcha',
    data
  })
}

export const checkImgCodeApi = data => {
  return request({
    method: 'post',
    url: '/auth/check/captcha',
    data
  })
}

export const sendWapCodeApi = data => {
  return request({
    method: 'post',
    url: '/auth/wap/message',
    data,
    hasLoading: false
  })
}

export const resetPswApi = data => {
  return request({
    method: 'post',
    url: `/auth/reset/password/${data.certificate}`,
    data,
    hasLoading: false
  })
}

export const pswLoginApi = data => {
  return request({
    method: 'post',
    url: '/auth/with/password/login',
    data,
    hasLoading: false
  })
}

export const setUserNameApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/cur/set/username/${data.username}`,
    hasLoading: true
  })
}

export const setPasswordApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/cur/set/password',
    data,
    hasLoading: true
  })
}

export const modifyPasswordApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/cur/modify/password',
    data,
    hasLoading: true
  })
}

export const checkSetPasswordApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/cur/check/has/password',
    data,
    hasLoading: true
  })
}