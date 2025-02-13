import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // ✅ Vue Router 가져오기

const app = createApp(App);
app.use(router); // ✅ Vue Router 적용
app.mount("#app");
