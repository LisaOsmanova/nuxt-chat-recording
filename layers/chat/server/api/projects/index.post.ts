// import { createProject } from '../../repository/projectRepository'

// export default defineEventHandler(async (event) => {
//   const { name } = await readBody(event)
//   return createProject({ name })
// })
import { createProject } from "../../repository/projectRepository";
import { CreateProjectSchema } from "../../schemas";

export default defineEventHandler(async (event) => {
  const { success, data } = await readValidatedBody(
    event,
    CreateProjectSchema.safeParse,
  );

  if (!success) {
    return 400;
  }

  return createProject(data);
});
