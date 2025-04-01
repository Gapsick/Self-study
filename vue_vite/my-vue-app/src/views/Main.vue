<template>
  <div id="main-page" class="main-wrapper">
    <!-- 공지사항 -->
    <div class="section-box notice-container">
      <div class="schedule-list">
        <h2>공지사항</h2>
        <ul>
          <li
            v-for="notice in notices"
            :key="notice.id"
            :class="{ active: selectedNotice && selectedNotice.id === notice.id }"
            @click="selectNotice(notice)"
          >
            {{ notice.title }}
          </li>
        </ul>
      </div>
      <transition name="slide-fade" mode="out-in">
        <div class="schedule-detail" v-if="selectedNotice" :key="selectedNotice.id">
          <h3>{{ selectedNotice.title }}</h3>
          <p>{{ selectedNotice.content }}</p>
          <p class="date">{{ selectedNotice.date }}</p>
        </div>
      </transition>
    </div>

    <!-- 일정 -->
    <div class="section-box schedule-container">
      <div class="schedule-list">
        <h2>오늘의 일정</h2>
        <ul>
          <li v-if="todayEvents.length === 0">오늘은 일정이 없습니다.</li>
          <li
            v-for="(event, index) in todayEvents"
            :key="event.id"
            :class="{ active: selectedEventIndex === index }"
            @click="selectEvent(index)"
          >
            {{ event.title }}
          </li>
        </ul>
      </div>
      <transition name="slide-fade" mode="out-in">
        <div class="schedule-detail" v-if="todayEvents[selectedEventIndex]" :key="todayEvents[selectedEventIndex]?.id">
          <h3>{{ todayEvents[selectedEventIndex].title }}</h3>
          <p><strong>시간:</strong> {{ todayEvents[selectedEventIndex].time }}</p>
          <p><strong>설명:</strong> {{ todayEvents[selectedEventIndex].description }}</p>
        </div>
      </transition>
    </div>

    <!-- 시간표 -->
    <div class="section-box timetable-container">
      <div class="schedule-list">
        <h2>오늘 수업</h2>
        <ul>
          <li v-if="todayTimetable.length === 0">오늘 수업이 없습니다.</li>
          <li v-for="(item, index) in todayTimetable" :key="index">
            {{ item.period }}교시 - {{ item.subject }}
          </li>
        </ul>
      </div>

      <div class="timetable-display">
        <h3>주간 시간표</h3>
        <table class="mini-timetable">
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
              >
                <div
                  v-for="cls in getClassesByDayPeriod(day, period)"
                  :key="cls.id"
                  :class="[
                    'mini-class-box',
                    cls.status === '휴강' ? 'cancelled' : 'active',
                    userRole !== 'student' ? `grade-${cls.grade}` : ''  // 관리자/교수일 경우 학년색
                  ]"
                >
                  <!-- (예: ({{ cls.grade }}학년) 같이 표시 가능) -->
                  <strong>{{ cls.subject_name }}</strong>
                  <small>{{ cls.professor }}</small>
                  <span v-if="cls.status === '휴강'" class="cancel-text">🛑 휴강</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNoticeStore } from '@/stores/useNoticeStore'
import { useTimetable } from '@/composables/useTimetable'
import axios from 'axios'

// 사용자 정보
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userRole = user.role
const userGrade = parseInt(user.grade)

// 공지사항
const noticeStore = useNoticeStore()
const notices = ref([])
const selectedNotice = ref(null)
function selectNotice(notice) {
  selectedNotice.value = notice
}

// 일정 (Google Calendar)
const calendarId = 'c_30f3f7b040f8956812ff3902e0725752aa5b4ab176a7fd02f4d8327f0ee4179d@group.calendar.google.com'
const accessToken = localStorage.getItem('googleAccessToken')
const events = ref([])
const selectedEventIndex = ref(0)

function selectEvent(index) {
  selectedEventIndex.value = index
}
const todayEvents = computed(() => events.value)

async function fetchGoogleCalendarEvents(today) {
  if (!accessToken) return
  const timeMin = `${today}T00:00:00Z`
  const timeMax = `${today}T23:59:59Z`

  try {
    const res = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    events.value = res.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      time: event.start.dateTime || event.start.date,
      description: event.description || '설명 없음'
    }))
  } catch (err) {
    console.error('📅 일정 로딩 실패:', err)
  }
}

// 시간표
const { timetable, selectedDate, fetchWeekTimetable } = useTimetable()
const todayTimetable = ref([])
const mergedTimetable = ref({})
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function getClassesByDayPeriod(day, period) {
  const classes = finalTimetable.value[day]
  if (!classes) return []
  return classes.filter(cls =>
    Number(cls.start_period) <= Number(period) && Number(cls.end_period) >= Number(period)
  )
}


const finalTimetable = computed(() => {
  // 학생이면 단일 timetable, 관리자/교수면 merged
  return userRole === 'student' ? timetable.value : mergedTimetable.value
})

async function loadTimetablesForAllGrades(today) {
  const allGrades = [1, 2, 3]
  const temp = {}
  for (const g of allGrades) {
    const localRef = ref({})
    // fetchWeekTimetable(date, grade, targetRef)
    await fetchWeekTimetable(today, g, localRef)

    for (const day of Object.keys(localRef.value)) {
      if (!temp[day]) temp[day] = []
      // grade 주입
      temp[day].push(...localRef.value[day].map(cls => ({ ...cls, grade: g })))
    }
  }
  mergedTimetable.value = temp
}

onMounted(async () => {
  const today = new Date().toISOString().split('T')[0]

  // (1) 공지사항 로딩
  try {
    await noticeStore.getNotices()
    const fullList = noticeStore.notices || []
    if (userRole === 'student') {
      // 해당 학년 또는 전체 공지
      notices.value = fullList
        .filter(n => !n.academic_year || n.academic_year === '전체' || parseInt(n.academic_year) === userGrade)
        .slice(0, 3)
    } else {
      notices.value = fullList.slice(0, 3)
    }
    selectedNotice.value = notices.value[0]
  } catch (e) {
    console.error('공지사항 로딩 실패 ❌', e)
  }

  // (2) 일정 로딩
  await fetchGoogleCalendarEvents(today)
  selectedDate.value = today

  // (3) 시간표 로딩
  if (userRole === 'student') {
    // 학생: 자기 학년만
    await fetchWeekTimetable(today, userGrade)
  } else {
    // 관리자/교수: 모든 학년 합치기
    await loadTimetablesForAllGrades(today)
  }

  // (4) 오늘 수업
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayClasses = finalTimetable.value[todayDay] || []
  todayTimetable.value = todayClasses.map(cls => {
  const periodText = cls.start_period === cls.end_period
    ? `${cls.start_period}`
    : `${cls.start_period}교시 ~ ${cls.end_period}`

  return {
    period: periodText,
    subject: cls.subject_name
  }
})

})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');

/* (1) 상위 래퍼에 폰트 적용 */
#main-page {
  font-family: 'Noto Sans KR', sans-serif;
}

/* 기본 레이아웃 */
.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 16px 40px;
  font-family: 'Noto Sans KR', sans-serif;
  gap: 32px;
}

/* 공통 섹션 박스 */
.section-box {
  width: 100%;
  max-width: 960px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
}

/* 좌측 리스트 공통 */
.schedule-list {
  flex: 1;
  max-width: 300px;
  border-right: 1px solid #e0e0e0;
  padding: 24px;
}
.schedule-list h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #1e3a8a;
  font-weight: 600;
}
.schedule-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.schedule-list li {
  padding: 12px 14px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background-color 0.2s;
  color: #333;
}
.schedule-list li:hover,
.schedule-list li.active {
  background-color: #eef4ff;
  color: #1e40af;
  font-weight: 600;
}

/* 우측 상세 공통 */
.schedule-detail {
  flex: 2;
  padding: 24px;
}
.schedule-detail h3 {
  font-size: 22px;
  margin-bottom: 12px;
  color: #111827;
  font-weight: 700;
}
.schedule-detail p {
  font-size: 16px;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 8px;
}
.schedule-detail .date {
  font-size: 14px;
  color: #9ca3af;
  margin-top: 16px;
}

/* 시간표 섹션 */
.timetable-display {
  flex: 2;
  padding: 24px;
}
.timetable-display h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* 전환효과 */
.slide-fade-enter-active {
  transition: all 0.7s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* (2) 테이블: 교시 + 5요일(총 6열) 고정폭 */
.mini-timetable {
  width: 100%;
  table-layout: fixed; /* 열 폭 균등 */
  border-collapse: collapse;
  font-size: 13px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f9fafb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.mini-timetable th,
.mini-timetable td {
  width: calc(100% / 6);
  text-align: center;
  vertical-align: top;
  padding: 8px;
  border: 1px solid #e2e8f0;
  position: relative;
  /* 행 높이를 강제하려면 height를 고정 + overflow 처리 필요 */
}

/* (3) 카드 박스: 한국어 줄바꿈 처리 */
.mini-class-box {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 4px;
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 8px;

  /* 최소 높이 (짧은 내용은 50px, 길면 자동 늘어남) */
  min-height: 50px;

  /* 한국어 줄바꿈(음절 이상하게 끊김 최소화) */
  word-break: keep-all;       /* 한글 어절 단위 유지 */
  overflow-wrap: break-word;  /* 필요 시 줄바꿈 */
  white-space: normal;        /* 여러 줄 허용 */

  background-color: #e0f2fe;
}
.mini-class-box strong {
  display: block;
  margin-bottom: 2px;
  font-weight: 600;
  color: #1e3a8a;
  font-size: 12px;
}
.mini-class-box small {
  display: block;
  font-size: 11px;
  color: #555;
}

/* 휴강 표시 */
.cancel-text {
  font-size: 11px;
  margin-top: 4px;
  background: #fee2e2;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
  color: #b91c1c;
}
.mini-class-box.cancelled {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* 학년별 색상 */
.grade-1 {
  background-color: #dbf4ff; /* 연한 하늘색 */
}
.grade-2 {
  background-color: #ffebb5; /* 연한 노랑 */
}
.grade-3 {
  background-color: #ffd5db; /* 연한 분홍 */
}
</style>
