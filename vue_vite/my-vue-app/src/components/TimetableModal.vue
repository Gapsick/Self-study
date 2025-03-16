<template>
    <div class="modal-overlay">
      <div class="modal">
        <h3>시간표 편집</h3>
        <form @submit.prevent="save">
          <!-- ✅ 과목 선택 (name 기반) -->
          <label>과목명:
            <select v-model="form.subject_name">
              <option disabled value="">과목 선택</option>
              <option v-for="s in subjects" :key="s.id" :value="s.name">
                {{ s.name }}
              </option>
            </select>
          </label><br />
  
          <label>교수명: <input v-model="form.professor" /></label><br />
          <label>강의실: <input v-model="form.classroom" /></label><br />
  
          <label>상태:
            <select v-model="form.status">
              <option>수업 있음</option>
              <option>휴강</option>
            </select>
          </label><br />
  
          <label v-if="form.status === '휴강'">
            휴강일: <input type="date" v-model="form.holiday_date" />
            </label>

            <label v-else>
            시작일: <input type="date" v-model="form.start_date" />
            <br>
            종료일: <input type="date" v-model="form.end_date" />
            </label>

          <div class="actions">
            <button type="submit">저장</button>
            <button type="button" @click="emit('close')">취소</button>
            <button v-if="form.id" type="button" @click="remove">삭제</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import axios from 'axios'
  import { useSubjects } from '@/composables/useSubjects'
  
  const props = defineProps({
    editData: Object,
    grade: Number,
    date: String
  })
  
  const emit = defineEmits(['close', 'saved'])
  
  const form = reactive({
    subject_name: '',
    professor: '',
    classroom: '',
    status: '수업 있음',
    start_date: '',
    end_date: '',
    holiday_date: '',
    ...props.editData // 기존 데이터 덮어쓰기
  })
  
  function formatDateLocal(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) {
      console.warn("⛔ 잘못된 날짜 포맷:", dateStr)
      return ''
    }
    return d.toISOString().split('T')[0]
  }

  function getDateOfDayInSameWeek(baseDateStr, dayName) {
  const base = new Date(baseDateStr)
  const baseDay = base.getDay()

  const days = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6
  }

  const targetDay = days[dayName]
  const diff = targetDay - baseDay

  const result = new Date(base)
  result.setDate(base.getDate() + diff)

  return result.toISOString().split('T')[0]
}
  const oldStatus = ref('');

  onMounted(() => {
    console.log("📅 props.date 확인:", props.date)
  
    // 날짜 정제
    form.start_date = formatDateLocal(props.editData?.start_date)
    form.end_date = formatDateLocal(props.editData?.end_date)

    // 정확하게 휴강일을 계산해서 form에 세팅
    form.holiday_date = getDateOfDayInSameWeek(props.date, form.day)

    console.log("🎯 세팅된 holiday_date:", form.holiday_date)

    oldStatus.value = form.status

  })
  
  // 학년별 과목 로딩
  const selectedYear = ref(props.grade)
  const { subjects } = useSubjects(selectedYear)
  
  const save = async () => {
    const subject = subjects.value.find(s => s.name === form.subject_name)
    if (!subject) {
      alert('유효한 과목을 선택해주세요.')
      return
    }
  
    try {
      if (form.status === '휴강') {
        await axios.post('http://localhost:5000/api/holidays', {
          holiday_date: form.holiday_date,
          subject_id: subject.id,
          day: form.day,
          lecture_period: form.lecture_period,
          period: props.grade,
        })
        alert("✅ 휴강이 등록되었습니다.")
      } else {
        const payload = {
          ...form,
          subject_id: subject.id,
          period: props.grade
        }
  
        if (form.id) {
          await axios.put(`http://localhost:5000/api/timetable/${form.id}`, payload)
        } else {
          await axios.post(`http://localhost:5000/api/timetable`, payload)
        }
        alert("✅ 시간표가 저장되었습니다.")
      }
  
      emit('saved')
      emit('close')
    } catch (err) {
      alert("❌ 저장에 실패했습니다.")
      console.error(err)
    }
  }
  
  const remove = async () => {
    try {
      if (form.status === '휴강') {
        const subject = subjects.value.find(s => s.name === form.subject_name)
        await axios.delete(`http://localhost:5000/api/holidays`, {
          data: {
            subject_id: subject.id,
            holiday_date: form.holiday_date,
            day: form.day,
            lecture_period: form.lecture_period,
            period: props.grade
          }
        })
        alert("🗑 휴강 삭제 완료")
      } else {
        await axios.delete(`http://localhost:5000/api/timetable/${form.id}`)
        alert("🗑 시간표 삭제 완료")
      }
      emit('saved')
      emit('close')
    } catch (err) {
      alert("❌ 삭제 실패")
      console.error(err)
    }
  }
  </script>
  
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 320px;
  }
  
  .actions {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
  }
  </style>