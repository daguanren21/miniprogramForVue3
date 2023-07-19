<template>
    <div class="home">
        <nut-button @click="toDeviceInstall" type='primary'>新增</nut-button>
        <div class="main">
            <device-list></device-list>
        </div>
        <jx-tab-bar></jx-tab-bar>
    </div>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro';
import deviceList from './components/deviceList.vue';
function toDeviceInstall() {
    Taro.navigateTo({
        url: '/Manage/deviceInstall/index'
    })
}
</script>

<style lang="scss"></style>