# Node.js 18 기반
FROM node:20

# 작업 디렉토리
WORKDIR /app

# package.json만 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 개발 서버 포트
EXPOSE 5173

# 개발 모드 실행
CMD ["npm", "run", "dev"]
