// import {
//   updateProject,
//   getProjectById,
// } from '../../repository/projectRepository'

// export default defineEventHandler(async (event) => {
//   const { id } = getRouterParams(event)
//   const project = await getProjectById(id)
//   if (!project) return null
//   const body = await readBody(event)
//   return updateProject(id, { name: body.name })
// })

import {
  updateProject,
  getProjectById,
} from "../../repository/projectRepository";
import { UpdateProjectSchema } from "../../schemas";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  if (!id) return 400;

  const { success, data } = await readValidatedBody(
    event,
    UpdateProjectSchema.safeParse,
  );

  const project = await getProjectById(id);
  if (!project) return 404;

  if (!success) {
    return 400;
  }

  return updateProject(id, data);
});
