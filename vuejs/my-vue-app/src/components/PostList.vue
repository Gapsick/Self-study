<template>
    <div>
      <h2>📌 공지사항 목록</h2>
      <button @click="fetchPosts">공지사항 불러오기</button>
      <ul>
        <li v-for="post in posts" :key="post.id">
          <strong>{{ post.title }}</strong>
          <p>{{ post.body }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from "axios"; // ✅ Axios 가져오기
  
  export default {
    data() {
      return {
        posts: [] // ✅ 공지사항 데이터를 저장할 배열
      };
    },
    methods: {
      // ✅ API 요청을 통해 공지사항 데이터를 가져오는 함수
      async fetchPosts() {
        try {
          const response = await axios.get("https://jsonplaceholder.typicode.com/posts"); // ✅ API에서 데이터 가져오기
          this.posts = response.data; // ✅ 가져온 데이터를 `posts` 배열에 저장
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      }
    }
  };
  </script>
  