<template>
    <div>
        <h2>나는 컴포넌트 입니다!</h2>
        <p>전달받은 메시지: {{ message }}</p>
    </div>
</template>

<script>
export default {
    name: "MyComponent",
    props: ["message"]  // 부모로부터 데이터를 받은 props 정의
}

</script>