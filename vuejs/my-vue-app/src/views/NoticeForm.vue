<template>
  <div>
    <h1>공지 작성</h1>
    <input v-model="title" placeholder="제목 입력" />
    <textarea v-model="content" placeholder="내용 입력"></textarea>

    <button @click="submitNotice">등록</button>
    <button @click="$router.push('/notice')">취소</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNoticeStore } from "@/store/noticeStore";
import { useRouter } from "vue-router";

const title = ref("");
const content = ref("");
const noticeStore = useNoticeStore();
const router = useRouter();

function submitNotice() {
  if (!title.value.trim() || !content.value.trim()) {
    alert("제목과 내용을 입력하세요!");
    return;
  }

  noticeStore.addNotice(title.value, content.value);
  router.push("/notice"); // ✅ 등록 후 공지사항 페이지로 이동
}
</script>
