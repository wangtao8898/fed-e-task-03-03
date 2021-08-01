import { request } from '@/plugins/request'

// 登录
export const login = data => {
  return request({
    method: 'post',
    url: '/api/users/login',
    data
  })
}

// 注册
export const register = data => {
  return request({
    method: 'post',
    url: '/api/users',
    data
  })
}

// 关注
export const follow = username => {
  return request({
    method: 'post',
    url: `/api/profiles/${username}/follow`
  })
}

// 关注
export const unFollow = username => {
  return request({
    method: 'delete',
    url: `/api/profiles/${username}/follow`
  })
}