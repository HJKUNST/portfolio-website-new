# 배포 가이드 (Deployment Guide)

이 문서는 포트폴리오 웹사이트의 배포 프로세스를 상세히 설명합니다.

## 목차

1. [배포 전 준비사항](#배포-전-준비사항)
2. [Vercel 배포](#vercel-배포)
3. [수동 배포](#수동-배포)
4. [배포 후 확인](#배포-후-확인)
5. [롤백 절차](#롤백-절차)
6. [문제 해결](#문제-해결)

## 배포 전 준비사항

### 1. 코드 검증

```bash
# 1. 최신 코드 확인
git status
git log --oneline -10

# 2. 빌드 테스트
npm run build

# 3. 린트 확인
npm run lint

# 4. 로컬에서 프로덕션 빌드 테스트
npm run build
npm run start
# http://localhost:3000 에서 확인
```

### 2. 환경 변수 확인

- `.env.example` 파일을 참고하여 필요한 환경 변수 설정
- Vercel 대시보드에서 환경 변수 설정 확인
- 민감한 정보가 코드에 하드코딩되지 않았는지 확인

### 3. 의존성 확인

```bash
# 취약점 스캔
npm audit

# 취약점 수정 (가능한 경우)
npm audit fix
```

## Vercel 배포

### 자동 배포 (GitHub 연동)

1. **Vercel 프로젝트 설정**
   - Vercel 대시보드에서 프로젝트 생성
   - GitHub 저장소 연결
   - 빌드 설정 확인:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

2. **환경 변수 설정**
   - Vercel 대시보드 → Settings → Environment Variables
   - 필요한 환경 변수 추가
   - 환경별(Production, Preview, Development) 설정 가능

3. **도메인 설정**
   - Settings → Domains에서 도메인 추가
   - DNS 설정 확인

4. **자동 배포**
   - `main` 브랜치에 푸시하면 자동 배포
   - Pull Request 생성 시 프리뷰 배포

### 수동 배포 (Vercel CLI)

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 로그인
vercel login

# 3. 프로젝트 연결
vercel link

# 4. 배포
vercel --prod
```

## 수동 배포

### Docker를 사용한 배포

```dockerfile
# Dockerfile 예시
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### 일반 서버 배포

```bash
# 1. 서버에 코드 클론
git clone <repository-url>
cd portfolio-website-new

# 2. 의존성 설치
npm ci --production

# 3. 빌드
npm run build

# 4. 프로세스 매니저로 실행 (PM2 예시)
npm install -g pm2
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup
```

## 배포 후 확인

### 1. 기본 기능 확인

- [ ] 홈페이지 로딩 확인
- [ ] 모든 섹션 렌더링 확인
- [ ] 스크롤 애니메이션 동작 확인
- [ ] 커서 인터랙션 동작 확인
- [ ] Dialog 모달 동작 확인

### 2. 성능 확인

```bash
# Lighthouse CLI 사용 (선택사항)
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

또는 Chrome DevTools의 Lighthouse 탭 사용

### 3. 모니터링 확인

- Vercel Analytics 확인
- 에러 로그 확인
- 성능 메트릭 확인

## 롤백 절차

### Vercel 롤백

1. **대시보드에서 롤백**
   - Vercel 대시보드 → Deployments
   - 이전 배포 선택 → "Promote to Production"

2. **CLI로 롤백**
   ```bash
   vercel rollback
   ```

### Git 기반 롤백

```bash
# 1. 이전 커밋 확인
git log --oneline

# 2. 이전 버전으로 되돌리기
git checkout <previous-commit-hash>

# 3. 강제 푸시 (주의: 팀과 협의 후)
git push origin main --force
```

## 문제 해결

### 빌드 실패

1. **로컬에서 빌드 테스트**
   ```bash
   npm run build
   ```

2. **의존성 재설치**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **캐시 클리어**
   ```bash
   rm -rf .next
   npm run build
   ```

### 런타임 오류

1. **환경 변수 확인**
   - Vercel 대시보드에서 환경 변수 확인
   - `.env.example`과 비교

2. **로그 확인**
   - Vercel 대시보드 → Functions → Logs
   - 브라우저 콘솔 확인

3. **의존성 버전 확인**
   - `package.json`의 의존성 버전 확인
   - 호환성 문제 확인

### 성능 문제

1. **번들 크기 확인**
   ```bash
   npm run build
   # .next 폴더의 크기 확인
   ```

2. **이미지 최적화**
   - Next.js Image 컴포넌트 사용 확인
   - 이미지 포맷 최적화 (WebP 등)

3. **코드 스플리팅**
   - 동적 import 사용 확인
   - 불필요한 의존성 제거

## 배포 체크리스트

배포 전 반드시 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)를 확인하세요.

---

**참고 문서**:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)

