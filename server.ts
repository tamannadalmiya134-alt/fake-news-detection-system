import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Analyze News
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text, model: selectedModel } = req.body;

      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY or API_KEY is missing from environment variables");
        return res.status(500).json({ error: "API configuration error: Gemini API key is missing" });
      }

      // Gemini Initialization inside the request handler for lazy loading
      const ai = new GoogleGenAI({ apiKey });

      // We use Gemini to simulate the different ML models requested (LR, NB, SVM)
      // by adjusting the system instruction to mimic their classification styles.
      const modelPersonas: Record<string, string> = {
        "Logistic Regression": "a statistical classifier that focuses on feature weight and probability distribution",
        "Naïve Bayes": "a probabilistic classifier based on word frequency and conditional probability",
        "SVM": "a margin-based classifier that looks for hyperplane separations and distinct high-dimensional features",
        "Ensemble": "a high-precision meta-classifier that combines multiple analysis strategies for maximum accuracy"
      };

      const persona = modelPersonas[selectedModel] || modelPersonas["Logistic Regression"];

      const prompt = `Analyze the following news content for authenticity using ${selectedModel} logic. 
      Act as ${persona}.
      
      Content: "${text}"
      
      Detection Rules:
      1. Check for sensationalist language (common in Fake News).
      2. Verify source attribution (Unverified if missing).
      3. Look for logical inconsistencies.
      
      Response Schema:
      {
        "isFake": boolean,
        "confidence": number (0-100),
        "explanation": string (detailed analysis),
        "keyPoints": string[] (bullet points of evidence),
        "verdict": "Fake" | "Real" | "Misleading" | "Unverified"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isFake: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              verdict: { type: Type.STRING, enum: ["Fake", "Real", "Misleading", "Unverified"] }
            },
            required: ["isFake", "confidence", "explanation", "keyPoints", "verdict"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ 
        error: "Internal server error during analysis",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
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
