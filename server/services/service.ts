import { generateText } from "ai";
import { createOllama } from "ollama-ai-provider";
import type { Message, LanguageModelV1 } from "ai";

//to return the ollama model
export const createOllamaModel = () => {
  const ollama = createOllama();
  return ollama("llama3.2");
};

export async function generateChatResponse(
  model: LanguageModelV1,
  messages: Message[],
) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Invalid messages format");
  }

  const response = await generateText({
    model,
    messages,
  });

  return response.text.trim();
}
