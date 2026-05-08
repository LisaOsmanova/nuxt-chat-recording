import {
  createOllamaModel,
  generateChatResponse,
} from "../services/ai-service";
import { ChatMessageSchema } from "../schemas";

export default defineEventHandler(async (event) => {
  const { success, data } = await readValidatedBody(
    event,
    ChatMessageSchema.safeParse,
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request",
    });
  }

  const { messages } = data as {
    messages: ChatMessage[];
    chatId: string;
  };

  const ollamaModel = createOllamaModel();

  const response = await generateChatResponse(ollamaModel, messages);

  return {
    id: messages.length.toString(),
    role: "assistant",
    content: response,
  };
});
