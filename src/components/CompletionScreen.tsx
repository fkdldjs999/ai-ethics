import { CheckCircle2, BarChart3, RotateCcw } from 'lucide-react';
import { Dilemma, SurveyResponse } from '../types';

interface CompletionScreenProps {
  response: SurveyResponse;
  dilemmas: Dilemma[];
  onViewStats: () => void;
  onResetSurvey: () => void;
}

export default function CompletionScreen({
  response,
  dilemmas,
  onViewStats,
  onResetSurvey
}: CompletionScreenProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 text-center">
        {/* Completion Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          설문이 완료되었습니다
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mb-8">
          소중한 의견을 남겨주셔서 감사합니다. ({response.age}세 · {response.gender})
        </p>

        {/* Quick Summary of User's Choices */}
        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80 mb-10 text-left space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            내가 선택한 결정
          </div>
          {([1, 2, 3] as const).map((qNum) => {
            const dilemma = dilemmas.find(d => d.order_num === qNum) || dilemmas[qNum - 1];
            const choiceKey = `dilemma_${qNum}_choice` as keyof SurveyResponse;
            const reasonKey = `dilemma_${qNum}_reason` as keyof SurveyResponse;
            const choice = response[choiceKey];
            const reason = response[reasonKey] as string;

            return (
              <div key={qNum} className="text-xs sm:text-sm border-b border-slate-200/60 pb-2.5 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-slate-800">
                    딜레마 {qNum}. {dilemma?.title}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-xs shrink-0">
                    옵션 {choice}
                  </span>
                </div>
                <p className="text-slate-600 text-xs italic line-clamp-2">
                  "{reason}"
                </p>
              </div>
            );
          })}
        </div>

        {/* The Exact Requested Element: '다른 사람은 어떻게 답했을까요?' and '통계 확인하기' */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            다른 사람은 어떻게 답했을까요?
          </h2>

          <button
            onClick={onViewStats}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-base rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            <BarChart3 className="w-5 h-5" />
            <span>통계 확인하기</span>
          </button>
        </div>

        {/* Back to Start Option */}
        <div className="mt-8">
          <button
            onClick={onResetSurvey}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>처음 화면으로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
