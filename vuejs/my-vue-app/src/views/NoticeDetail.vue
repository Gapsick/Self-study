<template>
    <div>
      <h2>공지사항 상세 내용</h2>
      <h3>{{ notice.title }}</h3>
      <p>{{ notice.content }}</p>
      <button @click="$router.push('/notice')">목록으로</button>
    </div>
  </template>
  
  <script>
  import { useRoute } from "vue-router";
  import { useNoticeStore } from "@/stores/noticeStore"; // ✅ Pinia Store 가져오기
  
  export default {
    setup() {
      const route = useRoute(); // ✅ 현재 라우트 정보 가져오기
      const noticeStore = useNoticeStore(); // ✅ Pinia Store 사용
  
      // ✅ 현재 ID에 맞는 공지사항 찾기
      const notice = noticeStore.notices.find(n => n.id === Number(route.params.id));
  
      return { notice };
    }
  };
  </script>
  