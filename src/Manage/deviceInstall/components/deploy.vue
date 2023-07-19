<template>
    <div class="flex-col wh-full overflow-hidden">
        <div class="flex-1 overflow-auto">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item label="安装场所">
                    <nut-input class="nut-input-text" v-model="form.placeName" @click-input="handleChangePlace"
                        placeholder="请选择安装场所" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="安装区域">
                    <!-- @click-input="handleChangeSelect('mobile') -->
                    <nut-input class="nut-input-text" v-model="form.regionName" placeholder="请选择区域" type="text"
                        @click-input="handleChangeLocal">
                        <template #right>
                            <jx-icon @click="chooseLocation" value="dingwei" color="#ff6216" :size="24"> </jx-icon>
                        </template>
                    </nut-input>
                    <nut-cascader title="地址选择" v-model:visible="region.visible" v-model="form.regionId"
                        @change="events.change" @pathChange="events.pathChange" lazy
                        :lazyLoad="region.lazyLoad"></nut-cascader>
                </nut-form-item>
                <nut-form-item label="详细地址">
                    <!-- <jx-icon @click="addressTip" value="help" color="#ccc" class="absolute left--80 top-8" :size="15">
                    </jx-icon> -->
                    <nut-textarea :autosize="{
                        minHeight: 80
                    }" placeholder="请具体到xx区xx路xx号xx大楼xx层xx门牌号xx处" v-model="form.address" limit-show max-length="200" />
                </nut-form-item>
                <nut-form-item label="安装图片">
                    <nut-uploader @delete="deleteFiles" :file-list="_fileList" :url="uploadUrl"
                        :before-xhr-upload="beforeXhrUpload" maximum="4"></nut-uploader>
                </nut-form-item>
            </nut-form>

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
            <nut-button size="mini" style="width:49%;height: 70rpx;" class="h-70px mr-20px" @click="_prev">上一步</nut-button>
            <nut-button size="mini" style="width:49%;height: 70rpx;" type="primary" class="h-70px"
                @click="_next">下一步</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { fetchDeviceCoordinate, fetchDevicePlaces, fetchDistrictAreas } from '~/api/common';
import { useStep } from '~/composables/use-device-install';
import { useUpload } from '~/composables/use-upload';
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

watch(() => manage.deviceInfo, (value) => {
    form.address = value.address
    form.regionName = value.regionName
    form.placeId = value.placeId.toString()
    form.regionId = value.regionId || []
    form.placeName = value.placeName
    form.deployedImagePath = value.deployedImagePath
}, {
    immediate: true
})
const { uploadUrl, beforeXhrUpload, deleteFiles, _fileList } = useUpload(form)



//切换安装场所
async function handleChangePlace() {
    let res = await fetchDevicePlaces()
    columns.value = res.map(i => {
        return {
            text: i.name,
            value: i.id.toString()
        }
    })
    selectPop.show = true
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
//选择安装区域
// function handleRegionConfirm({ selectedValue, selectedOptions }) {
//     form.placeName = selectedOptions.map((val: any) => val.text).join('')
//     form.placeId = selectedOptions.map((val: any) => val.value).join('')
// }
//定位（拉起微信自带页面）
async function chooseLocation(option: { latitude?: number, longitude?: number } = {}) {
    try {
        let locRes = await Taro.chooseLocation(option)
        if (!locRes) {
            Taro.showToast({
                icon: 'none',
                title: '当前地址无法解析'
            })
            return
        }
        let { province, city, district, street, address } = await fetchDeviceCoordinate({
            latitude: locRes.latitude,
            longitude: locRes.longitude
        })
        let _name = [province.cnName, city.cnName, district.cnName, street.cnName].filter(v => v).join('/')
        let _id = [province.id, city.id, district.id, street.id].filter(v => v)
        form.regionName = _name
        form.regionId = _id
        form.address = locRes.address || address

    } catch (error) {
        Taro.showToast({
            icon: 'none',
            title: '当前地址无法解析'
        })
    }
}
//获取区域列表

async function getAreas(value: number | string = '') {
    let res = await fetchDistrictAreas(({ parentId: value }))
    let _areas = res.map(v => {
        return {
            text: v.cnName,
            value: v.id,
            ...v
        }
    })
    return _areas
}
const region = reactive({
    visible: false,
    lazyLoad: async (node: any, resolve: (children: any) => void) => {
        if (node.root) {
            resolve(getAreas());
        } else {
            resolve(getAreas(node.value))
        }
    }
})
const events = {
    change(...args: number[]) {
        console.log('change', ...args);
    },
    pathChange(...args: any) {
        let _args = args[0].filter(v => v)
        form.regionId = _args.map(v => v.value)
        form.regionName = _args.map(v => v.text).join('/')
        let item = _args[_args.length - 1]
        chooseLocation({
            latitude: item.lat,
            longitude: item.lng,
        })
    }
};
//手动选择区域
async function handleChangeLocal() {
    region.visible = true

}
function _prev() {
    form.deployedImagePath = _fileList.value.map(v => v.url).join(';')
    prev()
}
function _next() {
    form.deployedImagePath = _fileList.value.map(v => v.url).join(';')
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