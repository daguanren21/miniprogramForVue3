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
            <!-- <div v-if="!backList.length"
                            class="w-240px h-150px flex-center bg-hex-E5EFFF border-dashed b-1px flex-col">
                            <jx-icon value="upload" color="#4088FF" :size="22"> </jx-icon>
                            <div class="text-26px text-hex-4088FF mt-10px">上传反面</div>
                        </div>
                        <div class="flex-col items-center" v-else @click="submitUploadBack">
                            <image class="w-240px h-150px rounded-10px" v-for="item in backList" :src="item.url"></image>
                            <p class="text-26px text-hex-4088FF mt-10px">重新上传</p>
                        </div> -->
            <nut-form-item label="证书照片" required>
                <div class="flex-center">
                    <nut-uploader :media-type="['image']" :url="frontUrl" @delete="deleteFront"
                        :before-xhr-upload="uploadFront" v-model:file-list="frontList" maximum="1">
                    </nut-uploader>
                    <nut-uploader :media-type="['image']" class="ml-10px" :url="backUrl" v-model:file-list="backList"
                        maximum="1" @delete="deleteBack" :before-xhr-upload="uploadBack">
                    </nut-uploader>
                </div>
            </nut-form-item>
        </nut-form>
        <nut-cell style="margin:0;background:transparent;padding-top:0">
            <div class="flex-col">
                <div class="mt-40px mb-20px overflow-hidden">
                    <div class="text-28px text-hex-6b6b6b">上传规范</div>
                    <div class="flex mt-10px">
                        <div class="flex-col items-center ">
                            <image class="w-160px h-160px" src="../../assets/images/normal.jpg"></image>
                            <div class="text-26px text-hex-333 flex-y-center">
                                <jx-icon value="cert-check" color="#21CF3C" :size="14"> </jx-icon>
                                标准{{backList.length,frontList.length}}
                            </div>
                        </div>
                        <div class="flex-col items-center ml-14px">
                            <image class="w-160px h-160px" src="../../assets/images/shelter.jpg">
                            </image>
                            <div class="text-26px text-hex-333 flex-y-center">
                                <jx-icon value="cert-wrong" color="#E73828" :size="14"> </jx-icon>
                                遮挡
                            </div>
                        </div>
                        <div class="flex-col items-center ml-14px">
                            <image class="w-160px h-160px" src="../../assets/images/vague.jpg">
                            </image>
                            <div class="text-26px text-hex-333 flex-y-center">
                                <jx-icon value="cert-wrong" color="#E73828" :size="14"> </jx-icon>
                                模糊
                            </div>
                        </div>
                        <div class="flex-col items-center ml-14px">
                            <image class="w-160px h-160px" src="../../assets/images/flash.jpg">
                            </image>
                            <div class="text-26px text-hex-333 flex-y-center">
                                <jx-icon value="cert-wrong" color="#E73828" :size="14"> </jx-icon>
                                闪光
                            </div>
                        </div>
                    </div>
                    <div class="mt-30px text-26px text-hex-e73828">
                        温馨提示：带有发证日期或有效日期为证书正面,上传证书时能够清楚显示姓名和有效日期，并且图片放正，
                        否则会影响证书能否通过审核。
                    </div>
                </div>
                <nut-button type="primary" style="width:80%;margin: auto;" @click="confirm">上传证书</nut-button>
            </div>

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
// const frontRef = ref<any>(null)
// const backRef = ref<any>(null)
// const submitUploadFront = () => {
//     frontRef.value.chooseImage()
//     frontRef.value.submit();
// };
// const submitUploadBack = () => {
//     backRef.value.chooseImage()
//     backRef.value.submit();
// };
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
    if (form.certificateExpireDate !== form.certificateReleaseDate) {
        if (!dayjs(form.certificateExpireDate).isAfter(form.certificateReleaseDate)) {
            notify('结束时间应该大于开始时间！')
            return
        }
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
            await updateVolunteerCerts(form as any)
            Taro.showToast({
                icon: 'none',
                title: '修改成功！',
            })
        } else {
            await saveVolunteerCerts(form as any)
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