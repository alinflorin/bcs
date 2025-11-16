import { GoogleGenAI } from "@google/genai";

const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

/**
 * Generate a vector embedding for any text using Gemini.
 * @param text - The text to embed
 * @returns number[] - The embedding vector
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const rez = await geminiClient.models.embedContent({
      model: "text-embedding-004",
      contents: [
        {
          text: text,
        },
      ],
    });
    return rez.embeddings![0]!.values!;
  } catch (error) {
    console.error("❌ Error generating embedding:", error);
    return [];
  }
}
