/**
 * @author zhangqihui
 */
import dayjs from 'dayjs'
/**
 * @description 设备公开类型
 */
/**
 * 公开类型
 */
const enum DevicePublicType {
    PUBLIC = "PUBLIC",
    HALF = "HALF",
    NEVER = "NEVER",
    BUSINESS_HOURS = "BUSINESS_HOURS"
}
export type DotType = 'success' | 'error' | 'info' | 'warning' | 'default'
export const devicePublicFilter = (key: "PUBLIC" | "HALF" | "NEVER" | "BUSINESS_HOURS") => {
    let str = ""
    switch (key) {
        case DevicePublicType.PUBLIC:
            str = "全开放"
            break;
        case DevicePublicType.HALF:
            str = "半开放"
            break;
        case DevicePublicType.NEVER:
            str = "不开放"
            break;
        case DevicePublicType.BUSINESS_HOURS:
            str = "营业时间"
            break;
        default:
            break;
    }
    return str || '---'
}
/**
 * @description 数据为空展示
 */
export const noDataFilter = (str: string) => {
    if (str == null || str == undefined || str == "") {
        return '---'
    }
    if (typeof str == 'string') {
        return str.replace(/\ /g, "").replace(/\s/g, "")

    } else {
        return str
    }
}
/**
 * @description 距离解析
 */
export const distanceFilter = (distance: number) => {
    if (distance > 1000) {
        return (distance / 1000).toFixed(2) + '千米'
    }
    if (distance == 0 || distance) {
        return distance + '米'
    } else if (!distance) {
        return '未知'
    }
}

/**
 * @description 运行状态
 */
export const deviceRunningStateFilter = (key: 'UNKNOWN' | 'NORMAL' | 'ABNORMAL' | 'WARNING') => {
    let state: {
        type: DotType,
        text: string
    } = {
        type: 'default',
        text: ''
    }
    switch (key) {
        case 'UNKNOWN':
            state.type = 'default'
            state.text = '未知'
            break;
        case 'NORMAL':
            state.type = 'success'
            state.text = '正常'
            break;
        case 'ABNORMAL':
            state.type = 'error'
            state.text = '异常'
            break;
        case 'WARNING':
            state.type = 'warning'
            state.text = '预警'
            break;
        default:
            break;
    }
    return state
}

/**
 * @description 电池状态
 */
export const batteryStateFilter = (key: 'UNKNOWN' | 'NORMAL' | 'POWER_LOW' | 'POWER_RUN_OUT') => {
    let state: {
        type: DotType,
        text: string
    } = {
        type: 'default',
        text: ''
    }
    switch (key) {
        case 'UNKNOWN':
            state.type = 'default'
            state.text = '未知'
            break;
        case 'NORMAL':
            state.type = 'success'
            state.text = '正常'
            break;
        case 'POWER_RUN_OUT':
            state.type = 'error'
            state.text = '电量耗尽'
            break;
        case 'POWER_LOW':
            state.type = 'warning'
            state.text = '电量低'
            break;
        default:
            break;
    }
    return state
}
/**
 * @description 网络状态
 */
export const deviceNetworkStateFilter = (key: 'UNKNOWN' | 'ONLINE' | 'OFFLINE' | 'UNSTABLE') => {
    let state: {
        type: DotType,
        text: string
    } = {
        type: 'default',
        text: ''
    }
    switch (key) {
        case 'UNKNOWN':
            state.type = 'default'
            state.text = '未知'
            break;
        case 'ONLINE':
            state.type = 'success'
            state.text = '在线'
            break;
        case 'OFFLINE':
            state.type = 'error'
            state.text = '离线'
            break;
        case 'UNSTABLE':
            state.type = 'warning'
            state.text = '网络波动'
            break;
        default:
            break;
    }
    return state
}

/**
 * @description 位置状态
 */
export const positionStateFilter = (key: 'UNKNOWN' | 'IN_POSITION' | 'OUT_OF_POSITION') => {
    let state: {
        type: DotType,
        text: string
    } = {
        type: 'default',
        text: ''
    }
    switch (key) {
        case 'UNKNOWN':
            state.type = 'default'
            state.text = '未知'
            break;
        case 'IN_POSITION':
            state.type = 'success'
            state.text = '在位'
            break;
        case 'OUT_OF_POSITION':
            state.type = 'error'
            state.text = '离位'
            break;
        default:
            break;
    }
    return state
}

/**
 * @description 质保状态
 */
export const qualityAssuranceStateFilter = (key: 'UNKNOWN' | 'IN' | 'OUT') => {
    let state: {
        type: DotType,
        text: string
    } = {
        type: 'default',
        text: ''
    }
    switch (key) {
        case 'UNKNOWN':
            state.type = 'default'
            state.text = '未知'
            break;
        case 'IN':
            state.type = 'success'
            state.text = '质保中'
            break;
        case 'OUT':
            state.type = 'error'
            state.text = '已过保'
            break;
        default:
            break;
    }
    return state
}


export const dateFilter = (value: string, format: string = "YYYY-MM-DD HH:mm:ss") => {
    return value ? dayjs(value).format(format) : ''
}