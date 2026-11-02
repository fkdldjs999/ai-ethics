import { useState } from 'react';
import { Copy, Check, Database, ShieldCheck, Terminal, ExternalLink, RefreshCw, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SUPABASE_TABLES_SQL } from '../lib/sqlScripts';
import { testSupabaseConnection, isSupabaseConfigured } from '../lib/supabase';

interface SqlGuideModalProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function SqlGuideModal({ onClose, isModal = false }: SqlGuideModalProps) {
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<{ loading: boolean; connected?: boolean; message?: string } | null>(null);

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_TABLES_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy SQL', e);
    }
  };

  const handleRunConnectionTest = async () => {
    setTestResult({ loading: true });
    const result = await testSupabaseConnection();
    setTestResult({
      loading: false,
      connected: result.connected,
      message: result.message
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Supabase & Vercel 설정 가이드</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Supabase 테이블 생성 SQL 및 RLS 보안 정책
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            아래 SQL을 Supabase 프로젝트의 <strong>SQL Editor</strong>에 복사하여 붙여넣고 [Run]을 누르면 즉시 준비가 완료됩니다.
          </p>
        </div>

        {onClose && isModal && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            닫기
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Connection Status Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSupabaseConfigured
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  현재 Supabase 연동 상태:{' '}
                  <span className={isSupabaseConfigured ? 'text-emerald-700' : 'text-amber-700'}>
                    {isSupabaseConfigured ? '연동 완료 (.env 키 설정됨)' : '로컬 모드 동작 중'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isSupabaseConfigured
                    ? '환경 변수가 감지되었습니다. 아래 테스트 버튼으로 DB 쿼리를 확인하세요.'
                    : 'Vercel 또는 로컬 .env에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 추가하면 바로 연결됩니다.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleRunConnectionTest}
              disabled={testResult?.loading}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testResult?.loading ? 'animate-spin' : ''}`} />
              <span>연결 상태 테스트</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`mt-4 p-3.5 rounded-xl text-xs font-medium border flex items-start gap-2 ${
                testResult.connected
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.connected ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* 1. Supabase SQL Snippet with Copy */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
          <div className="px-5 py-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-medium text-slate-300">
                supabase_schema_rls.sql
              </span>
            </div>

            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>복사되었습니다!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>SQL 전체 복사하기</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[380px]">
            <pre className="text-xs font-mono text-slate-300 leading-relaxed">
              <code>{SUPABASE_TABLES_SQL}</code>
            </pre>
          </div>
        </div>

        {/* 2. Step-by-Step Execution Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Supabase Step */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">1</span>
              <span>Supabase 데이터베이스 세팅</span>
            </div>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  Supabase 대시보드 <ExternalLink className="w-3 h-3" />
                </a>
                에서 새 프로젝트를 생성합니다.
              </li>
              <li>좌측 메뉴에서 <strong>SQL Editor</strong>로 이동합니다.</li>
              <li>위의 <strong>[SQL 전체 복사하기]</strong> 버튼을 눌러 코드를 붙여넣고 <strong>[Run]</strong>을 클릭합니다.</li>
              <li><code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">dilemmas</code> 및 <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">responses</code> 테이블과 RLS 정책이 자동 생성됩니다.</li>
            </ol>
          </div>

          {/* Vercel Deployment Step */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">2</span>
              <span>Vercel 배포 및 환경 변수 설정</span>
            </div>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Supabase의 <strong>Project Settings → API</strong>에서 URL 및 anon key를 복사합니다.</li>
              <li>Vercel의 프로젝트 <strong>Settings → Environment Variables</strong>에 추가합니다:</li>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div>VITE_SUPABASE_URL = "https://xxxx.supabase.co"</div>
                <div>VITE_SUPABASE_ANON_KEY = "eyJh..."</div>
              </div>
              <li>Vercel에 배포(Deploy)하면 어디서나 실시간으로 응답이 수집됩니다.</li>
            </ol>
          </div>
        </div>

        {/* 3. Privacy & RLS Architecture Explanation */}
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>RLS (Row Level Security) 및 개인정보 비수집 원칙</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <strong className="text-slate-900 block mb-1">익명 응답 테이블 (responses)</strong>
              사용자 등록 시 이름, 전화번호, 이메일 컬럼이 존재하지 않으며, 오직 <code className="bg-emerald-100 px-1 rounded text-emerald-900">age_group, gender, 선택지, 서술이유, 응답시각</code>만 기록됩니다. RLS 정책으로 익명(anon) 누구나 설문을 제출할 수 있습니다.
            </div>
            <div>
              <strong className="text-slate-900 block mb-1">동적 문항 테이블 (dilemmas)</strong>
              문항이 프론트엔드 코드에 고정되지 않고 DB에서 실시간 조회됩니다. 대시보드에서 수정하면 SQL이나 코드 재배포 없이 즉시 딜레마 내용이 변경됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
