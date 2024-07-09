<template>
    <!-- @vue-ignore -->
    <nut-popup position="bottom" @click-overlay="emit('close')" closeable round @click-close-icon="emit('close')"
        :style="{ maxHeight: '600rpx' }" :visible="show">
        <div class="relative">
            <slot name="left"></slot>
            <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">设备详情</div>
        </div>
        <div v-if="detail" class="pb-17px" @click="emit('toPage')">
            <div class="p-40px flex-y-center box-border">
                <div class="mr-16px h-125px w-125px">
                    <image v-if="detail.deployedImagePath" @tap.stop="previewImage(detail.deployedImagePath)" class="h-125px w-125px" :src="detail.deployedImagePath.split(';')[0]"></image>
                    <image v-else-if="detail.brandLogo" class="h-125px w-125px" :src="detail.brandLogo"></image>
                    <image v-else class="h-125px w-125px" src="../../assets/images/index/默认图.jpg"></image>
                </div>
                <div class="flex-1 flex-y-center justify-between">
                    <div class="mr-15px">
                        <div class="flex-y-center">
                            <div class="text-30px font-bold text-hex-333">{{ noDataFilter(detail.serialNumber) }}</div>
                            <div :style="{ color: filter(deviceRunningStateFilter(detail.runningState).type).color, backgroundColor: filter(deviceRunningStateFilter(detail.runningState).type).bgColor, borderColor: filter(deviceRunningStateFilter(detail.runningState).type).color }"
                                class="ml-30px text-hex-32B44B bg-hex-E0F4E4 b-1px b-hex-32B44B text-center rounded-5px text-26px w-82px h-40px line-height-40px">
                                {{ deviceRunningStateFilter(detail.runningState).text }}</div>
                        </div>
                        <div class="mt-24px line-clamp-2 break-all text-hex-797979 text-26px">
                            {{ noDataFilter(detail.address) }}
                        </div>
                    </div>
                    <div class="flex-col items-center" @click.stop="showMapNavigation(detail)">
                        <jx-icon value="navigation" color="#2595E8" :size="20"></jx-icon>
                        <div class="text-24px text-hex-2595E8 mt-15px break-keep">距您{{ distanceFilter(detail.distance) }}</div>
                    </div>
                </div>
            </div>
            <div class="w-700px p-y-4px pl-10px box-border rounded-5px bg-hex-f8f8f8 m-auto">
                <div class="flex gap-1" style="border-bottom: 1rpx solid #DADADA">
                    <div class="p-y-15px pl-32px box-border flex-1">
                        <div class="text-24px text-hex-8E8E8E">品牌</div>
                        <div class="mt-13px text-28px text-hex-333">{{ detail.brandName }}</div>
                    </div>
                    <div class="p-y-15px pl-32px box-border flex-1" style="border-left: 1rpx solid #DADADA">
                        <div class="text-24px text-hex-8E8E8E">开放类型</div>
                        <div class="mt-13px text-28px text-hex-333">{{ devicePublicFilter(detail.publicType) }}</div>
                    </div>
                </div>
                <div class="flex gap-1">
                    <div class="p-y-15px pl-32px box-border flex-1"
                        v-if="detail.publicType == 'HALF' || detail.publicType == 'PUBLIC'">
                        <div class="text-24px text-hex-8E8E8E">开放日</div>
                        <div class="mt-13px text-28px text-hex-333">{{ showWeekDays(detail.workDay) }}</div>
                    </div>
                    <div class="p-y-15px pl-32px box-border flex-1" style="border-left: 1rpx solid #DADADA"
                        v-if="detail.publicType == 'HALF'">
                        <div class="text-24px text-hex-8E8E8E">开放时间</div>
                        <div class="mt-13px text-28px text-hex-333 break-all">{{ detail.publicTime }}</div>
                    </div>
                </div>
            </div>
        </div>

    </nut-popup>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import { devicePublicFilter, noDataFilter, distanceFilter, deviceRunningStateFilter } from '~/filter'
import { showWeekDays, filter } from '~/utils'
defineOptions({
    name: 'DeviceInfoModal'
})
defineProps<{
    detail: Index.DeviceInfo,
    show: Boolean
}>()
const emit = defineEmits<{
    close,
    toPage
}>()
let { openLocation,previewImage } = useQQMapSdk()
const showMapNavigation = async (info: Index.DeviceInfo) => {
    let { address, deployedAreaLatitude: lat, deployedAreaLongitude: lng } = info
    try {
        await openLocation(lat, lng, address)

    } catch (error) {
        Taro.showToast({
            title: error,
            icon: 'none'
        })
    }
}
</script>

<style lang="scss">
.detailModal {
    position: absolute;
    top: 20px;
    left: 10px;
    width: 500px;
    padding: 15px 30px 20px 30px;
    border-radius: 30px;
    background-color: rgba(46, 49, 71, 0.8);

    .device_content {
        .close_wrap {
            position: absolute;
            right: 15px;
            top: 15px;

            .fa-modal-close {
                font-size: 36px !important;
            }
        }

        .detail {
            display: flex;
            align-items: center;
            margin-top: 40px;

            .d-l {
                width: 153px;
                height: 153px;
                margin-right: 24px;
                background-color: #e5e8f2;

                image {
                    width: 100%;
                    height: 100%;
                }
            }

            .d-r {
                width: calc(100% - 177px);

                .item-t {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .sn {
                        font-size: 25px;
                        font-weight: bold;
                        color: #fff;
                    }
                }

                .time {
                    display: flex;
                    margin-bottom: 10px;
                    font-size: 23px;
                    font-weight: 400;
                    color: #fff;
                }

                .item-m {
                    margin: 18px 0;

                    .code {
                        color: #fff;
                    }
                }

                .item-b {
                    .address {
                        margin-bottom: 13px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        &_info {
                            display: flex;
                            flex-direction: column;
                            width: 80%;

                            .distance {
                                margin-top: 10px;
                                font-size: 21px;
                                font-weight: 400;
                                color: #fff;
                            }

                            .ft {
                                // @include ellipsis();
                                font-size: 22px;
                                font-weight: 400;
                                color: #fff;
                            }
                        }

                        .icon {
                            font-size: 48px !important;
                            color: #fff;
                        }
                    }

                    .time {
                        font-size: 19px;
                        font-weight: 400;
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>