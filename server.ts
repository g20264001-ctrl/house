import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK to prevent startup crashes if GEMINI_API_KEY is missing.
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API Endpoint: Evaluate Ethics Canvas
app.post("/api/evaluate", async (req, res) => {
  try {
    const {
      agentName,
      problem,
      goal,
      inputs,
      prohibited,
      humanVerification,
      privacyRules,
      fairnessRules,
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `
당신은 12~14세 중학생들을 대상으로 하는 "AI 윤리 캠프"의 친절하고 상냥한 'AI 윤리 멘토'입니다.
학생들이 설계한 집안일 분담 AI 에이전트의 윤리 설계안(Canvas)을 평가하고 피드백을 주세요.

학생들의 설계 내용:
- 에이전트 이름: ${agentName || "미정"}
- 해결할 문제: ${problem || "미정"}
- 에이전트의 목표: ${goal || "미정"}
- 입력받을 정보: ${inputs || "미정"}
- 절대 하면 안 되는 행동: ${prohibited || "미정"}
- 사람 확인이 필요한 순간: ${humanVerification || "미정"}
- 개인정보 보호 규칙: ${privacyRules || "미정"}
- 공정성 규칙: ${fairnessRules || "미정"}

평가 기준:
1. 개인정보 보호: 이름, 전화번호, 이메일, 생년월일, 주소 등 민감한 개인정보를 수집하지 않고 안전한 '나의 번호'나 식별 코드로만 작동하도록 유도하는지 평가해주세요.
2. 공정성: 모두가 납득할 수 있는 공정하고 배려 깊은 규칙(예: 피로도 고려, 공평한 로테이션, 싫어하는 집안일 배려 등)이 들어있는지 평가해주세요.
3. 안전성 및 인간 존중: 에이전트가 독단적으로 결정하지 않고, '사람 확인이 필요한 순간'을 잘 정의했는지 평가해주세요.

피드백 말투:
- 12~14세 학생들이 이해하기 쉬운 매우 친근하고 격려하는 한국어 말투(~했어요, ~했나요?, 대단해요!)를 사용하세요.
- 긍정적이고 따뜻한 칭찬을 먼저 한 뒤, 더 좋은 에이전트가 되기 위한 구체적인 개선 제안(suggestions)을 제공해주세요.
- JSON 형식으로 응답해주어야 합니다.

반드시 다음 JSON 스키마를 만족하도록 결과를 출력하세요.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: {
              type: Type.STRING,
              description: "Markdown format Korean feedback, warm and encouraging, tailored for a 12-14 year old student.",
            },
            score: {
              type: Type.INTEGER,
              description: "A friendly evaluation score from 50 to 100 based on their ethics design completeness.",
            },
            badge: {
              type: Type.STRING,
              description: "A cool title for their agent, e.g., '프라이버시 수호천사', '정의로운 평등 에이전트', '배려 깊은 조율사', '윤리 꿈나무 마스터'.",
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 highly concrete suggestions for improvement in Korean.",
            },
          },
          required: ["feedback", "score", "badge", "suggestions"],
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Evaluation error:", error);
    res.status(500).json({
      error: "AI 평가 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

// 2. API Endpoint: Simulate Chore Assignment with Ethics Filter
app.post("/api/simulate", async (req, res) => {
  try {
    const { canvas, members } = req.body;
    const ai = getGeminiClient();

    const membersInfo = members.map((m: any) => 
      `- 식별 호칭/번호: ${m.codeName || `가족 번호 ${m.numberCode}`} (피로도: ${m.fatigue}점, 선호하는 집안일: [${(m.preferences || []).join(", ")}], 한마디: ${m.note || "없음"})`
    ).join("\n");

    const prompt = `
당신은 학생이 설계한 집안일 분담 AI 에이전트 [${canvas.agentName || "공정 에이전트"}]입니다.
학생들이 수립한 윤리 규칙 및 공정성 기준을 철저히 반영하여 하루 3가지 시간대(아침, 점심, 저녁)별로 4가지 집안일(집안 청소, 빨래, 설거지, 요리)을 가족 구성원에게 배정하세요.

[에이전트 윤리 및 공정성 기준]
- 입력받을 정보: ${canvas.inputs || "피로도, 선호 집안일 등"}
- 절대 하면 안 되는 행동: ${canvas.prohibited || "한 사람에게만 몰아주기 등"}
- 개인정보 보호 규칙: ${canvas.privacyRules || "실명 사용 금지, 가상 호칭이나 별명 사용"}
- 공정성 규칙: ${canvas.fairnessRules || "피로도가 높은 사람은 쉬운 일을 주거나 집안일에서 제외 등"}

[가족 구성원 정보 (개인정보 보호를 위해 오직 익명 호칭과 번호로만 구성됨)]
${membersInfo}

[배정 방식 및 규칙]
- 시간대: "아침", "점심", "저녁" 총 3개 시간대
- 집안일 종류: "집안 청소", "빨래", "설거지", "요리" 총 4개 종류
- 각 집안일은 각 시간대별로 정원이 정확히 1명입니다. (즉, 시간대별로 '집안 청소' 1명, '빨래' 1명, '설거지' 1명, '요리' 1명씩 총 12개의 배정이 나옵니다.)
- 학생이 정한 공정성 규칙(예: 피로도 고려, 집안일 선호도 등)을 최대한 반영하십시오.
- 특정 구성원에게 너무 과도하게 집안일이 몰리지 않도록 조율하십시오.
- 배정 이유를 친근하고 명확한 한국어로 설명해주십시오.
- 배정 완료 후, 이 배정이 학생의 윤리 규칙과 공정성 가이드라인에 얼마나 잘 부합하는지 평가하는 '윤리 리포트(ethicsReport)'를 작성해주세요. (예: "개인정보 보호 수칙을 철저히 준수하여 실명 대신 호칭으로만 배정했습니다!", "오늘 너무 피로한 구성원에게는 가벼운 당번만 매칭했습니다" 등)

반드시 다음 JSON 스키마를 만족하도록 결과를 출력하세요.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assignments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeslot: { type: Type.STRING, description: "시간대 ('아침', '점심', '저녁' 중 하나)" },
                  choreName: { type: Type.STRING, description: "집안일 이름 (집안 청소, 빨래, 설거지, 요리 중 하나)" },
                  assignedMemberCode: { type: Type.STRING, description: "배정된 가족 구성원의 식별 코드/호칭 (예: 엄마)" },
                  reason: { type: Type.STRING, description: "이 시간대의 집안일에 이 사람을 배정한 공정한 이유" },
                },
                required: ["timeslot", "choreName", "assignedMemberCode", "reason"],
              },
            },
            ethicsReport: {
              type: Type.STRING,
              description: "A detailed Korean explanation (Markdown format) about how the AI agent strictly respected the students' fairness and privacy rules during this allocation.",
            },
          },
          required: ["assignments", "ethicsReport"],
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Simulation error:", error);
    res.status(500).json({
      error: "AI 배정 시뮬레이션 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

// Setup Vite or Static assets serving
async function startServer() {
  console.log("Starting server.ts...");
  console.log("NODE_ENV is:", process.env.NODE_ENV);
  if (process.env.NODE_ENV !== "production") {
    console.log("Using Vite middleware in development mode");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from dist/");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
