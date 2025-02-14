import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // ✅ Vue Router 가져오기
import { createPinia } from "pinia";    // Pinia 가져오기

const app = createApp(App);
app.use(router); // ✅ Vue Router 적용
app.use(createPinia()); // Vue 앱에서 Pinia 사용 설정
app.mount("#app");
