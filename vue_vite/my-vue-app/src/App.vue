<script setup>
import { useAuthStore } from "@/stores/useAuthStore"
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import Navbar from "@/components/Navbar.vue" // ✅ 주석 해제

const authStore = useAuthStore()
const router = useRouter()
const checkedAuth = ref(false)

onMounted(async () => {
  await authStore.checkAuth()
  if (authStore.isAuthenticated) {
    router.push("/main")
  } else {
    router.push("/login")
  }
  checkedAuth.value = true
})
</script>

<template>
  <Navbar v-if="checkedAuth && authStore.isAuthenticated" />
  <router-view />
</template>
