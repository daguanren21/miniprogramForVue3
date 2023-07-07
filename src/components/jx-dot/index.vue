<template>
    <view class="jx-status" :style="{
        borderColor: filter(state.type),
    }">
        <view class="dot" :style="{
            backgroundColor: filter(state.type),
            borderColor: filter(state.type),
        }">
        </view>
        <text class="code">
            {{ state.text }}
        </text>
    </view>
</template>

<script setup lang="ts">
type DotType = 'success' | 'error' | 'warn' | 'info' | 'default'
defineOptions({
    name: 'JxDot'
})
defineProps<{
    state: {
        type: DotType,
        text: string
    }

}>()
const filter = (type: DotType) => {
    let color = '#33CC33'
    switch (type) {
        case 'success':
            color == '#33CC33'
            break;
        case 'info':
            color == '#6190E8'
            break;
        case 'error':
            color == '#C30D23'
            break;
        case 'warn':
            color == '#FF6216'
            break;
        case 'warn':
            color == '#B4B4B4'
            break;
        default:
            break;
    }
    return color
}
</script>

<style lang="scss">
@import url(./index.scss);
</style>