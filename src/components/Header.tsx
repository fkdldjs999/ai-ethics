import { BrainCircuit, BarChart3, Database, Home } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  onGoHome: () => void;
  onViewStats: () => void;
  onOpenQuestionManager: () => void;
}

export default function Header({
  viewMode,
  onGoHome,
  onViewStats,
  onOpenQuestionManager
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <BrainCircuit className="w-4 h-4 transition-transform group-hover:scale-105" />
          </div>
          <span className="font-bold text-base tracking-tight">AI 윤리 딜레마</span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGoHome}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              viewMode === 'survey'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>설문</span>
          </button>

          <button
            onClick={onViewStats}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              viewMode === 'statistics'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>통계 확인하기</span>
          </button>

          <button
            onClick={onOpenQuestionManager}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            title="Supabase 문항 편집 관리"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">문항 관리</span>
          </button>
        </div>
      </div>
    </header>
  );
}
