export const SUPABASE_TABLES_SQL = `-- ========================================================
-- AI 윤리 딜레마 웹사이트 Supabase 테이블 및 RLS 보안 정책
-- ========================================================

-- 1. 딜레마 문항 테이블 (dilemmas)
-- 문항을 코드에 고정하지 않고 Supabase 테이블에서 동적으로 불러오고 수정합니다.
CREATE TABLE IF NOT EXISTS public.dilemmas (
  id INTEGER PRIMARY KEY,                          -- 딜레마 번호 (1, 2, 3)
  order_num INTEGER NOT NULL UNIQUE,               -- 진행 순서 (1 -> 2 -> 3)
  category TEXT NOT NULL,                          -- 카테고리 (예: 자율주행, 의료, 채용)
  title TEXT NOT NULL,                             -- 딜레마 제목
  description TEXT NOT NULL,                       -- 딜레마 상세 시나리오
  option_a_title TEXT NOT NULL,                    -- 선택지 A 제목
  option_a_description TEXT NOT NULL,              -- 선택지 A 설명
  option_b_title TEXT NOT NULL,                    -- 선택지 B 제목
  option_b_description TEXT NOT NULL,              -- 선택지 B 설명
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 딜레마 테이블 Row Level Security (RLS) 활성화
ALTER TABLE public.dilemmas ENABLE ROW LEVEL SECURITY;

-- RLS 정책 1: 누구나(익명 사용자 포함) 딜레마 문항을 조회할 수 있음
CREATE POLICY "Allow public read access on dilemmas"
  ON public.dilemmas
  FOR SELECT
  TO public
  USING (true);

-- RLS 정책 2: 대시보드에서 문항 추가 및 수정 허용
CREATE POLICY "Allow public insert on dilemmas"
  ON public.dilemmas
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on dilemmas"
  ON public.dilemmas
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);


-- 2. 사용자 응답 수집 테이블 (responses)
-- 수집 정보: 연령(타이핑), 성별('남성'/'여성'), 문항별 선택 및 이유(서술형), 응답 시각
-- 이름은 일체 수집하지 않습니다.
CREATE TABLE IF NOT EXISTS public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age TEXT NOT NULL,                               -- 연령 (예: '24', '35')
  gender TEXT NOT NULL,                            -- 성별 ('남성', '여성')
  dilemma_1_choice TEXT NOT NULL,                  -- 문항 1 선택 ('A' 또는 'B')
  dilemma_1_reason TEXT NOT NULL,                  -- 문항 1 선택 이유 (서술형)
  dilemma_2_choice TEXT NOT NULL,                  -- 문항 2 선택 ('A' 또는 'B')
  dilemma_2_reason TEXT NOT NULL,                  -- 문항 2 선택 이유 (서술형)
  dilemma_3_choice TEXT NOT NULL,                  -- 문항 3 선택 ('A' 또는 'B')
  dilemma_3_reason TEXT NOT NULL,                  -- 문항 3 선택 이유 (서술형)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL -- 응답 시각
);

-- 응답 테이블 Row Level Security (RLS) 활성화
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- RLS 정책 1: 누구나(익명 참여자) 응답을 등록(INSERT)할 수 있음
CREATE POLICY "Allow anonymous participants to insert responses"
  ON public.responses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS 정책 2: 통계 대시보드 및 설문 결과 조회를 위한 SELECT 권한 허용
CREATE POLICY "Allow public read access on responses"
  ON public.responses
  FOR SELECT
  TO public
  USING (true);


-- ========================================================
-- 3. 초기 3개 딜레마 문항 시드 데이터 (Seed Data)
-- ========================================================
INSERT INTO public.dilemmas (id, order_num, category, title, description, option_a_title, option_a_description, option_b_title, option_b_description)
VALUES
(
  1,
  1,
  '자율주행 & 모빌리티',
  '자율주행 차량의 불가피한 긴급 충돌 상황',
  '브레이크 고장으로 긴급 제동이 불가능한 자율주행 차량이 시속 60km로 주행 중입니다. 전방 횡단보도에는 보행자 3명이 건너고 있으며, 핸들을 급격히 꺾으면 콘크리트 방호벽에 충돌하여 차량 탑승자 1명이 중상을 입게 됩니다. AI 시스템은 어떤 결정을 내려야 할까요?',
  '옵션 A: 방호벽 충돌 (보행자 다수 보호)',
  '차량을 방호벽으로 선회하여 탑승자의 중상 위험을 감수하더라도 전방 보행자 3명의 생명을 최우선으로 보호합니다.',
  '옵션 B: 직진 감속 (탑승자 안전 우선)',
  '차량 구매자이자 탑승자의 생명 보호 책무를 최우선으로 하여, 급격한 방향 전환 없이 보행자와의 충돌 위험을 감수합니다.'
),
(
  2,
  2,
  '의료 & 생명공학',
  '의료 AI의 중환자실 병상 및 인공호흡기 긴급 배정',
  '팬데믹 응급 상황으로 중환자실 인공호흡기가 단 1대 남아있습니다. AI 진단 시스템이 두 명의 응급 환자 중 누구에게 기기를 배정할지 최종 판단해야 하는 상황입니다. AI는 어떤 원칙을 우선하여 배정해야 할까요?',
  '옵션 A: 기대 여명 및 완치 확률 극대화',
  '생존 확률 통계와 치료 후 잔여 기대 여명이 객관적으로 가장 높게 예측되는 환자에게 기기를 우선 배정합니다.',
  '옵션 B: 취약계층 보호 및 선착순 공정성',
  '통계적 수명 차이에 따른 차별을 지양하고, 먼저 도착한 순서 또는 사회경제적 의료 취약성을 고려하여 배정합니다.'
),
(
  3,
  3,
  '알고리즘 공정성 & 고용',
  '기업 AI 채용 시스템의 인재 선발 기준',
  '대기업 채용 과정에서 10만 건의 지원서를 심사하는 AI 채용 알고리즘을 도입했습니다. 과거 20년간의 성공적인 직원 데이터에는 역사적·사회적 이유로 특정 계층이나 성별의 비율이 월등히 높았습니다. 채용 AI는 어떤 방식으로 설계되어야 할까요?',
  '옵션 A: 성과 데이터 중심 (실력주의 원칙)',
  '과거 고성과자 데이터에 나타난 객관적 역량과 실적만을 평가 기준으로 삼아 기업 생산성을 극대화합니다.',
  '옵션 B: 데이터 편향 교정 및 다양성 할당',
  '과거 데이터의 구조적 편향을 인정하고, 성별·출신 배경에 보정 가중치를 두어 사회적 기회 균등과 다양성을 확보합니다.'
)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  option_a_title = EXCLUDED.option_a_title,
  option_a_description = EXCLUDED.option_a_description,
  option_b_title = EXCLUDED.option_b_title,
  option_b_description = EXCLUDED.option_b_description,
  updated_at = NOW();
`;
