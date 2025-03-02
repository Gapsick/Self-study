import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchNotices } from "@/api/noticeApi";

export const useNoticeStore = defineStore("notice", {
  state: () => ({
    notices: ref([]),
  }),
  actions: {
    async getNotices() {
      try {
        console.log("📢 공지사항 불러오는 중...");
        const data = await fetchNotices();
        this.notices = data; // ✅ 데이터 저장
        console.log("📢 공지사항 불러오기 완료:", this.notices);
      } catch (error) {
        console.error("🚨 공지사항 불러오기 실패:", error);
      }
    },
  },
});
