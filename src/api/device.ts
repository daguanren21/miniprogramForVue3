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
    areaLongitude: number;
    areaLatitude: number;
    deployedAreaLatitude: number;
    deployedAreaLongitude: number;
    level: number | null;
    name: string | null;
    id: number
}
export function fetchRegionDevices(data: {
    level: number,
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
 * 根据资产编号详情
 * @param deviceId:最小纬度
 * @param latFrom:用户所在纬度
 * @param lngFrom:用户所在经度
 * @returns 
 */
export function fetchDeviceInfoByAssetNumber(assetNumber: string): Promise<Manage.DeviceInfo> {
    return request({
        url: api.manage + 'devices/by-assetNumber',
        data: {
            assetNumber
        },
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

/**
 * @description 保存设备信息
 * @returns 
 */
export function saveDevices(data: Manage.DeviceSaveForm): Promise<void> {
    return request({
        url: api.manage + 'devices/improve-device-info',
        data,
        method: Method.POST
    })
}

/**
 * @description 根据编号查询
 * @returns 
 */
export interface DeviceBySearialNumber {
    brandId: number,
    brandName: string,
    deviceId: number,
    runningState: Filter.RunningState,
    serialNumber: string
}
export function fetchDevicesBySearialNumber(serialNumber: string): Promise<DeviceBySearialNumber[]> {
    return request({
        url: api.manage + 'devices/by-serialNumber',
        data: {
            serialNumber
        },
        method: Method.GET
    })
}


export interface DeviceCheckRecord {
    deviceId: number;
    deviceSerialNumber: string;
    id: number;
    imagesPath: string;
    newRunningState: Filter.RunningState;
    oldRunningState: Filter.RunningState;
    remarks: string;
    state: Filter.CheckState;
    createdDate: string
}
/**
 * @description 分页查询设备审核记录
 * @param  
 * @returns 
 */
export function fetchDeviceCheckRecords(data: {
    page: number,
    size: number,
}): Promise<{
    content: DeviceCheckRecord[];
    totalCount: number;
    totalPage: number;
}> {
    return request({
        url: api.manage + 'device-check-records',
        data,
        method: Method.GET
    })
}

/**
 * @description 分页查询设备异常清单
 * @param  
 * @returns 
 */
export interface DeviceExceptionRecord {
    address: string;
    brandId: number;
    brandLogo: string;
    brandName: string;
    deviceId: number;
    exceptionReason: string;
    batteryInvalidDate: string;
    electrodeInvalidDate: string;
    exceptionCode: number;
    exceptionTime: string;
    handleTime: string;
    id: number;
    lastNoticeTime: string;
    noticeNumber: number;
    repairRecordId: number;
    serialNumber: string;
    smsContent: string;
    source: string;
    state: string;
    type: Filter.RunningState;
}
export function fetchDeviceExceptionRecords(data: {
    page: number,
    size: number
    type: 'ABNORMAL' | 'WARNING'
}): Promise<{
    content: DeviceExceptionRecord[];
    totalCount: number;
    totalPage: number;
}> {
    return request({
        url: api.manage + 'device-exception-record',
        data,
        method: Method.GET
    })
}
/**
 * @description 设备报修
 * @param data 
 */
export function updateReportToRepairRecords(data: {
    deviceId: number | string,
    description: string,
    imagesPath: string
}): Promise<void> {
    return request({
        url: api.manage + 'report-to-repair-records',
        data,
        method: Method.POST
    })
}

/**
 * @description 设备巡检
 * @param data 
 * @returns 
 */
export function updateRegularInspectionRecords(data: {
    deviceId: number | string,
    content: string,
    electrodePackageNormalBoolean: boolean | string,
    electrodeState: Filter.RunningState,
    runningState: Filter.RunningState,
    imagesPath: string
}): Promise<void> {
    return request({
        url: api.manage + 'regular-inspection-records',
        data,
        method: Method.POST
    })
}

/**
 * @description 设备维护
 * @param data 
 */
export function updateMaintainRecords(data: {
    deviceId: number | string,
    content: string,
    // runningState: Filter.RunningState,
    imagesPath: string
}): Promise<void> {
    return request({
        url: api.manage + 'maintain-records',
        data,
        method: Method.POST
    })
}

/**
 * @description 移机 = 设备位置变更
 * @param data 
 */
export function updatePosition(data: {
    address: string;
    deployedImagePath: string;
    deployedLatitude: number;
    deployedLongitude: number;
    deviceId: number | string;
    placeId: number;
    regionId: number[];
}): Promise<void> {
    return request({
        url: api.manage + 'devices/update-position',
        data,
        method: Method.PUT
    })
}
/**
 * @description 移机 = 删除设备
 * @param data 
 */
export function deleteDevice(data: {
    deleteReason: string,
    deviceId: number | string
}): Promise<void> {
    return request({
        url: api.manage + 'devices/delete',
        data,
        method: Method.DELETE
    })
}

/**
 * @description 状态变更
 * @param data 
 */
export function updateDeviceStateChange(data: {
    deviceId: number | string;
    imagesPath: string;
    newRunningState: Filter.RunningState;
    remarks?: string;
}): Promise<void> {
    return request({
        url: api.manage + 'device-check-records',
        data,
        method: Method.POST
    })
}

/**
 * @description 设备审核
 * @param data 
 */
export function updateDeviceCheckRecords(data: {
    id: number;
    remarks: string;
    state: Filter.CheckState;
}): Promise<void> {
    return request({
        url: api.manage + 'device-check-records/check',
        data,
        method: Method.POST
    })
}

/**
 * @description 设备抢救记录
 * @param data 
 */
export function updateDeviceRescueData(data: {
    deviceId: number | string;
    useRescued: boolean;
    dischargeCount: number;
    patientAge: number | string;
    patientEventTrigger: string;
    patientSex: number | null;
    patientUnderlyingDisease: string;
    rescueBeginTime: string;
    rescueEndTime: string;
    successfulRescued: boolean | null;
    address: string
}): Promise<void> {
    return request({
        url: api.manage + 'rescue-data',
        data,
        method: Method.POST
    })
}

/**
 * @description 通知维护
 * @param id 异常设备id
 * @returns 
 */
export function updateNotice(id: number): Promise<void> {
    return request({
        url: api.manage + `device-exception-record/${id}`,
        method: Method.PUT
    })
}

/**
 * @description 异常清单处理
 * @param data 
 */
export function updateRepairApplyRecord(data: {
    id: number,
    advice: string,
    handleState: string,
}): Promise<void> {
    return request({
        url: api.manage + `repair-apply-records/${data.id}`,
        data,
        method: Method.PUT
    })
}

/**
 * @description 更换耗材
 */
export function updateDevicePart(data: {
    deviceId: number | string,
    batteryInvalidDate?: string,
    electrodeInvalidDate?: string,
}): Promise<void> {
    let { batteryInvalidDate, electrodeInvalidDate, deviceId } = data
    if (batteryInvalidDate) {
        return request({
            url: api.manage + `devices/update-battery`,
            data: {
                deviceId,
                batteryInvalidDate
            },
            method: Method.PUT
        })
    }

    if (electrodeInvalidDate) {
        return request({
            url: api.manage + `devices/update-electrode`,
            data: {
                deviceId,
                electrodeInvalidDate
            },
            method: Method.PUT
        })
    }
    console.error('更换耗材逻辑错误！')
    return Promise.resolve()
}

/**
 * @description 获取设备审核/清单数量
 * @returns 
 */
export function fetcheDevicesCount(): Promise<{
    checkCount: number,
    exceptionCount: number
}> {
    return request({
        url: api.manage + `devices/count`,
        method: Method.GET
    })
}