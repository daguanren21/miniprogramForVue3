<template>
    <div class="h-full overflow-hidden">
        <div class="h-full overflow-hidden" v-if="state.totalCount">
            <jx-scroll-view style="background-color: transparent;" class="x-scroll-view" :refreshing="refreshing"
                :nomore="nomore" @pulldownrefresh="_onPullDownRefresh" @loadmore="_onLoadmore" @scroll="_onScroll">
                <nut-backtop height="100%">
                    <template v-slot:content>
                        <div v-for="item in state.content"
                            class="flex-col rounded-20px m-x-15px bg-hex-fff p-32px m-y-20px">
                            <div class="flex-y-center justify-between">
                                <div class="flex-y-center">
                                    <image class="w-61px h-61px" src="../../assets/images/center/消息.png"></image>
                                    <p class="text-30px font-bold text-hex-333 ml-17px">{{ item.eventTypeName }}</p>
                                    <jx-dot class="ml-15px" :state="messageLevelFilter(item.level)" />
                                </div>
                                <nut-button  class="jx-button"  type="primary"
                                            @click="handleRemark(item)">标记已读</nut-button>
                            </div>
                            <div class="text-26px text-hex-#333 mt-28px break-all">{{ item.content }}</div>
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
import Taro, { getCurrentPages } from '@tarojs/taro';
import { useDidShow } from '@tarojs/taro';
import { Message, fetchUnreadMessages, updateReadMarks } from "~/api/user";
import { messageLevelFilter } from '~/filter/index'
const state = reactive({
    content: [] as Message[],
    totalCount: 0,
    totalPage: 0,
    page: 1
})
const refreshing = ref(false)
const nomore = ref(false)
useDidShow(async () => {
    state.page = 1
    let { content, totalCount, totalPage } = await loadData()
    console.log('列表数据', content)
    state.content = content
    state.totalCount = totalCount
    state.totalPage = totalPage
    if (state.page === state.totalPage) {
        nomore.value = true
    }
})

async function loadData() {

    let res = await fetchUnreadMessages({
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

//标记已读
const handleRemark = async (item: Message) => {
    try {
        await updateReadMarks(item.id)
        Taro.showToast({
            icon: 'success',
            title: "标记已读！"
        })
        setTimeout(async () => {
            const pages = getCurrentPages()
            const perpage = pages[pages.length - 1]
            perpage.onShow()
        }, 1000)
    } catch (error) {
        Taro.showToast({
            icon: 'none',
            title: error
        })
    }
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

.x-scroll-view {
    background-color: #fff;
}
</style>