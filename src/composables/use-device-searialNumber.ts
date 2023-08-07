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
            setTimeout(() => { Taro.hideLoading() }, 1000)
        }
    })
    async function getDeviceBySerialNumber() {
        if (!form.serialNumber) return
        try {
            let res = await fetchDevicesBySearialNumber(form.serialNumber)
            deviceList.value = res
            if (deviceList.value.length === 1) {
                Taro.showLoading({
                    title: '加载中',
                    mask: true
                })
                form.id = res[0].deviceId
                await manage.getDeviceInfo(res[0].deviceId)
                setTimeout(() => { Taro.hideLoading() }, 1000)
                return
            }
            searialNumber.show = true
        } catch (error) {
            Taro.showToast({
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