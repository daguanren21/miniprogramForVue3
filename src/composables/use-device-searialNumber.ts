import Taro from "@tarojs/taro"
import { DeviceBySearialNumber, fetchDeviceInfoByAssetNumber, fetchDevicesBySearialNumber } from "~/api/device"
import { parseDeviceSn } from "~/utils"

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
    const scanAssetNumber = async () => {
        try {
            let { result: code } = await Taro.scanCode({ scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'] })
            let assetNumber = parseDeviceSn(code)
            if (!assetNumber) {
                Taro.showToast({
                    icon: 'none',
                    title: '错误的二维码信息'
                })
            }
            let res = await fetchDeviceInfoByAssetNumber(assetNumber)
            form.id = res.id
            form.serialNumber = res.serialNumber
            manage.deviceInfo = res
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
        getDeviceBySerialNumber,
        scanAssetNumber
    }
}

