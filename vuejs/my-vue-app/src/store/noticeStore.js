// src/store/noticeStore.js
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useNoticeStore = defineStore("noticeStore", () => {
  const notices = ref(JSON.parse(localStorage.getItem("notices")) || []);

  function addNotice(title, content) {
    const newNotice = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleString(),
    };
    notices.value.unshift(newNotice);
  }

  watch(notices, (newNotices) => {
    localStorage.setItem("notices", JSON.stringify(newNotices));
  }, { deep: true });

  return { notices, addNotice };
});
