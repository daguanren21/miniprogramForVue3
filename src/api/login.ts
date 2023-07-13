import { Method, request } from "~/request"

const api = {
    login: 'api/v1/authenticate/mini-program/wx-login',
    oneKeyLogin: 'api/v1/authenticate/mini-program/one-key-login',
}
/**
 * 获取wx登录信息
 * @param data 
 * @returns 
 */
export interface Auth {
    id_token: string,
    unionid: string,
}
export function fetchWxLogin(data: {
    appId: string,
    code: string
}): Promise<Auth> {
    return commonRequest({
        url: api.login,
        data: data,
        method: Method.POST
    })
}
export function fetchOneKeyLogin(data: {
    unionid:string,
    iv: string,
    encryptedData: string
}): Promise<Auth> {
    return commonRequest({
        url: api.oneKeyLogin,
        data: data,
        method: Method.POST
    })
}
