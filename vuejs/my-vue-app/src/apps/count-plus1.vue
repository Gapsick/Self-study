<template>
  <div>
    <h2>버튼을 클릭하면 count 값이 1씩 증가하는 Vue 앱 만들기</h2>
    <h1 :style="{ color: count > 5 ? 'red' : 'black'}">현재 카운트: {{ count }}</h1>
    <button @click="increaseCount()">버튼</button> |
    <button @click="resetCount()">초기화</button>

  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increaseCount() {
      if (this.count < 10) {
      this.count++;
      }
    },
    resetCount() {
      this.count = 0;
    }
  }
}

</script>