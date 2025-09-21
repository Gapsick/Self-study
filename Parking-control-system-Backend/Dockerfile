# Node.js 기반 Dockerfile (Jetson Nano 호환)
FROM node:18-bullseye-slim

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# package.json과 lock 파일 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 환경 변수 (필요시 수정)
ENV NODE_ENV=production \
    PORT=3000

# 서버 포트 열기
EXPOSE 3000

# 서버 실행
CMD ["node", "index.js"]
