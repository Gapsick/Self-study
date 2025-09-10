/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: 관리자 API
 *   - name: Occupancy
 *     description: 점유율/현황 API
 *   - name: Cars
 *     description: 차량 API
 *   - name: Personal Cars
 *     description: 개인 차량 정보 API
 */

/**
 * @swagger
 * /api/v1/sessions:
 *   get:
 *     summary: 주차 세션 로그 조회
 *     tags: ["Admin"]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: 특정 날짜 (YYYY-MM-DD)
 *       - in: query
 *         name: plate
 *         schema:
 *           type: integer
 *         required: false
 *         description: 차량 번호 (4자리)
 *     responses:
 *       200:
 *         description: 차량 로그 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SessionSummary'
 */

/**
 * @swagger
 * /api/v1/sessions/{id}:
 *   get:
 *     summary: 특정 주차 세션 상세 조회
 *     tags: ["Admin"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 세션 ID
 *     responses:
 *       200:
 *         description: 세션 상세 (이동 경로, 로그 포함)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionDetail'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SessionSummary:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 101 }
 *         plate_number: { type: integer, example: 3246 }
 *         slot_name: { type: string, example: "C4" }
 *         entry_time: { type: string, format: date-time, example: "2025-09-10T12:30:00" }
 *         exit_time: { type: string, format: date-time, example: "2025-09-10T15:45:00" }
 *         fee: { type: number, format: float, example: 3000 }
 *
 *     SessionDetail:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 101 }
 *         plate_number: { type: integer, example: 3246 }
 *         entry_time: { type: string, format: date-time }
 *         exit_time: { type: string, format: date-time }
 *         fee: { type: number, format: float }
 *         route:
 *           type: array
 *           items: { type: integer }
 *           example: [1, 2, 5, 7, 13]
 *         logs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               action: { type: string, enum: [ENTER, MOVE, EXIT] }
 *               timestamp: { type: string, format: date-time }
 *               position:
 *                 type: array
 *                 items: { type: number }
 *                 minItems: 2
 *                 maxItems: 2
 *                 example: [100,200]
 */



/**
 * @swagger
 * /api/v1/occupancy/now:
 *   get:
 *     summary: 현재 점유율 (전체/구역별)
 *     tags: ["Occupancy"]
 *     responses:
 *       200:
 *         description: 구역별 점유율
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total: { type: integer, example: 22 }
 *                 used:  { type: integer, example: 9 }
 *                 free:  { type: integer, example: 13 }
 *                 by_zone:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       total: { type: integer }
 *                       used:  { type: integer }
 *                       free:  { type: integer }
 *                   example:
 *                     A: { total: 6, used: 2, free: 4 }
 *                     B: { total: 4, used: 1, free: 3 }
 *                     C: { total: 4, used: 2, free: 2 }
 *                     D: { total: 8, used: 4, free: 4 }
 */

/**
 * @swagger
 * /api/v1/cars:
 *   get:
 *     summary: 차량 조회 (번호, 상태, 시간, 자리)
 *     tags: ["Cars"]
 *     responses:
 *       200:
 *         description: 차량 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleState'
 */

/**
 * @swagger
 * /api/v1/cars/{id}:
 *   get:
 *     summary: 특정 차량 상세 조회 (번호, 상태, 시간, 자리, 요금)
 *     tags: ["Personal Cars"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 차량 ID
 *     responses:
 *       200:
 *         description: 개인 차량 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 plate_number:
 *                   type: integer
 *                   example: 3246
 *                 status:
 *                   type: string
 *                   enum: [parking, moving, exiting]
 *                   example: parking
 *                 slot_id:
 *                   type: integer
 *                   example: 13
 *                 position:
 *                   type: array
 *                   items:
 *                     type: number
 *                   minItems: 2
 *                   maxItems: 2
 *                   example: [730, 207]
 *                 entry_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T12:30:00"
 *                 duration:
 *                   type: string
 *                   example: "2h 15m"
 *                 current_fee:
 *                   type: number
 *                   format: float
 *                   example: 4400
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleState:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         plate_number:
 *           type: integer
 *           example: 3246
 *           description: 차량 번호 (숫자 4자리)
 *         status:
 *           type: string
 *           enum: [parking, moving, exiting]
 *           example: parking
 *         slot_id: { type: integer, nullable: true, example: 13 }
 *         position:
 *           type: array
 *           items: { type: number }
 *           minItems: 2
 *           maxItems: 2
 *           example: [730, 207]
 *         entry_time:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: 1757423567.0111244
 *
 *     SpaceState:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 13 }
 *         name: { type: string, example: "C4" }
 *         status:
 *           type: string
 *           enum: [empty, occupied]
 *           example: occupied
 *         plate_number:
 *           type: integer
 *           nullable: true
 *           example: 3246
 *         polygon:
 *           type: array
 *           items:
 *             type: array
 *             items: { type: number }
 *             minItems: 2
 *             maxItems: 2
 *           example: [[713,195],[750,197],[743,220],[711,222]]
 *         car_id: { type: integer, nullable: true, example: 1 }
 *         entry_time:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: 1757423567.0111244
 */
