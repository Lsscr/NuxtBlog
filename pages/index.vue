<script setup lang="ts">
const posts = await $fetch("/api/posts");
</script>

<template>
    <div class="flex items-center flex-col gap-2 py-4 ml-auto mr-auto">
    <!-- <h1>Index Page</h1>
                <div>
                  <NButton>hello</NButton>
                </div>
                <NuxtLink to="/detail/1">detail 1</NuxtLink> -->
        <div class="w-[100%] text-left" v-for="post in posts" :key="post.id">
            <NuxtLink class="text-lg" :to="`/detail/${post.id}`">{{
                post.title
            }}</NuxtLink>
            <p class="text-slate-500">发布于: {{ post.date }}</p>
        </div>
    </div>
</template>