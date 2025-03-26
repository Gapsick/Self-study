<template>
  <div class="main-wrapper">
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
        <p class="date">{{ selectedNotice.date }}</p> <!-- 또는 created_at -->
      </div>
    </transition>
  </div>

    <!-- 일정 -->
<!-- 오늘의 일정 -->
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
          <td v-for="day in days" :key="day + '-' + period">
            <div v-for="cls in getClassesByDayPeriod(day, period)" :key="cls.id"
              class="mini-class-box"
              :class="cls.status === '휴강' ? 'cancelled' : 'active'">
            <strong>{{ cls.subject_name }}</strong><br />
            <small>{{ cls.professor }}</small><br />
            <span v-if="cls.status === '휴강'" class="badge badge-cancel">🛑 휴강</span>
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

// 📌 공지사항
const noticeStore = useNoticeStore()
const notices = ref([])
const selectedNotice = ref(null)
function selectNotice(notice) {
  selectedNotice.value = notice
}

// 📌 일정 (Google Calendar)
const calendarId = 'c_30f3f7b040f8956812ff3902e0725752aa5b4ab176a7fd02f4d8327f0ee4179d@group.calendar.google.com'
const accessToken = localStorage.getItem('googleAccessToken')
const events = ref([])
const selectedEventIndex = ref(0)

function selectEvent(index) {
  selectedEventIndex.value = index
}

const todayEvents = computed(() => events.value)

async function fetchGoogleCalendarEvents(today) {
  if (!accessToken) {
    console.warn('⚠️ Google Access Token 없음')
    return
  }

  const timeMin = `${today}T00:00:00Z`
  const timeMax = `${today}T23:59:59Z`

  try {
    const res = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    events.value = res.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      time: event.start.dateTime || event.start.date,
      description: event.description || '설명 없음',
    }))
  } catch (err) {
    console.error('📅 일정 로딩 실패:', err)
  }
}

// 📌 시간표
const { timetable, selectedDate, grade, fetchWeekTimetable } = useTimetable()
const todayTimetable = ref([])

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function getClassesByDayPeriod(day, period) {
  const classes = timetable.value[day]
  if (!classes) return []
  return classes.filter(cls => Number(cls.lecture_period) === Number(period))
}

// 📌 마운트 시 통합 처리
onMounted(async () => {
  const today = new Date().toISOString().split('T')[0]

  // 공지사항 로딩
  try {
    await noticeStore.getNotices()
    const fullList = noticeStore.notices || []
    notices.value = fullList.slice(0, 3)
    selectedNotice.value = notices.value[0]
  } catch (e) {
    console.error('공지사항 로딩 실패 ❌', e)
  }

  // 일정 로딩
  await fetchGoogleCalendarEvents(today)

  // 시간표 로딩
  await fetchWeekTimetable(today)
  selectedDate.value = today

  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayClasses = timetable.value[todayDay] || []
  todayTimetable.value = todayClasses.map(cls => ({
    period: cls.lecture_period,
    subject: cls.subject_name,
  }))
})
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');

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

/* 시간표 우측 */
.timetable-display {
  flex: 2;
  padding: 24px;
}

.timetable-display h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.timetable-placeholder {
  height: 300px;
  background-color: #f9fafb;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.mini-timetable {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.mini-timetable th,
.mini-timetable td {
  border: 1px solid #e5e7eb;
  padding: 6px;
  text-align: center;
  vertical-align: top;
}
.mini-class-box {
  background-color: #e0f2fe;
  padding: 6px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
  position: relative;
  font-size: 13px;
}

.mini-class-box.cancelled {
  background-color: #ffe4e6;
  color: #b91c1c;
}

.badge-cancel {
  font-size: 11px;
  position: absolute;
  top: 4px;
  right: 6px;
  background: #fee2e2;
  color: #b91c1c;
  padding: 2px 6px;
  border-radius: 10px;
}

</style>
