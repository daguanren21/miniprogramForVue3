<template>
    <div class="flex-col wh-full overflow-hidden">
        <div class="flex-1">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item label="设备编号">
                    <nut-input @blur="getDeviceBySerialNumber" v-model="form.serialNumber" class="nut-input-text"
                        placeholder="请输入设备编号" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="设备型号">
                    <nut-input class="nut-input-text" v-model="form.model" placeholder="请输入设备型号" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="品牌">
                    <nut-input class="nut-input-text" v-model="form.brandName" @click-input="handleChangeBrand"
                        placeholder="请选择品牌" type="text" />
                    <nut-popup position="bottom" v-model:visible="selectPop.show">
                        <nut-picker v-model="selectPop.value" :columns="columns" title="请选择品牌" @confirm="handleBrandConfirm"
                            @cancel="selectPop.show = false">
                        </nut-picker>
                    </nut-popup>
                </nut-form-item>
            </nut-form>
        </div>
        <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="searialNumber.show">
            <nut-cell v-for="item in deviceList" @click="searialNumber.confirm(item)" :title="item.serialNumber"
                :sub-title="item.brandName"></nut-cell>
        </nut-popup>
        <div class="flex-center h-120px">
            <nut-button size="mini" style="width:80%;height: 70rpx;" type="primary" class="h-70px"
                @click="next">下一步</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { fetchDeviceBrands } from '~/api/common';
import { DeviceBySearialNumber, fetchDevicesBySearialNumber } from '~/api/device';
import { useStep } from '~/composables/use-device-install'
defineOptions({
    name: 'basic'
})
const manage = useManageStore()
const props = defineProps<{
    current: number
}>()
const emits = defineEmits<{
    change: [value: number]
}>()
const form = reactive({
    id: 0,
    serialNumber: '',
    model: '',
    brandName: '',
    brandId: ''
})
const { next, selectPop, columns } = useStep(props, emits, form)
watch(() => manage.deviceInfo, (value) => {
    form.id = value.id
    form.serialNumber = value.serialNumber
    form.brandName = value.brandName
    form.model = value.model
    form.brandId = value.brandId.toString()
    selectPop.value = [value.brandId.toString()]
}, {
    immediate: true
})


//切换品牌
async function handleChangeBrand() {
    let res = await fetchDeviceBrands()
    columns.value = res.map(i => {
        return {
            text: i.name,
            value: i.id.toString()
        }
    })
    setTimeout(() => {
        selectPop.value = [form.brandId]
        selectPop.show = true
    }, 500)

}
//品牌确认
function handleBrandConfirm({ selectValue, selectedOptions }) {
    console.log(selectValue)
    form.brandName = selectedOptions.map((val: any) => val.text).join('')
    form.brandId = selectedOptions.map((val: any) => val.value).join('')
    selectPop.show = false
}
const deviceList = ref<DeviceBySearialNumber[]>()
const searialNumber = reactive({
    show: false,
    confirm: async (item: DeviceBySearialNumber) => {
        await manage.getDeviceInfo(item.deviceId)
    }
})
async function getDeviceBySerialNumber() {
    let res = await fetchDevicesBySearialNumber(form.serialNumber)
    deviceList.value = res
    if (deviceList.value.length === 1 && form.id) return
    searialNumber.show = true
}
</script>

<style scoped></style>