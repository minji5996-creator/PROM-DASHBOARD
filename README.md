# SOCIAL PULSE · SNS KPI Dashboard

배포: https://minji5996-creator.github.io/PROM-DASHBOARD/

## 최신 조사: 2026-11-16

- instagram: [blocked] 오늘 공식 분석 화면의 브라우저 연결 시간초과로 계정·기간·수치를 검증하지 못했습니다. 과거 수치는 원래 관측일로 보존하고 성과 비교와 새 전략 도출을 보류합니다.
  출처: https://www.instagram.com/accounts/insights/?timeframe=30

- facebook: [blocked] 오늘 공식 분석 화면의 브라우저 연결 시간초과로 계정·기간·수치를 검증하지 못했습니다. 과거 수치는 원래 관측일로 보존하고 성과 비교와 새 전략 도출을 보류합니다.
  출처: https://www.facebook.com/profile.php?id=61595324797271

- threads: [blocked] 오늘 공식 분석 화면의 브라우저 연결 시간초과로 계정·기간·수치를 검증하지 못했습니다. 과거 수치는 원래 관측일로 보존하고 성과 비교와 새 전략 도출을 보류합니다.
  출처: https://www.threads.com/insights?days=30

- x: 팔로워0·공개글13개(답글 포함), 수집글 누적조회183회. NEURA 스레드3개 조회6·3·3회, 캐럿 광고 스레드4개 47회. 좋아요·리포스트·북마크 모두0이며 답글5건은 동일작성자 연결글로 외부반응이 아닙니다. 소표본이므로 첫 장면과 제작과정 후속글 연결을 테스트하고 반응을 추가 관측하세요. 누적 차이는 일일 발생량으로 해석하지 않습니다.
  출처: https://x.com/promrecord

- youtube: [blocked] 오늘 Studio 렌더러 응답 오류로 최근28일·7일 수치와 달력기간, audience, 최근콘텐츠를 검증하지 못했다. 기존 2026-11-15 관측을 오늘 값으로 재사용하지 않는다. 성과 변화 해석과 새 전략 도출을 보류한다.
  출처: https://studio.youtube.com/channel/UC0UncCw3Cmx-SHEJa0VoJog/analytics/hub_overview

## 집계와 보존

X 최신 지표 수집. 나머지4개채널 공식 분석화면 CDP접근실패. 기존4421행 보존, 183행 추가(관측69행·확인불가114행), 오디언스 추가없음. 총4604지표,1096기간지표,1721오디언스,101게시물,23실행이력. 과거값을 오늘값으로 재사용하지 않음.

[일일 조사 상세](DAILY-2026-11-16.md).

## 메뉴·키워드 기반 챗봇

오른쪽 아래 대화 버튼으로 시작합니다. 생성형 AI/API 호출 없이 `chatbot-flow.json`의 등록 답변과 규칙만 사용합니다. 같은 탭 새로고침 시 sessionStorage로 대화를 복원하며 초기화 시 기록을 삭제합니다.

문의 양식은 기존 PROM RECORD Supabase 테이블을 사용하도록 구현했습니다. 기존 컬럼 단위 등록 권한을 그대로 사용하며, 공개 API 문의 등록과 익명 조회 차단 및 테스트 건 삭제를 검증했습니다. 세부 답변 목록과 운영 시 확인할 정보는 [CHATBOT_GUIDE.md](CHATBOT_GUIDE.md)를 참고합니다. 독립 양식은 [contact.html](contact.html)입니다.

추가 검증: `node verify-chatbot.cjs`.
