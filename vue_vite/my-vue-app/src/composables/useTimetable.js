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

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdminOrProfessor = user.role === 'admin' || user.role === 'professor'
  const grade = ref(Number(user.grade || 1)) // ✅ localStorage에서 가져온 사용자 학년 반영

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
    
        let classes = []
        if (isAdminOrProfessor) {
          const actualGrade = useGrade ?? grade.value
    
          // ✅ 정규+특강 + 한국어 병렬 조회
          const [regularAndSpecial, korean] = await Promise.all([
            getTimetableByGradeAndDate(actualGrade, d),
            getTimetableByGradeAndDate("KOR", d),
          ])
    
          classes = [...regularAndSpecial, ...korean]
        } else {
          // ✅ 학생은 본인 기준으로 조회
          classes = await getTimetableByUserId(user.id, d)
          classes = classes.filter(c =>
            new Date(d) >= new Date(c.start_date) &&
            new Date(d) <= new Date(c.end_date) &&
            c.day === dayName
          )
        }
    
        schedule[dayName] = classes.map(c => ({
          ...c,
          is_absent: c.is_absent === 1, // ✅ 명확하게 boolean으로 변환
        }))
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
  
  // 날짜 이동 함수
  function goToPreviousWeek() {
    const date = new Date(selectedDate.value)
    date.setDate(date.getDate() - 7)
    const newDate = date.toISOString().split('T')[0]
    fetchWeekTimetable(newDate)
  }
  
  function goToNextWeek() {
    const date = new Date(selectedDate.value)
    date.setDate(date.getDate() + 7)
    const newDate = date.toISOString().split('T')[0]
    fetchWeekTimetable(newDate)
  }
  
  return {
    timetable,
    selectedDate,
    grade,
    fetchWeekTimetable,
    createClass,
    updateClass,
    removeClass,
    goToPreviousWeek,
    goToNextWeek 
  }
}
