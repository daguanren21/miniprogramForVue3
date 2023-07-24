<template>
    <scroll-view id="scroll-view" :class="{ 'refresh': pullDownStatus === 3, 'finish': pullDownStatus === 4 }"
        class="scroll-view" :scrollY="true" :scroll-with-animation="true" :enable-back-to-top="true" @scroll="_onScoll"
        @touchend="_onTouchEnd" @scrolltolower="_onLoadmore">
        <view class="pulldown">
            <block v-if="pullDownStatus === 0 || pullDownStatus === 1">
                <text> {{ pullText }}</text>
            </block>
            <block v-if="pullDownStatus === 2">
                <text> {{ releaseText }}</text>
            </block>
            <block v-if="pullDownStatus === 3">
                <text> {{ loadingText }}...</text>
            </block>
            <block v-if="pullDownStatus === 4">
                <text> {{ finishText }}</text>
            </block>
        </view>
        <slot></slot>
        <view class="loadmore">
            <block v-if="nomore">
                <text>{{ nomoreText }}</text>
            </block>
            <block v-else>
                <text> {{ loadmoreText }}</text>
            </block>
        </view>
    </scroll-view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { ref, watch } from 'vue';

defineOptions({
    name: 'jxScrollView'
})
interface ScrollProps {
    pullText?: string;
    releaseText?: string;
    loadingText?: string;
    finishText?: string;
    loadmoreText?: string;
    nomoreText?: string;
    pullDownHeight?: number;
    refreshing: boolean;
    nomore: boolean
}

const props = withDefaults(defineProps<ScrollProps>(), {
    pullText: '下拉可以刷新',
    releaseText: '松开立即刷新',
    loadingText: '正在刷新数据中',
    finishText: '刷新完成',
    loadmoreText: '正在加载更多数据',
    nomoreText: '已经全部加载完毕',
    pullDownHeight: 60,
    refreshing: false,
    nomore: false
})
const pullDownStatus = ref(0)
const lastScrollEnd = ref(0)
usePullDownRefresh(() => {
    console.log('usePullDownRefresh:', '上拉更新')
})
useReachBottom(() => {
    console.log('useReachBottom:', '触底更新')
})
const emits = defineEmits<{
    scroll: [value: any],
    pulldownrefresh,
    loadmore
}>()
const _onScoll = (e) => {
    emits('scroll', e.detail)
    const status = pullDownStatus.value
    if (status === 3 || status == 4) return;
    const height = props.pullDownHeight;
    const scrollTop = e.detail.scrollTop;
    let targetStatus;
    if (scrollTop < -1 * height) {
        targetStatus = 2;
    } else if (scrollTop < 0) {
        targetStatus = 1;
    } else {
        targetStatus = 0;
    }
    if (status != targetStatus) {
        pullDownStatus.value = targetStatus
    }
}
watch(() => props.refreshing, (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
        props.nomore = false;
        pullDownStatus.value = 4
        lastScrollEnd.value = 0
        setTimeout(() => {
            pullDownStatus.value = 0
        }, 500);
    }
})
const _onTouchEnd = () => {
    const status = pullDownStatus.value;
    if (status === 2) {
        pullDownStatus.value = 3
        props.refreshing = true;
        setTimeout(() => {
            emits('pulldownrefresh');
        }, 500);
    }
}
const _onLoadmore = () => {
    if (!props.nomore) {
        let query = Taro.createSelectorQuery()
        query.select('#scroll-view').fields({
            size: true,
            scrollOffset: true
        }, () => {
            // if (Math.abs(res.scrollTop - lastScrollEnd.value) < res.height) {
            //     lastScrollEnd.value = res.scrollTop
            emits('loadmore')
            // }
        }).exec()
    }
}
</script>

<style lang="scss">
:host {
    position: relative;
    overflow: hidden;
    display: block;
}

.scroll-view {
    height: calc(100% + 40px);
    transform: translateY(-40px);
}

.scroll-view.refresh {
    transform: translateY(0);
}

@keyframes finish {
    from {
        transform: translateY(0)
    }

    to {
        transform: translateY(-40px)
    }
}

.scroll-view.finish {
    animation: finish 0.5s;
}

.pulldown {
    height: 40px;
    width: 100%;
    line-height: 40px;
    text-align: center;
}

.pulldown text {
    color: #222;
}

.loadmore {
    height: 60px;
    width: 100%;
    line-height: 60px;
    text-align: center;
}

.loadmore text {
    color: #444;
}

@keyframes loading {
    0% {
        transform: rotate(0deg)
    }

    50% {
        transform: rotate(180deg)
    }

    100% {
        transform: rotate(360deg)
    }
}

.loading {
    display: inline-block;
    transform-origin: 50% 50%;
    animation: loading 1s linear infinite;
}
</style>