<template>
    <div>
        <h1>홈 페이지</h1>
        <p>여기는 홈입니다.</p>
        <router-link to="/dashboard"><button>대시보드로 이동</button></router-link>
    </div>
</template>

<script>
export default {
    name: "HomePage"
};
</script>