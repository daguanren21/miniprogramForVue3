<template>
    <view class="news_wrap bg-hex-fff">
        <view class="title mb-37px">{{ info.title }}</view>
        <view class="publish_time flex-y-center justify-between">
            <text>{{ dateFilter(info.publishTime) }}</text>
            <div class="flex-y-center">
                <jx-icon value="eye" color="#c1c1c1" :size="14"></jx-icon>
                <span class="ml-10px">{{ info.readCount }}</span>
            </div>
        </view>
        <view class="content mt-74px">
            <rich-text :nodes="info.content" space="nbsp"></rich-text>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { useDidShow, useRouter } from "@tarojs/taro";
import { News, fetchNewsInfo, updateNews } from "~/api/user";
import { dateFilter } from "~/filter"
const router = useRouter()
const info = ref<News>({
    content: '',
    description: '',
    id: 0,
    likeCount: 0,
    publishTime: '',
    readCount: 0,
    title: '',
    titleImagePath: '',
    top: false,
})
useDidShow(async () => {
    let id = router.params.id || ''
    let res = await fetchNewsInfo(Number(id))
    await updateNews(Number(id))
    info.value = res
})
</script>
<style lang="scss">
rich-text{
    word-break: break-all;
}
.news_wrap {
    height: 100%;
    padding: 48px 50px 0 50px;
    overflow: auto;
    box-sizing: border-box;

    .title {
        width: 100%;
        word-break: break-all;
        font-size: 32px;
        font-weight: bold;
        color: #161616;
    }

    .publish_time {
        font-size: 26px;
        font-weight: 400;
        color: #C1C1C1;
    }

    .content {
        font-size: 34px;
        font-weight: 400;
        color: 434343;
        line-height: 42px;
    }
}
</style>
  