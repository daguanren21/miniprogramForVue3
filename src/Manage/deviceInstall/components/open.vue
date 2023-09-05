<template>
    <div class="flex-col wh-full overflow-hidden">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <div class="flex-1">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item class="jx-form-item" label="开放方式">
                    <nut-input :border="false" class="nut-input-text" @click="publicType.open"
                        :model-value="publicType.text" readonly placeholder="请选择开放方式" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <template v-for="(item, index) in form.publicTime">
                    <nut-form-item class="jx-form-item" :label="index === 0 ? '开放时间' : ''" v-if="form.publicType == 'HALF'">
                        <div class="flex-center">
                            <nut-input :border="false" class="nut-input-text" input-align="center" v-model="item.start"
                                readonly @click="publicTime.change('start', index)" placeholder="请选择开始时间" type="text">
                            </nut-input>
                            <span class="text-28px text-hex-333">-</span>
                            <nut-input :border="false" class="nut-input-text" input-align="center" v-model="item.end"
                                readonly @click="publicTime.change('end', index)" placeholder="请选择结束时间" type="text">
                            </nut-input>
                            <nut-button size="small" plain type='primary' @click="active(index)"> {{ item.active ? '禁用' :
                                '激活' }}</nut-button>
                            <nut-button size="small" style="margin-left: 10rpx;" plain type='primary'
                                @click="restore(index)"> 还原</nut-button>
                        </div>
                    </nut-form-item>
                </template>

                <nut-form-item class="jx-form-item" required label="开放日"
                    v-if="form.publicType == 'PUBLIC' || form.publicType == 'HALF'">
                    <nut-input :border="false" class="nut-input-text" readonly @click="workDay.open"
                        :model-value="workDay.text" placeholder="请选择开放日" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
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
                <nut-date-picker :min-date="minDate" :max-date="maxDate" v-model="publicTime.value" title="时间选择"
                    type="hour-minute" @confirm="publicTime.confirm"></nut-date-picker>
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
            <nut-button size="mini" plain type="primary" style="width:192rpx;height: 70rpx;" @click="prev">上一步</nut-button>
            <nut-button size="mini" style="width:450rpx;height: 70rpx;margin-left:20rpx" type="primary"
                @click="confirm">保存</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { saveDevices } from '~/api/device';
import { useStep } from '~/composables/use-device-install';
import { useNotify } from '~/composables/use-notify';
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
    publicTime: [{ start: '08:00', end: '12:00', active: true }, { start: '12:00', end: '18:00', active: true }, { start: '18:00', end: '23:59', active: true }],
    workDay: '',
    description: '',
})
const rangeDate = reactive([{ min: new Date(2023, 8, 17, 0, 0), max: new Date(2023, 8, 17, 12, 59) }, { min: new Date(2023, 8, 17, 12, 0), max: new Date(2023, 8, 17, 18, 59) }, { min: new Date(2023, 8, 17, 18, 0), max: new Date(2023, 8, 17, 23, 59) }])
const minDate = ref(new Date(2023, 8, 17, 0, 0))
const maxDate = ref(new Date(2023, 8, 17, 12, 0))
//开放时间相关操作
const publicTime = reactive({
    show: false,
    value: new Date(2023, 8, 17, 8, 0),
    index: 0,
    type: "start",
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        let type = publicTime.type
        let index = publicTime.index
        form.publicTime[index][type] = selectedValue.join(":")
        publicTime.show = false
    },
    change: (type: string, index: number) => {
        minDate.value = rangeDate[index].min
        maxDate.value = rangeDate[index].max
        publicTime.type = type
        publicTime.index = index
        let date = form.publicTime[index][type]
        if (date) {
            let [hour, min] = date.split(':')
            publicTime.value = new Date(2023, 8, 17, Number(hour), Number(min))
        }
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
const hours = ref([[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [12, 13, 14, 15, 16, 17, 18], [18, 19, 20, 21, 22, 23]])
const _publicTime = ref([{ start: '08:00', end: '12:00', active: true }, { start: '12:00', end: '18:00', active: true }, { start: '18:00', end: '23:59', active: true }])
const _initPublicTime = ref([{ start: '08:00', end: '12:00', active: true }, { start: '12:00', end: '18:00', active: true }, { start: '18:00', end: '23:59', active: true }])
const restore = (index: number) => {
    console.log(JSON.parse(JSON.stringify(_initPublicTime.value[index])))
    form.publicTime[index] = JSON.parse(JSON.stringify(_initPublicTime.value[index]))
}
const active = (index: number) => {
    form.publicTime[index].active = !form.publicTime[index].active
}
watch(() => manage.deviceInfo, (value) => {
    form.publicType = value.publicType || 'PUBLIC'
    let time = value.publicTime ? value.publicTime.split(';').map(v => {
        let [start, end] = v.split('-')
        return {
            start,
            end,
            active: true
        }
    }) : null
    function analysisTime(time: { start: string, end: string, active: boolean }[]) {
        //存储真实值
        let arr: number[] = []
        let temTime: { start: string, end: string, active: boolean }[] = []
        time.forEach(i => {
            let index = hours.value.findIndex((hour: number[]) => hour.includes(Number(i.start.split(':')[0])) && hour.includes(Number(i.end.split(':')[0])))
            index >= 0 && arr.push(index)
        })
        //初始值
        let initArr = toRaw(_publicTime.value).map((v, index) => {
            return !arr.includes(index)
        })
        initArr.forEach((bol, index) => {
            if (bol) {
                toRaw(_publicTime.value)[index].active = false
                temTime[index] = toRaw(_publicTime.value)[index]
            }
        })
        arr.forEach((i, index) => temTime[i] = time[index])
        return JSON.parse(JSON.stringify(temTime))
    }
    form.publicTime = time ? analysisTime(time) : _publicTime.value
    _initPublicTime.value = time ? analysisTime(time) : _publicTime.value
    form.workDay = value.workDay
    form.description = value.description
    publicType.text = publicType.columns.find(i => i.value === form.publicType)?.text || ''
}, {
    immediate: true
})

//保存设备信息
async function save() {
    Object.keys(form).forEach(i => {
        if (i === 'publicTime') {
            manage.$state.deviceInfo[i] = form.publicTime.filter(v => v.active).map(v => v.start + '-' + v.end).join(';')
        } else {
            manage.$state.deviceInfo[i] = form[i]
        }
    })
    try {
        await saveDevices(manage.deviceInfo as any)
        Taro.showToast({
            icon: 'none',
            title: '设备信息已完善'
        })
        setTimeout(() => {
            Taro.switchTab({
                url: '/pages/management/index'
            })
        }, 1000);

    } catch (error) {
        notify(error)
        return
    }

}
const { state: message, notify } = useNotify('danger')
function confirm() {
    let isExistDay = form.publicType == 'PUBLIC' || form.publicType == 'HALF'
    if (isExistDay && !form.workDay) {
        notify('开放日不能为空！')
        return
    }
    save()
}
</script>

<style scoped></style>