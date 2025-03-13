<template>
    <nav>
      <ul>
        <li><router-link to="/">🏠 홈</router-link></li>
        <li><router-link to="/notice">📢 공지사항</router-link></li>
        <li><router-link to="/qna">❓ Q&A</router-link></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: "NavBar"
  };
  </script>
  
  <style scoped>
  nav {
    background-color: #333;
    padding: 10px;
  }
  ul {
    list-style: none;
    display: flex;
    justify-content: space-around;
    padding: 0;
  }
  li {
    display: inline;
  }
  a {
    color: white;
    text-decoration: none;
    font-size: 18px;
    padding: 10px;
  }
  a:hover {
    background-color: #555;
    border-radius: 5px;
  }
  </style>
  