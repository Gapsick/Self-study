import { ref } from 'vue'
import { getTimetableByGradeAndDate } from '../api/timetableApi'

export function useTimetable() {
  // 기본적으로 한 학년(학생용) 시간표 저장
  const timetable = ref({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  })

  const selectedDate = ref('')
  const grade = ref(1) // 학생 전용 (기본값 1)

  // 주간 날짜 생성 함수 (그대로)
  function getWeekDates(baseDate) {
    const date = new Date(baseDate)
    const day = date.getDay()
    const monday = new Date(date)
    monday.setDate(date.getDate() - ((day + 6) % 7))

    const week = []
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      week.push(d.toISOString().split('T')[0])
    }
    return week
  }

  /**
   * @function fetchWeekTimetable
   * @param {string} date YYYY-MM-DD
   * @param {number} useGrade 이 매개변수를 넣으면 내부 grade.value 대신 이 값을 사용
   * @param {object} targetRef 병합할 목표 ref. 이 값이 있으면, 여기에 시간표를 저장함
   */
  const fetchWeekTimetable = async (date, useGrade, targetRef) => {
    // 만약 useGrade가 없으면, 내부 state(grade.value)를 쓴다 (학생용)
    const actualGrade = useGrade ?? grade.value
    selectedDate.value = date
    const dates = getWeekDates(date)

    // 새로 쌓을 schedule
    const schedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    }

    await Promise.all(
      dates.map(async (d) => {
        const dayName = new Date(d).toLocaleString('en-US', { weekday: 'long' })
        // 백엔드에서 dayName이 Monday, Tuesday...로 맞는지 확인
        const classes = await getTimetableByGradeAndDate(actualGrade, d)
        schedule[dayName] = classes
      })
    )

    // targetRef가 있으면 거기에 넣고, 없으면 기존 timetable에 덮어씀
    if (targetRef) {
      // 관리자/교수용 병합에서 사용 가능
      targetRef.value = schedule
    } else {
      // 학생용 단일 timetable
      // Object.assign하면 keys는 교체되지만 나머지 구조는 유지됨
      Object.assign(timetable.value, schedule)
    }
  }

  // === 추가로 원래 있던 CRUD 로직들 ===
  async function createClass(formData) {
    await addTimetable(formData)
    await fetchWeekTimetable(selectedDate.value)
  }

  async function updateClass(id, formData) {
    await updateTimetable(id, formData)
    await fetchWeekTimetable(selectedDate.value)
  }

  async function removeClass(id) {
    await deleteTimetable(id)
    await fetchWeekTimetable(selectedDate.value)
  }

  return {
    timetable,
    selectedDate,
    grade,
    fetchWeekTimetable,
    createClass,
    updateClass,
    removeClass,
  }
}
