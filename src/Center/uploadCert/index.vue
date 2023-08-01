<template>
    <div class="wh-full  flex-col">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <nut-form class="flex-1 overflow-auto" :model-value="form" ref="ruleForm">
            <nut-form-item label="证书名称" required>
                <nut-input class="nut-input-text" input-align="center" v-model="form.certificateName" placeholder="请输入证书名称"
                    type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item label="证书编号" required>
                <nut-input class="nut-input-text" input-align="center" v-model="form.certificateNumber"
                    placeholder="请输入证书编号" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item label="证书有效时间" required>
                <div class="flex-center">
                    <nut-input class="nut-input-text" input-align="center" v-model="form.certificateReleaseDate"
                        @click-input="receiveHelpTime.change('certificateReleaseDate')" placeholder="请选择开始时间" type="text">
                    </nut-input>
                    <nut-input class="nut-input-text" input-align="center" v-model="form.certificateExpireDate"
                        @click-input="receiveHelpTime.change('certificateExpireDate')" placeholder="请选择结束时间" type="text">
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
            <nut-button color="linear-gradient(to right, #ff6034, #ee0a24)" type="primary" style="width:80%;margin: auto;"
                @click="confirm">提交</nut-button>
        </nut-cell>
        <nut-popup position="bottom" v-model:visible="receiveHelpTime.show">
            <nut-date-picker v-model="receiveHelpTime.value" title="时间选择"
                @confirm="receiveHelpTime.confirm"></nut-date-picker>
        </nut-popup>
    </div>
</template>

<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro'
import { saveVolunteerCerts } from '~/api/user';

// import Taro from '@tarojs/taro';
import { useNotify } from '~/composables/use-notify';
import { useUpload } from '~/composables/use-upload';
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
const confirm = async () => {
    if (!form.certificateName) {
        notify('证书名称不能为空！')
        return
    }
    if (!form.certificateNumber) {
        notify('证书编号不能为空！')
        return
    }
    if (!form.certificateExpireDate) {
        notify('证书结束时间不能为空！')
        return
    }
    if (!form.certificateExpireDate) {
        notify('证书结束时间不能为空！')
        return
    }
    if (!frontList.value.length) {
        notify('证书正面照片不能为空')
        return
    }
    if (!backList.value.length) {
        notify('证书背面照片不能为空')
        return
    }
    form.frontImagePath = frontList.value[0].url
    form.backImagePath = backList.value[0].url
    try {
        await saveVolunteerCerts(form)
        Taro.showToast({
            icon: 'none',
            title: '提交成功！',
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
        receiveHelpTime.value = form[type]
        receiveHelpTime.show = true;

    }
})

</script>

<style  lang="scss"></style>