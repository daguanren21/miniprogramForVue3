<template>
    <div class="flex-col wh-full overflow-hidden">
        <div class="flex-1">
            <nut-form :model-value="form" ref="ruleForm">
                <nut-form-item label="设备编号">
                    <nut-input v-model="form.serialNumber" class="nut-input-text" placeholder="请输入设备编号" type="text">
                        <template #right>
                            <jx-icon value="scan"></jx-icon>
                        </template>
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="设备型号">
                    <nut-input class="nut-input-text" v-model="form.model" placeholder="请输入设备型号" type="text">
                    </nut-input>
                </nut-form-item>
                <nut-form-item label="品牌">
                    <nut-input class="nut-input-text" v-model="form.brandName" @click-input="handleChangeBrand"
                        placeholder="请选择品牌" type="text" />
                    <nut-popup position="bottom" v-model:visible="pop.show">
                        <nut-picker v-model="form.brandId" :columns="pop.columns" title="请选择品牌" @confirm="confirm"
                            @cancel="pop.show = false">
                        </nut-picker>
                    </nut-popup>
                </nut-form-item>
            </nut-form>
        </div>
        <div class="flex-x-center">
            <nut-button size="mini" style="width:80%;height: 70rpx;" type="primary" class="h-70px"
                @click="next">下一步</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { fetchDeviceBrands } from '~/api/common';
import { useStep } from '~/composables/use-device-install'
defineOptions({
    name: 'basic'
})
const props = defineProps<{
    current: number
}>()
const emits = defineEmits<{
    change: [value: number]
}>()
const { next } = useStep(props, emits)
const pop = reactive({
    show: false,
    columns: [] as {
        text: string;
        value: string
    }[],

})
const form = reactive({
    serialNumber: '',
    model: '',
    brandName: '',
    brandId: [] as string[]
})
//切换品牌
async function handleChangeBrand() {
    let res = await fetchDeviceBrands()
    pop.columns = res.map(i => {
        return {
            text: i.name,
            value: i.id.toString()
        }
    })
    form.brandId = ['10']
    pop.show = true
}
function confirm({ selectedValue, selectedOptions }) {
    console.log(selectedValue, selectedOptions)
    form.brandId = [selectedOptions[0].value]
    form.brandName = selectedOptions[0].text
    pop.show = false
}

</script>

<style scoped></style>