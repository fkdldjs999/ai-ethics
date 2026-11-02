import { useState, useMemo } from 'react';
import {
  BarChart3,
  Database,
  Download,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  Users,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Dilemma, SurveyResponse } from '../types';
import { DEFAULT_DILEMMAS } from '../lib/defaultDilemmas';

interface DashboardScreenProps {
  dilemmas: Dilemma[];
  responses: SurveyResponse[];
  onUpdateDilemma: (dilemma: Dilemma) => Promise<{ success: boolean; error?: string }>;
  onGoBackToSurvey: () => void;
  initialTab?: 'stats' | 'manage';
}

const AGE_BRACKETS = [
  { key: '10s', label: '10대 이하', range: '19세 이하', test: (age: number) => age < 20 },
  { key: '20s', label: '20대', range: '20~29세', test: (age: number) => age >= 20 && age < 30 },
  { key: '30s', label: '30대', range: '30~39세', test: (age: number) => age >= 30 && age < 40 },
  { key: '40s', label: '40대', range: '40~49세', test: (age: number) => age >= 40 && age < 50 },
  { key: '50s', label: '50대', range: '50~59세', test: (age: number) => age >= 50 && age < 60 },
  { key: '60s', label: '60대 이상', range: '60세 이상', test: (age: number) => age >= 60 }
];

function parseNumericAge(ageStr: string): number | null {
  if (!ageStr) return null;
  const match = ageStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

export default function DashboardScreen({
  dilemmas,
  responses,
  onUpdateDilemma,
  onGoBackToSurvey,
  initialTab = 'stats'
}: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'manage'>(initialTab);

  // Active Dilemma Tab in Stats
  const [activeDilemmaNum, setActiveDilemmaNum] = useState<number>(1);

  // Reason Feed Filters
  const [reasonChoiceFilter, setReasonChoiceFilter] = useState<'all' | 'A' | 'B'>('all');
  const [reasonAgeFilter, setReasonAgeFilter] = useState<string>('all');
  const [reasonGenderFilter, setReasonGenderFilter] = useState<string>('all');

  // Question editing state
  const [editingId, setEditingId] = useState<number>(1);
  const currentEditing = dilemmas.find(d => d.id === editingId) || dilemmas[0];
  const [formCategory, setFormCategory] = useState(currentEditing?.category || '');
  const [formTitle, setFormTitle] = useState(currentEditing?.title || '');
  const [formDescription, setFormDescription] = useState(currentEditing?.description || '');
  const [formOptionATitle, setFormOptionATitle] = useState(currentEditing?.option_a_title || '');
  const [formOptionADesc, setFormOptionADesc] = useState(currentEditing?.option_a_description || '');
  const [formOptionBTitle, setFormOptionBTitle] = useState(currentEditing?.option_b_title || '');
  const [formOptionBDesc, setFormOptionBDesc] = useState(currentEditing?.option_b_description || '');
  const [savingStatus, setSavingStatus] = useState<{ loading: boolean; success?: boolean; error?: string } | null>(null);

  const handleSelectDilemmaToEdit = (id: number) => {
    setEditingId(id);
    const target = dilemmas.find(d => d.id === id);
    if (target) {
      setFormCategory(target.category);
      setFormTitle(target.title);
      setFormDescription(target.description);
      setFormOptionATitle(target.option_a_title);
      setFormOptionADesc(target.option_a_description);
      setFormOptionBTitle(target.option_b_title);
      setFormOptionBDesc(target.option_b_description);
      setSavingStatus(null);
    }
  };

  const handleSaveDilemma = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStatus({ loading: true });

    const updated: Dilemma = {
      ...currentEditing,
      category: formCategory.trim(),
      title: formTitle.trim(),
      description: formDescription.trim(),
      option_a_title: formOptionATitle.trim(),
      option_a_description: formOptionADesc.trim(),
      option_b_title: formOptionBTitle.trim(),
      option_b_description: formOptionBDesc.trim()
    };

    const res = await onUpdateDilemma(updated);
    if (res.success) {
      setSavingStatus({ loading: false, success: true });
      setTimeout(() => setSavingStatus(null), 3000);
    } else {
      setSavingStatus({ loading: false, error: res.error });
    }
  };

  const handleResetToDefault = async () => {
    const defaultItem = DEFAULT_DILEMMAS.find(d => d.id === editingId);
    if (defaultItem) {
      setFormCategory(defaultItem.category);
      setFormTitle(defaultItem.title);
      setFormDescription(defaultItem.description);
      setFormOptionATitle(defaultItem.option_a_title);
      setFormOptionADesc(defaultItem.option_a_description);
      setFormOptionBTitle(defaultItem.option_b_title);
      setFormOptionBDesc(defaultItem.option_b_description);

      setSavingStatus({ loading: true });
      const res = await onUpdateDilemma(defaultItem);
      if (res.success) {
        setSavingStatus({ loading: false, success: true });
        setTimeout(() => setSavingStatus(null), 3000);
      } else {
        setSavingStatus({ loading: false, error: res.error });
      }
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (responses.length === 0) return;

    const headers = [
      '연령',
      '성별',
      '딜레마1_선택',
      '딜레마1_이유',
      '딜레마2_선택',
      '딜레마2_이유',
      '딜레마3_선택',
      '딜레마3_이유',
      '응답시각'
    ];

    const rows = responses.map(r => [
      `"${r.age || ''}"`,
      `"${r.gender || ''}"`,
      `"${r.dilemma_1_choice || ''}"`,
      `"${(r.dilemma_1_reason || '').replace(/"/g, '""')}"`,
      `"${r.dilemma_2_choice || ''}"`,
      `"${(r.dilemma_2_reason || '').replace(/"/g, '""')}"`,
      `"${r.dilemma_3_choice || ''}"`,
      `"${(r.dilemma_3_reason || '').replace(/"/g, '""')}"`,
      `"${r.created_at || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ai_ethics_responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCount = responses.length;

  // Compute detailed statistics for each dilemma by Age Bracket and Gender
  const dilemmaStats = useMemo(() => {
    return [1, 2, 3].map((qNum) => {
      const choiceKey = `dilemma_${qNum}_choice` as keyof SurveyResponse;
      const dTotal = responses.filter(r => r[choiceKey] === 'A' || r[choiceKey] === 'B');
      const totalA = dTotal.filter(r => r[choiceKey] === 'A').length;
      const totalB = dTotal.filter(r => r[choiceKey] === 'B').length;
      const totalAll = totalA + totalB || 1;
      const totalAPercent = Math.round((totalA / totalAll) * 100);
      const totalBPercent = 100 - totalAPercent;

      // 1. By Age Bracket (10-year intervals)
      const byAge = AGE_BRACKETS.map(bracket => {
        const inBracket = dTotal.filter(r => {
          const num = parseNumericAge(r.age);
          return num !== null && bracket.test(num);
        });

        const countA = inBracket.filter(r => r[choiceKey] === 'A').length;
        const countB = inBracket.filter(r => r[choiceKey] === 'B').length;
        const bracketTotal = countA + countB;
        const aPercent = bracketTotal > 0 ? Math.round((countA / bracketTotal) * 100) : 0;
        const bPercent = bracketTotal > 0 ? 100 - aPercent : 0;

        return {
          key: bracket.key,
          label: bracket.label,
          range: bracket.range,
          total: bracketTotal,
          countA,
          countB,
          aPercent,
          bPercent
        };
      });

      // 2. By Gender (남성 / 여성)
      const maleResponses = dTotal.filter(r => r.gender === '남성');
      const femaleResponses = dTotal.filter(r => r.gender === '여성');

      const maleA = maleResponses.filter(r => r[choiceKey] === 'A').length;
      const maleB = maleResponses.filter(r => r[choiceKey] === 'B').length;
      const maleTotal = maleA + maleB;
      const maleAPercent = maleTotal > 0 ? Math.round((maleA / maleTotal) * 100) : 0;
      const maleBPercent = maleTotal > 0 ? 100 - maleAPercent : 0;

      const femaleA = femaleResponses.filter(r => r[choiceKey] === 'A').length;
      const femaleB = femaleResponses.filter(r => r[choiceKey] === 'B').length;
      const femaleTotal = femaleA + femaleB;
      const femaleAPercent = femaleTotal > 0 ? Math.round((femaleA / femaleTotal) * 100) : 0;
      const femaleBPercent = femaleTotal > 0 ? 100 - femaleAPercent : 0;

      return {
        qNum,
        totalAll,
        totalA,
        totalB,
        totalAPercent,
        totalBPercent,
        byAge,
        gender: {
          male: { total: maleTotal, a: maleA, b: maleB, aPercent: maleAPercent, bPercent: maleBPercent },
          female: { total: femaleTotal, a: femaleA, b: femaleB, aPercent: femaleAPercent, bPercent: femaleBPercent }
        }
      };
    });
  }, [responses]);

  // Current selected dilemma stats
  const currentStats = dilemmaStats.find(s => s.qNum === activeDilemmaNum) || dilemmaStats[0];
  const currentDilemma = dilemmas.find(d => d.order_num === activeDilemmaNum) || dilemmas[activeDilemmaNum - 1];

  // Filtered Reasons
  const filteredReasons = useMemo(() => {
    const choiceKey = `dilemma_${activeDilemmaNum}_choice` as keyof SurveyResponse;
    const reasonKey = `dilemma_${activeDilemmaNum}_reason` as keyof SurveyResponse;

    return responses.filter(r => {
      const reasonText = (r[reasonKey] as string) || '';
      if (!reasonText.trim()) return false;

      // Choice filter
      if (reasonChoiceFilter !== 'all' && r[choiceKey] !== reasonChoiceFilter) return false;

      // Gender filter
      if (reasonGenderFilter !== 'all' && r.gender !== reasonGenderFilter) return false;

      // Age bracket filter
      if (reasonAgeFilter !== 'all') {
        const num = parseNumericAge(r.age);
        const bracket = AGE_BRACKETS.find(b => b.key === reasonAgeFilter);
        if (num === null || !bracket || !bracket.test(num)) return false;
      }

      return true;
    });
  }, [responses, activeDilemmaNum, reasonChoiceFilter, reasonGenderFilter, reasonAgeFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200">
        <div>
          <button
            onClick={onGoBackToSurvey}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>설문 화면으로 돌아가기</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            응답 통계 분석
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            총 <span className="font-semibold text-indigo-600 font-mono">{totalCount}명</span>의 익명 응답을 바탕으로 연령대별·성별 선택 결과를 비교합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtab Toggle */}
          <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
              <span>통계 결과</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 inline mr-1" />
              <span>문항 수정</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV 저장</span>
          </button>
        </div>
      </div>

      {activeTab === 'stats' ? (
        /* ================= STATS VIEW ================= */
        <div className="space-y-8">
          {/* Dilemma Question Selector Tabs (1 -> 2 -> 3) */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            {[1, 2, 3].map((num) => {
              const d = dilemmas.find(item => item.order_num === num) || dilemmas[num - 1];
              return (
                <button
                  key={num}
                  onClick={() => setActiveDilemmaNum(num)}
                  className={`flex-1 sm:flex-none text-left px-4 py-2.5 rounded-xl transition-all cursor-pointer border ${
                    activeDilemmaNum === num
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[11px] font-bold text-indigo-600">딜레마 {num}</div>
                  <div className="text-xs sm:text-sm font-semibold truncate max-w-[200px] sm:max-w-xs text-slate-800">
                    {d?.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Question Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
                <span>딜레마 {activeDilemmaNum} · {currentDilemma?.category}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-2">
                {currentDilemma?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentDilemma?.description}
              </p>
            </div>

            {/* Total Overall A vs B Ratio Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>전체 응답 비율 (총 {currentStats.totalAll}명)</span>
                <span className="font-mono text-slate-500">
                  A {currentStats.totalAPercent}% : B {currentStats.totalBPercent}%
                </span>
              </div>

              {/* Stacked Visual Bar */}
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="bg-indigo-600 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500"
                  style={{ width: `${currentStats.totalAPercent}%` }}
                >
                  {currentStats.totalAPercent >= 15 ? `${currentStats.totalAPercent}%` : ''}
                </div>
                <div
                  className="bg-slate-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500"
                  style={{ width: `${currentStats.totalBPercent}%` }}
                >
                  {currentStats.totalBPercent >= 15 ? `${currentStats.totalBPercent}%` : ''}
                </div>
              </div>

              {/* Legends */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">옵션 A: {currentDilemma?.option_a_title}</span>
                    <span className="text-slate-500 font-mono ml-1.5">({currentStats.totalA}명, {currentStats.totalAPercent}%)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">옵션 B: {currentDilemma?.option_b_title}</span>
                    <span className="text-slate-500 font-mono ml-1.5">({currentStats.totalB}명, {currentStats.totalBPercent}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Intuitive Breakdown Grid: 연령대별 (10살 단위) vs 성별 통계 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* 1. 연령대별 통계 (10살 단위) */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>연령대별 선택 통계</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">옵션 A vs 옵션 B</span>
                </div>

                <div className="space-y-3.5">
                  {currentStats.byAge.map((bracket) => (
                    <div key={bracket.key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{bracket.label}</span>
                          <span className="text-slate-400 text-[11px]">({bracket.range})</span>
                        </div>

                        {bracket.total > 0 ? (
                          <div className="flex items-center gap-2 text-[11px] font-mono">
                            <span className="text-indigo-600 font-bold">A: {bracket.aPercent}% ({bracket.countA}명)</span>
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-600 font-bold">B: {bracket.bPercent}% ({bracket.countB}명)</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">응답 없음</span>
                        )}
                      </div>

                      {/* Bar */}
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                        {bracket.total > 0 ? (
                          <>
                            <div
                              className="bg-indigo-600 h-full transition-all duration-300"
                              style={{ width: `${bracket.aPercent}%` }}
                              title={`옵션 A: ${bracket.aPercent}% (${bracket.countA}명)`}
                            />
                            <div
                              className="bg-slate-400 h-full transition-all duration-300"
                              style={{ width: `${bracket.bPercent}%` }}
                              title={`옵션 B: ${bracket.bPercent}% (${bracket.countB}명)`}
                            />
                          </>
                        ) : (
                          <div className="w-full h-full bg-slate-100" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. 성별 통계 (남성 vs 여성) */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>성별 선택 통계 (남성 vs 여성)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">옵션 A vs 옵션 B</span>
                </div>

                <div className="space-y-6 pt-1">
                  {/* 남성 통계 */}
                  <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 text-sm">남성 참여자</span>
                      <span className="font-mono text-slate-500 text-xs">총 {currentStats.gender.male.total}명</span>
                    </div>

                    {currentStats.gender.male.total > 0 ? (
                      <>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                          <div
                            className="bg-indigo-600 h-full transition-all duration-300"
                            style={{ width: `${currentStats.gender.male.aPercent}%` }}
                          />
                          <div
                            className="bg-slate-400 h-full transition-all duration-300"
                            style={{ width: `${currentStats.gender.male.bPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-0.5">
                          <span className="text-indigo-600 font-bold">
                            옵션 A: {currentStats.gender.male.aPercent}% ({currentStats.gender.male.a}명)
                          </span>
                          <span className="text-slate-600 font-bold">
                            옵션 B: {currentStats.gender.male.bPercent}% ({currentStats.gender.male.b}명)
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 py-2">남성 응답자가 없습니다.</div>
                    )}
                  </div>

                  {/* 여성 통계 */}
                  <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 text-sm">여성 참여자</span>
                      <span className="font-mono text-slate-500 text-xs">총 {currentStats.gender.female.total}명</span>
                    </div>

                    {currentStats.gender.female.total > 0 ? (
                      <>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                          <div
                            className="bg-indigo-600 h-full transition-all duration-300"
                            style={{ width: `${currentStats.gender.female.aPercent}%` }}
                          />
                          <div
                            className="bg-slate-400 h-full transition-all duration-300"
                            style={{ width: `${currentStats.gender.female.bPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-0.5">
                          <span className="text-indigo-600 font-bold">
                            옵션 A: {currentStats.gender.female.aPercent}% ({currentStats.gender.female.a}명)
                          </span>
                          <span className="text-slate-600 font-bold">
                            옵션 B: {currentStats.gender.female.bPercent}% ({currentStats.gender.female.b}명)
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 py-2">여성 응답자가 없습니다.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reasons Feed Section with Filter by Age Bracket & Gender */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>딜레마 {activeDilemmaNum} 선택 이유 상세 피드</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  참여자들이 직접 남긴 서술형 근거를 연령대와 성별로 필터링하여 확인하세요.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Choice Filter */}
                <select
                  value={reasonChoiceFilter}
                  onChange={(e) => setReasonChoiceFilter(e.target.value as 'all' | 'A' | 'B')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium outline-none"
                >
                  <option value="all">전체 선택지 (A+B)</option>
                  <option value="A">옵션 A 선택자만</option>
                  <option value="B">옵션 B 선택자만</option>
                </select>

                {/* Age Bracket Filter (10-year intervals) */}
                <select
                  value={reasonAgeFilter}
                  onChange={(e) => setReasonAgeFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium outline-none"
                >
                  <option value="all">전체 연령대</option>
                  {AGE_BRACKETS.map(b => (
                    <option key={b.key} value={b.key}>{b.label}</option>
                  ))}
                </select>

                {/* Gender Filter */}
                <select
                  value={reasonGenderFilter}
                  onChange={(e) => setReasonGenderFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium outline-none"
                >
                  <option value="all">전체 성별</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>
            </div>

            {filteredReasons.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                해당 필터 조건에 일치하는 서술형 응답이 아직 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredReasons.map((res, index) => {
                  const choiceKey = `dilemma_${activeDilemmaNum}_choice` as keyof SurveyResponse;
                  const reasonKey = `dilemma_${activeDilemmaNum}_reason` as keyof SurveyResponse;
                  const choice = res[choiceKey];
                  const reason = res[reasonKey] as string;

                  return (
                    <div
                      key={res.id || index}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold text-[11px] ${
                              choice === 'A'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            옵션 {choice}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {res.age}세 · {res.gender}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {res.created_at ? new Date(res.created_at).toLocaleDateString() : ''}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        "{reason}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= QUESTION EDITOR VIEW ================= */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                딜레마 문항 직접 수정
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                수정 후 저장하면 설문 화면에 즉시 적용됩니다.
              </p>
            </div>

            {/* Dilemma Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {dilemmas.map((d, idx) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSelectDilemmaToEdit(d.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    editingId === d.id
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  딜레마 {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveDilemma} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  분야 카테고리
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  문항 제목
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                딜레마 시나리오 설명
              </label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-2.5">
                <div className="text-xs font-bold text-indigo-700">선택지 A</div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">라벨</label>
                  <input
                    type="text"
                    value={formOptionATitle}
                    onChange={(e) => setFormOptionATitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">설명</label>
                  <textarea
                    rows={2}
                    value={formOptionADesc}
                    onChange={(e) => setFormOptionADesc(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white resize-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                <div className="text-xs font-bold text-slate-700">선택지 B</div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">라벨</label>
                  <input
                    type="text"
                    value={formOptionBTitle}
                    onChange={(e) => setFormOptionBTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">설명</label>
                  <textarea
                    rows={2}
                    value={formOptionBDesc}
                    onChange={(e) => setFormOptionBDesc(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {savingStatus?.success && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>문항이 저장되었습니다. 설문에 즉시 반영됩니다.</span>
              </div>
            )}

            {savingStatus?.error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>저장 오류: {savingStatus.error}</span>
              </div>
            )}

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>기본값으로 되돌리기</span>
              </button>

              <button
                type="submit"
                disabled={savingStatus?.loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingStatus?.loading ? '저장 중...' : '문항 변경사항 저장'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
