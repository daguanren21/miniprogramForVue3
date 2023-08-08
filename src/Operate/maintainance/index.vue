<template>
    <div class="wh-full">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <nut-form :model-value="form" ref="ruleForm">
            <nut-form-item label="设备编号" required>
                <nut-input @blur="getDeviceBySerialNumber" v-model="form.serialNumber" class="nut-input-text"
                    placeholder="请输入设备编号" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item label="运行状态" required>
                <nut-radio-group direction="horizontal" v-model="form.runningState">
                    <nut-radio label="NORMAL">正常</nut-radio>
                    <nut-radio label="ABNORMAL">异常</nut-radio>
                </nut-radio-group>
            </nut-form-item>
            <nut-form-item label="维护详情" required>
                <nut-textarea :autosize="{
                    minHeight: 80
                }" placeholder="请输入维护详情" v-model="form.content" limit-show max-length="200" />
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
            <nut-button type="primary" :disabled="!form.id" class="m-auto" style="width:80%;margin: auto;" @click="confirm">提交</nut-button>
        </nut-cell>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { updateMaintainRecords } from '~/api/device';
import { useDeviceBySearialNumber } from '~/composables/use-device-searialNumber';
import { useNotify } from '~/composables/use-notify';
import { useUpload } from '~/composables/use-upload';
const route = useRouter()
const form = reactive({
    id: route.params.id || '',
    serialNumber: route.params.serialNumber || '',
    runningState: "NORMAL" as Filter.RunningState,
    content: "",
    deployedImagePath: "",
})

const { uploadUrl, beforeXhrUpload, deleteFiles, _fileList } = useUpload(form)
const { searialNumber, getDeviceBySerialNumber, deviceList } = useDeviceBySearialNumber(form)
const { state: message, notify } = useNotify('danger')
//提交 
const confirm = async () => {
    const { serialNumber, content } = form
    if (!serialNumber) {
        notify('设备编号不能为空！')
        return
    }
    if (!content) {
        notify('维护详情不能为空！')
        return
    }
    if (!_fileList.value.length) {
        notify('现场图片至少上传一张！')
        return
    }
    try {
        await updateMaintainRecords({
            deviceId: form.id,
            content: form.content,
            runningState: form.runningState,
            imagesPath: _fileList.value.map(v => v.url).join(';')
        })
        Taro.showToast({
            icon: 'none',
            title: '维护记录已提交'
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