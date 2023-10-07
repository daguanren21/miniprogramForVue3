<template>
    <div class="flex-col wh-full overflow-hidden">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <div class="flex-1">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item class="jx-form-item" label="电极片有效期" required>
                    <nut-input :border="false" class="nut-input-text" v-model="form.electrodeInvalidDate" readonly
                        @click="handleChangeDate('electrodeInvalidDate')" placeholder="请选择电极片有效期" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="电池有效期" required>
                    <nut-input :border="false" class="nut-input-text" v-model="form.batteryInvalidDate" readonly
                        @click="handleChangeDate('batteryInvalidDate')" placeholder="请选择电池有效期" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="质保有效期">
                    <nut-input clearable :showClearIcon="true" :border="false" class="nut-input-text"
                        v-model="form.qualityAssuranceDate" readonly @click="handleChangeDate('qualityAssuranceDate')"
                        placeholder="请选择质保有效期" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="设备状态">
                    <nut-input clearable :border="false" class="nut-input-text" v-model="form.runningStateName" readonly
                        @click="handleChangeSelect('runningState')" placeholder="请选择设备状态" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="网络状态">
                    <nut-input :border="false" class="nut-input-text" v-model="form.deviceNetworkStateName" readonly
                        @click="handleChangeSelect('deviceNetworkState')" placeholder="请选择网络状态" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="移动设备">
                    <nut-input :border="false" class="nut-input-text" v-model="form.mobileName"
                        @click="handleChangeSelect('mobile')" readonly placeholder="请选择是否是移动设备" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
            </nut-form>
            <nut-popup position="bottom" v-model:visible="datePop.show">
                <nut-date-picker v-model="datePop.value" @confirm="datePop.methods.confirm" @cancel="datePop.show = false">
                </nut-date-picker>
            </nut-popup>
            <nut-popup position="bottom" v-model:visible="selectPop.show">
                <nut-picker v-model="selectPop.value" :columns="columns" @confirm="selectPop.methods.confirm"
                    @cancel="selectPop.show = false">
                </nut-picker>
            </nut-popup>
        </div>
        <div class="flex-center h-120px">
            <nut-button size="mini" plain type="primary" style="width:192rpx;height: 70rpx;" @click="prev">上一步</nut-button>
            <nut-button size="mini" style="width:450rpx;height: 70rpx;margin-left:20rpx" type="primary"
                @click="confirm">下一步</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStep } from '~/composables/use-device-install';
import { useNotify } from '~/composables/use-notify';
import { dateFilter } from '~/filter'
defineOptions({
    name: 'parts'
})
const props = defineProps<{
    current: number
}>()
const emits = defineEmits<{
    change: [value: number]
}>()
const manage = useManageStore()
const form = reactive({
    batteryInvalidDate: '',
    electrodeInvalidDate: '',
    qualityAssuranceDate: '',
    deviceNetworkStateName: '',
    deviceNetworkState: '',
    runningStateName: '',
    runningState: '',
    mobileName: '',
    mobile: ''
})
const options = {
    mobile: [{
        text: '是',
        value: "true"
    }, {
        text: '否',
        value: "false"
    }],
    deviceNetworkState: [
        //     {
        //     text: '未知',
        //     value: "UNKNOWN"
        // }, 
        {
            text: '联网',
            value: "ONLINE"
        }, {
            text: '未联网',
            value: "OFFLINE"
        },
        // {
        //     text: '网络波动',
        //     value: "UNSTABLE"
        // }
    ],
    runningState: [
        //     {
        //     text: '未知',
        //     value: "UNKNOWN"
        // }, 
        {
            text: '正常',
            value: "NORMAL"
        }, {
            text: '异常',
            value: "ABNORMAL"
        }, {
            text: '预警',
            value: "WARNING"
        }]
}
watch(() => manage.deviceInfo, (value) => {
    form.mobile = value.mobile ? value.mobile.toString() : "false"
    form.runningState = value.runningState || 'NORMAL'
    form.deviceNetworkState = value.deviceNetworkState || 'ONLINE'
    form.qualityAssuranceDate = dateFilter(value.qualityAssuranceDate, 'YYYY-MM-DD')
    form.electrodeInvalidDate = dateFilter(value.electrodeInvalidDate, 'YYYY-MM-DD')
    form.batteryInvalidDate = dateFilter(value.batteryInvalidDate, 'YYYY-MM-DD')
    form.deviceNetworkStateName = options.deviceNetworkState.find(i => i.value === form.deviceNetworkState)?.text || ''
    form.runningStateName = options.runningState.find(i => i.value === form.runningState)?.text || ''
    form.mobileName = options.mobile.find(i => i.value === form.mobile)?.text || ''
}, {
    immediate: true
})
const { next, prev, datePop, selectPop, columns } = useStep(props, emits, form)

//日期
const handleChangeDate = (key: string) => {
    datePop.key = key
    datePop.show = true
    if (form[key]) {
        let [year, month, day] = form[key].split('-')
        datePop.value = new Date(year, month - 1, day)
    } else {
        datePop.value = new Date(Date.now())
    }
}

//下拉选选择
const handleChangeSelect = (key: string) => {
    selectPop.key = key
    selectPop.value = [form[key]]
    columns.value = options[key]
    selectPop.show = true
}

//校验并进行下一步
const { state: message, notify } = useNotify('danger')
function confirm() {
    if (!form.electrodeInvalidDate) {
        notify('电极片有效期不能为空！')
        return
    }
    if (!form.batteryInvalidDate) {
        notify('电池有效期不能为空！')
        return
    }
    next()
}
</script>

<style scoped></style>