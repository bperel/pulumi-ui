import { listProjects } from '~/server/utils/pulumi-state'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const projects = await listProjects(config.pulumiStateUri)
    return projects
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch projects'
    })
  }
}) 