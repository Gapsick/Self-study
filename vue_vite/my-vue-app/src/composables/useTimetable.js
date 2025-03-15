import { ref } from 'vue'
import { getTimetableByGradeAndDate } from '../api/timetableApi'

export function useTimetable() {
  const timetable = ref({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  })
  const selectedDate = ref('')
  const grade = ref(1)

  // 주간 날짜 생성 함수
  function getWeekDates(baseDate) {
    const date = new Date(baseDate)
    const day = date.getDay()
    const monday = new Date(date)
    monday.setDate(date.getDate() - ((day + 6) % 7))

    const week = []
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      week.push(d.toISOString().split("T")[0])
    }
    return week
  }

  // 주간 시간표 불러오기
const fetchWeekTimetable = async (date) => {
  selectedDate.value = date
  const dates = getWeekDates(date)
  const schedule = {}

  await Promise.all(
    dates.map(async (d) => {
      const dayName = new Date(d).toLocaleString('en-US', { weekday: 'long' })

      // ✅ 백엔드에서 휴강 여부까지 포함해서 반환됨
      const classes = await getTimetableByGradeAndDate(grade.value, d)

      schedule[dayName] = classes
    })
  )

  Object.assign(timetable.value, schedule)
}


  const createClass = async (formData) => {
    await addTimetable(formData)
    await fetchWeekTimetable(selectedDate.value)
  }

  const updateClass = async (id, formData) => {
    await updateTimetable(id, formData)
    await fetchWeekTimetable(selectedDate.value)
  }

  const removeClass = async (id) => {
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
    removeClass
  }
}
