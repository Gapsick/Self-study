import { defineStore } from "pinia";

export const useThemeStore = defineStore ("theme", {
    state: () => ({
        isDarkMode: false  // 기본 테마는 Light 모드
    }),
    actions: {
        toggleTheme() {
            this.isDarkMode = !this.isDarkMode; // 다크, 라이트 모드 변경

            // body태그에 dark-mode 클래스 추가/제거
            if (this.isDarkMode) {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        
        
        }

    }
})