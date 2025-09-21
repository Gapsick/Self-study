/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: 관리자 전용 API
 */

/**
 * @swagger
 * /admin/events:
 *   get:
 *     summary: 주차 이벤트 목록 조회
 *     description: 차량번호/날짜 범위로 검색 가능한 이벤트 리스트
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: plate
 *         schema:
 *           type: string
 *         required: false
 *         description: "차량 번호 (예: 1234)"
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: 검색 시작일 (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: 검색 종료일 (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: 주차 이벤트 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventSummary'
 */

/**
 * @swagger
 * /admin/events/{id}:
 *   get:
 *     summary: 특정 주차 이벤트 상세 조회
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 이벤트 ID
 *     responses:
 *       200:
 *         description: 주차 이벤트 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventDetail'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EventSummary:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         plate_number: { type: string, example: "1234" }
 *         entry_time: { type: string, format: date-time, example: "2025-09-01T10:30:00" }
 *         exit_time: { type: string, format: date-time, nullable: true, example: "2025-09-01T15:00:00" }
 *         fee: { type: integer, example: 4000 }
 *         status:
 *           type: string
 *           enum: [parking, completed]
 *           example: parking
 *
 *     EventDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/EventSummary'
 *         - type: object
 *           properties:
 *             duration: { type: string, example: "4h 30m" }
 *             route:
 *               type: array
 *               items: { type: integer }
 *               example: [1, 2, 5, 7]
 */
