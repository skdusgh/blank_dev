import { Scenario } from '../types';
import { DB_SCENARIOS } from './dbScenarios';
import { JAVA_SCENARIOS } from './javaScenarios';
import { API_SCENARIOS } from './apiScenarios';
import { JVM_SCENARIOS } from './jvmScenarios';

export const ALL_SCENARIOS: Scenario[] = [
  ...DB_SCENARIOS,
  ...JAVA_SCENARIOS,
  ...API_SCENARIOS,
  ...JVM_SCENARIOS,
];

export const SCENARIOS: Scenario[] = ALL_SCENARIOS;
export const INITIAL_SCENARIOS: Scenario[] = ALL_SCENARIOS;


