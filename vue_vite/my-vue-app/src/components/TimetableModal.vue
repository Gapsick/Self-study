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
            <option value="한국어">한국어</option>
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

        <!-- 특강 또는 한국어인 경우 반 선택 -->
        <div v-if="form.category === '특강'">
          <label>반 (A/B/전체)
            <select v-model="form.class_group" required>
              <option value="A">A반</option>
              <option value="B">B반</option>
              <option value="전체">전체</option>
            </select>
          </label>
        </div>

        <label>교수명 <input v-model="form.professor" required /></label>
        <label>강의실 <input v-model="form.classroom" /></label>

        <label>시작 교시 <input type="number" min="1" max="10" v-model.number="form.start_period" required /></label>
        <label>종료 교시 <input type="number" min="1" max="10" v-model.number="form.end_period" required /></label>

        <label>시작일 <input type="date" v-model="form.start_date" required /></label>
        <label>종료일 <input type="date" v-model="form.end_date" required /></label>

        <!-- 휴강 설정 -->
        <div v-if="form.id">
          <label>휴강 설정</label>
          <div class="switch-row">
            <input type="checkbox" id="toggleSwitch" class="switch-input" v-model="isAbsent" />
            <label for="toggleSwitch" class="switch"></label>
            <span class="label-text">{{ isAbsent ? '❌ 휴강' : '✅ 수업 있음' }}</span>
          </div>
        </div>

        <!-- 저장/취소 -->
        <div class="actions">
          <button type="submit">저장</button>
          <button type="button" class="cancel" @click="emit('close')">취소</button>
        </div>

        <div class="delete-wrapper" v-if="form.id">
          <button type="button" class="delete" @click="remove">🗑 삭제</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { useSubjects } from '@/composables/useSubjects'

const props = defineProps({
  editData: Object,
  grade: Number,
  date: String
})
const emit = defineEmits(['close', 'saved'])

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

const form = reactive({})
Object.assign(form, {
  category: '정규',
  subject_name: '',
  professor: '',
  classroom: '',
  start_period: 1,
  end_period: 1,
  start_date: '',
  end_date: '',
  day: '',
  status: '수업 있음',
  class_group: null  // ✅ null로 설정
}, props.editData || {})  // ✅ 수정 시 값 반영


const selectedYear = computed(() => {
  if (form.category === '정규') return props.grade
  if (form.category === '한국어') return 'KOR'  // <- 한국어는 academic_year = NULL 처리
  return null  // 특강 등은 전체 받아오기
})

const { subjects } = useSubjects(selectedYear)


// 👉 수정된 필터
const filteredSubjects = computed(() => {
  if (form.category === '정규') {
    return subjects.value.filter(s => s.category === '정규' && s.academic_year === props.grade)
  } else if (form.category === '특강') {
    return subjects.value.filter(s => s.category === '특강')
  } else if (form.category === '한국어') {
    return subjects.value.filter(s => s.academic_year === null && s.category === '한국어') // ✅ 이 줄 중요!
  } else {
    return []
  }
})


const isAbsent = ref(false)
watch(isAbsent, val => {
  form.status = val ? '휴강' : '수업 있음'
})

// 날짜 초기화
onMounted(() => {
  form.start_date = formatDateLocal(props.editData?.start_date)
  form.end_date = formatDateLocal(props.editData?.end_date)
  selectedDay.value = reverseDayMap[props.editData?.day] || ''
  isAbsent.value = form.status === '휴강'
  console.log('🧪 props.editData:', props.editData)
  console.log('🧪 최종 form:', form)
})

function formatDateLocal(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return isNaN(d) ? '' : d.toISOString().split('T')[0]
}

async function save() {
  const subject = subjects.value.find(s => s.name === form.subject_name)
  if (!subject) return alert('유효한 과목을 선택해주세요.')

  const payload = {
    subject_id: subject.id,
    professor: form.professor,
    classroom: form.classroom,
    day: dayMap[selectedDay.value],
    start_period: form.start_period,
    end_period: form.end_period,
    start_date: form.start_date,
    end_date: form.end_date,
    status: isAbsent.value ? '휴강' : '수업 있음',
    period: subject.academic_year ?? props.grade,  // academic_year 우선 사용
    level: subject.level || null,
    class_group: form.class_group || null,
    category: subject.category || '정규'
  }

  console.log("🚀 저장 전 payload:", payload)

  try {
    if (form.id) {
      await axios.put(`http://localhost:5000/api/timetable/${form.id}`, payload)
    } else {
      await axios.post(`http://localhost:5000/api/timetable`, payload)
    }
    alert('✅ 시간표 저장 완료')
    emit('saved')
    emit('close')
  } catch (err) {
    console.error("❌ 저장 실패:", err)
    alert('❌ 저장 실패')
  }
}


async function remove() {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await axios.delete(`http://localhost:5000/api/timetable/${form.id}`)
    alert('🗑 삭제 완료')
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    alert('❌ 삭제 실패')
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

.absence-toggle {
  margin-top: 12px;
  margin-bottom: 8px;
  text-align: left;
}
.absence-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 14px;
}

/* Switch 스타일 */
.switch-input {
  display: none;
}
.switch {
  position: relative;
  width: 40px;
  height: 22px;
  background-color: #d1d5db;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.switch-row {
  display: flex;
  align-items: center; /* 이미 있을 것 */
  gap: 12px;
  margin-bottom: 14px;
}

.label-text {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  line-height: 1;
  position: relative;
  top: -5px;  /* ❗살짝 위로 올려줌 */
}

.switch::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}
.switch-input:checked + .switch {
  background-color: #2563eb;
}
.switch-input:checked + .switch::before {
  transform: translateX(18px);
}

.label-text {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.actions {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.actions button {
  flex: 1;
  padding: 8px 12px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
}
button.cancel {
  background-color: #e5e7eb;
  color: #374151;
}
button.cancel:hover {
  background-color: #d1d5db;
}
button {
  background-color: #2563eb;
  color: white;
}
button:hover {
  background-color: #1d4ed8;
}

.delete-wrapper {
  margin-top: 14px;
  text-align: center;
}
.delete-wrapper .delete {
  background-color: #ef4444;
  color: white;
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  width: 100%;
  font-weight: 500;
}
.delete-wrapper .delete:hover {
  background-color: #dc2626;
}
</style>
