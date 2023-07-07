<template>
    <div class="home">
        <jx-nav-bar title="设备管理">
            <template #left>
                <div class="absolute text-hex-fa2c19">新增设备</div>
            </template>
        </jx-nav-bar>
        <div class="main">
             <device-list></device-list>
        </div>
        <jx-tab-bar></jx-tab-bar>
    </div>
</template>

<script setup lang="ts">
import deviceList from './components/deviceList.vue';

</script>

<style scoped></style>