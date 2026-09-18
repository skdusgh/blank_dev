import { PenguinTier, PenguinTierInfo } from '../types';
import firstPenguinImg from '../assets/images/first_penguin_framed_1789723914300.jpg';
import secondPenguinImg from '../assets/images/second_penguin_framed_1789723935746.jpg';
import thirdPenguinImg from '../assets/images/third_penguin_framed_1789723950344.jpg';
import lastPenguinImg from '../assets/images/last_penguin_framed_1789723963678.jpg';

export const PENGUIN_TIERS: Record<PenguinTier, PenguinTierInfo> = {
  FIRST_PENGUIN: {
    tier: 'FIRST_PENGUIN',
    name: '퍼스트펭귄',
    englishName: 'First Penguin',
    minSolved: 100,
    maxSolved: null,
    badge: '👑',
    imageUrl: firstPenguinImg,
    characterConcept: '근육질 슈퍼 펭귄 (Muscle Penguin)',
    iconColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-400/40',
    accentColor: '#f59e0b',
    tagline: '100문제 이상 해결한 무적의 근육질 퍼스트펭귄',
    description: '탄탄한 근육과 강인한 결단력으로 가장 먼저 미지의 차가운 바다(실제 장애 현장)로 다이빙하는 슈퍼 히어로 펭귄입니다. 대형 프로덕션 장애의 최전선에서 카스케이드 장애를 막아섭니다.',
  },
  SECOND_PENGUIN: {
    tier: 'SECOND_PENGUIN',
    name: '세컨드펭귄',
    englishName: 'Second Penguin',
    minSolved: 50,
    maxSolved: 99,
    badge: '🥈',
    imageUrl: secondPenguinImg,
    characterConcept: '길쭉하고 안경 쓴 스마트 펭귄 (Tall & Glasses Penguin)',
    iconColor: 'text-sky-300',
    badgeBg: 'bg-sky-500/15',
    badgeBorder: 'border-sky-400/40',
    accentColor: '#38bdf8',
    tagline: '50문제 이상 해결한 냉철한 지성의 세컨드펭귄',
    description: '길쭉한 피지컬에 둥근 스마트 안경과 넥타이를 착용한 지성파 펭귄입니다. 쿼리 실행 계획과 스레드/힙 덤프를 냉철하게 분석하여 아키텍처 병목을 해결합니다.',
  },
  THIRD_PENGUIN: {
    tier: 'THIRD_PENGUIN',
    name: '서드펭귄',
    englishName: 'Third Penguin',
    minSolved: 10,
    maxSolved: 49,
    badge: '🥉',
    imageUrl: thirdPenguinImg,
    characterConcept: '푸근하게 배 나온 펭귄 (Potbelly Penguin)',
    iconColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-400/40',
    accentColor: '#10b981',
    tagline: '10문제 이상 해결한 듬직하고 여유로운 서드펭귄',
    description: '따뜻한 커피를 손에 쥐고 푸근하게 볼록 나온 배를 뽐내는 정감 넘치는 펭귄입니다. 급박한 장애 상황에서도 침착하게 지표를 읽고 능숙하게 헤엄치며 해결책을 찾아냅니다.',
  },
  LAST_PENGUIN: {
    tier: 'LAST_PENGUIN',
    name: '라스트펭귄',
    englishName: 'Last Penguin',
    minSolved: 0,
    maxSolved: 9,
    badge: '🐧',
    imageUrl: lastPenguinImg,
    characterConcept: '어리숙하고 못생긴 아기 펭귄 (Goofy Derpy Penguin)',
    iconColor: 'text-indigo-300',
    badgeBg: 'bg-indigo-500/15',
    badgeBorder: 'border-indigo-400/40',
    accentColor: '#818cf8',
    tagline: '10문제 이하 (얼음 위에서 입수를 망설이는 귀여운 못난이 펭귄)',
    description: '헝클어진 깃털과 삐뚤어진 눈망울, 엉뚱한 부리를 지닌 사랑스러운 못난이 펭귄입니다. 아직 바다가 두렵고 어리숙하지만 첫 문제를 해결하며 성장의 첫 다이빙을 준비합니다.',
  },
};

export const getPenguinTier = (solvedCount: number): PenguinTierInfo => {
  if (solvedCount >= 100) return PENGUIN_TIERS.FIRST_PENGUIN;
  if (solvedCount >= 50) return PENGUIN_TIERS.SECOND_PENGUIN;
  if (solvedCount >= 10) return PENGUIN_TIERS.THIRD_PENGUIN;
  return PENGUIN_TIERS.LAST_PENGUIN;
};

export const getNextTierProgress = (solvedCount: number) => {
  if (solvedCount >= 100) {
    return {
      currentTier: PENGUIN_TIERS.FIRST_PENGUIN,
      nextTier: null,
      neededForNext: 0,
      progressPercent: 100,
      targetGoal: 100,
    };
  }
  if (solvedCount >= 50) {
    const needed = 100 - solvedCount;
    const progressPercent = Math.min(100, Math.round(((solvedCount - 50) / 50) * 100));
    return {
      currentTier: PENGUIN_TIERS.SECOND_PENGUIN,
      nextTier: PENGUIN_TIERS.FIRST_PENGUIN,
      neededForNext: needed,
      progressPercent,
      targetGoal: 100,
    };
  }
  if (solvedCount >= 10) {
    const needed = 50 - solvedCount;
    const progressPercent = Math.min(100, Math.round(((solvedCount - 10) / 40) * 100));
    return {
      currentTier: PENGUIN_TIERS.THIRD_PENGUIN,
      nextTier: PENGUIN_TIERS.SECOND_PENGUIN,
      neededForNext: needed,
      progressPercent,
      targetGoal: 50,
    };
  }
  const needed = 10 - solvedCount;
  const progressPercent = Math.min(100, Math.round((solvedCount / 10) * 100));
  return {
    currentTier: PENGUIN_TIERS.LAST_PENGUIN,
    nextTier: PENGUIN_TIERS.THIRD_PENGUIN,
    neededForNext: needed,
    progressPercent,
    targetGoal: 10,
  };
};

export interface LeaderboardUser {
  id: string;
  rank: number;
  nickname: string;
  avatarSeed: string;
  solvedCount: number;
  tier: PenguinTierInfo;
  badge: string;
  specialty: string;
  companyTag?: string;
  streakDays: number;
  isCurrentUser?: boolean;
}

// Initial competitive leaderboard pool
const BASE_LEADERBOARD_USERS: Omit<LeaderboardUser, 'rank' | 'tier'>[] = [
  // First Penguins (100+)
  {
    id: 'u-01',
    nickname: '빙하위의_커널패닉',
    avatarSeed: 'kernel',
    solvedCount: 184,
    badge: '👑',
    specialty: 'DB 데드락 & 갭 락 격퇴',
    companyTag: '카카오 SRE',
    streakDays: 42,
  },
  {
    id: 'u-02',
    nickname: '토스_새벽온콜러',
    avatarSeed: 'toss',
    solvedCount: 168,
    badge: '👑',
    specialty: 'HikariCP 풀 고갈 진단',
    companyTag: '토스 코어뱅킹',
    streakDays: 31,
  },
  {
    id: 'u-03',
    nickname: '네이버_DBA_김선배',
    avatarSeed: 'dba',
    solvedCount: 152,
    badge: '👑',
    specialty: 'WHERE절 가공 쿼리 튜닝',
    companyTag: '네이버 클라우드',
    streakDays: 28,
  },
  {
    id: 'u-04',
    nickname: '쿠버네티스_다이빙벨',
    avatarSeed: 'k8s',
    solvedCount: 139,
    badge: '👑',
    specialty: 'STW & ZGC 메모리 튜닝',
    companyTag: '쿠팡 플랫폼',
    streakDays: 25,
  },
  {
    id: 'u-05',
    nickname: '서킷브레이커_장인',
    avatarSeed: 'cb',
    solvedCount: 121,
    badge: '👑',
    specialty: '마이크로서비스 카스케이드 방어',
    companyTag: '배민 인프라',
    streakDays: 19,
  },
  {
    id: 'u-06',
    nickname: '황금펭귄_SRE',
    avatarSeed: 'gold',
    solvedCount: 108,
    badge: '👑',
    specialty: 'JVM 힙 덤프 & OOM 분석',
    companyTag: '라인 파이낸셜',
    streakDays: 17,
  },

  // Second Penguins (50 ~ 99)
  {
    id: 'u-07',
    nickname: '우아한_쿼리튜너',
    avatarSeed: 'query',
    solvedCount: 94,
    badge: '🥈',
    specialty: '인덱스 스킵 스캔 마스터',
    companyTag: '우아한형제들',
    streakDays: 15,
  },
  {
    id: 'u-08',
    nickname: '당근_더티체킹러',
    avatarSeed: 'carrot',
    solvedCount: 88,
    badge: '🥈',
    specialty: 'OSIV 끄기 & N+1 해결',
    companyTag: '당근마켓',
    streakDays: 14,
  },
  {
    id: 'u-09',
    nickname: '스레드덤프_사냥꾼',
    avatarSeed: 'thread',
    solvedCount: 81,
    badge: '🥈',
    specialty: 'BLOCKED 스레드 추적',
    companyTag: '두나무',
    streakDays: 12,
  },
  {
    id: 'u-10',
    nickname: '커넥션풀_지킴이',
    avatarSeed: 'pool',
    solvedCount: 75,
    badge: '🥈',
    specialty: 'Slow Query 탐지 & 격리',
    companyTag: '야놀자',
    streakDays: 11,
  },
  {
    id: 'u-11',
    nickname: 'Redis_캐시_황제',
    avatarSeed: 'redis',
    solvedCount: 67,
    badge: '🥈',
    specialty: '캐시 스탬피드 방어',
    companyTag: '무신사',
    streakDays: 9,
  },
  {
    id: 'u-12',
    nickname: '파이프라인_펭귄',
    avatarSeed: 'pipe',
    solvedCount: 59,
    badge: '🥈',
    specialty: '비동기 이벤트 트러블슈팅',
    companyTag: '스타트업 리드',
    streakDays: 8,
  },
  {
    id: 'u-13',
    nickname: '세컨드_항해사',
    avatarSeed: 'sailor',
    solvedCount: 52,
    badge: '🥈',
    specialty: 'CORS & JWT 만료 디버깅',
    companyTag: '핀테크 주니어',
    streakDays: 7,
  },

  // Third Penguins (10 ~ 49)
  {
    id: 'u-14',
    nickname: '주니어_백엔드_도전자',
    avatarSeed: 'junior',
    solvedCount: 46,
    badge: '🥉',
    specialty: 'Spring Data JPA 최적화',
    companyTag: '취준 백엔드',
    streakDays: 6,
  },
  {
    id: 'u-15',
    nickname: 'OOM_탈출러',
    avatarSeed: 'oom',
    solvedCount: 38,
    badge: '🥉',
    specialty: '메타스페이스 누수 감지',
    companyTag: '부트캠프 수료',
    streakDays: 5,
  },
  {
    id: 'u-16',
    nickname: '슬로우쿼리_사냥꾼',
    avatarSeed: 'hunter',
    solvedCount: 29,
    badge: '🥉',
    specialty: 'EXPLAIN ANALYZE 판독',
    companyTag: 'CS 전공생',
    streakDays: 4,
  },
  {
    id: 'u-17',
    nickname: '포트폴리오_장인',
    avatarSeed: 'portfolio',
    solvedCount: 22,
    badge: '🥉',
    specialty: 'HTTP 504 타임아웃 분석',
    companyTag: '신입 백엔드',
    streakDays: 4,
  },
  {
    id: 'u-18',
    nickname: '서드펭귄_펭돌이',
    avatarSeed: 'peng',
    solvedCount: 16,
    badge: '🥉',
    specialty: '트랜잭션 롤백 정책',
    companyTag: '백엔드 1년차',
    streakDays: 3,
  },
  {
    id: 'u-19',
    nickname: '코딩하는_황제펭귄',
    avatarSeed: 'emperor',
    solvedCount: 12,
    badge: '🥉',
    specialty: 'DB 커넥션 누수 방지',
    companyTag: '개발 동아리',
    streakDays: 3,
  },

  // Last Penguins (0 ~ 9)
  {
    id: 'u-20',
    nickname: '첫입수_준비생',
    avatarSeed: 'starter',
    solvedCount: 8,
    badge: '🐧',
    specialty: '기본 쿼리 플랜 확인 중',
    companyTag: '신규 입문',
    streakDays: 2,
  },
  {
    id: 'u-21',
    nickname: '빙하위_모닥불',
    avatarSeed: 'fire',
    solvedCount: 5,
    badge: '🐧',
    specialty: 'Spring Boot 입문자',
    companyTag: '알고리즘 스터디',
    streakDays: 2,
  },
  {
    id: 'u-22',
    nickname: '귀여운_아기펭귄',
    avatarSeed: 'baby',
    solvedCount: 2,
    badge: '🐧',
    specialty: '로그 분석 입문',
    companyTag: '첫 도전',
    streakDays: 1,
  },
];

const NICKNAME_KEY = 'incident_lab_penguin_nickname';

export const getUserNickname = (): string => {
  try {
    return localStorage.getItem(NICKNAME_KEY) || '나 (Blank_Dev)';
  } catch {
    return '나 (Blank_Dev)';
  }
};

export const saveUserNickname = (nickname: string): void => {
  try {
    localStorage.setItem(NICKNAME_KEY, nickname.trim() || '나 (Blank_Dev)');
  } catch {
    // ignore
  }
};

/**
 * Builds the complete ranked leaderboard dynamically including the user
 */
export const buildLeaderboard = (
  userSolvedCount: number,
  userNickname: string = getUserNickname()
): {
  leaderboard: LeaderboardUser[];
  currentUser: LeaderboardUser;
  totalParticipants: number;
} => {
  const userTier = getPenguinTier(userSolvedCount);

  const currentUserItem: Omit<LeaderboardUser, 'rank'> = {
    id: 'current-user',
    nickname: userNickname,
    avatarSeed: 'current-user-penguin',
    solvedCount: userSolvedCount,
    tier: userTier,
    badge: userTier.badge,
    specialty: '전체 트러블슈팅 종합 해결',
    companyTag: '내 계정 (YOU)',
    streakDays: userSolvedCount > 0 ? Math.min(30, Math.max(1, Math.floor(userSolvedCount / 3))) : 0,
    isCurrentUser: true,
  };

  // Combine and sort
  const combined = [
    ...BASE_LEADERBOARD_USERS.map((u) => ({
      ...u,
      tier: getPenguinTier(u.solvedCount),
      isCurrentUser: false,
    })),
    currentUserItem,
  ];

  // Sort by solved count descending
  combined.sort((a, b) => {
    if (b.solvedCount !== a.solvedCount) {
      return b.solvedCount - a.solvedCount;
    }
    // If tied, prioritize current user
    if (a.isCurrentUser) return -1;
    if (b.isCurrentUser) return 1;
    return a.nickname.localeCompare(b.nickname);
  });

  // Assign ranks
  const rankedLeaderboard: LeaderboardUser[] = combined.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const userRanked = rankedLeaderboard.find((u) => u.isCurrentUser)!;

  return {
    leaderboard: rankedLeaderboard,
    currentUser: userRanked,
    totalParticipants: rankedLeaderboard.length,
  };
};
