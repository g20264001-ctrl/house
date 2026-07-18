export interface EthicsCanvas {
  agentName: string;
  problem: string;
  goal: string;
  inputs: string;
  prohibited: string;
  humanVerification: string;
  privacyRules: string;
  fairnessRules: string;
}

export interface FamilyMember {
  id: string;
  numberCode: number; // Student/Family chosen code e.g. 101, 7, etc.
  codeName: string; // "나의 번호 7"
  preferences: string[]; // e.g., ["요리", "설거지"]
  fatigue: number; // 1 to 5 scale representing tiredness or workload
  note: string; // Specific notes like "오늘은 시험이 있음", "팔을 다침" etc.
}

export interface ChoreAssignment {
  choreName: string;
  assignedMemberCode: string;
  reason: string;
}

export interface SimulationResult {
  assignments: ChoreAssignment[];
  ethicsReport: string;
  isSimulated: boolean;
  isConfirmed: boolean; // Confirmed after final user click
}

export interface EthicsEvaluation {
  feedback: string;
  score: number;
  badge: string;
  suggestions: string[];
  isEvaluated: boolean;
}

export interface ImprovementRecord {
  testedIssues: string;
  finalImprovements: string;
  reflectionText: string;
  isSaved: boolean;
}

export enum AppScreen {
  HOME = "home",
  CANVAS = "canvas",
  AGENT_SIMULATOR = "simulator",
  IMPROVEMENT = "improvement",
  PRESENTATION = "presentation",
}
