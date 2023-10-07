<template>
    <div class="wh-full  flex-col bg-hex-fff">
        <nut-notify :type="message.type" v-model:visible="message.show" :msg="message.desc" />
        <nut-form class="flex-1 overflow-auto" :model-value="form" ref="ruleForm">
            <nut-form-item required>
                <div class="w-full flex-col items-center">
                    <button style="padding:0;margin: 0;"
                        class="h-180px w-180px rounded-full text-26px line-height-180px text-truncate"
                        @chooseavatar="getAvatar" open-type="chooseAvatar">
                        <img class="w-180px h-180px" mode="aspectFill" v-if="form.imageUrl" :src="form.imageUrl" alt="">
                        <open-data class="w-180px h-180px rounded-full overflow-hidden" v-else
                            type="userAvatarUrl"></open-data>
                    </button>
                    <button  @chooseavatar="getAvatar" open-type="chooseAvatar" style="padding:0;margin: 0;" class="change-avatar text-26px text-hex-4088FF mt-11px">修改头像</button>
                </div>

            </nut-form-item>
            <nut-form-item class="jx-form-item" label="昵称" required>
                <nut-input :border="false" max-length="10" v-model="form.nickName" class="nut-input-text"
                    placeholder="请输入昵称" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item class="jx-form-item" label="真实姓名">
                <nut-input :border="false" max-length="20" v-model="form.realName" class="nut-input-text"
                    placeholder="请输入真实姓名" type="text">
                </nut-input>
            </nut-form-item>
            <nut-form-item class="jx-form-item" label="邮箱">
                <nut-input :border="false" v-model="form.email" class="nut-input-text" placeholder="请输入邮箱" type="text">
                </nut-input>
            </nut-form-item>
        </nut-form>
        <nut-cell style="margin:0;background:transparent">
            <nut-button type="primary" class="m-auto" style="width:80%;margin: auto;" @click="confirm" :loading="loading">修改</nut-button>
        </nut-cell>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { updateAccountInfo } from '~/api/user';
import useLoading from '~/composables/use-loading';

// import Taro from '@tarojs/taro';
import { useNotify } from '~/composables/use-notify';
const auth = useAuthStore()
const account = useAccountInfo()
let form = reactive({
    email: "",
    imageUrl: "",
    nickName: "",
    phoneNumber: "",
    realName: ""
})
watch(() => account.accountInfo, (val) => {
    form.email = val.email;
    form.imageUrl = val.imageUrl;
    form.nickName = val.nickName
    form.phoneNumber = val.phoneNumber
    form.realName = val.realName
}, {
    immediate: true
})
const getAvatar = (e) => {
    Taro.uploadFile({
        url: baseUrl + 'common/api/v1/oss-files',
        filePath: e.detail.avatarUrl,
        name: 'file',
        header: {
            Authorization: `Bearer ${auth.authInfo.id_token}`,
            'accept-language': 'zh-CN'
        },
        success: (res) => {
            if (res.statusCode === 201) {
                const data = JSON.parse(res.data)
                console.log(data.urlPath)
                form.imageUrl = data.urlPath
            }
        },
        fail: () => {
            Taro.showToast({
                icon: 'none',
                title: '上传失败，重新上传'
            })
            return
        }
    })
}
const { state: message, notify } = useNotify('danger')
const user = useAccountInfo()
const { loading, startLoading, endLoading } = useLoading()
const confirm = async () => {
    if (!form.imageUrl) {
        notify('头像不能为空！')
        return
    }
    if (!form.nickName) {
        notify('昵称不能为空！')
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
        await updateAccountInfo(form as any)
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
        notify(error);
        return
    }
}
</script>

<style  lang="scss">
.change-avatar {
    background:transparent;
    &::after{
        border: none;
    }
}
</style>