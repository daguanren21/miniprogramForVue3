<template>
    <view class="news_wrap bg-hex-fff">
        <view class="title">{{ info.title }}</view>
        <view class="publish_time">
            <text>{{ dateFilter(info.publishTime) }}</text>
            <text class="ml-20">{{ info.readCount }}人阅读</text>
        </view>
        <view class="content">
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
.news_wrap {
    height: 100%;
    padding: 0 50px;
    padding-bottom: 20px;
    overflow: auto;
    box-sizing: border-box;

    .title {
        margin-top: 26px;
        font-size: 38px;
        font-weight: bold;
        color: #3e3a39;
    }

    .image {
        height: 330px;
        margin: 26px 0;
    }

    .publish_time {
        margin-top: 20px;
        font-size: 26px;
        font-weight: 400;
        color: #717071;
    }

    .content {
        margin: 25px 0;
        font-size: 34px;
        font-weight: 400;
        color: #727171;
        line-height: 42px;
    }
}
</style>
  