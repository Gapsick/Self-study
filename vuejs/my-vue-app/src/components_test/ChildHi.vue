<template>
    <button @click="sendMessage">부모에게 메시지 보내기</button>
  </template>
  
  <script>
  export default {
    methods: {
      sendMessage() {
        this.$emit("messageSent", "자식에서 보낸 메시지입니다!");
      }
    }
  };
  </script>
  