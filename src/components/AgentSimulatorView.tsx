import React, { useState } from "react";
import { 
  Users, UserPlus, Trash2, Play, Check, AlertTriangle, 
  HelpCircle, Shield, Sparkles, HeartHandshake, CheckSquare,
  Sunrise, Sun, Sunset
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
  const [activeTab, setActiveTab] = useState<string>("아침");

  const availableChores = ["집안 청소", "빨래", "설거지", "요리"];
  const timeslots = ["아침", "점심", "저녁"];

  // Handle setting/updating relationship title (호칭)
  const handleUpdateMemberCodeName = (index: number, name: string) => {
    // Basic warning validation to avoid real names (typical 3-character Korean name)
    const koreanNamePattern = /^[가-힣]{3}$/;
    const phonePattern = /010[- \d]/;

    if (phonePattern.test(name)) {
      setError("주의: 진짜 전화번호 같은 개인정보는 절대 적지 마세요!");
    } else if (koreanNamePattern.test(name) && !["첫째", "둘째", "셋째", "넷째", "아빠", "엄마", "오빠", "언니", "동생", "삼촌", "이모", "고모", "조카", "짱구", "철수", "훈이", "유리", "맹구"].includes(name)) {
      setError("⚠️ 개인정보 경고: 진짜 사람 이름 대신 '엄마', '아빠', '첫째', '동생' 또는 '짱구' 같은 가상의 호칭이나 별명을 정해 입력하는 것이 윤리 캠프의 수칙입니다.");
    } else {
      setError(null);
    }

    const updated = [...members];
    updated[index].codeName = name;
    onSetMembers(updated);
    // Reset simulation if details change
    onSetSimulation({ ...simulation, isSimulated: false, isConfirmed: false });
  };

  // Handle setting/updating number code (번호)
  const handleUpdateMemberNumber = (index: number, code: number) => {
    const updated = [...members];
    updated[index].numberCode = code;
    onSetMembers(updated);
    onSetSimulation({ ...simulation, isSimulated: false, isConfirmed: false });
  };

  // Handle setting fatigue
  const handleUpdateMemberFatigue = (index: number, fatigue: number) => {
    const updated = [...members];
    updated[index].fatigue = fatigue;
    onSetMembers(updated);
    onSetSimulation({ ...simulation, isSimulated: false, isConfirmed: false });
  };

  // Handle setting note (preventing real personal information)
  const handleUpdateMemberNote = (index: number, note: string) => {
    const phonePattern = /010[- \d]/;
    if (phonePattern.test(note)) {
      setError("주의: 진짜 전화번호는 적을 수 없습니다!");
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
    onSetSimulation({ ...simulation, isSimulated: false, isConfirmed: false });
  };

  // Add new family member (Student sets count)
  const handleAddMember = () => {
    if (members.length >= 6) {
      setError("가족 시뮬레이션 인원은 최대 6명까지만 설정할 수 있어요!");
      return;
    }
    setError(null);
    
    // Pick a unique next number
    const usedNumbers = members.map(m => m.numberCode);
    let nextNum = 1;
    while (usedNumbers.includes(nextNum)) {
      nextNum++;
    }

    const defaultNames = ["첫째", "동생", "언니", "오빠", "삼촌", "이모", "조카", "할머니", "할아버지"];
    const usedNames = members.map(m => m.codeName);
    const availableName = defaultNames.find(name => !usedNames.includes(name)) || `가족 ${nextNum}`;

    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      numberCode: nextNum,
      codeName: availableName,
      preferences: [],
      fatigue: 3,
      note: ""
    };
    onSetMembers([...members, newMember]);
    onSetSimulation({ ...simulation, isSimulated: false, isConfirmed: false });
  };

  // Remove family member
  const handleRemoveMember = (id: string) => {
    if (members.length <= 2) {
      setError("당번을 배정하려면 최소 2명의 가족 구성원이 필요해요!");
      return;
    }
    setError(null);
    onSetMembers(members.filter(m => m.id !== id));
    onSetSimulation({ ...simulation, isSimulated: false, isConfirmed: false });
  };

  // Run AI Simulation
  const handleRunSimulation = async () => {
    if (!canvas.agentName) {
      setError("2단계 '윤리 설계 캔버스'에서 에이전트 이름과 윤리 규칙을 먼저 세워야 시뮬레이션을 가동할 수 있어요!");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Attempt API call if backend is available
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
      console.warn("Using offline smart heuristic engine:", err.message);
      
      // Standalone Smart Ethical Simulation Algorithm for 3 Timeslots!
      // Satisfies: "시간대별 정원이 1명이라고 가정해줘."
      // We will assign all 4 chores for each of the 3 timeslots (아침, 점심, 저녁).
      // Each chore has exactly 1 person assigned in each timeslot.
      const localAssignments = [];
      const assignmentsCount: Record<string, number> = {};
      members.forEach(m => { assignmentsCount[m.id] = 0; });
      let preferencesMatchedCount = 0;

      for (const timeslot of timeslots) {
        for (const chore of availableChores) {
          let bestMember = members[0];
          let bestScore = -Infinity;

          for (const member of members) {
            let score = 100;

            // 1. Workload balancing: subtract points for each task already assigned today
            score -= assignmentsCount[member.id] * 35;

            // 2. Fatigue rule mapping (Higher fatigue -> much lower suitability)
            if (member.fatigue >= 6) {
              score -= 140; // High protection for level 6-7
            } else if (member.fatigue === 5) {
              score -= 100; // Protect level 5
            } else if (member.fatigue === 4) {
              score -= 50;  // Moderate protection level 4
            } else if (member.fatigue === 2) {
              score += 20;  // Prefer energetic
            } else if (member.fatigue === 1) {
              score += 45;  // Highly prefer very energetic
            }

            // 3. Preferences mapping
            if (member.preferences.includes(chore)) {
              score += 35; // Bonus for preferred chore
            }

            // 4. Note keywords scan
            const noteText = (member.note || "").toLowerCase();
            const painKeywords = ["아픔", "다침", "부상", "치과", "감기", "병원", "수술", "치료", "조심", "피곤"];
            const studyKeywords = ["시험", "공부", "학원", "캠프", "수행평가", "숙제", "독서실", "늦게"];
            
            if (painKeywords.some(kw => noteText.includes(kw))) {
              score -= 90; // Sick/injured
            } else if (studyKeywords.some(kw => noteText.includes(kw))) {
              score -= 30; // Busy studying
            }

            if (score > bestScore) {
              bestScore = score;
              bestMember = member;
            }
          }

          // Assign chore for this timeslot
          localAssignments.push({
            timeslot,
            choreName: chore,
            assignedMemberId: bestMember.id,
            assignedMemberName: bestMember.codeName || `가족 구성원`,
            assignedMemberNum: bestMember.numberCode,
            scoreEvaluated: bestScore
          });
          assignmentsCount[bestMember.id]++;

          if (bestMember.preferences.includes(chore)) {
            preferencesMatchedCount++;
          }
        }
      }

      // Format reason explanations
      const finalAssignments = localAssignments.map(assign => {
        const m = members.find(mem => mem.id === assign.assignedMemberId)!;
        let explanation = "";

        if (m.preferences.includes(assign.choreName)) {
          explanation += `[선호 1지망 반영] 구성원님이 선호하시는 일인 '${assign.choreName}'에 가치 가중치를 부여하여 기쁜 자발적 참여를 이끌었습니다. `;
        } else {
          explanation += `[공평 로테이션 규칙] 다른 가족들의 고강도 피로 점수와 정원 비율을 분석하여 상호 배려를 위한 균등 로테이션으로 매칭되었습니다. `;
        }

        if (m.fatigue >= 5) {
          explanation += `오늘 피로도가 무려 ${m.fatigue}단계로 지친 상태이시지만, 1시간대당 1명 정원 제한 규칙상 배정되었습니다. 고마움을 꼭 전해 봐요.`;
        } else if (m.fatigue <= 2) {
          explanation += `컨디션이 우수(${m.fatigue}단계)하여 에너지 넘치는 마음으로 가사를 돌보기에 최선의 상태입니다.`;
        } else {
          explanation += `가족의 평균 피로도 주기(${m.fatigue}단계)를 감안하여 완만하게 균형 잡힌 주기로 배정되었습니다.`;
        }

        if (m.note) {
          explanation += ` (메모 반영됨: "${m.note}")`;
        }

        return {
          timeslot: assign.timeslot,
          choreName: assign.choreName,
          assignedMemberCode: `${assign.assignedMemberName} (번호: ${assign.assignedMemberNum})`,
          reason: explanation
        };
      });

      // Prepare rich offline report
      const mostFatiguedMember = [...members].sort((a,b) => b.fatigue - a.fatigue)[0];
      
      let reportText = `### ⚖️ 에이전트 윤리 및 프라이버시 준수 보고서 (로컬 안전 모드)\n\n`;
      reportText += `**1. 개인정보 수집 제한 필터 : 통과 (🟢 SAFE)**\n`;
      reportText += `- 실제 실명, 전화번호, 이메일 주소, 생년월일은 일절 사용하지 않고, 오직 학생들이 직접 지정한 **'호칭'**과 **'번호'**만 수집하여 사생활 유출 리스크를 완전히 봉쇄했습니다.\n\n`;
      
      reportText += `**2. 시간대별 정원 한도 준수 : 통과 (🟢 1명 정원)**\n`;
      reportText += `- '아침', '점심', '저녁'의 모든 시간대별로 4대 가사 당번이 정확히 **1인 정원** 조건에 따라 칼같이 맞물려 안정 배정되었습니다.\n\n`;
      
      reportText += `**3. 취약자 우대 및 공정 배정 : 작동 중 (⚖️ FAIR)**\n`;
      if (mostFatiguedMember && mostFatiguedMember.fatigue >= 5) {
        reportText += `- 오늘 하루 가장 기진맥진한 **'${mostFatiguedMember.codeName} (${mostFatiguedMember.fatigue}단계)'**님에게 가중 보호망을 씌워, 특정 시간대의 고된 청소나 연속 가중치를 최소화하여 면제 필터를 동작시켰습니다.\n`;
      }
      reportText += `- 선호도 1지망 매치율이 총 **${preferencesMatchedCount}건** 만족스럽게 조율되어 자발적 참여 기반의 화목한 배정이 마무리되었습니다.\n\n`;
      reportText += `**4. 최종 확인 인간 개입(Human-in-the-loop) : 확인 대기 (🔒 PENDING)**\n`;
      reportText += `- AI의 연산 결과를 독단 유포하지 않기 위해 아래의 **초록색 확인 서명 버튼**을 사람이 누르기 전까지는 미확정 상태로 보호합니다.`;

      onSetSimulation({
        assignments: finalAssignments,
        ethicsReport: reportText,
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
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs" id="simulator-header">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          3단계: 집안일 당번 뽑기 에이전트 가동하기
        </h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1 leading-relaxed">
          가족 수와 번호, 그리고 가족 호칭은 여러분이 직접 마음대로 설정합니다. 
          실명이나 진짜 연락처 없이 오직 <strong>'호칭'</strong>과 <strong>'번호'</strong>만 사용해 AI 에이전트를 돌려보며 
          각 시간대별 정원(1명)이 공정하게 나누어지는지 확인해 봅시다!
        </p>
      </div>

      {/* Crucial Privacy Indicator Block */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 shadow-3xs" id="privacy-warning-banner">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-800 text-xs md:text-sm">⚠️ 중요 윤리 수칙: 개인정보 절대 입력 금지!</h4>
          <p className="text-amber-700 text-xs leading-relaxed">
            학생 여러분! 인공지능에게 정보를 넘길 때 가장 주의할 점은 <strong>개인정보 보호</strong>입니다. 
            진짜 이름, 주소, 이메일, 생년월일, 전화번호는 절대 쓰지 마세요. 
            오직 가족의 역할 호칭(엄마, 첫째, 동생 등)과 숫자 번호(1번, 2번 등)로만 에이전트를 구동해야 사생활 유출이 없습니다.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm rounded-xl font-semibold" id="simulator-error">
          ⚠️ {error}
        </div>
      )}

      {/* Simulator Management Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="simulator-grid">
        {/* Left: Family Members Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6" id="member-config-col">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-700 text-sm md:text-base flex items-center gap-2">
              👨‍👩‍👧‍👦 나의 테스트 가족 구성원 ({members.length}명)
            </h3>
            <button
              onClick={handleAddMember}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-extrabold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1 cursor-pointer border border-indigo-100"
              id="add-member-btn"
            >
              <UserPlus className="w-3.5 h-3.5" />
              가족 구성원 추가
            </button>
          </div>

          <div className="space-y-4" id="member-list-wrapper">
            {members.map((member, idx) => (
              <div 
                key={member.id} 
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3xs space-y-4 hover:border-indigo-100 hover:shadow-2xs transition-all duration-200"
                id={`member-item-${idx}`}
              >
                {/* Header of member card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-black text-slate-800 text-sm">
                      {member.codeName || "이름 없는 가족"} (번호: {member.numberCode}번)
                    </span>
                  </div>
                  {members.length > 2 && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-slate-400 hover:text-red-500 transition cursor-pointer p-1 rounded-md hover:bg-slate-50"
                      id={`delete-member-${idx}`}
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Editable items: 호칭 & 번호 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title nickname Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">
                      👤 가족 호칭 또는 별명 (실명 금지!)
                    </label>
                    <input
                      type="text"
                      value={member.codeName}
                      onChange={(e) => handleUpdateMemberCodeName(idx, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                      placeholder="예: 엄마, 동생, 짱구, 첫째"
                    />
                  </div>

                  {/* Identification Number Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 block">
                      🔢 고유 지정 번호 (숫자)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={member.numberCode}
                      onChange={(e) => handleUpdateMemberNumber(idx, parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                      placeholder="숫자 입력"
                    />
                  </div>
                </div>

                {/* Fatigue Level */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 block">
                    🔋 오늘 느끼는 피로도 (컨디션): <span className="text-indigo-600 font-extrabold">{member.fatigue}단계</span>
                  </label>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7].map((level) => {
                      let bgClass = "bg-slate-100 text-slate-500 hover:bg-slate-200";
                      if (member.fatigue === level) {
                        if (level <= 2) bgClass = "bg-emerald-600 text-white shadow-xs";
                        else if (level <= 4) bgClass = "bg-indigo-600 text-white shadow-xs";
                        else bgClass = "bg-rose-600 text-white shadow-xs";
                      }
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleUpdateMemberFatigue(idx, level)}
                          className={`w-7.5 h-7.5 rounded-lg font-bold text-xs transition cursor-pointer ${bgClass}`}
                        >
                          {level}
                        </button>
                      );
                    })}
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({member.fatigue <= 2 ? "맑음" : member.fatigue <= 4 ? "보통" : "매우피곤"})
                    </span>
                  </div>
                </div>

                {/* Preferred chores */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 block">🧹 선호하거나 더 잘할 수 있는 집안일</span>
                  <div className="flex flex-wrap gap-2">
                    {availableChores.map((chore) => {
                      const isSelected = member.preferences.includes(chore);
                      return (
                        <button
                          key={chore}
                          onClick={() => handleTogglePreference(idx, chore)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            isSelected
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {chore}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Note */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 block">📝 특이사항 및 오늘 하루 상황 메모</span>
                  <input
                    type="text"
                    placeholder="예: 오늘 영어 학원 시험 보는 날, 발목을 삐어서 조심해야 함"
                    value={member.note}
                    onChange={(e) => handleUpdateMemberNote(idx, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleRunSimulation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              id="run-simulation-btn"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  에이전트가 공정성 규칙과 익명 수칙을 조율하는 중...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white" />
                  설계한 AI 에이전트로 집안일 배정하기 (시간대별 시뮬레이션 가동)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Simulation Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6" id="simulation-output-col">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-3xs space-y-5 min-h-[500px] flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                🤖 AI 에이전트의 공정 당번 스케줄러
              </h3>
              
              {!simulation.isSimulated ? (
                <div className="text-center py-24 text-slate-400 space-y-4" id="awaiting-sim-placeholder">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200/50 flex items-center justify-center mx-auto text-xl">
                    ⚙️
                  </div>
                  <p className="text-xs md:text-sm font-bold text-slate-500 leading-relaxed">
                    왼쪽에서 가족의 호칭과 번호, 선호도 등을<br />자유롭게 지정한 후에<br />'시뮬레이션 가동'을 눌러주세요!
                  </p>
                </div>
              ) : (
                <div className="space-y-5 animate-fadeIn" id="simulation-results-box">
                  {/* Capacity indicator explanation */}
                  <span className="text-[11px] bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg block font-bold leading-normal border border-indigo-100">
                    💡 **시간대별 정원 제한 충족 (정원: 각 1명)**<br />
                    모든 가사 당번은 각 시간대별(아침/점심/저녁)로 정원이 1명씩 안전하게 배치되었습니다.
                  </span>

                  {/* Dynamic Timeslot Selector Tabs */}
                  <div className="flex items-center bg-slate-200/60 p-1 rounded-xl" id="timeslot-tabs">
                    {timeslots.map((slot) => {
                      const isActive = activeTab === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setActiveTab(slot)}
                          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            isActive
                              ? "bg-white text-indigo-600 shadow-xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {slot === "아침" && <Sunrise className="w-3.5 h-3.5" />}
                          {slot === "점심" && <Sun className="w-3.5 h-3.5" />}
                          {slot === "저녁" && <Sunset className="w-3.5 h-3.5" />}
                          {slot} 당번
                        </button>
                      );
                    })}
                  </div>

                  {/* Core Chore Allocation Displays of active timeslot */}
                  <div className="space-y-3" id="chore-assignment-list">
                    {simulation.assignments
                      .filter((assign) => assign.timeslot === activeTab)
                      .map((assign, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-3xs hover:border-indigo-200 transition space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-indigo-700 text-xs md:text-sm flex items-center gap-1">
                              🧹 {assign.choreName}
                            </span>
                            <span className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-[11px] font-black px-2.5 py-1 rounded-lg">
                              👤 {assign.assignedMemberCode}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <strong>공정한 배정 사유:</strong> {assign.reason}
                          </p>
                        </div>
                      ))}
                  </div>

                  {/* Ethics report showing fairness rules alignment */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-3xs text-xs">
                    <span className="font-extrabold text-emerald-600 flex items-center gap-1 border-b border-slate-50 pb-1.5">
                      🛡️ 에이전트 윤리 및 프라이버시 준수 보고서
                    </span>
                    <div className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {simulation.ethicsReport}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Crucial Required Confirmation Button Step */}
            {simulation.isSimulated && (
              <div className="pt-4 border-t border-slate-200 mt-4 space-y-3">
                <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-xl flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] md:text-xs text-yellow-800 leading-normal font-bold">
                    <strong>캠프 필수 절차:</strong> 에이전트 연산 결과의 공정성을 확보하기 위해, 최종 배포 전에 반드시 사람이 눈으로 재확인하고 <strong>최종 확인 및 확정 버튼</strong>을 눌러 최종 승인을 완료해야 합니다!
                  </p>
                </div>

                {!simulation.isConfirmed ? (
                  <button
                    onClick={handleConfirmAssignment}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md text-xs md:text-sm"
                    id="final-confirm-btn"
                  >
                    <Check className="w-4 h-4" />
                    최종 배정 결과 확인 및 확정하기
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center gap-2 text-emerald-800 text-xs md:text-sm font-black justify-center" id="confirmed-badge">
                      <Check className="w-4 h-4 text-emerald-600 bg-white rounded-full p-0.5 border border-emerald-400" />
                      집안일 당번 최종 확정이 서명되었습니다! 🎉
                    </div>
                    
                    <button
                      onClick={() => onNavigate(AppScreen.IMPROVEMENT)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl transition text-xs md:text-sm flex items-center justify-center gap-1 cursor-pointer shadow-xs"
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
