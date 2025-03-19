<template>
    <div style="padding: 16px;">
      <h2>과목 관리</h2>
  
      <!-- 1) 과목 목록 테이블 -->
      <table v-if="subjects.length > 0" border="1" cellpadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>과목명</th>
            <th>학년</th>
            <th>수정 / 삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subject in subjects" :key="subject.id">
            <td>{{ subject.id }}</td>
            <td>{{ subject.name }}</td>
            <td>{{ subject.academic_year }}</td>
            <td>
              <button @click="editSubject(subject)">수정</button>
              <button @click="deleteSubject(subject.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>등록된 과목이 없습니다.</p>
  
      <hr />
  
      <!-- 2) 신규 과목 추가 폼 -->
      <h3>과목 추가</h3>
      <div>
        <label>과목명:
          <input v-model="newName" placeholder="예) 컴퓨터 개론" />
        </label>
  
        <label>학년:
          <select v-model.number="newAcademicYear">
            <option :value="1">1학년</option>
            <option :value="2">2학년</option>
            <option :value="3">3학년</option>
          </select>
        </label>
  
        <button @click="addSubject">등록</button>
      </div>
  
      <hr />
  
      <!-- 3) 과목 수정 폼 (선택된 과목) -->
      <div v-if="editMode">
        <h3>과목 수정</h3>
        <div>
          <label>ID: {{ editForm.id }}</label><br />
          <label>과목명:
            <input v-model="editForm.name" />
          </label>
          <br />
          <label>학년:
            <select v-model.number="editForm.academic_year">
              <option :value="1">1학년</option>
              <option :value="2">2학년</option>
              <option :value="3">3학년</option>
            </select>
          </label>
        </div>
        <button @click="updateSubject">수정 저장</button>
        <button @click="cancelEdit">취소</button>
      </div>
  
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  // 1) 과목 목록 배열
  const subjects = ref([])
  
  // 2) 오류 메시지
  const errorMessage = ref('')
  
  // 3) 신규 과목 입력 상태
  const newName = ref('')
  const newAcademicYear = ref(1)
  
  // 4) 수정 모드 여부 & 폼
  const editMode = ref(false)
  const editForm = ref({
    id: null,
    name: '',
    academic_year: 1
  })
  
  // ✅ (A) 과목 목록 불러오기
  async function fetchSubjects() {
    errorMessage.value = ''
    try {
      const res = await axios.get('http://localhost:5000/api/admin/subjects')
      subjects.value = res.data || []
    } catch (err) {
      console.error(err)
      errorMessage.value = '과목 목록을 불러오지 못했습니다.'
    }
  }
  
  // ✅ (B) 신규 과목 추가
  async function addSubject() {
    if (!newName.value) {
      alert('과목명을 입력하세요.')
      return
    }
    try {
      await axios.post('http://localhost:5000/api/admin/subjects', {
        name: newName.value,
        academic_year: newAcademicYear.value
      })
      alert('과목이 등록되었습니다.')
      newName.value = ''
      newAcademicYear.value = 1
  
      fetchSubjects() // 목록 갱신
    } catch (err) {
      console.error(err)
      errorMessage.value = '과목 등록에 실패했습니다.'
    }
  }
  
  // ✅ (C) 과목 삭제
  async function deleteSubject(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await axios.delete(`http://localhost:5000/api/admin/subjects/${id}`)
      alert('삭제 완료')
      fetchSubjects()
    } catch (err) {
      console.error(err)
      errorMessage.value = '삭제에 실패했습니다.'
    }
  }
  
  // ✅ (D) 수정 폼 열기
  function editSubject(subject) {
    editMode.value = true
    editForm.value = { ...subject } // 기존 값 복사
  }
  
  // ✅ (E) 수정 취소
  function cancelEdit() {
    editMode.value = false
    editForm.value = { id: null, name: '', academic_year: 1 }
  }
  
  // ✅ (F) 수정 반영
  async function updateSubject() {
    if (!editForm.value.name) {
      alert('과목명을 입력하세요.')
      return
    }
    try {
      await axios.put(`http://localhost:5000/api/admin/subjects/${editForm.value.id}`, {
        name: editForm.value.name,
        academic_year: editForm.value.academic_year
      })
      alert('수정 완료')
      editMode.value = false
      fetchSubjects()
    } catch (err) {
      console.error(err)
      errorMessage.value = '수정에 실패했습니다.'
    }
  }
  
  // ✅ 페이지 로드시 목록 먼저 불러오기
  onMounted(fetchSubjects)
  </script>
  
  <style scoped>
  table {
    margin-bottom: 10px;
  }
  </style>
  