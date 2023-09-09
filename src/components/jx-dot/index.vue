<template>
    <view class="jx-status" >
        <view class="dot" :style="{
            backgroundColor: filter(state.type).borderColor,
            borderColor: filter(state.type).borderColor,
        }">
        </view>
        <text class="code" :style="{ color: filter(state.type).borderColor }">
            {{ state.text }}
        </text>
    </view>
</template>

<script setup lang="ts">
import { DotType } from '~/filter';
import { filter } from '~/utils'
defineOptions({
    name: 'JxDot'
})
defineProps<{
    state: {
        type: DotType,
        text: string
    }

}>()

</script>

<style lang="scss">
.jx-status {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    line-height: 44px;
    border-radius: 15px;

    .dot {
        width: 10px;
        height: 10px;
        margin-right: 10px;
        border-radius: 50%;
        background-color: #32B44B;
    }

    .code {
        font-size: 24px;
        font-weight: 400;
        color: #727171;
    }
}
</style>