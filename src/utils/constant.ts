//services服务
const enum Server {
    DEVELOPMENT = 'https://demo.jousing.cn/api',
    LOCAL = 'http://192.168.10.4:8080/services/',
    PRODUCTION = 'https://www.jousing.cn/api'
}
//Gateway服务
const enum Gateway {
    DEVELOPMENT = 'https://demo.jousing.cn/api',
    LOCAL = 'http://192.168.10.4:8080/',
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