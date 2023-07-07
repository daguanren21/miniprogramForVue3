<template>
    <div class="h-full">
        <nut-cell class="h-full">
            <nut-list :height="50" :listData="count" @scroll-bottom="handleScroll">
                <template v-slot="{ item, index }">
                    <div class="list-item" style="height:50px"> {{ index }} </div>
                </template>
            </nut-list>
        </nut-cell>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'deviceList'
})
const count = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
function handleScroll() {
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