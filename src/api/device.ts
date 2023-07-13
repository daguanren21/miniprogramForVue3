const api = {
    public: 'device/api/v1/mini-program/public/',
    manage: 'device/api/v1/mini-program/device-manager/'
}
/**
 * 查询区域内设备
 * @param minLat:最小纬度
 * @param maxLat:最大纬度
 * @param minLng:最小经度
 * @param maxLng:最大经度
 * @returns 
 */
export interface DeviceMap {
    deployedAreaLatitude: number;
    deployedAreaLongitude: number;
    id: number
}
export function fetchRegionDevices(data: {
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
}): Promise<DeviceMap[]> {
    return request({
        url: api.public + 'region-devices',
        data: data,
        method: Method.GET
    })
}

/**
 * 查询设备详情
 * @param deviceId:最小纬度
 * @param latFrom:用户所在纬度
 * @param lngFrom:用户所在经度
 * @returns 
 */
export function fetchRegionDeviceInfo(data: {
    deviceId: number,
    latFrom: number,
    lngFrom: number,
}): Promise<Index.DeviceInfo> {
    return request({
        url: api.public + 'device',
        data: data,
        method: Method.GET
    })
}

/**
 * 查询附近的AED
 * @param distance 距离
 * @param latFrom:用户所在纬度
 * @param lngFrom:用户所在经度
 */
export function fetchLatelyDevices(data: {
    distance: number,
    latFrom: number,
    lngFrom: number,
}): Promise<Index.DeviceInfo[]> {
    return request({
        url: api.public + 'device/nearby-device',
        data: data,
        method: Method.GET
    })
}

/**
 * 查询运维管理设备
 * @param keyword 关键字(序列号,地址,归属单位)
 * @param runningState 状态
 * @param brandId 品牌
 * @param placeId 安装场所
 * @param positionState 位置状态
 * @param hasRescueData 是否有抢救数据
 * @param mobile 是否可移动
 * @param provinceId 省份
 * @param cityId 城市
 * @param districtId 区域
 * @param streetId 街道
 */
export function fetchManageDevices(data: Partial<Manage.DeviceSearch> & Manage.Page): Promise<{
    content: Manage.DeviceList[]
    totalCount: number
    totalPage: number
}> {
    return request({
        url: api.manage + 'devices-list',
        data: data,
        method: Method.GET
    })
}
/**
 * @description 获取设备信息详情
 * @returns 
 */
export function fetchManageDeviceInfo(id: number): Promise<Manage.DeviceInfo> {
    return request({
        url: api.manage + 'devices/' + id,
        method: Method.GET
    })
}