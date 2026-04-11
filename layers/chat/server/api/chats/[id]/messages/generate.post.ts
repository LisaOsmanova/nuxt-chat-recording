import {
  getMessagesByChatId,
  createMessageForChat,
} from "../../../../repository/chatRepository";
import {
  createOllamaModel,
  generateChatResponse,
} from "../../../../services/ai-service";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id)
    throw createError({ statusCode: 400, message: "Chat ID is required" });

  const chatMessages = await getMessagesByChatId(id);
  const history = chatMessages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));

  const ollama = createOllamaModel();
  const reply = await generateChatResponse(ollama, history);

  return createMessageForChat({
    chatId: id,
    content: reply,
    role: "assistant",
  });
});
