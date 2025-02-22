<template>
    <div>
      <h1>📅 메인 페이지</h1>
      <p>개인 캘린더 + 학과 캘린더를 함께 표시합니다.</p>

      <!-- Google Calendar Embed -->
      <iframe 
        :src="calendarURL"
        style="border: 0"
        width="800"
        height="600"
        frameborder="0"
        scrolling="no">
      </iframe>

      <!-- Google Calendar 웹에서 직접 일정 추가 -->
      <p>📌 직접 일정을 추가하려면 아래 버튼을 클릭하세요.</p>
      <a :href="addEventURL" target="_blank">
        <button>📅 Google Calendar에서 일정 추가</button>
      </a>

      <!-- Vue에서 직접 일정 추가 -->
      <h2>📌 새 일정 추가</h2>
      <label>📅 캘린더 선택:
        <select v-model="selectedCalendar">
          <option value="primary">📌 개인 캘린더</option>
          <option :value="departmentCalendarId">🏫 학과 캘린더</option>
        </select>
      </label>
      <br>
      <button @click="addEventToGoogleCalendar">📅 Vue에서 일정 추가</button>

      <button @click="logout">로그아웃</button>
    </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      // ✅ 개인 캘린더 + 학과 캘린더 함께 표시
      calendarURL: "",
      
      // ✅ Google Calendar 일정 추가 페이지 URL
      addEventURL: "https://calendar.google.com/calendar/u/0/r/eventedit",

      // ✅ 학과 캘린더 ID
      departmentCalendarId: "c_30f3f7b040f8956812ff3902e0725752aa5b4ab176a7fd02f4d8327f0ee4179d@group.calendar.google.com",

      // ✅ 선택된 캘린더 (기본값: 개인 캘린더)
      selectedCalendar: "primary",
    };
  },
  mounted() {
  // 🔹 컴포넌트가 마운트될 때 캘린더 URL 설정
    this.calendarURL = `https://calendar.google.com/calendar/embed?src=primary&src=${encodeURIComponent(this.departmentCalendarId)}&ctz=Asia%2FSeoul`;
    console.log("🔄 현재 캘린더 URL:", this.calendarURL);
  },
  methods: {
    async addEventToGoogleCalendar() {
      const accessToken = localStorage.getItem("googleAccessToken");

      if (!accessToken) {
        console.warn("⚠️ Google Access Token이 없음! → 로그인 페이지로 이동");
        this.$router.push("/login");
        return;
      }

      console.log("🔹 선택된 캘린더 ID:", this.selectedCalendar);  // ✅ 선택된 캘린더 확인

      const event = {
        summary: "Vue에서 추가한 일정",
        description: "이 일정은 Vue.js에서 추가되었습니다.",
        start: { dateTime: new Date().toISOString(), timeZone: "Asia/Seoul" },
        end: { dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), timeZone: "Asia/Seoul" }
      };

      try {
        const response = await axios.post(
          `https://www.googleapis.com/calendar/v3/calendars/${this.selectedCalendar}/events`,  // ✅ 선택된 캘린더로 일정 추가
          event,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log("✅ 일정 추가 완료:", response.data);

        // ✅ 일정 추가 후 새로고침
        this.reloadCalendar();
      } catch (error) {
        console.error("❌ 일정 추가 실패:", error.response?.data || error.message);
        alert("일정 추가에 실패했습니다. 다시 시도해주세요.");
      }
    },

    // ✅ 일정 추가 후 새로고침
    reloadCalendar() {
      this.calendarURL = `https://calendar.google.com/calendar/embed?src=primary&src=${this.departmentCalendarId}&ctz=Asia%2FSeoul`;
      console.log("🔄 캘린더 업데이트 완료:", this.calendarURL);
    },

    logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("googleAccessToken");
      this.$router.push("/");
    }
  }
};
</script>

<style>
h1 {
  text-align: center;
  margin-top: 20px;
}
iframe {
  display: block;
  margin: 20px auto;
}
</style>
