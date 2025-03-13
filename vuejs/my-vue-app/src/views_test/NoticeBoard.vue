<template>
    <div>
      <h1>공지사항</h1>
      <button @click="$router.push('/notice-form')">새 공지 작성</button>
  
      <ul>
        <li v-for="notice in notices" :key="notice.id">
          <router-link :to="'/notice/' + notice.id">{{ notice.title }} ({{ notice.date }})</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { useNoticeStore } from "@/store/boardStore";
  
  const noticeStore = useNoticeStore();
  const notices = noticeStore.notices;
  </script>
  