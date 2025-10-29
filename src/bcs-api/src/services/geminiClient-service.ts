import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


// We create the embedding model once (reused for every call)
const embeddingModel = geminiClient.getGenerativeModel({
  model: "text-embedding-004",
});

/**
 * Generate a vector embedding for any text using Gemini.
 * @param text - The text to embed
 * @returns number[] - The embedding vector
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values ?? [];
  } catch (error) {
    console.error("❌ Error generating embedding:", error);
    return [];
  }
}
