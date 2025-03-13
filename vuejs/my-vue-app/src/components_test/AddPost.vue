<template>
    <div>
        <h2>새 공지사항 추가</h2>
        <input v-model="newPost.title" placeholder="제목 입력" />
        <textarea v-model="newPost.body" placeholder="내용 입력"></textarea>
        <button @click="addPost">공지사항 추가</button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            newPost: {
                title: "",
                body: "",
            }
        };
    },
    methods: {
        // 사용자가 입력한 데이터를 API에 추가하는 함수
        async addPost() {
            try {
                const response = await axios.post("https://jsonplaceholder.typicode.com/posts", this.newPost); // ✅ API 요청 (데이터 보내기)
                console.log("공지사항 추가됨:", response.data);
                alert("새 공지사항이 추가되었습니다!");
                this.newPost.title = "";
                this.newPost.body = "";
            } catch (error) {
                console.error("공지사항 추가 중 오류 발생: ", error);
            }
        }
    }
};
</script>