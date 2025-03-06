<template>
    <div>
      <h2>📅 시간표</h2>
      <br /><br /><br /><br />
  
      <!-- 🎯 교수님 & 관리자만 "시간표 추가" & "수정" 버튼 보이게 설정 -->
      <div v-if="isProfessorOrAdmin">
        <button @click="openAddTimetableModal">➕ 시간표 추가</button>
        <button @click="openEditTimetableModal">✏️ 시간표 수정</button>
      </div>
  
      <!-- 🎯 교수님 & 관리자는 학년 선택 가능 -->
      <div v-if="isProfessorOrAdmin">
        <button @click="fetchTimetable(1)" :class="{ active: selectedGrade === 1 }">1학년</button>
        <button @click="fetchTimetable(2)" :class="{ active: selectedGrade === 2 }">2학년</button>
        <button @click="fetchTimetable(3)" :class="{ active: selectedGrade === 3 }">3학년</button>
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
            <td>{{ period }}교시</td>
            <td v-for="day in days" :key="day">
              <div v-if="getCourse(day, period)">
                <strong>{{ getCourse(day, period).subject_name }}</strong>
                <br />({{ getCourse(day, period).professor }})
                <br />{{ getCourse(day, period).classroom }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- 🎯 새로운 시간표 추가 모달 -->
      <div v-if="isAdding" class="modal">
        <div class="modal-content">
          <h3>📌 새로운 시간표 추가</h3>
          <label>과목:
            <select v-model="newEntry.subject_id">
              <option v-for="subject in subjectsList" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
              <option value="special">특강</option>
            </select>
          </label>

          <!-- 🎯 특강 선택 시 직접 입력 가능 -->
          <label v-if="newEntry.subject_id === 'special'">특강명:
          <input v-model="newEntry.subject_name" type="text" placeholder="특강명을 입력하세요"/>
          </label>

          <label>교수:
            <input v-model="newEntry.professor" type="text" />
          </label>
          <label>강의실:
            <input v-model="newEntry.classroom" type="text" />
          </label>
          <label>요일:
            <select v-model="newEntry.day">
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </select>
          </label>
          <label>교시:
            <select v-model="newEntry.period">
              <option v-for="period in periods" :key="period" :value="period">{{ period }}교시</option>
            </select>
          </label>
          <button @click="addTimetableEntry">저장</button>
          <button @click="isAdding = false">취소</button>
        </div>
      </div>
  
      <!-- 🎯 시간표 수정 모달 -->
      <div v-if="isEditing" class="modal">
        <div class="modal-content">
          <h3>📌 수정할 시간표 선택</h3>
          <label>수정할 시간표:
            <select v-model="selectedTimetableId" @change="loadTimetableForEdit">
              <option v-for="entry in timetable" :key="entry.id" :value="entry.id">
                {{ entry.subject_name }} ({{ entry.day }} - {{ entry.period }}교시)
              </option>
            </select>
          </label>
          <br /><br />
          <h3>📌 시간표 수정</h3>
          <label>과목:
            <select v-model="editEntry.subject_id">
              <option v-for="subject in subjectsList" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
          </label>
          <label>교수:
            <input v-model="editEntry.professor" type="text" />
          </label>
          <label>강의실:
            <input v-model="editEntry.classroom" type="text" />
          </label>
          <button @click="saveTimetableEntry">저장</button>
          <button @click="isEditing = false">취소</button>
          <!-- 🔥 삭제 버튼 추가 -->
          <button class="delete-btn" @click="deleteTimetableEntry(editEntry.id)">삭제</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        userRole: "",
        isProfessorOrAdmin: false,
        selectedGrade: 1,
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        periods: [1, 2, 3, 4, 5, 6, 7, 8],
        timetable: [],
        isEditing: false,
        isAdding: false,
        selectedTimetableId: null,
        newEntry: { subject_id: "", professor: "", classroom: "", day: "Monday", period: 1 },
        editEntry: { id: null, subject_id: "", professor: "", classroom: "", day: "", period: "" },
        subjectsList: [],
      };
    },
    async created() {
      this.userRole = localStorage.getItem("role");
      if (this.userRole === "professor" || this.userRole === "admin") {
        this.isProfessorOrAdmin = true;
        await this.fetchTimetable(1);
      }
    },
    methods: {
      async fetchTimetable(grade) {
        this.selectedGrade = grade;
        try {
          const res = await axios.get(`http://localhost:5000/api/timetable/${grade}`);
          this.timetable = res.data;
        } catch (error) {
          console.error("시간표 데이터를 가져오는 중 오류 발생:", error);
        }
      },
      async fetchSubjects(grade) {
        try {
          const res = await axios.get(`http://localhost:5000/api/subjects/${grade}`);
          this.subjectsList = res.data;
        } catch (error) {
          console.error("❌ 과목 목록 조회 오류:", error);
        }
      },
      getCourse(day, period) {
        return this.timetable.find((t) => t.day === day && t.period === period);
      },
      async openAddTimetableModal() {
        this.isAdding = true;
        this.isEditing = false;
        await this.fetchSubjects(this.selectedGrade);
      },
      async addTimetableEntry() {
        try {
          await axios.post("http://localhost:5000/api/timetable", this.newEntry);
          this.isAdding = false;
          await this.fetchTimetable(this.selectedGrade);
        } catch (error) {
          console.error("❌ 시간표 추가 중 오류 발생:", error);
        }
      },
      async openEditTimetableModal() {
        this.isEditing = true;
        this.isAdding = false;
        await this.fetchSubjects(this.selectedGrade);
      },
      loadTimetableForEdit() {
        this.editEntry = { ...this.timetable.find((entry) => entry.id === this.selectedTimetableId) };
      },
      async saveTimetableEntry() {
        try {
          await axios.put(`http://localhost:5000/api/timetable/${this.editEntry.id}`, this.editEntry);
          this.isEditing = false;
          await this.fetchTimetable(this.selectedGrade);
        } catch (error) {
          console.error("❌ 시간표 수정 중 오류 발생:", error);
        }
      },
      async deleteTimetableEntry(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return; // 확인창 추가

    try {
      await axios.delete(`http://localhost:5000/api/timetable/${id}`);
      console.log(`✅ 시간표 삭제 완료 (ID: ${id})`);
      this.isEditing = false; // 모달 닫기
      await this.fetchTimetable(this.selectedGrade); // 삭제 후 시간표 갱신
    } catch (error) {
      console.error("❌ 시간표 삭제 중 오류 발생:", error);
    }
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
}
.modal-content input, .modal-content select {
  width: 100%;
  margin-bottom: 10px;
}
  </style>
  