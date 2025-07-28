import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { URL } from 'url'

export interface Project {
  name: string
  stacks: Stack[]
}

export interface Stack {
  name: string
  project: string
  resources: Resource[]
  outputs: Record<string, any>
  readme?: string
}

export interface Resource {
  name: string
  type: string
  id: string
  parent?: string
  dependencies: string[]
  inputs: Record<string, any>
  outputs: Record<string, any>
}

export async function listProjects(stateUri: string): Promise<Project[]> {
  const projects: Project[] = []
  
  try {
    if (stateUri.startsWith('file://')) {
      const basePath = stateUri.replace('file://', '')
      const projectDirs = readdirSync(basePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
      
      for (const projectName of projectDirs) {
        const projectPath = join(basePath, projectName)
        const stackDirs = readdirSync(projectPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
        
        const stacks: Stack[] = []
        for (const stackName of stackDirs) {
          try {
            const stack = await getStack(stateUri, projectName, stackName)
            stacks.push(stack)
          } catch (error) {
            console.warn(`Failed to load stack ${stackName} in project ${projectName}:`, error)
          }
        }
        
        projects.push({
          name: projectName,
          stacks
        })
      }
    } else {
      // Handle S3, GS, Azure paths using AWS SDK v3 or similar
      // This would need to be implemented using Node.js cloud storage libraries
      throw new Error('Cloud storage not yet implemented in TypeScript version')
    }
  } catch (error) {
    console.error('Error listing projects:', error)
    throw error
  }
  
  return projects
}

export async function getStack(stateUri: string, projectName: string, stackName: string): Promise<Stack> {
  try {
    if (stateUri.startsWith('file://')) {
      const basePath = stateUri.replace('file://', '')
      const stackPath = join(basePath, projectName, stackName)
      
      if (!existsSync(stackPath)) {
        throw new Error(`Stack path does not exist: ${stackPath}`)
      }
      
      const stateFile = join(stackPath, 'state.json')
      if (!existsSync(stateFile)) {
        throw new Error(`State file not found: ${stateFile}`)
      }
      
      const stateData = JSON.parse(readFileSync(stateFile, 'utf-8'))
      
      const resources: Resource[] = []
      if (stateData.deployment.resources) {
        for (const resource of stateData.deployment.resources) {
          resources.push({
            name: resource.urn.split('::').pop() || '',
            type: resource.type,
            id: resource.id || '',
            parent: resource.parent,
            dependencies: resource.dependencies || [],
            inputs: resource.inputs || {},
            outputs: resource.outputs || {}
          })
        }
      }
      
      let readme: string | undefined
      const readmeFile = join(stackPath, 'README.md')
      if (existsSync(readmeFile)) {
        readme = readFileSync(readmeFile, 'utf-8')
      }
      
      return {
        name: stackName,
        project: projectName,
        resources,
        outputs: stateData.outputs || {},
        readme
      }
    } else {
      throw new Error('Cloud storage not yet implemented in TypeScript version')
    }
  } catch (error) {
    console.error('Error getting stack:', error)
    throw error
  }
} 