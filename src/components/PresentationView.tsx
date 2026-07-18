import React, { useState } from "react";
import { 
  Presentation, ArrowLeft, ArrowRight, BookOpen, List, Sparkles, 
  ShieldCheck, HelpCircle, AlertTriangle, Lightbulb, Users, CheckCircle2 
} from "lucide-react";
import { EthicsCanvas, SimulationResult, ImprovementRecord, EthicsEvaluation, AppScreen } from "../types";

interface PresentationViewProps {
  canvas: EthicsCanvas;
  simulation: SimulationResult;
  record: ImprovementRecord;
  evaluation: EthicsEvaluation;
  onNavigate: (screen: AppScreen) => void;
}

export default function PresentationView({
  canvas,
  simulation,
  record,
  evaluation,
  onNavigate
}: PresentationViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<"slides" | "grid">("slides");

  const slidesData = [
    {
      title: "🤖 프로젝트 발표 시작하기",
      subtitle: "공정한 집안일 심부름 당번 고르기 AI 에이전트 만들기",
      content: (
        <div className="text-center py-12 space-y-6" id="slide-0-content">
          <div className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-sm px-4 py-2 rounded-full animate-bounce">
            🌟 AI 윤리 캠프 최종 발표회
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            "{canvas.agentName || "에이전트 이름 미정"}"
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
            인공지능의 공정성과 사생활 보호 규칙을 설계하여 만드는 집안일 당번 배정 에이전트 프로젝트 발표를 시작합니다.
          </p>
          <div className="flex justify-center gap-4 text-xs md:text-sm pt-4" id="slide-0-badges">
            <span className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl">
              설계자: 나의 윤리 에이전트
            </span>
            {evaluation.isEvaluated && (
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-4 py-2 rounded-xl">
                🎖️ {evaluation.badge}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      title: "🎯 해결할 문제와 에이전트의 목표",
      subtitle: "우리가 해결하고자 하는 문제와 AI 에이전트의 최종 목표",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" id="slide-1-content">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-red-600 font-bold text-xs flex items-center gap-1">
              ⚠️ 집안일 분배의 갈등 문제
            </span>
            <h4 className="font-extrabold text-slate-800 text-base">해결할 문제</h4>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {canvas.problem || "집안일을 정할 때마다 누가 더 많이 일했는지 다투고 조율하기 힘들었던 경험을 해결하려 합니다."}
            </p>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 space-y-3">
            <span className="text-indigo-600 font-bold text-xs flex items-center gap-1">
              🎯 에이전트의 존재 이유
            </span>
            <h4 className="font-extrabold text-indigo-900 text-base">설계한 최종 목표</h4>
            <p className="text-indigo-950 text-sm leading-relaxed whitespace-pre-wrap">
              {canvas.goal || "가족 구성원들의 기분과 피로도를 반영하여, 갈등 없이 기쁘게 승낙하는 이상적 당번 배정 상태에 도달합니다."}
            </p>
          </div>
        </div>
      )
    },
    {
      title: "📥 정보 입력과 금지 행동 설계",
      subtitle: "개인정보를 보호하면서 필요한 입력값과 에이전트 제재 규칙",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" id="slide-2-content">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
              📋 수집 정보 목록
            </span>
            <h4 className="font-extrabold text-slate-800 text-base">입력받을 정보</h4>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {canvas.inputs || "가족의 가상 별명이나 호칭, 오늘 하루 컨디션(피로도), 선호하는 심부름"}
            </p>
            <span className="text-[11px] bg-amber-50 border border-amber-100 text-amber-800 px-2 py-1 rounded-md block mt-2">
              🔒 실명, 전화번호, 생일, 주소는 절대 포함하지 않도록 약속했습니다.
            </span>
          </div>

          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100/50 space-y-3">
            <span className="text-rose-600 font-bold text-xs flex items-center gap-1">
              🚫 제약 필터링
            </span>
            <h4 className="font-extrabold text-rose-900 text-base">절대 하면 안 되는 행동</h4>
            <p className="text-rose-950 text-sm leading-relaxed whitespace-pre-wrap">
              {canvas.prohibited || "한 사람에게 집안일을 3개 이상 몰아주기, 매우 피곤한 사람에게 무거운 일을 배정하기"}
            </p>
          </div>
        </div>
      )
    },
    {
      title: "⚖️ 개인정보 및 공정성 수칙",
      subtitle: "우리 에이전트의 핵심적인 프라이버시 조항과 똑똑한 배려 조항",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" id="slide-3-content">
          <div className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100 space-y-3">
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
              🛡️ 사생활 침해 원천 차단
            </span>
            <h4 className="font-extrabold text-emerald-900 text-base">개인정보 보호 규칙</h4>
            <p className="text-emerald-950 text-sm leading-relaxed whitespace-pre-wrap">
              {canvas.privacyRules || "실명 대신 '엄마', '아빠', '동생', '짱구' 같이 익명화된 호칭과 별명만 사용하여 진짜 개인 정보 유출을 원천 방지합니다."}
            </p>
          </div>

          <div className="bg-pink-50/30 p-6 rounded-2xl border border-pink-100 space-y-3">
            <span className="text-pink-700 font-bold text-xs flex items-center gap-1">
              🤝 배려와 공평함
            </span>
            <h4 className="font-extrabold text-pink-900 text-base">공정성 규칙</h4>
            <p className="text-pink-950 text-sm leading-relaxed whitespace-pre-wrap">
              {canvas.fairnessRules || "피로도 수치가 가장 높은 사람에게는 집안일을 가볍게 하거나 면제하고, 선호하는 일을 우선 분배합니다."}
            </p>
          </div>
        </div>
      )
    },
    {
      title: "🧪 시뮬레이션 가동 및 테스트 결과",
      subtitle: "실제 가족 데이터를 가상 별칭으로 가동시켜 확인한 당번 배정 상황",
      content: (
        <div className="space-y-4 pt-2" id="slide-4-content">
          {simulation.isSimulated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">🧹 최종 확정된 집안일 배정 상태</span>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {simulation.assignments.map((assign, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-3xs flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-indigo-700 block">🧹 {assign.choreName}</span>
                        <span className="text-slate-400">사유: {assign.reason.substring(0, 45)}...</span>
                      </div>
                      <span className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-bold">
                        {assign.assignedMemberCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed space-y-2 max-h-[220px] overflow-y-auto">
                <span className="font-bold text-indigo-800 block">🛡️ 에이전트 윤리 준수 보고서 요약</span>
                <p className="text-slate-600 whitespace-pre-wrap">{simulation.ethicsReport}</p>
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded text-emerald-800 font-bold flex items-center gap-1 mt-1">
                  ✔️ 사용자 최종 확인 완료 ({simulation.isConfirmed ? "확정됨" : "확인 대기"})
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-sm">
              ⚙️ 아직 시뮬레이션을 가동하지 않았습니다.<br />3단계에서 당번 배정을 작동해보고 오시면 여기에 테스트 데이터가 뜹니다!
            </div>
          )}
        </div>
      )
    },
    {
      title: "📝 테스트 개선 결과 & 느낀 점",
      subtitle: "문제를 극복한 보완 규칙과 윤리 캠프 활동을 통해 얻은 교훈",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4" id="slide-5-content">
          <div className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100 space-y-3">
            <span className="text-purple-700 font-bold text-xs flex items-center gap-1">
              🔧 규칙 피드백 & 개선
            </span>
            <h4 className="font-extrabold text-purple-900 text-sm">발견한 한계와 최종 보완 내용</h4>
            <div className="space-y-2 text-xs text-slate-700 leading-normal max-h-[180px] overflow-y-auto">
              <p><strong>발견한 한계:</strong> {record.testedIssues || "매일 똑같은 사람이 연속으로 당첨될 편향의 리스크"}</p>
              <p><strong>수정 대안:</strong> {record.finalImprovements || "동일 당번 연속 배정 배제 필터 탑재 및 부상 시 면제 수칙 탑재"}</p>
            </div>
          </div>

          <div className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100 space-y-3">
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
              💖 최종 소감
            </span>
            <h4 className="font-extrabold text-emerald-900 text-sm">인공지능 윤리 캠프 활동을 마치며</h4>
            <p className="text-emerald-950 text-xs md:text-sm leading-relaxed whitespace-pre-wrap max-h-[180px] overflow-y-auto">
              {record.reflectionText || "기술 자체보다도 우리 사생활을 지키기 위한 익명 관계 호칭이나 가상 별명 활용 방식, 그리고 사람의 지혜를 결합하는 것이 공정한 AI 제작의 정답이라는 것을 깨달았습니다!"}
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNextSlide = () => {
    if (currentSlide < slidesData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="presentation-view-container">
      {/* Tab bar header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs" id="presentation-header">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Presentation className="w-5 h-5 text-indigo-500" />
            5단계: 나의 공정 에이전트 프로젝트 발표회
          </h2>
          <p className="text-slate-500 text-sm">
            친구들이나 튜터님께 내가 만든 에이전트를 소개하는 화면입니다. 슬라이드로 한 장씩 넘겨 가며 설명해봐요!
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl" id="view-mode-toggles">
          <button
            onClick={() => setViewMode("slides")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              viewMode === "slides" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            슬라이드로 발표
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              viewMode === "grid" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            모아보기 (전체 카드)
          </button>
        </div>
      </div>

      {/* Mode 1: Slides Theater */}
      {viewMode === "slides" ? (
        <div className="bg-white rounded-3xl border border-indigo-100/80 shadow-md overflow-hidden flex flex-col justify-between min-h-[480px] max-w-4xl mx-auto" id="slide-theater-box">
          {/* Slide top header indicator */}
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-400">캠프 슬라이드 쇼</span>
            <span className="bg-indigo-50 text-indigo-700 font-extrabold px-3 py-1 rounded-full">
              {currentSlide + 1} / {slidesData.length} Page
            </span>
          </div>

          {/* Slide dynamic body wrapper */}
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center" id="slide-main-stage">
            <div className="space-y-3 animate-fadeIn">
              <span className="text-xs font-bold text-indigo-500 block">
                {slidesData[currentSlide].subtitle}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                {slidesData[currentSlide].title}
              </h3>
              
              <div className="pt-4" id="active-slide-contents">
                {slidesData[currentSlide].content}
              </div>
            </div>
          </div>

          {/* Slide control footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              className="bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-30 border border-slate-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              id="prev-slide-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              이전 슬라이드
            </button>

            {/* Pagination dots */}
            <div className="hidden sm:flex items-center gap-1.5" id="slide-progress-dots">
              {slidesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? "w-5 bg-indigo-600" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  title={`슬라이드 ${idx + 1}`}
                />
              ))}
            </div>

            {currentSlide < slidesData.length - 1 ? (
              <button
                onClick={handleNextSlide}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                id="next-slide-btn"
              >
                다음 슬라이드
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate(AppScreen.HOME)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                id="presentation-home-btn"
              >
                활동 완료! 홈으로
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Mode 2: Grid view of all sheets */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="presentation-grid-view">
          {slidesData.map((slide, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs flex flex-col justify-between space-y-4" id={`grid-card-${idx}`}>
              <div className="space-y-1">
                <span className="text-[10px] bg-slate-100 text-slate-500 font-black px-2 py-0.5 rounded-md">
                  슬라이드 #{idx + 1}
                </span>
                <span className="text-slate-400 text-[11px] block">{slide.subtitle}</span>
                <h4 className="font-extrabold text-slate-800 text-sm border-b border-slate-50 pb-2">{slide.title}</h4>
              </div>
              <div className="flex-1 flex flex-col justify-center text-xs">
                {slide.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
