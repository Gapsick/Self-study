<template>
  <div>
    <h2>📅 시간표 관리</h2>
    <br />

    <!-- 🎯 날짜 선택 -->
    <label>날짜 선택:
      <input type="date" v-model="selectedDate" @change="fetchTimetableForWeek" />
    </label>

    <!-- 🎯 교수님 & 관리자만 "시간표 추가" & "수정" 버튼 보이게 설정 -->
    <div v-if="isProfessorOrAdmin">
      <button @click="openAddTimetableModal">➕ 시간표 추가</button>
      <button @click="openEditTimetableModal">✏️ 시간표 수정</button>
      <button @click="openHolidayModal">🏖 휴강 등록</button>
    </div>

    <!-- 🎯 학년 선택 버튼 -->
    <div>
      <button @click="fetchTimetableForWeek(1)" :class="{ active: selectedGrade === 1 }">1학년</button>
      <button @click="fetchTimetableForWeek(2)" :class="{ active: selectedGrade === 2 }">2학년</button>
      <button @click="fetchTimetableForWeek(3)" :class="{ active: selectedGrade === 3 }">3학년</button>
    </div>

    <!-- 🎯 시간표 테이블 -->
    <table>
      <thead>
        <tr>
          <th>교시</th>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="period in periods" :key="period">
          <td>{{ period }}교시</td> <!-- ✅ 왼쪽 "교시" 라벨 유지 -->
          <td v-for="day in days" :key="day">
            <div v-if="isHoliday(day, period)">
              <strong style="color: red;">🚫 휴강</strong>
            </div>
            <div v-else-if="getCourse(day, period)">
              <strong>{{ getCourse(day, period).subject_name }}</strong>
              <br />({{ getCourse(day, period).professor }})
              <br />{{ getCourse(day, period).classroom }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { startOfWeek, endOfWeek, format } from "date-fns";

export default {
data() {
  return {
    selectedDate: new Date().toISOString().slice(0, 10), // ✅ 기본적으로 오늘 날짜
    selectedWeekStart: "", // ✅ 해당 주의 월요일
    selectedWeekEnd: "", // ✅ 해당 주의 금요일
    selectedGrade: 1, // ✅ 기본 학년 설정
    isProfessorOrAdmin: false,
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    periods: [1, 2, 3, 4, 5, 6, 7, 8],
    timetable: [],
    holidays: [],
  };
},
async created() {
  this.userRole = localStorage.getItem("role");
  if (this.userRole === "professor" || this.userRole === "admin") {
    this.isProfessorOrAdmin = true;
  }
  this.fetchTimetableForWeek();
},
methods: {
  /** ✅ 선택한 날짜의 주간 시간표 조회 */
  async fetchTimetableForWeek(grade = null) {
    if (typeof grade === "number") {  
      this.selectedGrade = grade;  // ✅ 숫자일 때만 학년 업데이트
    }

    if (!this.selectedGrade) {
      console.error("❌ 학년 정보가 없습니다.");
      return;
    }

    // ✅ 선택한 날짜를 기준으로 주간(월요일~금요일) 범위 계산
    const selected = new Date(this.selectedDate);
    this.selectedWeekStart = format(startOfWeek(selected, { weekStartsOn: 1 }), "yyyy-MM-dd"); // 월요일
    this.selectedWeekEnd = format(endOfWeek(selected, { weekStartsOn: 5 }), "yyyy-MM-dd"); // 금요일

    console.log(`📅 요청 보냄: ${this.selectedWeekStart} ~ ${this.selectedWeekEnd} (학년: ${this.selectedGrade})`);

    try {
      // ✅ 백엔드 요청 (주간 시간표 & 휴강 정보)
      const res = await axios.get(`http://localhost:5000/api/timetable`, {
        params: {
          start: this.selectedWeekStart,
          end: this.selectedWeekEnd,
          academic_year: this.selectedGrade, // ✅ 학년 추가
        }
      });

      this.timetable = [...(res.data.timetable || [])];
      this.holidays = [...(res.data.holidays || [])];

    } catch (error) {
      console.error("❌ 주간 시간표 데이터를 가져오는 중 오류 발생:", error);
      this.timetable = [];
    }
  },

  /** ✅ 해당 요일 & 교시에 맞는 수업 반환 */
  getCourse(day, period) {
    return this.timetable.find((t) => 
        t.day === day && 
        t.lecture_period === period // ✅ 교시 기준으로 정확한 위치에 배치
    );
  },

  /** ✅ 휴강 여부 확인 (subject_id만 비교) */
  isHoliday(day, period) {
    return this.holidays.some(holiday => 
        this.timetable.some(course => 
            course.period === this.selectedGrade && // ✅ 최상위 some()에서 학년 먼저 필터링
            course.subject_id === holiday.subject_id && 
            course.day === day &&
            course.period === period 
        )
    );
}




},
};
</script>

<style scoped>
table {
width: 100%;
border-collapse: collapse;
}
th, td {
border: 1px solid #ddd;
padding: 10px;
text-align: center;
}
button {
margin: 5px;
padding: 8px 12px;
border: none;
cursor: pointer;
background-color: lightgray;
}
button.active {
background-color: #4CAF50;
color: white;
}
</style>
