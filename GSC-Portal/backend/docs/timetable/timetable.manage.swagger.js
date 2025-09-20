/**
 * @swagger
 * /timetables/{type}:
 *   post:
 *     summary: 시간표 등록 (정규 / 특강 / 한국어)
 *     tags: [Timetable]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [regular, special, korean]
 *         description: 시간표 유형 (정규/특강/한국어)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id: { type: string, example: "C001" }
 *               grade_id: { type: integer, example: 2 }
 *               classroom_id: { type: string, example: "101" }
 *               day_of_week: { type: string, example: "월" }
 *               time_slot_id: { type: string, example: "1" }
 *             additionalProperties: true   # 특강/한국어에서 추가 필드 허용
 *     responses:
 *       200: { description: 등록 완료 }
 *
 *   put:
 *     summary: 시간표 수정
 *     tags: [Timetable]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [regular, special, korean]
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classroom_id: { type: string, example: "102" }
 *               day_of_week: { type: string, example: "화" }
 *               time_slot_id: { type: string, example: "2" }
 *             additionalProperties: true
 *     responses:
 *       200: { description: 수정 완료 }
 *
 *   delete:
 *     summary: 시간표 삭제
 *     tags: [Timetable]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [regular, special, korean]
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: 삭제 완료 }
 */
