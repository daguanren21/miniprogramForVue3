<template>
    <div class="wh-full">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <nut-form :model-value="form" ref="ruleForm">
            <nut-form-item label="设备编号" required>
                <nut-input @blur="getDeviceBySerialNumber" v-model="form.serialNumber" class="nut-input-text"
                    placeholder="请输入设备编号" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item label="报修原因" required>
                <nut-textarea :autosize="{
                    minHeight: 80
                }" placeholder="请输入报修原因" v-model="form.description" limit-show max-length="200" />
            </nut-form-item>
            <nut-form-item label="现场图片" required>
                <nut-uploader @delete="deleteFiles" :file-list="_fileList" :url="uploadUrl"
                    :before-xhr-upload="beforeXhrUpload" maximum="4"></nut-uploader>
            </nut-form-item>
        </nut-form>
        <nut-popup position="bottom" closeable round :style="{ height: '60%' }" v-model:visible="searialNumber.show">
            <nut-cell v-for="item in deviceList" @click="searialNumber.confirm(item)" :title="item.serialNumber"
                :sub-title="item.brandName"></nut-cell>
        </nut-popup>
        <nut-cell>
            <nut-button :disabled="!form.id" type="primary" class="m-auto" style="width:80%;margin: auto;" @click="confirm">提交</nut-button>
        </nut-cell>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { updateReportToRepairRecords } from '~/api/device';
import { useDeviceBySearialNumber } from '~/composables/use-device-searialNumber';
import { useNotify } from '~/composables/use-notify';
import { useUpload } from '~/composables/use-upload';
const route = useRouter()
const form = reactive({
    id: route.params.id || '',
    serialNumber: route.params.serialNumber || '',
    description: "",
    deployedImagePath: "",
})
const { uploadUrl, beforeXhrUpload, deleteFiles, _fileList } = useUpload(form)
const { getDeviceBySerialNumber, searialNumber, deviceList } = useDeviceBySearialNumber(form)
const { state: message, notify } = useNotify('danger')
//提交 
const confirm = async () => {
    const { serialNumber, description } = form
    if (!serialNumber) {
        notify('设备编号不能为空！')
        return
    }
    if (!description) {
        notify('报修原因不能为空！')
        return
    }
    if (!_fileList.value.length) {
        notify('现场图片至少上传一张！')
        return
    }
    try {
        await updateReportToRepairRecords({
            deviceId: form.id,
            description: form.description,
            imagesPath: _fileList.value.map(v => v.url).join(';')
        })
        Taro.showToast({
            icon: 'none',
            title: '报修记录已提交'
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

<style scoped></style>