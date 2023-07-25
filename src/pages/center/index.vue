<template>
    <div class="home">
        <div class="bg-hex-fff mt-10px p-15px">
            <nut-row type="flex" align="center">
                <nut-col :span="6">
                    <div class="flex ml-16px">
                        <image class="w-150px h-150px rounded-full overflow-hidden" mode="aspectFill"
                            v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl"></image>
                        <open-data class="w-150px h-150px rounded-full overflow-hidden" v-else
                            type="userAvatarUrl"></open-data>
                    </div>
                </nut-col>
                <nut-col :offset="2" :span="16">
                    <div class="flex-y-center">
                        <div class="text-37px font-bold text-hex-231815 break-all">
                            <text v-if="userInfo.nickName">{{ userInfo.nickName }}</text>
                            <open-data v-else type="userNickName"></open-data>
                        </div>
                        <div
                            class="w-150px h-40px line-height-40px ml-20px rounded-30px text-hex-fff text-center bg-hex-21cf3c">

                        </div>
                    </div>
                    <div class="mt-26px text-26px text-hex-231815 break-all font-400">
                        {{ userInfo.address || '暂无地址信息' }}
                    </div>
                </nut-col>
            </nut-row>
        </div>
        <div class="mt-20px pb-20px bg-hex-fff rounded-30px">
            <div class="pt-36px ml-30px mb-10px text-36px font-bold text-hex-595757">个人中心</div>
            <nut-grid class="m-x-10px" :column-num="4" square>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px mt-10px">
                            个人信息
                        </div>
                    </template>
                    <jx-icon value="center-person" size="26" color="#FFAF35"></jx-icon>
                </nut-grid-item>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px  mt-10px">
                            志愿者认证
                        </div>
                    </template>
                    <jx-icon value="center-volunteer" size="26" color="#00BAAD"></jx-icon>
                </nut-grid-item>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px  mt-10px">
                            状态审核
                        </div>
                    </template>
                    <jx-icon value="center-statusCheck" size="26" color="#D51E06"></jx-icon>
                </nut-grid-item>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px  mt-10px">
                            设备清单
                        </div>
                    </template>
                    <jx-icon value="center-deviceList" size="26" color="#14ADC4"></jx-icon>
                </nut-grid-item>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px  mt-10px">
                            消息通知
                        </div>
                    </template>
                    <jx-icon value="center-message" size="26" color="#DD6568"></jx-icon>
                </nut-grid-item>
            </nut-grid>
        </div>
        <div class="mt-20px pb-20px bg-hex-fff rounded-30px">
            <div class="pt-36px ml-30px mb-10px text-36px font-bold text-hex-595757">操作中心</div>
            <nut-grid class="m-x-10px" :column-num="4" square>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px mt-10px">
                            巡检
                        </div>
                    </template>
                    <jx-icon value="operate-inspection" size="26" color="#3FA9F5"></jx-icon>
                </nut-grid-item>

                <nut-grid-item>
                    <template #text>
                        <div class="text-28px mt-10px">
                            状态变更
                        </div>
                    </template>
                    <jx-icon value="operate-statusChange" size="26" color="#E65256"></jx-icon>
                </nut-grid-item>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px mt-10px">
                            移机
                        </div>
                    </template>
                    <jx-icon value="operate-relocation" size="26" color="#A5D83F"></jx-icon>
                </nut-grid-item>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px mt-10px">
                            维护
                        </div>
                    </template>
                    <jx-icon value="operate-maintain" size="26" color="#2A82E4"></jx-icon>
                </nut-grid-item>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px mt-10px">
                            使用上报
                        </div>
                    </template>
                    <jx-icon value="operate-useReport" size="26" color="#FF8900"></jx-icon>
                </nut-grid-item>
                <nut-grid-item>
                    <template #text>
                        <div class="text-28px mt-10px">
                            报修
                        </div>
                    </template>
                    <jx-icon value="operate-repair" size="26" color="#3295FC"></jx-icon>
                </nut-grid-item>

            </nut-grid>
        </div>
    </div>
    <!-- <nut-button @getphonenumber="getPhoneNumber" type="primary" open-type="getPhoneNumber">授权</nut-button> -->
</template>

<script setup lang="ts">
import { fetchOneKeyLogin } from '~/api/login';
const userInfo = reactive({
    avatarUrl: '',
    nickName: '',
    address: ''
})
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
        auth.$state.authInfo.id_token = res.id_token
    }
}
</script>

<style scoped></style>