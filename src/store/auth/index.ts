import { defineStore } from 'pinia'
import { Auth } from '~/api/login'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authInfo: {
            id_token: '',
            openid: '',
            unionid: '',
            phoneNumber: '',
        } as Auth,
        tabName: 'index'
    }),
    actions: {
        updateAuthInfo(authInfo) {
            this.$state.authInfo = authInfo
        },
        updateTabName(tabName) {
            this.$state.tabName = tabName
        }
    }
})