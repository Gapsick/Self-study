<template>
    <div style="padding: 16px;">
      <h2>📅 시간표 관리</h2>
  
      <!-- 시간표 목록 테이블 -->
      <table v-if="timetables.length > 0" border="1" cellpadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>subject_id</th>
            <th>day</th>
            <th>period</th>
            <th>professor</th>
            <th>classroom</th>
            <th>start_date</th>
            <th>end_date</th>
            <th>lecture_period</th>
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
            <td>
              <button @click="editTimetable(item)">수정</button>
              <button @click="deleteTimetable(item.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>등록된 시간표가 없습니다.</p>
  
      <!-- 신규 시간표 추가 -->
      <h3>시간표 추가</h3>
      <div>
        <label>과목ID: <input v-model.number="newTimetable.subject_id" /></label><br/>
        <label>요일(day): <input v-model="newTimetable.day" /></label><br/>
        <label>교시(period): <input v-model.number="newTimetable.period" /></label><br/>
        <label>교수명(professor): <input v-model="newTimetable.professor" /></label><br/>
        <label>강의실(classroom): <input v-model="newTimetable.classroom" /></label><br/>
        <label>start_date: <input type="date" v-model="newTimetable.start_date" /></label><br/>
        <label>end_date: <input type="date" v-model="newTimetable.end_date" /></label><br/>
        <label>lecture_period: <input v-model.number="newTimetable.lecture_period" /></label><br/>
        <button @click="addTimetable">등록</button>
      </div>
  
      <!-- 수정 폼 -->
      <div v-if="editMode">
        <h3>시간표 수정</h3>
        <div>
          <label>ID: {{ editForm.id }}</label><br/>
          <label>과목ID: <input v-model.number="editForm.subject_id" /></label><br/>
          <label>요일(day): <input v-model="editForm.day" /></label><br/>
          <label>교시(period): <input v-model.number="editForm.period" /></label><br/>
          <label>교수명: <input v-model="editForm.professor" /></label><br/>
          <label>강의실: <input v-model="editForm.classroom" /></label><br/>
          <label>start_date: <input type="date" v-model="editForm.start_date" /></label><br/>
          <label>end_date: <input type="date" v-model="editForm.end_date" /></label><br/>
          <label>lecture_period: <input v-model.number="editForm.lecture_period" /></label><br/>
        </div>
        <button @click="updateTimetable">수정 저장</button>
        <button @click="cancelEdit">취소</button>
      </div>
  
      <hr />
  
      <h2>🎉 휴강 관리</h2>
      <table v-if="holidays.length > 0" border="1" cellpadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>holiday_date</th>
            <th>subject_id</th>
            <th>day</th>
            <th>lecture_period</th>
            <th>period</th>
            <th>수정 / 삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="h in holidays" :key="h.id">
            <td>{{ h.id }}</td>
            <td>{{ formatDateLocal(h.holiday_date) }}</td>
            <td>{{ h.subject_id }}</td>
            <td>{{ h.day }}</td>
            <td>{{ h.lecture_period }}</td>
            <td>{{ h.period }}</td>
            <td>
              <button @click="editHoliday(h)">수정</button>
              <button @click="deleteHoliday(h.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>등록된 휴강이 없습니다.</p>
  
      <!-- 신규 휴강 등록 -->
      <h3>휴강 추가</h3>
      <div>
        <label>holiday_date: <input type="date" v-model="newHoliday.holiday_date" /></label><br/>
        <label>subject_id: <input v-model.number="newHoliday.subject_id" /></label><br/>
        <label>day: <input v-model="newHoliday.day" /></label><br/>
        <label>lecture_period: <input v-model.number="newHoliday.lecture_period" /></label><br/>
        <label>period: <input v-model.number="newHoliday.period" /></label><br/>
        <button @click="addHoliday">휴강 등록</button>
      </div>
  
      <!-- 휴강 수정 폼 -->
      <div v-if="editHolidayMode">
        <h3>휴강 수정</h3>
        <div>
          <label>ID: {{ editHolidayForm.id }}</label><br/>
          <label>holiday_date: <input type="date" v-model="editHolidayForm.holiday_date" /></label><br/>
          <label>subject_id: <input v-model.number="editHolidayForm.subject_id" /></label><br/>
          <label>day: <input v-model="editHolidayForm.day" /></label><br/>
          <label>lecture_period: <input v-model.number="editHolidayForm.lecture_period" /></label><br/>
          <label>period: <input v-model.number="editHolidayForm.period" /></label><br/>
        </div>
        <button @click="updateHoliday">휴강 수정 저장</button>
        <button @click="cancelHolidayEdit">취소</button>
      </div>
  
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
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
  