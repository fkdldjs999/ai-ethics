import { ArrowRight, BarChart3, BrainCircuit } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  onViewStats: () => void;
}

export default function StartScreen({ onStart, onViewStats }: StartScreenProps) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Subtle Brand Icon */}
        <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
          <BrainCircuit className="w-7 h-7" />
        </div>

        {/* Title & Short Description */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          AI 윤리 딜레마
        </h1>
        <p className="text-slate-600 text-base mb-10 leading-relaxed font-normal">
          인공지능이 마주할 선택의 순간,<br />
          당신의 선택과 이유를 들려주세요.
        </p>

        {/* Exactly 2 Buttons */}
        <div className="space-y-3.5">
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-base rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer group"
          >
            <span>설문 시작하기</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onViewStats}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-base rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>통계 확인하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
