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
        .split(';')
        .map((v) => weekShowDays[v])
        .join('、') : ''
}

/**
 * @description 保证图片个数（4个）
 */
export  const getImages = (deployedImageUrls:string,len:number=4) => {
    let images:string[] = deployedImageUrls.split(';');
    if (images.length < len) {
        images = images.concat(new Array(len - images.length).fill(null))
    }
    return images
}