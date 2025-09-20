# 1. Node.js 18 버전 이미지를 기반으로 사용
FROM node:18

# 2. 컨테이너 안에서 작업할 디렉토리 지정
WORKDIR /app

# 3. package.json과 package-lock.json만 먼저 복사
COPY package*.json ./

# 4. npm install 실행 (의존성 설치)
RUN npm install

# 5. 나머지 소스 코드 복사
COPY . .

# 6. 컨테이너에서 열어줄 포트
EXPOSE 3000

# 7. 서버 실행 명령
CMD ["npm", "run", "dev"]
