# SOCIAL PULSE · SNS KPI Dashboard

배포: https://minji5996-creator.github.io/PROM-DASHBOARD/

## 최신 조사: 2026-11-25

## x
팔로워0·공개글15개(자체답글포함), 게시물 누적조회490회. Preview02는17회·좋아요1, 이전 Preview19회·좋아요1. Game Cinematic 연결글83·71·61회로 관측됐습니다. 첫 장면과 제작과정 후속글 실험을 권장합니다. 누적 관측 차이는 하루 발생량이 아니며 답글5건은 자체 연결글을 포함합니다.

출처: https://x.com/promrecord

## instagram
최근30일 조회수 23.2만(반올림 표시), 비팔로워 표시 비중 95.7. 11월3일 인기 릴스 상세는 저장153·공유142·팔로우89로 확인. 최근7일 조회수3.5만(반올림 표시)이며 프로필방문400. 조회수의 정확한 원시값은 UI에 미표시.

출처: https://www.instagram.com/accounts/insights/?timeframe=30

## threads
최근30일 조회4481·조회자2332·순팔로워+4, 최근7일 조회876·조회자521·순팔로워-2. 30일 조회자 국가 대한민국87%, 활동시간 상위 월·일·목 15~18시(GMT+9). Preview02 누적조회197·프로필방문9·팔로우0으로 관측.

출처: https://www.threads.com/insights?days=30

## youtube
28일 42,289조회 중 aespa 33,748(79.8%); 7일 13,603 중 11,126(81.8%). 28일 순구독자 -5, 7일 +4. 대표 영상 편중이 커 후속 콘텐츠와 재방문 유도를 시험하세요. 총구독자19,752명, 최신 Preview02 186회·좋아요2·평균조회율38%.

출처: https://studio.youtube.com/channel/UC0UncCw3Cmx-SHEJa0VoJog/analytics/hub_overview/explore?entity_type=CHANNEL&entity_id=UC0UncCw3Cmx-SHEJa0VoJog&time_period=4_weeks&explore_type=TABLE_AND_CHART&metrics_computation_type=DELTA&metric=EXTERNAL_VIEWS&granularity=DAY&t_metrics=EXTERNAL_VIEWS&t_metrics=EXTERNAL_WATCH_TIME&t_metrics=SUBSCRIBERS_NET_CHANGE&t_metrics=TOTAL_ESTIMATED_EARNINGS&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS&t_metrics=VIDEO_THUMBNAIL_IMPRESSIONS_VTR&dimension=VIDEO&o_column=EXTERNAL_VIEWS&o_direction=ANALYTICS_ORDER_DIRECTION_DESC

## facebook
[blocked] 오늘 프로필/홈 반복 탐색 시간초과. NEURA나 이력수치 대체 없음.

출처: https://www.facebook.com/profile.php?id=61595324797271

## 집계와 보존
기존 6335개 지표 보존, 172행 추가. 오디언스 277행 추가. 총 6507지표/1722기간/3361오디언스/106게시물/32실행이력.
수집기간과 누적 차이는 일별발생량이 아닙니다.

[일일 조사 상세](DAILY-2026-11-25.md)

## 메뉴·키워드 기반 챗봇

오른쪽 아래 대화 버튼으로 시작합니다. 생성형 AI/API 호출 없이 `chatbot-flow.json`의 등록 답변과 규칙만 사용합니다. 같은 탭 새로고침 시 sessionStorage로 대화를 복원하며 초기화 시 기록을 삭제합니다.

문의 양식은 기존 PROM RECORD Supabase 테이블을 사용하도록 구현했습니다. 기존 컬럼 단위 등록 권한을 그대로 사용하며, 공개 API 문의 등록과 익명 조회 차단 및 테스트 건 삭제를 검증했습니다. 세부 답변 목록과 운영 시 확인할 정보는 [CHATBOT_GUIDE.md](CHATBOT_GUIDE.md)를 참고합니다. 독립 양식은 [contact.html](contact.html)입니다.

추가 검증: `node verify-chatbot.cjs`.
