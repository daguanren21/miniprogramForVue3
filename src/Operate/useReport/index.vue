<template>
    <div class="wh-full useReport flex-col">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <nut-form class="flex-1 overflow-auto" :model-value="form" ref="ruleForm">
            <nut-form-item label="设备编号" required>
                <nut-input max-length="30" @blur="getDeviceBySerialNumber" v-model="form.serialNumber"
                    class="nut-input-text" placeholder="请输入设备编号" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item label="放电次数" required>
                <nut-input v-model="form.dischargeCount" placeholder="请输入放电次数" type="digit">
                </nut-input>
            </nut-form-item>
            <nut-form-item required label="抢救开始时间">
                <nut-input v-model="form.rescueBeginTime" @click="datePop.open('rescueBeginTime')" readonly
                    placeholder="请选择开始时间" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item required label="抢救结束时间">
                <nut-input v-model="form.rescueEndTime" @click="datePop.open('rescueEndTime')" placeholder="请选择结束时间"
                    readonly type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item label="是否用于抢救" required>
                <nut-radio-group direction="horizontal" v-model="form.useRescued">
                    <nut-radio label="true">是</nut-radio>
                    <nut-radio label="false">否</nut-radio>
                </nut-radio-group>
            </nut-form-item>
            <nut-cell-group title="患者信息" v-if="form.useRescued === 'true'">
                <nut-form-item label="是否救活">
                    <nut-radio-group direction="horizontal" v-model="form.successfulRescued">
                        <nut-radio label="true">是</nut-radio>
                        <nut-radio label="false">否</nut-radio>
                    </nut-radio-group>
                </nut-form-item>
                <nut-form-item label="性别">
                    <nut-radio-group direction="horizontal" v-model="form.patientSex">
                        <nut-radio label="1">男</nut-radio>
                        <nut-radio label="2">女</nut-radio>
                    </nut-radio-group>
                </nut-form-item>
                <nut-form-item label="年龄">
                    <nut-input v-model="form.patientAge" placeholder="请输入年龄" type="digit" />
                </nut-form-item>
                <nut-form-item label="基础病">
                    <nut-input max-length="50" v-model="form.patientUnderlyingDisease" placeholder="请输入基础疾病" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="晕倒原因">
                    <nut-textarea :autosize="{
                        minHeight: 80
                    }" placeholder="请输入晕倒原因" v-model="form.patientEventTrigger" limit-show max-length="200" />
                </nut-form-item>

            </nut-cell-group>
            <!-- <nut-form-item label="变更描述">
                <nut-textarea :autosize="{
                    minHeight: 80
                }" placeholder="请输入描述说明" v-model="form.remarks" limit-show max-length="200" />
            </nut-form-item> -->
        </nut-form>
        <nut-cell>
            <nut-button type="primary" :disabled="!form.id" class="m-auto" style="width:80%;margin: auto;"
                @click="confirm">提交</nut-button>
        </nut-cell>
        <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="searialNumber.show">
            <nut-cell v-for="item in deviceList" @click="searialNumber.confirm(item)" :title="item.serialNumber"
                :sub-title="item.brandName"></nut-cell>
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
    successfulRescued: 'true',
})
//时间操作
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
        let date = dateTime.slice(0, 3)
        let time = dateTime.slice(3, dateTime.length)
        form[datePop.key] = date.join('-') + ' ' + time.join(':')
        datePop.show = false
    }
})
const { getDeviceBySerialNumber, searialNumber, deviceList } = useDeviceBySearialNumber(form)
const { state: message, notify } = useNotify('danger')
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
        notify('开始时间不能大于结束时间！')
        return
    }
    try {
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
        })
        Taro.showToast({
            icon: 'none',
            title: '使用上报已提交！'
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

<style  lang="scss">
.useReport {
    .nut-cell-group__title {
        margin-top: 20px;
        font-size: 32px;
    }
}
</style>