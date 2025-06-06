function printId(id: number | string) {
    if (typeof id ==="string") {
        console.log("문자열 ID:", id.toUpperCase());
    } else {
        console.log("숫자 ID:", id)
    }
}