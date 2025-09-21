/**
 * @swagger
 * tags:
 *   - name: Parking
 *     description: 차량 입차/주차/출차 API
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: 입구 차량 인식 (입차 이벤트 생성)
 *     tags: [Parking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plate_number
 *               - entry_time
 *             properties:
 *               plate_number:
 *                 type: string
 *                 example: "1234"
 *               entry_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-16T09:10:00"
 *     responses:
 *       201:
 *         description: 차량 입차 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "Vehicle entered (moving)"
 */

/**
 * @swagger
 * /events/park:
 *   patch:
 *     summary: 주차 완료 처리 (moving → parking)
 *     tags: [Parking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plate_number
 *               - entry_route
 *             properties:
 *               plate_number:
 *                 type: string
 *                 example: "1234"
 *               entry_route:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1,2,5,7]
 *     responses:
 *       200:
 *         description: 차량 주차 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vehicle parked"
 */

/**
 * @swagger
 * /events/exit:
 *   patch:
 *     summary: 출차 처리 (parking → exiting)
 *     tags: [Parking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plate_number
 *               - exit_time
 *               - exit_route
 *             properties:
 *               plate_number:
 *                 type: string
 *                 example: "1234"
 *               exit_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-16T13:00:00"
 *               exit_route:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [7,5,2,1]
 *               fee:
 *                 type: integer
 *                 example: 3000
 *     responses:
 *       200:
 *         description: 차량 출차 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vehicle exiting"
 */
