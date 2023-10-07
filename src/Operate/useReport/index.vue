<template>
    <div class="wh-full flex-col useReport overflow-hidden bg-hex-fff">
        <div class="flex-1 overflow-auto">
            <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
            <nut-form class="flex-1 overflow-auto" :model-value="form" ref="ruleForm">
                <nut-form-item class="jx-form-item" label="设备编号" required>
                    <nut-input :border="false" max-length="30" @blur="getDeviceBySerialNumber" v-model="form.serialNumber"
                        class="nut-input-text" placeholder="请输入设备编号" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="放电次数" required>
                    <nut-input class="nut-input-text" :border="false" v-model="form.dischargeCount" placeholder="请输入放电次数"
                        type="digit">
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" required label="抢救开始时间">
                    <nut-input class="nut-input-text" :border="false" v-model="form.rescueBeginTime"
                        @click="datePop.open('rescueBeginTime')" readonly placeholder="请选择开始时间" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" required label="抢救结束时间">
                    <nut-input class="nut-input-text" :border="false" v-model="form.rescueEndTime"
                        @click="datePop.open('rescueEndTime')" placeholder="请选择结束时间" readonly type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="是否用于抢救" required>
                    <nut-radio-group direction="horizontal" v-model="form.useRescued">
                        <nut-radio label="true">是</nut-radio>
                        <nut-radio label="false">否</nut-radio>
                    </nut-radio-group>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="抢救地址" required>
                    <nut-textarea :border="false" class="nut-input-text" :autosize="{
                        minHeight: 200
                    }" placeholder="请输入抢救地址" v-model="form.address" limit-show max-length="200" />
                </nut-form-item>
                <nut-cell-group title="患者信息" v-if="form.useRescued === 'true'">
                    <nut-form-item class="jx-form-item" label="救助成功">
                        <nut-radio-group direction="horizontal" v-model="form.successfulRescued">
                            <nut-radio label="true">是</nut-radio>
                            <nut-radio label="false">否</nut-radio>
                        </nut-radio-group>
                    </nut-form-item>
                    <nut-form-item class="jx-form-item" label="患者性别">
                        <nut-radio-group direction="horizontal" v-model="form.patientSex">
                            <nut-radio label="1">男</nut-radio>
                            <nut-radio label="2">女</nut-radio>
                        </nut-radio-group>
                    </nut-form-item>
                    <nut-form-item class="jx-form-item" label="患者年龄">
                        <nut-input :border="false" class="nut-input-text" v-model="form.patientAge" placeholder="请输入年龄"
                            type="digit" />
                    </nut-form-item>
                    <nut-form-item class="jx-form-item" label="基础病">
                        <nut-input :border="false" class="nut-input-text" max-length="50"
                            v-model="form.patientUnderlyingDisease" placeholder="请输入基础疾病" type="text">
                        </nut-input>
                    </nut-form-item>
                    <nut-form-item class="jx-form-item" label="晕倒原因">
                        <nut-textarea :border="false" class="nut-input-text" :autosize="{
                            minHeight: 200
                        }" placeholder="请输入晕倒原因" v-model="form.patientEventTrigger" limit-show max-length="200" />
                    </nut-form-item>

                </nut-cell-group>
            </nut-form>
        </div>
        <nut-cell>
            <nut-button type="primary" :disabled="!form.id" class="m-auto" style="width:80%;margin: auto;"
                @click="confirm" :loading="loading">提交</nut-button>
        </nut-cell>
        <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="searialNumber.show">
            <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">搜索结果</div>
            <div class="p-x-40px box-border">
                <div class="p-y-40px box-border" style="border-bottom:1rpx solid #dadada" v-for="item in deviceList"
                    @click="searialNumber.confirm(item)">
                    <div class="text-30px font-bold text-hex-333">{{ item.serialNumber }}</div>
                    <div class="mt-20px text-26px text-hex-797979">{{ item.brandName }}</div>
                </div>
            </div>
        </nut-popup>
        <nut-popup position="bottom" v-model:visible="datePop.show">
            <nut-date-picker type="datetime" @cancel="datePop.show = false" v-model="datePop.value"
                @confirm="datePop.confirm" :is-show-chinese="true">
            </nut-date-picker>
        </nut-popup>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { updateDeviceRescueData } from '~/api/device';
import { useDeviceBySearialNumber } from '~/composables/use-device-searialNumber';
import { useNotify } from '~/composables/use-notify';
import dayjs from 'dayjs'
import useLoading from '~/composables/use-loading';
const route = useRouter()
const form = reactive({
    id: route.params.id || '',
    serialNumber: route.params.serialNumber || '',
    dischargeCount: '1',
    useRescued: 'false',
    patientAge: '',
    patientEventTrigger: '',
    patientSex: '1',
    patientUnderlyingDisease: '',
    rescueBeginTime: '',
    rescueEndTime: '',
    address: '',
    successfulRescued: 'true',
})
const analysisDateTime = (date: string) => {
    if (date) {
        let dateTime = date.split(' ')
        let [year, month, day] = dateTime[0].split('-')
        let [hour, minute] = dateTime[1].split(':')
        return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
    }
    return ''
}
//时间操作
const datePop = reactive({
    show: false,
    key: '',
    value: new Date(Date.now()),
    open: (key: string) => {
        datePop.key = key
        datePop.value = analysisDateTime(form[key]) || new Date(Date.now())
        datePop.show = true
    },
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        let dateTime = selectedOptions.map((val: any) => val.value)
        let date = dateTime.slice(0, 3)
        let time = dateTime.slice(3, dateTime.length)
        form[datePop.key] = date.join('-') + ' ' + time.join(':')
        datePop.show = false
    }
})
const { getDeviceBySerialNumber, searialNumber, deviceList } = useDeviceBySearialNumber(form)
const { state: message, notify } = useNotify('danger')
const { loading, startLoading, endLoading } = useLoading()
//提交 
const confirm = async () => {
    const { serialNumber, useRescued } = form
    let isResued = useRescued === 'true'
    if (!serialNumber) {
        notify('设备编号不能为空！')
        return
    }
    if (!form.rescueBeginTime) {
        notify('抢救开始时间不能为空！')
        return
    }
    if (!form.rescueEndTime) {
        notify('抢救结束时间不能为空！')
        return
    }
    if (!dayjs(form.rescueBeginTime).isBefore(form.rescueEndTime)) {
        notify('结束时间应该大于开始时间！')
        return
    }
    if (!form.address) {
        notify('抢救地址不能为空！')
        return
    }
    try {
        startLoading()
        await updateDeviceRescueData({
            deviceId: form.id,
            dischargeCount: Number(form.dischargeCount),
            useRescued: isResued ? true : false,
            patientAge: isResued ? form.patientAge ? Number(form.patientAge) : '' : '',
            patientEventTrigger: isResued ? form.patientEventTrigger : '',
            patientSex: isResued ? Number(form.patientSex) : null,
            patientUnderlyingDisease: isResued ? form.patientUnderlyingDisease : '',
            rescueBeginTime: form.rescueBeginTime ? form.rescueBeginTime + ':00' : '',
            rescueEndTime: form.rescueEndTime ? form.rescueEndTime + ':00' : '',
            successfulRescued: isResued ? form.successfulRescued === 'false' ? false : true : null,
            address: form.address
        })
        Taro.showToast({
            icon: 'none',
            title: '使用上报已提交！'
        })
        setTimeout(() => {
            endLoading()
            Taro.navigateBack({
                delta: 1
            })
        }, 1000)
    } catch (error) {
        endLoading()
        notify(error)
    }

}
</script>

<style  lang="scss">
.useReport {
    .nut-cell-group__title {
        margin-top: 20px;
        font-size: 32px;
    }
}
</style>