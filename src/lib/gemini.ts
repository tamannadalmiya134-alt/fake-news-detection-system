export interface AnalysisResult {
  isFake: boolean;
  confidence: number;
  explanation: string;
  keyPoints: string[];
  verdict: "Fake" | "Real" | "Misleading" | "Unverified";
}

export async function analyzeNews(text: string, model: string = "Logistic Regression"): Promise<AnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, model }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze news");
  }

  return await response.json();
}
