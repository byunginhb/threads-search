# Threads Search 로컬 개발 가이드

## 1. Threads 앱 설정

1. https://developers.facebook.com/apps 에서 새 앱 생성
2. "Threads API" 제품 추가
3. App ID와 App Secret 복사
4. Redirect URI 추가: `http://localhost:3000/api/auth/callback`

## 2. 환경변수 설정

cp .env.local.example .env.local
# .env.local 파일에 실제 값 입력

## 3. 로컬 실행

npm run dev
# http://localhost:3000 접속
# "Threads 계정 연결" 클릭 후 인증
