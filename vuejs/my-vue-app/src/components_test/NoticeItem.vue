<template>
    <li>
      <router-link :to="'/notice/' + notice.id">{{ notice.title }} ({{ notice.date }})</router-link>
    </li>
  </template>
  
  <script setup>
  defineProps(["notice"]);
  </script>
  