import {
  getMessagesByChatId,
  createMessageForChat,
} from "../../../../repository/chatRepository";
import {
  createOllamaModel,
  streamChatResponse,
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
  const stream = await streamChatResponse(ollama, history);

  setHeaders(event, {
    "Content-Type": "text/html",
    "Cache-Control": "no-cache",
    "Transfer-Encoding": "chunked",
  });

  let completeResponse = "";

  const transformStream = new TransformStream({
    transform(chunk, controller) {
      completeResponse += chunk;
      controller.enqueue(chunk);
    },

    async flush() {
      await createMessageForChat({
        chatId: id,
        content: completeResponse,
        role: "assistant",
      });
    },
  });

  return stream.pipeThrough(transformStream);
});
