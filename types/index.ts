export interface Project {
  name: string
  stacks: Stack[]
}

export interface Stack {
  name: string
  project: string
  resources: Resource[]
  readme?: string
}

export interface Resource {
  name: string
  type: string
  id?: string
  parent?: string
  urn: string
  dependencies?: string[]
  inputs?: Record<string, any>
  outputs?: Record<string, any>
} 