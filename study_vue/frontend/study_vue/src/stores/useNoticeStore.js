// 📁 src/stores/useNoticeStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNoticeStore = defineStore("notice", () => {
  const notices = ref([
    { id: 1, title: "첫 번째 공지", content: "이것은 첫 번째 공지사항입니다." },
    { id: 2, title: "두 번째 공지", content: "Vue 프로젝트를 시작합니다!" },
  ]);

  // ✅ 공지사항 목록 가져오기
  const getNotices = () => {
    return notices.value;
  };

  // ✅ 새로운 공지사항 추가
  const addNotice = (title, content) => {
    const newNotice = {
      id: notices.value.length + 1,
      title,
      content,
    };
    notices.value.push(newNotice);
  };

  // ✅ 공지사항 삭제
  const deleteNotice = (id) => {
    notices.value = notices.value.filter((notice) => notice.id !== id);
  };

  return { notices, getNotices, addNotice, deleteNotice };
});
