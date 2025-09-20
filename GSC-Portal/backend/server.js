import express from "express";
import { swaggerUi, specs } from "./docs/swagger.js";

// Router
import adminRouter from './src/routes/adminRouter.js';
const classroomRouter = require('./src/routes/classroomRouter.js')
// const timetablesRouter = require('./src/routes/timetablesRouter.js')


const app = express();
app.use(express.json());





// Swagger 들고오기
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// api
app.use('/admin', adminRouter);
app.use('/classroom', classroomRouter)
// app.use('./timetables', timetablesRouter)




app.listen(3000, () => {
console.log(`Server running at http://localhost:3000`);
console.log(`Swagger docs: http://localhost:3000/api-docs`);
});
