import React, { useState } from "react";
import { 
  FileEdit, Heart, HelpCircle, ArrowRight, Save, CheckCircle2, 
  RotateCcw, Sparkles, Wand2 
} from "lucide-react";
import { ImprovementRecord, AppScreen } from "../types";

interface ImprovementViewProps {
  record: ImprovementRecord;
  onSetRecord: (newRecord: ImprovementRecord) => void;
  onNavigate: (screen: AppScreen) => void;
}

export default function ImprovementView({
  record,
  onSetRecord,
  onNavigate
}: ImprovementViewProps) {
  const [success, setSuccess] = useState(false);

  // Suggested educational preset for quick loading
  const handleApplyPreset = () => {
    onSetRecord({
      testedIssues: "피로도 수치만 비교하다 보니, 매일 연속으로 당번이 뽑히는 사람이 발생하여 실질적으로 불평등한 분배가 발생했습니다. 또한, 가족 구성원 중 한 명이 팔을 다쳤는데 AI가 이를 고려하지 못하고 걸레 청소를 맡길 수 있는 위험이 있었습니다.",
      finalImprovements: "공정성 규칙에 '당번 연속 배정 방지 조항'을 추가하여 어제 당번은 오늘 제외하도록 하였습니다. 또한 '사람 확인이 필요한 순간'에 가족들의 신체적 특이 사항(부상, 지병)을 즉각 에이전트에 반영하여 긴급 면제하는 보완 규칙을 세웠습니다.",
      reflectionText: "인공지능 에이전트에게 어떤 일을 완전히 위임하기 전에, 사생활을 철저히 보호하고 다각도로 공정성 규칙을 설계하지 않으면 오히려 가족 내 갈등을 깊어지게 만들 수 있다는 것을 깨달았습니다. 마지막 최종 확인 버튼처럼 인간이 주도적으로 조율하는 '인간 개입(Human-in-the-loop)' 수칙이 필수라는 것도 뼈저리게 느꼈습니다!",
      isSaved: true
    });
  };

  const handleReset = () => {
    onSetRecord({
      testedIssues: "",
      finalImprovements: "",
      reflectionText: "",
      isSaved: false
    });
    setSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSetRecord({
      ...record,
      isSaved: true
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="improvement-view-container">
      {/* Intro block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs" id="improvement-header">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-indigo-500" />
            4단계: 테스트 결과 및 개선 기록 작성하기
          </h2>
          <p className="text-slate-500 text-sm">
            시뮬레이션에서 아쉽거나 불만족스러웠던 규칙을 찾아보고, 어떻게 해결했는지 여러분의 생각을 기록해 주세요.
          </p>
        </div>
        
        <div className="flex items-center gap-2" id="improvement-actions">
          <button
            onClick={handleApplyPreset}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1 cursor-pointer border border-purple-200"
            id="apply-improvement-preset"
          >
            <Wand2 className="w-3.5 h-3.5" />
            예시 응답 채우기
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer"
            id="reset-improvement-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            초기화
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6" id="improvement-form">
        {/* Step 1: tested issues */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-3" id="tested-issues-box">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs">
                Q1
              </span>
              시뮬레이션 테스트 후 발견한 문제는 무엇인가요?
            </label>
            <p className="text-slate-400 text-xs">
              예: 특정 가족만 계속 고된 일에 배정되거나, 시험공부로 아주 피곤한 구성원에게 또 요리가 걸리는 일이 일어났나요?
            </p>
          </div>
          <textarea
            required
            rows={3}
            placeholder="예시: 피로도 수치 4점인 사람이 연속 두 번이나 빨래에 당첨되어 불만을 가질 확률이 생겼습니다."
            value={record.testedIssues}
            onChange={(e) => onSetRecord({ ...record, testedIssues: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Step 2: final improvements */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-3" id="final-improvements-box">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                Q2
              </span>
              문제를 보완한 최종 개선 내용은 무엇인가요?
            </label>
            <p className="text-slate-400 text-xs">
              예: 공정성 규칙이나 절대 금지 규칙에 어떤 조건(예: 동점일 땐 룰렛 돌리기, 저번 당번 연속 배제 등)을 새로 정했나요?
            </p>
          </div>
          <textarea
            required
            rows={3}
            placeholder="예시: 공정성 수칙에 '연속 동일 당번 당첨 배제'와 '피로도 4 이상은 가벼운 설거지나 당번 완전 면제' 예외 조항을 추가했습니다."
            value={record.finalImprovements}
            onChange={(e) => onSetRecord({ ...record, finalImprovements: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Step 3: reflections */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3xs space-y-3" id="reflections-box">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                Q3
              </span>
              이번 AI 윤리 캠프 활동을 통해 느낀 점은 무엇인가요?
            </label>
            <p className="text-slate-400 text-xs">
              예: AI 에이전트를 조율하는 윤리 규칙의 중요성, 프라이버시(별명 및 호칭 사용)의 소중함을 어떻게 알게 되었나요?
            </p>
          </div>
          <textarea
            required
            rows={4}
            placeholder="예시: 인공지능이 무조건 다 알아서 정하는 것보다는, 우리가 사생활 보호와 공정성을 위한 '울타리(윤리 규칙)'를 안전하게 세워주는 것이 더 중요하다는 것을 실감했습니다."
            value={record.reflectionText}
            onChange={(e) => onSetRecord({ ...record, reflectionText: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2" id="save-success-alert">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            개선 기록 작성이 완료되어 임시 저장되었습니다!
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => onNavigate(AppScreen.AGENT_SIMULATOR)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-5 py-3 rounded-xl transition text-sm cursor-pointer"
          >
            이전 단계로
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              id="save-improvement-btn"
            >
              <Save className="w-4 h-4" />
              기록 저장하기
            </button>
            <button
              type="button"
              onClick={() => onNavigate(AppScreen.PRESENTATION)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              id="goto-presentation-btn"
            >
              마지막 단계: 발표 화면으로 가기
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
