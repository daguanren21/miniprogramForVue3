<template>
    <div class="h-full overflow-hidden bg-hex-fff">
        <div class="h-full overflow-hidden" v-if="state.content.length">
            <jx-scroll-view class="x-scroll-view" :refreshing="refreshing" :nomore="nomore"
                @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
                <nut-row @click="goToInfo(item.id)" class="college_list_item" v-for="item in state.content">
                    <nut-col :span="8" class="h-full">
                        <image class="wh-full" :src="item.imagePath"></image>
                    </nut-col>
                    <nut-col :offset="2" :span="12" class="h-full flex-col justify-center">
                        <view class="text-32px font-bold text-hex-3e3a39 line-clamp-1">
                            {{ item.name }}
                        </view>
                        <view @tap.stop="makePhoneCall(item.phoneNumber)"
                            class="content flex-y-center text-28px font-400 text-hex-727171 flex-1">
                            <text class="text-30px">{{ item.userName }}</text>
                            <jx-icon style="color:#f5222D" class="icon ml-20px" value="course-phone" :size="20"></jx-icon>
                            <text class="text-30px" style="color: #1890ff">{{ item.phoneNumber }}</text>
                        </view>
                        <view class="text-24px font-400 text-hex-#727171 flex-y-center">
                            <view>{{ dateFilter(item.startTime, 'YYYY-MM-DD') }}</view>
                        </view>
                    </nut-col>
                </nut-row>
            </jx-scroll-view>
        </div>
        <div class="h-full flex-center overflow-hidden">
            <nut-empty description="暂无数据"></nut-empty>
        </div>
    </div>
</template>

<script setup lang="ts">
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { Course, fetchTrainingCourses } from '~/api/user';
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import { dateFilter } from '~/filter'
const courseType = useRouter().params.courseType as Filter.CourseType
const { makePhoneCall } = useQQMapSdk()
const state = reactive({
    content: [] as Course[],
    totalCount: 0,
    totalPage: 0,
    page: 1
})
const refreshing = ref(false)
const nomore = ref(false)

useDidShow(async () => {
    await fetchData()
})
const _onPullDownRefresh = () => {
    setTimeout(() => {
        refreshing.value = false
    }, 2000);
}
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

const loadData = async () => {
    let res = await fetchTrainingCourses(
        {
            page: state.page,
            size: 10,
            courseType
        }
    )
    return Promise.resolve(res)
}

const goToInfo = (id: number) => {
    Taro.navigateTo({
        url: `/College/courseInfo/index?id=${id}`
    })
}
</script>

<style lang="scss">
.course_list {
    height: 100%;
    padding: 0 30px;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 25px 0;
        font-size: 32px;
        font-weight: bold;
        color: #3e3a39;
    }

    .content {
        padding-bottom: 30px;
        border-bottom: 2px solid #e5e8f2;
        min-height: 260px;
        width: 100%;

        .item {
            padding: 0 5px;

            .image {
                width: 100%;
                height: 180px;
                background: #e5e8f2;
                border-radius: 15px;
            }

            .title {
                font-size: 30px;
                font-weight: 400;
                color: #727171;
                margin-top: 17px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .time {
                font-size: 26px;
                font-weight: 400;
                color: #727171;
                margin-top: 20px;
            }

            .phone {
                margin-top: 20rpx;
                display: flex;
                align-items: center;

                .icon {
                    color: #ff6216;
                }

                .name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .ft {
                    font-size: 26px;
                    font-weight: 400;
                    color: #727171;
                }
            }
        }
    }
}

.college_list_item {
    height: 225px;
    margin: 0 25px;
    margin-top: 40px;
    width: 100%;
    padding-bottom: 30rpx;
    border-bottom: 1px solid #e5e8f2;
    box-sizing: border-box;

    .content {
        text {
            display: -webkit-box;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>








