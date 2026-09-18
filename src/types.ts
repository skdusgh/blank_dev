export type AppView = 'scenarios' | 'speed-review' | 'active-lab' | 'pir' | 'ranking';

export type PenguinTier = 'FIRST_PENGUIN' | 'SECOND_PENGUIN' | 'THIRD_PENGUIN' | 'LAST_PENGUIN';

export interface PenguinTierInfo {
  tier: PenguinTier;
  name: string;
  englishName: string;
  minSolved: number;
  maxSolved: number | null;
  badge: string;
  imageUrl: string;
  characterConcept: string;
  iconColor: string;
  badgeBg: string;
  badgeBorder: string;
  accentColor: string;
  tagline: string;
  description: string;
}

export type ScenarioCategory = 'DATABASE' | 'JAVA' | 'API' | 'JVM';

export type MasteryLevel = 'UNEXPLORED' | 'LEARNING' | 'FAMILIAR' | 'MASTERED';

export type PocketDrillType = '1min' | '3min' | '5min';

export interface MetricCard {

  label: string;
  value: string;
  sub?: string;
  isDanger?: boolean;
}

export interface DiagnosticOption {
  id: number;
  title: string;
  description: string;
  isCorrect: boolean;
}

export interface DetailTableRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  isDanger?: boolean;
}

export interface ScenarioDetailData {
  timeOccurred: string;
  metrics: MetricCard[];
  symptomText: string;
  clueTitle: string;
  clueType: 'sql' | 'java' | 'log' | 'config';
  clueSnippet: string;
  clueTip: string;
  planTitle: string;
  planBadge: string;
  planHeaders: [string, string, string, string];
  planRows: DetailTableRow[];
  planExplanation: string;
  options: DiagnosticOption[];
  rootCauseTheory: {
    title: string;
    points: string[];
    fixRule: string;
  };
  pir: {
    rootCauseSummary: string;
    rootCauseDetail: string;
    improvementBadge: string;
    before: {
      title: string;
      badge: string;
      snippet: string;
      metrics: { label: string; value: string; isBad?: boolean }[];
    };
    after: {
      title: string;
      badge: string;
      snippet: string;
      metrics: { label: string; value: string; isBad?: boolean }[];
    };
    takeaways: {
      num: number;
      title: string;
      description: string;
    }[];
  };
}

export interface Scenario {
  id: string;
  number: string;
  title: string;
  code: string;
  category: ScenarioCategory;
  difficultyStars: number;
  difficultyLabel: string;
  estimatedTime: string;
  description: string;
  tags: string[];
  isGolden?: boolean;
  solved: boolean;
  score?: number;
  accuracy?: number;
  cluster: string;
  incidentSummary: string;
  sqlId?: string;
  affectedEndpoint?: string;
  learningPoints: string[];
  detail: ScenarioDetailData;
  // Multi-pass Review & Mastery Tracking (다회독 체득화)
  reviewCount?: number;
  masteryLevel?: MasteryLevel;
  lastReviewedAt?: string;
  isBookmarked?: boolean;
  userNotes?: string;
}

