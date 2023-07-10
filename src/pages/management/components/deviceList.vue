<template>
    <div class="h-full overflow-hidden">
        <nut-list :height="50" :listData="count" @scroll-bottom="handleScroll">
            <template v-slot="{ item, index }">
                <div class="list-item"> {{ index }} </div>
            </template>
        </nut-list>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'deviceList'
})
const count = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
function handleScroll() {
    debugger
    console.log("scroll")
}
</script>

<style lang="scss">
.list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
    background-color: #f4a8b6;
    border-radius: 10px;
}
</style>