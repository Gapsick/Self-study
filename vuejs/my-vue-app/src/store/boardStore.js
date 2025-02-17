import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useBoardStore = defineStore("board", () => {
  const posts = ref([]); // 게시물 목록

  // ✅ 서버에서 게시물 목록 가져와서 Pinia에 저장
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/board");
      posts.value = response.data; // API 데이터를 Pinia 상태로 저장
    } catch (error) {
      console.error("게시물 불러오기 실패:", error);
    }
  };

  // ✅ 새로운 게시물 추가 후 Pinia 업데이트
  const addPost = async (title, content) => {
    try {
      await axios.post("http://localhost:5000/api/board", { title, content });

      // ✅ 새 게시물이 추가되었으므로 목록을 다시 불러옴
      await fetchPosts();
    } catch (error) {
      console.error("게시물 추가 실패:", error);
    }
  };

  return { posts, fetchPosts, addPost };
});
