import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { GoogleLogin } from "vue3-google-login"; // ✅ 올바른 import 방식

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
});

app.mount("#app");
