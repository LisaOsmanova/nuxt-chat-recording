// import { createMessageForChat } from "../../../../repository/chatRepository";

// export default defineEventHandler(async (event) => {
//   const { id } = getRouterParams(event);
//   const body = await readBody(event);

//   return createMessageForChat({
//     chatId: id,
//     content: body.content,
//     role: body.role,
//   });
// });

import { createMessageForChat } from "../../../../repository/chatRepository";
import { CreateMessageSchema } from "../../../../schemas";

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
    CreateMessageSchema.safeParse,
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request",
    });
  }

  return createMessageForChat({
    chatId: id,
    content: data.content,
    role: data.role,
  });
});
