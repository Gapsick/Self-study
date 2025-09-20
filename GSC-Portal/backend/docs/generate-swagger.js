    import swaggerJsdoc from "swagger-jsdoc";
    import fs from "fs";
    import yaml from "yaml";
    import path from "path";
    import { fileURLToPath } from "url";

    // __dirname 흉내내기 (ESM에는 없음)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const options = {
    definition: {
        openapi: "3.0.0",
        info: {
        title: "GSC Portal API",
        version: "1.0.0",
        },
    },
    apis: [path.join(__dirname, "./**/*.swagger.js")], // docs 폴더 내 모든 swagger.js
    };

    const swaggerSpec = swaggerJsdoc(options);
    const yamlStr = yaml.stringify(swaggerSpec);

    fs.writeFileSync(path.join(__dirname, "./openapi.yaml"), yamlStr, "utf8");

    console.log("✅ OpenAPI spec generated at docs/openapi.yaml");
