<script setup>
import { useAuthStore } from "@/stores/useAuthStore"
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import Navbar from "@/components/Navbar.vue" // ✅ 주석 해제

const authStore = useAuthStore()
const router = useRouter()
const checkedAuth = ref(false)

onMounted(async () => {
  const currentPath = window.location.pathname

  await authStore.checkAuth()

  if (authStore.isAuthenticated) {
    // 로그인된 경우: 원래 가려던 경로로 이동
    router.replace(currentPath)
  } else {
    // 로그인 안 된 경우: 로그인 후 원래 경로로 돌아갈 수 있게 redirect 쿼리 포함
    router.push({
      path: "/login",
      query: { redirect: currentPath }
    })
  }

  checkedAuth.value = true
})


</script>

<template>
  <Navbar v-if="checkedAuth && authStore.isAuthenticated" />
  <router-view />
</template>
