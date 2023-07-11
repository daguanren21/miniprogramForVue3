
const api = {
    public: 'device/api/v1/mini-program/public/'
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
export function fetchLatelyDevices(data:{
    distance:number,
    latFrom: number,
    lngFrom: number,
}): Promise<Index.DeviceInfo[]> {
    return request({
        url: api.public + 'device/nearby-device',
        data: data,
        method: Method.GET
    })
}