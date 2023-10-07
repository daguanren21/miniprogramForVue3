<template>
    <div class="home person-center">
        <div class="main flex-col pt-30px p-x-14px box-border" v-if="auth.authInfo.id_token">
            <div class="pl-26px box-border flex relative">
                <div class="flex">
                    <image class="w-125px h-125px rounded-full overflow-hidden" mode="aspectFill"
                        v-if="accountInfo.imageUrl" :src="accountInfo.imageUrl"></image>
                    <open-data class="w-125px h-125px rounded-full overflow-hidden" v-else type="userAvatarUrl"></open-data>
                </div>
                <div class="ml-21px w-400px">
                    <div class="flex-y-center mb-41px">
                        <div class="text-36px text-hex-#333 font-bold break-all">
                            <div v-if="accountInfo.nickName" class="w-200px">{{ accountInfo.nickName }}</div>
                            <open-data v-else type="userNickName"></open-data>
                        </div>
                        <div
                            class="bg-hex-3A3A3B text-24px min-h-40px p-x-10px box-border line-height-40px ml-28px text-hex-fff text-center">
                            {{ accountInfo.roleName }}
                        </div>
                    </div>
                    <div class="text-24px text-hex-333 line-clamp-3 break-all">
                        {{ accountInfo.address || '暂无地址信息' }}
                    </div>
                </div>
                <div class="flex absolute edit-user" @click="toCenter('person')">
                    <image class="w-38px h-38px" src="../../assets/images/center/编辑.svg"></image>
                    <div class="w-140px h-44px text-24px text-hex-1B54C2 line-height-44px ">修改资料</div>
                </div>
            </div>
            <div class="p-x-13px mt-30px w-710px flex-center">
                <div class="volunteer pr-15px pl-25px p-y-25px flex-y-center justify-between">
                    <div v-if="accountInfo.volunteer">
                        <div class="text-26px font-bold text-hex-1d1d1d">您已经成为志愿者，可第一时间参与救援</div>
                        <div class="mt-11px text-26px text-hex-FF722D" @click="toCenter('volunteer')">认证信息</div>
                    </div>
                    <div v-else>
                        <div class="text-26px font-bold text-hex-1d1d1d">快去认证，成为志愿者</div>
                        <div class="mt-11px text-26px text-hex-333">第一时间提供及时、高效的应急救援</div>
                    </div>

                    <div v-if="accountInfo.volunteer && roleType !== 'WECHAT'" @click="toCenter('cert')"
                        class="bg-hex-ff6248 p-x-20px ml-13px rounded-23px h-45px flex-center text-hex-fff text-26px">
                        证书管理
                    </div>
                    <div v-if="!accountInfo.volunteer" @click="toCenter('volunteer')"
                        class="bg-hex-ff6248  ml-13px p-x-20px rounded-23px h-45px flex-center text-hex-fff text-26px">
                        去认证
                    </div>
                </div>
            </div>
            <div class="w-full flex-center">
                <div class="w-710px bg-hex-fff rounded-20px p-y-39px p-x-59px box-border flex">
                    <nut-row>
                        <nut-col :span="8" @click="toCenter('deviceCheck')" v-if="roleType && roleType !== 'WECHAT'">
                            <div class="flex-col items-start ">
                                <div class="relative h-97px">
                                    <image class="w-110px h-87px relative" src="../../assets/images/center/状态审核.png">

                                    </image>
                                    <div
                                        class="w-39px h-39px flex-center rounded-full text-hex-fff bg-hex-D91A1A text-20px absolute top--10px right-0px">
                                        {{ checkCount }}
                                    </div>
                                </div>
                                <p class="mt-19px text-28px font-bold">状态审核</p>

                            </div>
                        </nut-col>
                        <nut-col :span="8" @click="toCenter('deviceList')" v-if="roleType && roleType !== 'WECHAT'">
                            <div class="flex-col items-center">
                                <div class="relative h-97px">
                                    <image class="w-110px h-87px" src="../../assets/images/center/设备清单.png"></image>
                                    <div
                                        class="w-39px h-39px flex-center rounded-full text-hex-fff bg-hex-D91A1A text-20px absolute top--10px right-0px">
                                        {{ exceptionCount }}
                                    </div>
                                </div>
                                <p class="mt-19px text-28px font-bold">设备清单</p>
                            </div>
                        </nut-col>
                        <nut-col :span="12" @click="toCenter('cert')" v-if="roleType && roleType === 'WECHAT'">
                            <div class="flex-col  items-center ">
                                <image class="w-110px h-87px" src="../../assets/images/center/设备清单.png"></image>
                                <p class="mt-19px text-28px font-bold">证书管理</p>
                            </div>
                        </nut-col>
                        <nut-col :span="roleType && roleType === 'WECHAT' ? 12 : 8" @click="toCenter('notification')">
                            <div class="flex-col" :style="{ 'align-items': roleType !== 'WECHAT' ? 'flex-end' : 'center' }">
                                <div class="relative h-97px">
                                    <image class="w-110px h-87px" src="../../assets/images/center/消息通知.png"></image>
                                    <div
                                        class="w-39px h-39px flex-center rounded-full text-hex-fff bg-hex-D91A1A text-20px absolute top--10px right-0px">
                                        {{ unreadCount }}
                                    </div>
                                </div>
                                <p class="mt-19px text-28px font-bold">消息通知</p>
                            </div>
                        </nut-col>
                    </nut-row>
                </div>
            </div>
            <div class="w-full mt-30px" v-if="roleType && roleType !== 'WECHAT'">
                <div class="ml-24px mb-26px text-34px font-bold text-hex-333">操作中心</div>
                <div class="w-full flex-center">
                    <div class="w-710px p-y-45px rounded-20px bg-hex-fff">
                        <nut-row>
                            <nut-col :span="6" @click="toDeviceInstall">
                                <div class="flex-col items-center">
                                    <image class="w-51px h-49px" src="../../assets/images/center/录入.png">
                                    </image>
                                    <p class="mt-19px text-28px font-bold">新增</p>
                                </div>
                            </nut-col>
                            <nut-col :span="6" @click="toOperate('inspection')">
                                <div class="flex-col items-center">
                                    <image class="w-51px h-49px" src="../../assets/images/center/巡检.png">
                                    </image>
                                    <p class="mt-19px text-28px font-bold">巡检</p>
                                </div>
                            </nut-col>
                            <nut-col :span="6" @click="toOperate('repair')">
                                <div class="flex-col items-center">
                                    <image class="w-51px h-49px" src="../../assets/images/center/报修.png">
                                    </image>
                                    <p class="mt-19px text-28px font-bold">报修</p>
                                </div>
                            </nut-col>
                            <nut-col :span="6" @click="toOperate('maintainance')">
                                <div class="flex-col items-center">
                                    <image class="w-51px h-49px" src="../../assets/images/center/维护.png">
                                    </image>
                                    <p class="mt-19px text-28px font-bold">维护</p>
                                </div>
                            </nut-col>

                        </nut-row>
                        <nut-row class="mt-90px">
                            <nut-col :span="6" @click="toOperate('relocation')">
                                <div class="flex-col items-center">
                                    <image class="w-51px h-49px" src="../../assets/images/center/移机.png">
                                    </image>
                                    <p class="mt-19px text-28px font-bold">移机</p>
                                </div>
                            </nut-col>
                            <nut-col :span="6" @click="toOperate('parts')">
                                <div class="flex-col items-center">
                                    <image class="w-51px h-49px" src="../../assets/images/center/更换耗材.png">
                                    </image>
                                    <p class="mt-19px text-28px font-bold">更换耗材</p>
                                </div>
                            </nut-col>
                            <nut-col :span="6" @click="toOperate('statusChange')">
                                <div class="flex-col items-center">
                                    <image class="w-51px h-49px" src="../../assets/images/center/状态变更.png">
                                    </image>
                                    <p class="mt-19px text-28px font-bold">状态变更</p>
                                </div>
                            </nut-col>
                            <nut-col :span="6" @click="toOperate('useReport')">
                                <div class="flex-col items-center">
                                    <image class="w-51px h-49px" src="../../assets/images/center/使用上报.png">
                                    </image>
                                    <p class="mt-19px text-28px font-bold">使用上报</p>
                                </div>
                            </nut-col>
                        </nut-row>
                    </div>
                </div>
            </div>
        </div>
        <div class="main flex-col pt-36px p-x-14px box-border relative" v-else>
            <div class="flex-col items-center">
                <div class="flex mb-25px">
                    <image class="w-125px h-125px rounded-full overflow-hidden" mode="aspectFill"
                        v-if="accountInfo.imageUrl" :src="accountInfo.imageUrl"></image>
                    <open-data class="w-125px h-125px rounded-full overflow-hidden" v-else type="userAvatarUrl"></open-data>
                </div>
                <div class="text-36px text-hex-#333 font-bold break-all">
                    <text v-if="accountInfo.nickName">{{ accountInfo.nickName }}</text>
                    <open-data v-else type="userNickName"></open-data>
                </div>
            </div>
            <div class="absolute flex-col items-center w-full" style="top:50%;transform: translateY(-50%);">
                <p class="text-30px text-hex-181818 mb-30px">您需要先授权才可查看</p>
                <nut-button @getphonenumber="getPhoneNumber"
                    style="width:142rpx;height: 62rpx; line-height: 62rpx; text-align: center;background:rgb(53,200,84);border-radius: 20rpx;word-break: keep-all;"
                    type="primary" open-type="getPhoneNumber">授权</nut-button>

            </div>
        </div>
        <jx-tab-bar></jx-tab-bar>
    </div>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro';
import { fetcheDevicesCount } from '~/api/device';
import { fetchOneKeyLogin } from '~/api/login';
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
//跳转到录入页面
const manage = useManageStore()
const toDeviceInstall = () => {
    manage.$reset();
    Taro.navigateTo({
        url: '/Manage/deviceInstall/index'
    })
}
const unreadCount = ref(0)
const certificatesCount = ref(0)
const checkCount = ref(0)
const exceptionCount = ref(0)
//获取未读消息数量
useDidShow(async () => {
    Taro.setNavigationBarTitle({
        title: '个人中心'
    })
    let { unreadCount: unread, certificatesCount: certificate } = await fetchUnreadCount()
    if (!(accountInfo.value.roleType === 'WECHAT' || !accountInfo.value.roleType)) {
        let { checkCount: check, exceptionCount: exception } = await fetcheDevicesCount()
        checkCount.value = check
        exceptionCount.value = exception
    }
    certificatesCount.value = certificate
    unreadCount.value = unread


})
</script>

<style lang="scss">
.person-center {
    background: url(../../assets/images/center/bg.png) no-repeat;
    background-size: 100% 100%;

    .volunteer {
        min-width: 640px;
        height: 110px;
        background: url(../../assets/images/center/volunteer_bg.png) no-repeat;
        background-size: 100% 100%;
        box-sizing: border-box;
    }
}

.edit-user {
    top: 50%;
    transform: translateY(-50%);
    right: -10px;

    div {
        background: linear-gradient(to right, #9ABCFF, #E7F0FF);
        border-radius: 20px 0 0 20px;
        text-align: center;
    }

    image {
        position: absolute;
        left: -16px;
        top: 19px;
        transform: translateY(-15px);
    }
}
</style>