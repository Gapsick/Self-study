import { ref } from 'vue'
import { getTimetableByGradeAndDate, getTimetableByUserId } from '../api/timetableApi'

export function useTimetable() {
  const timetable = ref({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  })

  const selectedDate = ref('')
  const grade = ref(1)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdminOrProfessor = user.role === 'admin' || user.role === 'professor'

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

  const fetchWeekTimetable = async (date, useGrade, targetRef) => {
    selectedDate.value = date
    const dates = getWeekDates(date)

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

        // ✅ 사용자 역할에 따라 호출 방식 분기
        let classes = []
        if (isAdminOrProfessor) {
          const actualGrade = useGrade ?? grade.value
          classes = await getTimetableByGradeAndDate(actualGrade, d)
        } else {
          classes = await getTimetableByUserId(user.id)
          // 백엔드에서 날짜로 필터된 게 아니면 직접 날짜로 걸러도 됨:
          classes = classes.filter(c => new Date(d) >= new Date(c.start_date) && new Date(d) <= new Date(c.end_date) && c.day === dayName)
        }

        schedule[dayName] = classes
      })
    )

    if (targetRef) {
      targetRef.value = schedule
    } else {
      Object.assign(timetable.value, schedule)
    }
  }

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
