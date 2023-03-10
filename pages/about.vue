<script setup lang="ts">
const { message } = await $fetch('/api/hello')
</script>

<template>
    <div>
        {{ message }}
        <span class="font-color">关于页面</span>
        <NuxtLink to="/">返回首页</NuxtLink>
    </div>
</template>

<style scoped>
.font-color {
    color: var(--text-color)
}
</style>