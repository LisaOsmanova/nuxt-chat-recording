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

  const { success, data } = await readValidatedBody(
    event,
    CreateMessageSchema.safeParse,
  );

  if (!success) {
    return 400;
  }

  return createMessageForChat({
    chatId: id as string,
    content: data.content,
    role: data.role,
  });
});
