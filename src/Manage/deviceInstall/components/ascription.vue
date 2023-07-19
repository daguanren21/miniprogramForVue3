<template>
    <div class="flex-col wh-full overflow-hidden">
        <div class="flex-1">
            <nut-form :model-value="form" ref="ruleForm">
                <!--  @click-input="handleChangeDate('qualityAssuranceDate')" -->
                <nut-form-item label="配置单位">
                    <nut-input class="nut-input-text" @click-input="toPage('CONFIGURATION')" v-model="form.configInstitutionName"
                        placeholder="请选择配置单位" type="text">

                    </nut-input>
                </nut-form-item>
                <nut-form-item label="归属单位">
                    <nut-input class="nut-input-text" v-model="form.unitName" placeholder="请输入归属单位" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="维保单位">
                    <nut-input class="nut-input-text" @click-input="toPage('MAINTENANCE')"
                        v-model="form.maintainInstitutionName" placeholder="请选择维保单位" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="设备联系人">
                    <nut-input class="nut-input-text" v-model="form.contactName" placeholder="请输入联系人" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="设备联系电话">
                    <nut-input class="nut-input-text" v-model="form.contactPhone" placeholder="请输入联系电话" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="出资人">
                    <nut-input class="nut-input-text" v-model="form.investor" placeholder="请输入出资人" type="text">
                    </nut-input>
                </nut-form-item>
            </nut-form>
            <!-- <nut-popup position="bottom" v-model:visible="selectPop.show">
                <nut-picker v-model="selectPop.value" :columns="columns" @confirm="selectPop.methods.confirm"
                    @cancel="selectPop.show = false">
                </nut-picker>
            </nut-popup> -->
        </div>
        <div class="flex-center h-120px">
            <nut-button size="mini" style="width:49%;height: 70rpx;" class="h-70px mr-20px" @click="prev">上一步</nut-button>
            <nut-button size="mini" style="width:49%;height: 70rpx;" type="primary" class="h-70px"
                @click="next">下一步</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro';
import { useStep } from '~/composables/use-device-install';
const router = useRouter()
const item = router.params.item
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
    configInstitutionId: '',
    maintainInstitutionName: '',
    maintainInstitutionId: '',
    unitName: '',
    contactName: '',
    contactPhone: '',
    investor: ''
})

const { next, prev } = useStep(props, emits, form)
const manage = useManageStore()
watch(() => manage.deviceInfo, (value) => {
    form.configInstitutionName = value.configInstitutionName
    form.configInstitutionId = value.configInstitutionId.toString()
    form.maintainInstitutionName = value.maintainInstitutionName
    form.maintainInstitutionId = value.maintainInstitutionId.toString()
    form.unitName = value.unitName
    form.contactName = value.contactName
    form.contactPhone = value.contactPhone
    form.investor = value.investor
    if (item) {
    const _item = JSON.parse(item)
    if (_item.unitType === 'CONFIGURATION') {
        form.configInstitutionName = _item.name
        form.configInstitutionId = _item.id
    } else if (_item.unitType === 'MAINTENANCE') {
        form.maintainInstitutionName = _item.name
        form.maintainInstitutionId = _item.id
    }
}
}, {
    immediate: true
})

//跳转到单位搜索页面
function toPage(type: string) {
    Taro.redirectTo({
        url: '/Manage/institutionSearch/index?type=' + type
    })
}
</script>

<style scoped></style>