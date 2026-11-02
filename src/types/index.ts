export interface Dilemma {
  id: number;
  order_num: number;
  category: string;
  title: string;
  description: string;
  option_a_title: string;
  option_a_description: string;
  option_b_title: string;
  option_b_description: string;
  updated_at?: string;
}

export interface UserInfo {
  age: string;    // 직접 타이핑한 연령 (예: '24', '35')
  gender: string; // '남성' | '여성'
}

export interface SurveyAnswer {
  choice: 'A' | 'B';
  reason: string;
}

export interface SurveyResponse {
  id?: string;
  age: string;    // 연령 (이름 절대 미수집)
  gender: string; // 성별 ('남성' | '여성')
  dilemma_1_choice: 'A' | 'B';
  dilemma_1_reason: string;
  dilemma_2_choice: 'A' | 'B';
  dilemma_2_reason: string;
  dilemma_3_choice: 'A' | 'B';
  dilemma_3_reason: string;
  created_at?: string;
}

export type SurveyStep = 
  | 'start' 
  | 'user_info' 
  | 'dilemma_1' 
  | 'dilemma_2' 
  | 'dilemma_3' 
  | 'completed';

export type ViewMode = 'survey' | 'statistics';
