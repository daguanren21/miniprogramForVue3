<template>
    <div class="h-full flex-col overflow-hidden bg-hex-F7F7F7">
        <div>
            <div class="tab_wrap pt-29px pb-18px box-border">
                <nut-row>
                    <nut-col @tap="changeTab(index)" v-for="(item, index) in tabList" :span="12" :key="'tab' + index">
                        <div class="tab" :class="{ active: index == tabIndex }">
                            <p class="ft">{{ item.text }}清单</p>
                            <div v-if="index === tabIndex" class="mt-10px w-52px h-10px rounded-20px bg-hex-409EFF">
                            </div>
                        </div>
                    </nut-col>
                </nut-row>
            </div>
        </div>
        <div class="flex-1 overflow-hidden">
            <div class="h-full overflow-hidden" v-if="state.totalPage">
                <jx-scroll-view class="x-scroll-view" :refreshing="refreshing" :nomore="nomore"
                    @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
                    <nut-backtop height="100%">
                        <template v-slot:content>
                            <div class="manage_item" v-for="item in state.content" :key="item.id">
                                <div class="flex">
                                    <div class="w-180px h-180px mr-30px">
                                        <image class="wh-full" v-if="item.brandLogo" :src="item.brandLogo"></image>
                                        <image class="wh-full" v-else src="../../assets/images/index/默认图.jpg">
                                        </image>
                                    </div>
                                    <div class="flex-1 overflow-hidden">
                                        <div class="flex-y-center justify-between">
                                            <span class="text-30px text-hex-333 font-bold">{{ item.serialNumber }}</span>
                                            <span class="text-24px text-hex-999"> {{ dateFilter(item.exceptionTime,
                                                'YYYY-MM-DD HH:mm') }}</span>
                                        </div>
                                        <div class="mt-30px text-26px" :style="{ color: handleExceptionReason(item.type) }">
                                            {{ item.exceptionReason }}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex-y-center justify-between mt-27px">
                                    <div class="text-26px text-hex-999">通知次数：{{ item.noticeNumber || 0 }}</div>
                                    <div class="flex justify-end">
                                        <nut-button size="small" class="h-60px" type="primary"
                                            @click="noticeModal.open(item)">通知维护</nut-button>
                                        <nut-button style="margin-left:20rpx" size="small" class="h-60px" type="danger"
                                            @click="handleModal.open(item.repairRecordId)">处理</nut-button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </nut-backtop>
                </jx-scroll-view>
            </div>
            <div class="flex-center h-full overflow-hidden">
                <nut-empty description="暂无数据"></nut-empty>
            </div>
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
        <nut-popup position="bottom" closeable round :style="{ height: '43%' }" v-model:visible="handleModal.show">
            <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">{{ tabList[tabIndex].text }}设备处理</div>
            <div class="w-full flex-col items-center">
                <div class="mt-37px mb-34px w-684px h-256px jx-textarea">
                    <nut-textarea placeholder="请输入处理意见" v-model="handleModal.form.advice" limit-show max-length="200" />
                </div>
                <nut-button type='info' style="width: 550rpx;height:73rpx;font-size: 30rpx;"
                    @click="handleModal.confirm">处理</nut-button>
            </div>
        </nut-popup>
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
        text: '异常',

    },
    {
        key: 'WARNING',
        text: '预警',
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
        return '#EA2E1E'
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
            handleModal.show = false
            setTimeout(() => {
                Taro.showToast({
                    icon: 'success',
                    title: '处理完成！'
                })
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
    nomore.value = false
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



.manage_item {
    width: 730px;
    margin: 20px auto;
    padding: 15px 15px 35px 25px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 20px;
}

.tab_wrap {
    display: flex;
    margin: 0 14px;

    .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: none;
        padding: 0 20px;

        &.active {

            .ft {
                font-weight: bold;
                color: #409EFF;
            }

        }

        .ft {
            font-size: 32px;
            color: #333333;
        }
    }
}
</style>