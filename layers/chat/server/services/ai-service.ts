import { generateText } from "ai";
import { createOllama } from "ollama-ai-provider";
import type { Message, LanguageModelV1 } from "ai";

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

export async function generateChatTitle(
  model: LanguageModelV1,
  firstMessage: string,
): Promise<string> {
  const response = await generateText({
    model,
    messages: [
      {
        role: "system",
        content: "summarize the message in 3 or less short words",
      },
      {
        role: "user",
        content: firstMessage,
      },
    ],
  });
  return response.text.trim();
}
