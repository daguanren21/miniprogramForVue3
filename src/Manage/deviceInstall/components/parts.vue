<template>
    <div class="flex-col wh-full overflow-hidden">
        <div class="flex-1">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item label="电极片有效期">
                    <nut-input class="nut-input-text" v-model="form.batteryInvalidDate"
                        @click-input="handleChangeDate('batteryInvalidDate')" placeholder="请选择电极片有效期" type="text">
                        <template #right>
                            <jx-icon value="scan"></jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="电池有效期">
                    <nut-input class="nut-input-text" v-model="form.electrodeInvalidDate"
                        @click-input="handleChangeDate('electrodeInvalidDate')" placeholder="请选择电极片有效期" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="质保有效期">
                    <nut-input class="nut-input-text" v-model="form.qualityAssuranceDate"
                        @click-input="handleChangeDate('qualityAssuranceDate')" placeholder="请选择质保有效期" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="移动设备">
                    <nut-input class="nut-input-text" v-model="form.mobileName" @click-input="handleChangeSelect('mobile')"
                        placeholder="请选择质保有效期" type="text">
                    </nut-input>
                </nut-form-item>
            </nut-form>
            <nut-popup position="bottom" v-model:visible="datePop.show">
                <nut-date-picker v-model="currentDate" @confirm="datePop.methods.confirm">
                </nut-date-picker>
            </nut-popup>
            <nut-popup position="bottom" v-model:visible="selectPop.show">
                <nut-picker v-model="selectPop.value" :columns="columns" @confirm="selectPop.methods.confirm"
                    @cancel="selectPop.show = false">
                </nut-picker>
            </nut-popup>
        </div>
        <div class="flex-x-center">
            <nut-button size="mini" style="width:80%;height: 70rpx;" type="primary" class="h-70px"
                @click="next">下一步</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStep } from '~/composables/use-device-install';

defineOptions({
    name: 'parts'
})
const props = defineProps<{
    current: number
}>()
const emits = defineEmits<{
    change: [value: number]
}>()
const { next } = useStep(props, emits)
const columns = ref([{
    text: '是',
    value: "true"
}, {
    text: '否',
    value: "false"
}])
const currentDate = ref()
const datePop = reactive({
    show: false,
    key: 'batteryInvalidDate',
    methods: {
        confirm({ selectedValue, selectedOptions }) {
            console.log(selectedOptions)
            currentDate.value = selectedOptions.map((val: any) => val.text).join('')
            form[datePop.key] = selectedOptions.map((val: any) => val.text).join('-')
            datePop.show = false
        }
    }
})
const selectPop = reactive({
    show: false,
    key: '',
    value: ['false'],
    methods: {
        confirm({ selectedValue, selectedOptions }) {
            form[selectPop.key + 'Name'] = selectedOptions.map((val: any) => val.text).join('')
            form[selectPop.key] = selectedOptions.map((val: any) => val.value).join('')
            selectPop.show = false
        }
    }
})
const form = reactive({
    batteryInvalidDate: '',
    electrodeInvalidDate: '',
    qualityAssuranceDate: '',
    mobileName: '否',
    mobile: "false"
})
//日期选择
type DatePicker = keyof Omit<typeof form, 'mobile'>
const handleChangeDate = (key: DatePicker) => {
    datePop.key = key
    datePop.show = true
}
//下拉选选择
const handleChangeSelect = (key: string) => {
    selectPop.key = key
    selectPop.value = [form[key]]
    selectPop.show = true
}
</script>

<style scoped></style>