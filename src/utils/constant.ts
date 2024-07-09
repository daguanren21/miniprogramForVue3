import Taro from "@tarojs/taro";
const Gateway = {
  DEVELOP: 'https://device.demo.aedms.cn/',
  TRIAL: 'https://device.demo.aedms.cn/',
  RELEASE: 'https://www.aedms.cn/'
}
const MapKey = {
  DEVELOP: 'CPPBZ-E6UK6-GLBSK-EKWLH-4GLG6-C4FZF',
  TRIAL: 'CPPBZ-E6UK6-GLBSK-EKWLH-4GLG6-C4FZF',
  RELEASE: 'WMFBZ-DT3WS-JF7OW-63T53-2KLKV-57BIG'
}

const envVersion = Taro.getAccountInfoSync().miniProgram.envVersion;
type Tserver = 'DEVELOP' | 'TRIAL' | 'RELEASE';
console.log("envVersion", envVersion)
const serverName = (envVersion || 'develop').toLocaleUpperCase() as Tserver
//配置请求路径
export const baseUrl = Gateway[serverName] + 'services/'
export const gatewayUrl = Gateway[serverName]
//配置map jssdk key
export const qqMapKey = MapKey[serverName]
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
//邮箱校验
export const emailPattern = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z_-]+)+$/

export const mapGlobalConfigParams = {
    proviceLevelScaleFrom: 4,
    proviceLevelScaleTo: 6,
    cityLevelScaleFrom: 6,
    cityLevelScaleTo: 12,
    regionLevelScaleFrom: 9,
    regionLevelScaleTo: 12,
    pointLevelScaleFrom: 12,
    pointLevelScaleTo: 20,
}

export const educationalLevels = [{
    text: '未知',
    value: 'UNKNOWN'
}, {
    text: '小学',
    value: 'PRIMARY_SCHOOL'
}, {
    text: '初中',
    value: 'MIDDLE_SCHOOL'
}, {
    text: '高中',
    value: 'HIGH_SCHOOL'
}, {
    text: '专科',
    value: 'JUNIOR_COLLEGE'
}, {
    text: '本科',
    value: 'UNDERGRADUATE'
}, {
    text: '研究生',
    value: 'POST_GRADUATE'
}, {
    text: '博士',
    value: 'DOCTORAL'
}]
export const industryTypes = [{
    text: '其他',
    value: 'OTHER'
}, {
    text: '政府',
    value: 'GOVERNMENT'
}, {
    text: '教育',
    value: 'EDUCATION'
}, {
    text: '体育',
    value: 'SPORT'
}, {
    text: '医疗',
    value: 'MEDICAL'
}, {
    text: '金融',
    value: 'FINANCE'
}, {
    text: '交通',
    value: 'TRAFFIC'
}, {
    text: '企业',
    value: 'ENTERPRISE'
}, {
    text: '慈善/基金',
    value: 'CHARITY'
}]