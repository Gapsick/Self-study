<template>
  <br><br><br><br><br>

  <div>
    <h2>{{ selectedDate }} 기준 {{ grade }}학년 시간표</h2>

    <input type="date" v-model="selectedDate" @change="onDateChange" />
    <br><br>

    <div class="grade-buttons">
      <button @click="changeGrade(1)">1학년</button>
      <button @click="changeGrade(2)">2학년</button>
      <button @click="changeGrade(3)">3학년</button>
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
              <div
                v-for="cls in getClassesByDayPeriod(day, period)"
                :key="cls.id"
              >
                <strong>{{ cls.subject_name }}</strong><br />
                <small>{{ cls.professor }}</small><br />
                <em v-if="cls.status === '휴강'" class="text-red">(휴강)</em>
                <em v-else>({{ cls.status || '수업 있음' }})</em>

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
.grade-buttons {
  margin-bottom: 15px;
}
button {
  margin-right: 10px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 6px;
}
button:hover {
  background-color: #f1f1f1;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}
</style>
