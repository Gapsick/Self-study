<template>
  <div class="container">
    <h2>📅 시간표 관리</h2>

    <!-- 시간표 목록 -->
    <table>
      <thead>
        <tr>
          <th>학년</th>
          <th>요일</th>
          <th>과목</th>
          <th>교시</th>
          <th>교수명</th>
          <th>강의실</th>
          <th>시작일</th>
          <th>종료일</th>
          <th>수정 / 삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in flatTimetables" :key="item.id">
          <td>{{ item.year === '0' ? '특강' : item.year + '학년' }}</td>
          <td>{{ dayToKorean[item.day] }}</td>
          <td>{{ item.subject_name }}</td>
          <td>{{ item.start_period }}교시 ~ {{ item.end_period }}교시</td>
          <td>{{ item.professor }}</td>
          <td>{{ item.classroom }}</td>
          <td>{{ formatDateLocal(item.start_date) }}</td>
          <td>{{ formatDateLocal(item.end_date) }}</td>
          <td class="action-buttons">
            <button @click="startEdit(item)">수정</button>
            <button @click="deleteTimetable(item.id)">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 추가/수정 폼 -->
    <div class="form-wrapper">
      <h3>{{ isEditMode ? '시간표 수정' : '시간표 추가' }}</h3>
      <form class="form-vertical" @submit.prevent="isEditMode ? updateTimetable() : addTimetable()">
        <div class="form-field">
          <label>학년</label>
          <select v-model="selectedGrade" @change="filterSubjects">
            <option value="">학년 선택</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="0">특강</option>
          </select>
        </div>
        <div class="form-field">
          <label>과목</label>
          <select v-model.number="formData.subject_id">
            <option v-for="s in filteredSubjects" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div class="form-field">
          <label>요일</label>
          <select v-model="formData.day">
            <option v-for="(kor, eng) in dayToKorean" :key="eng" :value="eng">{{ kor }}</option>
          </select>
        </div>
        <div class="form-field"><label>시작 교시</label><input type="number" v-model.number="formData.start_period" /></div>
        <div class="form-field"><label>종료 교시</label><input type="number" v-model.number="formData.end_period" /></div>
        <div class="form-field"><label>교수명</label><input type="text" v-model="formData.professor" /></div>
        <div class="form-field"><label>강의실</label><input type="text" v-model="formData.classroom" /></div>
        <div class="form-field"><label>시작일</label><input type="date" v-model="formData.start_date" /></div>
        <div class="form-field"><label>종료일</label><input type="date" v-model="formData.end_date" /></div>

        <div class="button-group">
          <button type="submit">{{ isEditMode ? '수정 저장' : '등록' }}</button>
          <button v-if="isEditMode" type="button" class="danger" @click="cancelEdit">취소</button>
        </div>
      </form>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const subjects = ref([])
const timetables = ref([])
const errorMessage = ref('')

const selectedGrade = ref('')
const isEditMode = ref(false)
const editId = ref(null)

const formData = ref({
  subject_id: null,
  day: '',
  start_period: null,
  end_period: null,
  professor: '',
  classroom: '',
  start_date: '',
  end_date: ''
})

const dayToKorean = {
  Monday: '월요일',
  Tuesday: '화요일',
  Wednesday: '수요일',
  Thursday: '목요일',
  Friday: '금요일',
}


const filteredSubjects = computed(() => {
  return subjects.value.filter(s => String(s.academic_year) === selectedGrade.value)
})

function formatDateLocal(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

function resetForm() {
  formData.value = {
    subject_id: null,
    day: '',
    start_period: null,
    end_period: null,
    professor: '',
    classroom: '',
    start_date: '',
    end_date: ''
  }
  selectedGrade.value = ''
}

function filterSubjects() {
  formData.value.subject_id = null
}

async function fetchSubjects() {
  const res = await axios.get('http://localhost:5000/api/admin/subjects')
  subjects.value = res.data
}

async function fetchTimetables() {
  try {
    const res = await axios.get('http://localhost:5000/api/timetable')
    timetables.value = res.data
  } catch (err) {
    console.error(err)
    errorMessage.value = '시간표 목록 불러오기 실패.'
  }
}

async function addTimetable() {
  try {
    await axios.post('http://localhost:5000/api/timetable', formData.value)
    alert('시간표 추가 완료')
    resetForm()
    fetchTimetables()
  } catch (err) {
    console.error(err)
    errorMessage.value = '시간표 추가 실패'
  }
}

function startEdit(item) {
  isEditMode.value = true
  editId.value = item.id
  selectedGrade.value = String(subjects.value.find(s => s.id === item.subject_id)?.academic_year ?? '')
  formData.value = { ...item }
}

async function updateTimetable() {
  try {
    await axios.put(`http://localhost:5000/api/timetable/${editId.value}`, formData.value)
    alert('수정 완료')
    cancelEdit()
    fetchTimetables()
  } catch (err) {
    console.error(err)
    errorMessage.value = '수정 실패'
  }
}

function cancelEdit() {
  isEditMode.value = false
  editId.value = null
  resetForm()
}

async function deleteTimetable(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await axios.delete(`http://localhost:5000/api/timetable/${id}`)
    alert('삭제 완료')
    fetchTimetables()
  } catch (err) {
    console.error(err)
    errorMessage.value = '삭제 실패'
  }
}

const flatTimetables = computed(() => {
  const result = []
  timetables.value.forEach(t => {
    const subject = subjects.value.find(s => s.id === t.subject_id)
    if (!subject) return
    result.push({
      ...t,
      subject_name: subject.name,
      year: String(subject.academic_year || '0')
    })
  })

  const yearOrder = ['1', '2', '3', '0']
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  return result.sort((a, b) => {
    const yComp = yearOrder.indexOf(a.year) - yearOrder.indexOf(b.year)
    if (yComp !== 0) return yComp
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  })
})

onMounted(() => {
  fetchSubjects()
  fetchTimetables()
})
</script>

<style scoped>
.container {
  padding: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  max-width: 1000px;
  margin: 0 auto;
}

h2, h3 {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 20px 0 14px;
}

.form-wrapper {
  max-width: 600px;
  margin: 0 auto;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.form-vertical {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #374151;
}

input[type="text"],
input[type="number"],
input[type="date"],
select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 13px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 6px;
  transition: background-color 0.2s;
}

button:hover {
  opacity: 0.9;
}

button:not(.danger) {
  background-color: #3b82f6;
  color: white;
}

button.danger {
  background-color: #ef4444;
  color: white;
}

.button-group {
  margin-top: 12px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.error-message {
  color: #ef4444;
  font-weight: 500;
  font-size: 14px;
  margin-top: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  border-radius: 8px;
  overflow: hidden;
}

th, td {
  padding: 10px 12px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
}

td.action-buttons {
  display: flex;
  justify-content: center;
  gap: 6px;
}
</style>
