<template>
    <div class="flex-col wh-full overflow-hidden">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <div class="flex-1">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item class="jx-form-item" label="配置单位" v-if="!accountInfo.configurationUnitId">
                    <nut-input :border="false" class="nut-input-text" readonly @click="toPage('CONFIGURATION')"
                        v-model="form.configInstitutionName" placeholder="请选择配置单位" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="归属单位" v-if="!accountInfo.configurationUnitId">
                    <nut-input :border="false" max-length="30" class="nut-input-text" v-model="form.unitName"
                        placeholder="请输入归属单位" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="维保单位" v-if="!accountInfo.maintenanceUnitId">
                    <nut-input :border="false" class="nut-input-text" readonly @click="toPage('MAINTENANCE')"
                        v-model="form.maintainInstitutionName" placeholder="请选择维保单位" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="设备联系人" required>
                    <nut-input :border="false" class="nut-input-text" max-length="30" v-model="form.contactName"
                        placeholder="请输入设备联系人" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="号码格式" required>
                    <nut-radio-group direction="horizontal" v-model="form.phoneType">
                        <nut-radio label="0">手机号码</nut-radio>
                        <nut-radio label="1">固定号码</nut-radio>
                    </nut-radio-group>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="设备联系方式" required>
                    <nut-input :border="false" v-if="form.phoneType === '0'" max-length="11" class="nut-input-text"
                        v-model="form.contactPhone" placeholder="请输入设备联系方式" type="number">
                    </nut-input>
                    <nut-input :border="false" v-else class="nut-input-text" v-model="form.contactPhone" max-length="20" 
                        placeholder="请输入设备联系方式" type="number">
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="出资人">
                    <nut-input :border="false" max-length="30" class="nut-input-text" v-model="form.investor"
                        placeholder="请输入出资人" type="text">
                    </nut-input>
                </nut-form-item>
            </nut-form>
        </div>
        <div class="flex-center h-120px">
            <nut-button size="mini" plain type="primary" style="width:192rpx;height: 70rpx;" @click="prev">上一步</nut-button>
            <nut-button size="mini" style="width:450rpx;height: 70rpx;margin-left:20rpx" type="primary"
                @click="confirm">下一步</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro';
import { useStep } from '~/composables/use-device-install';
import { useNotify } from '~/composables/use-notify';
const router = useRouter()
const item = router.params.item
//获取用户详情
const user = useAccountInfo()
const { accountInfo } = storeToRefs(user)
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
    configInstitutionName: '',
    configInstitutionId: '' as string | null,
    maintainInstitutionName: '',
    maintainInstitutionId: '' as string | null,
    phoneType: '0',
    unitName: '',
    contactName: '',
    contactPhone: '',
    investor: ''
})

const { next, prev } = useStep(props, emits, form)
const manage = useManageStore()
watch(() => manage.deviceInfo, (value) => {
    let { unitName, maintenanceUnitId, configurationUnitId } = accountInfo.value
    form.configInstitutionName = value.configInstitutionName || (configurationUnitId ? unitName : '')
    form.configInstitutionId = value.configInstitutionId ? value.configInstitutionId?.toString() : configurationUnitId
    form.maintainInstitutionName = value.maintainInstitutionName || (maintenanceUnitId ? unitName : '')
    form.maintainInstitutionId = value.maintainInstitutionId ? value.maintainInstitutionId?.toString() : maintenanceUnitId
    form.unitName = value.unitName || (configurationUnitId ? unitName : '')
    form.contactName = value.contactName
    form.contactPhone = value.contactPhone
    form.phoneType = form.contactPhone ? form.contactPhone.length === 11 ? '0' : '1' : '0'
    form.investor = value.investor
    if (item) {
        const _item = JSON.parse(item)
        if (_item.unitType === 'CONFIGURATION') {
            form.configInstitutionName = _item.name
            form.configInstitutionId = _item.id
            manage.deviceInfo.configInstitutionName = _item.name
            manage.deviceInfo.contactName
            manage.deviceInfo.configInstitutionId = _item.id

        } else if (_item.unitType === 'MAINTENANCE') {
            form.maintainInstitutionName = _item.name
            form.maintainInstitutionId = _item.id
            manage.deviceInfo.maintainInstitutionName = _item.name
            manage.deviceInfo.maintainInstitutionId = _item.id
        }
    }
}, {
    immediate: true
})

//跳转到单位搜索页面
function toPage(type: string) {
    Object.keys(JSON.parse(JSON.stringify(form))).forEach(v => {
        manage.deviceInfo[v] = form[v]
    })
    Taro.redirectTo({
        url: '/Manage/institutionSearch/index?type=' + type
    })
}
//校验并进行下一步
const { state: message, notify } = useNotify('danger')
function confirm() {
    if (!form.configInstitutionName && !form.unitName) {
        notify('归属单位和配置单位至少填写一个！')
        return
    }
    if (!form.contactName) {
        notify('联系人不能为空！')
        return
    }
    if (!form.contactName.length) {
        notify('联系人长度不能超过30个字符！')
        return
    }
    if (!form.contactPhone) {
        notify('联系电话不能为空！')
        return
    }
    if (form.phoneType === '0') {
        if (!phonePattern.test(form.contactPhone)) {
            notify('联系电话格式不正确')
            return
        }
    } else {
        if (!phoneAndFixPattern.test(form.contactPhone)) {
            notify('联系电话格式不正确')
            return
        }
    }

    next()
}
</script>

<style scoped></style>