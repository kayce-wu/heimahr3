import request from '@/utils/request'

/** *
 * 获取角色列表，根据接口文档，params是查询参数，和其他接口的请求体参数不一样，说白了就是params是加在URL后面的参数如/sys/role？参数，请求体参数就boy参数
 * **/
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params // 查询参数
  })
}

/** **
 * 新增角色
 * ***/

export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

/**
 * 更新角色
 * ***/

export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/** *
 * 删除角色
 * **/

export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 获取角色详情
 * **/

export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * 给角色分配权限
 *
 * ***/

export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
