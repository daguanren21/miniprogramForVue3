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
            roleType:'',
            volunteer: false,
            volunteerId: '',
            activated:false,
        } satisfies User.AccountInfo
    }),
    actions: {
        async getAccountInfo() {
            let res = await fetchAccountInfo()
            this.accountInfo = res
        }
    }
})