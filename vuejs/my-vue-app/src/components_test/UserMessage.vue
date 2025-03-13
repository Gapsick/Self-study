<template>
    <p>부모 컴포넌트에서 받은 메시지: {{ text }}</p>
</template>

<script>
export default {
    props: ["text"] // 부모가 전달한 데이터를 받음
};
</script>