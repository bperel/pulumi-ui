import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { projectName, stackName, encodedResourceUrn } = getRouterParams(event)
  const resourceUrn = decodeURIComponent(encodedResourceUrn!)
  const body = await readBody(event)
  const { newName } = body

  if (!newName || typeof newName !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'newName is required and must be a string'
    })
  }

  try {
    const fullStackName = `organization/${projectName}/${stackName}`
    
    // Execute pulumi state rename command
    const { stdout, stderr } = await execAsync(
      `pulumi state rename --stack ${fullStackName} ${resourceUrn} ${newName}`,
      { timeout: 30000 } // 30 second timeout
    )

    if (stderr && !stderr.includes('warning')) {
      throw new Error(stderr)
    }

    return {
      success: true,
      message: `Resource '${resourceUrn}' renamed to '${newName}'`,
      stdout: stdout.trim()
    }
  } catch (error: any) {
    console.error('Error renaming resource:', error)
    
    // Handle specific Pulumi CLI errors
    if (error.stderr) {
      if (error.stderr.includes('not found')) {
        throw createError({
          statusCode: 404,
          statusMessage: `Resource '${resourceUrn}' not found in stack '${stackName}'`
        })
      }
      if (error.stderr.includes('already exists')) {
        throw createError({
          statusCode: 409,
          statusMessage: `Resource with name '${newName}' already exists`
        })
      }
      if (error.stderr.includes('permission denied')) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Permission denied to rename resource'
        })
      }
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to rename resource: ${error.message}`
    })
  }
}) 