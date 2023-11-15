<template>
  <div class="h-full">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const main = async () => {
}

setTimeout(() => main(), 0)
</script>

<style>
</style>
