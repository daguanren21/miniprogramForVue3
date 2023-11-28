import Taro from "@tarojs/taro"
import { DotType } from "~/filter"

export const weekDays = {
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日',
}
export const weekShowDays = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
}
/**
 * @description workday格式化
 */

export const showWeekDays = (workDay: string) => {
    return workDay ? '周' + workDay
        .split(';').sort()
        .map((v) => weekShowDays[v])
        .join('、') : ''
}

/**
 * @description 保证图片个数（4个）
 */
export const getImages = (deployedImageUrl: string, len: number = 4) => {
    let images: string[] = deployedImageUrl ? deployedImageUrl.split(';') : [];
    if (images.length < len) {
        images = images.concat(new Array(len - images.length).fill(null))
    }
    return images
}
export function handleImages(images) {
    return images ? images.split(';').filter(v => v) : []
}
export const preview = (images) => {
    //处理图片
    Taro.previewImage({
        urls: images
    })
}
export const filter = (type: DotType) => {
    let state = {
        color: '',
        bgColor: '',
        borderColor: '',
    }
    switch (type) {
        case 'success':
            state.color = '#32B44B';
            state.borderColor = '#32B44B';
            state.bgColor = '#E0F4E4'
            break;
        case 'default':
            state.color = '#409EFF';
            state.borderColor = '#409EFF';
            state.bgColor = '#E0E4FF'
            break;
        case 'error':
            state.color = '#fff';
            state.borderColor = '#FF0000';
            state.bgColor = '#FF0000'
            break;
        case 'warning':
            state.color = '#FF9710';
            state.borderColor = '#FF9710';
            state.bgColor = '#FFF4DF'
            break;
        default:
            break;
    }
    return state
}
//过滤html标签以及&nbsp
export function removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
    return str;
}
export const parseDeviceSn = qrCode => {
    if (!qrCode) {
        return ''
    }
    if (qrCode.indexOf("?") != -1) {
        return parseDeviceSnFromUrl(qrCode)
    } else {
        return qrCode
    }
}
export const parseDeviceSnFromUrl = url => {
    if (!url) {
        return ''
    }
    let parameterStrIndex = url.indexOf("?")
    if (parameterStrIndex == -1) {
        return ''
    }
    let parameterStr = url.substring(parameterStrIndex + 1)
    let parameterArr = parameterStr.split("&")
    if (parameterArr.length <= 0) {
        return ''
    }
    if (parameterArr[0].indexOf('assetNumber=') == -1) {
        return ''
    }
    return (parameterArr[0].split('='))[1]
}