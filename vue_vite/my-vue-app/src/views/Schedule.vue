<template>
    <div class="schedule-container">
      <!-- 상단 월 변경 헤더 -->
      <div class="month-header">
        <button @click="prevMonth" class="month-button">◀</button>
        <h2>{{ currentYear }}년 {{ currentMonth }}월</h2>
        <button @click="nextMonth" class="month-button">▶</button>
      </div>
  
      <!-- 본문 영역: 일정 목록 + 달력 -->
      <div class="content-container">
        <!-- 좌측 일정 목록 -->
        <div class="schedule-list">
          <h2>📅 일정 목록</h2>
          <div v-for="(events, date) in eventsByDate" :key="date">
            <!-- 날짜 헤더 -->
            <h3 :id="'event-' + date">{{ formatDate(date) }}</h3>
            <!-- 해당 날짜의 일정들 -->
            <div
              v-for="event in events"
              :key="event.id"
              class="event-item"
              @click="openModal(event)"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
  
        <!-- 우측 달력 -->
        <div class="calendar-container">
          <h2>📆 달력</h2>
          <div class="calendar">
            <!-- 한 달 날짜 반복 -->
            <div
              v-for="day in days"
              :key="day"
              class="calendar-day"
              @click="scrollToEvent(day)"
            >
              <span>{{ day }}</span>
              <!-- 해당 날짜에 이벤트가 있으면 색상 선을 세로로 표시 -->
              <div v-if="eventsByDate[getFormattedDate(day)]" class="event-box">
                <div
                  v-for="(event, index) in eventsByDate[getFormattedDate(day)]"
                  :key="index"
                  class="event-line"
                  :style="{ backgroundColor: getEventColor(index) }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 일정 상세 모달 -->
      <div v-if="showModal" class="modal-overlay" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <h2>{{ selectedEvent?.title }}</h2>
          <p><strong>날짜:</strong> {{ selectedEvent?.start }}</p>
          <p><strong>설명:</strong> {{ selectedEvent?.description || "설명 없음" }}</p>
          <button @click="showModal = false" class="close-button">닫기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "Schedule",
    data() {
      return {
        calendarId: "c_30f3f7b040f8956812ff3902e0725752aa5b4ab176a7fd02f4d8327f0ee4179d@group.calendar.google.com", // Google Calendar ID
        events: [],
        showModal: false,
        selectedEvent: null,
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
      };
    },
    computed: {
      // 날짜별로 이벤트 그룹화
      eventsByDate() {
        return this.events.reduce((acc, event) => {
          const date = event.start.split("T")[0]; // YYYY-MM-DD
          if (!acc[date]) acc[date] = [];
          acc[date].push(event);
          return acc;
        }, {});
      },
      // 현재 월의 날짜 리스트
      days() {
        const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
      },
    },
    methods: {
      // Google Calendar API에서 일정 가져오기
      async fetchGoogleCalendarEvents() {
        const accessToken = localStorage.getItem("googleAccessToken");
        if (!accessToken) {
          console.warn("⚠️ Google Access Token이 없음");
          // 페이지 이동 로직이 있다면 추가
          return;
        }
  
        // 해당 월의 시작, 끝 날짜
        const timeMin = `${this.currentYear}-${String(this.currentMonth).padStart(2, "0")}-01T00:00:00Z`;
        const timeMax = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, "0")}-01T00:00:00Z`;
  
        try {
          const response = await axios.get(
            `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
  
          this.events = response.data.items.map(event => ({
            id: event.id,
            title: event.summary,
            start: event.start.date || event.start.dateTime,
            description: event.description || "설명 없음",
          }));
        } catch (error) {
          console.error("❌ 일정 불러오기 실패:", error.response?.data || error.message);
        }
      },
  
      // 날짜 클릭 시 해당 일정 목록으로 스크롤
      scrollToEvent(day) {
        const date = this.getFormattedDate(day);
        const element = document.getElementById("event-" + date);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      },
  
      // 모달 열기
      openModal(event) {
        this.selectedEvent = event;
        this.showModal = true;
      },
  
      // YYYY-MM-DD → 보기좋은 형식 (2월 3일 (월))
      formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
        return `${month}월 ${day}일 (${dayOfWeek})`;
      },
  
      // 년도, 월 변경
      prevMonth() {
        if (this.currentMonth === 1) {
          this.currentYear--;
          this.currentMonth = 12;
        } else {
          this.currentMonth--;
        }
        this.fetchGoogleCalendarEvents();
      },
      nextMonth() {
        if (this.currentMonth === 12) {
          this.currentYear++;
          this.currentMonth = 1;
        } else {
          this.currentMonth++;
        }
        this.fetchGoogleCalendarEvents();
      },
  
      // 숫자(day) → YYYY-MM-DD
      getFormattedDate(day) {
        return `${this.currentYear}-${String(this.currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      },
  
      // 이벤트 색상 (무지개)
      getEventColor(index) {
        const colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"];
        return colors[index % colors.length];
      },
    },
    mounted() {
      this.fetchGoogleCalendarEvents();
    },
  };
  </script>
  
  <style>
  /* 전체 컨테이너 */
  .schedule-container {
    max-width: 1200px;
    margin: auto;
    padding: 20px;
  }
  
  /* 월 변경 헤더 */
  .month-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  /* 월 변경 버튼 */
  .month-button {
    background: #444;
    color: #fff;
    border: none;
    font-size: 20px;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  /* 일정 목록 + 달력 */
  .content-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
  
  /* 일정 목록 */
  .schedule-list {
    flex: 0 0 65%;
    background: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
  }
  
  /* 일정 아이템 */
  .event-item {
    background: #fff;
    border-radius: 6px;
    margin-bottom: 6px;
    padding: 10px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .event-item:hover {
    background: #eee;
  }
  
  /* 달력 컨테이너 */
  .calendar-container {
    flex: 0 0 30%;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
  }
  
  /* 달력 그리드 */
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
  
  /* 날짜 칸 */
  .calendar-day {
    position: relative;
    width: 60px;
    height: 50px;
    display: flex;
    flex-direction: column; /* 세로 쌓기 */
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
  }
  
  /* 이벤트 라인 */
  .event-box {
    position: absolute;
    bottom: 4px;
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .event-line {
    width: 100%;
    height: 3px;
    border-radius: 1px;
  }
  
  /* 모달 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  
  .modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    max-width: 90%;
    text-align: center;
  }
  
  .close-button {
    margin-top: 10px;
    background: #f33;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  