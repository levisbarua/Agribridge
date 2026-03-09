import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
console.log("VITE_GEMINI_API_KEY loaded:", apiKey ? "YES (hidden for security)" : "NO");

let ai: GoogleGenAI | null = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
    console.log("GoogleGenAI initialized successfully");
  } else {
    console.error("Skipped GoogleGenAI initialization because API key is empty.");
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI:", e);
}

export const getShelfLifePrediction = async (productName: string, harvestDate: string, additionalInfo: string) => {
  if (!ai || !apiKey) return "AI Service Unavailable: Missing API Key";

  try {
    const prompt = `
      I am a farmer in Africa listing a product on a marketplace.
      Product: ${productName}
      Harvest Date: ${harvestDate}
      Details: ${additionalInfo}
      
      Please provide a short, concise analysis (max 3 sentences) covering:
      1. Estimated shelf life remaining (in days).
      2. One critical storage tip to extend freshness without electricity if possible.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Keep responses extremely short and fast.",
        maxOutputTokens: 150,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate prediction at this time.";
  }
};

export const getAgriAdvice = async (
  query: string,
  options: {
    useSearch?: boolean;
    useMaps?: boolean;
    useThinking?: boolean;
    location?: { lat: number; lng: number }
  } = {}
) => {
  if (!ai || !apiKey) return { text: "AI Service Unavailable: Missing API Key" };

  try {
    if (options.useThinking) {
      // Use gemini-3-pro-preview for Deep Thinking
      // Setting thinkingBudget to max (32768) as requested for complex queries
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: query,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }
        },
      });
      return { text: response.text };

    } else if (options.useMaps) {
      // Use gemini-2.5-flash for Google Maps Grounding
      const config: any = {
        tools: [{ googleMaps: {} }],
      };

      // Pass user location if available to improve relevance
      if (options.location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: options.location.lat,
              longitude: options.location.lng
            }
          }
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: query,
        config: config,
      });

      // Extract sources (Maps & Web)
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((c: any) => {
        if (c.web?.uri) return { title: c.web.title, uri: c.web.uri, type: 'web' };
        // The maps chunk usually contains title and uri within the maps object
        if (c.maps?.uri) return { title: c.maps.title, uri: c.maps.uri, type: 'map' };
        // Fallback for review snippets or other map data
        if (c.maps?.placeAnswerSources?.length > 0) {
          const place = c.maps.placeAnswerSources[0];
          return { title: place.title || 'Google Maps Place', uri: place.uri, type: 'map' };
        }
        return null;
      }).filter((s: any) => s);

      const uniqueSources = Array.from(new Map(sources.map((s: any) => [s.uri, s])).values());
      return { text: response.text, sources: uniqueSources as { title: string, uri: string, type: 'web' | 'map' }[] };

    } else if (options.useSearch) {
      // Use gemini-3-flash-preview for Google Search Grounding
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .map((chunk: any) => chunk.web?.uri ? { title: chunk.web.title, uri: chunk.web.uri, type: 'web' } : null)
        .filter((s: any) => s !== null);

      const uniqueSources = Array.from(new Map(sources.map((s: any) => [s.uri, s])).values());

      return { text: response.text, sources: uniqueSources as { title: string, uri: string, type: 'web' }[] };
    } else {
      // Use flash for fast chat (No Grounding)
      const prompt = `
        You are an agricultural expert assistant for "AgriBridge Africa". 
        Your goal is to help smallholder farmers with crop advice, market insights, and logistics tips.
        User Query: ${query}
        
        Keep the answer practical, simple, and encouraging. Max 200 words.
        `;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          systemInstruction: "Keep responses short and helpful. Use bullet points where appropriate.",
          maxOutputTokens: 300,
        }
      });
      return { text: response.text };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, I am having trouble connecting to the agricultural database." };
  }
};

export const analyzePlantDisease = async (base64Image: string, mimeType: string, customPrompt?: string) => {
  if (!ai || !apiKey) return "AI Service Unavailable: Missing API Key";

  try {
    const prompt = customPrompt || `
      Act as an expert agricultural pathologist in Africa. 
      Analyze this plant image carefully. 
      
      Respond with:
      1. What disease, pest, or deficiency is visible (if any). Let the farmer know if the plant looks healthy.
      2. The likely cause (weather, soil, pests, etc.).
      3. Actionable, low-cost organic or chemical treatments available to smallholder farmers. 
      
      Keep the explanation simple, encouraging, and clear. Max 150 words.
    `;

    // The Gemini SDK expects base64 data without the data URI prefix (e.g. "data:image/jpeg;base64,")
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        { text: prompt },
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ],
      config: {
        maxOutputTokens: 200,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error (Image Analysis):", error);
    return "Sorry, I couldn't analyze the image. Please try again or provide a clearer photo.";
  }
};

export const getMarketInsights = async (marketPrices: any[], countryName: string) => {
  if (!ai || !apiKey) return "AI Service Unavailable";

  try {
    const prompt = `
      Act as an agricultural market analyst for ${countryName}.
      Analyze these current market prices: ${JSON.stringify(marketPrices)}.
      
      Provide a brief, actionable 3-bullet point summary for a farmer:
      1. One crop opportunity (high price/up trend).
      2. One crop risk (falling price).
      3. A general strategic tip for the week.
      
      Keep it strictly text, no markdown formatting, concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Keep responses extremely short and fast.",
        maxOutputTokens: 150,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate market insights at this time.";
  }
};

export const enhanceUserBio = async (currentBio: string, role: string, name: string) => {
  if (!ai || !apiKey) return currentBio;

  try {
    const prompt = `
      Rewrite the following bio for a ${role} named ${name} on AgriBridge Africa (an agricultural logistics & marketplace platform).
      Make it professional, trustworthy, and engaging. It should build confidence with potential business partners. Max 50 words.
      
      Current Bio: "${currentBio || 'New user'}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Keep responses extremely short and fast.",
        maxOutputTokens: 150,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return currentBio;
  }
};