<template>
    <div class="manage_detail" v-if="info">
        <div class="d_header bg-hex-fff">
            <div class="image_wrap">
                <div @click="preview(handleImages(info.deployedImagePath))" class="image" :key="index + 'manageImage'"
                    v-for="(item, index) in getImages(info.deployedImagePath)">
                    <image :src="item" v-if="item"></image>
                    <image v-else src="../../assets/images/index/默认图.jpg"></image>
                </div>
            </div>
            <div class="sn"> {{ noDataFilter(info.serialNumber) }} </div>
            <div class="flex-y-center justify-between mb-20px">
                <div class="flex-y-center">
                    <jx-icon value="address" color="#797979" :size="14"></jx-icon>
                    <div class="ml-15px text-26px text-hex-797979 break-all">{{ noDataFilter(info.address) }}</div>
                </div>
                <div @click.stop="showMapNavigation(info)">
                    <jx-icon value="navigation" color="#2595E8" :size="20"></jx-icon>
                </div>
            </div>
            <div class="action">
                <!-- <div class="item">
                    <text class="ft">完善信息</text>
                </div> -->
                <div @click="toDeviceInstall">
                    <image class="w-167px h-52px" src="../../assets/images/index/完善信息.png"></image>
                </div>
                <div class="ml-16px" @click="operate.visible = true">
                    <image class="w-167px h-52px" src="../../assets/images/index/设备维护.png"></image>
                </div>
                <nut-overlay v-model:visible="operate.visible">
                    <div class="flex-center h-full relative">

                        <div class="bg-hex-fff rounded-20px w-680px py-50px relative">
                            <div class="absolute bottom-0" @click.stop="operate.visible = false"
                                style="bottom: -82rpx; left: 50%;transform: translateX(-50%);">
                                <jx-icon value="index-close" color="#FFFFFF" :size="27"></jx-icon>
                            </div>
                            <nut-row>
                                <nut-col v-for="item in operate.itemList" :span="6" @click="operate.chooseItem(item)">
                                    <div class="flex-col items-center m-y-30px">
                                        <image v-if="item.imageUrl" class="w-51px h-49px" :src="item.imageUrl">
                                        </image>
                                        <p class="mt-19px text-28px font-bold">{{ item.name }}</p>
                                    </div>
                                </nut-col>
                            </nut-row>
                        </div>
                    </div>
                </nut-overlay>
            </div>
        </div>
        <div class="content">
            <div class="module">
                <div class="flex-y-center ml-20px">
                    <div class="w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                    <div class="ml-11px text-30px text-hex-333">基本信息</div>
                </div>
                <div class="bg-hex-fff w-720px m-auto rounded-20px">
                     <nut-cell title="资产编号">
                        <template v-slot:link>
                            <span>{{ noDataFilter(info.assetNumber) }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="型号">
                        <template v-slot:link>
                            <span>{{ noDataFilter(info.model) }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="品牌">
                        <template v-slot:link>
                            <span>{{ info.brandName }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="移动设备">
                        <template v-slot:link>
                            <span>{{ info.mobile ? '是' : '否' }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="安装场所">
                        <template v-slot:link>
                            <span>{{ noDataFilter(info.placeName) }}</span>
                        </template>
                    </nut-cell>
                </div>
            </div>
            <div class="module">
                <div class="flex-y-center ml-20px">
                    <div class="w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                    <div class="ml-11px text-30px text-hex-333">状态信息</div>
                </div>
                <div class="bg-hex-fff w-720px m-auto rounded-20px">
                    <nut-cell title="运行状态">
                        <template v-slot:icon>
                            <div class="w-48px h-48px bg-hex-E6EFFF rounded-10px flex-center">
                                <jx-icon value="run" color="#409EFF"></jx-icon>
                            </div>
                        </template>
                        <template v-slot:link>
                            <jx-dot :state="deviceRunningStateFilter(info.runningState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="自检状态">
                        <template v-slot:icon>
                            <div class="w-48px h-48px bg-hex-E6EFFF rounded-10px flex-center">
                                <jx-icon value="run" color="#409EFF"></jx-icon>
                            </div>
                        </template>
                        <template v-slot:link>
                            <jx-dot :state="deviceRunningStateFilter(info.selfTestResult)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="电池状态">
                        <template v-slot:icon>
                            <div class="w-48px h-48px bg-hex-E6EFFF rounded-10px flex-center">
                                <jx-icon value="battery" color="#409EFF"></jx-icon>
                            </div>
                        </template>
                        <template v-slot:link>
                            <text class="mr-30px">{{
                               noDataFilter(dateFilter(info.batteryInvalidDate, "YYYY-MM-DD"))
                            }}</text>

                            <jx-dot :state="batteryStateFilter(info.batteryState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="电池电量">
                        <template v-slot:icon>
                            <div class="w-48px h-48px bg-hex-E6EFFF rounded-10px flex-center">
                                <jx-icon value="battery" color="#409EFF"></jx-icon>
                            </div>
                        </template>
                        <template v-slot:link>
                            <text class="mr-30px">{{
                                info.batteryRemainingPower
                                ? info.batteryRemainingPower
                                : noDataFilter(info.batteryRemainingPower)
                            }}</text>
                        </template>
                    </nut-cell>

                    <nut-cell title="电极片状态">
                        <template v-slot:icon>
                            <div class="w-48px h-48px bg-hex-E6EFFF rounded-10px flex-center">
                                <jx-icon value="electrode" color="#409EFF"></jx-icon>
                            </div>
                        </template>
                        <template v-slot:link>
                            <text class="mr-30px">{{
                                noDataFilter(dateFilter(info.electrodeInvalidDate, "YYYY-MM-DD"))
                            }}</text>
                            <jx-dot :state="deviceRunningStateFilter(info.electrodeState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="网络状态">
                        <template v-slot:icon>
                            <div class="w-48px h-48px bg-hex-E6EFFF rounded-10px flex-center">
                                <jx-icon value="wifi" color="#409EFF"></jx-icon>
                            </div>
                        </template>
                        <template v-slot:link>
                            <jx-dot :state="deviceNetworkStateFilter(info.deviceNetworkState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="位置状态">
                        <template v-slot:icon>
                            <div class="w-48px h-48px bg-hex-E6EFFF rounded-10px flex-center">
                                <jx-icon value="location" color="#409EFF"></jx-icon>
                            </div>
                        </template>
                        <template v-slot:link>
                            <jx-dot :state="positionStateFilter(info.positionState)" />
                        </template>
                    </nut-cell>
                    <nut-cell title="质保状态">
                        <template v-slot:icon>
                            <div class="w-48px h-48px bg-hex-E6EFFF rounded-10px flex-center">
                                <jx-icon value="hasCheck" color="#409EFF"></jx-icon>
                            </div>
                        </template>
                        <template v-slot:link>
                            <text class="mr-30px">{{
                               noDataFilter(dateFilter(info.qualityAssuranceDate, "YYYY-MM-DD"))
                            }}</text>
                            <jx-dot :state="qualityAssuranceStateFilter(info.qualityAssuranceState)" />
                        </template>
                    </nut-cell>
                </div>
            </div>
            <div class="module">
                <div class="flex-y-center ml-20px">
                    <div class="w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                    <div class="ml-11px text-30px text-hex-333">联系人信息</div>
                </div>
                <div class="bg-hex-fff w-720px m-auto rounded-20px">
                    <nut-cell title="联系人">
                        <template v-slot:link>
                            <span>{{ info.contactName }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="联系方式" @click="makePhoneCall(info.contactPhone)">
                        <template v-slot:link>
                            <span :class="{ hasClick: info.contactPhone }">{{ info.contactPhone }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="归属单位">
                        <template v-slot:link>
                            <span>{{ noDataFilter(info.unitName) }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="出资人">
                        <template v-slot:link>
                            <span>{{ noDataFilter(info.investor) }}</span>
                        </template>
                    </nut-cell>
                </div>
            </div>
            <div class="module">

                <div class="flex-y-center ml-20px">
                    <div class="w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                    <div class="ml-11px text-30px text-hex-333">开放信息</div>
                </div>
                <div class="bg-hex-fff w-720px m-auto rounded-20px">
                    <nut-cell title="开放类型">
                        <template v-slot:link>
                            <span>{{ devicePublicFilter(info.publicType) }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell v-if="info.publicType === 'HALF' || info.publicType === 'PUBLIC'" title="开放日"
                        @click="makePhoneCall(info.contactPhone)">
                        <template v-slot:link>
                            <span>{{ showWeekDays(info.workDay) }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="开放时间" v-if="info.publicType === 'HALF'">
                        <template v-slot:link>
                            <span>{{ info.publicTime }}</span>
                        </template>
                    </nut-cell>
                </div>
            </div>
            <div class="module" v-if="info.maintainInstitutionId">
                <div class="flex-y-center ml-20px">
                    <div class="w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                    <div class="ml-11px text-30px text-hex-333">维保单位信息</div>
                </div>
                <div class="bg-hex-fff w-720px m-auto rounded-20px">
                    <nut-cell title="联系人">
                        <template v-slot:link>
                            <span>{{ info.maintainInstitutionAdminName }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="联系方式" @click="makePhoneCall(info.maintainInstitutionAdminPhoneNumber)">
                        <template v-slot:link>
                            <span :class="{ hasClick: info.maintainInstitutionAdminPhoneNumber }">{{
                                info.maintainInstitutionAdminPhoneNumber }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="单位名称">
                        <template v-slot:link>
                            <span>{{ info.maintainInstitutionName }}</span>
                        </template>
                    </nut-cell>
                </div>
            </div>
            <div class="module" v-if="info.configInstitutionId">
                <div class="flex-y-center ml-20px">
                    <div class="w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                    <div class="ml-11px text-30px text-hex-333">配置单位信息</div>
                </div>
                <div class="bg-hex-fff w-720px m-auto rounded-20px">
                    <nut-cell title="联系人">
                        <template v-slot:link>
                            <span>{{ info.configInstitutionAdminName }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="联系方式" @click="makePhoneCall(info.configInstitutionAdminPhoneNumber)">
                        <template v-slot:link>
                            <span :class="{ hasClick: info.configInstitutionAdminPhoneNumber }">{{
                                info.configInstitutionAdminPhoneNumber }}</span>
                        </template>
                    </nut-cell>
                    <nut-cell title="单位名称">
                        <template v-slot:link>
                            <span>{{ info.configInstitutionName }}</span>
                        </template>
                    </nut-cell>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'manageDeviceInfo'
})
import { useRouter, useDidShow } from '@tarojs/taro'
import { getImages, showWeekDays, preview, handleImages } from '~/utils/index'
import { devicePublicFilter, dateFilter, deviceRunningStateFilter, deviceNetworkStateFilter, positionStateFilter, qualityAssuranceStateFilter, batteryStateFilter, noDataFilter } from '~/filter/index'
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
    itemList: [
        { name: '巡检', key: 'inspection', imageUrl: require('~/assets/images/center/巡检.png') },
        { name: '维护', key: 'maintainance', imageUrl: require('~/assets/images/center/维护.png') },
        { name: '移机', key: 'relocation', imageUrl: require('~/assets/images/center/移机.png') },
        { name: '报修', key: 'repair', imageUrl: require('~/assets/images/center/报修.png') },
        { name: '更换耗材', key: 'parts', imageUrl: require('~/assets/images/center/更换耗材.png') },
        { name: '状态变更', key: 'statusChange', imageUrl: require('~/assets/images/center/状态变更.png') },
        { name: '使用上报', key: 'useReport', imageUrl: require('~/assets/images/center/使用上报.png') }],
    chooseItem: (item) => {
        operate.visible = false
        Taro.navigateTo({
            url: `/Operate/${item.key}/index?id=${manage.deviceInfo.id}&serialNumber=${manage.deviceInfo.serialNumber}`
        })
    }
})

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
        padding: 0 29px 20px 29px;

        .image_wrap {
            display: flex;
            justify-content: center;

            .image {
                width: 165px;
                height: 165px;
                border-radius: 10px;
                margin-left: 8px;

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
            padding-top: 30px;

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