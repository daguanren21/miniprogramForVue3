import { Method, request } from "~/request"

const api = {
    base: '/v1/mini-program/public',
    auth: '/v1/authenticate/mini-aed',
    feedBack: '/v1/mini-program/feed-backs',
}
/**
 * 获取wx登录信息
 * @param data 
 * @returns 
 */
export interface Auth {
    id_token: string,
    unionid: string,
    openid: string,
    phoneNumber: string
}
export function wxLogin(data: {
    appId: string,
    code: string
}): Promise<Auth> {
    return request({
        url: api.auth + '/wx',
        data: data,
        method: Method.POST
    })
}
