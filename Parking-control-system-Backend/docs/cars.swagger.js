/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: 관리자 전용 API
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: 주차 이벤트 목록 조회
 *     description: 차량번호 및 날짜 범위로 검색 가능한 이벤트 리스트
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
 *       500:
 *         description: DB error
 */

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: 특정 주차 이벤트 상세 조회
 *     description: 선택한 이벤트의 기본 정보 및 이동 경로를 조회합니다.
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
 *       404:
 *         description: Data not found
 *       500:
 *         description: DB error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EventSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         plate_number:
 *           type: string
 *           example: "1234"
 *         slot_name:
 *           type: string
 *           example: "B2"
 *         entry_time:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T09:10:00.000Z"
 *         exit_time:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         status:
 *           type: string
 *           enum: [entry, parking, exit]
 *           example: entry
 *         fee:
 *           type: integer
 *           nullable: true
 *           example: 1200
 *
 *     EventDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/EventSummary'
 *         - type: object
 *           properties:
 *             duration:
 *               type: integer
 *               description: 총 주차 시간(초 단위)
 *               example: 4200
 *             entry_photo_url:
 *               type: string
 *               example: "/uploads/cars/1234.jpg"
 *             routes:
 *               type: array
 *               description: 차량 이동 경로 좌표 리스트
 *               items:
 *                 type: array
 *                 items:
 *                   type: number
 *               example: [[100, 200], [120, 220], [140, 240]]
 */
