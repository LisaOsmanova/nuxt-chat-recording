import { generateChatResponse, createOllamaModel } from "../services/service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // extract the body of the request
  const { messages } = body;

  const id = messages.length.toString();
  // const lastMessage = messages[messages.length - 1];

  const ollamaModel = createOllamaModel();
  const response = await generateChatResponse(ollamaModel, messages);

  return {
    id,
    role: "assistant",
    content: response,
  };
});

// event parameter represents the request and response for this endpoint.
