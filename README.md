# SOCIAL PULSE · SNS KPI Dashboard

배포: https://minji5996-creator.github.io/PROM-DASHBOARD/

## 최신 관측: 2026-11-12

- instagram: 팔로워7,718명. 최근30일 조회51.5만·조회자28.7만·반응1.3만은 축약값으로 정확값 null. 비팔로워96.3%·릴스98.3%로 신규도달 중심. 10월18일 상세 저장745·공유421·팔로우97을 근거로 제작팁 후속편과 프로필 CTA를 시험하세요. 링크32/방문5,054=약0.63%는 횟수비율이지 고유전환율이 아닙니다. 월~일 전체 활동56슬롯에서6AM이 최고이며 토요일2,251명: 시간대 UI미표시라 KST 단정 없이 표시시각 전후 게시를 비교하세요.
  - 출처: https://www.instagram.com/accounts/insights/?timeframe=30

- facebook: [blocked] 지정 프로필과 Facebook 홈 모두 로딩/메인프레임 오류로 Prom Record 계정과28일 필터를 검증하지 못했습니다. 오늘값 null, 과거이력 보존. 복구 후 계정명과 기간부터 재검증하고 누락분을 수집하세요. 다른 계정 자료는 사용하지 않았습니다.
  - 출처: https://www.facebook.com/profile.php?id=61595324797271

- threads: 최근30일(10/13~11/11) 조회3,026·조회자1,565·반응57·순팔로워+4,팔로워2,306명. 비팔로워1,287명(82.2%),한국83%,25~44세71% 표시. 시청자활동 일·월15~18시,화21~24시(GMT+9)에 제작팁/질문형 글을 비교하세요. FLOWER DROP누적235회,TiNG103회. 새SAM3D글 좋아요10·답글3·공유2는11/12 게시후누적으로30일 범위밖입니다. 상세미로딩으로 새글조회수 null,목록의 무라벨카운터는 추정하지 않음. 팔로워증가 차트축 종료11/10은 전체종료11/11과 별도로 보존했습니다.
  - 출처: https://www.threads.com/insights?days=30

- x: 팔로워0·공개글6개 누적조회116회,좋아요·답글·리포스트·북마크 모두0. 새 SAM3D Body/ComfyUI×Blender 글은11/12(KST) 게시·누적4회. 제작과정 영상과 쉬운 질문형 CTA의 반응을 추적하세요. 소표본으로 성패 단정 금지. 기존5개글112회와 신규4회를 구분하며 전체 누적차이를 일별발생량으로 해석하지 않습니다.
  - 출처: https://x.com/promrecord

- youtube: 최근7일(11/4~11/10) 조회7,977·시청65.9시간·순구독자-2,공식 비교 조회9%감소. 상위2개7,589회(95.1%) 집중으로 연관 후속편/엔드스크린을 시험하세요. 최근28일41,077회·순구독자-20,현재19,744명. FLOWER DROP7일16회·평균조회율15.2%로 초반 훅을 소규모 비교하세요. 동일채널ID의 공식표시명 PR WORLD STUDIO 사용, 월간시청자1.6만은7일필터에서도28일 기준. 새 SAM3D영상 처음9시간43분36회·CTR5.2%·평균0:19로 제목·썸네일/초반 장면 실험을 추적하되 초기 성패를 단정하지 마세요.
  - 출처: https://studio.youtube.com/channel/UC0UncCw3Cmx-SHEJa0VoJog/analytics/tab-overview/period-4_weeks

## 집계와 보존
기존 3381행 보존, 187행 추가, 총 3568행. 오디언스 130행 추가. dailyRuns 19개.

Facebook blocked/null. 축약·누락·원본기간 보존, 일별발생량 추정 없음. Instagram 활동7일56슬롯·시간대미표시. GitHub main 반영 및 Pages 자동 배포. [일일 조사 상세](DAILY-2026-11-12.md).

## 메뉴·키워드 기반 챗봇

오른쪽 아래 대화 버튼으로 시작합니다. 생성형 AI/API 호출 없이 `chatbot-flow.json`의 등록 답변과 규칙만 사용합니다. 같은 탭 새로고침 시 sessionStorage로 대화를 복원하며 초기화 시 기록을 삭제합니다.

문의 양식은 기존 PROM RECORD Supabase 테이블을 사용하도록 구현했습니다. 기존 컬럼 단위 등록 권한을 그대로 사용하며, 공개 API 문의 등록과 익명 조회 차단 및 테스트 건 삭제를 검증했습니다. 세부 답변 목록과 운영 시 확인할 정보는 [CHATBOT_GUIDE.md](CHATBOT_GUIDE.md)를 참고합니다. 독립 양식은 [contact.html](contact.html)입니다.

추가 검증: `node verify-chatbot.cjs`.
