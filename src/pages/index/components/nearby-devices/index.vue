<template>
    <div>
        <nut-popup position="bottom" @click-overlay="emits('close')" closeable round @click-close-icon="emits('close')" :style="{ height: '60%' }"
            :visible="visible">
            <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">附近AED列表</div>
            <div @click="emits('change', item)" class="p-40px flex-y-center box-border"
                style="border-bottom: 1rpx solid #dadada;padding: 40rpx;" v-for="item in list">
                <div class="mr-16px h-125px w-125px">
                    <image v-if="item.brandLogo" class="h-125px w-125px" :src="item.brandLogo"></image>
                    <image v-else class="h-125px w-125px" src="../../../../assets/images/index/默认图.jpg"></image>
                </div>
                <div class="flex-1 flex-y-center justify-between">
                    <div>
                        <div class="flex-y-center">
                            <div class="text-30px font-bold text-hex-333">{{ noDataFilter(item.serialNumber) }}</div>
                            <div :style="{ color: filter(deviceRunningStateFilter(item.runningState).type).color, backgroundColor: filter(deviceRunningStateFilter(item.runningState).type).bgColor, borderColor: filter(deviceRunningStateFilter(item.runningState).type).color }"
                                class="ml-30px text-hex-32B44B bg-hex-E0F4E4 b-1px b-hex-32B44B text-center rounded-5px text-26px w-82px h-40px line-height-40px">
                                {{ deviceRunningStateFilter(item.runningState).text }}</div>
                        </div>
                        <div class="mt-24px line-clamp-2 break-all text-hex-797979 text-26px">
                            {{ noDataFilter(item.address) }}
                        </div>
                    </div>
                    <div class="flex-col items-center ml-15px" @click.stop="showMapNavigation(item)">
                        <jx-icon value="navigation" color="#2595E8" :size="20"></jx-icon>
                        <div class="text-24px text-hex-2595E8 mt-15px break-keep">距您{{ distanceFilter(item.distance) }}
                        </div>
                    </div>
                </div>
            </div>
        </nut-popup>
        <nut-image-preview :show="state.show" :images="state.images" @close="state.show = false" />
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { filter } from '~/utils/index'
import { useQQMapSdk } from '~/composables/use-qqmap-sdk';
import { deviceRunningStateFilter, distanceFilter, noDataFilter } from '~/filter'
defineOptions({
    name: 'nearbyDevices'
})
defineProps<{
    visible: boolean,
    list: Index.DeviceInfo[]
}>()
const emits = defineEmits<{
    close,
    change: [item: Index.DeviceInfo]
}>()
//预览图片
const state = reactive({
    show: false,
    images: [] as { src: string }[]
})

// const preview = (image: string) => {
//     if (!image) {
//         return
//     }

//     state.images = image.split(';').filter(v => v).map(v => {
//         return {
//             src: v,
//         }
//     })
//     state.show = true
// }
let { openLocation } = useQQMapSdk()
const showMapNavigation = async (info: Index.DeviceInfo) => {
    let { address, deployedAreaLatitude: lat, deployedAreaLongitude: lng } = info
    try {
        await openLocation(lat, lng, address)

    } catch (error) {
        Taro.showToast({
            title: error,
            icon: 'none'
        })
    }
}
</script>

<style >
.nearby-item {
    background-color: rgb(1, 211, 222, 0.05);
}
</style>