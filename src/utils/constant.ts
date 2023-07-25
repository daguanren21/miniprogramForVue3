//services服务
const enum Server {
    DEVELOPMENT = 'https://demo.jousing.cn/api',
    LOCAL = 'http://192.168.10.91:8080/services/',
    PRODUCTION = 'https://www.jousing.cn/api'
}
//Gateway服务
const enum Gateway {
    DEVELOPMENT = 'https://demo.jousing.cn/api',
    LOCAL = 'http://192.168.10.91:8080/',
    PRODUCTION = 'https://www.jousing.cn/api'
}
const enum MapKey {
    DEVELOPMENT = 'CPPBZ-E6UK6-GLBSK-EKWLH-4GLG6-C4FZF',
    PRODUCTION = 'WMFBZ-DT3WS-JF7OW-63T53-2KLKV-57BIG'
}
//配置请求路径
export const baseUrl = Server.LOCAL
export const gatewayUrl = Gateway.LOCAL
//配置map jssdk key
export const qqMapKey = MapKey.DEVELOPMENT
//工作日
export const workDayOptions = [{
    value: '1',
    label: '周一',
}, {
    value: '2',
    label: '周二',
}, {
    value: '3',
    label: '周三',
}, {
    value: '4',
    label: '周四',
}, {
    value: '5',
    label: '周五',
}, {
    value: '6',
    label: '周六',
}, {
    value: '7',
    label: '周日',
},]

//手机号和固定号码校验
export const phoneAndFixPattern = /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-?\d{1,8})?$/
//手机号校验
export const phonePattern = /^1\d{10}$/