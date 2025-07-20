<template>
  <button @click="log">{{ msg }}</button>
</template>


<script setup>

const msg = `Hello!`

function log() {
  console.log(msg)
}




</script>