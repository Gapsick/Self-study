export default async function testDBConnection(pool, retries = 5, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
        const connection = await pool.getConnection();
        console.log("DB 연결 성공");
        connection.release();
        return;
        } catch (err) {
        console.error(`DB 연결 실패 (${i + 1}/${retries}):`, err.message);
        await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    console.error("DB 연결 최종 실패: DB가 준비되지 않았습니다.");
}
