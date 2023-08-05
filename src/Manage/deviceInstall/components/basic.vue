<template>
    <div class="flex-col wh-full overflow-hidden">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <div class="flex-1">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item label="品牌" required>
                    <nut-input class="nut-input-text" v-model="form.brandName" readonly @click="handleChangeBrand"
                        placeholder="请选择品牌" type="text" />
                    <nut-popup position="bottom" v-model:visible="selectPop.show">
                        <nut-picker v-model="selectPop.value" :columns="columns" title="请选择品牌" @confirm="handleBrandConfirm"
                            @cancel="selectPop.show = false">
                        </nut-picker>
                    </nut-popup>
                </nut-form-item>
                <nut-form-item label="设备编号" required>
                    <nut-input @blur="getDeviceBySerialNumber" v-model="form.serialNumber" class="nut-input-text"
                        placeholder="请输入设备编号" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="设备型号">
                    <nut-input class="nut-input-text" v-model="form.model" placeholder="请输入设备型号" type="text">
                    </nut-input>
                </nut-form-item>
            </nut-form>
        </div>
        <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="searialNumber.show">
            <nut-cell v-for="item in deviceList" @click="searialNumber.confirm(item)" :title="item.serialNumber"
                :sub-title="item.brandName"></nut-cell>
        </nut-popup>
        <div class="flex-center h-120px">
            <nut-button size="mini" style="width:80%;height: 70rpx;" type="primary" class="h-70px"
                @click="confirm">下一步</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { fetchDeviceBrands } from '~/api/common';
import { useStep } from '~/composables/use-device-install'
import { useDeviceBySearialNumber } from '~/composables/use-device-searialNumber';
import { useNotify } from '~/composables/use-notify';
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
    id: 0 as number | null,
    serialNumber: '',
    model: '',
    brandName: '',
    brandId: ''
})
const { next, selectPop, columns } = useStep(props, emits, form)
const {searialNumber,getDeviceBySerialNumber,deviceList} =useDeviceBySearialNumber(form)
watch(() => manage.deviceInfo, (value) => {
    form.id = value.id || null
    form.serialNumber = value.serialNumber
    form.brandName = value.brandName
    form.model = value.model
    form.brandId = value.brandId ? value.brandId.toString() : ''
    selectPop.value = value.brandId ? [value.brandId.toString()] : []
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
    form.brandId =columns.value[0].value
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

//校验并进行下一步
const { state: message, notify } = useNotify('danger')
function confirm() {
    if (!form.serialNumber) {
        notify('设备编号不能为空！')
        return
    }
    if (form.serialNumber.length > 30) {
        notify('设备编号长度不能超过30个字符！')
        return
    }
    if (!form.brandId) {
        notify('品牌不能为空！')
        return
    }
    next()
}
</script>

<style scoped></style>