import { createApp } from 'vue';
import App from './App.vue';
import GAuth from 'vue3-google-oauth2';

const app = createApp(App);

const gAuthOptions = {
  clientId: 'YOUR_GOOGLE_CLIENT_ID',
  scope: 'email',
  prompt: 'consent',
  fetch_basic_profile: false
};

// ✅ gAuthPlugin을 사용하도록 설정
app.use(GAuth, gAuthOptions);

app.mount('#app');
