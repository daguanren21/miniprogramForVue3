<template>
    <IconFont font-class-name="fa" class-prefix="fa" :name="value" :color="color" :size="size"></IconFont>
</template>

<script setup lang="ts">
defineOptions({
    name: 'jxIcon'
})

withDefaults(defineProps<{
    value: string,
    color?: string,
    size?: number
}>(), {
    size: 20,
    color: '#333'
})

</script>

<style scoped></style>