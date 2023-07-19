import { defineStore } from 'pinia'
import { fetchManageDeviceInfo } from '~/api/device'

export const useManageStore = defineStore('manage', {
    state: () => ({
        deviceInfo: {
            id: 0,
            address: '',
            batteryInvalidDate: '',
            brandId: 0,
            configInstitutionId: 0,
            contactName: '',
            contactPhone: '',
            deployedImagePath: '',
            deployedLatitude: 0,
            deployedLongitude: 0,
            description: '',
            deviceNetworkState: '',
            electrodeInvalidDate: '',
            installDate: '',
            investor: '',
            maintainInstitutionId: 0,
            mobile: '',
            model: '',
            placeId: 0,
            publicTimeFrom: '',
            publicTimeTo: '',
            publicType: '',
            qualityAssuranceDate: '',
            regionId: [],
            runningState: '',
            serialNumber: '',
            unitName: '',
            workDay: ''
        } as any as Manage.DeviceInfo
    }),
    actions: {
        async getDeviceInfo(id: number) {
            // if (id === this.deviceInfo.id) return
            let res = await fetchManageDeviceInfo(id)
            this.deviceInfo = res
        }
    }
})