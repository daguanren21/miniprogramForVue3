<template>
    <view class="h-full overflow-auto bg-hex-F7F7F7 flex-col items-center">
        <div class="w-709px flex-y-center  mt-20px bg-hex-fff rounded-20px">
            <div class="w-253px h-170px mr-16px">
                <image :src="info.imagePath" class="wh-full"></image>
            </div>
            <div class="p-y-30px p-r-30px flex-1 box-border">
                <div class="text-30px text-hex-333 mb-29px break-all">{{ info.name }} </div>
                <div class="text-24px text-hex-3BD5AC mb-34px flex-y-center">
                    <jx-icon value="time" color="#3BD5AC" :size="14"></jx-icon>
                    <span class="ml-10px">开始时间：{{ dateFilter(info.startTime, "YYYY-MM-DD") }}</span>
                </div>
                <div class="flex-y-center justify-between">
                    <div class="text-26px text-hex-525252 flex flex-1">总课时：<span
                            class="text-hex-333 line-clamp-1 break-all">{{ info.classHour }}h</span>
                    </div>
                    <div class="text-26px text-hex-525252 flex">课程人数：
                        <span class="text-hex-333">{{ noDataFilter(info.personNumber) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-56px w-709px">
            <div class="flex-y-center ml-20px">
                <div class="w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                <div class="ml-11px text-30px text-hex-333">课程信息</div>
            </div>
            <div class="mt-24px w-full bg-hex-fff rounded-20px p-42px box-border">
                <div class="text-28px text-hex-525252 mb-30px">联系人：{{ info.userName }}</div>
                <div class="text-28px text-hex-525252 mb-30px flex-y-center" @click="makePhoneCall(info.phoneNumber)">联系电话：
                    <jx-icon value="phone" color="#409EFF" :size="16"></jx-icon>
                    <span class="text-hex-409EFF">{{ info.phoneNumber }}</span>
                </div>
                <div class="text-28px text-hex-525252 mb-30px">价格：{{ noDataFilter(info.price) }}元</div>
                <div class="text-28px text-hex-525252  mb-30px break-all">报名网址：{{ noDataFilter(info.url) }}</div>
                <div class="text-28px text-hex-525252 break-all">授课地址：{{ noDataFilter(info.classAddress) }}</div>
            </div>
        </div>
        <div class="mt-56px w-709px">
            <div class="flex-y-center ml-20px">
                <div class="w-8px h-36px bg-hex-409EFF rounded-4px"></div>
                <div class="ml-11px text-30px text-hex-333">课程简介</div>
            </div>
            <div class="mt-24px w-full bg-hex-fff rounded-20px p-42px box-border">
                <div class="text-28px text-hex-525252" v-if="info.introduction">
                    <text v-html="info.introduction"></text>
                </div>
                <div class="text-28px text-hex-525252" v-else>
                    {{ noDataFilter(info.introduction) }}
                </div>
            </div>
        </div>
        <!-- <div class="c_pad course_info_header flex">
            <view class="h-l">
                <image style="height: 100%; width: 100%" :src="info.imagePath"></image>
            </view>
            <div class="h-r">
                <view class="title">{{ info.name }}</view>
                <view class="m">
                    <view class="m-col" style="flex: 0.5">
                        <view class="top">总课时 </view>
                        <view class="num">{{ info.classHour }}h </view>
                    </view>
                    <view class="line"> </view>
                    <view class="m-col">
                        <view class="top">课程人数 </view>
                        <view class="num"> {{ noDataFilter(info.personNumber) }}</view>
                    </view>
                </view>
            </div>
        </div>

        <view class="detail c_pad">
            <view class="title">课程信息</view>
            <view class="col">
                <view class="label">联系人： </view>
                <view class="content">{{ info.userName }} </view>
            </view>
            <view class="col" @tap="makePhoneCall(info.phoneNumber)">
                <view class="label"> 联系电话： </view>
                <view class="content" style="color: #1890ff">{{ info.phoneNumber }}
                </view>
            </view>
            <view class="col">
                <view class="label"> 价格： </view>
                <view class="content">{{ noDataFilter(info.price) }} </view>
            </view>
            <view class="col" v-if="info.url">
                <view class="label"> 报名网址： </view>
                <view class="content">{{ noDataFilter(info.url) }} </view>
            </view>
        </view>
        <view class="detail c_pad">
            <view class="title">课程简介</view>
            <view class="info" v-if="info.introduction">
                <text v-html="info.introduction"></text>
            </view>
            <view class="info" v-else>
                {{ noDataFilter(info.introduction) }}
            </view>
        </view> -->
    </view>
</template>

<script setup lang="ts">
import { useDidShow, useRouter } from '@tarojs/taro';
import { Course, fetchTrainingCourseInfo } from '~/api/user';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import { dateFilter, noDataFilter } from '~/filter'
const { makePhoneCall } = useQQMapSdk()
const id = useRouter().params.id || 0
let info = ref<Course>({
    classAddress: '',
    courseType: '',
    description: '',
    id: 0,
    classHour: 0,
    endTime: '',
    imagePath: '',
    name: '',
    introduction: '',
    personNumber: '',
    phoneNumber: '',
    price: '',
    startTime: '',
    url: '',
    userName: ''
})
useDidShow(async () => {
    let res = await fetchTrainingCourseInfo(Number(id))
    info.value = res
})
</script>

<style lang="scss">
rich-text{
    word-break: break-all;
}
.c_pad {
    padding: 0 48px;
    box-sizing: border-box;
}

.course_info {
    overflow: auto;
    height: 100%;

    &_header {
        padding-top: 32px;

        .h-l {
            width: 258px;
            height: 334px;
            border-radius: 25px;
            background: #e5e8f2;
        }

        .h-r {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 30px;
            white-space: initial;

            .title {
                word-break: break-all;
                font-size: 40px;
                font-weight: bold;
                color: #3e3a39;
            }

            .m {
                display: flex;

                .m-col {
                    flex: 1;
                    word-break: break-all;
                    text-align: cemter;

                    .top {
                        margin-bottom: 18px;
                        font-size: 32px;
                        font-weight: 400;
                    }

                    .num {
                        font-size: 34px;
                        font-weight: 400;
                        color: #fe4c17;
                    }
                }

                .line {
                    width: 4px;
                    margin: 0 29px;
                    background: #717071;
                }
            }
        }
    }

    .col {
        display: flex;
        margin-top: 25px;
        font-size: 28px;
        font-weight: 400;
        color: #717071;

        .content {
            flex: 1;
            word-break: break-all;
        }
    }

    .detail {
        margin-top: 75px;

        .title {
            font-size: 36px;
            font-weight: bold;
            color: #3e3a39;
            margin-bottom: 37px;
        }

        .info {
            margin-bottom: 50px;
            font-size: 30px;
            font-weight: 400;
            color: #727171;
            line-height: 42px;
            word-break: break-all;
        }
    }
}
</style>