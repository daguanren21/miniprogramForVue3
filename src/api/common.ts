const api = {
    public: 'common/api/v1/mini-program/public/',
}
/**
 * @description 查询品牌
 */
export interface Brands {
    id: number;
    logo: string;
    name: string
}
export function fetchDeviceBrands(): Promise<Brands[]> {
    return request({
        url: api.public + 'device-brands',
        method: Method.GET
    })
}
/**
 * @description 查询安装场所
 */
export interface Places {
    id: number;
    name: string
}
export function fetchDevicePlaces(): Promise<Places[]> {
    return request({
        url: api.public + 'places',
        method: Method.GET
    })
}

/**
 * @description 根据坐标获取地址信息
 */
interface AddressInfo {
    id: number
    cnName: string,
}
export interface CoordinateToAddress {
    address: string,
    city: AddressInfo,
    district: AddressInfo,
    province: AddressInfo,
    street: AddressInfo
}
export function fetchDeviceCoordinate(data: { latitude: number, longitude: number }): Promise<CoordinateToAddress> {
    return request({
        url: api.public + 'districts/coordinate',
        data,
        method: Method.GET
    })
}

/**
 * @description 查询地区列表
 */
export interface DistrictAreas {
    cnName: string,
    code: string,
    districtLevel: number,
    enName: string,
    haveChildren: boolean,
    id: number,
    lat: number,
    lng: number,
    parentId: number
}
export function fetchDistrictAreas(data?: { parentId: number | string }): Promise<DistrictAreas[]> {
    return request({
        url: api.public + 'districts/areas',
        data,
        method: Method.GET
    })
}