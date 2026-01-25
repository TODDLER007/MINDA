
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

export class GeminiService {
  async *sendMessageStream(message: string, history: ChatHistoryItem[], location?: LocationData) {
    if (!message.trim()) return;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const config: any = {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
      };

      if (location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        };
      }

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: config,
        history: history,
      });

      const stream = await chat.sendMessageStream({ 
        message: message 
      });

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        
        // Handle grounding metadata (Links from Search/Maps)
        const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        let groundingText = "";
        
        if (groundingChunks) {
          const links = groundingChunks.map((chunk: any) => {
            if (chunk.maps) return `\n📍 [${chunk.maps.title}](${chunk.maps.uri})`;
            if (chunk.web) return `\n🔗 [${chunk.web.title}](${chunk.web.uri})`;
            return "";
          }).filter(Boolean).join("");
          
          if (links) groundingText = `\n\n**Verified Resources:**${links}`;
        }

        if (c.text) {
          yield c.text + (groundingText || "");
        }
      }
    } catch (error: any) {
      console.error("Gemini API Error Detail:", error);
      const errorMsg = error?.message?.toLowerCase() || "";
      if (errorMsg.includes("api key") || errorMsg.includes("requested entity was not found") || errorMsg.includes("status code: 0")) {
        throw new Error("AUTH_ERROR");
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
