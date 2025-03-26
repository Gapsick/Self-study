<template>
  <div class="container">
    <h2>📅 시간표 관리</h2>

    <!-- 시간표 목록 테이블 -->
    <table v-if="timetables.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>과목 ID</th>
          <th>요일</th>
          <th>교시</th>
          <th>교수명</th>
          <th>강의실</th>
          <th>시작일</th>
          <th>종료일</th>
          <th>강의 기간</th>
          <th>수정 / 삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in timetables" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.subject_id }}</td>
          <td>{{ item.day }}</td>
          <td>{{ item.period }}</td>
          <td>{{ item.professor }}</td>
          <td>{{ item.classroom }}</td>
          <td>{{ formatDateLocal(item.start_date) }}</td>
          <td>{{ formatDateLocal(item.end_date) }}</td>
          <td>{{ item.lecture_period }}</td>
          <td class="action-buttons">
            <button @click="editTimetable(item)">수정</button>
            <button @click="deleteTimetable(item.id)">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>등록된 시간표가 없습니다.</p>

    <hr />

    <!-- 신규 시간표 추가 폼 -->
    <h3>시간표 추가</h3>
    <div class="form-group">
      <label>과목 ID:
        <input v-model.number="newTimetable.subject_id" type="number" />
      </label>
      <label>요일:
        <input v-model="newTimetable.day" type="text" />
      </label>
      <label>교시:
        <input v-model.number="newTimetable.period" type="number" />
      </label>
      <label>교수명:
        <input v-model="newTimetable.professor" type="text" />
      </label>
      <label>강의실:
        <input v-model="newTimetable.classroom" type="text" />
      </label>
      <label>시작일:
        <input v-model="newTimetable.start_date" type="date" />
      </label>
      <label>종료일:
        <input v-model="newTimetable.end_date" type="date" />
      </label>
      <label>강의 기간:
        <input v-model.number="newTimetable.lecture_period" type="number" />
      </label>
      <div class="button-group">
        <button @click="addTimetable">등록</button>
      </div>
    </div>

    <hr />

    <!-- 시간표 수정 폼 -->
    <div v-if="editMode">
      <h3>시간표 수정</h3>
      <div class="form-group">
        <label>ID: {{ editForm.id }}</label>
        <label>과목 ID:
          <input v-model.number="editForm.subject_id" type="number" />
        </label>
        <label>요일:
          <input v-model="editForm.day" type="text" />
        </label>
        <label>교시:
          <input v-model.number="editForm.period" type="number" />
        </label>
        <label>교수명:
          <input v-model="editForm.professor" type="text" />
        </label>
        <label>강의실:
          <input v-model="editForm.classroom" type="text" />
        </label>
        <label>시작일:
          <input v-model="editForm.start_date" type="date" />
        </label>
        <label>종료일:
          <input v-model="editForm.end_date" type="date" />
        </label>
        <label>강의 기간:
          <input v-model.number="editForm.lecture_period" type="number" />
        </label>
        <div class="button-group">
          <button @click="updateTimetable">수정 저장</button>
          <button @click="cancelEdit" class="danger">취소</button>
        </div>
      </div>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const timetables = ref([])
  const holidays = ref([])
  const errorMessage = ref('')
  
  // 신규 시간표
  const newTimetable = ref({
    subject_id: null,
    day: '',
    period: null,
    professor: '',
    classroom: '',
    start_date: '',
    end_date: '',
    lecture_period: null
  })
  
  // 수정 모드
  const editMode = ref(false)
  const editForm = ref({
    id: null,
    subject_id: null,
    day: '',
    period: null,
    professor: '',
    classroom: '',
    start_date: '',
    end_date: '',
    lecture_period: null
  })
  
  // 신규 휴강
  const newHoliday = ref({
    holiday_date: '',
    subject_id: null,
    day: '',
    lecture_period: null,
    period: null
  })
  
  // 휴강 수정 모드
  const editHolidayMode = ref(false)
  const editHolidayForm = ref({
    id: null,
    holiday_date: '',
    subject_id: null,
    day: '',
    lecture_period: null,
    period: null
  })
  
  // 예: ManageTimetable.vue (script setup)
function formatDateLocal(dateStr) {
  if (!dateStr) return ''
  // 원하는 형식으로 변환
  // 예) 'YYYY-MM-DD' 형태:
  return new Date(dateStr).toISOString().split('T')[0]
}
  // 1) 시간표 목록 불러오기
  async function fetchTimetables() {
    try {
      const res = await axios.get('http://localhost:5000/api/timetable')
      timetables.value = res.data
    } catch (err) {
      console.error(err)
      errorMessage.value = '시간표 목록 불러오기 실패.'
    }
  }
  
  // 2) 신규 시간표 추가
  async function addTimetable() {
    try {
      await axios.post('http://localhost:5000/api/timetable', newTimetable.value)
      alert('시간표 추가 완료')
      resetNewTimetable()
      fetchTimetables()
    } catch (err) {
      console.error(err)
      errorMessage.value = '시간표 추가 실패'
    }
  }
  function resetNewTimetable() {
    newTimetable.value = {
      subject_id: null,
      day: '',
      period: null,
      professor: '',
      classroom: '',
      start_date: '',
      end_date: '',
      lecture_period: null
    }
  }
  
  // 3) 수정 폼 열기
  function editTimetable(item) {
    editMode.value = true
    editForm.value = { ...item }
  }
  function cancelEdit() {
    editMode.value = false
    editForm.value = {
      id: null,
      subject_id: null,
      day: '',
      period: null,
      professor: '',
      classroom: '',
      start_date: '',
      end_date: '',
      lecture_period: null
    }
  }
  
  // 4) 시간표 수정 저장
  async function updateTimetable() {
    try {
      await axios.put(`http://localhost:5000/api/timetable/${editForm.value.id}`, {
        subject_id: editForm.value.subject_id,
        day: editForm.value.day,
        period: editForm.value.period,
        professor: editForm.value.professor,
        classroom: editForm.value.classroom,
        start_date: editForm.value.start_date,
        end_date: editForm.value.end_date,
        lecture_period: editForm.value.lecture_period
      })
      alert('시간표 수정 완료')
      editMode.value = false
      fetchTimetables()
    } catch (err) {
      console.error(err)
      errorMessage.value = '시간표 수정 실패'
    }
  }
  
  // 5) 시간표 삭제
  async function deleteTimetable(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await axios.delete(`http://localhost:5000/api/timetable/${id}`)
      alert('삭제 완료')
      fetchTimetables()
    } catch (err) {
      console.error(err)
      errorMessage.value = '시간표 삭제 실패'
    }
  }
  
  // ============ 휴강 부분 ============ //
  
  // 1) 휴강 목록
  async function fetchHolidays() {
    try {
      const res = await axios.get('http://localhost:5000/api/holidays')
      holidays.value = res.data
    } catch (err) {
      console.error(err)
      errorMessage.value = '휴강 목록 불러오기 실패.'
    }
  }
  
  // 2) 휴강 추가
  async function addHoliday() {
    try {
      await axios.post('http://localhost:5000/api/holidays', newHoliday.value)
      alert('휴강 등록 완료')
      resetNewHoliday()
      fetchHolidays()
    } catch (err) {
      console.error(err)
      errorMessage.value = '휴강 등록 실패'
    }
  }
  function resetNewHoliday() {
    newHoliday.value = {
      holiday_date: '',
      subject_id: null,
      day: '',
      lecture_period: null,
      period: null
    }
  }
  
  // 3) 휴강 수정
  function editHoliday(h) {
    editHolidayMode.value = true
    editHolidayForm.value = { ...h }
  }
  function cancelHolidayEdit() {
    editHolidayMode.value = false
    editHolidayForm.value = {
      id: null,
      holiday_date: '',
      subject_id: null,
      day: '',
      lecture_period: null,
      period: null
    }
  }
  
  // 4) 휴강 수정 저장
  async function updateHoliday() {
    try {
      await axios.put(`http://localhost:5000/api/holidays/${editHolidayForm.value.id}`, {
        holiday_date: editHolidayForm.value.holiday_date,
        subject_id: editHolidayForm.value.subject_id,
        day: editHolidayForm.value.day,
        lecture_period: editHolidayForm.value.lecture_period,
        period: editHolidayForm.value.period
      })
      alert('휴강 수정 완료')
      editHolidayMode.value = false
      fetchHolidays()
    } catch (err) {
      console.error(err)
      errorMessage.value = '휴강 수정 실패'
    }
  }
  
  // 5) 휴강 삭제
  async function deleteHoliday(id) {
    if(!confirm('정말 삭제하시겠습니까?')) return
    try {
      await axios.delete(`http://localhost:5000/api/holidays/${id}`)
      alert('삭제 완료')
      fetchHolidays()
    } catch (err) {
      console.error(err)
      errorMessage.value = '휴강 삭제 실패'
    }
  }
  
  // 컴포넌트 마운트 시점에 시간표 & 휴강 목록 동시 로드
  onMounted(() => {
    fetchTimetables()
    fetchHolidays()
  })
  </script>
  
<style scoped>
.container {
  padding: 16px;
  font-family: 'Noto Sans KR', sans-serif;
}

h2, h3 {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 20px 0 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
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

/* 🔹 공통 입력 폼 스타일 */
.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: center;
  margin-bottom: 20px;
}

.form-group label {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #374151;
  min-width: 140px;
}

input[type="text"],
input[type="number"],
input[type="date"],
select {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 13px;
}

/* 🔹 버튼 공통 스타일 */
button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
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

/* 🔹 수정/삭제 버튼 우측 정렬 */
td.action-buttons {
  display: flex;
  justify-content: center;
  gap: 6px;
}

/* 🔹 구분선 */
hr {
  border-top: 1px solid #ddd;
  margin: 30px 0;
}

/* 🔹 에러 메시지 */
.error-message {
  color: #ef4444;
  font-weight: 500;
  font-size: 14px;
}


</style>