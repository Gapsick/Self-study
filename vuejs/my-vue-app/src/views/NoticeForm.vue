<template>
    <div>
      <h1>📢 공지사항 작성</h1>
      
      <input v-model="title" placeholder="공지사항 제목" />
      <textarea v-model="content" placeholder="공지사항 내용을 입력하세요"></textarea>
      <div>
      <button @click="submitNotice">📌 등록</button>
      <button @click="cancel">등록 취소</button>
      </div>
    </div>
  </template>
  
<script>
  import { useNoticeStore } from "@/stores/noticeStore"; // ✅ Pinia Store 가져오기
  
  export default {
    data() {
      return {
        title: "",     // ✅ 입력받을 공지사항 제목
        content: ""    // ✅ 입력받을 공지사항 내용
      };
    },
    methods: {
      submitNotice() {
        // ✅ 입력값이 비어있으면 경고창 띄우기
        if (this.title.trim() === "" || this.content.trim() === "") {
          alert("제목과 내용을 입력하세요!");
          return;
        }
  
        const noticeStore = useNoticeStore(); // ✅ Pinia Store 사용
        noticeStore.addNotice(this.title, this.content);  // ✅ Pinia Store에 저장
        this.$router.push("/notice");  // ✅ 저장 후 NoticeBoard.vue로 이동
      },
      cancel() {
        this.$router.push("/notice");   // 취소 버튼을 누르면 공지사항 목록으로 이동
      }
    }
  };
</script>
  
  <style scoped>
  input, textarea {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
  }
  button {
    background-color: blue;
    color: white;
    padding: 10px;
    cursor: pointer;
  }
  </style>
  