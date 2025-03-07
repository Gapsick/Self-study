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
    <button @click="openModal('add')">➕ 시간표 추가</button>
    <button @click="prepareEdit()">✏️ 시간표 수정</button>
    <button @click="prepareDelete()">🗑 시간표 삭제</button>
    <button @click="openModal('holiday')">🏖 휴강 등록</button>
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
      <!-- 🎯 Modal 창 -->
      <div v-if="modalOpen" class="modal">
        <div class="modal-content">
          <h3>{{ modalTitle }}</h3>

 <!-- 🎯 시간표 추가 모달 -->
<div v-if="modalType === 'add'">
  <h3>시간표 추가</h3>
  <label>과목 선택:
    <select v-model="form.subject_id">
      <option v-if="subjects.length === 0" disabled>과목을 불러오는 중...</option>
      <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.name }}
      </option>
    </select>
  </label>
  <label>교수명:
    <input type="text" v-model="form.professor" />
  </label>
  <label>강의실:
    <input type="text" v-model="form.classroom" />
  </label>
  <label>요일:
    <select v-model="form.day">
      <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
    </select>
  </label>
  <label>학년:
    <select v-model="form.period">
      <option v-for="n in 3" :key="n" :value="n">{{ n }}학년</option>
    </select>
  </label>
  <label>교시:
    <select v-model="form.lecture_period">
      <option v-for="n in 8" :key="n" :value="n">{{ n }}교시</option>
    </select>
  </label>
  <label>강의 기간:
    <input type="date" v-model="form.start_date" />
    ~
    <input type="date" v-model="form.end_date" />
  </label>
</div>

<!-- 🎯 시간표 수정 모달 -->
<div v-if="modalType === 'edit'">
  <h3>시간표 수정</h3>
  
  <!-- 🔹 수정할 시간표 목록을 보여주고 선택하도록 추가 -->
  <label>수정할 시간표 선택:
    <select @change="selectTimetable($event.target.value)">
      <option v-for="course in timetable" :key="course.id" :value="course.id">
        {{ course.subject_name }} ({{ course.day }} {{ course.lecture_period }}교시)
      </option>
    </select>
  </label>

  <label>과목 선택:
    <select v-model="form.subject_id">
      <option v-if="subjects.length === 0" disabled>과목을 불러오는 중...</option>
      <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.name }}
      </option>
    </select>
  </label>
  <label>교수명:
    <input type="text" v-model="form.professor" />
  </label>
  <label>강의실:
    <input type="text" v-model="form.classroom" />
  </label>
  <label>요일:
    <select v-model="form.day" @change="logDayChange">
      <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
    </select>
  </label>
  <label>학년:
    <select v-model="form.period">
      <option v-for="n in 3" :key="n" :value="n">{{ n }}학년</option>
    </select>
  </label>
  <label>교시:
    <select v-model="form.lecture_period">
      <option v-for="n in 8" :key="n" :value="n">{{ n }}교시</option>
    </select>
  </label>
  <label>강의 기간:
    <input type="date" v-model="form.start_date" />
    ~
    <input type="date" v-model="form.end_date" />
  </label>
</div>

<!-- 🎯 시간표 삭제 모달 -->
<div v-if="modalType === 'delete'">

  <!-- 삭제할 시간표 선택 -->
  <label>삭제할 시간표 선택:
    <select @change="selectTimetable($event.target.value)">
      <option v-for="course in timetable" :key="course.id" :value="course.id">
        {{ course.subject_name }} ({{ course.day }} {{ course.lecture_period }}교시)
      </option>
    </select>
  </label>

  <button @click="submitForm">삭제</button>
  <button @click="closeModal">닫기</button>
</div>


<!-- 🎯 휴강 등록 -->
<div v-if="modalType === 'holiday'">
  <h3>휴강 등록</h3>
  
  <label>휴강 날짜:
    <input type="date" v-model="form.holiday_date" @change="filterSubjectsForHoliday" />
  </label>
  
  <label>과목 선택:
    <select v-model="form.subject_id">
      <option v-if="filteredSubjects.length === 0" disabled>휴강할 수업 없음</option>
      <option v-for="subject in filteredSubjects" :key="subject.id" :value="subject.subject_id">
        {{ subject.subject_name }} ({{ subject.day }} {{ subject.lecture_period }}교시)
      </option>
    </select>
  </label>
</div>


          <button @click="submitForm">확인</button>
          <button @click="closeModal">닫기</button>
        </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import { startOfWeek, endOfWeek, format } from "date-fns";

export default {
data() {
  return {
    selectedTimetable: null, // ✅ 현재 선택된 시간표 저장
    selectedDate: new Date().toISOString().slice(0, 10), // ✅ 기본적으로 오늘 날짜
    selectedWeekStart: "", // ✅ 해당 주의 월요일
    selectedWeekEnd: "", // ✅ 해당 주의 금요일
    selectedGrade: 1, // ✅ 기본 학년 설정
    isProfessorOrAdmin: false,
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    periods: [1, 2, 3, 4, 5, 6, 7, 8],
    timetable: [],
    holidays: [],
    subjects: [],
    filteredSubjects: [],

      // ✅ Modal 관련 데이터
      modalOpen: false,
      modalType: "",
      modalTitle: "",
      form: {
        subject_id: "",
        professor: "",
        classroom: "",
        day: "",
        period: 1,
        lecture_period: 1,
        start_date: "",
        end_date: "",
        holiday_date: ""
      }
  };
},
async created() {
    this.userRole = localStorage.getItem("role");
    if (this.userRole === "professor" || this.userRole === "admin") {
        this.isProfessorOrAdmin = true;
    }
    await this.fetchTimetableForWeek(); // ✅ 시간표 불러온 후
    this.fetchSubjects(); // ✅ 학년 정보가 설정된 이후 과목 불러오기
},
computed: {
  filteredSubjects() {
    if (!this.form.holiday_date) return [];  // 날짜 선택이 안 되어 있으면 빈 배열 반환

    const selectedDay = this.getDayOfWeek(this.form.holiday_date);
    console.log(`📌 선택한 날짜: ${this.form.holiday_date}, 변환된 요일: ${selectedDay}`);

    return this.timetable.filter(subject => {
        const isCorrectDay = subject.day === selectedDay;

        console.log(`📌 원본 start_date:`, subject.start_date, `| end_date:`, subject.end_date);

        // ✅ 문자열을 Date 객체로 변환하여 비교 (ISO 형식으로 변환)
        const startDate = new Date(subject.start_date + "T00:00:00");
        const endDate = new Date(subject.end_date + "T00:00:00");
        const holidayDate = new Date(this.form.holiday_date + "T00:00:00");

        console.log(`📌 변환된 start_date:`, startDate, `| 변환된 end_date:`, endDate);
        console.log(`📌 비교: ${holidayDate} >= ${startDate} && ${holidayDate} <= ${endDate}`);

        const isWithinDateRange = holidayDate >= startDate && holidayDate <= endDate;
        return isCorrectDay && isWithinDateRange;
    });
}

},
methods: {
  getLecturePeriod(subject_id) {
    const selectedCourse = this.timetable.find(t => t.subject_id === subject_id);
    return selectedCourse ? selectedCourse.lecture_period : null;
    },
    getDayOfWeek(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date(date).getDay()];  // ✅ 로컬 시간 기준으로 변경
},

    /** ✅ 선택된 시간표를 수정 모달에 전달 */
    prepareEdit() {
    // 선택된 학년(1학년 등)의 데이터만 필터링
    const filteredTimetable = this.timetable.filter(t => t.period === this.selectedGrade);

    if (filteredTimetable.length === 0) {
      alert("수정할 시간표가 없습니다. 먼저 추가해주세요.");
      return;
    }
    

    // 모달 열기 + 학년별 데이터 표시
    this.modalType = "edit";
    this.modalTitle = "시간표 수정";
    this.modalOpen = true;
    this.editableTimetable = filteredTimetable; // ✅ 모달에 표시할 데이터 저장
  },
    /** ✅ 삭제할 시간표 선택 모달 열기 */
    prepareDelete() {
    const filteredTimetable = this.timetable.filter(t => t.period === this.selectedGrade);

    if (filteredTimetable.length === 0) {
      alert("삭제할 시간표가 없습니다. 먼저 추가해주세요.");
      return;
    }

    this.modalType = "delete";
    this.modalTitle = "시간표 삭제";
    this.modalOpen = true;
    this.editableTimetable = filteredTimetable; // ✅ 삭제할 수 있는 시간표 목록 저장
  },

  /** ✅ 사용자가 선택한 시간표 데이터를 form에 자동 입력 */
  selectTimetable(selectedId) {
    console.log("📌 선택된 ID:", selectedId);
    console.log("📌 현재 timetable 데이터:", this.timetable);

    const selectedCourse = this.timetable.find(course => course.id == selectedId);
    
    if (!selectedCourse) { // ✅ selectedCourse가 undefined이면 예외 처리
      console.error("❌ 선택한 ID에 해당하는 시간표가 없습니다.", selectedId);
      alert("선택한 시간표 데이터를 찾을 수 없습니다.");
      return;
    }

    this.form = {
      id: selectedCourse.id,  // ✅ ID 설정
      subject_id: selectedCourse.subject_id,
      professor: selectedCourse.professor,
      classroom: selectedCourse.classroom,
      day: selectedCourse.day,
      period: selectedCourse.period,
      lecture_period: selectedCourse.lecture_period,
      start_date: selectedCourse.start_date,
      end_date: selectedCourse.end_date
    };

    console.log("✅ 선택된 시간표:", this.form);
  },

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

      console.log("📌 시간표 데이터:", this.timetable);
      console.log("📌 휴강 데이터:", this.holidays);

    } catch (error) {
      console.error("❌ 주간 시간표 데이터를 가져오는 중 오류 발생:", error);
      this.timetable = [];
    }
  },
    /** ✅ 과목 목록 가져오기 */
    async fetchSubjects() {
    try {
      const res = await axios.get(`http://localhost:5000/api/subjects/${this.selectedGrade}`);
      this.subjects = res.data || [];
      console.log("📌 과목 목록 로드 완료:", this.subjects);
    } catch (error) {
      console.error("❌ 과목 목록 가져오는 중 오류 발생:", error);
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
    holiday.day === day &&
    holiday.lecture_period === period &&
    holiday.holiday_date >= this.selectedWeekStart &&  // ✅ 강의 기간 고려
    holiday.holiday_date <= this.selectedWeekEnd
  );
},



    /** ✅ Modal 열기 */
    openModal(type, course = null) {
    this.modalType = type;
    this.modalOpen = true;

    if (type === "add") {
        this.modalTitle = "시간표 추가";
        this.form = {  
            id: null,
            subject_id: "",
            professor: "",
            classroom: "",
            day: "Monday",
            period: this.selectedGrade,
            lecture_period: 1,
            start_date: "",
            end_date: ""
        };
    } else if (type === "edit" && course) { 
        this.modalTitle = "시간표 수정";
        this.form = { 
            id: course.id,
            subject_id: course.subject_id,
            professor: course.professor,
            classroom: course.classroom,
            day: course.day,
            period: course.period,
            lecture_period: course.lecture_period,
            start_date: course.start_date,
            end_date: course.end_date
        };
    } else if (type === "delete" && course) {
        this.modalTitle = "시간표 삭제";
        this.form = { id: course.id };
    } else if (type === "holiday") {
        this.modalTitle = "휴강 등록";
        this.form = { holiday_date: "", subject_id: "" };
    } 
  },

    /** ✅ Modal 닫기 */
    closeModal() {
      this.modalOpen = false;
    },

/** ✅ 시간표 추가 / 수정 / 삭제 */
async submitForm() {
    let apiUrl = "";
    let payload = {};
    let method = "POST";  // 기본값: 새로운 시간표 추가

    if (this.modalType === "holiday") {
        apiUrl = "http://localhost:5000/api/holidays"; // ✅ 엔드포인트 수정
        payload = {
            holiday_date: this.form.holiday_date,
            subject_id: this.form.subject_id,
            day: this.getDayOfWeek(this.form.holiday_date),
            lecture_period: this.getLecturePeriod(this.form.subject_id),
            period: this.selectedGrade // ✅ 학년 정보 추가
        };

        console.log("✅ 휴강 등록 데이터:", payload); // 디버깅 로그 추가
    }
    try {
        await axios({ method, url: apiUrl, data: payload });
        alert("저장되었습니다.");
        this.fetchTimetableForWeek(); // ✅ 저장 후 시간표 다시 불러오기
        this.closeModal();
    } catch (error) {
        console.error("❌ 데이터 저장 중 오류 발생:", error);
        alert("저장에 실패했습니다.");
    }

    if (this.modalType === "add") {
        apiUrl = "http://localhost:5000/api/timetable";
        payload = {
            subject_id: this.form.subject_id,
            professor: this.form.professor,
            classroom: this.form.classroom,
            day: this.form.day,
            period: this.form.period,
            lecture_period: this.form.lecture_period,
            start_date: this.form.start_date, // ✅ 올바르게 전달되는지 확인
            end_date: this.form.end_date // ✅ 올바르게 전달되는지 확인
        };
    } 
    else if (this.modalType === "edit") { // ✅ 기존의 잘못된 조건 수정
      if (!this.form.id) {  // ✅ ID가 없는 경우 예외 처리
            console.error("❌ 수정할 시간표 ID가 없습니다.");
            alert("수정할 시간표를 선택하세요!");
            return;
        }
        apiUrl = `http://localhost:5000/api/timetable/${this.form.id}`; // ✅ ID 포함
        method = "PUT";  // ✅ 수정은 PUT 요청 사용
        payload = {
            subject_id: this.form.subject_id,
            professor: this.form.professor,
            classroom: this.form.classroom,
            day: this.form.day,
            lecture_period: this.form.lecture_period,
            start_date: this.form.start_date,
            end_date: this.form.end_date
        };
    } 
    else if (this.modalType === "delete") { // ✅ 삭제 요청 개선
        if (!this.form.id) {
            console.error("❌ 삭제할 시간표 ID가 없습니다.");
            return;
        }
        apiUrl = `http://localhost:5000/api/timetable/${this.form.id}`;
        
        try {
            await axios.delete(apiUrl); // ✅ 삭제는 DELETE 요청 사용
            alert("삭제되었습니다.");
            this.fetchTimetableForWeek(); // ✅ 삭제 후 시간표 다시 불러오기
            this.closeModal();
        } catch (error) {
            console.error("❌ 삭제 중 오류 발생:", error);
            alert("삭제에 실패했습니다.");
        }
        return; // ✅ DELETE 요청 후 함수 종료
    }

    try {
        await axios({ method, url: apiUrl, data: payload });
        alert("저장되었습니다.");
        this.fetchTimetableForWeek(); // ✅ 저장 후 시간표 다시 불러오기
        this.closeModal();
    } catch (error) {
        console.error("❌ 데이터 저장 중 오류 발생:", error);
        alert("저장에 실패했습니다.");
    }
},
logDayChange() {
    console.log("📌 변경된 요일 값:", this.form.day);
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
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
button {
  margin: 5px;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background-color: lightgray;
}
button:hover {
  background-color: #4CAF50;
  color: white;
}
</style>