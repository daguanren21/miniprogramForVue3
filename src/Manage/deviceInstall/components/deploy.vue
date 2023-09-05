<template>
    <div class="flex-col wh-full overflow-hidden">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <div class="flex-1 overflow-auto">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item class="jx-form-item" label="安装时间" required>
                    <nut-input :border="false" class="nut-input-text" v-model="form.installDate" readonly @click="installDate.change"
                        placeholder="请选择时间" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item" label="安装场所" required>
                    <nut-input :border="false" class="nut-input-text" v-model="form.placeName" readonly @click="handleChangePlace"
                        placeholder="请选择安装场所" type="text">
                        <template #right>
                            <jx-icon value="select" color="#6A6F71" :size="14"> </jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item class="jx-form-item"  label="安装区域" required>
                    <nut-input :border="false" class="nut-input-text" v-model="form.regionName" placeholder="请选择区域" type="text" readonly
                        @click="region.visible = true">
                        <template #right>
                            <jx-icon @click.stop="chooseLocation" value="dingwei" color="#4088FF" :size="18"> </jx-icon>
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
                <nut-form-item class="jx-form-item" label="详细地址">
                    <!-- <jx-icon @click="addressTip" value="help" color="#ccc" class="absolute left--80 top-8" :size="15">
                    </jx-icon> -->
                    <nut-textarea :border="false" :autosize="{
                        minHeight: 80
                    }" placeholder="请具体到xx区xx路xx号xx大楼xx层xx门牌号xx处" v-model="form.address" limit-show max-length="200" />
                </nut-form-item>
                <nut-form-item label="安装图片" required>
                    <nut-uploader @delete="deleteFiles" :file-list="_fileList" :url="uploadUrl"
                        :before-xhr-upload="beforeXhrUpload" maximum="4"></nut-uploader>
                </nut-form-item>
            </nut-form>
            <!-- 开放时间 -->
            <nut-popup position="bottom" v-model:visible="installDate.show">
                <nut-date-picker v-model="installDate.value" title="时间选择" @cancel="installDate.show = false"
                    @confirm="installDate.confirm"></nut-date-picker>
            </nut-popup>
            <nut-popup position="bottom" v-model:visible="selectPop.show">
                <nut-picker v-model="selectPop.value" :columns="columns" @confirm="handlePlacesConfirm"
                    @cancel="selectPop.show = false">
                </nut-picker>
            </nut-popup>
        </div>
        <view class="example">
            <view class="title"> 图片范例 </view>
            <view class="list">
                <view class="item">
                    <image class="image" src="../../../assets/images/jx-deploy-one.jpg"></image>
                    <view class="ft">正面</view>
                </view>

                <view class="item">
                    <image class="image" src="../../../assets/images/jx-deploy-two.jpg"></image>
                    <view class="ft">侧面</view>
                </view>
                <view class="item">
                    <image class="image" src="../../../assets/images/jx-deploy-three.jpg"></image>
                    <view class="ft">门头</view>
                </view>
                <view class="item">
                    <image class="image" src="../../../assets/images/jx-deploy-four.jpg"></image>
                    <view class="ft">远景</view>
                </view>
            </view>
        </view>
        <div class="flex-center h-120px">
            <nut-button size="mini" plain type="primary" style="width:192rpx;height: 70rpx;" @click="_prev">上一步</nut-button>
            <nut-button size="mini" style="width:450rpx;height: 70rpx;margin-left:20rpx" type="primary"
                @click="_next">下一步</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { fetchDevicePlaces } from '~/api/common';
import { useStep } from '~/composables/use-device-install';
import { useDeviceRegion } from '~/composables/use-device-region';
import { useNotify } from '~/composables/use-notify';
import { useUpload } from '~/composables/use-upload';
import { dateFilter } from '~/filter'
defineOptions({
    name: 'deploy'
})
const props = defineProps<{
    current: number
}>()
const emits = defineEmits<{
    change: [value: number]
}>()
const form = reactive({
    deployedLatitude: 0,
    deployedLongitude: 0,
    installDate: '',
    address: '',
    regionName: '',
    placeName: '',
    placeId: '',
    deployedImagePath: '',
    regionId: [] as number[]
})
const { next, prev, selectPop } = useStep(props, emits, form)
const columns = ref([{
    text: '是',
    value: "true"
}, {
    text: '否',
    value: "false"
}])
const manage = useManageStore()
//开放时间相关操作
const installDate = reactive({
    show: false,
    value: new Date(Date.now()),
    confirm: ({ selectedValue, selectedOptions }) => {
        console.log(selectedOptions)
        form.installDate = selectedValue.join('-')
        installDate.show = false
    },
    change: () => {
        installDate.show = true;
    }
})
watch(() => manage.deviceInfo, (value) => {
    form.deployedLatitude = value.deployedLatitude
    form.deployedLongitude = value.deployedLongitude
    form.address = value.address
    form.installDate = value.installDate ? dateFilter(value.installDate, 'YYYY-MM-DD') : ''
    if (form.installDate) {
        let [year, month, day] = form.installDate.split('-')
        installDate.value = new Date(Number(year), Number(month) - 1, Number(day))
    }
    form.regionName = value.regionName
    form.placeId = value.placeId ? value.placeId.toString() : ''
    form.regionId = value.regionId || []
    form.placeName = value.placeName
    form.deployedImagePath = value.deployedImagePath
}, {
    immediate: true
})
const { uploadUrl, beforeXhrUpload, deleteFiles, _fileList, uploading } = useUpload(form)
//区域选择
const { chooseLocation, region } = useDeviceRegion((options) => {
    form.regionName = options.regionName;
    form.regionId = options.regionId;
    form.address = options.address;
    form.deployedLatitude = options.deployedLatitude;
    form.deployedLongitude = options.deployedLongitude
})


//切换安装场所
async function handleChangePlace() {
    let res = await fetchDevicePlaces()
    columns.value = res.map(i => {
        return {
            text: i.name,
            value: i.id.toString()
        }
    })
    form.placeId = columns.value[0].value
    setTimeout(() => {
        selectPop.value = [form.placeId]
        selectPop.show = true
    }, 500)
}

//详细地址填写规范
// const addressTip = () => {
//     Taro.showModal({
//         title: 'AED地址填写规范',
//         content: '例：xx省xx市xx区xx路xx号xx大楼xx层xx门牌号xx处',
//     })
// }
//选择安装场所
function handlePlacesConfirm({ selectedValue, selectedOptions }) {
    console.log(selectedValue)
    form.placeName = selectedOptions.map((val: any) => val.text).join('')
    form.placeId = selectedOptions.map((val: any) => val.value).join('')
    selectPop.show = false
}

function _prev() {
    form.deployedImagePath = _fileList.map(v => v.url).join(';')
    prev()
}
const { state: message, notify } = useNotify('danger')
function _next() {
    form.deployedImagePath = _fileList.map(v => v.url).join(';')
    if (!form.installDate) {
        notify('安装时间不能为空！')
        return
    }
    if (!form.placeName) {
        notify('安装场所不能为空！')
        return
    }
    if (!form.regionId.length) {
        notify('安装区域不能为空！')
        return
    }
    if (!form.deployedImagePath) {
        notify('安装图片不能为空！')
        return
    }
    if (uploading.value) {
        notify('安装图片上传中！')
        return
    }
    next()
}
</script>

<style lang="scss">
.example {
    margin-bottom: 13px;

    .title {
        font-size: 26px;
        font-weight: 400;
        color: #b4b4b5;
    }

    .list {
        display: flex;

        .item {
            margin-right: 15px;
            text-align: center;

            .image {
                width: 160px;
                height: 160px;
                margin-bottom: 25px;
                background-color: #dbdcdc;
            }

            .ft {
                font-size: 24px;
                font-weight: 400;
                color: #b4b4b5;
            }
        }
    }
}
</style>