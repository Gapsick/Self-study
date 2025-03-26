<template>
  <div class="container">
    <br><br><br><br>
    <h2>{{ selectedDate }} 기준 {{ grade }}학년 시간표</h2>

    <div class="controls">
    <input type="date" v-model="selectedDate" @change="onDateChange" />
    <div class="grade-buttons">
      <button @click="changeGrade(1)">1학년</button>
      <button @click="changeGrade(2)">2학년</button>
      <button @click="changeGrade(3)">3학년</button>
    </div>
    </div>


    <table class="timetable">
      <thead>
        <tr>
          <th>교시</th>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="period in periods" :key="period">
          <td>{{ period }}교시</td>
          <td v-for="day in days" :key="day + '-' + period" @click="openModal(day, period)">
            <template v-if="getClassesByDayPeriod(day, period).length">
              <div v-for="cls in getClassesByDayPeriod(day, period)" :key="cls.id">
                <span
                  v-if="cls.status === '휴강'"
                  class="badge badge-cancel"
                >🛑 휴강</span>
                <span
                  v-else
                  class="badge badge-normal"
                >수업 있음</span>

                <strong>{{ cls.subject_name }}</strong><br />
                <small>{{ cls.professor }}</small><br />
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <TimetableModal
    v-if="showModal"
    :editData="selectedClass"
    :grade="grade"
    :date="selectedDate"
    @close="closeModal"
    @saved="onSaved"
  />
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useTimetable } from '@/composables/useTimetable'
import TimetableModal from '@/components/TimetableModal.vue'

const { timetable, selectedDate, grade, fetchWeekTimetable } = useTimetable()

const today = new Date().toISOString().split("T")[0]
const showModal = ref(false)
const selectedClass = ref(null)

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function getClassesByDayPeriod(day, lecturePeriod) {
  const classes = timetable.value[day]
  if (!classes) return []

  return classes.filter(cls => Number(cls.lecture_period) === Number(lecturePeriod))
}

function onDateChange() {
  fetchWeekTimetable(selectedDate.value)
}

function changeGrade(newGrade) {
  grade.value = newGrade
  fetchWeekTimetable(selectedDate.value)
}

function openModal(day, period) {
  const user = JSON.parse(localStorage.getItem('user'))
  
  if (!user || (user.role !== 'admin' && user.role !== 'professor')) {
    // 학생이거나, 로그인 정보 없으면 모달 열지 않음
    return
  }
  const classes = getClassesByDayPeriod(day, period)  // ✅ 수정!
  selectedClass.value = classes.length > 0 ? classes[0] : {
    day,
    lecture_period: period,
    subject_name: '',
    professor: '',
    classroom: '',
    status: '수업 있음',
    start_date: selectedDate.value,
    end_date: selectedDate.value,
    period: grade.value  // 학년 정보
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function onSaved() {
  fetchWeekTimetable(selectedDate.value) // 다시 시간표 로딩
  showModal.value = false
}


onMounted(() => {
  selectedDate.value = today
  fetchWeekTimetable(today)
})
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: 'Noto Sans KR', sans-serif;
}

/* 제목 스타일 */
h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #1f2937;
}

/* 버튼 */
.grade-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.grade-buttons button {
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  color: #374151;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
}
.grade-buttons button:hover {
  background-color: #e5e7eb;
}

/* 테이블 */
table.timetable {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-radius: 8px;
  overflow: hidden;
}

/* 헤더 */
th {
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
  padding: 10px;
  border: 1px solid #e5e7eb;
}

/* 셀 */
td {
  height: 95px; /* 고정 높이 */
  padding: 0;
  text-align: center;
  border: 1px solid #e5e7eb;
  vertical-align: middle;
  position: relative;
}

/* 수업 카드 */
td > div {
  margin: auto;
  padding: 5px 12px 10px 12px;
  font-size: 13px;
  line-height: 1.5;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  width: 82%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  text-align: left;
  position: relative;
  height: 80%;
}

/* 과목명 */
td > div strong {
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 2px;
  display: block;
}

/* 교수명 */
td > div small {
  font-size: 12px;
  color: #e0f2fe;
}

/* 상태 표시 */
.badge {
  position: absolute;
  top: 7px;
  right: 8px;
  font-size: 11.5px;
  padding: 3px 7px;
  border-radius: 12px;
  font-weight: 600;
}


.badge-cancel {
  background-color: #fee2e2;
  color: #b91c1c;
}

.badge-normal {
  background-color: #dbeafe;
  color: #1e40af;
}


.text-red {
  color: #fecaca;
}

/* 다중 수업 색상 다르게 */
td > div:nth-child(1) { background-color: #3b82f6; }
td > div:nth-child(2) { background-color: #10b981; }
td > div:nth-child(3) { background-color: #f59e0b; }
td > div:nth-child(4) { background-color: #ef4444; }
td > div:nth-child(5) { background-color: #8b5cf6; }

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.controls input[type="date"] {
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}



</style>
