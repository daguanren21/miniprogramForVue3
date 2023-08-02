<template>
    <div class="h-full overflow-hidden">
        <jx-scroll-view class="x-scroll-view" :refreshing="refreshing" :nomore="nomore"
            @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
            <nut-row @click="toCollege('newsInfo',item.id)" class="college_list_item" v-for="item in state.content">
                <nut-col :span="8" class="h-full">
                    <image class="wh-full" :src="item.titleImagePath"></image>
                </nut-col>
                <nut-col :offset="2" :span="12" class="h-full flex-col justify-center">
                    <view class="text-32px font-bold text-hex-3e3a39 line-clamp-1">
                        {{ item.title }}
                    </view>
                    <view class="content flex-y-center text-28px font-400 text-hex-727171 flex-1">
                        {{ removeHTMLTag(item.content) }}
                    </view>
                    <view class="text-24px font-400 text-hex-#727171 flex-y-center">
                        <view>{{ dateFilter(item.publishTime) }}</view>
                        <view class="ml-20px">{{ item.readCount }}人阅读</view>
                    </view>
                </nut-col>
            </nut-row>
        </jx-scroll-view>
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
const toCollege = (key: string,id:number) => {
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








