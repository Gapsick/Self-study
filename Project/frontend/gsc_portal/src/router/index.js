// index.js
import { createWebHistory, createRouter } from "vue-router";

// Router 들고 오기
import login_url_router from "./login.router/login.router";

const routes = [
    ...login_url_router
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;