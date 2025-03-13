<script setup>
import { onMounted } from "vue";
import { useBoardStore } from "@/store/boardStore";

const boardStore = useBoardStore();

// ✅ MainPage가 실행될 때 Pinia에서 최신 게시글 불러오기
onMounted(() => {
  boardStore.fetchPosts();
});
</script>

<template>
  <div>
    <h1>📢 공지사항 목록</h1>
    <ul>
      <li v-for="post in boardStore.posts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
      </li>
    </ul>
  </div>
</template>
