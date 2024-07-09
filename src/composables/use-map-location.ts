import Taro from "@tarojs/taro";
import { useDidHide, useDidShow } from "@tarojs/taro";
import { fetchDeviceCoordinate, updateVolunteerLocation } from "~/api/common";
import { useLogin } from "./use-login";

export const useMapLocation = (options: { isNeedAddress: boolean } = {
    isNeedAddress: true
}) => {
    const account = useAccountInfo()
    const { checkOpenLocation } = useLogin()
    //默认公司地址
    const state = reactive({
        defaultLat: 30.296175,
        defaultLng: 120.166335,
        lat: 0,
        lng: 0,
        address: '',
        number: 0
    })
    const _locationChangeFn = async function (res) {
        state.lat = res.latitude 
        state.lng = res.longitude
        account.userCenter.lat = res.latitude;
        account.userCenter.lng = res.longitude;
        Taro.offLocationChange(_locationChangeFn)
        Taro.stopLocationUpdate()
        if (state.number !== 0) return
        state.number = state.number + 1
        if (account.accountInfo.volunteer) {
            await updateVolunteerLocation({
                latitude: res.latitude,
                longitude: res.longitude
            })
        }
        if (!state.address && options.isNeedAddress) {
            let { address } = await fetchDeviceCoordinate({
                longitude: res.longitude,
                latitude: res.latitude
            })
            state.address = address
        }

    }
    useDidShow(async () => {
        try {
            await checkOpenLocation()
            getNewLocation()
        } catch (err) {
            Taro.showToast({
                icon: 'none',
                title: err
            })
        }
    })
    useDidHide(() => {
        Taro.offLocationChange(_locationChangeFn)
    })
    const getNewLocation = async () => {
        try {
            await Taro.startLocationUpdate()
            Taro.onLocationChange(_locationChangeFn)
            let _locationChangeErrorFn = (res) => {
                if (res.errCode === 2) {
                    Taro.offLocationChangeError(_locationChangeErrorFn)
                    Taro.showModal({
                        title: '提示',
                        content: '您手机可能未开启GPS定位或周围没有基站,开启后请重新刷新页面',
                        success: res => {
                            if (res.confirm) {
                            }
                        }

                    })
                }
            }
            Taro.onLocationChangeError(_locationChangeErrorFn)
            //关闭抓取位置错误信息api
        } catch (error) {
            await Taro.stopLocationUpdate()
            console.error('更新定位失败')
            return Promise.reject('请确认是否开启定位')
        }
        return Promise.resolve({
            lat: state.lat,
            lng: state.lng
        })
    }
    return { ...toRefs(state), getNewLocation }
}