import { Dilemma } from '../types';

export const DEFAULT_DILEMMAS: Dilemma[] = [
  {
    id: 1,
    order_num: 1,
    category: '자율주행 & 모빌리티',
    title: '자율주행 차량의 불가피한 긴급 충돌 상황',
    description: '브레이크 고장으로 긴급 제동이 불가능한 자율주행 차량이 시속 60km로 주행 중입니다. 전방 횡단보도에는 보행자 3명이 건너고 있으며, 핸들을 급격히 꺾으면 콘크리트 방호벽에 충돌하여 차량 탑승자 1명이 중상을 입게 됩니다. AI 시스템은 어떤 결정을 내려야 할까요?',
    option_a_title: '옵션 A: 방호벽 충돌 (보행자 다수 보호)',
    option_a_description: '차량을 방호벽으로 선회하여 탑승자의 중상 위험을 감수하더라도 전방 보행자 3명의 생명을 최우선으로 보호합니다.',
    option_b_title: '옵션 B: 직진 감속 (탑승자 안전 우선)',
    option_b_description: '차량 구매자이자 탑승자의 생명 보호 책무를 최우선으로 하여, 급격한 방향 전환 없이 보행자와의 충돌 위험을 감수합니다.',
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    order_num: 2,
    category: '의료 & 생명공학',
    title: '의료 AI의 중환자실 병상 및 인공호흡기 긴급 배정',
    description: '팬데믹 응급 상황으로 중환자실 인공호흡기가 단 1대 남아있습니다. AI 진단 시스템이 두 명의 응급 환자 중 누구에게 기기를 배정할지 최종 판단해야 하는 상황입니다. AI는 어떤 원칙을 우선하여 배정해야 할까요?',
    option_a_title: '옵션 A: 기대 여명 및 완치 확률 극대화',
    option_a_description: '생존 확률 통계와 치료 후 잔여 기대 여명이 객관적으로 가장 높게 예측되는 환자에게 기기를 우선 배정합니다.',
    option_b_title: '옵션 B: 취약계층 보호 및 선착순 공정성',
    option_b_description: '통계적 수명 차이에 따른 차별을 지양하고, 먼저 도착한 순서 또는 사회경제적 의료 취약성을 고려하여 배정합니다.',
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    order_num: 3,
    category: '알고리즘 공정성 & 고용',
    title: '기업 AI 채용 시스템의 인재 선발 기준',
    description: '대기업 채용 과정에서 10만 건의 지원서를 심사하는 AI 채용 알고리즘을 도입했습니다. 과거 20년간의 성공적인 직원 데이터에는 역사적·사회적 이유로 특정 계층이나 성별의 비율이 월등히 높았습니다. 채용 AI는 어떤 방식으로 설계되어야 할까요?',
    option_a_title: '옵션 A: 성과 데이터 중심 (실력주의 원칙)',
    option_a_description: '과거 고성과자 데이터에 나타난 객관적 역량과 실적만을 평가 기준으로 삼아 기업 생산성을 극대화합니다.',
    option_b_title: '옵션 B: 데이터 편향 교정 및 다양성 할당',
    option_b_description: '과거 데이터의 구조적 편향을 인정하고, 성별·출신 배경에 보정 가중치를 두어 사회적 기회 균등과 다양성을 확보합니다.',
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_SAMPLE_RESPONSES = [
  {
    id: 'sample-1',
    age: '18',
    gender: '여성',
    dilemma_1_choice: 'A' as const,
    dilemma_1_reason: '더 많은 사람의 생명을 구하는 것이 기본적으로 옳다고 생각합니다.',
    dilemma_2_choice: 'B' as const,
    dilemma_2_reason: '취약 계층에게도 동등한 의료 접근 기회가 보장되어야 합니다.',
    dilemma_3_choice: 'B' as const,
    dilemma_3_reason: '기회의 평등과 다양성이 장기적으로 사회를 건강하게 만듭니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'sample-2',
    age: '24',
    gender: '남성',
    dilemma_1_choice: 'A' as const,
    dilemma_1_reason: '인명 피해의 총량을 줄이는 공리주의적 관점에서 다수 보행자 보호가 합리적입니다.',
    dilemma_2_choice: 'A' as const,
    dilemma_2_reason: '한정된 자원에서는 살릴 확률이 높은 환자에게 집중하는 것이 의료 자원의 효율을 높입니다.',
    dilemma_3_choice: 'B' as const,
    dilemma_3_reason: '과거의 편향된 데이터를 그대로 답습하면 영원히 불평등이 고착화될 위험이 있습니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: 'sample-3',
    age: '28',
    gender: '여성',
    dilemma_1_choice: 'A' as const,
    dilemma_1_reason: '보행자 3명의 생명을 지키는 것이 인명 피해를 최소화하는 길입니다.',
    dilemma_2_choice: 'B' as const,
    dilemma_2_reason: '기대 수명만으로 생명의 우선순위를 정하는 것은 윤리적으로 매우 위험합니다.',
    dilemma_3_choice: 'B' as const,
    dilemma_3_reason: '소외 계층의 기회 확대를 위한 의도적 가중치 보정이 필요합니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  },
  {
    id: 'sample-4',
    age: '32',
    gender: '여성',
    dilemma_1_choice: 'B' as const,
    dilemma_1_reason: '소비자가 차량을 구매하고 신뢰하는 기본 이유는 탑승자의 안전 보호이기 때문입니다.',
    dilemma_2_choice: 'A' as const,
    dilemma_2_reason: '의료 현장에서는 객관적 회복 지표를 기준으로 결정해야 의료진의 도덕적 혼란이 적습니다.',
    dilemma_3_choice: 'A' as const,
    dilemma_3_reason: '역차별을 막고 실력과 성과에 기반한 선발이 가장 객관적입니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'sample-5',
    age: '36',
    gender: '남성',
    dilemma_1_choice: 'B' as const,
    dilemma_1_reason: '탑승자가 위험을 예측할 수 없는 상황에서 탑승자를 보호하지 않으면 자율주행차 보급이 어렵습니다.',
    dilemma_2_choice: 'A' as const,
    dilemma_2_reason: '긴급 트리아지 상황에서는 생존율 극대화가 우선 원칙이어야 합니다.',
    dilemma_3_choice: 'A' as const,
    dilemma_3_reason: '기업 경쟁력 확보를 위해서는 성과 예측도가 높은 인재를 우선해야 합니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString()
  },
  {
    id: 'sample-6',
    age: '45',
    gender: '남성',
    dilemma_1_choice: 'A' as const,
    dilemma_1_reason: '보행자 다수를 구하는 것이 사회 전체의 피해를 최소화합니다.',
    dilemma_2_choice: 'A' as const,
    dilemma_2_reason: '치료 효과가 극대화되는 환자에게 배정하는 것이 공공보건 관점에서 합당합니다.',
    dilemma_3_choice: 'A' as const,
    dilemma_3_reason: '인위적인 역차별 논란을 방지하고 철저한 성과주의가 조직에 공정합니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'sample-7',
    age: '48',
    gender: '여성',
    dilemma_1_choice: 'A' as const,
    dilemma_1_reason: '탑승자 1명의 부상보다 보행자 3명의 사망을 막는 것이 우선입니다.',
    dilemma_2_choice: 'B' as const,
    dilemma_2_reason: '의료 접근성이 낮은 계층에게도 공평한 기회가 주어져야 합니다.',
    dilemma_3_choice: 'B' as const,
    dilemma_3_reason: '다양성 보정이 결국 기업의 문화적 혁신을 촉진할 것입니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString()
  },
  {
    id: 'sample-8',
    age: '54',
    gender: '남성',
    dilemma_1_choice: 'B' as const,
    dilemma_1_reason: '자율주행차가 탑승자를 희생시키도록 프로그래밍되면 아무도 차를 타지 않을 것입니다.',
    dilemma_2_choice: 'B' as const,
    dilemma_2_reason: '단순한 수명 수치 비교로 인간의 삶의 가치를 재단해서는 안 됩니다.',
    dilemma_3_choice: 'A' as const,
    dilemma_3_reason: '채용 기준은 공정한 능력 평가여야 조직 신뢰가 유지됩니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
  },
  {
    id: 'sample-9',
    age: '62',
    gender: '여성',
    dilemma_1_choice: 'B' as const,
    dilemma_1_reason: '기계가 인위적으로 탑승자를 벽으로 몰아 사지로 모는 것은 받아들이기 어렵습니다.',
    dilemma_2_choice: 'B' as const,
    dilemma_2_reason: '나이가 많다고 해서 치료 우선순위에서 밀려나는 방식은 비인도적입니다.',
    dilemma_3_choice: 'B' as const,
    dilemma_3_reason: '우리 사회의 구조적 불평등을 완화하기 위한 제도적 노력이 필요합니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];
