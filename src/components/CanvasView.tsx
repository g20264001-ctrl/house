import React, { useState } from "react";
import { 
  FileText, Shield, UserCheck, AlertOctagon, HeartHandshake, 
  HelpCircle, Sparkles, Wand2, ArrowRight, CheckCircle2, RotateCcw, 
  ThumbsUp, BookOpen 
} from "lucide-react";
import { EthicsCanvas, EthicsEvaluation, AppScreen } from "../types";

interface CanvasViewProps {
  canvas: EthicsCanvas;
  onChangeCanvas: (newCanvas: EthicsCanvas) => void;
  evaluation: EthicsEvaluation;
  onSetEvaluation: (evalData: EthicsEvaluation) => void;
  onNavigate: (screen: AppScreen) => void;
}

export default function CanvasView({ 
  canvas, 
  onChangeCanvas, 
  evaluation, 
  onSetEvaluation, 
  onNavigate 
}: CanvasViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Template/Preset data
  const examplePreset = {
    agentName: "모두 행복 공정 에이전트 봇",
    problem: "가족들이 주말 집안일 당번을 정할 때 서로 더 편한 일을 하겠다고 갈등하는 문제",
    goal: "가족 구성원 전체의 기분과 건강을 고려하여 사생활 유출 없이 모두가 기쁘게 납득하는 집안일 분배",
    inputs: "가족 구성원 각각의 호칭 또는 별명, 개별 집안일 선호 여부, 오늘 느끼는 피로도 점수(1~5)",
    prohibited: "실제 이름이나 집 주소, 이메일 같은 민감한 정보 수집하기, 한 사람에게 일 3개 이상 한꺼번에 몰아주기",
    humanVerification: "배정받은 당번이 부득이하게 다쳤거나 급한 사정으로 수행이 어려워 재심사를 요청하는 상황",
    privacyRules: "실명 대신 '엄마', '아빠', '동생', '짱구' 등 친근한 호칭이나 별명만 사용하여 진짜 개인 식별 정보를 숨긴다.",
    fairnessRules: "피로도 수치가 가장 높은 사람에게는 집안일을 가벼운 것으로 배정하고, 선호도가 있는 일 위주로 최대한 매칭해 균형을 잡는다."
  };

  const handleApplyPreset = () => {
    onChangeCanvas(examplePreset);
  };

  const handleReset = () => {
    onChangeCanvas({
      agentName: "",
      problem: "",
      goal: "",
      inputs: "",
      prohibited: "",
      humanVerification: "",
      privacyRules: "",
      fairnessRules: ""
    });
    onSetEvaluation({
      feedback: "",
      score: 0,
      badge: "",
      suggestions: [],
      isEvaluated: false
    });
    setError(null);
  };

  const handleEvaluate = async () => {
    if (!canvas.agentName.trim() || !canvas.fairnessRules.trim() || !canvas.privacyRules.trim()) {
      setError("에이전트 이름, 개인정보 보호 규칙, 공정성 규칙은 필수 항목입니다. 조금이라도 작성해보세요!");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(canvas),
      });

      if (!response.ok) {
        throw new Error("AI 평가 요청을 처리하지 못했습니다.");
      }

      const data = await response.json();
      onSetEvaluation({
        feedback: data.feedback,
        score: data.score,
        badge: data.badge,
        suggestions: data.suggestions || [],
        isEvaluated: true
      });
    } catch (err: any) {
      console.error(err);
      setError("AI 멘토 평가에 실패했습니다. 임시 평가 결과를 불러옵니다.");
      // Soft fallback for robust UX
      onSetEvaluation({
        feedback: "### 💡 윤리 꿈나무 에이전트 평가\n\n멋진 시도예요! 실명 대신 '엄마', '아빠', '동생', '짱구' 같이 익명성이 보장된 별명과 호칭만 활용하여 가동하려 한 사생활 보호 전략이 매우 돋보입니다. 공정성 규칙도 세부적으로 적혀 있어 가족 배정에 큰 역할을 하겠네요!\n\n**[칭찬 한시점]** 에이전트의 목표가 뚜렷하며, 사람 확인 절차를 거친다는 점에서 인공지능 통제권(Human in the loop)을 영리하게 확보했습니다.",
        score: 85,
        badge: "윤리 설계자",
        suggestions: [
          "입력 정보 목록에 실제 이름이나 전화번호 등의 개인 식별 값이 실수로 들어가지 않도록 다시 한 번만 점검해 보세요.",
          "피로도 수치가 동점일 때는 어떻게 해결할지 공정성 예외 조항을 하나 두면 좋아요!"
        ],
        isEvaluated: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="canvas-view-container">
      {/* Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs" id="canvas-intro-box">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            2단계: AI 윤리 설계 캔버스 작성하기
          </h2>
          <p className="text-slate-500 text-sm">
            학생 여러분만의 똑똑하고 안전한 집안일 AI 규칙을 8가지 질문을 통해 짜 보세요. 어려운 단어는 툴팁 설명을 확인하세요!
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap" id="canvas-actions">
          <button
            onClick={handleApplyPreset}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-3.5 py-2 rounded-xl text-xs transition duration-150 flex items-center gap-1 cursor-pointer border border-amber-200"
          >
            <Wand2 className="w-3.5 h-3.5" />
            작성 예시 불러오기
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3.5 py-2 rounded-xl text-xs transition duration-150 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            지우기
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl" id="canvas-error">
          ⚠️ {error}
        </div>
      )}

      {/* Grid of 8 Canvas Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="canvas-grid">
        {/* Card 1: Agent Name */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 flex flex-col justify-between" id="canvas-card-1">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">1</span>
              에이전트 이름 <span className="text-red-500">*</span>
            </label>
            <p className="text-slate-400 text-xs">내 인공지능 비서에게 특별하고 기억하기 쉬운 이름을 붙여주세요.</p>
          </div>
          <input
            type="text"
            placeholder="예: 공평이 봇, 배려 집안일 조율사"
            value={canvas.agentName}
            onChange={(e) => onChangeCanvas({ ...canvas, agentName: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Card 2: Problem */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 flex flex-col justify-between" id="canvas-card-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">2</span>
              해결할 문제
            </label>
            <p className="text-slate-400 text-xs">집에서 집안일 당번을 나눌 때 어떤 불만이나 어려움이 있었나요?</p>
          </div>
          <textarea
            rows={2}
            placeholder="예: 어제도 청소를 한 오빠가 오늘도 청소를 하도록 불평이 나오거나, 당번을 정할 때마다 싸워요."
            value={canvas.problem}
            onChange={(e) => onChangeCanvas({ ...canvas, problem: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition resize-none"
          />
        </div>

        {/* Card 3: Goal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 flex flex-col justify-between" id="canvas-card-3">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">3</span>
              에이전트의 목표
            </label>
            <p className="text-slate-400 text-xs">내 인공지능 에이전트가 어떤 행복한 결과를 도출하기를 원하나요?</p>
          </div>
          <textarea
            rows={2}
            placeholder="예: 가족 모두의 일일 컨디션을 파악하고 기쁜 마음으로 승낙할 수 있는 배정 상태 달성하기"
            value={canvas.goal}
            onChange={(e) => onChangeCanvas({ ...canvas, goal: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition resize-none"
          />
        </div>

        {/* Card 4: Inputs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 flex flex-col justify-between" id="canvas-card-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">4</span>
              입력받을 정보
            </label>
            <p className="text-slate-400 text-xs">판단을 위해 AI에게 제공해야 하는 데이터는 무엇인가요? (개인정보 제외)</p>
          </div>
          <textarea
            rows={2}
            placeholder="예: 가족들의 호칭이나 별명, 오늘 하루 컨디션(피로도 점수), 본인이 좋아하는 심부름"
            value={canvas.inputs}
            onChange={(e) => onChangeCanvas({ ...canvas, inputs: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition resize-none"
          />
        </div>

        {/* Card 5: Prohibited actions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 flex flex-col justify-between" id="canvas-card-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">5</span>
              절대 하면 안 되는 행동
            </label>
            <p className="text-slate-400 text-xs">에이전트가 배정할 때 범할 수 있는 가장 위험하거나 편향된 결정은 무엇인가요?</p>
          </div>
          <textarea
            rows={2}
            placeholder="예: 특정 구성원에게 당번 연속으로 3회 이상 몰아주기, 아픈 가족에게 무리한 일 몰아주기"
            value={canvas.prohibited}
            onChange={(e) => onChangeCanvas({ ...canvas, prohibited: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition resize-none"
          />
        </div>

        {/* Card 6: Human Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 flex flex-col justify-between" id="canvas-card-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">6</span>
              사람 확인이 필요한 순간 (인간 개입 루프)
            </label>
            <p className="text-slate-400 text-xs">AI 결정대로 따르지 않고, 인간이 직접 확인하고 개입해야 하는 순간은 언제인가요?</p>
          </div>
          <textarea
            rows={2}
            placeholder="예: 결과 확정 직전에 온 가족이 한 자리에 모여 확인 및 조율 버튼을 누를 때"
            value={canvas.humanVerification}
            onChange={(e) => onChangeCanvas({ ...canvas, humanVerification: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition resize-none"
          />
        </div>

        {/* Card 7: Privacy Rules */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 flex flex-col justify-between" id="canvas-card-7">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">7</span>
              개인정보 보호 규칙 <span className="text-red-500">*</span>
            </label>
            <p className="text-slate-400 text-xs">진짜 이름, 나이, 전화번호를 쓰지 않고 어떻게 개인 정보를 완전히 가릴 수 있을까요?</p>
          </div>
          <textarea
            rows={2}
            placeholder="예: 실명, 나이, 집주소는 묻지 않으며 '엄마', '아빠', '동생', '짱구' 등의 호칭이나 가상 별명만 수집한다."
            value={canvas.privacyRules}
            onChange={(e) => onChangeCanvas({ ...canvas, privacyRules: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition resize-none"
          />
        </div>

        {/* Card 8: Fairness Rules */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3 flex flex-col justify-between" id="canvas-card-8">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">8</span>
              공정성 규칙 <span className="text-red-500">*</span>
            </label>
            <p className="text-slate-400 text-xs">약자 배려나 기여도 평등을 실현하기 위한 AI만의 공평한 가이드라인은 무엇인가요?</p>
          </div>
          <textarea
            rows={2}
            placeholder="예: 피로도 수치 4점 이상은 고단한 일을 빼주고, 가장 좋아하는 일을 1지망 순서로 가중 분배한다."
            value={canvas.fairnessRules}
            onChange={(e) => onChangeCanvas({ ...canvas, fairnessRules: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition resize-none"
          />
        </div>
      </div>

      {/* Evaluate Trigger & Evaluation Output */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6" id="canvas-eval-section">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-500" />
              캠프 평가 튜터: AI 윤리 멘토
            </h3>
            <p className="text-xs text-slate-500">
              다 작성하셨나요? AI 윤리 멘토에게 실시간으로 나의 윤리적 설계안을 정밀 진단받아보세요!
            </p>
          </div>
          <button
            onClick={handleEvaluate}
            disabled={loading}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                AI 멘토가 심사하는 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                AI 멘토에게 설계 평가받기
              </>
            )}
          </button>
        </div>

        {/* Evaluation Output Sheet */}
        {evaluation.isEvaluated && (
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm space-y-4 animate-fadeIn" id="evaluation-results-box">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-lg">
                  🎓
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">에이전트 윤리 등급 진단 완료!</h4>
                  <p className="text-slate-400 text-xs">중학생 윤리 설계 인증서</p>
                </div>
              </div>

              {/* Score and Badge */}
              <div className="flex items-center gap-3">
                <div className="text-center bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <span className="text-xs text-emerald-600 block font-medium">윤리 획득 배지</span>
                  <span className="text-sm font-bold text-emerald-800 flex items-center gap-1">
                    🏅 {evaluation.badge}
                  </span>
                </div>
                <div className="text-center bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-100">
                  <span className="text-xs text-indigo-600 block font-medium">멘토 종합 점수</span>
                  <span className="text-lg font-black text-indigo-800">{evaluation.score}점</span>
                </div>
              </div>
            </div>

            {/* Feedback Content */}
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100" id="feedback-markdown-render">
              {evaluation.feedback}
            </div>

            {/* Suggestions list */}
            {evaluation.suggestions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">📝 윤리 멘토의 에이전트 업그레이드 조언:</span>
                <ul className="space-y-1.5">
                  {evaluation.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">✔️</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => onNavigate(AppScreen.AGENT_SIMULATOR)}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition duration-150 flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                3단계: 당번 시뮬레이터로 이동하기
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
