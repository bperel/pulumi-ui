import { getStack } from '~/server/utils/pulumi-state'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { projectName, stackName } = getRouterParams(event)
  
  try {
    const stack = await getStack(config.pulumiStateUri, projectName!, stackName!)
    return stack
  } catch (error) {
    console.error('Error fetching stack:', error)
    throw createError({
      statusCode: 404,
      statusMessage: `Stack '${stackName}' not found in project '${projectName}'`
    })
  }
}) 