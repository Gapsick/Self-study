// 1. 기본 인터페이스 정의
interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

// 2. type alias: 관리자 or 일반 사용자
type Role = "admin" | "user";

// 3. 제네릭 + Partial: 유저 정보를 부분만 수정 가능하게
function updateUser<T extends Partial<User>>(userId: number, updateData: T): void {
  console.log(`Updating user ${userId} with:`, updateData);
}

// 4. 유니언 + narrowing: 역할별 처리
function printRole(role: Role) {
  if (role === "admin") {
    console.log("관리자 권한입니다.");
  } else {
    console.log("일반 사용자입니다.");
  }
}

// ✅ 사용 예시
updateUser(1, { name: "Kim", email: "kim@example.com" });  // Partial 덕분에 일부만 수정 가능
printRole("user");  // 유니언 타입 분기
