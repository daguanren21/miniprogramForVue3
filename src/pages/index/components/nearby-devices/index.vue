<template>
    <div>
        <nut-action-sheet @close="emits('close')" :visible="visible">
            <div class="w-full max-h-600px">
                <div @click="emits('change', item)" hover-class="nearby-item"
                    class="flex-y-center p-20px b-b-solid border-b b-hex-ccc hover:b-fuchsia transition-100"
                    v-for="item in list" :key="item.id">
                    <image @tap.stop="preview(item.deployedImagePath)" class="h-100px w-100px"
                        :src='getImageFirst(item.deployedImagePath)' />
                    <div class="ml-20px flex-1 overflow-hidden">
                        <div class="flex-y-center">
                            <p class="text-30px mr-10px line-clamp-1 w-240px">{{ item.serialNumber }}</p>
                            <jx-dot :state="deviceRunningStateFilter(item.runningState)"></jx-dot>
                            <p class="ml-10px  text-30px">{{ distanceFilter(item.distance) }}</p>
                        </div>
                        <div class="mt-15px line-clamp-2 text-hex-999 text-30px">{{ noDataFilter(item.address) }}</div>
                    </div>
                </div>
            </div>
        </nut-action-sheet>
        <nut-image-preview :show="state.show" :images="state.images" @close="state.show = false" />
    </div>
</template>

<script setup lang="ts">
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
//获取布防图片第一张
const getImageFirst = (image: string) => {
    return image.split(';')[0]
}
//预览图片
const state = reactive({
    show: false,
    images: [] as { src: string }[]
})
const preview = (image: string) => {
    if (!image) {
        return
    }

    state.images = image.split(';').filter(v => v).map(v => {
        return {
            src: v,
        }
    })
    state.show = true
}
</script>

<style >
.nearby-item {
    background-color: rgb(1, 211, 222, 0.05);
}
</style>