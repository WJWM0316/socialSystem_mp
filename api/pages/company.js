import { request } from '../require.js'
import localstorage from '../../utils/localstorage.js'

// 添加机构
export const addCompanyApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/org',
    data,
    hasLoading: true
  })
}

// 获取公司机构列表
export const getCompanyOrglistApi = (data, hasLoading) => {
  return new Promise((resolve, reject) => {
    let orgList = localstorage.get('orgList')
    if (orgList) {
      resolve(orgList)
    } else {
      return request({
        method: 'get',
        url: `/company/orglist`,
        data,
        hasLoading: true
      }).then(res => {
        resolve(res)
        localstorage.set('orgList', {data: res.data, type: 'resetTheDay'})
      }).catch(e => {
        reject(e)
      })
    }
  })
}


// 用户申请加入公司
export const applyCompanyApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/apply',
    data,
    hasLoading: true
  })
}

// 用户编辑申请加入公司
export const editApplyCompanyApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/apply/${data.id}`,
    data,
    hasLoading: true
  })
}

// 判断是否有申请记录
export const hasApplayRecordApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/company/applyInfo',
    data,
    hasLoading: false
  })
}

// 更新申请加入方式
export const upJoinTypeApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/upJoinType',
    data,
    hasLoading: true
  })
}

// 填写身份信息
export const identityCompanyApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/identity',
    data,
    hasLoading: true
  })
}

// 填写身份信息(加入公司)
export const joinidentityApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/joinidentity',
    data,
    hasLoading: true
  })
}

// 创建公司
export const createCompanyApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/first_step',
    data,
    hasLoading: true
  })
}

// 用户编辑公司第一步
export const editCompanyFirstStepApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/edit_first_step/${data.id}`,
    data,
    hasLoading: true
  })
}

// 完善创建公司信息
export const perfectCompanyApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/self_help_verification/${data.id}`,
    data,
    hasLoading: true
  })
}

// 完善创建公司信息 上传营业执照
export const perfectCompanyByLicenseApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/business_license/${data.id}`,
    data,
    hasLoading: true
  })
}

// 获取公司信息
export const getCompanyInfosApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/${data.id}`,
    data,
    hasLoading: true
  })
}
export const getCurCompanyInfosApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/getCurrentCompany`,
    data,
    hasLoading: true
  })
}

// 编辑公司信息
export const editCompanyInfosApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/temp/${data.id}`,
    data,
    hasLoading: true
  })
}

// 删除公司
export const deleteCompanyApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/${data.id}`,
    hasLoading: true
  })
}

// 通过公司名判断公司是否存在
export const JustifyCompanyExistApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/${data.name}`,
    hasLoading: true
  })
}

// 编辑公司相册
export const editCompanyAlbumApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/album/${data.id}`,
    data,
    hasLoading: true
  })
}

// 添加公司地址
export const addCompanyAddressApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/address/${data.id}`,
    data,
    hasLoading: true
  })
}

// 添加职位地址
export const addPositionAddressApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/position/address`,
    data,
    hasLoading: true
  })
}

// 修改公司地址
export const editCompanyAddressApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/addressedit/${data.id}`,
    data,
    hasLoading: true
  })
}

// 修改职位地址
export const editPositionAddressApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/company/position/address/${data.id}`,
    data,
    hasLoading: true
  })
}

// 删除职位地址
export const deletePositionAddressApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/position/address/${data.id}`,
    hasLoading: true
  })
}

// 删除公司地址
export const deleteCompanyAddressApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/address/${data.id}`,
    hasLoading: true
  })
}

// 获取公司地址列表
export const getCompanyAddressListApi = (data, hasLoading) => {
  const id = data.id
  delete data.id
  return request({
    method: 'get',
    url: `/company/addresslist/${id}`,
    data,
    hasLoading: true
  })
}

// 获取职位地址列表
export const getPositionAddressListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/position/simplepage/addresses`,
    data,
    hasLoading: true
  })
}

// 获取地址详情
export const getAddressDetailApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/position/address/${data.id}`,
    data,
    hasLoading: true
  })
}

// 获取职位地址详情
export const getPositionAddressDetailApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/position/address/${data.id}`,
    data,
    hasLoading: true
  })
}

// 获取公司地址详情
export const getCompanyAddressDetailApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/address/${data.id}`,
    data,
    hasLoading: true
  })
}

// 创建公司产品
export const createCompanyProductApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/company/product',
    data,
    hasLoading: true
  })
}

// 获取公司产品信息
export const getCompanyProductInfosApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/product/${data.id}`,
    data,
    hasLoading: true
  })
}

// 编辑公司产品信息
export const editCompanyProductInfosApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/product/${data.id}`,
    data,
    hasLoading: true
  })
}

// 删除公司产品信息
export const deleteCompanyProductInfosApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/product/${data.id}`,
    data,
    hasLoading: true
  })
}

// 获取公司产品列表
export const getCompanyProductListsApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/productlist/${data.id}`,
    data,
    hasLoading: true
  })
}

// 获取身份信息
export const getCompanyIdentityInfosApi = (data) => {
  return request({
    method: 'get',
    url: `/company/identity`,
    data,
    hasLoading: data.hasLoading
  })
}

// 编辑身份信息 创建
export const editCompanyIdentityInfosApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/identity`,
    data,
    hasLoading: true
  })
}

// 编辑身份信息 加入
export const editIdentityJoinApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/joinidentity`,
    data,
    hasLoading: true
  })
}

// 删除身份信息
export const deleteCompanyIdentityInfosApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/company/identity/${data.id}`,
    data,
    hasLoading: true
  })
}

// 搜索公司
export const getCompanyNameListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/company_name`,
    data,
    hasLoading: true
  })
}

// 分页招聘团队
export const getRecruitersListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/recruiters/${data.id}`,
    data,
    hasLoading: true
  })
}

// 发送邮箱
export const sendEmailApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/company/new_mail`,
    data,
    hasLoading: true
  })
}

// 发送企业邮箱验证码
export const sendEnterpriseEmailApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/company/companyMail`,
    data,
    hasLoading: true
  })
}

// 验证企业邮箱验证码
export const verifyEnterpriseEmailApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/company/verifyCompanyMail`,
    data,
    hasLoading: true
  })
}

// 验证企业邮箱验证码
export const verifyEmailApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/company/new_verify`,
    data,
    hasLoading: true
  })
}

// 编辑公司部分信息
export const putCompanyInfoApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/part/${data.id}`,
    data,
    hasLoading: true
  })
}

// 编辑公司简介
export const putCompanyBriefApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/company/intro/${data.id}`,
    data,
    hasLoading: true
  })
}
// 通过公司名判断公司是否存在
export const justifyCompanyExistApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/exist/${data.name}`,
    data,
    hasLoading: true
  })
}

// 判断公司信息是否完善
export const getCompanyPerfectApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/perfect/${data.id}`,
    data,
    hasLoading: true
  })
}
// 发送加入公司通知给管理员
export const notifyadminApi = (data) => {
  return request({
    url: `/company/notifyadmin`,
    method: 'get',
    data,
    hasLoading: false
  })
}

// 获取公司职位类型列表
export const getOnlinePositionTypeApi = (data) => {
  return request({
    url: `/company/onlinePositionType/${data.companyId}`,
    method: 'get',
    data,
    hasLoading: false
  })
}

// 分页招聘团队
export const getCurrentCompanyRecruitersApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/currentCompanyRecruiters`,
    data,
    hasLoading: true
  })
}

// 获取公司职位类型列表
export const getCurrentCompanyOnlinePositionTypeApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/company/currentCompanyOnlinePositionType`,
    data,
    hasLoading: true
  })
}

// 当前绑定公司职位搜索列表
export const getCurrentCompanyPositionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/position/currentCompanyPositionList`,
    data,
    hasLoading: true
  })
}

