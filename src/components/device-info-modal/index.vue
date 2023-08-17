<template>
    <view @tap="emit('toPage')" class="detailModal" v-if="show">
        <view class="device_content">
            <view class="close_wrap" @tap.stop="emit('close')">
                <IconFont font-class-name="fa" class-prefix="fa" name="modal-close" color="#eee" size="20"></IconFont>
            </view>
            <view class="detail">
                <view class="d-l">
                    <image v-if="detail.brandLogo" :src="detail.brandLogo" />
                    <image v-else src="../../assets/images/jx-without-image.svg"></image>
                </view>
                <view class="d-r">
                    <view class="item-t">
                        <text class="sn">{{ detail.serialNumber }}</text>
                    </view>
                    <view class="time"> 品牌：{{ detail.brandName }} </view>
                    <view class="item-m">
                        <jx-dot :state="deviceRunningStateFilter(detail.runningState)" />
                    </view>
                    <view class="item-b">
                        <view class="address">
                            <view class="address_info">
                                <text class="ft">{{ noDataFilter(detail.address) }}</text>
                                <text class="distance">距您{{ distanceFilter(detail.distance) }}</text>
                            </view>
                            <image class="icon" @tap.stop="showMapNavigation(detail)" style="height: 30px; width: 30px"
                                src="../../assets/images/location_dh.svg"></image>
                        </view>

                        <view class="time">
                            开放类型：{{ devicePublicFilter(detail.publicType) }}
                        </view>
                        <view class="time" v-if="detail.publicType == 'HALF' || detail.publicType == 'PUBLIC'
                            ">
                            <view style="white-space: nowrap;">开放日：</view>
                            <view style="white-space: nowrap;">{{ showWeekDays(detail.workDay) }}</view>
                        </view>
                        <view class="time" v-if="detail.publicType == 'HALF'">
                            开放时间：{{ detail.publicTime }}
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { IconFont } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import { devicePublicFilter, noDataFilter, distanceFilter, deviceRunningStateFilter } from '~/filter'
import { showWeekDays } from '~/utils'
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
let { openLocation } = useQQMapSdk()
const showMapNavigation = async (info: Index.DeviceInfo) => {
    let { address, deployedAreaLatitude: lat, deployedAreaLongitude: lng } = info
    try {
        await openLocation(lat, lng, address)

    } catch (error) {
        Taro.showToast({
            title:error,
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