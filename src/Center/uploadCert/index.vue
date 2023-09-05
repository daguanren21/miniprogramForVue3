<template>
    <div class="wh-full  flex-col bg-hex-fff">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <nut-form class="flex-1 overflow-auto" :model-value="form" ref="ruleForm">
            <nut-form-item class="jx-form-item" label="证书名称" required>
                <nut-input :border="false" max-length="50" class="nut-input-text" input-align="center"
                    v-model="form.certificateName" placeholder="请输入证书名称" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item class="jx-form-item" label="证书编号" required>
                <nut-input :border="false" max-length="30" class="nut-input-text" input-align="center"
                    v-model="form.certificateNumber" placeholder="请输入证书编号" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item class="jx-form-item" label="有效时间" required>
                <div class="flex-center">
                    <nut-input :border="false" class="nut-input-text" readonly input-align="center"
                        v-model="form.certificateReleaseDate" @click="receiveHelpTime.change('certificateReleaseDate')"
                        placeholder="请选择开始时间" type="text">
                    </nut-input>
                    <span class="text-28px text-hex-333">-</span>
                    <nut-input :border="false" class="nut-input-text" readonly input-align="center"
                        v-model="form.certificateExpireDate" @click="receiveHelpTime.change('certificateExpireDate')"
                        placeholder="请选择结束时间" type="text">
                    </nut-input>
                </div>
            </nut-form-item>
            <nut-form-item label="证书正反面" required>
                <div class="flex-center">
                    <nut-uploader :url="frontUrl" @delete="deleteFront" :before-xhr-upload="uploadFront"
                        v-model:file-list="frontList" maximum="1">
                    </nut-uploader>
                    <nut-uploader class="ml-10px" :url="backUrl" v-model:file-list="backList" maximum="1"
                        @delete="deleteBack" :before-xhr-upload="uploadBack">
                    </nut-uploader>
                </div>
            </nut-form-item>
        </nut-form>
        <nut-cell>
            <nut-button type="primary" style="width:80%;margin: auto;" @click="confirm">上传</nut-button>
        </nut-cell>
        <nut-popup position="bottom" v-model:visible="receiveHelpTime.show">
            <nut-date-picker v-model="receiveHelpTime.value" title="时间选择" @confirm="receiveHelpTime.confirm"
                @cancel="receiveHelpTime.show = false"></nut-date-picker>
        </nut-popup>
    </div>
</template>

<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro'
import { fetchVolunteerCertInfo, saveVolunteerCerts, updateVolunteerCerts } from '~/api/user';
import dayjs from 'dayjs'
// import Taro from '@tarojs/taro';
import { useNotify } from '~/composables/use-notify';
import { useUpload } from '~/composables/use-upload';
import { dateFilter } from '~/filter'
const router = useRouter()
const account = useAccountInfo()
let form = reactive({
    id: router.params.id ? Number(router.params.id) : null,
    volunteerId: account.accountInfo.volunteerId ? Number(account.accountInfo.volunteerId) : null,
    frontImagePath: "",
    backImagePath: "",
    certificateName: '',
    certificateNumber: "",
    certificateExpireDate: '',
    certificateReleaseDate: '',
})

const { state: message, notify } = useNotify('danger')
const { uploadUrl: frontUrl, beforeXhrUpload: uploadFront, deleteFiles: deleteFront, _fileList: frontList } = useUpload(form, 'frontImagePath')
const { uploadUrl: backUrl, beforeXhrUpload: uploadBack, deleteFiles: deleteBack, _fileList: backList } = useUpload(form, 'backImagePath')
watch(() => frontList, (value) => {
    form.frontImagePath = value.length ? value[0].url : ''
}, {
    deep: true,
})
watch(() => backList, (value) => {
    form.backImagePath = value.length ? value[0].url : ''
}, {
    deep: true,
})
const confirm = async () => {
    console.log(frontList)
    if (!form.certificateName) {
        notify('证书名称不能为空！')
        return
    }
    if (!form.certificateNumber) {
        notify('证书编号不能为空！')
        return
    }
    if (!form.certificateReleaseDate) {
        notify('证书开始时间不能为空！')
        return
    }
    if (!form.certificateExpireDate) {
        notify('证书结束时间不能为空！')
        return
    }
    if (!dayjs(form.certificateReleaseDate).isBefore(form.certificateExpireDate)) {
        notify('开始时间不能大于结束时间！')
        return
    }
    if (!form.frontImagePath) {
        notify('证书正面照片不能为空')
        return
    }
    if (!form.backImagePath) {
        notify('证书背面照片不能为空')
        return
    }
    form.frontImagePath = frontList.length ? frontList[0].url : ''
    form.backImagePath = backList.length ? backList[0].url : ''
    try {
        let id = Number(form.id)
        if (id) {
            await updateVolunteerCerts(form)
            Taro.showToast({
                icon: 'none',
                title: '修改成功！',
            })
        } else {
            await saveVolunteerCerts(form)
            Taro.showToast({
                icon: 'none',
                title: '提交成功！',
            })
        }

        setTimeout(() => {
            Taro.navigateBack({
                delta: 1
            })
        }, 1000)
    } catch (error) {
        notify(error)
        return
    }
}

const receiveHelpTime = reactive({
    show: false,
    value: new Date(Date.now()),
    type: '',
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedOptions)
        form[receiveHelpTime.type] = selectedValue.join('-')
        console.log(form[receiveHelpTime.type])
        receiveHelpTime.show = false
    },
    change: (type: string) => {
        receiveHelpTime.type = type
        console.log(form[type])
        receiveHelpTime.value = new Date(Date.now())
        if (form[type]) {
            let [year, month, day] = form[type].split('-')
            receiveHelpTime.value = new Date(year, month - 1, day)
        }
        receiveHelpTime.show = true;
    }
})
onMounted(async () => {
    let id = router.params.id || 0
    if (Number(id)) {
        let res = await fetchVolunteerCertInfo(Number(id))
        Object.keys(form).forEach(k => {
            form[k] = res[k]
        })
        form.certificateExpireDate = dateFilter(res.certificateExpireDate, 'YYYY-MM-DD')
        form.certificateReleaseDate = dateFilter(res.certificateReleaseDate, 'YYYY-MM-DD')
        console.log("查询证书详情", form)
    }
})
</script>

<style  lang="scss"></style>