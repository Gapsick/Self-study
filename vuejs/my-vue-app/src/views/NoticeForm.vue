<script setup>
import { ref } from "vue";
import { useBoardStore } from "@/store/boardStore";
import { useRouter } from "vue-router";

const boardStore = useBoardStore();
const router = useRouter();

const title = ref("");
const content = ref("");

const submitNotice = async () => {
  if (!title.value || !content.value) {
    alert("제목과 내용을 입력하세요.");
    return;
  }

  await boardStore.addPost(title.value, content.value); // ✅ Pinia에서 게시물 추가
  router.push("/"); // ✅ MainPage로 이동 (데이터는 이미 Pinia에서 관리 중)
};
</script>

<template>
  <div>
    <h2>📌 공지사항 작성</h2>
    <input v-model="title" placeholder="제목 입력" />
    <textarea v-model="content" placeholder="내용 입력"></textarea>
    <button @click="submitNotice">등록</button>
  </div>
</template>
