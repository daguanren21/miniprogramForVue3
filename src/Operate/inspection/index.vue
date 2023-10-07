<template>
    <div class="wh-full flex-col overflow-hidden bg-hex-fff">
        <div class="flex-1 overflow-auto">
            <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item class="jx-form-item" label="设备编号" required>
                    <nut-input :border="false" max-length="30" @blur="getDeviceBySerialNumber" v-model="form.serialNumber"
                        class="nut-input-text" placeholder="请输入设备编号" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="运行状态" required>
                    <nut-radio-group direction="horizontal" v-model="form.runningState">
                        <nut-radio label="NORMAL">正常</nut-radio>
                        <nut-radio label="ABNORMAL">异常</nut-radio>
                    </nut-radio-group>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="电极片状态" required>
                    <nut-radio-group direction="horizontal" v-model="form.electrodeState">
                        <nut-radio label="NORMAL">正常</nut-radio>
                        <nut-radio label="ABNORMAL">异常</nut-radio>
                    </nut-radio-group>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="电极片包装" required>
                    <nut-radio-group direction="horizontal" v-model="form.electrodePackageNormalBoolean">
                        <nut-radio label="true">完好</nut-radio>
                        <nut-radio label="false">破损</nut-radio>
                    </nut-radio-group>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="巡检内容" required>
                    <nut-textarea :border="false" :autosize="{
                        minHeight: 80
                    }" placeholder="请输入巡检内容" v-model="form.content" limit-show max-length="200" />
                </nut-form-item>
                <nut-form-item label="现场图片" required>
                    <nut-uploader :media-type="['image']" @delete="deleteFiles" :file-list="_fileList" :url="uploadUrl"
                        :before-xhr-upload="beforeXhrUpload" maximum="4"></nut-uploader>
                </nut-form-item>
            </nut-form>
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
        </div>
        <nut-cell>
            <nut-button type="primary" :disabled="!form.id" class="m-auto" style="width:80%;margin: auto;" @click="confirm"
                :loading="loading">提交</nut-button>
        </nut-cell>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { updateRegularInspectionRecords } from '~/api/device';
import { useDeviceBySearialNumber } from '~/composables/use-device-searialNumber';
import useLoading from '~/composables/use-loading';
import { useNotify } from '~/composables/use-notify';
import { useUpload } from '~/composables/use-upload';
const route = useRouter()
const form = reactive({
    id: route.params.id || '',
    serialNumber: route.params.serialNumber || '',
    electrodeState: 'NORMAL' as Filter.RunningState,
    runningState: "NORMAL" as Filter.RunningState,
    electrodePackageNormalBoolean: 'true',
    content: "",
    deployedImagePath: "",
})
const { uploadUrl, beforeXhrUpload, deleteFiles, _fileList } = useUpload(form)
const { searialNumber, deviceList, getDeviceBySerialNumber } = useDeviceBySearialNumber(form)
const { state: message, notify } = useNotify('danger')

const { loading, startLoading, endLoading } = useLoading()
//提交 
const confirm = async () => {
    const { serialNumber, content } = form
    if (!serialNumber) {
        notify('设备编号不能为空！')
        return
    }
    if (!content) {
        notify('巡检内容不能为空！')
        return
    }
    if (!_fileList.length) {
        notify('现场图片至少上传一张！')
        return
    }
    try {
        startLoading()
        await updateRegularInspectionRecords({
            deviceId: form.id,
            electrodeState: form.electrodeState,
            runningState: form.runningState,
            electrodePackageNormalBoolean: form.electrodePackageNormalBoolean,
            content: form.content,
            imagesPath: _fileList.map(v => v.url).join(';')
        })
        Taro.showToast({
            icon: 'none',
            title: '巡检记录已提交'
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

<style scoped></style>