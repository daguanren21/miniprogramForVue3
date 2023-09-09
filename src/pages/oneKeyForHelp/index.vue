<template>
    <div class="wh-full overflow-hidden">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <div class="home person-center" v-if="!recordId">
            <div class="main p-x-60px pt-38px pb-24px">
                <div class="w-full flex-x-center">
                    <div @click="showDisclaimerFlag = true"
                        class="w-161px h-57px line-height-57px bg-hex-4088ff rounded-30px text-center text-28px text-hex-fff">
                        免责声明
                    </div>
                </div>
                <div class="w-full bg-hex-fff rounded-20px p-25px box-border mt-25px">
                    <h2 class="text-30px text-hex-E9483F font-bold">温馨提示：</h2>
                    <div class="mt-15px line-height-48px">
                        <p class="text-24px text-hex-E9483F">正常模式仅用于紧急情况使用，体验、培训、试用等请试用演练模式。</p>
                        <p class="text-24px text-hex-E9483F"> 1、非紧急情况下请勿擅自取出AED设备</p>
                        <p class="text-24px text-hex-E9483F">2、您呼救的信息会同步发送给周边急救志愿者 </p>
                        <p class="text-24px text-hex-E9483F">3、启动呼救后，可提供120快速拨通入口</p>
                    </div>
                </div>
                <div class="w-full  mt-32px">
                    <div class="h-84px tab-box">
                        <div class="tab-item " @click="() => {
                            rescueType = 'EMERGENT'
                            dynamicForm.show = false
                        }" :class="{ 'normal': rescueType === 'EMERGENT' }">
                            <div class="flex-center flex-col h-full">
                                <span>正常模式</span>
                                <div v-if="rescueType === 'EMERGENT'"
                                    class="mt-12px w-36px h-8px rounded-4px bg-hex-EA4940"></div>
                            </div>
                        </div>
                        <div class="tab-item" @click="model.confirm" :class="{ 'test': rescueType === 'DRILL' }">
                            <div class="flex-center flex-col h-full">
                                <span>演练模式</span>
                                <div v-if="rescueType === 'DRILL'" class="mt-12px w-36px h-8px rounded-4px bg-hex-409EFF">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="h-460px bg-hex-fff  flex-center">
                        <div @click="oneKeyForHelp">
                            <image class="w-400px h-400px" src="../../assets/images/callHelp/一键呼救.png"></image>
                        </div>
                    </div>
                </div>
            </div>
            <nut-dialog title="演练人员列表" :visible="dynamicForm.show" @cancel="dynamicForm.show = false"
                @ok="dynamicForm.confirm">
                <nut-form :model-value="dynamicForm" ref="dynamicRefForm">
                    <nut-form-item required class="jx-form-item"
                        :rules="[{ required: true, message: '请填写联系方式' }, { regex: phonePattern, message: '手机格式不正确' }]"
                        :key="index" :prop="'phoneList.' + index + '.tel'" v-for="(item, index) in dynamicForm.phoneList">
                        <nut-input :border=false class="nut-input-text" v-model="item.tel" :max-length="11"
                            :placeholder="'请输入联系方式'" type="number" />
                    </nut-form-item>
                    <div class="text-20px mt-10px text-hex-ee0a24 text-left pl-32px">
                        注：演练人员最多添加4人，不支持添加本人
                    </div>
                    <nut-cell>
                        <nut-button size="small" style="margin-right: 10px" @click="dynamicForm.methods.add">添加</nut-button>
                        <nut-button size="small" style="margin-right: 10px"
                            @click="dynamicForm.methods.remove">删除</nut-button>
                    </nut-cell>
                </nut-form>
            </nut-dialog>
            <nut-overlay v-model:visible="showDisclaimerFlag">
                <div class="flex-center h-full">
                    <div class="bg-hex-fff rounded-20px w-610px pb-50px relative">
                        <div class="pt-50px">
                            <div class="text-36px text-hex-4088FF font-bold pb-8px w-226px text-center m-auto"
                                style="border-bottom:2rpx solid #4088FF;">免责声明</div>
                            <div class="text-left mt-54px line-height-36px text-hex-484848 text-28px p-x-30px">
                                <p> 1.小程序构建在微信小程序平台之上，由微信平台提供权限、用户、位置等信息和服务。我们无法保证信息的准确性，由此造成的任何直接或间接损害，小程序不负担任何责任。</p>
                                <p class="mt-30px">
                                    2.第三方提供的AED数据信息仅供用户参考，我们会对AED数据进行定期更新，但不保证该AED数据的绝对安全、准确、有效，也不保证不会出现其他不确定的风险。由此引发的任何争议及损害与小程序无关，小程序不承担任何责任。
                                </p>
                            </div>
                            <div @click="showDisclaimerFlag = false"
                                class="m-auto w-450px mt-50px rounded-37px h-70px line-height-70px bg-hex-4088FF text-hex-fff text-34px text-center">
                                已知悉
                            </div>
                        </div>
                    </div>
                </div>
            </nut-overlay>
            <jx-tab-bar></jx-tab-bar>
        </div>
        <div class="h-full overflow-hidden" v-else>
            <map class="wh-full" :markers="markers" @markertap="markertap" :longitude="lng" :latitude="lat" :scale="scale"
                id="helpMap" :show-location="true" :showScale="true">

                <div class="absolute top-20px right-30px">
                    <div @click="handleNearBy" class="mb-20px">
                        <image v-if="showDevices" class="w-130px h-130px" src="../../assets/images/callHelp/隐藏AED.png">
                        </image>
                        <image v-else class="w-130px h-130px" src="../../assets/images/callHelp/显示AED.png"></image>
                    </div>
                    <div @click="makePhoneCall('120')" class="mb-30px">
                        <image class="w-130px h-130px" src="../../assets/images/callHelp/求助120.png">
                        </image>
                    </div>
                    <div @click="finishForHelp" class="mb-20px">
                        <image class="w-130px h-130px" src="../../assets/images/callHelp/结束呼救.png"></image>
                    </div>
                </div>
                <div class="absolute bottom-0 rounded-20px bg-hex-fff h-422px w-full">
                    <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">呼叫志愿者</div>
                    <div class="w-full p-x-35px box-border">
                        <div class="pb-40px" style="border-bottom:1rpx solid #EBEBEB">
                            <div class="flex-y-center justify-between">
                                <div class="flex-y-center">
                                    <jx-icon value="aed" color="#04BAFE"></jx-icon>
                                    <span class="ml-5px text-30px text-hex-04BAFE">AED志愿者</span>
                                </div>
                                <div class="flex-y-center">
                                    <span class="text-26px text-hex-9B9B9B mr-5px">查看</span>
                                    <jx-icon value="right-arrow" color="#9B9B9B" :size="13"></jx-icon>
                                </div>
                            </div>
                            <div class="mt-35px text-26px text-hex-3E3E3E flex-y-center">
                                已通知最近的<span class="text-30px text-hex-FF5216">{{ volunteer.fetchAedReceiverCount
                                }}</span>
                                名志愿者，有<span class="text-30px text-hex-FF5216">{{ volunteer.aedAgreeCount
                                }}</span>名接受了您的呼救
                            </div>
                        </div>
                        <div class="pt-40px">
                            <div class="flex-y-center justify-between">
                                <div class="flex-y-center">
                                    <jx-icon value="cpr" color="#1ED137"></jx-icon>
                                    <span class="ml-5px text-30px text-hex-1ED137">CPR志愿者</span>
                                </div>
                                <div class="flex-y-center">
                                    <span class="text-26px text-hex-9B9B9B mr-5px">查看</span>
                                    <jx-icon value="right-arrow" color="#9B9B9B" :size="13"></jx-icon>
                                </div>
                            </div>
                            <div class="mt-35px text-26px text-hex-3E3E3E flex-y-center">
                                已通知最近的<span class="text-30px text-hex-FF5216">{{ volunteer.cprReceiverCount }}</span>
                                名志愿者，有<span class="text-30px text-hex-FF5216">{{ volunteer.cprAgreeCount
                                }}</span>名接受了您的呼救
                            </div>
                        </div>
                    </div>
                </div>
            </map>
            <nut-dialog title='呼救信息' v-model:visible="rescueModal.show">
                <div style="text-align: left;">
                    <nut-cell>
                        <div>呼救人:{{ volunteer?.record?.callerName }}</div>
                    </nut-cell>
                    <nut-cell>
                        <div class="flex-y-center">联系电话:<span style="color: #1890ff"
                                @click="makePhoneCall(volunteer?.record?.callerPhone)">{{
                                    volunteer?.record?.callerPhone }}</span></div>
                    </nut-cell>
                    <nut-cell>
                        <div>呼救地点:{{ volunteer?.record?.address }}</div>
                    </nut-cell>
                    <nut-cell>
                        <div>呼救距离:{{ distanceFilter(rescueDistance) }}</div>
                    </nut-cell>
                </div>

                <template #footer>
                    <div>
                        <nut-button type="default" @click="rescueModal.show = false">取消</nut-button>
                        <nut-button type="primary" style="margin-left:10rpx" @click="rescueModal.confrim">
                            前往救援
                        </nut-button>
                    </div>
                </template>
            </nut-dialog>
            <nut-dialog no-cancel-btn @ok="responseModal.show = false" title='呼救响应' v-model:visible="responseModal.show">
                <div style="text-align: left;">
                    <nut-cell>
                        <div>志愿者任务:{{ volunteerResponseTaskFilter(selectedResponseInfo.rescueResponseTaskType) }}</div>
                    </nut-cell>
                    <nut-cell>
                        <div>志愿者姓名:{{ selectedResponseInfo.receiverName }}</div>
                    </nut-cell>
                    <nut-cell>
                        <div class="flex-y-center">联系电话:<span style="color: #1890ff"
                                @click="makePhoneCall(selectedResponseInfo.receiverPhone)">{{
                                    selectedResponseInfo.receiverPhone }}</span></div>
                    </nut-cell>
                    <nut-cell>
                        <div>响应状态:{{ helpSeekedVolunteerResponseTypeFilter(selectedResponseInfo.rescueResponseState) }}
                        </div>
                    </nut-cell>
                </div>
            </nut-dialog>
            <nut-popup position="bottom" round :style="{ height: '60%' }" :visible="volunteerRescueModal.visible">
                <div class="text-center text-30px text-hex-1f1f1f font-bold mt-12px">正发生紧急情况，需要您的帮助</div>
                <div class="flex-y-center p-30px" style="border-bottom:1rpx solid #EBEBEB">
                    <div class="flex-1 line-clamp-1 break-all">
                        <jx-icon color="#FF0000" value="call-helper"></jx-icon>
                        <span class="ml-25px text-hex-474747 text-30px">{{ volunteer?.record?.address }}</span>
                    </div>
                    <div class="flex-col items-center">
                        <jx-icon class="ml-20px" value="navigation" color="#2595E8" :size="20"></jx-icon>
                        <div class="text-24px text-hex-2595E8 mt-15px">距您{{ distanceFilter(rescueDistance) }}</div>
                    </div>
                </div>
                <div class="w-full flex-x-center pt-30px pb-60px">
                    <div class="text-48px font-bold text-hex-FF0000">紧急求救</div>
                    <div v-if="volunteerRescueModal.responseTaskType == 'FETCH_AED'" class="mt-20px text-30px text-hex-333">
                        建议您根据地图指引，拿取最近的AED设备，快速送至患者处</div>
                    <div class="mt-20px text-30px text-hex-333" v-if="volunteerRescueModal.responseTaskType == 'CPR'">
                        建议您根据地图指引，快速跑至患者处，给患者实施CPR</div>
                </div>
                <div class="flex justify-between p-x-84px">
                    <div @click="volunteerRescueModal.cancel"
                        class="bg-hex-FF3B3B w-176px h-70px rounded-35px flex-center  text-36px text-hex-fff">
                        拒绝
                    </div>
                    <div @click="volunteerRescueModal.confirm"
                        class="bg-hex-409EFF w-176px h-70px rounded-35px flex-center  text-36px text-hex-fff">
                        接受
                    </div>
                </div>

            </nut-popup>
            <nut-popup position="bottom" round :style="{ height: '60%' }" closeable
                @click-close-icon="rescueModal.show = false" :visible="rescueModal.show">
                <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">呼救信息</div>
                <div class="flex-y-center pb-30px" style="border-bottom:1rpx solid #EBEBEB">
                    <div class="flex-1 line-clamp-1 break-all">
                        <jx-icon color="#FF0000" value="call-helper"></jx-icon>
                        <span class="ml-25px text-hex-474747 text-30px">{{ volunteer?.record?.address }}</span>
                    </div>
                    <div class="flex-col items-center" @click="rescueModal.confrim">
                        <jx-icon class="ml-20px" value="navigation" color="#2595E8" :size="20"></jx-icon>
                        <div class="text-24px text-hex-2595E8 mt-15px">距您{{ distanceFilter(rescueDistance) }}</div>
                    </div>
                </div>
                <div class="w-full pl-60px pt-30px">
                    <div class="text-30px text-hex-333 line-clamp-1 break-all">呼救人: {{ volunteer?.record?.callerName }}
                    </div>
                    <div class="text-30px text-hex-333 line-clamp-1 break-all flex-y-center "
                        @click="makePhoneCall(volunteer?.record?.callerPhone)">呼救电话:
                        <div class="text-30px bg-hex-4088FF font-bold flex-y-center">
                            <span class="mr-14px"> {{ volunteer?.record?.callerPhone }}</span>
                            <jx-icon value="phone" color="#409EFF" :size="20"></jx-icon>
                        </div>
                    </div>
                </div>
            </nut-popup>
            <nut-popup position="bottom" v-model:visible="distancePop.show">
                <nut-picker v-model="distancePop.value" :columns="distancePop.columns" title="请选择"
                    @confirm="distancePop.confirm" @cancel="distancePop.cancel">
                </nut-picker>
            </nut-popup>

            <device-info-modal :detail="deviceModal.deviceInfo!" :show="deviceModal.visible"
                @close="handleDeviceInfoClose"></device-info-modal>
        </div>
    </div>
</template>

<script setup lang="ts">
import Taro, { useDidHide, useDidShow } from '@tarojs/taro';
import { saveOneKeyForHelp, saveOneKeyForHelpToFinish } from '~/api/user';
import { useMapLocation } from '~/composables/use-map-location';
import { useMap, useSwitchModel } from '.';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import { phonePattern } from '~/utils/constant'
import { distanceFilter, helpSeekedVolunteerResponseTypeFilter, volunteerResponseTaskFilter } from '~/filter'
let { lat, lng, address } = useMapLocation()
const { state: message, rescueType, model, dynamicForm, dynamicRefForm } = useSwitchModel()
const { volunteerRescueModal, getRescueInfo, deviceModal, handleDeviceInfoClose, recordId, scale, markertap, responseModal, markers, selectedResponseInfo, volunteer, rescueModal, rescueDistance, getNearbyDevices, renderDeviceMarkers } = useMap(lat, lng)
const { makePhoneCall } = useQQMapSdk()
const showDisclaimerFlag = ref(false)
const showDevices = ref(false)
const firstSearchNearbyDevices = ref(false)
const { pause, resume } = useIntervalFn(async () => {
    await getRescueInfo()
}, 5000)
useDidShow(async () => {
    let res = await getRescueInfo()
    if (res.record && res.record.id) {
        resume()
    } else {
        pause()
    }
})
useDidHide(() => {
    pause()
})

const oneKeyForHelp = async () => {
    try {
        await saveOneKeyForHelp({
            latitude: lat.value,
            longitude: lng.value,
            address: address.value,
            rescueType: rescueType.value
        })
        let res = await getRescueInfo()
        if (res.allVolunteerCount === 0) {
            Taro.showToast({
                icon: 'none',
                title: '附近未发现志愿者',
                duration: 4000
            })
        }
        resume()
    } catch (error) {
        Taro.showToast({
            icon: 'none',
            title: error
        })
        pause()
    }

}
const finishForHelp = async () => {
    try {
        await saveOneKeyForHelpToFinish({
            recordId: recordId.value
        })
        Taro.showToast({
            icon: 'success',
            title: '救援结束'
        })
        setTimeout(async () => {
            await getRescueInfo()
            pause()
        }, 1000)
    } catch (error) {
        Taro.showToast({
            icon: 'none',
            title: error
        })
    }

}

const distancePop = reactive({
    show: false,
    value: ['5'],
    columns: [{
        text: '5公里',
        value: '5'
    }, {
        text: '10公里',
        value: '10'
    }],
    confirm: async ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        let distance = selectedOptions.map(v => v.value).join('')
        await getNearbyDevices(distance)
        distancePop.show = false
        firstSearchNearbyDevices.value = true
    },
    cancel: () => {
        distancePop.show = false
        showDevices.value = false
    }
})
const handleNearBy = () => {
    showDevices.value = !showDevices.value
    if (!firstSearchNearbyDevices.value) {
        distancePop.show = true
        return
    }
    if (!showDevices.value) {
        markers.value = markers.value.filter(marker => marker.markerType !== 'device')
    } else {
        renderDeviceMarkers()
    }
    console.log(markers)
}

</script>

<style lang="scss">
.tab-box {
    display: flex;
    align-items: center;
    background: #F2F7FF;
}

.tab-item {
    position: relative;
    flex: 1;
    height: 84px;
    text-align: center;
    font-size: 30px;
    color: #52687E;
    background: #F2F7FF;
}

.tab-box .normal {
    background: #fff;
    font-size: 32px;
    font-weight: bold;
    border-radius: 25px 25px 0 0;
    color: #EA4940;
    z-index: 1;
}

.tab-box .test {
    background: #fff;
    font-weight: bold;
    font-size: 36px;
    border-radius: 25px 25px 0 0;
    color: #409EFF;
    z-index: 1;
}

.tab-box .test::before {
    content: "";
    position: absolute;
    left: -24px;
    bottom: 0;
    width: 24px;
    height: 84px;
    background: #fff;
    border-radius: 0 0 25px 0;
}

.tab-box .normal::after {
    content: "";
    position: absolute;
    right: -24px;
    bottom: 0;
    width: 24px;
    height: 84px;
    background: #fff;
    border-radius: 0 0 0 25px;
}

.tab-box .normal {
    box-shadow: 25px 25px 0 0 #fff;
}

.tab-box .test {
    box-shadow: -25px 25px 0 0 #fff;
}


.tab-box .test::before {
    background: #F2F7FF;
}

.tab-box .normal::after {
    background: #F2F7FF;
}
</style>