import { defineStore } from "pinia";

export const useNoticeStore = defineStore("notice", {
  state: () => ({
    notices: []
  }),
  actions: {
    addNotice(title, content) {
      this.notices.push({
        id: Date.now(),
        title,
        content,
        createdAt: new Date().toLocaleString()
      });
    }
  }
});
