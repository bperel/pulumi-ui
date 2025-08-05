import { listProjects } from '~/server/utils/pulumi-state'

export default defineEventHandler(async () => {  
  try {
    return await listProjects()
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch projects'
    })
  }
}) 