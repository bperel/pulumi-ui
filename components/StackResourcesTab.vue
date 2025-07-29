<template>
  <div v-if="stack" class="space-y-6">
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Resources</h3>
        <div class="flex space-x-2">
          <UButton
            variant="outline"
            size="sm"
            @click="viewMode = 'list'"
            :class="{ 'bg-blue-50': viewMode === 'list' }"
          >
            <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
            List
          </UButton>
          <UButton
            variant="outline"
            size="sm"
            @click="viewMode = 'graph'"
            :class="{ 'bg-blue-50': viewMode === 'graph' }"
          >
            <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
            Graph
          </UButton>
        </div>
      </div>
      
      <div v-if="viewMode === 'list'">
        <div v-if="stack.resources.length === 0" class="text-center text-gray-500 py-8">
          <UIcon name="i-heroicons-cube" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No resources found</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="resource in stack.resources" 
            :key="resource.urn"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <UIcon name="i-heroicons-cube" class="w-4 h-4 text-blue-600" />
                  <span class="font-medium text-gray-900">{{ resource.name }}</span>
                  <span class="text-sm text-gray-500">({{ resource.type }})</span>
                </div>
                
                <div class="text-sm text-gray-600 mb-2">
                  <span class="font-medium">ID:</span> {{ resource.urn }}
                </div>
                
                <div v-if="resource.parent" class="text-sm text-gray-600 mb-2">
                  <span class="font-medium">Parent:</span> {{ resource.parent }}
                </div>
                
                <div v-if="resource.dependencies?.length" class="text-sm text-gray-600">
                  <span class="font-medium">Dependencies:</span> {{ resource.dependencies.join(', ') }}
                </div>
              </div>
              
              <UButton
                variant="ghost"
                size="sm"
                @click="selectedResource = resource"
              >
                <UIcon name="i-heroicons-eye" class="w-4 h-4" />
              </UButton>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="viewMode === 'graph'" class="h-[700px]">
        <div v-if="stack.resources.length === 0" class="text-center text-gray-500 py-8">
          <UIcon name="i-heroicons-cube" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No resources found</p>
        </div>
        
        <div v-else class="h-full">
          <!-- Legend -->
          <div class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-0.5 bg-blue-600"></div>
                  <span class="text-gray-600">Parent-Child</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-0.5 bg-green-600 border-dashed border-green-600"></div>
                  <span class="text-gray-600">Dependencies</span>
                </div>
              </div>
              <div class="flex items-center space-x-2 text-xs text-gray-500">
                <span>Dependency Levels (top to bottom):</span>
                <div class="flex space-x-1">
                  <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                  <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          <VueFlow
            v-model="elements"
            :default-viewport="{ zoom: 0.9, x: 0, y: 0 }"
            :min-zoom="0.2"
            :max-zoom="4"
            class="bg-gray-50 rounded-lg border border-gray-200"
            @node-click="onNodeClick"
            @edge-click="onEdgeClick"
            @pane-click="onPaneClick"
          >
            <template #node-custom="nodeProps">
              <ResourceNode 
                :data="nodeProps.data" 
                :selected="nodeProps.selected"
                @click="onNodeClick(nodeProps)"
              />
            </template>
            
            <Controls />
            <MiniMap />
            <Background />
          </VueFlow>
        </div>
      </div>
    </div>
    
    <UModal v-model="showResourceModal">
      <UCard v-if="selectedResource">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-cube" class="w-5 h-5 text-blue-600" />
            <span class="font-semibold">{{ selectedResource.name }}</span>
          </div>
        </template>
        
        <div class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Resource Details</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Type:</span>
                <span class="ml-2 text-gray-900">{{ selectedResource.type }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">ID:</span>
                <span class="ml-2 text-gray-900">{{ selectedResource.urn }}</span>
              </div>
              <div v-if="selectedResource.parent">
                <span class="font-medium text-gray-700">Parent:</span>
                <span class="ml-2 text-gray-900">{{ selectedResource.parent }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="selectedResource.inputs && Object.keys(selectedResource.inputs).length > 0">
            <h4 class="font-medium text-gray-900 mb-2">Inputs</h4>
            <pre class="text-sm text-gray-700 bg-gray-50 p-3 rounded overflow-x-auto">{{ JSON.stringify(selectedResource.inputs, null, 2) }}</pre>
          </div>
          
          <div v-if="selectedResource.outputs && Object.keys(selectedResource.outputs).length > 0">
            <h4 class="font-medium text-gray-900 mb-2">Outputs</h4>
            <pre class="text-sm text-gray-700 bg-gray-50 p-3 rounded overflow-x-auto">{{ JSON.stringify(selectedResource.outputs, null, 2) }}</pre>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-end">
            <UButton @click="showResourceModal = false">
              Close
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
  
  <div v-else class="text-center text-gray-500 py-8">
    <UIcon name="i-heroicons-cube" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
    <p>No stack selected</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { Background } from '@vue-flow/background'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import type { Stack, Resource } from '~/types'
import type { Node, Edge } from '@vue-flow/core'
import ResourceNode from './ResourceNode.vue'

const {stack} = defineProps<{
  stack: Stack | null
}>();

const viewMode = ref<'list' | 'graph'>('list')
const selectedResource = ref<Resource>()
const showResourceModal = ref(false)
const selectedNodeId = ref<string | null>(null)

// Vue Flow elements
const elements = computed(() => {
  if (!stack?.resources) return []

  // Build dependency graph and find root nodes
  const dependencyGraph = new Map<string, Set<string>>()
  const reverseDependencyGraph = new Map<string, Set<string>>()
  const nodeLevels = new Map<string, number>()
  const visited = new Set<string>()

  // Initialize graphs
  for (const resource of stack.resources) {
    dependencyGraph.set(resource.urn, new Set())
    reverseDependencyGraph.set(resource.urn, new Set())
  }

  // Build dependency relationships
  for (const resource of stack.resources) {
    // Parent-child relationships
    if (resource.parent) {
      const parentResource = stack.resources.find(r => r.urn === resource.parent)
      if (parentResource) {
        dependencyGraph.get(parentResource.urn)!.add(resource.urn)
        reverseDependencyGraph.get(resource.urn)!.add(parentResource.urn)
      }
    }
    
    // Dependencies
    for (const depId of resource.dependencies || []) {
      const depResource = stack.resources.find(r => r.urn === depId)
      if (depResource) {
        dependencyGraph.get(depId)!.add(resource.urn)
        reverseDependencyGraph.get(resource.urn)!.add(depId)
      }
    }
  }

  // Find root nodes (nodes with no incoming edges)
  const rootNodes: string[] = []
  for (const [urn, incoming] of reverseDependencyGraph) {
    if (incoming.size === 0) {
      rootNodes.push(urn)
    }
  }

  // If no root nodes found, use nodes with minimal incoming edges
  if (rootNodes.length === 0) {
    let minIncoming = Infinity
    for (const [urn, incoming] of reverseDependencyGraph) {
      if (incoming.size < minIncoming) {
        minIncoming = incoming.size
      }
    }
    
    for (const [urn, incoming] of reverseDependencyGraph) {
      if (incoming.size === minIncoming) {
        rootNodes.push(urn)
      }
    }
  }

  // Calculate levels using improved topological sort that separates dependent nodes
  // This ensures that dependent nodes are on different vertical levels,
  // reducing horizontal edges and improving graph readability
  const calculateLevels = (node: string, level: number) => {
    if (visited.has(node)) return
    visited.add(node)
    nodeLevels.set(node, Math.max(nodeLevels.get(node) || 0, level))
    
    for (const child of dependencyGraph.get(node) || []) {
      calculateLevels(child, level + 1)
    }
  }

  // Calculate levels for all root nodes
  for (const root of rootNodes) {
    calculateLevels(root, 0)
  }

  // Post-process levels to separate dependent nodes
  const separateDependentNodes = () => {
    let hasChanges = true
    let maxIterations = 10 // Prevent infinite loops
    
    while (hasChanges && maxIterations > 0) {
      hasChanges = false
      maxIterations--
      
      for (const resource of stack.resources) {
        const currentLevel = nodeLevels.get(resource.urn) || 0
        
        // Check dependencies - they should be on higher levels (closer to top)
        for (const depId of resource.dependencies || []) {
          const depLevel = nodeLevels.get(depId) || 0
          if (depLevel <= currentLevel) {
            // Move dependent node to a higher level (lower number)
            const newLevel = Math.max(0, currentLevel - 1)
            nodeLevels.set(depId, newLevel)
            hasChanges = true
          }
        }
        
        // Check parent-child relationships - children should be on lower levels
        if (resource.parent) {
          const parentLevel = nodeLevels.get(resource.parent) || 0
          if (parentLevel >= currentLevel) {
            // Move child to a lower level
            const newLevel = parentLevel + 1
            nodeLevels.set(resource.urn, newLevel)
            hasChanges = true
          }
        }
      }
    }
  }

  // Apply the separation algorithm
  separateDependentNodes()

  // Group nodes by level
  const levelGroups = new Map<number, string[]>()
  for (const [urn, level] of nodeLevels) {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, [])
    }
    levelGroups.get(level)!.push(urn)
  }

  // Helper function to calculate node connectivity score
  const getNodeConnectivity = (nodeId: string) => {
    const resource = stack.resources.find(r => r.urn === nodeId)
    if (!resource) return 0
    
    let score = 0
    
    // Count parent
    if (resource.parent) score += 1
    
    // Count children
    const children = dependencyGraph.get(nodeId) || new Set()
    score += children.size
    
    // Count dependencies
    score += (resource.dependencies?.length || 0)
    
    // Count dependents (nodes that depend on this one)
    for (const res of stack.resources) {
      if (res.dependencies?.includes(nodeId)) {
        score += 1
      }
    }
    
    return score
  }

  // Layout calculation functions
  const LayoutCalculator = {
    // Node dimensions and spacing constants
    constants: {
      nodeWidth: 200,
      nodeHeight: 80,
      nodeMargin: 20,
      levelHeight: 150,
      nodeSpacing: 180,
      startY: 50,
      startX: 100
    },

    // Check if two nodes overlap
    nodesOverlap(pos1: { x: number, y: number }, pos2: { x: number, y: number }): boolean {
      const { nodeWidth, nodeHeight, nodeMargin } = this.constants
      return Math.abs(pos1.x - pos2.x) < (nodeWidth + nodeMargin) && 
             Math.abs(pos1.y - pos2.y) < (nodeHeight + nodeMargin)
    },

    // Find non-overlapping position within the same level
    findNonOverlappingPosition(baseX: number, baseY: number, existingPositions: { x: number, y: number }[]): { x: number, y: number } {
      const { nodeWidth, nodeMargin } = this.constants
      let testX = baseX
      let attempts = 0
      const maxAttempts = 50
      
      while (attempts < maxAttempts) {
        let hasOverlap = false
        
        for (const existingPos of existingPositions) {
          if (this.nodesOverlap({ x: testX, y: baseY }, existingPos)) {
            hasOverlap = true
            break
          }
        }
        
        if (!hasOverlap) {
          return { x: testX, y: baseY }
        }
        
        attempts++
        const offset = Math.floor(attempts / 2) * (nodeWidth + nodeMargin)
        const direction = attempts % 2 === 0 ? 1 : -1
        testX = baseX + offset * direction
      }
      
      return { x: baseX + attempts * 50, y: baseY }
    },

    // Calculate barycenter for a node based on connected nodes
    calculateBarycenter(nodeId: string, level: number, positions: Map<string, { x: number, y: number }>): number {
      const resource = stack.resources.find(r => r.urn === nodeId)
      if (!resource) return 0
      
      let totalX = 0
      let count = 0
      
      // Consider parent position
      if (resource.parent) {
        const parentPos = positions.get(resource.parent)
        if (parentPos) {
          totalX += parentPos.x
          count++
        }
      }
      
      // Consider children positions
      const children = dependencyGraph.get(nodeId) || new Set()
      for (const childId of children) {
        const childLevel = nodeLevels.get(childId) || 0
        if (childLevel === level + 1) {
          const childPos = positions.get(childId)
          if (childPos) {
            totalX += childPos.x
            count++
          }
        }
      }
      
      // Consider dependencies
      for (const depId of resource.dependencies || []) {
        const depLevel = nodeLevels.get(depId) || 0
        if (depLevel === level - 1) {
          const depPos = positions.get(depId)
          if (depPos) {
            totalX += depPos.x
            count++
          }
        }
      }
      
      return count > 0 ? totalX / count : 0
    },

    // Separate nodes into parents and children at a given level
    separateParentsAndChildren(nodesAtLevel: string[]): { parents: string[], children: string[] } {
      const parents: string[] = []
      const children: string[] = []
      
      for (const urn of nodesAtLevel) {
        const resource = stack.resources.find(r => r.urn === urn)
        if (resource) {
          const hasChildrenAtLevel = Array.from(dependencyGraph.get(urn) || []).some(childUrn => {
            const childResource = stack.resources.find(r => r.urn === childUrn)
            return childResource && nodeLevels.get(childUrn) === nodeLevels.get(urn)
          })
          
          if (hasChildrenAtLevel || dependencyGraph.get(urn)?.size || 0 > 0) {
            parents.push(urn)
          } else {
            children.push(urn)
          }
        }
      }
      
      return { parents, children }
    },

    // Position nodes at a specific level
    positionNodesAtLevel(level: number, positions: Map<string, { x: number, y: number }>): void {
      const nodesAtLevel = Array.from(nodeLevels.entries())
        .filter(([_, nodeLevel]) => nodeLevel === level)
        .map(([urn, _]) => urn)
      
      if (nodesAtLevel.length === 0) return
      
      const { levelHeight, nodeSpacing, startY, startX } = this.constants
      const y = startY + level * levelHeight
      const centerX = startX + (Math.max(...Array.from(nodeLevels.values())) * nodeSpacing) / 2
      
      // Separate parents and children
      const { parents, children } = this.separateParentsAndChildren(nodesAtLevel)
      
      // Sort by connectivity
      const sortedParents = parents.sort((a, b) => {
        const connectivityA = getNodeConnectivity(a)
        const connectivityB = getNodeConnectivity(b)
        return connectivityB - connectivityA
      })
      
      const sortedChildren = children.sort((a, b) => {
        const connectivityA = getNodeConnectivity(a)
        const connectivityB = getNodeConnectivity(b)
        return connectivityB - connectivityA
      })
      
      // Position nodes with collision detection
      const existingPositions: { x: number, y: number }[] = []
      const parentStartIndex = Math.floor((nodesAtLevel.length - sortedParents.length) / 2)
      
      // Position parents in center
      sortedParents.forEach((urn, index) => {
        const baseX = centerX + (parentStartIndex + index - (sortedParents.length - 1) / 2) * nodeSpacing
        const position = this.findNonOverlappingPosition(baseX, y, existingPositions)
        positions.set(urn, position)
        existingPositions.push(position)
      })
      
      // Position children around parents
      let childIndex = 0
      sortedChildren.forEach((urn) => {
        let baseX
        if (childIndex < parentStartIndex) {
          baseX = centerX + (childIndex - parentStartIndex) * nodeSpacing
        } else {
          baseX = centerX + (parentStartIndex + sortedParents.length + (childIndex - parentStartIndex)) * nodeSpacing
        }
        
        const position = this.findNonOverlappingPosition(baseX, y, existingPositions)
        positions.set(urn, position)
        existingPositions.push(position)
        childIndex++
      })
    },

    // Optimize level to minimize edge crossings
    optimizeLevelForCrossings(level: number, positions: Map<string, { x: number, y: number }>): void {
      const nodesAtLevel = Array.from(nodeLevels.entries())
        .filter(([_, nodeLevel]) => nodeLevel === level)
        .map(([urn, _]) => urn)
      
      if (nodesAtLevel.length <= 1) return
      
      // Sort by barycenter
      const sortedNodes = nodesAtLevel.sort((a, b) => {
        const baryA = this.calculateBarycenter(a, level, positions)
        const baryB = this.calculateBarycenter(b, level, positions)
        return baryA - baryB
      })
      
      // Reposition based on barycenter order
      const { levelHeight, nodeSpacing, startY, startX } = this.constants
      const y = startY + level * levelHeight
      const centerX = startX + (Math.max(...Array.from(nodeLevels.values())) * nodeSpacing) / 2
      const existingPositions: { x: number, y: number }[] = []
      
      sortedNodes.forEach((urn, index) => {
        const baseX = centerX + (index - (sortedNodes.length - 1) / 2) * nodeSpacing
        const position = this.findNonOverlappingPosition(baseX, y, existingPositions)
        positions.set(urn, position)
        existingPositions.push(position)
      })
    },

    // Calculate all node positions
    calculatePositions(): Map<string, { x: number, y: number }> {
      const maxLevel = Math.max(...Array.from(nodeLevels.values()))
      const positions = new Map<string, { x: number, y: number }>()
      
      // Phase 1: Initial positioning
      for (let level = 0; level <= maxLevel; level++) {
        this.positionNodesAtLevel(level, positions)
      }
      
      // Phase 2: Optimize for edge crossings
      for (let level = 0; level <= maxLevel; level++) {
        this.optimizeLevelForCrossings(level, positions)
      }
      
      return positions
    }
  }

  // Calculate positions using the refactored layout calculator
  const nodePositions = LayoutCalculator.calculatePositions()
  
  // Helper function to calculate edge curvature based on node positions
  const calculateEdgeCurvature = (start: { x: number, y: number }, end: { x: number, y: number }) => {
    const dx = end.x - start.x
    const dy = end.y - start.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // More curvature for longer edges and edges with significant horizontal distance
    const horizontalRatio = Math.abs(dx) / distance
    const distanceFactor = Math.min(distance / 200, 1) // Normalize by typical edge length
    
    return horizontalRatio * distanceFactor * 0.5
  }

  // Helper function to get connected nodes
  const getConnectedNodes = (nodeId: string) => {
    const connected = new Set<string>()
    
    // Get parent
    const resource = stack.resources.find(r => r.urn === nodeId)
    if (resource?.parent) {
      connected.add(resource.parent)
    }
    
    // Get children
    const children = dependencyGraph.get(nodeId) || new Set()
    children.forEach(child => connected.add(child))
    
    // Get dependencies
    const dependencies = resource?.dependencies || []
    dependencies.forEach(dep => connected.add(dep))
    
    // Get dependents (nodes that depend on this one)
    for (const res of stack.resources) {
      if (res.dependencies?.includes(nodeId)) {
        connected.add(res.urn)
      }
    }
    
    return connected
  }

  // Helper function to get edge color based on parent
  const getParentEdgeColor = (parentUrn: string, isConnected: boolean, isStackEdge: boolean) => {
    if (isStackEdge) {
      return '#9ca3af' // Light grey for Stack edges
    }
    
    // Generate consistent color based on parent URN
    const hash = parentUrn.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    const colors = [
      '#3b82f6', // Blue
      '#10b981', // Green
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#8b5cf6', // Purple
      '#06b6d4', // Cyan
      '#f97316', // Orange
      '#ec4899', // Pink
      '#84cc16', // Lime
      '#6366f1', // Indigo
    ]
    
    const colorIndex = Math.abs(hash) % colors.length
    const baseColor = colors[colorIndex]
    
    // Darker color for connected edges
    if (isConnected) {
      return baseColor === '#3b82f6' ? '#1d4ed8' : 
             baseColor === '#10b981' ? '#059669' : 
             baseColor === '#f59e0b' ? '#d97706' : 
             baseColor === '#ef4444' ? '#dc2626' : 
             baseColor === '#8b5cf6' ? '#7c3aed' : 
             baseColor === '#06b6d4' ? '#0891b2' : 
             baseColor === '#f97316' ? '#ea580c' : 
             baseColor === '#ec4899' ? '#db2777' : 
             baseColor === '#84cc16' ? '#65a30d' : 
             baseColor === '#6366f1' ? '#4f46e5' : baseColor
    }
    
    return baseColor
  }

  // Get connected nodes for highlighting
  const connectedNodes = selectedNodeId.value ? getConnectedNodes(selectedNodeId.value) : new Set()

  // Create nodes
  const nodes: Node[] = stack.resources.map((resource) => {
    const position = nodePositions.get(resource.urn) || { x: 0, y: 0 }
    const isSelected = resource.urn === selectedNodeId.value
    const isConnected = connectedNodes.has(resource.urn)
    
    return {
      id: resource.urn,
      type: 'custom',
      position,
      data: {
        resource,
        label: resource.name,
        type: resource.type,
        level: nodeLevels.get(resource.urn) || 0,
        isSelected,
        isConnected
      }
    }
  })

  // Create edges with improved routing
  const edges: Edge[] = []
  const edgeIds = new Set<string>()

  for (const resource of stack.resources) {
    // Parent-child relationships (solid lines) - these take priority
    if (resource.parent) {
      const parentResource = stack.resources.find(r => r.urn === resource.parent)
      if (parentResource) {
        const edgeId = `${parentResource.urn}-${resource.urn}`
        if (!edgeIds.has(edgeId)) {
          const isConnected = selectedNodeId.value && 
            (resource.urn === selectedNodeId.value || parentResource.urn === selectedNodeId.value)
          
          // Check if this is a Stack resource edge
          const isStackEdge = parentResource.type === 'pulumi:pulumi:Stack' || resource.type === 'pulumi:pulumi:Stack'
          
          // Calculate edge curvature based on node positions
          const parentPos = nodePositions.get(parentResource.urn)
          const childPos = nodePositions.get(resource.urn)
          const curvature = parentPos && childPos ? calculateEdgeCurvature(parentPos, childPos) : 0
          
          edges.push({
            id: edgeId,
            source: parentResource.urn,
            target: resource.urn,
            type: 'straight',
            animated: isStackEdge ? false : !!isConnected,
            style: { 
              stroke: getParentEdgeColor(parentResource.urn, !!isConnected, isStackEdge), 
              strokeWidth: isStackEdge ? 1 : (isConnected ? 3 : 2),
              opacity: isStackEdge ? 0.6 : (selectedNodeId.value && !isConnected ? 0.3 : 1)
            },
            data: {
              curvature: isStackEdge ? 0 : curvature,
              isStackEdge,
              parentUrn: parentResource.urn
            }
          })
          edgeIds.add(edgeId)
        }
      }
    }
    
    // Dependencies (dashed lines) - only add if not already connected by parent-child
    for (const depId of resource.dependencies || []) {
      const depResource = stack.resources.find(r => r.urn === depId)
      if (depResource) {
        const edgeId = `${depId}-${resource.urn}`
        const reverseEdgeId = `${resource.urn}-${depId}`
        
        // Skip if this dependency is already represented by a parent-child relationship
        const isParentChild = resource.parent === depId || depResource.parent === resource.urn
        
        if (!edgeIds.has(edgeId) && !edgeIds.has(reverseEdgeId) && !isParentChild) {
          const isConnected = selectedNodeId.value && 
            (resource.urn === selectedNodeId.value || depId === selectedNodeId.value)
          
          // Check if this is a Stack resource edge
          const isStackEdge = depResource.type === 'pulumi:pulumi:Stack' || resource.type === 'pulumi:pulumi:Stack'
          
          // Calculate edge curvature for dependencies
          const depPos = nodePositions.get(depId)
          const targetPos = nodePositions.get(resource.urn)
          const curvature = depPos && targetPos ? calculateEdgeCurvature(depPos, targetPos) : 0
          
          edges.push({
            id: edgeId,
            source: depId,
            target: resource.urn,
            type: isStackEdge ? 'straight' : 'smoothstep',
            style: { 
              stroke: isStackEdge ? '#9ca3af' : (isConnected ? '#059669' : '#10b981'), 
              strokeWidth: isStackEdge ? 1 : (isConnected ? 2 : 1), 
              strokeDasharray: isStackEdge ? 'none' : '5,5',
              opacity: isStackEdge ? 0.6 : (selectedNodeId.value && !isConnected ? 0.3 : 1)
            },
            data: {
              curvature: isStackEdge ? 0 : curvature,
              isStackEdge
            }
          })
          edgeIds.add(edgeId)
        }
      }
    }
  }

  return [...nodes, ...edges]
})

const onPaneClick = () => {
  selectedNodeId.value = null
  selectedResource.value = undefined
}

const onNodeClick = (node: any) => {
  // Toggle selection - if clicking the same node, deselect it
  if (selectedNodeId.value === node.id) {
    selectedNodeId.value = null
    selectedResource.value = undefined
  } else {
    selectedNodeId.value = node.id
    selectedResource.value = node.data.resource
  }
}

const onEdgeClick = (edge: any) => {
  console.log('Edge clicked:', edge)
}

// Clear selection when switching view modes
watch(viewMode, () => {
  selectedNodeId.value = null
  selectedResource.value = undefined
})

watch(selectedResource, (resource) => {
  showResourceModal.value = !!resource
})
</script>

<style scoped>
.vue-flow {
  background-color: #f9fafb;
}
</style> 