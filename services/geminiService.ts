import { GoogleGenAI } from "@google/genai";

// Initialize the client strictly with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProductDescription = async (productName: string, keywords: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Returning placeholder.");
    return "AI generation unavailable without API Key. Please configure your environment.";
  }

  try {
    const prompt = `
      Write a compelling, sophisticated, and minimalist product description for an e-commerce item.
      Product Name: ${productName}
      Keywords/Features: ${keywords}
      
      Tone: Professional, evocative, and concise.
      Length: Under 40 words.
      Do not include quotes or markdown formatting. Just the text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};
