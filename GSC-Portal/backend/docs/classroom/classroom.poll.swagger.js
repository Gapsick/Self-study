/**
 * @swagger
 * /classrooms/polls:
 *   get:
 *     summary: 이번 주 강의실 개방 투표 현황 조회
 *     tags: [Classroom - Poll]
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: "주 시작일 (예: 2025-09-15)"
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: "주 종료일 (예: 2025-09-21)"
 *     responses:
 *       200:
 *         description: 투표 현황 목록
 *
 *   post:
 *     summary: 강의실 개방 투표 생성
 *     tags: [Classroom - Poll]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade_id: { type: integer, example: 1 }
 *               classroom_id: { type: string, example: "101" }
 *               poll_date: { type: string, example: "2025-09-20" }
 *               target_weekend: { type: string, example: "토요일" }
 *               required_count: { type: integer, example: 8 }
 *     responses:
 *       200:
 *         description: 투표 생성 완료
 */

/**
 * @swagger
 * /classrooms/polls/{poll_id}:
 *   get:
 *     summary: 특정 투표 상세 조회
 *     tags: [Classroom - Poll]
 *     parameters:
 *       - in: path
 *         name: poll_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 투표 ID
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회하는 사용자 ID (투표 여부 확인용)
 *     responses:
 *       200:
 *         description: 투표 상세 정보
 *
 * /classrooms/polls/{poll_id}/vote:
 *   post:
 *     summary: 투표 참여하기
 *     tags: [Classroom - Poll]
 *     parameters:
 *       - in: path
 *         name: poll_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 투표 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id: { type: string, example: "U001" }
 *     responses:
 *       200:
 *         description: 투표 완료
 */
