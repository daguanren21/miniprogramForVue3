<template>
    <div class="h-full flex-col bg-hex-f7f7f7">
        <div class="flex-1 overflow-auto">
            <div v-if="list.length" class="w-full mt-28px overflow-hidden">
                <div class="mb-15px p-24px bg-hex-fff m-x-15px rounded-20px" v-for="item in list">
                    <div class="flex-x-center">
                        <image class="w-315px h-200px" :src='item.frontImagePath'></image>
                        <image class="w-315px h-200px ml-20px" :src='item.backImagePath'></image>
                    </div>
                    <div class="mt-30px flex-y-center">
                        <div style="max-width: 75%;" class="line-clamp-1 break-all  text-30px text-hex-333 font-bold">{{
                            item.certificateName }}</div>
                        <div class="ml-14px text-24px text-hex-32b44b valid w-95px h-38px line-height-38px"
                            v-if="item.certificateState === 'VALID'">
                            {{ certificateStateFilter(item.certificateState).text }}
                        </div>
                        <div class="ml-14px text-24px text-hex-da2718 expired w-95px h-38px line-height-38px" v-else>
                            {{ certificateStateFilter(item.certificateState).text }}
                        </div>
                    </div>
                    <div class="flex-y-center justify-between mt-33px">
                        <div class="text-24px text-hex-999">到期时间：{{ dateFilter(item.certificateExpireDate, 'YYYY-MM-DD') }}
                        </div>
                        <div>
                            <nut-button class="jx-button" type='info' @click="toCenter('uploadCert', item.id!)">修改</nut-button>
                            <nut-button class="jx-button" style="margin-left:10rpx" type='danger'
                                @click="deleteVolunteer(item.id!)">删除</nut-button>
                        </div>
                    </div>
                    <div class="mt-25px h-1px bg-hex-dbdbdb">
                    </div>
                    <div class="mt-25px">
                        <div class="text-hex-999 text-26px flex-y-center">
                            审核状态：<span class="text-28px text-hex-409EFF"
                                :style="{ color: handleCheckState(item.auditState).color }">{{
                                    handleCheckState(item.auditState).text }}</span>
                        </div>
                        <div class="text-hex-999 text-26px mt-30px" v-if="item.description">
                            审核意见：<span class="text-28px text-hex-333">{{ item.description }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-full flex-center flex-col" v-else>
                <nut-empty image="empty" description="暂无数据"></nut-empty>
            </div>
        </div>
        <div>
            <nut-cell style="margin: 0;background:transparent">
                <nut-button color="linear-gradient(to right, #ff6034, #ee0a24)" type="primary"
                    style="width:80%;margin: auto;" @click="toCenter('uploadCert')">证书上传</nut-button>
            </nut-cell>
        </div>
        <nut-popup position="bottom" closeable round :style="{ height: '43%' }" v-model:visible="dialog.show">
            <div class="text-center text-30px text-hex-1f1f1f font-bold mt-42px">证书删除</div>
            <div class="w-full flex-col items-center">
                <nut-form :model-value="form" ref="ruleForm">
                    <nut-form-item required>
                        <div class="w-684px h-256px jx-textarea">
                            <nut-textarea placeholder="请输入删除原因" v-model="form.deleteReason" limit-show max-length="200" />
                        </div>
                    </nut-form-item>
                </nut-form>
                <nut-button type='info' style="width: 550rpx;height:73rpx;font-size: 30rpx;"
                    @click="dialog.confirm">提交</nut-button>
            </div>
        </nut-popup>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useDidShow } from '@tarojs/taro';
import { deleteVolunteerCerts, fetchVolunteerCerts } from '~/api/user';
import { dateFilter, certificateStateFilter } from '~/filter'
const list = ref<User.VolunteerCert[]>([])
const user = useAccountInfo();
useDidShow(async () => {
    let volunteerId = user.accountInfo.volunteerId
    if (volunteerId) {
        list.value = await fetchVolunteerCerts(Number(volunteerId));
    }
})
const toCenter = (key: string, id: number = 0) => {
    Taro.navigateTo({
        url: `/Center/${key}/index?id=${id}`
    })
}
const form = reactive({
    id: 0,
    deleteReason: ''
})
const dialog = reactive({
    show: false,
    confirm: async () => {
        try {
            await deleteVolunteerCerts(form.id, form.deleteReason)
            Taro.showToast({
                icon: 'success',
                title: '删除成功！'
            })
            setTimeout(async () => {
                let volunteerId = user.accountInfo.volunteerId
                if (volunteerId) {
                    list.value = await fetchVolunteerCerts(Number(volunteerId));
                }
            }, 1000);
        } catch (error) {
            Taro.showToast({
                icon: 'none',
                title: error
            })
        }
    }
})
const deleteVolunteer = (id: number) => {
    form.id = id
    dialog.show = true
}
const handleCheckState = (state: Filter.AuditState) => {
    if (state === 'PASS') {
        return {
            color: '#32B44B',
            text: '通过'
        }
    } else if (state === 'REJECT') {
        return {
            color: '#DA2718',
            text: '不通过'
        }
    } else {
        return {
            color: '#409EFF',
            text: '审核中'
        }
    }
}
</script>

<style lang="scss">


.valid {
    background: url(../../assets/images/center/active.png) no-repeat;
    background-size: 100% 100%;
    text-align: center;
}

.expired {
    background: url(../../assets/images/center/unactive.png) no-repeat;
    background-size: 100% 100%;
    text-align: center;
}
</style>