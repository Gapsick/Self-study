<template>
    <div>
        <h1>{{ message }}</h1>
        <button @click="changeMessage">메시지 변경경</button>
    </div>
</template>

<script>
export default {
    data() {
        return{
            message: "안녕하세요, Vue.js!"
        }
    },
    methods: {
        changeMessage() {
            this.message = "메시지가 변경되었습니다!"
        }
    }
}
</script>