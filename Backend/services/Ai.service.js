import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyC9YfOlCihL1z_RcAyjqZ7cWXoZO9JV2CY');

export const generateAITags = async (content) => {
  try {
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this prompt and generate 3-5 relevant tags.
    Respond ONLY with a comma-separated list of lowercase tags.
    Example: "ai, marketing, content-generation"
    `;

    const response = await model.generateContent([prompt, content]);

    const text = response.response.text();

    return text
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);
  } catch (error) {
    console.error("Gemini AI tagging failed", error);
    return [];
  }
};
