import React from "react";
import { Sparkles, Shield, UserCheck, HeartHandshake, HelpCircle } from "lucide-react";
import { AppScreen } from "../types";

interface HomeViewProps {
  onNavigate: (screen: AppScreen) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="space-y-8 animate-fadeIn" id="home-view-container">
      {/* Required Floating Header Banner */}
      <div 
        id="required-floating-banner"
        className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white py-10 px-6 rounded-3xl shadow-xl text-center overflow-hidden border border-white/10"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl -ml-5 -mb-5"></div>
        
        <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3 tracking-widest backdrop-blur-sm">
          💡 AI 윤리 캠프 미션
        </span>
        
        {/* Floating/Centered required text */}
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3 font-sans">
          "공정하게 집안일 당번을 정하는 AI를 만들자"
        </h1>
        <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto font-medium">
          우리의 사생활(개인정보)을 안전하게 지키면서, 모두가 행복하고 공평하게 집안일을 나눌 수 있는 윤리적인 똑똑이 AI 에이전트를 내 손으로 설계해 봐요!
        </p>
      </div>

      {/* Camp Mission & Description Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="mission-cards">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between" id="mission-overview-card">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              캠프 미션 소개
            </h2>
            <div className="text-slate-600 space-y-3 text-sm md:text-base leading-relaxed">
              <p>
                매일 저녁, 집안일을 누가 할지 결정하는 일로 티격태격했던 경험이 있나요? 
                "왜 나만 자꾸 빨래를 하지?", "설거지는 어제도 내가 했는데!" 같은 갈등을 해결하기 위해 우리만의 
                <strong className="text-indigo-600"> 집안일 심부름 당번 고르기 AI 에이전트</strong>를 만들어 볼 거예요.
              </p>
              <p>
                하지만 아무 규칙 없이 AI에게 일을 맡기면 문제가 생길 수 있어요. 
                예를 들어, 이름이나 생년월일 같은 <strong>개인정보를 유출</strong>하거나, 
                오늘 시험을 봐서 아주 피곤한 가족에게 <strong>설거지와 요리를 전부 배정해버리는 불공정한 상황</strong>이 일어날 수도 있죠.
              </p>
              <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs md:text-sm text-slate-600 font-medium">
                🎯 <strong>핵심 목표:</strong> 실제 개인정보는 일절 쓰지 않는 <strong>철저한 안전 규칙</strong>과 
                피로도·선호도를 배려하는 <strong>따뜻한 공정성 규칙</strong>을 세워, 인공지능이 올바르게 배정하도록 에이전트를 조율하는 것!
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              id="start-canvas-btn"
              onClick={() => onNavigate(AppScreen.CANVAS)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
            >
              1단계: 윤리 설계 캔버스 작성하기
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Box: Terminology Explainer */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4" id="terminology-sidebar">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            💡 1분 윤리 용어 사전
          </h3>
          
          <div className="space-y-4 text-xs md:text-sm" id="term-dictionary">
            {/* Term 1 */}
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
              <span className="font-bold text-indigo-600 block mb-0.5">🤖 AI 에이전트</span>
              <p className="text-slate-600 leading-normal">
                사람이 목표를 정해주면, 스스로 주변 상황을 파악하고 최선의 판단을 내리는 똑똑한 인공지능 프로그램이에요.
              </p>
            </div>

            {/* Term 2 */}
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
              <span className="font-bold text-emerald-600 block mb-0.5">🛡️ 개인정보 보호 규칙</span>
              <p className="text-slate-600 leading-normal">
                진짜 이름이나 주소 대신 가상의 "별명이나 호칭"을 사용해 에이전트가 개인의 소중한 정보를 엿보지 못하게 막는 방어벽이에요.
              </p>
            </div>

            {/* Term 3 */}
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
              <span className="font-bold text-amber-600 block mb-0.5">⚖️ 공정성 규칙</span>
              <p className="text-slate-600 leading-normal">
                가족 각자의 건강 상태(피로도), 개인 취향(싫어하는 일)을 공평하게 배려하여 편향 없이 균형 있게 나눠주는 지혜로운 규칙이에요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps of the Camp (Progress bar style) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs" id="camp-steps">
        <h3 className="text-base font-bold text-slate-800 mb-4 text-center">캠프 활동 순서도</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="progress-steps-list">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs mx-auto mb-1">1</div>
            <span className="font-bold text-blue-800 text-sm block">1. 에이전트 설계</span>
            <p className="text-slate-600 text-xs">해결할 문제와 공정성/보호 규칙을 세워요.</p>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs mx-auto mb-1">2</div>
            <span className="font-bold text-indigo-800 text-sm block">2. 시뮬레이션 테스트</span>
            <p className="text-slate-600 text-xs">나의 안전한 에이전트로 직접 가상 배정을 돌려봐요.</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xs mx-auto mb-1">3</div>
            <span className="font-bold text-purple-800 text-sm block">3. 문제 발견 & 개선</span>
            <p className="text-slate-600 text-xs">시뮬레이션을 보고 느낀 점과 해결책을 기록해요.</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mx-auto mb-1">4</div>
            <span className="font-bold text-emerald-800 text-sm block">4. 최종 성과 발표</span>
            <p className="text-slate-600 text-xs">설계한 윤리적 에이전트 카드를 친구들에게 공유해요!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
