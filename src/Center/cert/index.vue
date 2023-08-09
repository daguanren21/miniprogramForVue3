<template>
    <div class="h-full flex-col">
        <div class="flex-1 overflow-auto">
            <div v-if="list.length" class="w-full overflow-hidden">
                <nut-swipe v-for="item in list">
                    <nut-cell :title='item.certificateName'
                        :desc="'到期时间：' + dateFilter(item.certificateExpireDate, 'YYYY-MM-DD')">
                        <template v-slot:title>
                            <span class="flex-y-center">{{ item.certificateName }} <jx-dot class="ml-20px"
                                    :state="certificateStateFilter(item.certificateState)"></jx-dot></span>
                        </template>
                    </nut-cell>
                    <template #right>
                        <nut-button shape="square" style="height:100%" type="danger"
                            @click="deleteVolunteer(item.id!)">删除</nut-button>
                        <nut-button shape="square" style="height:100%" type="info"
                            @click="toCenter('uploadCert', item.id!)">编辑</nut-button>
                    </template>
                </nut-swipe>
            </div>
            <div class="h-full flex-center flex-col" v-else>
                <nut-empty image="empty" description="暂无数据"></nut-empty>
            </div>
        </div>
        <div>
            <nut-cell>
                <nut-button color="linear-gradient(to right, #ff6034, #ee0a24)" type="primary"
                    style="width:80%;margin: auto;" @click="toCenter('uploadCert')">证书上传</nut-button>
            </nut-cell>
        </div>
        <nut-dialog pop-class="form" no-cancel-btn v-model:visible="dialog.show" @ok="dialog.confirm">
            <nut-form>
                <nut-form-item  required>
                    <nut-textarea :autosize="{
                        minHeight: 80
                    }" placeholder="请输入删除原因" v-model="form.deleteReason" limit-show max-length="200" />
                </nut-form-item>
            </nut-form>
        </nut-dialog>
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
</script>

<style lang="scss">
.header {
    height: 60px;
    line-height: 50px;
    text-align: center;
    background: #fff;
    border-bottom: solid 1px #f4f4f4;
}

.x-scroll-view {
    background-color: #fff;
}
</style>