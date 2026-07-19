import React, { useState } from "react";
import { 
  Home, BookOpen, Users, FileEdit, Presentation, ShieldCheck, 
  Sparkles, HelpCircle, GraduationCap, ChevronRight 
} from "lucide-react";
import { AppScreen, EthicsCanvas, FamilyMember, SimulationResult, EthicsEvaluation, ImprovementRecord } from "./types";
import HomeView from "./components/HomeView";
import CanvasView from "./components/CanvasView";
import AgentSimulatorView from "./components/AgentSimulatorView";
import ImprovementView from "./components/ImprovementView";
import PresentationView from "./components/PresentationView";

export default function App() {
  // Global States
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  
  const [canvas, setCanvas] = useState<EthicsCanvas>({
    agentName: "",
    problem: "",
    goal: "",
    inputs: "",
    prohibited: "",
    humanVerification: "",
    privacyRules: "",
    fairnessRules: ""
  });

  // Default mock family members with ONLY custom chosen codes/relations to teach privacy by design.
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      numberCode: 1,
      codeName: "나",
      preferences: ["요리"],
      fatigue: 2,
      note: "오늘 수학 캠프 다녀옴"
    },
    {
      id: "2",
      numberCode: 2,
      codeName: "동생",
      preferences: ["설거지", "요리"],
      fatigue: 3,
      note: "오늘 하루 외부 일정으로 힘듦"
    },
    {
      id: "3",
      numberCode: 3,
      codeName: "엄마",
      preferences: ["집안 청소"],
      fatigue: 4,
      note: "장거리 출장으로 피곤하심"
    },
    {
      id: "4",
      numberCode: 4,
      codeName: "아빠",
      preferences: ["빨래", "설거지"],
      fatigue: 1,
      note: "컨디션 최고! 산책 다녀오심"
    }
  ]);

  const [simulation, setSimulation] = useState<SimulationResult>({
    assignments: [],
    ethicsReport: "",
    isSimulated: false,
    isConfirmed: false
  });

  const [evaluation, setEvaluation] = useState<EthicsEvaluation>({
    feedback: "",
    score: 0,
    badge: "",
    suggestions: [],
    isEvaluated: false
  });

  const [record, setRecord] = useState<ImprovementRecord>({
    testedIssues: "",
    finalImprovements: "",
    reflectionText: "",
    isSaved: false
  });

  // Helper list for sidebar steps
  const steps = [
    { id: AppScreen.HOME, label: "홈 (소개)", icon: Home },
    { id: AppScreen.CANVAS, label: "1. 윤리 설계 캔버스", icon: BookOpen },
    { id: AppScreen.AGENT_SIMULATOR, label: "2. 에이전트 시뮬레이션", icon: Users },
    { id: AppScreen.IMPROVEMENT, label: "3. 피드백 및 개선 기록", icon: FileEdit },
    { id: AppScreen.PRESENTATION, label: "4. 성과 발표 슬라이드", icon: Presentation },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col" id="app-root-container">
      {/* Dynamic Global Top Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40" id="main-global-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit mb-0.5">
                AI 윤리 캠프 활동지 (12~14세 대상)
              </span>
              <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">
                공정한 집안일 심부름 당번 고르기 AI 에이전트 만들기
              </h1>
            </div>
          </div>

          {/* Floating/dynamic helper tooltips of ethical badges */}
          {evaluation.isEvaluated && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full" id="header-ethics-badge">
              <span className="text-xs text-indigo-700 font-black flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                인증 배지: {evaluation.badge}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8" id="layout-body-wrapper">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0" id="main-sidebar-navigation">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sticky top-24 space-y-4 shadow-3xs">
            <div className="px-2 py-1 border-b border-slate-50 pb-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">캠프 진행 단계</h3>
            </div>
            <nav className="space-y-1" id="sidebar-nav-links">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isActive = currentScreen === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentScreen(step.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between group cursor-pointer ${
                      isActive 
                        ? "bg-indigo-600 text-white shadow-xs" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    id={`nav-tab-${step.id}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                      <span>{step.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </button>
                );
              })}
            </nav>
            
            {/* Quick Helper Explainer card inside sidebar */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-normal" id="sidebar-ethics-helper">
              <span className="font-extrabold text-slate-700 block mb-1">💡 윤리 훈련 핵심수칙</span>
              실명 대신 <strong className="text-indigo-600">엄마, 아빠, 별명 같은 호칭</strong>을 사용하여 프라이버시를 지키고, 최종 확정 시 꼭 <strong className="text-indigo-600">인간 확인 버튼</strong>을 누르는 것을 잊지 마세요!
            </div>
          </div>
        </aside>

        {/* Dynamic Main View Switcher */}
        <main className="flex-1 min-w-0" id="main-content-viewport">
          {currentScreen === AppScreen.HOME && (
            <HomeView onNavigate={setCurrentScreen} />
          )}

          {currentScreen === AppScreen.CANVAS && (
            <CanvasView
              canvas={canvas}
              onChangeCanvas={setCanvas}
              evaluation={evaluation}
              onSetEvaluation={setEvaluation}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === AppScreen.AGENT_SIMULATOR && (
            <AgentSimulatorView
              canvas={canvas}
              members={members}
              onSetMembers={setMembers}
              simulation={simulation}
              onSetSimulation={setSimulation}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === AppScreen.IMPROVEMENT && (
            <ImprovementView
              record={record}
              onSetRecord={setRecord}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === AppScreen.PRESENTATION && (
            <PresentationView
              canvas={canvas}
              simulation={simulation}
              record={record}
              evaluation={evaluation}
              onNavigate={setCurrentScreen}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400" id="global-page-footer">
        <p className="max-w-md mx-auto leading-relaxed">
          © 2026 AI Ethics Camp. 본 프로그램은 청소년들의 올바르고 공정한 가치 중심의 인공지능 설계를 훈련하기 위한 모의 도구입니다. 모든 정보는 브라우저 내부 임시 상태로 관리되어 외부에 저장되지 않습니다.
        </p>
      </footer>
    </div>
  );
}
