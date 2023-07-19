<template>
    <div class="h-full overflow-hidden bg-hex-fff">
        <nut-searchbar v-model="searchValue" style="height:45px">
            <template v-slot:leftin>
                <Search2 />
            </template>
        </nut-searchbar>
        <nut-elevator :index-list="dataList" height="calc(100% - 45px)" @click-item="clickItem"
            @click-index="clickIndex"></nut-elevator>
    </div>
</template>

<script setup lang="ts">
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { fetchUnits } from '~/api/user';
type IndexLetter= { title: string, list: { name: string, id: number }[] }
const router = useRouter()
const type = router.params.type
const clickItem = (key: string, item: any) => {
    console.log(key, JSON.stringify(item));
    Taro.redirectTo({
        url: '/Manage/deviceInstall/index?item=' + JSON.stringify(item) + '&current=4'
    })
};

const searchValue = ref('')
const clickIndex = (key: string) => {
    console.log(key);
};
const state = reactive({
    dataList: [] as IndexLetter[]
});
useDidShow(async () => {
    if (type) {
        let units = await fetchUnits({
            name: searchValue.value,
            unitType: type
        })
        state.dataList = units.reduce((prev, current) => {
            let title = current.indexLetter;
            let target = prev.find(i => i.title === title)
            if (target) {
                target.list.push(current)
                return prev
            }
            prev.push({
                title,
                list: [current]
            })
            return prev
        }, [] as IndexLetter[])
    }

})
const { dataList } = toRefs(state)
</script>

<style scoped></style>