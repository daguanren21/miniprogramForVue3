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
    let color = ''
    switch (type) {
        case 'success':
            color = '#33CC33'
            break;
        case 'info':
            color = '#6190E8'
            break;
        case 'error':
            color = '#C30D23'
            break;
        case 'warning':
            color = '#FF6216'
            break;
        case 'default':
            color = '#B4B4B4'
            break;
        default:
            break;
    }
    return color
}
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