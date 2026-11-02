import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, HelpCircle, AlertCircle, Send, Scale } from 'lucide-react';
import { Dilemma, SurveyAnswer } from '../types';

interface DilemmaScreenProps {
  dilemma: Dilemma;
  questionNumber: number; // 1, 2, or 3
  totalQuestions: number; // 3
  initialAnswer?: SurveyAnswer;
  onNext: (answer: SurveyAnswer) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export default function DilemmaScreen({
  dilemma,
  questionNumber,
  totalQuestions,
  initialAnswer,
  onNext,
  onBack,
  isSubmitting = false
}: DilemmaScreenProps) {
  const [choice, setChoice] = useState<'A' | 'B' | null>(initialAnswer?.choice || null);
  const [reason, setReason] = useState<string>(initialAnswer?.reason || '');
  const [error, setError] = useState<string>('');

  // Sync state if question changes
  useEffect(() => {
    setChoice(initialAnswer?.choice || null);
    setReason(initialAnswer?.reason || '');
    setError('');
  }, [dilemma.id, initialAnswer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!choice) {
      setError('옵션 A 또는 옵션 B 중 하나를 반드시 선택해주세요.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 5) {
      setError('선택하신 이유를 최소 5자 이상 서술형으로 작성해주세요.');
      return;
    }

    setError('');
    onNext({ choice, reason: reason.trim() });
  };

  const isLastQuestion = questionNumber === totalQuestions;
  const progressPercent = Math.round(((questionNumber) / (totalQuestions + 1)) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold text-indigo-600">
            딜레마 {questionNumber} / {totalQuestions}
          </span>
          <span>진행률 {progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Category & Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2.5">
            <Scale className="w-3.5 h-3.5" />
            <span>{dilemma.category}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            딜레마 {questionNumber}. {dilemma.title}
          </h2>
        </div>

        {/* Scenario Box */}
        <div className="p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-sm text-slate-700 leading-relaxed mb-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>시나리오 상황</span>
          </div>
          <p className="text-slate-800 font-normal leading-relaxed text-sm sm:text-base">
            {dilemma.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Options Selection (A vs B) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900">
                AI 시스템의 결정 선택 <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500">A 또는 B 중 하나를 선택하세요</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A */}
              <button
                type="button"
                onClick={() => {
                  setChoice('A');
                  setError('');
                }}
                className={`p-5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  choice === 'A'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        choice === 'A'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      선택지 A
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        choice === 'A'
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {choice === 'A' && <CheckCircle className="w-4 h-4" />}
                    </div>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">
                    {dilemma.option_a_title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {dilemma.option_a_description}
                  </p>
                </div>
              </button>

              {/* Option B */}
              <button
                type="button"
                onClick={() => {
                  setChoice('B');
                  setError('');
                }}
                className={`p-5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  choice === 'B'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        choice === 'B'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      선택지 B
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        choice === 'B'
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {choice === 'B' && <CheckCircle className="w-4 h-4" />}
                    </div>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">
                    {dilemma.option_b_title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {dilemma.option_b_description}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Descriptive Reason Input (선택 이유 서술형) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="reason-input" className="text-sm font-bold text-slate-900">
                선택 이유 (서술형) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-mono">
                {reason.length}자 (최소 5자 이상 권장)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              해당 옵션을 선택하신 윤리적·철학적 이유 또는 현실적 고려 사항을 자유롭게 적어주세요.
            </p>
            <textarea
              id="reason-input"
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder={`예시: ${
                choice === 'A'
                  ? '인명 피해의 총량을 줄이는 공리주의적 관점에서 다수의 보행자를 보호하는 결정이 더 합리적이라고 생각하기 때문입니다...'
                  : choice === 'B'
                  ? '자율주행차 사용자가 시스템을 신뢰할 수 있으려면 탑승자의 안전 보호가 최우선 약속이어야 한다고 생각하기 때문입니다...'
                  : '위 옵션을 선택한 핵심 이유를 서술해주세요...'
              }`}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 resize-none transition-all outline-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>이전 문항</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>결과 저장 중...</span>
              ) : isLastQuestion ? (
                <>
                  <Send className="w-4 h-4" />
                  <span>최종 제출 및 완료</span>
                </>
              ) : (
                <>
                  <span>다음: 딜레마 {questionNumber + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
