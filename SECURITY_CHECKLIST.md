# 보안 체크리스트 (Security Checklist)

이 문서는 배포 전 보안 점검 사항을 정리한 것입니다.

## 1. 코드 보안

### 1.1 환경 변수 및 시크릿
- [ ] 민감한 정보(API 키, 토큰 등)가 코드에 하드코딩되지 않았는지 확인
- [ ] 환경 변수를 사용하여 시크릿 관리
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `.env.example` 파일에 실제 값이 포함되지 않았는지 확인
- [ ] 배포 플랫폼에서 환경 변수가 올바르게 설정되었는지 확인

### 1.2 의존성 보안
```bash
# 취약점 스캔 실행
npm audit

# 심각한 취약점 확인
npm audit --audit-level=high

# 취약점 수정 (가능한 경우)
npm audit fix
```
- [ ] 정기적으로 `npm audit` 실행
- [ ] 알려진 취약점이 있는 패키지 업데이트
- [ ] 사용하지 않는 의존성 제거

### 1.3 코드 품질
- [ ] ESLint 보안 규칙 준수
- [ ] TypeScript strict 모드 활성화
- [ ] 사용자 입력 검증 및 sanitization
- [ ] SQL Injection 방지 (현재 프로젝트는 DB 미사용)

## 2. 네트워크 보안

### 2.1 HTTPS
- [ ] HTTPS 적용 확인 (Vercel은 기본 제공)
- [ ] HTTP to HTTPS 리다이렉트 설정
- [ ] SSL/TLS 인증서 유효성 확인

### 2.2 CORS 설정
- [ ] 필요한 경우에만 CORS 허용
- [ ] 허용된 도메인만 명시적으로 설정
- [ ] 와일드카드(`*`) 사용 지양

### 2.3 Content Security Policy (CSP)
- [ ] CSP 헤더 설정 고려
- [ ] 인라인 스크립트 최소화
- [ ] 외부 리소스 출처 제한

## 3. 인증 및 권한

### 3.1 현재 상태
- [ ] 이 프로젝트는 정적 포트폴리오 사이트로 인증 불필요
- [ ] 향후 인증 추가 시 보안 고려사항:
  - [ ] 강력한 비밀번호 정책
  - [ ] 세션 관리
  - [ ] CSRF 보호
  - [ ] Rate Limiting

## 4. 데이터 보안

### 4.1 사용자 데이터
- [ ] 현재 프로젝트는 사용자 데이터 수집 없음
- [ ] 향후 데이터 수집 시:
  - [ ] 개인정보 보호법 준수
  - [ ] 데이터 암호화
  - [ ] 데이터 보관 정책 수립

### 4.2 로깅
- [ ] 민감한 정보가 로그에 기록되지 않도록 주의
- [ ] 프로덕션 환경에서 디버그 로그 비활성화
- [ ] 로그 접근 권한 제한

## 5. OWASP Top 10 대응

### 5.1 Injection
- [ ] 사용자 입력 검증 및 sanitization
- [ ] 현재 프로젝트는 사용자 입력 처리 없음

### 5.2 Broken Authentication
- [ ] 현재 프로젝트는 인증 없음
- [ ] 향후 인증 추가 시 강력한 인증 메커니즘 구현

### 5.3 Sensitive Data Exposure
- [ ] 환경 변수를 통한 시크릿 관리
- [ ] HTTPS 통신 강제
- [ ] 민감한 정보 암호화

### 5.4 XML External Entities (XXE)
- [ ] 현재 프로젝트는 XML 처리 없음

### 5.5 Broken Access Control
- [ ] 현재 프로젝트는 접근 제어 없음
- [ ] 향후 추가 시 적절한 권한 검증 구현

### 5.6 Security Misconfiguration
- [ ] 기본 설정 변경 (예: Next.js 보안 헤더)
- [ ] 불필요한 기능 비활성화
- [ ] 최신 보안 패치 적용

### 5.7 Cross-Site Scripting (XSS)
- [ ] React는 기본적으로 XSS 방지
- [ ] `dangerouslySetInnerHTML` 사용 시 주의
- [ ] 사용자 입력 sanitization

### 5.8 Insecure Deserialization
- [ ] 현재 프로젝트는 역직렬화 없음

### 5.9 Using Components with Known Vulnerabilities
- [ ] 정기적인 `npm audit` 실행
- [ ] 의존성 업데이트
- [ ] 보안 알림 구독

### 5.10 Insufficient Logging & Monitoring
- [ ] 에러 로깅 설정
- [ ] 보안 이벤트 모니터링
- [ ] 이상 징후 감지

## 6. Next.js 특화 보안

### 6.1 보안 헤더
`next.config.ts`에 보안 헤더 추가 고려:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ]
  },
}
```

### 6.2 이미지 보안
- [ ] `dangerouslyAllowSVG` 사용 시 주의 (현재 설정됨)
- [ ] 외부 이미지 도메인 제한
- [ ] 이미지 최적화 및 검증

## 7. 배포 플랫폼 보안

### 7.1 Vercel 보안
- [ ] Vercel 프로젝트 접근 권한 확인
- [ ] 환경 변수 암호화 확인
- [ ] 배포 로그 접근 권한 제한

### 7.2 도메인 보안
- [ ] DNS 설정 확인
- [ ] 도메인 소유권 확인
- [ ] SSL 인증서 자동 갱신 확인

## 8. 모니터링 및 대응

### 8.1 보안 모니터링
- [ ] 보안 이벤트 로깅
- [ ] 이상 징후 감지 시스템 구축
- [ ] 정기적인 보안 감사

### 8.2 사고 대응
- [ ] 보안 사고 대응 절차 수립
- [ ] 연락처 및 에스컬레이션 경로 문서화
- [ ] 정기적인 보안 훈련

## 9. 체크리스트 실행

배포 전 이 체크리스트를 순서대로 확인하세요.

### 배포 전 필수 확인
1. [ ] 환경 변수 보안 확인
2. [ ] 의존성 취약점 스캔 (`npm audit`)
3. [ ] 민감한 정보 하드코딩 여부 확인
4. [ ] HTTPS 적용 확인
5. [ ] 보안 헤더 설정 확인

### 정기 점검 (월 1회)
1. [ ] 의존성 업데이트 확인
2. [ ] 보안 패치 적용
3. [ ] 로그 검토
4. [ ] 접근 권한 검토

## 10. 보안 도구

### 권장 도구
- **의존성 스캔**: `npm audit`, Snyk
- **코드 분석**: ESLint 보안 플러그인
- **모니터링**: Vercel Analytics, Sentry
- **스캔**: OWASP ZAP, Burp Suite

## 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

---

**마지막 업데이트**: 2024년
**담당자**: 개발팀

