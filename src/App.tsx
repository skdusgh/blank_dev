/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TopNavBar } from './components/TopNavBar';
import { ScenariosView } from './components/ScenariosView';
import { ActiveLabView } from './components/ActiveLabView';
import { PIRView } from './components/PIRView';
import { SpeedReviewView } from './components/SpeedReviewView';
import { PocketDrillModal } from './components/PocketDrillModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GlossaryModal } from './components/GlossaryModal';
import { RankingView } from './components/RankingView';
import { INITIAL_SCENARIOS } from './data/scenariosData';
import { AppView, Scenario, PocketDrillType } from './types';
import {
  loadReviewRecords,
  incrementReview,
  toggleScenarioBookmark,
  clearAllReviews,
  getTodayPocketStats,
  incrementTodayPocket,
} from './utils/reviewStorage';
import { getPenguinTier } from './utils/rankingStorage';

export default function App() {
  // Initialize scenarios with localStorage reviews
  const [scenarios, setScenarios] = useState<Scenario[]>(() => {
    const records = loadReviewRecords();
    return INITIAL_SCENARIOS.map((s) => {
      const rec = records[s.id];
      if (!rec) {
        return {
          ...s,
          reviewCount: 0,
          masteryLevel: 'UNEXPLORED',
          isBookmarked: false,
          userNotes: '',
        };
      }
      return {
        ...s,
        reviewCount: rec.reviewCount,
        masteryLevel: rec.masteryLevel,
        lastReviewedAt: rec.lastReviewedAt,
        isBookmarked: rec.isBookmarked,
        userNotes: rec.userNotes,
      };
    });
  });

  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [currentView, setCurrentView] = useState<AppView>('scenarios');
  const [notification, setNotification] = useState<string | null>(null);
  const [activePocketDrill, setActivePocketDrill] = useState<PocketDrillType | null>(null);
  const [pocketStats, setPocketStats] = useState(getTodayPocketStats());
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(true);

  // Keep selectedScenario in sync with scenarios array
  useEffect(() => {
    const updated = scenarios.find((s) => s.id === selectedScenario.id);
    if (updated) {
      setSelectedScenario(updated);
    }
  }, [scenarios]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2800);
  };

  const handleRecordReview = (scenarioId: string, notes?: string) => {
    const updatedRec = incrementReview(scenarioId, notes);
    setScenarios((prev) =>
      prev.map((s) => {
        if (s.id !== scenarioId) return s;
        return {
          ...s,
          reviewCount: updatedRec.reviewCount,
          masteryLevel: updatedRec.masteryLevel,
          lastReviewedAt: updatedRec.lastReviewedAt,
          userNotes: updatedRec.userNotes,
        };
      })
    );
    const target = scenarios.find((s) => s.id === scenarioId);
    showToast(
      `🎉 [${target?.code || scenarioId}] ${updatedRec.reviewCount}회독 체득 완료!`
    );
  };

  const handlePocketDrillCompleted = (solvedCount: number, minutes: number) => {
    const updated = incrementTodayPocket(minutes);
    setPocketStats(updated);
    showToast(`☕ 틈새 학습 완료! 오늘 총 ${updated.count}개 해결 (${updated.minutes}분)`);
  };

  const handleToggleBookmark = (scenarioId: string) => {
    const isNowBookmarked = toggleScenarioBookmark(scenarioId);
    setScenarios((prev) =>
      prev.map((s) => (s.id === scenarioId ? { ...s, isBookmarked: isNowBookmarked } : s))
    );
    showToast(
      isNowBookmarked ? '복습 목록에 북마크되었습니다.' : '북마크가 해제되었습니다.'
    );
  };

  const handleStartScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentView('active-lab');
  };

  const handleReviewScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentView('pir');
  };

  const handleGoToDashboard = () => {
    setCurrentView('scenarios');
  };

  const handleProceedToReview = () => {
    setCurrentView('pir');
  };

  const handleNextScenario = () => {
    const currentIndex = scenarios.findIndex((s) => s.id === selectedScenario.id);
    const nextScenario = scenarios[(currentIndex + 1) % scenarios.length];
    setSelectedScenario(nextScenario);
    setCurrentView('active-lab');
  };

  const handleResetSimulation = () => {
    clearAllReviews();
    setScenarios(
      INITIAL_SCENARIOS.map((s) => ({
        ...s,
        reviewCount: 0,
        masteryLevel: 'UNEXPLORED',
        isBookmarked: false,
        userNotes: '',
      }))
    );
    setPocketStats(getTodayPocketStats());
    showToast('모든 회독 및 틈새 학습 기록이 초기화되었습니다.');
  };

  const masteryStats = useMemo(() => {
    const total = scenarios.length;
    const reviewedOnce = scenarios.filter((s) => (s.reviewCount || 0) >= 1).length;
    const mastered = scenarios.filter((s) => (s.reviewCount || 0) >= 3).length;
    return { total, reviewedOnce, mastered };
  }, [scenarios]);

  const penguinTier = useMemo(() => {
    return getPenguinTier(masteryStats.reviewedOnce);
  }, [masteryStats.reviewedOnce]);

  const handleSimulateSolve = (targetCount: number) => {
    const records = loadReviewRecords();
    scenarios.slice(0, targetCount).forEach((s) => {
      records[s.id] = {
        reviewCount: Math.max(1, records[s.id]?.reviewCount || 1),
        masteryLevel: 'FAMILIAR',
        lastReviewedAt: '오늘',
        isBookmarked: records[s.id]?.isBookmarked || false,
        userNotes: records[s.id]?.userNotes || '',
      };
    });
    try {
      localStorage.setItem('incident_lab_review_progress_v1', JSON.stringify(records));
    } catch {
      // ignore
    }
    setScenarios((prev) =>
      prev.map((s, idx) => {
        if (idx < targetCount) {
          return {
            ...s,
            reviewCount: Math.max(1, s.reviewCount || 1),
            masteryLevel: 'FAMILIAR',
            lastReviewedAt: '오늘',
          };
        }
        return s;
      })
    );
    const tier = getPenguinTier(targetCount);
    showToast(`🎉 [시뮬레이션] ${targetCount}문제 풀이 완료! 등급: ${tier.badge} ${tier.name}`);
  };

  return (
    <div className="min-h-screen bg-[#0c151c] text-slate-100 flex flex-col font-sans selection:bg-[#0078ff]/30">
      {/* Top Navigation Bar */}
      <TopNavBar
        currentView={currentView}
        activeScenario={selectedScenario}
        masteryStats={masteryStats}
        penguinTier={penguinTier}
        onNavigate={setCurrentView}
        onReset={handleResetSimulation}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#172334] border border-[#253346] text-white text-xs px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in duration-150">
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* Technical Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        tooltipsEnabled={tooltipsEnabled}
        onToggleTooltips={() => {
          setTooltipsEnabled((prev) => {
            const next = !prev;
            showToast(next ? '단어 설명 툴팁이 활성화되었습니다.' : '단어 설명 툴팁이 비활성화되었습니다.');
            return next;
          });
        }}
      />

      {/* Idle Time Pocket Drill Modal */}
      {activePocketDrill && (
        <PocketDrillModal
          drillType={activePocketDrill}
          scenarios={scenarios}
          onClose={() => setActivePocketDrill(null)}
          onRecordReview={handleRecordReview}
          onDrillCompleted={handlePocketDrillCompleted}
        />
      )}

      {/* Primary Workspace View */}
      {currentView === 'scenarios' && (
        <ScenariosView
          scenarios={scenarios}
          onStartScenario={handleStartScenario}
          onReviewScenario={handleReviewScenario}
          onGoToSpeedReview={() => setCurrentView('speed-review')}
          onGoToRanking={() => setCurrentView('ranking')}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {currentView === 'speed-review' && (
        <SpeedReviewView
          scenarios={scenarios}
          onRecordReview={handleRecordReview}
          onToggleBookmark={handleToggleBookmark}
          onGoToLab={handleStartScenario}
          onGoToPIR={handleReviewScenario}
        />
      )}

      {currentView === 'ranking' && (
        <RankingView
          scenarios={scenarios}
          onNavigateToScenarios={() => setCurrentView('scenarios')}
          onSimulateSolve={handleSimulateSolve}
          onResetReviews={handleResetSimulation}
        />
      )}

      {currentView === 'active-lab' && (
        <ActiveLabView
          scenario={selectedScenario}
          onProceedToReview={handleProceedToReview}
          onRecordReview={handleRecordReview}
        />
      )}

      {currentView === 'pir' && (
        <PIRView
          scenario={selectedScenario}
          onGoToDashboard={handleGoToDashboard}
          onRetry={() => setCurrentView('active-lab')}
          onNextScenario={handleNextScenario}
          onRecordReview={handleRecordReview}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {/* Mobile Sticky Bottom Navigation Bar (md:hidden) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />
    </div>
  );
}


