<template>
    <div class="flex-col wh-full overflow-hidden">
        <div class="flex-1">
            <nut-form :model-value="form" ref="ruleForm">
                <!--  @click-input="handleChangeDate('qualityAssuranceDate')" -->
                <nut-form-item label="开放方式">
                    <nut-input class="nut-input-text" @click-input="publicType.open" :model-value="publicType.text"
                        placeholder="请选择开放方式" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="开放时间" v-if="form.publicType == 'HALF'">
                    <div class="flex-center">
                        <nut-input class="nut-input-text" input-align="center" v-model="form.publicTimeFrom"
                            @click-input="publicTime.change('publicTimeFrom')" placeholder="请选择开始时间" type="text">
                        </nut-input>
                        <nut-input class="nut-input-text" input-align="center" v-model="form.publicTimeTo"
                            @click-input="publicTime.change('publicTimeTo')" placeholder="请选择结束时间" type="text">
                        </nut-input>
                    </div>
                </nut-form-item>
                <nut-form-item label="开放日" v-if="form.publicType == 'PUBLIC' || form.publicType == 'HALF'">
                    <nut-input class="nut-input-text" @click-input="workDay.open" :model-value="workDay.text"
                        placeholder="请选择开放日" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="备注">
                    <nut-textarea :autosize="{
                        minHeight: 80
                    }" placeholder="请输入备注信息" v-model="form.description" limit-show max-length="200" />
                </nut-form-item>
            </nut-form>
            <!-- 开放时间 -->
            <nut-popup position="bottom" v-model:visible="publicTime.show">
                <nut-date-picker v-model="publicTime.value" title="时间选择" type="hour-minute"
                    @confirm="publicTime.confirm"></nut-date-picker>
            </nut-popup>
            <!-- 开放日 -->
            <nut-popup position="bottom" v-model:visible="workDay.show">
                <nut-cell-group title="开放日选择">
                    <nut-cell>
                        <nut-checkbox :indeterminate="workDay.indeterminate" v-model="workDay.checkAll"
                            @change="workDay.onCheckAll">全选</nut-checkbox>
                    </nut-cell>
                    <nut-checkbox-group v-model="workDay.checkGroup" ref="group" @change="workDay.onCheck">
                        <nut-cell v-for="item in workDayOptions"><nut-checkbox :label="item.value">{{ item.label
                        }}</nut-checkbox></nut-cell>
                    </nut-checkbox-group>
                </nut-cell-group>
                <div class="p-30px flex-x-center">
                    <nut-button style="width:60%" block type="primary" @click="workDay.save">确定</nut-button>
                </div>
            </nut-popup>
            <!-- 开放方式 -->
            <nut-popup position="bottom" v-model:visible="publicType.show">
                <nut-picker v-model="publicType.value" :columns="publicType.columns" title="请选择开放方式"
                    @confirm="publicType.confirm" @cancel="publicType.show = false">
                </nut-picker>
            </nut-popup>
        </div>
        <div class="flex-center h-120px">
            <nut-button size="mini" style="width:49%;height: 70rpx;" class="h-70px mr-20px" @click="prev">返回</nut-button>
            <nut-button size="mini" style="width:49%;height: 70rpx;" type="primary" class="h-70px"
                @click="save">保存</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { saveDevices } from '~/api/device';
import { useStep } from '~/composables/use-device-install';
import { workDayOptions } from '~/utils/constant'
defineOptions({
    name: 'parts'
})
const props = defineProps<{
    current: number
}>()
const emits = defineEmits<{
    change: [value: number]
}>()

const form = reactive({
    publicType: '',
    publicTimeFrom: '',
    publicTimeTo: '',
    workDay: '',
    description: '',
})
//开放时间相关操作
const publicTime = reactive({
    show: false,
    value: '',
    type: '',
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedOptions)
        form[publicTime.type] = selectedValue.join(':')
        console.log(form[publicTime.type])
        publicTime.show = false
    },
    change: (type: string) => {
        publicTime.type = type
        publicTime.value = form[type]
        publicTime.show = true;

    }
})
//开放日相关操作
const group = ref(null) as Ref;
const workDay = reactive({
    show: false,
    indeterminate: false,
    checkAll: false,
    checkGroup: [] as string[],
    text: computed(() => {
        let optionStr = ''
        let _workDay = form.workDay.split(';').filter(v => v);
        if (_workDay.length) {
            _workDay.sort().forEach(i => {
                let _option = workDayOptions.find(v => v.value === i)
                optionStr += ';' + _option?.label
            })
        }
        return optionStr.slice(1)
    }),
    isCheckAll: (label: string[]) => {
        if (label.length === 7) {
            workDay.indeterminate = false;
            workDay.checkAll = true;
        } else if (label.length && label.length < 7) {
            workDay.indeterminate = true;
        } else {
            workDay.indeterminate = false;
            workDay.checkAll = false;
        }
    },
    onCheckAll: (value: boolean) => {
        group.value.toggleAll(value);
    },
    onCheck: (label: string[]) => {
        workDay.isCheckAll(label)
    },
    open: () => {
        workDay.checkGroup = form.workDay.split(';') || []
        workDay.isCheckAll(workDay.checkGroup)
        workDay.show = true
    },
    save: () => {
        workDay.show = false
        form.workDay = workDay.checkGroup.join(';')
    },
})
//开放方式相关
const publicType = reactive({
    show: false,
    value: [] as string[],
    text: '',
    columns: [{
        text: '公开',
        value: 'PUBLIC'
    }, {
        text: '半公开',
        value: 'HALF'
    }, {
        text: '不公开',
        value: 'NEVER'
    }, {
        text: '营业时间',
        value: 'BUSINESS_HOURS'
    }],
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        form.publicType = selectedOptions.map(v => v.value).join('')
        publicType.text = selectedOptions.map(v => v.text).join('')
        publicType.show = false
    },
    open: () => {
        publicType.value = [form.publicType]
        publicType.show = true
    }
})
const { prev } = useStep(props, emits, form)
const manage = useManageStore()
watch(() => manage.deviceInfo, (value) => {
    form.publicType = value.publicType
    form.publicTimeFrom = value.publicTimeFrom
    form.publicTimeTo = value.publicTimeTo
    form.workDay = value.workDay
    form.description = value.description
    publicType.text = publicType.columns.find(i => i.value === value.publicType)?.text || ''
}, {
    immediate: true
})

//保存设备信息
async function save() {
    Object.keys(form).forEach(i => {
        manage.$state.deviceInfo[i] = form[i]
    })
    await saveDevices(manage.deviceInfo as any)

}
</script>

<style scoped></style>