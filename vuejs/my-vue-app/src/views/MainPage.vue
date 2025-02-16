<template>
  <div>
    <h1>메인 페이지</h1>
    <button @click="$router.push('/notice-form')">공지 작성</button>

    <h2>최근 공지사항</h2>
    <ul>
      <li v-for="notice in notices.slice(0, 3)" :key="notice.id">
        <router-link :to="'/notice'">{{ notice.title }} ({{ notice.date }})</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useNoticeStore } from "@/store/noticeStore";

const noticeStore = useNoticeStore();
const notices = noticeStore.notices;
</script>
