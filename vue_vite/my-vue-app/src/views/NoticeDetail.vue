<template>
    <div>
      <h1>공지사항 작성</h1>
      <form @submit.prevent="submitNotice">
        <label for="title">제목:</label>
        <input type="text" id="title" v-model="title" required />
  
        <label for="content">내용:</label>
        <textarea id="content" v-model="content" required></textarea>
  
        <button type="submit">작성하기</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        title: "",
        content: "",
      };
    },
    methods: {
      async submitNotice() {
        try {
          const response = await fetch("http://localhost:5000/api/notices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: this.title,
              content: this.content,
            }),
          });
          const result = await response.json();
          console.log("공지사항 작성 결과:", result);
        } catch (error) {
          console.error("공지사항 작성 중 오류 발생:", error);
        }
      },
    },
  };
  </script>
  