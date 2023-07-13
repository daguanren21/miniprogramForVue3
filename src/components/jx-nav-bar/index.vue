<template>
    <div class="bg-hex-fff" :style="{ height: totalHeight + 'px' }">
        <div :style="{ height: statusBarHeight + 'px' }"></div>
        <nut-navbar :title="title" :style="{ height: navBarHeight + 'px' }">
            <template #left>
                <slot name="left"></slot>
            </template>
        </nut-navbar>
    </div>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from "@tarojs/taro"
import { reactive, toRefs } from "vue";
defineOptions({
    name: 'JxNavBar'
})
defineProps<{
    title: string
}>()
const navBar = reactive({
    totalHeight: 0,
    navBarHeight: 0,
    statusBarHeight: 0
})
useDidShow(async () => {
    const info = await Taro.getSystemInfo()
    const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
    const statusBarHeight = info.statusBarHeight || 0
    navBar.statusBarHeight = statusBarHeight
    const navBarHeight = (menuButtonInfo.bottom - statusBarHeight) + (menuButtonInfo.top - statusBarHeight) + 4
    navBar.navBarHeight = navBarHeight
    navBar.totalHeight = statusBarHeight + navBarHeight
})

const { statusBarHeight, navBarHeight, totalHeight } = toRefs(navBar)


</script>

<style lang="scss">
.nut-navbar__title {
    .title {
        font-size: 30px;
        color: black;
    }
}
</style>