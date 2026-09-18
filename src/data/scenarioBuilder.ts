import {
  Scenario,
  ScenarioCategory,
  MetricCard,
  DiagnosticOption,
  DetailTableRow,
} from '../types';

export interface ScenarioInputDef {
  id: string;
  number?: string;
  title: string;
  code?: string;
  category: ScenarioCategory;
  difficultyStars: number;
  description: string;
  tags: string[];
  isGolden?: boolean;
  timeOccurred?: string;
  metrics: MetricCard[];
  symptomText: string;
  clueTitle: string;
  clueType?: 'sql' | 'java' | 'log' | 'config';
  clueSnippet: string;
  clueTip: string;
  planTitle?: string;
  planBadge?: string;
  planHeaders?: [string, string, string, string];
  planRows: DetailTableRow[];
  planExplanation: string;
  options: DiagnosticOption[];
  rootCauseTitle: string;
  rootCausePoints: string[];
  fixRule: string;
  pir?: {
    rootCauseSummary?: string;
    rootCauseDetail?: string;
    improvementBadge?: string;
    before?: {
      title?: string;
      badge?: string;
      snippet: string;
      metrics?: { label: string; value: string; isBad?: boolean }[];
    };
    after?: {
      title?: string;
      badge?: string;
      snippet: string;
      metrics?: { label: string; value: string; isBad?: boolean }[];
    };
    takeaways?: { num: number; title: string; description: string }[];
  };
}

export function createScenario(def: ScenarioInputDef): Scenario {
  const diffLabel =
    def.difficultyStars === 1
      ? '초급'
      : def.difficultyStars === 2
      ? '중급'
      : def.difficultyStars === 3
      ? '고급'
      : '실무마스터';

  const defaultClueType =
    def.category === 'DATABASE'
      ? 'sql'
      : def.category === 'JAVA'
      ? 'java'
      : def.category === 'JVM'
      ? 'log'
      : 'config';

  const defaultPlanHeaders: [string, string, string, string] =
    def.planHeaders ||
    (def.category === 'DATABASE'
      ? ['Operation', 'Object', 'Rows', 'Note']
      : ['Thread/Component', 'Status', 'Duration', 'Trace']);

  const correctOpt = def.options.find((o) => o.isCorrect) || def.options[0];

  const defaultPir = {
    rootCauseSummary: def.pir?.rootCauseSummary || correctOpt.title,
    rootCauseDetail: def.pir?.rootCauseDetail || correctOpt.description,
    improvementBadge: def.pir?.improvementBadge || '시스템 레이턴시 95% 개선',
    before: {
      title: def.pir?.before?.title || '개선 전 (Before)',
      badge: def.pir?.before?.badge || '병목/장애 발생',
      snippet: def.pir?.before?.snippet || def.clueSnippet,
      metrics: def.pir?.before?.metrics || [
        { label: '평균 응답 속도', value: '4.5s', isBad: true },
        { label: '에러율 / CPU', value: '78%', isBad: true },
      ],
    },
    after: {
      title: def.pir?.after?.title || '개선 후 (After)',
      badge: def.pir?.after?.badge || '정상 처리 복구',
      snippet:
        def.pir?.after?.snippet ||
        `// 정상 패치 및 최적화 적용 완료\n// 원칙: ${def.fixRule}`,
      metrics: def.pir?.after?.metrics || [
        { label: '평균 응답 속도', value: '0.04s' },
        { label: '에러율 / CPU', value: '0.01%' },
      ],
    },
    takeaways: def.pir?.takeaways || [
      {
        num: 1,
        title: def.rootCauseTitle,
        description: def.rootCausePoints[0] || '지표 모니터링을 통한 사전 감지',
      },
      {
        num: 2,
        title: '실무 방어 조치 원칙',
        description: def.fixRule,
      },
    ],
  };

  return {
    id: def.id,
    number: def.number || def.id.replace(/\D/g, '').padStart(2, '0'),
    title: def.title,
    code: def.code || `INC-${def.category}-${def.id}`,
    category: def.category,
    difficultyStars: def.difficultyStars,
    difficultyLabel: diffLabel,
    estimatedTime: def.difficultyStars <= 2 ? '약 5분' : '약 10분',
    description: def.description,
    tags: def.tags,
    isGolden: def.isGolden,
    solved: false,
    score: 80 + Math.floor(Math.random() * 15),
    accuracy: 85 + Math.floor(Math.random() * 12),
    cluster: `PROD-${def.category}-CLUSTER`,
    incidentSummary: def.title,
    learningPoints: def.rootCausePoints.slice(0, 3),
    reviewCount: 0,
    masteryLevel: 'UNEXPLORED',
    isBookmarked: false,
    detail: {
      timeOccurred: def.timeOccurred || '14:20:00 프로덕션 트래픽 피크',
      metrics: def.metrics,
      symptomText: def.symptomText,
      clueTitle: def.clueTitle,
      clueType: def.clueType || defaultClueType,
      clueSnippet: def.clueSnippet,
      clueTip: def.clueTip,
      planTitle: def.planTitle || '실행 계획 및 시스템 분석',
      planBadge: def.planBadge || 'DIAGNOSTIC TRACE',
      planHeaders: defaultPlanHeaders,
      planRows: def.planRows,
      planExplanation: def.planExplanation,
      options: def.options,
      rootCauseTheory: {
        title: def.rootCauseTitle,
        points: def.rootCausePoints,
        fixRule: def.fixRule,
      },
      pir: defaultPir,
    },
  };
}
