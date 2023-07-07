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