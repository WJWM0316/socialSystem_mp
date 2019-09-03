import { request } from '../require.js'

// 收藏的招聘官列表
export const getMyCollectUsersApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/collect/myCollectUsers',
    data,
    hasLoading: true
  })
}

// 收藏的职位列表
export const getMyCollectPositionsApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/collect/myCollectPositions',
    data,
    hasLoading: true
  })
}

// 收藏招聘官
export const getMyCollectUserApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/collect/collectUser/${data.uid}`,
    data,
    hasLoading: true
  })
}

// 取消收藏招聘官
export const deleteMyCollectUserApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/collect/collectUser/${data.uid}`,
    data,
    hasLoading: true
  })
}

// 收藏职位
export const getMycollectPositionApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/collect/collectPosition/${data.id}`,
    data,
    hasLoading: true
  })
}

// 取消收藏职位
export const deleteMycollectPositionApi = (data, hasLoading) => {
  return request({
    method: 'delete',
    url: `/collect/collectPosition/${data.id}`,
    data,
    hasLoading: true
  })
}

// 取消收藏职位(招聘端)
export const getBrowseMySelfApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/browse/browseMySelf`,
    data,
    hasLoading: true
  })
}

// 收藏我的(招聘端)
export const getCollectMySelfApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/collect/getCollectMySelf`,
    data,
    hasLoading: true
  })
}