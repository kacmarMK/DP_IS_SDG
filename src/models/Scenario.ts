interface Scenario {
  id: string;
  rules: string;
  name: string;
  devices?: Array<string>;
  deactivated: boolean;
  alreadyTriggered: boolean;
  mutedUntil: number;
  createdAt: number;
  forTimeCountingActivatedAt: Map<string, number>;
  messageAndTriggerTime: Map<string, Array<number>>;
  messageMultiplicityCounter: Map<string, number>;
  deviceAndTag: Map<string, Array<string>>;
  jobAndTriggerTime: Map<string, Array<number>>;
  activeAtDay: Array<number>;
  activeAtHour: Array<number>;
}

interface ScenarioFrame {
  rules?: string;
  name: string;
  devices?: Array<string>;
  deactivated?: boolean;
  alreadyTriggered?: boolean;
  mutedUntil?: number;
  activeAtDay?: Array<number>;
  activeAtHour?: Array<number>;
  deviceAndTag: Map<string, Array<string>>;
}

export type { Scenario, ScenarioFrame };
