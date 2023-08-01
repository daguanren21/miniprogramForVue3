import { defineStore } from 'pinia'
import { fetchAccountInfo } from '~/api/user'

export const useAccountInfo = defineStore('account', {
    state: () => ({
        accountInfo: {
            certificateNumber: 0,
            roleName: '',
            address: '',
            email: '',
            imageUrl: '',
            nickName: '',
            phoneNumber: '',
            realName: '',
            volunteer: false,
            volunteerId: '',
        } as any as User.AccountInfo
    }),
    actions: {
        async getAccountInfo() {
            let res = await fetchAccountInfo()
            this.accountInfo = res
        }
    }
})