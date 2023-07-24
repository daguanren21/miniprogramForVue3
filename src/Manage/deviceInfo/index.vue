<template>
    <div class="manage_detail" v-if="info">
        <div class="d_header bg-hex-fff">
            <div class="image_wrap">
                <div class="image" :key="index + 'manageImage'" v-for="(item, index) in getImages(info.deployedImagePath)">
                    <image :src="item" v-if="item"></image>
                    <image v-else src="../../assets/images/jx-without-image.svg"></image>
                </div>
            </div>
            <div class="sn"> {{ noDataFilter(info.serialNumber) }} </div>
            <div class="action">
                <div class="item" @click="toDeviceInstall">
                    <!-- <AtIcon prefixClass="fa" value="edit" class="icon"></AtIcon> -->
                    <text class="ft">完善信息</text>
                </div>
                <div class="item  pl-10px" @click="toDeviceParts">
                    <!-- <AtIcon prefixClass="fa" value="repair" class="icon"></AtIcon> -->
                    <text class="ft">更换配件</text>
                </div>
                <nut-popover v-model:visible="operate.visible" :list="operate.itemList" location="bottom-start"
                    @choose="operate.chooseItem">
                    <template #reference>
                        <div class="item  pl-10px">
                            <!-- <AtIcon prefixClass="fa" value="repair" class="icon"></AtIcon> -->
                            <text class="ft">更多操作</text>
                        </div>
                    </template>
                </nut-popover>

            </div>
        </div>
        <div class="content">
            <div class="module">
                <nut-cell-group title="基本信息">
                    <nut-cell title="型号">
                        <template v-slot:icon>
                            <jx-icon value="manage-brand" color="#FE9068"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ noDataFilter(info.model) }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="品牌">
                        <template v-slot:icon>
                            <jx-icon value="manage-brand" color="#A40B5E"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ info.brandName }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="安装场所">
                        <template v-slot:icon>
                            <jx-icon value="search-ins" color="#7659B1"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ noDataFilter(info.placeName) }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="位置信息">
                        <template v-slot:icon>
                            <jx-icon value="dingwei" color="#FF6216"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span class="mr-30px">{{ noDataFilter(info.address) }}</span>
                            <jx-icon @click.stop="showMapNavigation(info)" v-if="info.address" value="dh"
                                color="#1890ff"></jx-icon>
                        </template>
                    </nut-cell>
                </nut-cell-group>
            </div>
            <div class="module">
                <nut-cell-group title="状态信息">
                    <nut-cell title="运行状态">
                        <template v-slot:icon>
                            <jx-icon value="run" color="#FF6216"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <jx-dot :state="deviceRunningStateFilter(info.runningState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="电池状态">
                        <template v-slot:icon>
                            <jx-icon value="battery" color="#E50012"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <text class="mr-30px">{{
                                info.batteryPower
                                ? info.batteryPower + "%"
                                : noDataFilter(info.batteryPower)
                            }}</text>
                            <jx-dot :state="batteryStateFilter(info.batteryState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="电极片状态">
                        <template v-slot:icon>
                            <jx-icon value="electrode" color="#0DAC67"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <text class="mr-30px">{{
                                dateFilter(info.electrodeInvalidDate, "YYYY-MM-DD")
                            }}</text>
                            <jx-dot :state="deviceRunningStateFilter(info.electrodeState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="网络状态">
                        <template v-slot:icon>
                            <jx-icon value="wifi" color="#2CA6E0"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <jx-dot :state="deviceNetworkStateFilter(info.deviceNetworkState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="位置状态">
                        <template v-slot:icon>
                            <jx-icon value="location" color="#182987"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <jx-dot :state="positionStateFilter(info.positionState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="质保状态">
                        <template v-slot:icon>
                            <jx-icon value="warranty" color="#00AB92"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <text class="mr-30px">{{
                                dateFilter(info.qualityAssuranceDate, "YYYY-MM-DD")
                            }}</text>
                            <jx-dot :state="qualityAssuranceStateFilter(info.qualityAssuranceState)" />
                        </template>
                    </nut-cell>

                </nut-cell-group>
            </div>
            <div class="module">
                <nut-cell-group title="联系人信息">
                    <nut-cell title="联系人">
                        <template v-slot:icon>
                            <jx-icon value="contact-person" color="#E73828"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ info.contactName }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="联系方式" @click="makePhoneCall(info.contactPhone)">
                        <template v-slot:icon>
                            <jx-icon value="manage-phone" color="#F29600"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span :class="{ hasClick: info.contactPhone }">{{ info.contactPhone }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="归属单位">
                        <template v-slot:icon>
                            <jx-icon value="search-ins" color="#7659B1"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ noDataFilter(info.unitName) }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="出资人">
                        <template v-slot:icon>
                            <jx-icon value="contributor" color="#5F1985"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ noDataFilter(info.investor) }}</span>
                        </template>
                    </nut-cell>
                </nut-cell-group>
            </div>
            <div class="module" v-if="info.maintainInstitutionId">
                <nut-cell-group title="维保单位信息">
                    <nut-cell title="联系人">
                        <template v-slot:icon>
                            <jx-icon value="contact-person" color="#E73828"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ info.maintainInstitutionAdminName }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="联系方式" @click="makePhoneCall(info.maintainInstitutionAdminPhoneNumber)">
                        <template v-slot:icon>
                            <jx-icon value="manage-phone" color="#F29600"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span :class="{ hasClick: info.maintainInstitutionAdminPhoneNumber }">{{
                                info.maintainInstitutionAdminPhoneNumber }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="单位名称">
                        <template v-slot:icon>
                            <jx-icon value="search-ins" color="#7659B1"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ info.maintainInstitutionName }}</span>
                        </template>
                    </nut-cell>
                </nut-cell-group>
            </div>
            <div class="module" v-if="info.configInstitutionId">
                <nut-cell-group title="配置单位信息">
                    <nut-cell title="联系人">
                        <template v-slot:icon>
                            <jx-icon value="contact-person" color="#E73828"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ info.configInstitutionName }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="联系方式" @click="makePhoneCall(info.configInstitutionAdminPhoneNumber)">
                        <template v-slot:icon>
                            <jx-icon value="manage-phone" color="#F29600"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span :class="{ hasClick: info.configInstitutionAdminPhoneNumber }">{{
                                info.configInstitutionAdminPhoneNumber }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="单位名称">
                        <template v-slot:icon>
                            <jx-icon value="search-ins" color="#7659B1"></jx-icon>
                        </template>
                        <template v-slot:link>
                            <span>{{ info.configInstitutionName }}</span>
                        </template>
                    </nut-cell>
                </nut-cell-group>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'manageDeviceInfo'
})
import { useRouter, useDidShow } from '@tarojs/taro'
import { getImages } from '~/utils/index'
import { dateFilter, deviceRunningStateFilter, deviceNetworkStateFilter, positionStateFilter, qualityAssuranceStateFilter, batteryStateFilter, noDataFilter } from '~/filter/index'
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import Taro from '@tarojs/taro';
const router = useRouter()
let { openLocation, makePhoneCall } = useQQMapSdk()
const info = ref<Manage.DeviceInfo>()
const manage = useManageStore()
useDidShow(async () => {
    await manage.getDeviceInfo(Number(router.params.id))
})
watch(() => manage.deviceInfo, (val) => {
    info.value = val
}, {
    deep: true
})
const showMapNavigation = async (info: Manage.DeviceList) => {
    let { address, deployedLatitude: lat, deployedLongitude: lng } = info
    try {
        await openLocation(lat, lng, address)
    } catch (error) {
        Taro.showToast({
            title: error,
            icon: 'none'
        })
    }
}
const toDeviceInstall = () => {
    Taro.navigateTo({
        url: '/Manage/deviceInstall/index?id=' + router.params.id
    })
}

const operate = reactive({
    visible: false,
    itemList: [{ name: '报修', key: 'repair' }, { name: '维护', key: 'maintainance' }, { name: '巡检', key: 'inspection' }, { name: '移机', key: 'relocation' }, { name: '状态变更', key: 'statusChange' }, { name: '使用上报', key: 'useReport' }],
    chooseItem: (item) => {
        Taro.navigateTo({
            url: `/Operate/${item.key}/index?id=${manage.deviceInfo.id}&serialNumber=${manage.deviceInfo.serialNumber}`
        })
    }
})
const toDeviceParts = () => {
    Taro.navigateTo({
        url: `/Operate/parts/index?id=${manage.deviceInfo.id}&serialNumber=${manage.deviceInfo.serialNumber}`
    })
}
</script>

<style lang="scss">
.manage_detail {
    overflow: hidden;
    height: 100%;
    padding-bottom: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .hasClick {
        color: #0078ff
    }

    .d_header {
        padding: 0 29px;

        .image_wrap {
            display: flex;
            justify-content: center;

            .image {
                flex: 1;
                max-width: 25%;
                height: 240px;
                border-radius: 25px;
                margin-left: 20px;

                image {
                    width: 100%;
                    height: 100%;
                }
            }
        }


        .sn {
            margin: 30px 0;
            font-size: 40px;
            font-weight: bold;
            color: #3E3A39;
            word-break: break-all;
        }

        .action {
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            .item {
                padding-right: 10px;

                &.border_right {
                    border-right: 3px solid #9E9E9F;
                }

                &.pl-10 {
                    padding-left: 10px;
                }

                .icon {
                    font-size: 28px !important;
                    margin-right: 5px;
                    color: #FF6216;
                }

                .ft {
                    font-size: 28px;
                    font-weight: 400;
                    color: #FF6216;
                    line-height: 33px;
                }
            }
        }
    }

    .content {
        flex: 1;
        overflow: auto;

        .module {
            .header {
                padding: 36px 29px;
                font-size: 30px;
                font-weight: 400;
                color: #595757;
                background-color: #F2F2F2;
            }

            .nut-cell__title {
                justify-content: center;
            }

            .list {
                padding-left: 5px;


                .item_loc {
                    position: relative;



                    &_icon {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        right: 24rpx;
                    }
                }

                .item {
                    position: relative;



                    .ft {
                        margin-right: 15px;
                        color: #999;
                        font-size: 32rpx;
                    }

                    &_dot {
                        display: flex;
                        position: absolute;
                        top: 50%;
                        right: 24px;
                        transform: translateY(-50%);
                    }
                }
            }
        }
    }
}
</style>