<template>
    <div class="h-full bg-hex-f7f7f7">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <div class="h-full overflow-hidden" v-if="state.totalPage">
            <jx-scroll-view class="x-scroll-view" :refreshing="refreshing" :nomore="nomore"
                @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
                <nut-backtop height="100%">
                    <template v-slot:content>
                        <div class="w-720px m-x-15px p-x-30px pt-45px mt-15px pb-15px box-border bg-hex-fff rounded-20px"
                            v-for="item in  state.content " :key="item.id">
                            <div class="flex-y-center justify-between">
                                <span class="text-30px text-hex-333 font-bold">{{ item.deviceSerialNumber }}</span>
                                <span class="text-24px text-hex-999">{{ dateFilter(item.createdDate) }}</span>
                            </div>
                            <div class="mt-37px text-26px flex-y-center">
                                <div class="text-hex-575757">设备变化：</div>
                                <div class="flex-y-center  text-28px">
                                    <span
                                        :style="{ color: filter(deviceRunningStateFilter(item.oldRunningState).type).borderColor }">{{
                                            deviceRunningStateFilter(item.oldRunningState).text }}</span>
                                    <jx-icon class="p-x-10px" value="center-arrow" color="#3C3C3C"></jx-icon>
                                    <span
                                        :style="{ color: filter(deviceRunningStateFilter(item.newRunningState).type).borderColor }">{{
                                            deviceRunningStateFilter(item.newRunningState).text }}</span>
                                </div>
                            </div>
                            <div class="flex-y-center justify-between mt-18px">
                                <div class="flex-y-center text-26px text-hex-575757">
                                    审核状态：<span class="text-hex-409EFF text-28px">待审核</span>
                                </div>
                                <nut-button type='primary' class="jx-button" @click="dialog.open(item.id)">审核</nut-button>
                            </div>
                            <div class="mt-18px flex-y-center">
                                <div @click="preview(handleImages(item.imagesPath))"
                                    v-for="image in handleImages(item.imagesPath)" class="m-x-5px w-160px h-160px">
                                    <image :src="image" class="wh-full"></image>
                                </div>
                            </div>
                        </div>
                    </template>
                </nut-backtop>
            </jx-scroll-view>
        </div>
        <div v-else class="flex-center h-full overflow-hidden">
            <nut-empty description="暂无数据"></nut-empty>
        </div>
        <nut-popup position="bottom" closeable round :style="{ height: '53%' }" v-model:visible="dialog.show">
            <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">异常设备审核</div>
            <div class="w-full flex-col items-center">
                <nut-form :model-value="form" ref="ruleForm">
                    <nut-form-item label="审核状态" required>
                        <nut-radio-group direction="horizontal" v-model="form.state">
                            <nut-radio label="APPROVE">通过</nut-radio>
                            <nut-radio label="REJECT">拒绝</nut-radio>
                        </nut-radio-group>
                    </nut-form-item>
                    <nut-form-item required>
                        <div class="w-684px h-256px jx-textarea">
                            <nut-textarea placeholder="请输入审核意见" v-model="form.remarks" limit-show max-length="200" />
                        </div>
                    </nut-form-item>
                </nut-form>
                <nut-button type='info' style="width: 550rpx;height:73rpx;font-size: 30rpx;" @click="dialog.confirm"
                    :loading="loading">审核</nut-button>
            </div>
        </nut-popup>
    </div>
</template>

<script setup lang="ts">
import { DeviceCheckRecord, fetchDeviceCheckRecords, updateDeviceCheckRecords } from "~/api/device"
import { useDidShow } from '@tarojs/taro';
import { deviceRunningStateFilter, dateFilter } from '~/filter'
import { filter, preview, handleImages } from '~/utils/index'
import Taro from "@tarojs/taro";
import { useNotify } from "~/composables/use-notify";
import useLoading from "~/composables/use-loading";
const { state: message, notify } = useNotify('danger')
const state = reactive({
    content: [] as DeviceCheckRecord[],
    totalCount: 0,
    totalPage: 0,
    page: 1
})
const form = reactive({
    id: 0,
    remarks: '',
    state: 'APPROVE' as Filter.CheckState
})
const { loading, startLoading, endLoading } = useLoading()
const dialog = reactive({
    show: false,
    confirm: async () => {
        try {
            if (!form.remarks) {
                notify('审核意见不能为空！')
                return
            }
            startLoading()
            await updateDeviceCheckRecords(form)
            setTimeout(() => {
                Taro.showToast({
                    icon: 'none',
                    title: `审核${form.state === 'APPROVE' ? '通过' : '拒绝'}`
                })
                endLoading()
                dialog.show = false
                fetchData()
            }, 1000)
        } catch (error) {
            endLoading()
            Taro.showToast({
                icon: 'none',
                title: error
            })
        }
    },
    open: (id: number) => {
        form.id = id
        dialog.show = true
    }
})

const refreshing = ref(false)
const nomore = ref(false)
useDidShow(async () => {
    await fetchData()
})
const fetchData = async () => {
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
    let res = await fetchDeviceCheckRecords({
        page: state.page,
        size: 10
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
</style>