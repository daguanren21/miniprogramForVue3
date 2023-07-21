import { DeviceBySearialNumber, fetchDevicesBySearialNumber } from "~/api/device"

export const useDeviceBySearialNumber = (form) => {
    const manage = useManageStore()
    const deviceList = ref<DeviceBySearialNumber[]>()
    const searialNumber = reactive({
        show: false,
        confirm: async (item: DeviceBySearialNumber) => {
            await manage.getDeviceInfo(item.deviceId)
        }
    })
    async function getDeviceBySerialNumber() {
        if (!form.serialNumber) return
        try {
            let res = await fetchDevicesBySearialNumber(form.serialNumber)
            deviceList.value = res
            if (deviceList.value.length === 1 && form.id) return
            searialNumber.show = true
        } catch (error) {
            console.error(error)
        }
    }
    return {
        deviceList,
        searialNumber,
        getDeviceBySerialNumber
    }
}