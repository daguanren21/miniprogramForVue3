<template>
    <div class="wh-full">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <nut-form :model-value="form" ref="ruleForm">
            <nut-form-item label="设备编号" required>
                <nut-input max-length="30" @blur="getDeviceBySerialNumber" v-model="form.serialNumber" class="nut-input-text"
                    placeholder="请输入设备编号" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item label="配件类型" required>
                <nut-radio-group direction="horizontal" v-model="form.type">
                    <nut-radio label="battery">电池</nut-radio>
                    <nut-radio label="electrode">电极片</nut-radio>
                </nut-radio-group>
            </nut-form-item>
            <nut-form-item label="电池有效期" v-if="form.type === 'battery'" required>
                <nut-input v-model="form.batteryInvalidDate" @click="datePop.open('batteryInvalidDate')" readonly
                    placeholder="请选择电池有效期" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item label="电极片有效期" v-if="form.type === 'electrode'" required>
                <nut-input v-model="form.electrodeInvalidDate" @click="datePop.open('electrodeInvalidDate')" readonly
                    placeholder="请选择电极片有效期" type="text">
                </nut-input>
            </nut-form-item>
        </nut-form>
        <nut-cell>
            <nut-button :disabled="!form.id" type="primary" class="m-auto" style="width:80%;margin: auto;" @click="confirm">提交</nut-button>
        </nut-cell>
        <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="searialNumber.show">
            <nut-cell v-for="item in deviceList" @click="searialNumber.confirm(item)" :title="item.serialNumber"
                :sub-title="item.brandName"></nut-cell>
        </nut-popup>
        <nut-popup position="bottom" v-model:visible="datePop.show">
            <nut-date-picker  :min-date="new Date(Date.now())" @cancel="datePop.show = false" v-model="datePop.value" @confirm="datePop.confirm"
                :is-show-chinese="true">
            </nut-date-picker>
        </nut-popup>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { updateDevicePart } from '~/api/device';
import { useDeviceBySearialNumber } from '~/composables/use-device-searialNumber';
import { useNotify } from '~/composables/use-notify';
const route = useRouter()
const form = reactive({
    id: route.params.id || '',
    serialNumber: route.params.serialNumber || '',
    type: "",
    batteryInvalidDate: "",
    electrodeInvalidDate: ""
})
const { getDeviceBySerialNumber,searialNumber,deviceList } = useDeviceBySearialNumber(form)
const { state: message, notify } = useNotify('danger')
const datePop = reactive({
    show: false,
    key: '',
    value: new Date(Date.now()),
    open: (key: string) => {
        datePop.key = key
        datePop.value = form[key] || new Date(Date.now())
        datePop.show = true
    },
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        let dateTime = selectedOptions.map((val: any) => val.value)
        form[datePop.key] = dateTime.join('-')
        datePop.show = false
    }
})
//提交 
const confirm = async () => {
    const { serialNumber, type } = form
    if (!serialNumber) {
        notify('设备编号不能为空！')
        return
    }
    if (!type) {
        notify('配件类型不能为空！')
        return
    }
    if (type === 'battery' && !form.batteryInvalidDate) {
        notify('电池有效期不能为空！')
        return
    }
    if (type === 'electrode' && !form.electrodeInvalidDate) {
        notify('电极片有效期不能为空！')
        return
    }
    try {
        type === 'battery' && (form.electrodeInvalidDate = "")
        type === 'electrode' && (form.batteryInvalidDate = "")
        await updateDevicePart({
            deviceId: form.id,
            batteryInvalidDate: form.batteryInvalidDate,
            electrodeInvalidDate: form.electrodeInvalidDate
        })
        Taro.showToast({
            icon: 'none',
            title: `更换${type === 'battery' ? '电池' : '电极片'}成功！`
        })
        setTimeout(() => {
            Taro.navigateBack({
                delta: 1
            })
        }, 1000)
    } catch (error) {
        notify(error)
    }

}
</script>

<style scoped></style>