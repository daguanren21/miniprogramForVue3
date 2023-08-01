<template>
    <div class="h-full flex-col overflow-hidden">
        <div>
            <view class="tab_wrap">
                <nut-row>
                    <nut-col @tap="changeTab(index)" v-for="(item, index) in tabList" :span="12" :key="'tab' + index">
                        <view class="tab" :class="{ active: index == tabIndex }">
                            <text class="ft">{{ item.text }}</text>
                        </view>
                    </nut-col>
                </nut-row>
            </view>
        </div>
        <div class="flex-1 overflow-hidden">
            <jx-scroll-view class="x-scroll-view" :refreshing="refreshing" :nomore="nomore"
                @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
                <nut-backtop height="100%">
                    <template v-slot:content>
                        <div class="manage_item" v-for="item in state.content" :key="item.id">
                            <div class="flex">
                                <div class="w-150px h-150px mr-35px">
                                    <image class="wh-full" v-if="item.brandLogo" :src="item.brandLogo"></image>
                                    <image class="wh-full" v-else src="../../assets/images/jx-without-image.svg"></image>
                                </div>
                                <div class="flex-1 overflow-hidden">
                                    <div class="text-32px font-bold mb-15px flex justify-between">
                                        <span> {{ item.serialNumber }}</span>
                                        <span class="text-hex-666 text-30px">通知次数：{{ item.noticeNumber || 0 }}</span>
                                    </div>
                                    <div class="text-30px mb-15px" :style="{ color: handleExceptionReason(item.type) }">
                                        {{ item.exceptionReason }}
                                    </div>
                                    <div class="text-30px text-hex-666">
                                        {{ dateFilter(item.exceptionTime, 'YYYY-MM-DD HH:mm') }}
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end mt-10px">
                                <nut-button size="small" class="h-60px" type="info"
                                    @click="noticeModal.open(item)">通知维护</nut-button>
                                <nut-button style="margin-left:15rpx" size="small" class="h-60px" type="primary"
                                    @click="handleModal.open(item.repairRecordId)">处理</nut-button>
                            </div>
                        </div>
                    </template>
                </nut-backtop>
            </jx-scroll-view>
        </div>

        <nut-dialog pop-class="form" no-cancel-btn v-model:visible="noticeModal.show" ok-text="通知"
            @ok="noticeModal.confirm">
            <nut-cell>
                <div>最后通知时间：{{ dateFilter(noticeModal.form.lastNoticeTime, 'YYYY-MM-DD HH:mm') }}</div>
            </nut-cell>
            <nut-cell>
                <div>通知内容：{{ noticeModal.form.smsContent }}</div>
            </nut-cell>
        </nut-dialog>

        <nut-dialog pop-class="form" no-cancel-btn v-model:visible="handleModal.show" ok-text="处理"
            @ok="handleModal.confirm">
            <nut-textarea placeholder="请输入处理意见" v-model="handleModal.form.advice" limit-show max-length="200" />
        </nut-dialog>
    </div>
</template>

<script setup lang="ts">
import { DeviceExceptionRecord, fetchDeviceExceptionRecords, updateNotice, updateRepairApplyRecord } from "~/api/device"
import { useDidShow } from '@tarojs/taro';
import Taro from "@tarojs/taro";
import { dateFilter } from "~/filter"
const state = reactive({
    content: [] as DeviceExceptionRecord[],
    totalCount: 0,
    totalPage: 0,
    page: 1
})
const tabList = ref<{
    key: "ABNORMAL" | "WARNING",
    text: string
}[]>([
    {
        key: 'ABNORMAL',
        text: '异常清单',

    },
    {
        key: 'WARNING',
        text: '预警清单',
    },
])
const tabIndex = ref<number>(0)
const changeTab = (index) => {
    tabIndex.value = index
    fetchData()
}
const handleExceptionReason = (state: Filter.RunningState) => {
    if (state === 'WARNING') {
        return '#f0a020'
    }
    if (state === 'ABNORMAL') {
        return '#f5222D'
    }
    return '#ddd'

}
//通知模态框
const noticeModal = reactive({
    show: false,
    form: {
        id: 0,
        smsContent: '',
        lastNoticeTime: ''
    } as DeviceExceptionRecord,
    confirm: async () => {
        try {
            await updateNotice(noticeModal.form.id)
            Taro.showToast({
                icon: 'success',
                title: '通知完成！'
            })
            setTimeout(() => {
                fetchData()
            }, 1000)
        } catch (error) {
            Taro.showToast({
                icon: 'none',
                title: error
            })
        }
    },
    open: (item: DeviceExceptionRecord) => {
        noticeModal.form = item
        noticeModal.show = true
    }
})
//处理模态框
const handleModal = reactive({
    show: false,
    form: {
        id: 0,
        advice: '',
        handleState: "HANDLED",
    },
    confirm: async () => {
        try {
            await updateRepairApplyRecord(handleModal.form)
            Taro.showToast({
                icon: 'success',
                title: '处理完成！'
            })
            setTimeout(() => {
                fetchData()
            }, 1000)
        } catch (error) {
            Taro.showToast({
                icon: 'none',
                title: error
            })
        }
    },
    open: (id: number) => {
        handleModal.form.id = id
        handleModal.show = true
    }
})

const refreshing = ref(false)
const nomore = ref(false)
useDidShow(async () => {
    await fetchData()
})
const fetchData = async () => {
    refreshing.value = false
    state.page = 1
    let { content, totalCount, totalPage } = await loadData()
    console.log('列表数据', content)
    state.content = content
    state.totalCount = totalCount
    state.totalPage = totalPage
    if (state.page === state.totalPage) {
        nomore.value = true
    }
}

async function loadData() {
    let res = await fetchDeviceExceptionRecords({
        page: state.page,
        size: 10,
        type: tabList.value[tabIndex.value].key
    })
    return Promise.resolve(res)
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
            let { content } = await loadData();
            state.content = [...state.content, ...content]
        }
    }, 1000);
}
const _onScroll = (e) => {
    console.log(e);
}

</script>

<style lang="scss">
.form {
    .nut-dialog__content {
        margin: 0;
    }
}

.header {
    height: 60px;
    line-height: 50px;
    text-align: center;
    background: #fff;
    border-bottom: solid 1px #f4f4f4;
}

.x-scroll-view {
    background-color: #fff;
}

.manage_item {
    width: 90%;
    margin: 15px auto;
    padding: 30px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: rgb(242, 243, 248);
    border-radius: 30px;
}

.tab_wrap {
    display: flex;
    margin: 0 25px;
    border-bottom: 2px solid #E5E8F2;

    .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: none;
        padding: 0 20px;

        &.active {

            border-bottom: 6px solid #ee0a24;

            .ft {
                color: #ee0a24;
            }

            .icon {
                color: #ee0a24;
            }
        }

        .ft {
            font-size: 32px;
            font-weight: bold;
            color: #9E9E9F;
            margin-top: 21px;
            margin-bottom: 25px;
        }

        .icon {
            color: #9E9E9F;
        }
    }
}
</style>