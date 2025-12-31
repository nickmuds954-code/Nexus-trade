
import { GoogleGenAI } from "@google/genai";

/**
 * Analyzes market trends based on provided price points using Gemini 3 Pro.
 * Uses Google Search grounding to ensure analysis reflects real-world current events.
 */
export const getGeminiMarketAnalysis = async (
  assetName: string, 
  priceHistory: number[]
): Promise<{ text: string, sources: any[] }> => {
  try {
    // Re-initialize for each call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Perform a high-level professional market analysis for ${assetName}/USDT. 
    Price Sequence: ${priceHistory.slice(-5).join(', ')}.
    
    Instructions:
    1. Search for real-time news regarding ${assetName} (e.g., regulatory changes, upgrades, institutional buys).
    2. Provide a sharp, 2-sentence breakdown of the current technical trend vs fundamental sentiment.
    3. Issue a definitive "BUY", "SELL", or "HODL" signal with a 5-minute confidence score.
    
    Be extremely realistic and use current real-world data.`;

    const response = await ai.models.generateContent({
      // Upgraded to Gemini 3 Pro for more complex reasoning tasks
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Latency is a priority for a trading terminal, so we set thinking budget to 0
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { 
      // Accessing the .text property directly as per latest SDK guidelines
      text: response.text || "Liquidity crunch detected. Wait for confirmation.",
      sources: sources
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return { 
      text: "Connection to global financial grid interrupted. Technical pattern: Range-bound.",
      sources: []
    };
  }
};
