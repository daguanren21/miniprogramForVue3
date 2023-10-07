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
                <nut-form-item class="jx-form-item" label="移机类型" required>
                    <nut-radio-group direction="horizontal" v-model="form.type">
                        <nut-radio label="relocation">位置变更</nut-radio>
                        <nut-radio label="delete">设备移除</nut-radio>
                    </nut-radio-group>
                </nut-form-item>
                <nut-cell-group title="设备移除" v-if="form.type === 'delete'">
                    <nut-form-item class="jx-form-item" label="删除原因" required>
                        <nut-textarea :border="false" :autosize="{
                            minHeight: 80
                        }" placeholder="请输入删除原因" v-model="form.deleteReason" limit-show max-length="200" />
                    </nut-form-item>
                </nut-cell-group>
                <nut-cell-group title="位置变更" v-if="form.type === 'relocation'">
                    <nut-form-item class="jx-form-item" label="安装场所" required>
                        <nut-input :border="false" class="nut-input-text" v-model="form.placeName" @click="selectPop.open"
                            readonly placeholder="请选择安装场所" type="text">
                            <template #right>
                                <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                            </template>
                        </nut-input>
                    </nut-form-item>
                    <nut-form-item class="jx-form-item" label="安装区域" required>
                        <nut-input :border="false" class="nut-input-text" v-model="form.regionName" placeholder="请选择区域"
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
                    <nut-form-item class="jx-form-item" label="安装地址" required>
                        <!-- <jx-icon @click="addressTip" value="help" color="#ccc" class="absolute left--80 top-8" :size="15">
                    </jx-icon> -->
                        <nut-textarea :border="false" :autosize="{
                            minHeight: 80
                        }" placeholder="请具体到xx区xx路xx号xx大楼xx层xx门牌号xx处" v-model="form.address" limit-show
                            max-length="200" />
                    </nut-form-item>
                    <nut-form-item label="现场图片" required>
                        <nut-uploader :media-type="['image']" @delete="deleteFiles" :file-list="_fileList" :url="uploadUrl"
                            :before-xhr-upload="beforeXhrUpload" maximum="4"></nut-uploader>
                    </nut-form-item>
                </nut-cell-group>
            </nut-form>
        </div>
        <nut-cell>
            <nut-button :disabled="!form.id" type="primary" class="m-auto" style="width:80%;margin: auto;"
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
        <nut-popup position="bottom" v-model:visible="selectPop.show">
            <nut-picker v-model="selectPop.value" :columns="selectPop.columns" @confirm="selectPop.confirm"
                @cancel="selectPop.show = false">
            </nut-picker>
        </nut-popup>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useRouter } from '@tarojs/taro';
import { fetchDevicePlaces } from '~/api/common';
import { updatePosition, deleteDevice } from '~/api/device';
import { useDeviceRegion } from '~/composables/use-device-region';
import { useDeviceBySearialNumber } from '~/composables/use-device-searialNumber';
import useLoading from '~/composables/use-loading';
import { useNotify } from '~/composables/use-notify';
import { useUpload } from '~/composables/use-upload';
const route = useRouter()
const auth = useAuthStore()
const form = reactive({
    id: route.params.id || '',
    serialNumber: route.params.serialNumber || '',
    type: '',
    deleteReason: '',
    placeName: '',
    placeId: '',
    regionName: '',
    regionId: [] as number[],
    address: '',
    deployedLatitude: 0,
    deployedLongitude: 0
})
//时间操作
const selectPop = reactive({
    show: false,
    key: '',
    value: [] as string[],
    columns: [] as { text: string, value: string }[],
    open: async () => {
        let res = await fetchDevicePlaces()
        selectPop.columns = res.map(i => {
            return {
                text: i.name,
                value: i.id.toString()
            }
        })
        form.placeId = selectPop.columns[0].value
        setTimeout(() => {
            selectPop.value = [form.placeId]
            selectPop.show = true
        }, 500)
    },
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedValue)
        form.placeName = selectedOptions.map((val: any) => val.text).join('')
        form.placeId = selectedOptions.map((val: any) => val.value).join('')
        selectPop.show = false
    }
})
//根据编号获取设备信息
const { getDeviceBySerialNumber, searialNumber, deviceList } = useDeviceBySearialNumber(form)
//表单校验
const { state: message, notify } = useNotify('danger')
//上传图片
const { uploadUrl, beforeXhrUpload, deleteFiles, _fileList } = useUpload(form)
//区域选择
const { chooseLocation, region } = useDeviceRegion((options) => {
    form.regionName = options.regionName;
    form.regionId = options.regionId;
    form.address = options.address;
    form.deployedLatitude = options.deployedLatitude;
    form.deployedLongitude = options.deployedLongitude
})
const { loading, startLoading, endLoading } = useLoading()
//提交 
const confirm = async () => {
    const { serialNumber, type, deleteReason } = form
    if (!serialNumber) {
        notify('设备编号不能为空！')
        return
    }
    if (!type) {
        notify('移机类型不能为空！')
        return
    }
    if (type === 'delete') {
        if (!deleteReason) {
            notify('删除原因不能为空！')
            return
        }
    }
    if (type === 'relocation') {
        if (!form.placeId) {
            notify('安装场所不能为空！')
            return
        }
        if (!form.regionId) {
            notify('安装区域不能为空！')
            return
        }
        if (!form.address) {
            notify('安装地址不能为空！')
            return
        }
        if (!_fileList.length) {
            notify('现场图片至少上传一张！')
            return
        }
    }
    try {
        startLoading()
        if (type === 'relocation') {
            await updatePosition({
                deviceId: form.id,
                regionId: form.regionId,
                deployedImagePath: _fileList.map(v => v.url).join(';'),
                placeId: Number(form.placeId),
                address: form.address,
                deployedLatitude: form.deployedLatitude,
                deployedLongitude: form.deployedLongitude
            })
            Taro.showToast({
                icon: 'none',
                title: '设备位置已变更！',
            })
            setTimeout(() => {
                endLoading()
                Taro.navigateBack({
                    delta: 1
                })
            }, 1000)
        }
        if (type === 'delete') {
            await deleteDevice({
                deviceId: form.id,
                deleteReason: form.deleteReason,
            })
            Taro.showToast({
                icon: 'none',
                title: '设备已移除！',
            })
            setTimeout(() => {
                endLoading()
                auth.updateTabName('management')
                Taro.switchTab({
                    url: '/pages/management/index'
                })
            }, 1000)
        }

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