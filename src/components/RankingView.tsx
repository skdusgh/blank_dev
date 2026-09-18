import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Flame,
  Search,
  CheckCircle2,
  Edit2,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import { Scenario, PenguinTier } from '../types';
import {
  PENGUIN_TIERS,
  getPenguinTier,
  getNextTierProgress,
  buildLeaderboard,
  getUserNickname,
  saveUserNickname,
  LeaderboardUser,
} from '../utils/rankingStorage';

interface RankingViewProps {
  scenarios: Scenario[];
  onNavigateToScenarios: () => void;
  onSimulateSolve?: (count: number) => void;
  onResetReviews?: () => void;
}

export const RankingView: React.FC<RankingViewProps> = ({
  scenarios,
  onNavigateToScenarios,
  onSimulateSolve,
  onResetReviews,
}) => {
  const [activeTierFilter, setActiveTierFilter] = useState<'ALL' | PenguinTier>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userNickname, setUserNickname] = useState(getUserNickname());
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState(userNickname);
  const [showTierPhilosophy, setShowTierPhilosophy] = useState(false);

  // Calculate user's actual solved count
  const solvedCount = useMemo(() => {
    return scenarios.filter((s) => (s.reviewCount || 0) >= 1 || s.solved).length;
  }, [scenarios]);

  const currentTier = useMemo(() => getPenguinTier(solvedCount), [solvedCount]);
  const progressInfo = useMemo(() => getNextTierProgress(solvedCount), [solvedCount]);

  // Build leaderboard
  const { leaderboard, currentUser } = useMemo(() => {
    return buildLeaderboard(solvedCount, userNickname);
  }, [solvedCount, userNickname]);

  const handleSaveNickname = () => {
    const trimmed = tempNickname.trim();
    if (trimmed) {
      saveUserNickname(trimmed);
      setUserNickname(trimmed);
    }
    setIsEditingNickname(false);
  };

  const filteredLeaderboard = useMemo(() => {
    return leaderboard.filter((item) => {
      // Tier filter
      if (activeTierFilter !== 'ALL' && item.tier.tier !== activeTierFilter) {
        return false;
      }
      // Search keyword
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchNick = item.nickname.toLowerCase().includes(q);
        const matchSpec = item.specialty.toLowerCase().includes(q);
        const matchCompany = item.companyTag?.toLowerCase().includes(q);
        if (!matchNick && !matchSpec && !matchCompany) return false;
      }
      return true;
    });
  }, [leaderboard, activeTierFilter, searchKeyword]);

  const tierCounts = useMemo(() => {
    const counts = {
      ALL: leaderboard.length,
      FIRST_PENGUIN: 0,
      SECOND_PENGUIN: 0,
      THIRD_PENGUIN: 0,
      LAST_PENGUIN: 0,
    };
    leaderboard.forEach((u) => {
      counts[u.tier.tier]++;
    });
    return counts;
  }, [leaderboard]);

  return (
    <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full space-y-6 pb-24 md:pb-8 text-slate-200">
      {/* Header with Title & Philosophy Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#253346] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              펭귄 랭킹 시스템 (Penguin Tier)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            차가운 미지의 바다(장애 현장)에 먼저 뛰어드는 용기 있는 엔지니어 랭킹
          </p>
        </div>

        <button
          onClick={() => setShowTierPhilosophy(!showTierPhilosophy)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172334] border border-[#253346] text-xs text-sky-400 hover:text-sky-300 hover:bg-[#1d2d42] transition-colors self-start sm:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>왜 '펭귄' 랭킹인가요?</span>
        </button>
      </div>

      {/* Philosophy Callout (Collapsible) */}
      {showTierPhilosophy && (
        <div className="bg-[#142132] border border-[#233a57] rounded-xl p-4 text-xs text-slate-300 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>퍼스트 펭귄 (The First Penguin)의 법칙</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            남극 펭귄들은 먹이를 구하기 위해 바다로 뛰어들어야 하지만, 바닷속에는 바다표범 등 천적이 도사리고 있어 망설입니다.
            그때 무리 중 <strong className="text-amber-300">가장 먼저 차가운 바다로 뛰어들어 위험을 감수하는 펭귄</strong>을{' '}
            <strong className="text-amber-300">'퍼스트 펭귄'</strong>이라고 부릅니다.
          </p>
          <p className="text-slate-400 leading-relaxed">
            백엔드 시스템이 멈추고 온콜 알람이 울리는 순간, 두려워하지 않고 가장 먼저 로그와 덤프를 열어 원인을 파악하는 선구자 엔지니어를 향한 존경의 의미를 담았습니다.
          </p>
        </div>
      )}

      {/* MY CURRENT PENGUIN TIER CARD */}
      <section className="bg-gradient-to-br from-[#162438] via-[#111c2b] to-[#0d1622] rounded-xl border border-[#293d56] p-5 shadow-lg relative overflow-hidden">
        {/* Ambient Top Glow Line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-80"
          style={{ backgroundColor: currentTier.accentColor }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Avatar Image & Tier Badge */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative group shrink-0">
              <div
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-xl shrink-0 transition-transform duration-300 group-hover:scale-105 bg-gradient-to-b from-[#0e1724] to-[#070d15] ${currentTier.badgeBorder} flex items-center justify-center p-1`}
              >
                <img
                  src={currentTier.imageUrl}
                  alt={currentTier.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <span
                className="absolute -bottom-1.5 -right-1 text-lg drop-shadow select-none"
                title={currentTier.characterConcept}
              >
                {currentTier.badge}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentTier.badgeBg} ${currentTier.badgeBorder} ${currentTier.iconColor}`}
                >
                  {currentTier.badge} {currentTier.name}
                </span>

                <span className="px-2 py-0.5 rounded bg-[#172638] text-[11px] font-medium text-slate-300 border border-[#273d57]">
                  {currentTier.characterConcept}
                </span>

                <span className="text-[11px] text-slate-400 font-mono">
                  전체 순위 <strong className="text-white">#{currentUser.rank}위</strong> / {leaderboard.length}명
                </span>
              </div>

              {/* Nickname with Inline Edit */}
              <div className="flex items-center gap-2 pt-0.5">
                {isEditingNickname ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempNickname}
                      onChange={(e) => setTempNickname(e.target.value)}
                      maxLength={18}
                      className="bg-[#0b131d] border border-[#3b82f6] text-white text-xs px-2.5 py-1 rounded focus:outline-none"
                      placeholder="닉네임 입력"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveNickname}
                      className="p-1 rounded bg-[#0078ff] text-white hover:bg-blue-600"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsEditingNickname(false)}
                      className="p-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {userNickname}
                    </h2>
                    <button
                      onClick={() => {
                        setTempNickname(userNickname);
                        setIsEditingNickname(true);
                      }}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="닉네임 수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentTier.tagline}
              </p>
            </div>
          </div>

          {/* Right: Solved Stats & Quick Button */}
          <div className="flex items-center sm:self-end md:self-center gap-3">
            <div className="bg-[#0e1724] border border-[#203144] rounded-lg px-4 py-2.5 text-center min-w-[110px]">
              <div className="text-[11px] text-slate-400 font-medium">해결한 문제</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">
                <span className="text-amber-400">{solvedCount}</span>
                <span className="text-slate-500 text-xs font-normal"> / {scenarios.length}</span>
              </div>
            </div>

            <button
              onClick={onNavigateToScenarios}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#0078ff] hover:bg-[#0060cc] text-white text-xs font-semibold shadow-md transition-colors whitespace-nowrap"
            >
              <span>문제 풀러 가기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar to Next Penguin Tier */}
        <div className="mt-5 pt-4 border-t border-[#203144] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">
              {progressInfo.nextTier ? (
                <>
                  다음 목표:{' '}
                  <strong className={progressInfo.nextTier.iconColor}>
                    {progressInfo.nextTier.badge} {progressInfo.nextTier.name}
                  </strong>
                  <span className="text-slate-400 ml-1.5">
                    (앞으로 <strong className="text-white">{progressInfo.neededForNext}문제</strong> 더 풀면 승급!)
                  </span>
                </>
              ) : (
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 최고 등급 '퍼스트펭귄'을 달성한 전설의 엔지니어입니다!
                </span>
              )}
            </span>

            <span className="text-slate-400 font-mono text-[11px]">
              {solvedCount} / {progressInfo.targetGoal} ({progressInfo.progressPercent}%)
            </span>
          </div>

          {/* Progress Track */}
          <div className="w-full h-2.5 bg-[#0b141f] rounded-full overflow-hidden p-0.5 border border-[#1e2f42]">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressInfo.progressPercent}%`,
                backgroundColor: currentTier.accentColor,
              }}
            />
          </div>
        </div>

        {/* Quick Simulation Testing Controls for Evaluators */}
        {onSimulateSolve && (
          <div className="mt-4 pt-3 border-t border-[#1e2f42]/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>티어 승급 시뮬레이터 (빠른 테스트):</span>
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onSimulateSolve(10)}
                className="px-2 py-0.5 rounded bg-[#172334] border border-[#253346] text-emerald-300 hover:text-white hover:bg-[#203144] transition-colors"
                title="10문제 해결 상태로 만들기 (서드펭귄 진입)"
              >
                🥉 +10문제 (서드펭귄)
              </button>
              <button
                onClick={() => onSimulateSolve(50)}
                className="px-2 py-0.5 rounded bg-[#172334] border border-[#253346] text-sky-300 hover:text-white hover:bg-[#203144] transition-colors"
                title="50문제 해결 상태로 만들기 (세컨드펭귄 진입)"
              >
                🥈 +50문제 (세컨드펭귄)
              </button>
              <button
                onClick={() => onSimulateSolve(100)}
                className="px-2 py-0.5 rounded bg-[#172334] border border-[#253346] text-amber-300 hover:text-white hover:bg-[#203144] transition-colors"
                title="100문제 해결 상태로 만들기 (퍼스트펭귄 진입)"
              >
                👑 +100문제 (퍼스트펭귄)
              </button>
              {onResetReviews && (
                <button
                  onClick={onResetReviews}
                  className="px-2 py-0.5 rounded bg-[#172334] border border-[#253346] text-slate-400 hover:text-red-300 hover:bg-[#251520] transition-colors"
                  title="초기화"
                >
                  초기화
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 4 PENGUIN TIERS BREAKDOWN CARDS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sky-400" />
            <span>펭귄 등급 기준표 (Penguin Tiers)</span>
          </h2>
          <span className="text-[11px] text-slate-400">누적 해결 문제 수에 따라 자동 승급</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {(
            [
              PENGUIN_TIERS.FIRST_PENGUIN,
              PENGUIN_TIERS.SECOND_PENGUIN,
              PENGUIN_TIERS.THIRD_PENGUIN,
              PENGUIN_TIERS.LAST_PENGUIN,
            ] as const
          ).map((tierItem) => {
            const isMyTier = currentTier.tier === tierItem.tier;
            return (
              <div
                key={tierItem.tier}
                className={`rounded-xl border p-3.5 transition-all duration-200 flex flex-col justify-between group ${
                  isMyTier
                    ? `${tierItem.badgeBg} ${tierItem.badgeBorder} ring-1 ring-offset-0 ring-${tierItem.accentColor} shadow-md`
                    : 'bg-[#111a26] border-[#253346] hover:border-[#354862]'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header (Cleanly separated above the frame) */}
                  <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-[#1c2c3e]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xl shrink-0">{tierItem.badge}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-white text-sm truncate">
                            {tierItem.name}
                          </h3>
                          {isMyTier && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#0078ff] text-white rounded shrink-0">
                              내 등급
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {tierItem.englishName}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${tierItem.badgeBg} ${tierItem.badgeBorder} ${tierItem.iconColor}`}
                    >
                      {tierItem.minSolved === 0
                        ? '10문제 이하'
                        : `${tierItem.minSolved}문제 이상`}
                    </span>
                  </div>

                  {/* Character Illustration Frame (Full Body, Zero Cutoff) */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-[#25374d] bg-gradient-to-b from-[#0d1726] via-[#09111c] to-[#050a12] shadow-inner flex items-center justify-center p-2 group-hover:border-[#3b5473] transition-all">
                    <img
                      src={tierItem.imageUrl}
                      alt={tierItem.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Concept Name & Description */}
                  <div className="space-y-1">
                    <div className={`text-xs font-bold ${tierItem.iconColor}`}>
                      {tierItem.characterConcept}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed min-h-[3.25rem]">
                      {tierItem.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#253346]/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>기준 요건</span>
                  <strong className="text-white font-mono">
                    {tierItem.minSolved === 100
                      ? '100+ Solved'
                      : tierItem.minSolved === 50
                      ? '50 ~ 99 Solved'
                      : tierItem.minSolved === 10
                      ? '10 ~ 49 Solved'
                      : '0 ~ 9 Solved'}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* REAL-TIME LEADERBOARD TABLE */}
      <section className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>전국 개발자 실시간 랭킹 리더보드</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">({leaderboard.length}명 참가 중)</span>
          </div>

          {/* Search by user / specialty */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="닉네임 / 주특기 검색..."
              className="w-full bg-[#111a26] border border-[#253346] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#0078ff]"
            />
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#253346] pb-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTierFilter('ALL')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTierFilter === 'ALL'
                ? 'bg-[#203046] text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
            }`}
          >
            전체 <span className="text-slate-500 text-[11px]">({tierCounts.ALL})</span>
          </button>

          <button
            onClick={() => setActiveTierFilter('FIRST_PENGUIN')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTierFilter === 'FIRST_PENGUIN'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
            }`}
          >
            👑 퍼스트펭귄 (100+){' '}
            <span className="text-slate-500 text-[11px]">({tierCounts.FIRST_PENGUIN})</span>
          </button>

          <button
            onClick={() => setActiveTierFilter('SECOND_PENGUIN')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTierFilter === 'SECOND_PENGUIN'
                ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
            }`}
          >
            🥈 세컨드펭귄 (50+){' '}
            <span className="text-slate-500 text-[11px]">({tierCounts.SECOND_PENGUIN})</span>
          </button>

          <button
            onClick={() => setActiveTierFilter('THIRD_PENGUIN')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTierFilter === 'THIRD_PENGUIN'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
            }`}
          >
            🥉 서드펭귄 (10+){' '}
            <span className="text-slate-500 text-[11px]">({tierCounts.THIRD_PENGUIN})</span>
          </button>

          <button
            onClick={() => setActiveTierFilter('LAST_PENGUIN')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTierFilter === 'LAST_PENGUIN'
                ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#172334]'
            }`}
          >
            🐧 라스트펭귄 (&le;10){' '}
            <span className="text-slate-500 text-[11px]">({tierCounts.LAST_PENGUIN})</span>
          </button>
        </div>

        {/* Leaderboard Table Container */}
        <div className="bg-[#111a26] border border-[#253346] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#172334]/80 text-slate-400 font-semibold border-b border-[#253346]">
                  <th className="py-3 px-4 w-16 text-center">순위</th>
                  <th className="py-3 px-4">엔지니어</th>
                  <th className="py-3 px-4">펭귄 티어</th>
                  <th className="py-3 px-4 text-center">해결 문제 수</th>
                  <th className="py-3 px-4 hidden sm:table-cell">주특기</th>
                  <th className="py-3 px-4 text-right pr-5">학습 스트릭</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202f42]">
                {filteredLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      검색 조건에 일치하는 엔지니어가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredLeaderboard.map((item) => {
                    const isUser = item.isCurrentUser;
                    const isTop1 = item.rank === 1;
                    const isTop2 = item.rank === 2;
                    const isTop3 = item.rank === 3;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isUser
                            ? 'bg-[#18293e] hover:bg-[#1d324c] font-medium border-l-4 border-l-[#0078ff]'
                            : 'hover:bg-[#14202e]'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          {isTop1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs">
                              1
                            </span>
                          ) : isTop2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40 text-xs">
                              2
                            </span>
                          ) : isTop3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 border border-amber-600/40 text-xs">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">{item.rank}</span>
                          )}
                        </td>

                        {/* Nickname & Organization */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#2d425b] shrink-0 bg-[#0d1622] flex items-center justify-center p-0.5">
                              <img
                                src={item.tier.imageUrl}
                                alt={item.tier.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain"
                              />
                              <span className="absolute bottom-0 right-0 text-[10px] bg-black/75 rounded-tl px-0.5 leading-none">
                                {item.tier.badge}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`font-semibold ${isUser ? 'text-white' : 'text-slate-200'}`}>
                                  {item.nickname}
                                </span>
                                {isUser && (
                                  <span className="px-1.5 py-0.2 rounded bg-[#0078ff] text-white text-[10px] font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>
                              {item.companyTag && (
                                <div className="text-[11px] text-slate-400">
                                  {item.companyTag}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Penguin Tier Badge */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${item.tier.badgeBg} ${item.tier.badgeBorder} ${item.tier.iconColor}`}
                          >
                            <span>{item.tier.badge}</span>
                            <span>{item.tier.name}</span>
                          </span>
                        </td>

                        {/* Solved Count */}
                        <td className="py-3 px-4 text-center font-mono">
                          <span className="text-sm font-bold text-white">{item.solvedCount}</span>
                          <span className="text-[11px] text-slate-500"> 문제</span>
                        </td>

                        {/* Specialty */}
                        <td className="py-3 px-4 text-slate-300 hidden sm:table-cell">
                          <span className="text-xs line-clamp-1">{item.specialty}</span>
                        </td>

                        {/* Streak */}
                        <td className="py-3 px-4 text-right pr-5 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 text-slate-300 font-mono text-xs">
                            <Flame className={`w-3.5 h-3.5 ${item.streakDays > 10 ? 'text-amber-400' : 'text-slate-500'}`} />
                            <span>{item.streakDays}일 연속</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};
