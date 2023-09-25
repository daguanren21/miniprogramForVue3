import Taro from "@tarojs/taro"
import { DeviceBySearialNumber, fetchDevicesBySearialNumber } from "~/api/device"

export const useDeviceBySearialNumber = (form) => {
    const manage = useManageStore()
    const deviceList = ref<DeviceBySearialNumber[]>()
    const searialNumber = reactive({
        show: false,
        confirm: async (item: DeviceBySearialNumber) => {
            Taro.showLoading({
                title: '加载中',
                mask: true
            })
            form.id = item.deviceId
            await manage.getDeviceInfo(item.deviceId)
            searialNumber.show = false
            setTimeout(() => { Taro.hideLoading() }, 1000)
        }
    })
    async function getDeviceBySerialNumber(toast: boolean = true) {
        debugger
        if (!form.serialNumber) return
        try {
            Taro.showLoading({
                title: '加载中',
                mask: true
            })
            let res = await fetchDevicesBySearialNumber(form.serialNumber)
            setTimeout(() => { Taro.hideLoading() }, 1000)
            deviceList.value = res
            if (deviceList.value.length === 1) {
                form.id = res[0].deviceId
                return
            }
            searialNumber.show = true
           
        } catch (error) {
            form.id = null
            toast && Taro.showToast({
                icon: 'none',
                title: error
            })
        }
    }
    return {
        deviceList,
        searialNumber,
        getDeviceBySerialNumber
    }
}