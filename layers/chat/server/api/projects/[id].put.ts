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

  const result = await readValidatedBody(
    event,
    UpdateProjectSchema.safeParse,
  );

  if (!result.success) {
    return 400;
  }

  const project = await getProjectById(id);
  if (!project) return 404;

  return updateProject(id, result.data);
});
