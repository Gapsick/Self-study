<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>시간표 추가</h3>
      <form @submit.prevent="save">
        <!-- 카테고리 선택 -->
        <label>카테고리
          <select v-model="form.category">
            <option value="정규">정규</option>
            <option value="특강">특강</option>
          </select>
        </label>

        <!-- 요일 선택 -->
        <label>요일:
          <select v-model="selectedDay" required>
            <option disabled value="">요일 선택</option>
            <option v-for="(eng, kor) in dayMap" :key="kor" :value="kor">
              {{ kor }}
            </option>
          </select>
        </label>

        <!-- 과목 선택 -->
        <label>과목명
          <select v-model="form.subject_name" required>
            <option disabled value="">과목 선택</option>
            <option v-for="s in filteredSubjects" :key="s.id" :value="s.name">
              {{ s.name }}
            </option>
          </select>
        </label>

        <label>교수명 <input v-model="form.professor" required /></label>
        <label>강의실 <input v-model="form.classroom" /></label>

        <label>시작 교시 <input type="number" min="1" max="10" v-model.number="form.start_period" required /></label>
        <label>종료 교시 <input type="number" min="1" max="10" v-model.number="form.end_period" required /></label>

        <label>시작일 <input type="date" v-model="form.start_date" required /></label>
        <label>종료일 <input type="date" v-model="form.end_date" required /></label>

        <div class="actions">
          <button type="submit">저장</button>
          <button type="button" @click="emit('close')">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useSubjects } from '@/composables/useSubjects'

const props = defineProps({
  editData: Object,
  grade: Number,
  date: String
})

const emit = defineEmits(['close', 'saved'])

// ✅ 요일 매핑
const dayMap = {
  '월요일': 'Monday',
  '화요일': 'Tuesday',
  '수요일': 'Wednesday',
  '목요일': 'Thursday',
  '금요일': 'Friday'
}

const reverseDayMap = Object.fromEntries(Object.entries(dayMap).map(([k, v]) => [v, k]))

const selectedDay = ref('')

const user = JSON.parse(localStorage.getItem('user') || '{}')

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// 기본 form
const form = reactive({
  category: '정규',
  subject_name: '',
  professor: '',
  classroom: '',
  start_period: 1,
  end_period: 1,
  start_date: '',
  end_date: '',
  day: '',
  ...props.editData
})

// 모든 과목 불러오기
const selectedYear = ref(props.grade)
const { subjects } = useSubjects(selectedYear)

// 필터링된 과목 목록
const filteredSubjects = computed(() => {
  if (form.category === '정규') {
    return subjects.value.filter(s => s.category === '정규' && s.academic_year === props.grade)
  } else {
    return subjects.value.filter(s => 
      s.category === '특강' &&
      (user.role === 'admin' || user.role === 'professor' || s.name.includes(user.specialLecture))
    )
  }
})

// 날짜 포맷팅
function formatDateLocal(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return isNaN(d) ? '' : d.toISOString().split('T')[0]
}

onMounted(() => {
  form.start_date = formatDateLocal(props.editData?.start_date)
  form.end_date = formatDateLocal(props.editData?.end_date)
  selectedDay.value = reverseDayMap[props.editData?.day] || ''
})

// 저장
const save = async () => {
  const subject = subjects.value.find(s => s.name === form.subject_name)
  if (!subject) return alert("유효한 과목을 선택해주세요.")

  const payload = {
    ...form,
    subject_id: subject.id,
    day: dayMap[selectedDay.value],  // ✅ 영어로 변환
    period: props.grade
  }

  try {
    if (form.id) {
      await axios.put(`http://localhost:5000/api/timetable/${form.id}`, payload)
    } else {
      await axios.post(`http://localhost:5000/api/timetable`, payload)
    }
    alert("✅ 시간표 저장 완료")
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    alert("❌ 저장 실패")
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 360px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
}

input, select {
  width: 100%;
  margin-top: 4px;
  padding: 6px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

button {
  background: #2563eb;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
}
button:hover {
  background: #1d4ed8;
}
</style>
