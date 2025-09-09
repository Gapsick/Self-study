/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: 관리자 API
 *   - name: Occupancy
 *     description: 점유율/현황 API
 *   - name: Cars
 *     description: 차량 API
 *   - name: Fee
 *     description: 요금 API
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
 *     summary: 차량 조회 (번호, 시간, 자리)
 *     tags: ["Cars"]
 *     responses:
 *       200:
 *         description: 차량 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: integer
 *                     example: 3246
 *                     description: 임시 차량 번호(예시)
 *                   time:
 *                     type: string
 *                     example: "17:10:46"
 *                     description: 입차 시간
 *                   seat:
 *                     type: string
 *                     example: "C2"
 *                     description: 주차 자리
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleState:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         plate_number: { type: string }
 *         status: { type: string, enum: [parking, moving, exiting] }
 *         slot_id: { type: integer, nullable: true }
 *         position:
 *           type: array
 *           items: { type: number }
 *           minItems: 2
 *           maxItems: 2
 *         entry_time: { type: string, format: date-time, nullable: true }
 *     SpaceState:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *         status: { type: string, enum: [empty, occupied] }
 *         plate_number: { type: string, nullable: true }
 *         polygon:
 *           type: array
 *           items:
 *             type: array
 *             items: { type: number }
 *             minItems: 2
 *             maxItems: 2
 *         car_id: { type: integer, nullable: true }
 *         entry_time: { type: string, format: date-time, nullable: true }
 */
