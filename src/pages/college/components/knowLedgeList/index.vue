<template>
    <div class="h-full overflow-hidden p-x-29px">
        <div v-if="state.totalCount" class="h-full overflow-hidden">
            <jx-scroll-view class="x-scroll-view" :refreshing="refreshing" :nomore="nomore"
                @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
                <div @click="toCollege('newsInfo', item.id)" v-for="item in state.content"
                    class="flex-y-center w-680px h-263px  rounded-20px relative shadow-sm bg-hex-fff m-auto mb-28px">
                    <div class="w-178px h-237px rounded-20px">
                        <image class="wh-full" :src="item.titleImagePath"></image>
                    </div>
                    <div class="flex-1 overflow-hidden mr-38px ml-22px">
                        <div class="text-28px text-hex-333 font-500  mb-25px line-clamp-1 break-all">
                            {{ item.title }}
                        </div>
                        <div class="text-24px text-hex-979797  mb-42px line-clamp-3">
                            {{ removeHTMLTag(item.content) }}
                        </div>
                        <div class="flex-y-center justify-between  text-24px text-hex-c1c1c1">
                            <div>{{ dateFilter(item.publishTime) }}</div>
                            <div>{{ item.readCount }}</div>
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
import Taro from '@tarojs/taro';
import { News, fetchNews } from '~/api/user';
import { dateFilter } from '~/filter'
import { removeHTMLTag } from '~/utils'
const state = reactive({
    content: [] as News[],
    totalCount: 0,
    totalPage: 0,
    page: 1
})
const refreshing = ref(false)
const nomore = ref(false)

onMounted(async () => {
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
    let res = await fetchNews({
        page: state.page,
        size: 10
    })
    return Promise.resolve(res)
}
const toCollege = (key: string, id: number) => {
    Taro.navigateTo({
        url: `/College/${key}/index?id=${id}`
    })
}
</script>

<style lang="scss">
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








