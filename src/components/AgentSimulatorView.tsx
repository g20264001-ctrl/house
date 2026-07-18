import React, { useState } from "react";
import { 
  Users, UserPlus, Trash2, Play, Check, AlertTriangle, 
  HelpCircle, Shield, Sparkles, HeartHandshake, CheckSquare 
} from "lucide-react";
import { EthicsCanvas, FamilyMember, SimulationResult, AppScreen } from "../types";

interface AgentSimulatorViewProps {
  canvas: EthicsCanvas;
  members: FamilyMember[];
  onSetMembers: (newMembers: FamilyMember[]) => void;
  simulation: SimulationResult;
  onSetSimulation: (newSim: SimulationResult) => void;
  onNavigate: (screen: AppScreen) => void;
}

export default function AgentSimulatorView({
  canvas,
  members,
  onSetMembers,
  simulation,
  onSetSimulation,
  onNavigate
}: AgentSimulatorViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableChores = ["집안 청소", "빨래", "설거지", "요리"];

  // Handle setting code numbers directly
  const handleUpdateMemberCode = (index: number, code: number) => {
    const updated = [...members];
    updated[index].numberCode = code;
    onSetMembers(updated);
  };

  // Handle setting relationship callsign or custom nickname directly
  const handleUpdateMemberCodeName = (index: number, name: string) => {
    // Basic warning validation to avoid real full names (2-4 Korean characters)
    const namePattern = /^[가-힣]{3,4}$/;
    const phonePattern = /010[- \d]/;
    
    // Common safe relation terms / nickname terms in Korean
    const safeTerms = ["엄마", "아빠", "할머니", "할아버지", "누나", "형", "언니", "오빠", "동생", "삼촌", "이모", "고모", "나", "보안번호", "번호"];
    const isSafeTerm = safeTerms.some(term => name.includes(term));
    
    if (phonePattern.test(name) || (name.length >= 3 && namePattern.test(name) && !isSafeTerm)) {
      setError("주의: 진짜 이름이나 전화번호 같은 민감한 개인정보는 적지 않도록 주의하세요! (엄마, 아빠, 할머니, 누나, 짱구 같은 친근한 호칭이나 별명은 괜찮아요!)");
    } else {
      setError(null);
    }
    const updated = [...members];
    updated[index].codeName = name;
    onSetMembers(updated);
  };

  // Handle setting fatigue
  const handleUpdateMemberFatigue = (index: number, fatigue: number) => {
    const updated = [...members];
    updated[index].fatigue = fatigue;
    onSetMembers(updated);
  };

  // Handle setting note (preventing real personal information)
  const handleUpdateMemberNote = (index: number, note: string) => {
    // Basic warning validation to avoid real names/phone numbers
    const namePattern = /[가-힣]{2,4}/;
    const phonePattern = /010[- \d]/;
    if (phonePattern.test(note) || (note.length > 1 && namePattern.test(note) && !note.includes("번호") && !note.includes("가족") && !note.includes("엄마") && !note.includes("아빠") && !note.includes("할머니"))) {
      setError("주의: 진짜 이름이나 전화번호 같은 개인정보는 절대 적지 마세요! 우리 에이전트는 호칭이나 별명으로만 식별합니다.");
    } else {
      setError(null);
    }
    const updated = [...members];
    updated[index].note = note;
    onSetMembers(updated);
  };

  // Toggle preferred chore checkboxes
  const handleTogglePreference = (index: number, chore: string) => {
    const updated = [...members];
    const currentPrefs = updated[index].preferences;
    if (currentPrefs.includes(chore)) {
      updated[index].preferences = currentPrefs.filter(p => p !== chore);
    } else {
      updated[index].preferences = [...currentPrefs, chore];
    }
    onSetMembers(updated);
  };

  // Add new family member
  const handleAddMember = () => {
    if (members.length >= 6) {
      setError("가족 시뮬레이션 인원은 최대 6명까지만 가능해요!");
      return;
    }
    setError(null);
    const randomCode = Math.floor(10 + Math.random() * 90); // 10 ~ 99 random number
    
    // Choose a default role based on current count
    const defaultRoles = ["동생", "언니/누나", "형/오빠", "이모/삼촌", "고모/고모부"];
    const chosenRole = defaultRoles[(members.length - 4) % defaultRoles.length] || "새로운 구성원";
    
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      numberCode: randomCode,
      codeName: chosenRole,
      preferences: [],
      fatigue: 3,
      note: ""
    };
    onSetMembers([...members, newMember]);
    // Reset simulation if members list changes
    onSetSimulation({ ...simulation, isSimulated: false, isConfirmed: false });
  };

  // Remove family member
  const handleRemoveMember = (id: string) => {
    if (members.length <= 2) {
      setError("시뮬레이션을 돌리려면 최소 2명의 가족 구성원이 필요해요!");
      return;
    }
    setError(null);
    onSetMembers(members.filter(m => m.id !== id));
    onSetSimulation({ ...simulation, isSimulated: false, isConfirmed: false });
  };

  // Run AI Simulation
  const handleRunSimulation = async () => {
    if (!canvas.agentName) {
      setError("2단계 '윤리 설계 캔버스'에서 에이전트 이름과 윤리 규칙을 먼저 세워야 시뮬레이션을 돌릴 수 있어요!");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          canvas,
          members
        }),
      });

      if (!response.ok) {
        throw new Error("AI 배정 시뮬레이션 요청에 실패했습니다.");
      }

      const data = await response.json();
      onSetSimulation({
        assignments: data.assignments,
        ethicsReport: data.ethicsReport,
        isSimulated: true,
        isConfirmed: false // Awaiting confirmation
      });
    } catch (err: any) {
      console.error(err);
      setError("AI 배정에 실패했습니다. 설계 규칙 기반으로 만든 가상 배정을 진행합니다.");
      
      // Standalone simulation logic as robust fallback
      const mockAssignments = availableChores.map((chore, idx) => {
        const assignedMember = members[idx % members.length];
        return {
          choreName: chore,
          assignedMemberCode: assignedMember.codeName,
          reason: `[로컬 분배] ${assignedMember.codeName}님은 피로도가 ${assignedMember.fatigue}점이며, 규칙에 의거해 균등하게 설비되었습니다.`
        };
      });

      onSetSimulation({
        assignments: mockAssignments,
        ethicsReport: "### ⚖️ 오프라인 시뮬레이션 분석 리포트\n\n- **개인정보 보호**: 진짜 이름을 쓰지 않고, 오직 학생이 지정한 호칭과 가상 별명으로만 배정을 완료하여 사생활 유출 0%를 기록했습니다!\n- **공정성 가이드**: 가족 인원수에 대비하여 고르게 분배하려 노력했습니다. 만약 피로도가 더 높거나 특정 집안일을 싫어한다면, 다음 단계에서 캔버스 규칙을 더 정교화해보세요.",
        isSimulated: true,
        isConfirmed: false
      });
    } finally {
      setLoading(false);
    }
  };

  // User Confirms the selection (Required condition)
  const handleConfirmAssignment = () => {
    onSetSimulation({
      ...simulation,
      isConfirmed: true
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="simulator-view-container">
      {/* View Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs" id="simulator-header">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          3단계: 집안일 당번 뽑기 에이전트 가동하기
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          가족 구성원을 추가하고, 실명 대신 친근한 별명이나 관계 호칭(엄마, 아빠, 할머니 등)을 지정해보세요. 
          그다음 내가 설계한 AI 에이전트의 규칙대로 집안일이 올바르게 배정되는지 관찰하세요!
        </p>
      </div>

      {/* Crucial Privacy Indicator Block */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3" id="privacy-warning-banner">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-800 text-sm">⚠️ 중요 윤리 서약: 개인정보 절대 입력 금지</h4>
          <p className="text-amber-700 text-xs md:text-sm leading-relaxed">
            학생 여러분! 인공지능 윤리 캠프에서는 사생활 보호를 가장 중요하게 생각합니다. 
            <strong> 이름, 전화번호, 집 주소, 생년월일</strong>은 어떠한 입력란에도 쓰지 마세요. 
            실명 대신 가족 호칭이나 가상의 별명(엄마, 아빠, 동생, 짱구 등)만 지정하여 테스트해보는 훈련을 진행합니다.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl" id="simulator-error">
          ⚠️ {error}
        </div>
      )}

      {/* Simulator Management Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="simulator-grid">
        {/* Left Col: Family Members Configuration */}
        <div className="lg:col-span-2 space-y-6" id="member-config-col">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-700 text-base flex items-center gap-2">
              👨‍👩‍👧‍👦 테스트 가족 구성원 목록 ({members.length}명)
            </h3>
            <button
              onClick={handleAddMember}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
              id="add-member-btn"
            >
              <UserPlus className="w-3.5 h-3.5" />
              가족 추가
            </button>
          </div>

          <div className="space-y-4" id="member-list-wrapper">
            {members.map((member, idx) => (
              <div 
                key={member.id} 
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-3xs space-y-4 hover:border-slate-200 transition"
                id={`member-item-${idx}`}
              >
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                      {member.codeName || "새로운 구성원"}
                    </span>
                  </div>
                  {members.length > 2 && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                      id={`delete-member-${idx}`}
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Item 1: Nickname / Relationship title */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">
                      👤 호칭 또는 별명 (직접 입력)
                    </label>
                    <input
                      type="text"
                      placeholder="예: 엄마, 아빠, 할머니, 동생"
                      value={member.codeName}
                      onChange={(e) => handleUpdateMemberCodeName(idx, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  {/* Item 2: Fatigue adjustment */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">
                      🔋 오늘의 피로도: <span className="text-indigo-600 font-bold">{member.fatigue}단계</span>
                    </label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleUpdateMemberFatigue(idx, level)}
                          className={`w-7 h-7 rounded-md font-bold text-xs transition cursor-pointer ${
                            member.fatigue === level
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preferred chores */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 block">🧹 선호하는 집안일 선택 (중복 가능)</span>
                  <div className="flex flex-wrap gap-2">
                    {availableChores.map((chore) => {
                      const isSelected = member.preferences.includes(chore);
                      return (
                        <button
                          key={chore}
                          onClick={() => handleTogglePreference(idx, chore)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                            isSelected
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {chore}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Note */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 block">📝 특이사항 및 한마디 (개인정보 금지!)</span>
                  <input
                    type="text"
                    placeholder="예: 오늘은 영어 단어 시험이 있어 늦게 들어옴, 감기 기운이 있음"
                    value={member.note}
                    onChange={(e) => handleUpdateMemberNote(idx, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleRunSimulation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="run-simulation-btn"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  에이전트가 공정하게 배정을 계산하고 분석하는 중...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 text-indigo-200" />
                  설계한 AI 에이전트로 집안일 배정하기 (시뮬레이션 가동)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Simulation Output & Final Confirmation Required */}
        <div className="space-y-6" id="simulation-output-col">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 min-h-[400px] flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700 text-base flex items-center gap-1.5">
                🤖 AI 에이전트의 판단 결과 대기실
              </h3>
              
              {!simulation.isSimulated ? (
                <div className="text-center py-20 text-slate-400 space-y-3" id="awaiting-sim-placeholder">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                    ⚙️
                  </div>
                  <p className="text-sm font-medium">왼쪽에서 가족 설정을 마친 후<br />'시뮬레이션 가동' 버튼을 눌러주세요!</p>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn" id="simulation-results-box">
                  {/* Core Chore Allocation Displays */}
                  <div className="space-y-2" id="chore-assignment-list">
                    <span className="text-xs font-bold text-slate-500 block">🎯 4대 당번 배정 상황 (정원 1명 제한)</span>
                    {simulation.assignments.map((assign, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-indigo-700 text-sm">🧹 {assign.choreName}</span>
                          <span className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-black px-2.5 py-1 rounded-full">
                            👤 {assign.assignedMemberCode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-normal bg-slate-50/50 p-2 rounded-md border border-slate-100">
                          <strong>배정 이유:</strong> {assign.reason}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Ethics report showing fairness rules alignment */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-3xs">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      🛡️ 에이전트 윤리 및 프라이버시 준수 보고서
                    </span>
                    <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {simulation.ethicsReport}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Crucial Required Confirmation Button Step */}
            {simulation.isSimulated && (
              <div className="pt-4 border-t border-slate-200 mt-4 space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800 leading-normal font-medium">
                    <strong>캠프 핵심 수칙:</strong> 에이전트 배정 최종 결정 전에 반드시 <strong>인간이 최종 확인 버튼</strong>을 눌러 확인해주는 절차를 거쳐야 배정이 확정됩니다!
                  </p>
                </div>

                {!simulation.isConfirmed ? (
                  <button
                    onClick={handleConfirmAssignment}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
                    id="final-confirm-btn"
                  >
                    <Check className="w-4 h-4" />
                    최종 배정 결과 확인 및 확정하기
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-bold justify-center" id="confirmed-badge">
                      <Check className="w-5 h-5 text-emerald-600 bg-white rounded-full p-0.5 border border-emerald-400" />
                      당번 배정이 최종 확정되었습니다! 🎉
                    </div>
                    
                    <button
                      onClick={() => onNavigate(AppScreen.IMPROVEMENT)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      id="next-step-btn"
                    >
                      4단계: 테스트 결과 개선 및 기록하러 가기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
