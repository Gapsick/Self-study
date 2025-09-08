const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parking Control System API",
      version: "1.0.0",
      description: "주차 관리 시스템 API 명세서",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js"], // 주석 스캔할 위치
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };
