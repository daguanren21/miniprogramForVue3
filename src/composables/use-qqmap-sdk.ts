
import Taro from '@tarojs/taro'
import * as QQMapWX from 'qqmap-wx-jssdk'
import { type DeviceMap, fetchRegionDevices, fetchRegionDeviceInfo } from '~/api/device'
import normalImage from '~/assets/images/map_jx.png'
import normalSelectImage from '~/assets/images/jx_select.png'
export const useQQMapSdk = () => {
    const mapCtx = Taro.createMapContext('indexMap')
    const qqmapsdk = new QQMapWX({ key: qqMapKey })
    const deviceList = ref<DeviceMap[]>([])
    const markers = ref<{
        id: number,
        deviceId: number,
        latitude: number,
        longitude: number,
        iconPath: string
        width: number,
        height: number,
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
    //地图缩放查询设备
    const regionchange = async (e: { type: string }) => {
        if (e.type === 'end') {
            let { southwest, northeast } = await getRegion()
            let res = await fetchRegionDevices({
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
        if (devices.length) {
            let deviceMarkers = devices.map(device => {
                let isSelect = device.id === deviceSelectId.value
                return {
                    id: device.id,
                    deviceId: device.id,
                    latitude: device.deployedAreaLatitude,
                    longitude: device.deployedAreaLongitude,
                    iconPath: isSelect ? normalSelectImage : normalImage,
                    width: isSelect ? 55 : 50,
                    height: isSelect ? 55 : 50
                }
            })
            markers.value = deviceMarkers
        }

    }
    //点击设备点查看详情
    const markertap = async (e: { detail: { markerId: number } }) => {
        let deviceId = e.detail.markerId
        deviceSelectId.value = deviceId
        let { latitude, longitude } = await getCenterLocation()
        markers.value = markers.value.map(i => {
            let isSelect = i.id === deviceId
            return {
                ...i,
                width: isSelect ? 55 : 50,
                height: isSelect ? 55 : 50,
                iconPath: isSelect ? normalSelectImage : normalImage

            }
        })
        let res = await fetchRegionDeviceInfo({
            deviceId,
            latFrom: latitude,
            lngFrom: longitude
        })
        deviceInfo.value = res
        deviceVisible.value = true
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
        regionchange,
        markers,
        markertap,
        deviceInfo,
        deviceVisible,
        deviceSelectId,
        renderMarkerDevices,
        moveToLocation,
        openLocation,
        makePhoneCall
    }
}