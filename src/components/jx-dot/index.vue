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
    width: 173px;
    height: 44px;
    line-height: 44px;
    border: 1px solid rgba(42, 208, 61, 1);
    border-radius: 15px;

    .dot {
        width: 23px;
        height: 23px;
        margin-right: 10px;
        border-radius: 50%;
        background-color: rgba(113, 192, 64, 1);
    }

    .code {
        font-size: 24px;
        font-weight: 400;
        color: #727171;
    }
}
</style>