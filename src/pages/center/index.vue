<template>
    <div>
        <nut-button @getphonenumber="getPhoneNumber" type="primary" open-type="getPhoneNumber">授权</nut-button>
    </div>
</template>

<script setup lang="ts">
import { fetchOneKeyLogin } from '~/api/login';

const getPhoneNumber = async (e) => {
    let { errMsg, iv, encryptedData } = e.detail
    const auth = useAuthStore()
    if (errMsg == "getPhoneNumber:ok") {
        let res = await fetchOneKeyLogin({
            unionid: auth.authInfo.unionid,
            iv,
            encryptedData
        })
        if (!res) {
            return Promise.reject("微信登录失败")
        }
        if (!res.id_token) {
            return Promise.reject("微信授权失败");
        }
        auth.$state.authInfo.id_token=res.id_token
    }
}
</script>

<style scoped></style>