<template>
    <div class="h-full overflow-hidden">
        <div v-if="state.totalCount" class="h-full overflow-hidden">
            <jx-scroll-view class="x-scroll-view" :refreshing="refreshing" :nomore="nomore"
                @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
                <nut-backtop height="100%">
                    <template v-slot:content>
                        <div class="manage_item" v-for="item in state.content" :key="item.id" @click="toDeviceInfo(item)">
                            <div class="top pb-20px">
                                <div class="left">
                                    <image v-if="item.brandLogo" :src="item.brandLogo"></image>
                                    <image v-else src="../../../assets/images/index/默认图.jpg"></image>
                                </div>
                                <div class="right">
                                    <div class="line">
                                        <div class="sn">
                                            {{ item.serialNumber }}
                                        </div>
                                        <div class="r">
                                            <jx-icon class="icon" value="navigation" color="#2595E8"
                                                @click.stop="showMapNavigation(item)"></jx-icon>
                                        </div>
                                    </div>
                                    <div class="line mt-20px">
                                        <div class="l flex-y-center">
                                            <jx-icon class="icon" value="address"></jx-icon>
                                            <div class="text line-clamp-2 break-all">{{ noDataFilter(item.address) }}</div>
                                        </div>
                                    </div>
                                    <div class="line mt-20px">
                                        <div class="l">
                                            <jx-icon class="icon" value="device-time"></jx-icon>
                                            <div class="text flex-y-center">
                                                <text class="label">安装时间</text>
                                                <text>{{ dateFilter(item.installDate, 'YYYY-MM-DD') }}</text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <nut-row type="flex" justify="center" class="bottom">
                                <nut-col class="item mr-5px" :span="12">
                                    <div class="icon_module">
                                        <jx-icon class="icon" value="run" color="#409EFF"></jx-icon>
                                        <div class="ft">运行</div>
                                    </div>
                                    <jx-dot class="flex_dot" :state="deviceRunningStateFilter(item.runningState)"></jx-dot>
                                </nut-col>
                                <nut-col class="item ml-5px" :span="12">
                                    <div class="icon_module">
                                        <jx-icon class="icon" value="location" color="#409EFF"></jx-icon>
                                        <div class="ft">位置</div>
                                    </div>
                                    <jx-dot class="flex_dot" :state="positionStateFilter(item.positionState)"></jx-dot>
                                </nut-col>
                            </nut-row>
                            <nut-row type="flex" justify="center" class="bottom">
                                <nut-col class="item  mr-5px" :span="12">
                                    <div class="icon_module">
                                        <jx-icon class="icon" value="battery" color="#409EFF"></jx-icon>
                                        <div class="ft">电池</div>
                                    </div>
                                    <jx-dot class="flex_dot" :state="batteryStateFilter(item.batteryState)"></jx-dot>
                                </nut-col>
                                <nut-col class="item ml-5px" :span="12">
                                    <div class="icon_module">
                                        <jx-icon class="icon" value="wifi" color="#409EFF"></jx-icon>
                                        <div class="ft">网络</div>
                                    </div>
                                    <jx-dot class="flex_dot"
                                        :state="deviceNetworkStateFilter(item.deviceNetworkState)"></jx-dot>
                                </nut-col>
                            </nut-row>
                            <nut-row type="flex" justify="center" class="bottom">
                                <nut-col class="item  mr-5px" :span="12">
                                    <div class="icon_module">
                                        <jx-icon class="icon" value="electrode" color="#409EFF"></jx-icon>
                                        <div class="ft">电极片</div>
                                    </div>
                                    <jx-dot class="flex_dot"
                                        :state="deviceRunningStateFilter(item.electrodeState)"></jx-dot>
                                </nut-col>
                                <nut-col class="item ml-5px" :span="12">
                                    <div class="icon_module">
                                        <jx-icon class="icon" value="hasCheck" color="#409EFF"></jx-icon>
                                        <div class="ft">质保</div>
                                    </div>
                                    <jx-dot class="flex_dot"
                                        :state="qualityAssuranceStateFilter(item.qualityAssuranceState)"></jx-dot>
                                </nut-col>
                            </nut-row>
                        </div>
                    </template>
                </nut-backtop>
            </jx-scroll-view>
        </div>
        <div v-else class="h-full flex-center overflow-hidden">
            <nut-empty description="暂无数据"></nut-empty>
        </div>
    </div>
</template>

<script setup lang="ts">
import { fetchManageDevices } from "~/api/device"
import { dateFilter, deviceRunningStateFilter, deviceNetworkStateFilter, positionStateFilter, qualityAssuranceStateFilter, batteryStateFilter, noDataFilter } from '~/filter/index'
import { useQQMapSdk } from "~/composables/use-qqmap-sdk";
import Taro, { useDidShow } from "@tarojs/taro";
const state = reactive({
    content: [] as Manage.DeviceList[],
    totalCount: 0,
    totalPage: 0,
    page: 1
})
const props = defineProps<{ search: Record<string, any> }>()
const emits = defineEmits<{
    change: [value: number]
}>()
watch(() => props.search, (val) => {
    loadData()
}, {
    deep: true
})
const refreshing = ref(false)
const nomore = ref(false)
useDidShow(() => {
    loadData()
})
async function loadData() {
    refreshing.value = false
    nomore.value = false
    state.page = 1
    Taro.showLoading({
        title: '数据加载中'
    })
    let { content, totalCount, totalPage } = await getManageList()
    Taro.hideLoading()
    console.log('列表数据', content)
    state.content = content
    state.totalCount = totalCount
    state.totalPage = totalPage
    emits('change', totalCount)
    if (state.page === state.totalPage || state.totalPage === 0) {
        nomore.value = true
    }
}
async function getManageList() {
    let res = await fetchManageDevices({
        page: state.page,
        size: 10,
        ...props.search
    })
    return Promise.resolve(res)
}
let { openLocation } = useQQMapSdk()
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

const _onPullDownRefresh = () => {
    setTimeout(() => {
        refreshing.value = false
    }, 2000);
}
const _onLoadmore = () => {
    setTimeout(async () => {
        if (state.page === state.totalPage) {
            nomore.value = true
        } else {
            state.page++;
            let { content } = await getManageList();
            state.content = [...state.content, ...content]
        }
    }, 1000);
}
const _onScroll = (e) => {
    console.log(e);
}
//跳转到设备详情界面
const toDeviceInfo = (item: Manage.DeviceList) => {
    console.log(item)
    Taro.navigateTo({
        url: '/Manage/deviceInfo/index?id=' + item.id
    })
}
</script>

<style lang="scss">
.header {
    height: 60px;
    line-height: 50px;
    text-align: center;
    background: #fff;
    border-bottom: solid 1px #f4f4f4;
}


.manage_item {
    width: 720px;
    margin: 15px auto;
    padding: 30px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 20px;

    .top {
        display: flex;
        border-bottom: 1px solid #EBEBEB;

        .left {
            width: 180px;
            height: 180px;
            margin-right: 28px;

            image {
                width: 100%;
                height: 100%;
            }
        }

        .right {
            flex: 1;
            overflow: hidden;

            .line {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .sn {
                    flex: 1;
                    margin-right: 15px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 32px;
                    font-weight: bold;
                    color: #333333;
                }

                .btn {
                    width: 69px;
                    height: 31px;
                    line-height: 31px;
                    font-size: 18px;
                    font-weight: 400;
                    color: #888888;
                    background-color: #DBDCDC;
                    border-color: transparent;
                    margin: 0;

                    &.active {
                        background-color: #FFE0D0;
                        color: #FF6216;
                    }
                }


                .l {
                    display: flex;

                    .icon {
                        font-size: 34px !important;
                        margin-right: 12px;
                        color: #4088FF;
                    }

                    .text {
                        flex: 1;
                        font-size: 26px;
                        font-weight: 400;
                        color: #797979;

                        .label {
                            margin-right: 10px;
                        }
                    }

                }


                .r {}
            }


        }
    }

    .bottom {
        margin-top: 15px;

        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: rgba(208, 226, 255, 0.3);
            ;
            border-radius: 10px;
            padding-right: 40rpx !important;
            padding-left: 20rpx !important;

            .icon_module {
                display: flex;
                align-items: center;
            }



            .ft {
                margin: 15px 0;
                margin-left: 10px;
                font-size: 24px;
                font-weight: 400;
                color: #595757;
            }

            .jx-status {
                width: auto;
                border: none
            }
        }

    }
}
</style>