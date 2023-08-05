<template>
    <div class="wh-full overflow-hidden">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <div class="home" v-if="!recordId">
            <div class="mt-10px">
                <nut-button type='info' @click="showDisclaimerFlag = true">免责声明</nut-button>
            </div>
            <div class="main flex-y-center relative">
                <div class="w-full absolute top-100px flex-center flex-1 flex-col">
                    <nut-button shape="square" @click="model.open" :type="rescueType === 'EMERGENT' ? 'primary' : 'info'">
                        <template #icon>
                            <jx-icon value="switch-model" color="#fff"> </jx-icon>
                        </template>
                        {{ rescueType === 'EMERGENT' ? '正常模式' : '演练模式' }}
                    </nut-button>

                    <nut-popup position="bottom" v-model:visible="model.show">
                        <nut-picker v-model="model.value" :columns="model.columns" @confirm="model.confirm"
                            @cancel="model.show = false">
                        </nut-picker>
                    </nut-popup>
                    <nut-dialog title="演练人员列表" :visible="dynamicForm.show" @cancel="dynamicForm.show = false"
                        @ok="dynamicForm.confirm">
                        <nut-form>
                            <nut-form-item required :key="index" v-for="(item, index) in dynamicForm.phoneList">
                                <nut-input class="nut-input-text" v-model="item.tel" :placeholder="'请输入联系方式'" type="text" />
                            </nut-form-item>
                            <nut-cell>
                                <nut-button size="small" style="margin-right: 10px"
                                    @click="dynamicForm.methods.add">添加</nut-button>
                                <nut-button size="small" style="margin-right: 10px"
                                    @click="dynamicForm.methods.remove">删除</nut-button>
                            </nut-cell>
                        </nut-form>
                    </nut-dialog>
                </div>

                <div class="wh-full flex-center flex-1 flex-col">
                    <div class="mb-30px bg-hex-fff p-20px rounded-15px" style="width: 90%;">
                        <p class="text-26px text-hex-ee0a24">1、非紧急情况下请勿擅自取出AED设备</p>
                        <p class="mt-10px text-26px text-hex-ee0a24">2、您呼救的信息会同步发送给周边急救志愿者</p>
                        <p class="mt-10px text-26px text-hex-ee0a24">3、启动呼救后，可提供120快速拨通入口</p>
                    </div>
                    <div class="flex-center  flex-col marker" @click="oneKeyForHelp">
                        <jx-icon value="help-warning" color="#ee0a24" :size="30"></jx-icon>
                        <span class="text-32px">一键呼救</span>
                    </div>
                </div>
                <nut-dialog @ok="showDisclaimerFlag = false" v-model:visible="showDisclaimerFlag" title='免责声明' ok-text="已知晓"
                    no-cancel-btn>
                    <div class="text-left">
                        <div class="text-24px line-height-normal">
                            1.小程序构建在微信小程序平台之上，由微信平台提供权限、用户、位置等信息和服务。我们无法保证信息的准确性，由此造成的任何直接或间接损害，久心和小程序不负担任何责任。
                        </div>
                        <div class="text-24px line-height-normal mt-40px">
                            2.第三方提供的AED数据信息仅供用户参考，我们会对AED数据进行定期更新，但不保证该AED数据的绝对安全、准确、有效，也不保证不会出现其他不确定的风险。由此引发的任何争议及损害与久心无关，久心不承担任何责任。
                        </div>
                    </div>
                </nut-dialog>
            </div>
            <jx-tab-bar></jx-tab-bar>
        </div>
        <div class="h-full overflow-hidden" v-else>
            <map class="wh-full" :markers="markers" @markertap="markertap" :longitude="lng" :latitude="lat" :scale="scale"
                id="helpMap" :show-location="true" :showScale="true">

                <div class="absolute top-20px right-30px">
                    <div @click="handleNearBy" class="flex-center flex-col mb-20px  p-10px rounded-15px bg-hex-1890ff">
                        <jx-icon value="nearby" color="#fff" :size="24"></jx-icon>
                        <p class="text-20px text-hex-fff">附近AED</p>
                    </div>
                    <div @click="makePhoneCall('120')"
                        class="flex-center flex-col mb-20px  p-10px rounded-15px bg-hex-ee0a24">
                        <jx-icon value="help-rescue" color="#fff" :size="20"></jx-icon>
                        <p class="text-20px text-hex-fff">求助120</p>
                    </div>
                    <div @click="finishForHelp" class="flex-center flex-col mb-20px  p-10px rounded-15px bg-hex-ee0a24">
                        <jx-icon value="help-close" color="#fff" :size="20"></jx-icon>
                        <p class="text-20px text-hex-fff">结束呼救</p>
                    </div>
                </div>
                <div class="absolute bottom-15px left-15px right-15px rounded-30px p-25px bg-hex-fff">
                    <div class="flex">
                        <nut-badge :value="volunteer.aedAgreeCount">
                            <div class="flex-col flex-center flex-1">
                                <image class="w-60px h-60px" src="../../assets/images/icon-volunteer-aed-active.svg">
                                </image>
                                <p class="mt-20px text-24px">同意取AED</p>
                            </div>
                        </nut-badge>
                        <nut-badge :value="(volunteer.fetchAedReceiverCount - volunteer.aedAgreeCount)">
                            <div class="flex-col flex-center flex-1">
                                <image class="w-60px h-60px" src="../../assets/images/icon-volunteer-aed.svg"></image>
                                <p class="mt-20px text-24px">未取AED</p>
                            </div>
                        </nut-badge>
                        <nut-badge :value="0">
                            <div class="flex-col flex-center flex-1">
                                <image class="w-60px h-60px" src="../../assets/images/icon-callforHelper.svg"></image>
                                <p class="mt-20px text-24px">呼救人员</p>
                            </div>
                        </nut-badge>
                        <nut-badge :value="volunteer.cprAgreeCount">
                            <div class="flex-col flex-center flex-1">
                                <image class="w-60px h-60px" src="../../assets/images/icon-volunteer-cpr-active.svg">
                                </image>
                                <p class="mt-20px text-24px">同意协助</p>
                            </div>
                        </nut-badge>
                        <nut-badge :value="(volunteer.cprReceiverCount - volunteer.cprAgreeCount)">
                            <div class="flex-col flex-center flex-1">
                                <image class="w-60px h-60px" src="../../assets/images/icon-volunteer-cpr.svg"></image>
                                <p class="mt-20px text-24px">未协助</p>
                            </div>
                        </nut-badge>
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
            <nut-dialog @ok="volunteerRescueModal.confirm" @cancel="volunteerRescueModal.cancel"
                :visible="volunteerRescueModal.visible" title='正发生紧急情况，需要您的帮助' ok-text="接受" cancel-text="拒绝">
                <div class="call_for_help">
                    <div class="content text-left">
                        <view v-if="volunteerRescueModal.responseTaskType == 'FETCH_AED'">建议您根据地图指引，拿取最近的AED设备，快速送至患者处
                        </view>
                        <view v-if="volunteerRescueModal.responseTaskType == 'CPR'">建议您根据地图指引，快速跑至患者处，给患者实施CPR</view>
                    </div>
                </div>
            </nut-dialog>
            <nut-popup position="bottom" v-model:visible="distancePop.show">
                <nut-picker v-model="distancePop.value" :columns="distancePop.columns" title="请选择"
                    @confirm="distancePop.confirm" @cancel="distancePop.show = false">
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
import { distanceFilter, helpSeekedVolunteerResponseTypeFilter, volunteerResponseTaskFilter } from '~/filter'
let { lat, lng, address } = useMapLocation()

const { state: message, rescueType, model, dynamicForm } = useSwitchModel()
const { volunteerRescueModal, getRescueInfo, deviceModal, handleDeviceInfoClose, recordId, scale, markertap, responseModal, markers, selectedResponseInfo, volunteer, rescueModal, rescueDistance, getNearbyDevices } = useMap(lat, lng)
const { makePhoneCall } = useQQMapSdk()
const showDisclaimerFlag = ref(false)
const { pause, resume } = useIntervalFn(async () => {
    await getRescueInfo()
}, 3000)
useDidShow(async () => {
    await getRescueInfo()
    if (recordId.value) {
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
        await getRescueInfo()
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
        setTimeout(() => {
            getRescueInfo()
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
    }, {
        text: '100公里',
        value: '100'
    }],
    confirm: async ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        let distance = selectedOptions.map(v => v.value).join('')
        await getNearbyDevices(distance)
        distancePop.show = false
    }
})
const handleNearBy = () => {
    distancePop.show = true
}

</script>

<style lang="scss">
.marker {
    width: 300px;
    height: 300px;
    border: 40px solid #ee0a24;
    border-radius: 50%;
}

.nut-badge {
    flex: 1;
}

.call_for_help {
    .content {
        font-size: 24px;
        font-weight: 400;
        color: #ff6216;
    }
}
</style>