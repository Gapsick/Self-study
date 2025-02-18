import { createApp } from 'vue';
import App from './App.vue';
import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);

app.use(vue3GoogleLogin, {
  clientId: '1087749499426-3arq3def468ovjr4i40ckne5mi6bvfrg.apps.googleusercontent.com'
});

app.mount('#app');
