<template>
    <div class="h-full overflow-hidden bg-hex-F7F7F7">
        <div class="h-full overflow-hidden" v-if="state.totalCount">
            <jx-scroll-view class="x-scroll-view" :refreshing="refreshing" :nomore="nomore"
                @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
                <div class="bg-hex-fff rounded-20px  w-709px flex-y-center m-auto  mt-20px" @click="goToInfo(item.id)"
                    v-for="item in state.content" :key="item.id">
                    <div class="w-200px h-170px mr-16px">
                        <image :src="item.imagePath" class="wh-full"></image>
                    </div>
                    <div class="p-y-30px p-r-30px flex-1">
                        <div class="text-30px text-hex-333 mb-29px line-clamp-1 break-all">{{ item.name }} </div>
                        <div class="text-24px text-hex-3BD5AC mb-34px flex-y-center">
                            <jx-icon value="time" color="#3BD5AC" :size="14"></jx-icon>
                            <span class="ml-10px">{{ dateFilter(item.startTime, "YYYY-MM-DD") }}</span>
                        </div>
                        <div class="flex-y-center justify-between">
                            <div class="text-26px text-hex-525252 line-clamp-1 break-all flex-1">联系人：{{ item.userName }}
                            </div>
                            <div class="text-26px text-hex-409EFF flex-y-center"
                                @click.stop="makePhoneCall(item.phoneNumber)">
                                <jx-icon value="phone" color="#409EFF" :size="16"></jx-icon>
                                <span class="ml-5px">{{
                                    item.phoneNumber }}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </jx-scroll-view>
        </div>
        <div v-else class="h-full flex-center overflow-hidden">
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








