
import Taro from '@tarojs/taro'
import * as QQMapWX from 'qqmap-wx-jssdk'
import { type DeviceMap, fetchRegionDevices, fetchRegionDeviceInfo } from '~/api/device'
import normalImage from '~/assets/images/device_normal.png'
import normalSelectImage from '~/assets/images/device_normal.png'
export const useQQMapSdk = (cb?: (lat: number, lng: number) => void) => {
    const mapCtx = Taro.createMapContext('indexMap')
    mapCtx.setLocMarkerIcon({
        iconPath: '../assets/images/index/用户定位.png'
    })
    const mapScale = ref(13)
    const qqmapsdk = new QQMapWX({ key: qqMapKey })
    const deviceList = ref<DeviceMap[]>([])
    const markers = ref<{
        id: number,
        deviceId?: number,
        latitude: number,
        longitude: number,
        iconPath?: string,
        level: number | null,
        width?: number,
        height?: number,
        callout?: any
    }[]>([])
    const deviceInfo = ref<Index.DeviceInfo>()
    const deviceVisible = ref(false)
    const deviceSelectId = ref(0)
    const getSuggestion = (option: { keyword: string }): Promise<Index.Suggestion[]> => {
        return new Promise((resolve, reject) => {
            qqmapsdk.getSuggestion({
                keyword: option.keyword,
                region: '',
                page_size: 15,
                success: function (res) {
                    console.log("位置信息", res.data)
                    resolve(res.data)
                }
            })
        })
    }
    function getScale(mapCtx): Promise<{
        scale: number
    }> {
        return new Promise((resolve, reject) => {
            Taro.showNavigationBarLoading();
            mapCtx.getScale({
                success(res) {
                    resolve(res)
                }, fail(err) {
                    reject(err)
                }, complete() {
                    Taro.hideNavigationBarLoading();
                }
            })
        })
    }
    const getRegion = (): Promise<{
        southwest: {
            latitude: number,
            longitude: number
        },
        northeast: {
            latitude: number,
            longitude: number
        }
    }> => {
        return new Promise((resolve, reject) => {
            mapCtx.getRegion({
                success(res) {
                    console.log(res)
                    resolve(res)
                }, fail(err) {
                    reject(err)
                }, complete() {
                }
            })
        })
    }
    const getCenterLocation = (): Promise<{
        latitude: number,
        longitude: number
    }> => {
        return new Promise((resolve, reject) => {
            mapCtx.getCenterLocation({
                success(res) {
                    resolve(res)
                }, fail(err) {
                    reject(err)
                }, complete() {
                }
            })
        })
    }
    const regionlatlng = ref<{
        southwest: {
            latitude: number,
            longitude: number
        },
        northeast: {
            latitude: number,
            longitude: number
        }
    }>({
        southwest: {
            latitude: 0,
            longitude: 0
        },
        northeast: {
            latitude: 0,
            longitude: 0
        }
    })
    //地图缩放查询设备
    const { proviceLevelScaleTo, cityLevelScaleFrom, cityLevelScaleTo, regionLevelScaleFrom, pointLevelScaleFrom, pointLevelScaleTo } = mapGlobalConfigParams

    const regionchange = async (e: { type: string }) => {
        if (e.type === 'end') {
            let regionRes = await getRegion()
            let { scale } = await getScale(mapCtx)
            console.log('scale', scale)
            mapScale.value = scale
            let level = 1
            if (scale < proviceLevelScaleTo) {
                level = 1
            } else if (scale >= cityLevelScaleFrom && scale < cityLevelScaleTo) {
                level = 2
            } else {
                level = 3
            }
            let { southwest, northeast } = regionRes
            if (isEqual({
                southwest,
                northeast
            }, regionlatlng.value)) {
                return
            }
            regionlatlng.value = {
                southwest,
                northeast
            }
            let res = await fetchRegionDevices({
                level,
                minLat: southwest.latitude,
                minLng: southwest.longitude,
                maxLat: northeast.latitude,
                maxLng: northeast.longitude
            })
            deviceList.value = res
            renderMarkerDevices()
        }
    }
    //渲染设备点位
    const renderMarkerDevices = () => {
        let devices = deviceList.value
        markers.value = []
        if (devices.length) {
            let deviceMarkers = devices.map(device => {
                let isSelect = device.id === deviceSelectId.value
                return !device.level ? {
                    id: device.id,
                    deviceId: device.id,
                    level: device.level,
                    latitude: device.deployedAreaLatitude,
                    longitude: device.deployedAreaLongitude,
                    iconPath: isSelect ? normalSelectImage : normalImage,
                    width: isSelect ? 32 : 28,
                    height: isSelect ? 40 : 35
                } : {
                    id: device.id,
                    latitude: device.level === 2 ? device.deployedAreaLatitude : device.areaLatitude,
                    longitude: device.level === 2 ? device.deployedAreaLongitude : device.areaLongitude,
                    level: device.level,
                    width: 40,
                    height: 40,
                    callout: {
                        content: device.name,
                        color: "#ffffff",
                        fontSize: "16",
                        borderRadius: "10",
                        bgColor: "#ea333391",
                        padding: "7",
                        display: "ALWAYS"
                    }
                }
            })
            markers.value = deviceMarkers
        }

    }
    //点击设备点查看详情
    const account = useAccountInfo()
    const { userCenter } = storeToRefs(account)
    const markertap = async (e: { detail: { markerId: number } }) => {
        console.log('markerTap', mapScale.value)
        let deviceId = e.detail.markerId
        deviceSelectId.value = deviceId
        let devices = markers.value.filter(v => v.id === deviceId)
        console.log('markerTap', devices[0])
        if (devices.length) {
            let { level, latitude, longitude } = devices[0]
            if (level) {
                if (level === 1) {
                    mapScale.value = regionLevelScaleFrom
                    cb && cb(latitude, longitude)
                }
                if (level === 2) {
                    mapScale.value = pointLevelScaleFrom + 1
                    cb && cb(latitude, longitude)
                }
            } else {
                // let { latitude, longitude } = await getCenterLocation()
                markers.value = markers.value.map(i => {
                    let isSelect = i.id === deviceId
                    return {
                        ...i,
                        width: isSelect ? 32 : 28,
                        height: isSelect ? 40 : 35,
                        iconPath: isSelect ? normalSelectImage : normalImage

                    }
                })
                let res = await fetchRegionDeviceInfo({
                    deviceId,
                    latFrom: userCenter.value.lat,
                    lngFrom: userCenter.value.lng,
                })
                deviceInfo.value = res
                deviceVisible.value = true
            }
        }

    }
    //回到用户当前位置
    const moveToLocation = () => {
        mapCtx.moveToLocation({

        })
    }
    //打开导航
    const openLocation = (lat: number, lng: number, address: string) => {
        return new Promise((resolve, reject) => {
            if (!lat || !lng) {
                reject('设备位置信息未完善')
            }
            Taro.openLocation({
                latitude: lat,
                longitude: lng,
                name: address,
                scale: 20
            })
            resolve(true)
        })
    }
    //拨打电话
    const makePhoneCall = (phoneNumber: string) => {
        if (!phoneNumber) {
            return
        }
        Taro.makePhoneCall({
            phoneNumber: phoneNumber
        })
    }

    return {
        getSuggestion,
        getRegion,
        getScale,
        regionchange,
        markers,
        markertap,
        deviceInfo,
        deviceVisible,
        deviceSelectId,
        renderMarkerDevices,
        moveToLocation,
        openLocation,
        makePhoneCall,
        mapScale
    }
}