import Taro from "@tarojs/taro";
import { useDidHide, useDidShow } from "@tarojs/taro";
import { fetchDeviceCoordinate } from "~/api/common";

export const useMapLocation = () => {
    const state = reactive({
        lat: 0,
        lng: 0,
        address: '',
    })
    const _locationChangeFn = async function (res) {
        state.lat = res.latitude;
        state.lng = res.longitude;
        if (!state.address) {
            let { address } = await fetchDeviceCoordinate({
                longitude: res.longitude,
                latitude: res.latitude
            })
            state.address = address
        }

        Taro.stopLocationUpdate()
    }
    useDidShow(async () => {
        getNewLocation()
    })
    useDidHide(() => {
        Taro.offLocationChange(_locationChangeFn)
    })
    const getNewLocation = async () => {
        try {
            await Taro.startLocationUpdate()
            Taro.onLocationChange(_locationChangeFn)
        } catch (error) {

            await Taro.stopLocationUpdate()
            console.error('更新定位失败')
            return Promise.reject('更新定位失败')
        }
        return Promise.resolve({
            lat: state.lat,
            lng: state.lng
        })
    }
    return { ...toRefs(state), getNewLocation }
}