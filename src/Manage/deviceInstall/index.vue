<template>
    <div class="h-full bg-hex-fff overflow-hidden flex-col">
        <div class="p-y-30px">
            <!-- handleClickStep -->
            <nut-steps :current="current" >
                <nut-step title="基本信息">基本信息</nut-step>
                <nut-step title="配件信息">配件信息</nut-step>
                <nut-step title="安装信息">安装信息</nut-step>
                <nut-step title="归属信息">归属信息</nut-step>
                <nut-step title="开放信息">开放信息</nut-step>
            </nut-steps>
        </div>
        <div class="flex-1 overflow-hidden">
            <component :is='currentComponent' @change="(value: number) => current = value" :current="current">
            </component>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from '@tarojs/taro';
import basic from './components/basic.vue'
import parts from './components/parts.vue'
import deploy from './components/deploy.vue'
import ascription from './components/ascription.vue'
import open from './components/open.vue'
const steps = [basic, parts, deploy, ascription, open]
const router = useRouter()
console.log(router.params)
const state = reactive({
    current: 1
});
state.current = router.params.current ? Number(router.params.current) : 1
const currentComponent = computed(() => steps[state.current - 1])
// const handleClickStep = (index: number) => {
//     state.current = index
// };
const { current } = toRefs(state);

</script>

<style scoped></style>