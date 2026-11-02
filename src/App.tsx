/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import UserInfoScreen from './components/UserInfoScreen';
import DilemmaScreen from './components/DilemmaScreen';
import CompletionScreen from './components/CompletionScreen';
import DashboardScreen from './components/DashboardScreen';
import {
  Dilemma,
  UserInfo,
  SurveyAnswer,
  SurveyResponse,
  SurveyStep,
  ViewMode
} from './types';
import {
  fetchDilemmas,
  fetchAllResponses,
  submitSurveyResponse,
  updateDilemma
} from './lib/supabase';
import { DEFAULT_DILEMMAS } from './lib/defaultDilemmas';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('survey');
  const [currentStep, setCurrentStep] = useState<SurveyStep>('start');

  // Dilemmas & Responses
  const [dilemmas, setDilemmas] = useState<Dilemma[]>(DEFAULT_DILEMMAS);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active survey data
  const [userInfo, setUserInfo] = useState<UserInfo>({ age: '', gender: '' });
  const [answers, setAnswers] = useState<Record<number, SurveyAnswer>>({});
  const [lastSubmittedResponse, setLastSubmittedResponse] = useState<SurveyResponse | null>(null);

  // Initial dashboard subtab
  const [dashInitialTab, setDashInitialTab] = useState<'stats' | 'manage'>('stats');

  const loadData = useCallback(async () => {
    try {
      const [dilemmasRes, responsesRes] = await Promise.all([
        fetchDilemmas(),
        fetchAllResponses()
      ]);

      if (dilemmasRes.data && dilemmasRes.data.length > 0) {
        setDilemmas(dilemmasRes.data);
      }
      if (responsesRes.data) {
        setResponses(responsesRes.data);
      }
    } catch (err) {
      console.error('Failed to load dilemmas or responses', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Survey Flow Handlers
  const handleStartSurvey = () => {
    setViewMode('survey');
    setCurrentStep('user_info');
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setCurrentStep('dilemma_1');
  };

  const handleDilemma1Next = (ans: SurveyAnswer) => {
    setAnswers(prev => ({ ...prev, 1: ans }));
    setCurrentStep('dilemma_2');
  };

  const handleDilemma2Next = (ans: SurveyAnswer) => {
    setAnswers(prev => ({ ...prev, 2: ans }));
    setCurrentStep('dilemma_3');
  };

  const handleDilemma3Submit = async (ans: SurveyAnswer) => {
    const updatedAnswers: Record<number, SurveyAnswer> = { ...answers, 3: ans };
    setAnswers(updatedAnswers);
    setIsSubmitting(true);

    const fullResponse: SurveyResponse = {
      age: userInfo.age,
      gender: userInfo.gender,
      dilemma_1_choice: updatedAnswers[1]?.choice || 'A',
      dilemma_1_reason: updatedAnswers[1]?.reason || '',
      dilemma_2_choice: updatedAnswers[2]?.choice || 'A',
      dilemma_2_reason: updatedAnswers[2]?.reason || '',
      dilemma_3_choice: updatedAnswers[3]?.choice || 'A',
      dilemma_3_reason: updatedAnswers[3]?.reason || '',
      created_at: new Date().toISOString()
    };

    try {
      await submitSurveyResponse(fullResponse);
      setLastSubmittedResponse(fullResponse);
      setResponses(prev => [fullResponse, ...prev]);
      setCurrentStep('completed');
    } catch (err) {
      console.error('Error submitting response:', err);
      setLastSubmittedResponse(fullResponse);
      setCurrentStep('completed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSurvey = () => {
    setUserInfo({ age: '', gender: '' });
    setAnswers({});
    setLastSubmittedResponse(null);
    setCurrentStep('start');
    setViewMode('survey');
  };

  const handleViewStats = () => {
    setDashInitialTab('stats');
    setViewMode('statistics');
  };

  const handleOpenQuestionManager = () => {
    setDashInitialTab('manage');
    setViewMode('statistics');
  };

  // Dilemma Update handler
  const handleUpdateDilemma = async (updatedDilemma: Dilemma) => {
    const res = await updateDilemma(updatedDilemma);
    if (res.success) {
      setDilemmas(prev =>
        prev.map(d => (d.id === updatedDilemma.id ? updatedDilemma : d))
      );
    }
    return res;
  };

  // Safe dilemma getters
  const dilemma1 = dilemmas.find(d => d.order_num === 1) || dilemmas[0] || DEFAULT_DILEMMAS[0];
  const dilemma2 = dilemmas.find(d => d.order_num === 2) || dilemmas[1] || DEFAULT_DILEMMAS[1];
  const dilemma3 = dilemmas.find(d => d.order_num === 3) || dilemmas[2] || DEFAULT_DILEMMAS[2];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Sleek Minimal Header */}
      <Header
        viewMode={viewMode}
        onGoHome={handleResetSurvey}
        onViewStats={handleViewStats}
        onOpenQuestionManager={handleOpenQuestionManager}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'survey' ? (
          <div>
            {/* Initial Screen: Only '설문 시작하기' and '통계 확인하기' buttons */}
            {currentStep === 'start' && (
              <StartScreen
                onStart={handleStartSurvey}
                onViewStats={handleViewStats}
              />
            )}

            {/* Step 1: User info (Name & Gender) */}
            {currentStep === 'user_info' && (
              <UserInfoScreen
                initialValues={userInfo}
                onSubmit={handleUserInfoSubmit}
                onBack={() => setCurrentStep('start')}
              />
            )}

            {/* Step 2: Dilemma 1 */}
            {currentStep === 'dilemma_1' && (
              <DilemmaScreen
                dilemma={dilemma1}
                questionNumber={1}
                totalQuestions={3}
                initialAnswer={answers[1]}
                onNext={handleDilemma1Next}
                onBack={() => setCurrentStep('user_info')}
              />
            )}

            {/* Step 3: Dilemma 2 */}
            {currentStep === 'dilemma_2' && (
              <DilemmaScreen
                dilemma={dilemma2}
                questionNumber={2}
                totalQuestions={3}
                initialAnswer={answers[2]}
                onNext={handleDilemma2Next}
                onBack={() => setCurrentStep('dilemma_1')}
              />
            )}

            {/* Step 4: Dilemma 3 */}
            {currentStep === 'dilemma_3' && (
              <DilemmaScreen
                dilemma={dilemma3}
                questionNumber={3}
                totalQuestions={3}
                initialAnswer={answers[3]}
                onNext={handleDilemma3Submit}
                onBack={() => setCurrentStep('dilemma_2')}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Step 5: Completed Screen with '다른 사람은 어떻게 답했을까요?' and [통계 확인하기] */}
            {currentStep === 'completed' && lastSubmittedResponse && (
              <CompletionScreen
                response={lastSubmittedResponse}
                dilemmas={dilemmas}
                onViewStats={handleViewStats}
                onResetSurvey={handleResetSurvey}
              />
            )}
          </div>
        ) : (
          /* Statistics Screen (동일하게 응답자의 통계 확인) */
          <DashboardScreen
            dilemmas={dilemmas}
            responses={responses}
            onUpdateDilemma={handleUpdateDilemma}
            onGoBackToSurvey={() => setViewMode('survey')}
            initialTab={dashInitialTab}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-slate-500">
          <span>AI 윤리 딜레마</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleViewStats}
              className="hover:text-slate-800 transition-colors"
            >
              통계 확인
            </button>
            <span>·</span>
            <button
              onClick={handleResetSurvey}
              className="hover:text-slate-800 transition-colors"
            >
              설문 홈
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
