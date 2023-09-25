import { defineStore } from 'pinia'
import { fetchAccountInfo } from '~/api/user'

export const useAccountInfo = defineStore('account', {
    state: () => ({
        userCenter: {
            lat: 31.258518,
            lng: 120.739311,
        },
        accountInfo: {
            certificateNumber: 0,
            roleName: '',
            address: '',
            email: '',
            imageUrl: '',
            nickName: '',
            phoneNumber: '',
            realName: '',
            roleType: '',
            volunteer: false,
            volunteerId: '',
            activated: false,
            unitName: '',
            maintenanceUnitId: null,
            configurationUnitId: null
        } satisfies User.AccountInfo
    }),
    actions: {
        async getAccountInfo() {
            let res = await fetchAccountInfo()
            this.accountInfo = res
        }
    }
})