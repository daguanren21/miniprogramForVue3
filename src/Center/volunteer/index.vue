<template>
    <div class="wh-full  flex-col bg-hex-fff">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <nut-form class="flex-1 overflow-auto" :model-value="form" ref="ruleForm">
            <nut-form-item class="jx-form-item" label="年龄" required>
                <nut-input :border="false" type="digit" v-model="form.age" class="nut-input-text" placeholder="请输入年龄" />
            </nut-form-item>
            <nut-form-item class="jx-form-item" label="性别">
            <nut-radio-group direction="horizontal" v-model="form.gender">
              <nut-radio label="MALE">男</nut-radio>
              <nut-radio label="FEMALE">女</nut-radio>
            </nut-radio-group>
          </nut-form-item>
            <nut-form-item class="jx-form-item" label="教育" required>
                <nut-input :border="false" class="nut-input-text"
                    :model-value="educationalLevels.find(i => i.value === form.educationalLevel)?.text || ''" readonly
                    @click="handleChangeEdu" placeholder="请选择教育" type="text">
                    <template #right>
                        <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                    </template>
                </nut-input>
            </nut-form-item>
            <nut-form-item class="jx-form-item" label="行业" required>
                <nut-input :border="false" class="nut-input-text"
                    :model-value="industryTypes.find(i => i.value === form.industryType)?.text || ''" readonly
                    @click="handleChangeInd" placeholder="请选择行业" type="text">
                    <template #right>
                        <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                    </template>
                </nut-input>
            </nut-form-item>
            <nut-form-item class="jx-form-item" label="接受求救时间" required>
                <div class="flex-center">
                    <nut-input :border="false" class="nut-input-text" input-align="center"
                        v-model="form.receiveHelpTimeBegin" readonly @click="receiveHelpTime.change('receiveHelpTimeBegin')"
                        placeholder="请选择开始时间" type="text">
                    </nut-input>
                    <span class="text-28px text-hex-333">-</span>
                    <nut-input :border="false" class="nut-input-text" input-align="center" v-model="form.receiveHelpTimeEnd"
                        readonly @click="receiveHelpTime.change('receiveHelpTimeEnd')" placeholder="请选择结束时间" type="text">
                    </nut-input>
                </div>
            </nut-form-item>
            <nut-form-item class="jx-form-item" label="活动区域" required>
                <nut-input :border="false" class="nut-input-text" v-model="form.regionName" placeholder="请选择活动区域"
                    type="text" readonly @click="region.visible = true">
                    <template #right>
                        <jx-icon @click.stop="chooseLocation" value="address" color="#4088FF" :size="24"> </jx-icon>
                    </template>
                </nut-input>
                <nut-popup round closeable @close="region.closeRegion" position="bottom" title="地址选择"
                    v-model:visible="region.visible">
                    <nut-cascader :poppable="false" v-model="form.regionId" @change="region.change"
                        @pathChange="region.pathChange" lazy :lazyLoad="region.lazyLoad"></nut-cascader>
                    <nut-cell>
                        <nut-button style="width:100%" type='primary' @click="region.confirm">确定</nut-button>
                    </nut-cell>
                </nut-popup>
            </nut-form-item>
            <nut-form-item class="jx-form-item" label="详细地址" required>
                <nut-textarea :border="false" :autosize="{
                    minHeight: 80
                }" placeholder="请输入详细地址" v-model="form.mainMomentAreaAddress" limit-show max-length="200" />
            </nut-form-item>
        </nut-form>
        <nut-cell>
            <nut-button type="primary" style="width:80%;margin: auto;" @click="confirm" :loading="loading">认证</nut-button>
        </nut-cell>
        <nut-popup position="bottom" v-model:visible="receiveHelpTime.show">
            <nut-date-picker v-model="receiveHelpTime.value" title="时间选择" type="hour-minute"
                @cancel="receiveHelpTime.show = false" @confirm="receiveHelpTime.confirm"></nut-date-picker>
        </nut-popup>
        <nut-popup position="bottom" v-model:visible="volunteerBasic.show">
            <nut-picker v-model="volunteerBasic.value" :columns="volunteerBasic.columns" @confirm="volunteerBasic.confirm"
                @cancel="volunteerBasic.show = false">
            </nut-picker>
        </nut-popup>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { fetchVolunteerInfo } from '~/api/user';
import { registerVolunteer } from '~/api/user';
import { useDeviceRegion } from '~/composables/use-device-region';
import useLoading from '~/composables/use-loading';
import { educationalLevels, industryTypes } from '~/utils/constant'
// import Taro from '@tarojs/taro';
import { useNotify } from '~/composables/use-notify';
const account = useAccountInfo()
let form = reactive({
    id: null,
    name: "",
    age: '',
    gender:'',
    educationalLevel: 'UNKNOWN',
    industryType: 'OTHER',
    phoneNumber: "",
    regionName: '',
    email: "",
    latitude: 0,
    longitude: 0,
    mainMomentAreaAddress: '',
    regionId: [] as number[],
    receiveHelpTimeBegin: '00:00',
    receiveHelpTimeEnd: '23:59',
    receiveHelpWeekOption: 'EVERYDAY'
})
watch(() => account.accountInfo, (val) => {
    form.email = val.email;
    form.phoneNumber = val.phoneNumber
    form.name = val.realName
}, {
    immediate: true
})
const volunteerBasic = reactive({
    type: '',
    show: false,
    value: [] as any[],
    columns: [] as any[],
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue, selectedOptions)
        if (volunteerBasic.type === 'edu') {
            form.educationalLevel = selectedOptions[0].value
        } else {
            form.industryType = selectedOptions[0].value
        }
        setTimeout(() => {
            volunteerBasic.show = false
        }, 500)
    }
})
function handleChangeEdu() {
    volunteerBasic.type = 'edu'
    volunteerBasic.columns = educationalLevels
    form.educationalLevel = form.educationalLevel || volunteerBasic.columns[0].value
    setTimeout(() => {
        volunteerBasic.value = [form.educationalLevel]
        volunteerBasic.show = true
    }, 500)
}
function handleChangeInd() {
    volunteerBasic.type = 'ind'
    volunteerBasic.columns = industryTypes
    form.industryType = form.industryType || volunteerBasic.columns[0].value
    setTimeout(() => {
        volunteerBasic.value = [form.industryType]
        volunteerBasic.show = true
    }, 500)
}
const { chooseLocation, region } = useDeviceRegion((options) => {
    form.regionName = options.regionName;
    form.regionId = options.regionId;
    form.mainMomentAreaAddress = options.address;
    form.latitude = options.deployedLatitude;
    form.longitude = options.deployedLongitude
})
const { state: message, notify } = useNotify('danger')
const user = useAccountInfo()
const { loading, startLoading, endLoading } = useLoading()
const confirm = async () => {
    if (!form.regionId.length) {
        notify('活动区域不能为空！')
        return
    }
    if (!form.mainMomentAreaAddress) {
        notify('详细地址不能为空！')
        return
    }
    if (!form.phoneNumber) {
        notify('手机号不能为空！')
        return
    }
    if (!form.phoneNumber.match(phonePattern)) {
        notify('手机格式不正确')
        return
    }
    if (form.email && !form.email.match(emailPattern)) {
        notify('邮箱格式不正确')
        return
    }
    try {
        startLoading()
        await registerVolunteer(form)
        Taro.showToast({
            icon: 'none',
            title: '提交成功！',
            success: async () => {
                await user.getAccountInfo()
            }
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

const receiveHelpTime = reactive({
    show: false,
    value: new Date(Date.now()),
    type: '',
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedOptions)
        form[receiveHelpTime.type] = selectedValue.join(':')
        console.log(form[receiveHelpTime.type])
        receiveHelpTime.show = false
    },
    change: (type: string) => {
        receiveHelpTime.type = type
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        if (form[type]) {
            let [hour, minute] = form[type].split(':')
            receiveHelpTime.value = new Date(year, month, day, hour, minute)
        }
        receiveHelpTime.show = true;
    }
})

onMounted(async () => {
    let res = await fetchVolunteerInfo();
    Object.keys(form).forEach(key => {
        form[key] = res[key] || form[key]
    })
    form.email = account.accountInfo.email
    form.name = account.accountInfo.realName
    form.phoneNumber = account.accountInfo.phoneNumber
    form.regionId = res.regionId || []
})
</script>

<style  lang="scss"></style>