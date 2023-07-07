import Taro from "@tarojs/taro";
import { useDidHide, useDidShow } from "@tarojs/taro";

export const useMapLocation = () => {
    const state = reactive({
        lat: 0,
        lng: 0
    })
    const _locationChangeFn = function (res) {
        state.lat = res.latitude;
        state.lng = res.longitude;
    }
    useDidShow(async () => {
        try {
            await Taro.startLocationUpdate()
            Taro.onLocationChange(_locationChangeFn)
        } catch (error) {
            console.error('更新定位失败')
        }
    })
    useDidHide(() => {
        Taro.offLocationChange(_locationChangeFn)
    })
    
    return { ...toRefs(state) }
}