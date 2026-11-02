import { useState } from 'react';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { UserInfo } from '../types';

interface UserInfoScreenProps {
  initialValues: UserInfo;
  onSubmit: (userInfo: UserInfo) => void;
  onBack: () => void;
}

const GENDER_OPTIONS = ['남성', '여성'] as const;

export default function UserInfoScreen({
  initialValues,
  onSubmit,
  onBack
}: UserInfoScreenProps) {
  const [age, setAge] = useState<string>(initialValues.age || '');
  const [gender, setGender] = useState<string>(initialValues.gender || '');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAge = age.trim();

    if (!cleanAge) {
      setError('연령(나이)을 직접 입력해주세요.');
      return;
    }

    if (!gender) {
      setError('성별(남성 또는 여성)을 선택해주세요.');
      return;
    }

    setError('');
    onSubmit({ age: cleanAge, gender });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            기본 정보 입력
          </h2>
          <p className="text-sm text-slate-500">
            연령과 성별을 입력해주세요. (이름은 수집하지 않습니다)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Age (Direct Typing) */}
          <div>
            <label htmlFor="age-input" className="block text-sm font-bold text-slate-800 mb-2">
              연령 <span className="text-rose-500">*</span>
            </label>
            <input
              id="age-input"
              type="text"
              inputMode="numeric"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (error) setError('');
              }}
              placeholder="예: 25"
              maxLength={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {/* 2. Gender (남성 / 여성 Only) */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              성별 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {GENDER_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setGender(option);
                    if (error) setError('');
                  }}
                  className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    gender === option
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs ring-1 ring-indigo-600/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>이전</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
            >
              <span>다음: 딜레마 시작</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
