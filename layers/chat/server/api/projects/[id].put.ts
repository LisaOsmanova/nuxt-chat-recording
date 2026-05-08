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
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project ID is required",
    });
  }

  const { success, data } = await readValidatedBody(
    event,
    UpdateProjectSchema.safeParse,
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request",
    });
  }

  const project = await getProjectById(id);
  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  return updateProject(id, data);
});
