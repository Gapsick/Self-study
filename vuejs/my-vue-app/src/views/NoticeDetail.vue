<template>
  <div>
    <h1>{{ notice?.title }}</h1>
    <p>{{ notice?.content }}</p>
    <p><small>{{ notice?.date }}</small></p>
    <button @click="$router.push('/notice')">목록으로</button>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useNoticeStore } from "@/store/noticeStore";

const route = useRoute();
const noticeStore = useNoticeStore();
const notice = noticeStore.notices.find(n => n.id === Number(route.params.id));
</script>
