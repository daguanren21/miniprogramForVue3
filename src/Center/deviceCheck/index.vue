<template>
    <div class="h-full">
        <jx-scroll-view class="x-scroll-view" :refreshing="refreshing" :nomore="nomore"
            @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
            <nut-backtop height="100%">
                <template v-slot:content>
                    <div class="manage_item" v-for="item in state.content" :key="item.id">
                        <div class="ml-15px text-30px font-bold flex-y-center justify-between">
                            <div class="flex-y-center">
                                {{ item.deviceSerialNumber }}
                                <jx-dot class="ml-15px" :state="checkStateFilter(item.state)"></jx-dot>
                            </div>
                            <div>
                                <nut-button size="small" class="h-60px" type="primary"
                                    @click="dialog.open(item.id)">审核</nut-button>
                            </div>
                        </div>
                        <div class="ml-15px text-28px p-y-15px flex-y-center">
                            <div>设备变化：</div>
                            <div class="flex-y-center">
                                <span :style="{ 'color': filter(deviceRunningStateFilter(item.oldRunningState).type) }">{{
                                    deviceRunningStateFilter(item.oldRunningState).text }}</span>
                                <jx-icon class="p-x-10px" value="center-arrow" color="#333"></jx-icon>
                                <span :style="{ 'color': filter(deviceRunningStateFilter(item.newRunningState).type) }">{{
                                    deviceRunningStateFilter(item.newRunningState).text }}</span>
                            </div>
                        </div>
                        <div class="flex-y-center mt-15px">
                            <image class="m-x-15px w-100px h-100px" v-for="image in handleImages(item.imagesPath)"
                                :src="image">
                            </image>
                        </div>
                    </div>
                </template>
            </nut-backtop>
        </jx-scroll-view>
        <nut-dialog pop-class="form" no-cancel-btn v-model:visible="dialog.show" @ok="dialog.confirm">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item label="审核类型" required>
                    <nut-radio-group direction="horizontal" v-model="form.state">
                        <nut-radio label="APPROVE">通过</nut-radio>
                        <nut-radio label="REJECT">拒绝</nut-radio>
                    </nut-radio-group>
                </nut-form-item>
                <nut-form-item label="审核原因" required>
                    <nut-textarea :autosize="{
                        minHeight: 80
                    }" placeholder="请输入审核原因" v-model="form.remarks" limit-show max-length="200" />
                </nut-form-item>
            </nut-form>
        </nut-dialog>
    </div>
</template>

<script setup lang="ts">
import { DeviceCheckRecord, fetchDeviceCheckRecords, updateDeviceCheckRecords } from "~/api/device"
import { useDidShow } from '@tarojs/taro';
import { checkStateFilter, deviceRunningStateFilter } from '~/filter'
import { filter } from '~/utils'
import Taro from "@tarojs/taro";
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
const dialog = reactive({
    show: false,
    confirm: async () => {
        try {
            await updateDeviceCheckRecords(form)
            Taro.showToast({
                icon: 'none',
                title: `审核${form.state === 'APPROVE' ? '通过' : '拒绝'}`
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
//处理图片
function handleImages(images) {
    return images ? images.split(';').filter(v => v) : []
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

    .top {
        display: flex;

        .left {
            width: 153px;
            height: 153px;
            margin-right: 26px;

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
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 27px;
                    font-weight: bold;
                    color: #3E3A39;
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
                        margin-right: 24px;
                    }

                    .text {
                        max-width: 300px;
                        font-size: 24px;
                        font-weight: 400;
                        color: #595757;

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
            background-color: #fff;

            .icon_module {
                display: flex;
                align-items: center;
                width: 118rpx;
            }

            .flex_dot {
                margin-left: 35px;
            }

            .ft {
                margin: 15px 0;
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