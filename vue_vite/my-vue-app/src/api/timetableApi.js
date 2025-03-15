// src/api/timetable.js
import axios from 'axios'

// ✅ 📌 학년 + 날짜 기반 시간표 조회 (💥 새로 추가된 핵심 API)
export const getTimetableByGradeAndDate = async (grade, date) => {
  const res = await axios.get(`http://localhost:5000/api/timetable/${grade}/date/${date}`)
  return res.data
}

export const addTimetable = (data) =>
  axios.post(BASE, data)

export const updateTimetable = (id, data) =>
  axios.put(`${BASE}/${id}`, data)

export const deleteTimetable = (id) =>
  axios.delete(`${BASE}/${id}`)
