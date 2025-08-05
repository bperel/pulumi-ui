import { getStack } from '~/server/utils/pulumi-state'

export default defineEventHandler(async (event) => {
  const { projectName, stackName } = getRouterParams(event)
  
  try {
    return await getStack(stackName!)
  } catch (error) {
    console.error('Error fetching stack:', error)
    throw createError({
      statusCode: 404,
      statusMessage: `Stack '${stackName}' not found in project '${projectName}'`
    })
  }
}) 