import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Zap,
  Coffee,
  Rocket,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Scenario, PocketDrillType } from '../types';

interface PocketDrillModalProps {
  drillType: PocketDrillType;
  scenarios: Scenario[];
  onClose: () => void;
  onRecordReview: (scenarioId: string) => void;
  onDrillCompleted: (solvedCount: number, minutes: number) => void;
}

export const PocketDrillModal: React.FC<PocketDrillModalProps> = ({
  drillType,
  scenarios,
  onClose,
  onRecordReview,
  onDrillCompleted,
}) => {
  // Setup drill parameters based on type
  const drillConfig = {
    '1min': {
      title: '1분 빌드 대기 숏 드릴',
      desc: 'Gradle / npm 빌드가 돌아가는 60초 동안 1개 핵심 장애를 즉시 타파합니다.',
      durationSec: 60,
      targetCount: 1,
      icon: Zap,
      badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
    },
    '3min': {
      title: '3분 커피 브레이크 드릴',
      desc: '커피를 내리거나 휴식하는 3분 동안 2개 실무 시나리오를 빠르게 분석합니다.',
      durationSec: 180,
      targetCount: 2,
      icon: Coffee,
      badgeColor: 'text-orange-400 bg-orange-950/40 border-orange-800/60',
    },
    '5min': {
      title: '5분 CI/CD 배포 대기 드릴',
      desc: 'GitHub Actions / Jenkins 배포가 완료될 때까지 3개의 핵심 장애를 격파합니다.',
      durationSec: 300,
      targetCount: 3,
      icon: Rocket,
      badgeColor: 'text-purple-400 bg-purple-950/40 border-purple-800/60',
    },
  }[drillType];

  const [timeLeft, setTimeLeft] = useState(drillConfig.durationSec);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Pick candidate scenarios (preferably unmastered or random)
  const [drillScenarios] = useState<Scenario[]>(() => {
    // Sort so unmastered ones come first
    const pool = [...scenarios].sort((a, b) => (a.reviewCount || 0) - (b.reviewCount || 0));
    return pool.slice(0, Math.max(drillConfig.targetCount + 2, 5));
  });

  const activeScenario = drillScenarios[currentIndex] || scenarios[0];
  const detail = activeScenario.detail;

  // Timer countdown
  useEffect(() => {
    if (isFinished || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          onDrillCompleted(solvedCount, Math.round(drillConfig.durationSec / 60));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, isPaused, solvedCount]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // already chosen
    setSelectedOption(index);

    const isCorrect = detail.options[index]?.isCorrect;
    if (isCorrect) {
      setSolvedCount((prev) => prev + 1);
      onRecordReview(activeScenario.id);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex + 1 >= drillConfig.targetCount || currentIndex + 1 >= drillScenarios.length) {
      setIsFinished(true);
      onDrillCompleted(solvedCount + 1, Math.round(drillConfig.durationSec / 60));
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const IconComp = drillConfig.icon;
  const progressPercent = Math.min(
    100,
    Math.round(((drillConfig.durationSec - timeLeft) / drillConfig.durationSec) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#172334] border border-[#253346] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-[#111a26] border-b border-[#253346] flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className={`p-1.5 rounded-lg border ${drillConfig.badgeColor} shrink-0`}>
              <IconComp className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white">{drillConfig.title}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#203046] text-slate-300">
                  {currentIndex + 1} / {drillConfig.targetCount}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1">{drillConfig.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#172334] border border-[#253346] font-mono text-xs text-slate-200 shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#0078ff]" />
              <span className={timeLeft <= 10 ? 'text-red-400 font-bold animate-pulse' : 'text-white font-bold'}>
                {formatTimer(timeLeft)}
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="ml-1 text-slate-400 hover:text-white p-0.5"
                title={isPaused ? '계속 진행' : '일시 정지'}
              >
                {isPaused ? <Play className="w-3 h-3 text-[#00ba7c]" /> : <Pause className="w-3 h-3" />}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#203046] transition-colors"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timer progress bar */}
        <div className="w-full bg-[#111a26] h-1">
          <div
            className="bg-[#0078ff] h-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 sm:space-y-4">
          {!isFinished ? (
            <>
              {/* Question Meta */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{activeScenario.code}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#111a26] text-slate-300 border border-[#253346]">
                    {activeScenario.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    난이도 {activeScenario.difficultyLabel}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{activeScenario.title}</h4>
              </div>

              {/* Symptom & Code Clue */}
              <div className="p-3 rounded-xl bg-[#111a26] border border-[#253346] space-y-2">
                <div className="text-[11px] text-slate-400 font-bold flex items-center justify-between">
                  <span className="text-white">🚨 긴급 증상</span>
                  <span className="font-mono text-[10px] text-slate-400">{detail.timeOccurred}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{detail.symptomText}</p>

                <div className="pt-1.5">
                  <div className="text-[10px] text-slate-400 font-mono mb-1">{detail.clueTitle}</div>
                  <div className="p-2.5 rounded-lg bg-[#172334] border border-[#253346] font-mono text-xs text-slate-200 whitespace-pre overflow-x-auto max-h-36">
                    {detail.clueSnippet}
                  </div>
                </div>
              </div>

              {/* Quick 4 Options */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>원인 진단 (직관으로 선택):</span>
                  <span className="text-[10px] text-slate-400">1개 선택</span>
                </div>

                <div className="space-y-2">
                  {detail.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <button
                        key={opt.id}
                        disabled={selectedOption !== null}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all min-h-[44px] flex items-center active:scale-[0.99] ${
                          selectedOption !== null
                            ? opt.isCorrect
                              ? 'border-[#00ba7c] bg-[#00ba7c]/15 text-white ring-1 ring-[#00ba7c]/40 shadow-sm'
                              : isSelected
                              ? 'border-red-500 bg-red-950/40 text-red-200'
                              : 'border-[#253346]/40 bg-[#111a26]/40 text-slate-500'
                            : 'border-[#253346] bg-[#111a26] text-slate-300 hover:border-[#0078ff]/50 hover:bg-[#162335]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium leading-snug">{opt.title}</span>
                          {selectedOption !== null && opt.isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-[#00ba7c] shrink-0 ml-2" />
                          )}
                          {selectedOption === idx && !opt.isCorrect && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instant Feedback & Takeaway after Selection */}
              {selectedOption !== null && (
                <div className="p-3 rounded-lg bg-[#111a26] border border-[#253346] space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0078ff]" />
                      <span>체득 펀치라인: {detail.rootCauseTheory.title}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#00ba7c] font-bold">
                      {detail.pir.improvementBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    💡 <strong className="text-white">원칙:</strong> {detail.rootCauseTheory.fixRule}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Completion Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#00ba7c]/15 border border-[#00ba7c]/30 text-[#00ba7c] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">
                  업무 공백시간 틈새 세션 완료!
                </h4>
                <p className="text-xs text-slate-400">
                  빌드/배포 대기 시간을 활용해 실무 장애 {solvedCount}개를 신속하게 분석했습니다.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111a26] border border-[#253346] inline-block text-left text-xs space-y-1.5 max-w-sm w-full mx-auto font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>훈련 모드:</span>
                  <span className="text-white font-bold">{drillConfig.title}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>체득 성공 장애:</span>
                  <span className="text-[#00ba7c] font-bold">{solvedCount}개</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>활용 공백시간:</span>
                  <span className="text-slate-200">약 {Math.round(drillConfig.durationSec / 60)}분</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#111a26] border-t border-[#253346] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            업무로 바로 복귀 (ESC)
          </button>

          {!isFinished ? (
            <button
              disabled={selectedOption === null}
              onClick={handleNext}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedOption !== null
                  ? 'bg-[#0078ff] hover:bg-[#0064d6] text-white shadow-md'
                  : 'bg-[#203046] text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>
                {currentIndex + 1 >= drillConfig.targetCount ? '세션 마무리' : '다음 틈새 문제'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#00ba7c] hover:bg-[#00a36c] text-white shadow-md"
            >
              확인 후 업무 복귀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
