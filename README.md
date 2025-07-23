# AI 학습동아리 웹사이트

생성형 AI를 학습하는 동아리의 커뮤니티 플랫폼입니다.

## 주요 기능

- 🔐 이메일 인증 기반 회원가입/로그인
- 📱 모바일 반응형 디자인
- 📅 동아리 일정 관리 (달력 UI)
- 📝 게시판 시스템
  - 공지사항 (관리자 전용)
  - 학습자료 게시판
  - 자유게시판
  - 사진 게시판
- 📎 파일 업로드 (PPT, PDF, 이미지 등)
- 🏢 조직도
- 🌓 다크모드 지원

## 기술 스택

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS v4, Glass Morphism
- **기타**: React Hook Form, Zod, date-fns

## 시작하기

### 1. 환경 설정

`.env.local` 파일을 생성하고 Supabase 정보를 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 의존성 설치

```bash
npm install
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/` 폴더의 SQL 파일들을 순서대로 실행
3. Storage에서 `supabase/storage-policies.sql` 실행
4. Authentication > Email Templates에서 이메일 템플릿 커스터마이징 (선택사항)

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인하세요.

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/          # 인증 관련 페이지
│   ├── (main)/          # 메인 레이아웃 페이지
│   └── auth/callback/   # 이메일 인증 콜백
├── components/
│   ├── calendar/        # 달력 컴포넌트
│   ├── layout/          # 헤더, 네비게이션
│   ├── providers/       # Context Providers
│   └── ui/              # shadcn/ui 컴포넌트
├── lib/
│   └── supabase/        # Supabase 클라이언트
└── types/               # TypeScript 타입 정의
```

## 보안

- Row Level Security (RLS) 정책 적용
- 관리자/일반 회원 권한 분리
- 안전한 파일 업로드 검증

## 라이선스

MIT