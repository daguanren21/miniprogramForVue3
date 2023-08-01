<template>
    <div class="h-full flex-col">
        <div class="flex-1 overflow-auto">
            <div v-if="list.length">
                <nut-cell v-for="item in list" :title='item.certificateName'
                :desc="'到期时间：' + dateFilter(item.certificateExpireDate,'YYYY-MM-DD')">
                <template v-slot:title>
                    <span class="flex-y-center">{{ item.certificateName }} <jx-dot class="ml-20px"
                            :state="certificateStateFilter(item.certificateState)"></jx-dot></span>
                </template>
            </nut-cell>
            </div>
            <div class="h-full flex-center flex-col" v-else>
                <nut-empty image="empty" description="暂无数据"></nut-empty>
            </div>
        </div>
        <div>
            <nut-cell>
                <nut-button color="linear-gradient(to right, #ff6034, #ee0a24)" type="primary"
                    style="width:80%;margin: auto;" @click="toCenter('uploadCert')" >证书上传</nut-button>
            </nut-cell>
        </div>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useDidShow } from '@tarojs/taro';
import { fetchVolunteerCerts } from '~/api/user';
import { dateFilter, certificateStateFilter } from '~/filter'
const list = ref<User.VolunteerCert[]>([])
const user = useAccountInfo();
useDidShow(async () => {
    let volunteerId = user.accountInfo.volunteerId
    if (volunteerId) {
        list.value = await fetchVolunteerCerts(Number(volunteerId));
    }
})
const toCenter = (key:string)=>{
    Taro.navigateTo({
        url: `/Center/${key}/index`
    })
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