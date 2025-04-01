<template>
  <div class="container">
    <br><br><br><br>
    <h2>{{ selectedDate }} 기준 {{ grade }}학년 시간표</h2>

    <!-- 수업 추가 버튼 -->
    <div class="add-class-button" v-if="isAdminOrProfessor">
      <button @click="openEmptyModal">+ 수업 추가</button>
    </div>

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
          <td
            v-for="day in days"
            :key="day + '-' + period"
            @mousedown="startDrag(day, period)"
            @mouseenter="dragOver(day, period)"
            @mouseup="endDrag"
            @click="onEmptyCellClick(day, period)"
            :class="{
              highlighted: selectedRange.some(r => r.day === day && r.period === period),
              hoverable: getClassesForMergedCell(day, period).length === 0
            }"
          >
            <div
              v-for="cls in getClassesForMergedCell(day, period)"
              :key="cls.id"
              class="merged-class"
              :style="{
                height: `calc(${cls.end_period - cls.start_period + 1} * 90px - ${(cls.end_period - cls.start_period) * 3 + 11}px)`
              }"
              @click="openModal(day, period, cls)"
            >
              <!-- 정규 수업 카드 -->
              <template v-if="cls.category === '정규'">
                <span v-if="cls.status === '휴강'" class="badge badge-cancel">🛑 휴강</span>
                <span v-else class="badge badge-normal">수업 있음</span>
                <strong>{{ cls.subject_name }}</strong><br />
                <small>{{ cls.professor }}</small>
              </template>

              <!-- 특강 요약 카드 -->
              <template v-else-if="cls.category === '특강' && cls._summary">
                <div
                  class="badge badge-special-summary"
                  @mouseenter="showTooltip = cls.id"
                  @mouseleave="showTooltip = null"
                >
                  🔶 특강 ({{ cls._count }})

                  <!-- 팝오버 -->
                  <div
                    v-if="showTooltip === cls.id"
                    class="popover"
                  >
                    <div v-for="item in cls._originals" :key="item.id" class="popover-item">
                      <strong>{{ item.subject_name }}</strong><br />
                      <small>{{ item.professor }}</small>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <TimetableModal
      v-if="showModal"
      :editData="selectedClass"
      :grade="grade"
      :date="selectedDate"
      @close="closeModal"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTimetable } from '@/composables/useTimetable'
import TimetableModal from '@/components/TimetableModal.vue'

const { timetable, selectedDate, grade, fetchWeekTimetable } = useTimetable()

const user = JSON.parse(localStorage.getItem('user') || '{}')
const isAdminOrProfessor = user.role === 'admin' || user.role === 'professor'

const today = new Date().toISOString().split("T")[0]
const showModal = ref(false)
const selectedClass = ref(null)

const showTooltip = ref(null)

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function getClassesForMergedCell(day, period) {
  const classes = timetable.value[day] || []

  // ✅ 현재 교시에 포함된 수업들 추출 (start ~ end 사이)
  const active = classes.filter(cls =>
    cls.start_period <= period && cls.end_period >= period
  )

  // ✅ 시작 교시에만 카드 생성
  const startOnly = active.filter(cls => cls.start_period === period)

  // ✅ 특강 요약 카드 처리 (동일 교시에 특강 여러 개 있을 경우)
  const specials = startOnly.filter(c => c.category === '특강')
  const regulars = startOnly.filter(c => c.category !== '특강')

  if (specials.length > 1) {
  const tooltip = specials.map(c => `${c.subject_name} - ${c.professor}`).join('\n')
  regulars.push({
    id: 'special-summary-' + day + '-' + period,
    category: '특강',
    _summary: true,
    _tooltip: tooltip,
    _count: specials.length,
    _originals: specials, // ✅ 빠져있던 핵심
    start_period: period,
    end_period: period
  })
}
 else {
    regulars.push(...specials)
  }

  return regulars
}

function onDateChange() {
  fetchWeekTimetable(selectedDate.value)
}

function changeGrade(newGrade) {
  grade.value = newGrade
  fetchWeekTimetable(selectedDate.value)
}

// 드레그 함수
const dragStart = ref(null)
const dragEnd = ref(null)

function startDrag(day, period) {
  if (!isAdminOrProfessor) return
  dragStart.value = { day, period }
  dragEnd.value = null

  // 전역 mouseup 리스너 등록
  window.addEventListener('mouseup', handleGlobalMouseUp)
}

function handleGlobalMouseUp() {
  endDrag()
  window.removeEventListener('mouseup', handleGlobalMouseUp)
}

function dragOver(day, period) {
  if (!dragStart.value) return
  if (day === dragStart.value.day) {
    dragEnd.value = { day, period }
  }
}

function endDrag() {
  if (!dragStart.value || !dragEnd.value) {
    dragStart.value = null
    dragEnd.value = null
    return
  }

  const start = Math.min(dragStart.value.period, dragEnd.value.period)
  const end = Math.max(dragStart.value.period, dragEnd.value.period)
  const day = dragStart.value.day

  const existing = getClassesForMergedCell(day, start).length > 0
  if (existing) {
    dragStart.value = null
    dragEnd.value = null
    return
  }

  selectedClass.value = {
    day,
    start_period: start,
    end_period: end,
    subject_name: '',
    professor: '',
    classroom: '',
    status: '수업 있음',
    start_date: selectedDate.value,
    end_date: selectedDate.value,
    period: grade.value
  }

  showModal.value = true
  dragStart.value = null
  dragEnd.value = null
}

// 클릭 함수
function onEmptyCellClick(day, period) {
  if (!isAdminOrProfessor) return

  // 이미 수업 있는 셀은 무시
  const existing = getClassesForMergedCell(day, period).length > 0
  if (existing) return

  selectedClass.value = {
    day,
    start_period: period,
    end_period: period,
    subject_name: '',
    professor: '',
    classroom: '',
    status: '수업 있음',
    start_date: selectedDate.value,
    end_date: selectedDate.value,
    period: grade.value
  }

  showModal.value = true
}



const selectedRange = computed(() => {
  if (!dragStart.value || !dragEnd.value) return []

  const startPeriod = Math.min(dragStart.value.period, dragEnd.value.period)
  const endPeriod = Math.max(dragStart.value.period, dragEnd.value.period)

  // ✅ 같은 요일에서만 작동하게 제한
  if (dragStart.value.day !== dragEnd.value.day) return []

  return Array.from({ length: endPeriod - startPeriod + 1 }, (_, i) => ({
    day: dragStart.value.day,
    period: startPeriod + i
  }))
})



function openEmptyModal() {
  if (!isAdminOrProfessor) return
  selectedClass.value = {
    day: 'Monday',
    start_period: 1,
    end_period: 1,
    subject_name: '',
    professor: '',
    classroom: '',
    status: '수업 있음',
    start_date: selectedDate.value,
    end_date: selectedDate.value,
    period: grade.value
  }
  showModal.value = true
}

function openModal(day, period, cls) {
  if (!isAdminOrProfessor) return
  if (cls._summary) return  // 특강 요약카드는 클릭 안되게 처리

  selectedClass.value = cls || {
    day,
    start_period: period,
    end_period: period,
    subject_name: '',
    professor: '',
    classroom: '',
    status: '수업 있음',
    start_date: selectedDate.value,
    end_date: selectedDate.value,
    period: grade.value
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function onSaved() {
  fetchWeekTimetable(selectedDate.value)
  showModal.value = false
}

onMounted(() => {
  selectedDate.value = today
  fetchWeekTimetable(today)
})
</script>

<style scoped>
/* 기존 스타일 유지하면서 특강 요약 추가 */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: 'Noto Sans KR', sans-serif;
}
h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #1f2937;
}
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
.add-class-button {
  margin-bottom: 16px;
}
.add-class-button button {
  background-color: #1d4ed8;
  color: white;
  border: none;
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}
.add-class-button button:hover {
  background-color: #2563eb;
}

.highlighted {
  background-color: #dbeafe !important; /* 연한 파란색 */
}

.timetable {
  user-select: none; /* 드래그 시 텍스트 선택 방지 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-radius: 8px;
  overflow: hidden;
}
th {
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
  padding: 10px;
  border: 1px solid #e5e7eb;
}
td {
  position: relative;
  height: 90px;
  padding: 0;
  text-align: center;
  border: 1px solid #e5e7eb;
  vertical-align: top;
}
.merged-class {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  padding: 26px 12px 16px 12px;
  font-size: 10px;
  line-height: 1.0;
  background-color: #3b82f6;
  color: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  text-align: left;
  z-index: 1;
  box-sizing: border-box;
}
.merged-class strong {
  font-size: 13.5px;
  font-weight: 700;
  margin-top: 8px;
  margin-bottom: 2px;
  display: block;
}
.merged-class small {
  font-size: 12px;
  color: #e0f2fe;
}
.badge {
  position: absolute;
  top: 6px;
  left: 10px;
  font-size: 11.5px;
  padding: 3px 7px;
  border-radius: 999px;
  font-weight: 600;
  z-index: 3;
}
.badge-cancel {
  background-color: #fee2e2;
  color: #b91c1c;
}
.badge-normal {
  background-color: #dbeafe;
  color: #1e40af;
}
.badge-special-summary {
  background-color: #f97316;
  color: white;
  font-weight: 700;
  text-align: center;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 13px;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  cursor: default;
}

.popover {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #111;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 10px 12px;
  z-index: 10;
  white-space: nowrap;
  width: max-content;
  min-width: 120px;
}

.popover-item {
  font-size: 13px;
  margin-bottom: 6px;
}

.popover-item small {
  font-size: 12px;
  color: #374151; /* or #6b7280 */
  font-weight: 400;
}

.popover-item:last-child {
  margin-bottom: 0;
}

.hoverable:hover {
  background-color: #eff6ff; /* 연한 하늘색 */
  cursor: pointer;
}


</style>
