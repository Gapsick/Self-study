<!-- App.vue -->
<template>
  <router-view />
</template>


<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

onMounted(() => {
  router.push('/login')
})


</script>