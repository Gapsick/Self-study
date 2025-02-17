<template>
    <div>
      <h2>게시물 작성</h2>
      <input v-model="title" placeholder="제목을 입력하세요" />
      <textarea v-model="content" placeholder="내용을 입력하세요"></textarea>
      <button @click="submitPost">등록</button>
      <button @click="cancel">취소</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  
  const title = ref("");
  const content = ref("");
  const router = useRouter();
  
  const submitPost = async () => {
    if (!title.value.trim() || !content.value.trim()) {
      alert("제목과 내용을 입력하세요!");
      return;
    }
  
    try {
      await axios.post("http://localhost:5000/api/board", {
        title: title.value,
        content: content.value,
      });
      alert("게시물이 등록되었습니다!");
      router.push("/"); // ✅ 게시물 등록 후 메인 페이지로 이동
    } catch (error) {
      console.error("게시물 등록 중 오류 발생:", error);
      alert("게시물 등록에 실패했습니다.");
    }
  };
  
  const cancel = () => {
    router.push("/"); // ✅ 취소 버튼 클릭 시 메인 페이지로 이동
  };
  </script>
  