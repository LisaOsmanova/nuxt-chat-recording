// import { updateChat } from "../../../repository/chatRepository";
// import {
//   createOllamaModel,
//   generateChatTitle,
// } from "../../../services/ai-service";

// export default defineEventHandler(async (event) => {
//   const { id } = getRouterParams(event);
//   const { message } = await readBody(event);

//   const model = createOllamaModel();
//   const title = await generateChatTitle(model, message);

//   return updateChat(id as string, { title });
// });

import { updateChat } from "../../../repository/chatRepository";
import {
  createOllamaModel,
  generateChatTitle,
} from "../../../services/ai-service";
import { UpdateChatTitleSchema } from "../../../schemas";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Chat ID is required",
    });
  }

  const { success, data } = await readValidatedBody(
    event,
    UpdateChatTitleSchema.safeParse,
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request",
    });
  }

  const model = createOllamaModel();
  const title = await generateChatTitle(model, data.message);

  return updateChat(id, { title });
});
