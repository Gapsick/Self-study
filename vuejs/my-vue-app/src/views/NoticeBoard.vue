<template>
    <div>
        <h1>공지사항</h1>
        <ul>
            <li v-for="notice in noticeStore.notices" :key="notice.id">
                <router-link :to="`/notice/${notice.id}`">
                    {{ notice.title }}
                </router-link>
            </li>
        </ul>
        <button @click="$router.push('/notice-form')">작성하기</button>
    </div>
</template>

<script>
import { useNoticeStore } from '@/stores/noticeStore';

export default {
    name: "NoticeBoard",

    setup() {
        const noticeStore = useNoticeStore();   // Pinia Store 가져오기
        return { noticeStore };
    }

}
</script>

<style scoped>
button {
  background-color: blue;
  color: white;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 15px;
}
</style>