<template>
    <div class="home">
        <div class="main flex-col">
            <div class="bg-hex-fff  mt-10px p-15px">
                <nut-row type="flex" align="center">
                    <nut-col :span="6">
                        <div class="flex ml-16px">
                            <image class="w-150px h-150px rounded-full overflow-hidden" mode="aspectFill"
                                v-if="accountInfo.imageUrl" :src="accountInfo.imageUrl"></image>
                            <open-data class="w-150px h-150px rounded-full overflow-hidden" v-else
                                type="userAvatarUrl"></open-data>
                        </div>
                    </nut-col>
                    <nut-col :offset="2" :span="16">
                        <div class="flex-y-center">
                            <div class="text-37px font-bold text-hex-231815 break-all">
                                <text v-if="accountInfo.nickName">{{ accountInfo.nickName }}</text>
                                <open-data v-else type="userNickName"></open-data>
                            </div>
                            <div v-if="accountInfo.roleName"
                                class="text-24px w-150px h-40px line-height-40px ml-20px rounded-30px text-hex-fff text-center bg-hex-21cf3c">
                                {{ accountInfo.roleName }}
                            </div>
                            <div class="ml-20px" v-else>
                                <nut-button type='primary' style="height:40rpx;line-height: 40rpx;font-size: 24rpx;"
                                    @getphonenumber="getPhoneNumber" open-type="getPhoneNumber"> 授权</nut-button>
                            </div>
                        </div>
                        <div class="mt-26px text-26px text-hex-231815 break-all font-400">
                            {{ accountInfo.address || '暂无地址信息' }}
                        </div>
                    </nut-col>
                </nut-row>
            </div>
            <div class="flex-1 overflow-auto">
                <div class="mt-20px pb-20px bg-hex-fff rounded-30px">
                    <div class="pt-36px ml-30px mb-10px text-36px font-bold text-hex-595757">个人中心</div>
                    <nut-grid class="m-x-10px" :column-num="4" square>
                        <nut-grid-item @click="toCenter('person')">
                            <template #text>
                                <div class="text-28px mt-10px">
                                    个人信息
                                </div>
                            </template>
                            <jx-icon value="center-person" :size="26" color="#FFAF35"></jx-icon>
                        </nut-grid-item>
                        <nut-grid-item @click="toCenter('volunteer')">
                            <template #text>
                                <div class="text-28px  mt-10px">
                                    志愿者认证
                                </div>
                            </template>
                            <jx-icon v-if="accountInfo.volunteer" value="center-yrz" color="#19cc6c"></jx-icon>
                            <jx-icon v-else value="center-wrz" color="#9999"></jx-icon>
                            <!-- <jx-icon value="center-volunteer" :size="26" color="#00BAAD"></jx-icon> -->
                        </nut-grid-item>
                        <nut-grid-item @click="toCenter('cert')">
                            <template #text>
                                <div class="text-28px  mt-10px">
                                    上传证书
                                </div>
                            </template>
                            <nut-badge :value="certificatesCount">
                                <jx-icon value="center-cert" :size="26" color="#00D1A4"></jx-icon>
                            </nut-badge>
                        </nut-grid-item>
                        <nut-grid-item @click="toCenter('deviceCheck')" v-if="roleType && roleType !== 'WECHAT'">
                            <template #text>
                                <div class="text-28px  mt-10px">
                                    状态审核
                                </div>
                            </template>
                            <nut-badge :value="checkCount">
                                <jx-icon value="center-statusCheck" :size="26" color="#D51E06"></jx-icon>
                            </nut-badge>
                        </nut-grid-item>
                        <nut-grid-item @click="toCenter('deviceList')" v-if="roleType && roleType !== 'WECHAT'">
                            <template #text>
                                <div class="text-28px  mt-10px">
                                    设备清单
                                </div>
                            </template>
                            <nut-badge :value="exceptionCount">
                                <jx-icon value="center-deviceList" :size="26" color="#14ADC4"></jx-icon>
                            </nut-badge>
                        </nut-grid-item>

                        <nut-grid-item @click="toCenter('notification')" v-if="roleType && roleType !== 'WECHAT'">
                            <template #text>
                                <div class="text-28px  mt-10px">
                                    消息通知
                                </div>
                            </template>
                            <nut-badge :value="unreadCount">
                                <jx-icon value="center-message" :size="26" color="#DD6568"></jx-icon>
                            </nut-badge>
                        </nut-grid-item>
                    </nut-grid>
                </div>
                <div class="mt-20px pb-20px bg-hex-fff rounded-30px" v-if="roleType && roleType !== 'WECHAT'">
                    <div class="pt-36px ml-30px mb-10px text-36px font-bold text-hex-595757">操作中心</div>
                    <nut-grid class="m-x-10px" :column-num="4" square>
                        <nut-grid-item @click="toOperate('inspection')">
                            <template #text>
                                <div class="text-28px mt-10px">
                                    巡检
                                </div>
                            </template>
                            <jx-icon value="operate-inspection" :size="26" color="#3FA9F5"></jx-icon>
                        </nut-grid-item>

                        <nut-grid-item @click="toOperate('statusChange')">
                            <template #text>
                                <div class="text-28px mt-10px">
                                    状态变更
                                </div>
                            </template>
                            <jx-icon value="operate-statusChange" :size="26" color="#E65256"></jx-icon>
                        </nut-grid-item>
                        <nut-grid-item @click="toOperate('relocation')">
                            <template #text>
                                <div class="text-28px mt-10px">
                                    移机
                                </div>
                            </template>
                            <jx-icon value="operate-relocation" :size="26" color="#A5D83F"></jx-icon>
                        </nut-grid-item>
                        <nut-grid-item @click="toOperate('maintainance')">
                            <template #text>
                                <div class="text-28px mt-10px">
                                    维护
                                </div>
                            </template>
                            <jx-icon value="operate-maintain" :size="26" color="#2A82E4"></jx-icon>
                        </nut-grid-item>
                        <nut-grid-item @click="toOperate('useReport')">
                            <template #text>
                                <div class="text-28px mt-10px">
                                    使用上报
                                </div>
                            </template>
                            <jx-icon value="operate-useReport" :size="26" color="#FF8900"></jx-icon>
                        </nut-grid-item>
                        <nut-grid-item @click="toOperate('repair')">
                            <template #text>
                                <div class="text-28px mt-10px">
                                    报修
                                </div>
                            </template>
                            <jx-icon value="operate-repair" :size="26" color="#3295FC"></jx-icon>
                        </nut-grid-item>
                    </nut-grid>
                </div>
            </div>
        </div>
        <jx-tab-bar></jx-tab-bar>
    </div>
    <!-- <nut-button @getphonenumber="getPhoneNumber" type="primary" open-type="getPhoneNumber">授权</nut-button> -->
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro';
import { fetcheDevicesCount } from '~/api/device';
import { fetchOneKeyLogin } from '~/api/login';
// import { fetchOneKeyLogin } from '~/api/login';
import { fetchUnreadCount } from '~/api/user';
const account = useAccountInfo()
let { accountInfo } = storeToRefs(account)
const auth = useAuthStore()
const getPhoneNumber = async (e) => {
    let { errMsg, iv, encryptedData } = e.detail
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
        auth.authInfo.id_token = res.id_token
        await account.getAccountInfo()
    }
}
const roleType = computed(() => account.accountInfo.roleType)
//跳转到个人中心页面
const toCenter = (key: string) => {
    if (!auth.authInfo.id_token) {
        Taro.showToast({
            icon: 'none',
            title: '授权后方可操作'
        })
        return
    }
    if (key === 'cert' && !accountInfo.value.volunteer) {
        Taro.showModal({
            title: '提示',
            content: '请志愿者认证后上传证书！',
            confirmText: '前往认证',
            success: function (res) {
                if (res.confirm) {
                    Taro.navigateTo({
                        url: `/Center/volunteer/index`
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
        return
    }
    Taro.navigateTo({
        url: `/Center/${key}/index`
    })
}
//跳转到操作中心页面
const toOperate = (key: string) => {
    Taro.navigateTo({
        url: `/Operate/${key}/index`
    })
}
const unreadCount = ref(0)
const certificatesCount = ref(0)
const checkCount = ref(0)
const exceptionCount = ref(0)
//获取未读消息数量
useDidShow(async () => {
    let { unreadCount: unread, certificatesCount: certificate } = await fetchUnreadCount()
    let { checkCount: check, exceptionCount: exception } = await fetcheDevicesCount()
    unreadCount.value = unread
    certificatesCount.value = certificate
    checkCount.value = check
    exceptionCount.value = exception

})
</script>

<style scoped></style>