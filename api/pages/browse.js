import { request } from '../require.js'



// 浏览过的公司列表
export const getBrowseCompanyListByPageApi = (data, hasLoading) => {
  return request({
    url: '/browse/getBrowseCompanyListByPage',
    method: 'get',
    data,
    hasLoading
  })
}

// 浏览过的招聘官列表
export const getMyBrowseUsersListApi = (data, hasLoading) => {
  return request({
    url: '/browse/myBrowseUsers',
    method: 'get',
    data,
    hasLoading
  })
}

// 浏览过的职位列表
export const getMyBrowsePositionApi = (data, hasLoading) => {
  return request({
    url: '/browse/myBrowsePosition',
    method: 'get',
    data,
    hasLoading
  })
}

// 浏览过我的招聘官
export const getBrowseMySelfApi = (data, hasLoading) => {
  return request({
    url: '/browse/browseMySelf',
    method: 'get',
    data,
    hasLoading
  })
}

// 收藏我的(招聘端)
export const getCollectMySelfApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/collect/getCollectMySelf`,
    data,
    hasLoading
  })
}

// 我的收藏的(招聘端)
export const getMyCollectUsersApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/collect/myCollectUsers`,
    data,
    hasLoading
  })
}

// 删除查看用户
export const deleteBrowseUserApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/browse/deleteBrowseUser/${data.uid}`,
    data,
    hasLoading
  })
}

// 查询我感兴趣的
export const getSearchMyCollectListApi = (data, hasLoading) => {
  return request({
    url: '/collect/search_my_collect',
    method: 'get',
    data,
    hasLoading
  })
}