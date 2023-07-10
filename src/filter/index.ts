/**
 * @author zhangqihui
 */
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