import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Dilemma, SurveyResponse } from '../types';
import { DEFAULT_DILEMMAS, INITIAL_SAMPLE_RESPONSES } from './defaultDilemmas';

// Check if valid Supabase environment variables are provided
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials exist and are not placeholder values
export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl !== 'https://your-project.supabase.co' &&
  !rawUrl.includes('your-project') &&
  rawKey !== 'your-anon-key-here'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(rawUrl, rawKey)
  : null;

// Local storage keys for fallback offline mode
const LOCAL_STORAGE_DILEMMAS_KEY = 'ai_ethics_dilemmas_v1';
const LOCAL_STORAGE_RESPONSES_KEY = 'ai_ethics_responses_v1';

export function getLocalDilemmas(): Dilemma[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_DILEMMAS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to read dilemmas from localStorage', e);
  }
  return DEFAULT_DILEMMAS;
}

export function saveLocalDilemmas(dilemmas: Dilemma[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_DILEMMAS_KEY, JSON.stringify(dilemmas));
  } catch (e) {
    console.warn('Failed to write dilemmas to localStorage', e);
  }
}

export function getLocalResponses(): SurveyResponse[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_RESPONSES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to read responses from localStorage', e);
  }
  return INITIAL_SAMPLE_RESPONSES;
}

export function saveLocalResponse(response: SurveyResponse) {
  try {
    const current = getLocalResponses();
    const updated = [response, ...current];
    localStorage.setItem(LOCAL_STORAGE_RESPONSES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to write responses to localStorage', e);
  }
}

/**
 * 딜레마 목록 조회 (Supabase 우선, 연결 실패 시 로컬 캐시/기본값)
 */
export async function fetchDilemmas(): Promise<{ data: Dilemma[]; source: 'supabase' | 'local' }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('dilemmas')
        .select('*')
        .order('order_num', { ascending: true });

      if (!error && data && data.length > 0) {
        saveLocalDilemmas(data as Dilemma[]);
        return { data: data as Dilemma[], source: 'supabase' };
      }
      if (error) {
        console.warn('Supabase fetchDilemmas error, using local fallback:', error.message);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, fallback to local:', err);
    }
  }
  return { data: getLocalDilemmas(), source: 'local' };
}

/**
 * 딜레마 문항 수정/업데이트 (대시보드에서 직접 수정)
 */
export async function updateDilemma(dilemma: Dilemma): Promise<{ success: boolean; error?: string }> {
  // Always update local storage first
  const current = getLocalDilemmas();
  const updated = current.map(d => (d.id === dilemma.id ? { ...dilemma, updated_at: new Date().toISOString() } : d));
  saveLocalDilemmas(updated);

  if (supabase) {
    try {
      const { error } = await supabase
        .from('dilemmas')
        .upsert({
          id: dilemma.id,
          order_num: dilemma.order_num,
          category: dilemma.category,
          title: dilemma.title,
          description: dilemma.description,
          option_a_title: dilemma.option_a_title,
          option_a_description: dilemma.option_a_description,
          option_b_title: dilemma.option_b_title,
          option_b_description: dilemma.option_b_description,
          updated_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: errorMsg };
    }
  }

  return { success: true };
}

/**
 * 설문 응답 저장 (이름 미포함, 익명 수집)
 */
export async function submitSurveyResponse(response: SurveyResponse): Promise<{ success: boolean; id?: string; error?: string }> {
  // Always save locally
  const newResponse: SurveyResponse = {
    ...response,
    id: response.id || `local-${Date.now()}`,
    created_at: response.created_at || new Date().toISOString()
  };
  saveLocalResponse(newResponse);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('responses')
        .insert([
          {
            age: response.age,
            gender: response.gender,
            dilemma_1_choice: response.dilemma_1_choice,
            dilemma_1_reason: response.dilemma_1_reason,
            dilemma_2_choice: response.dilemma_2_choice,
            dilemma_2_reason: response.dilemma_2_reason,
            dilemma_3_choice: response.dilemma_3_choice,
            dilemma_3_reason: response.dilemma_3_reason
          }
        ])
        .select();

      if (error) {
        console.warn('Supabase submit response warning:', error.message);
        return { success: true, id: newResponse.id }; // Still successful locally
      }
      return { success: true, id: data?.[0]?.id || newResponse.id };
    } catch (err) {
      console.warn('Supabase submit failed, saved locally:', err);
      return { success: true, id: newResponse.id };
    }
  }

  return { success: true, id: newResponse.id };
}

/**
 * 수집된 모든 응답 목록 조회
 */
export async function fetchAllResponses(): Promise<{ data: SurveyResponse[]; source: 'supabase' | 'local' }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { data: data as SurveyResponse[], source: 'supabase' };
      }
      if (error) {
        console.warn('Supabase fetchAllResponses error, using local:', error.message);
      }
    } catch (err) {
      console.warn('Supabase responses fetch failed:', err);
    }
  }
  return { data: getLocalResponses(), source: 'local' };
}

/**
 * Supabase 연결 상태 테스트
 */
export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{ connected: boolean; message: string }> {
  try {
    const url = customUrl || rawUrl;
    const key = customKey || rawKey;

    if (!url || !key || url.includes('your-project') || key.includes('your-anon-key')) {
      return {
        connected: false,
        message: 'Supabase URL 또는 Anon Key가 설정되지 않았습니다 (.env 파일 확인 필요).'
      };
    }

    const testClient = createClient(url, key);
    const { error } = await testClient.from('dilemmas').select('id').limit(1);

    if (error) {
      if (error.code === '42P01') {
        return {
          connected: true,
          message: 'Supabase 연결 성공! 단, dilemmas 테이블이 아직 생성되지 않았습니다. [SQL & 설정 안내] 탭의 SQL을 실행해주세요.'
        };
      }
      return {
        connected: false,
        message: `Supabase 응답 오류: ${error.message} (코드: ${error.code})`
      };
    }

    return {
      connected: true,
      message: 'Supabase 데이터베이스에 정상적으로 연결되었습니다.'
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: `연결 실패: ${msg}`
    };
  }
}
