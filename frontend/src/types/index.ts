export interface Role {
  id: string
  title: string
  category: string
  summary: string
  marketDemand: string
  typicalExperience: string
  tier: string
  hubFocus: string
  targetCtcRange: string
  requiredSkillCount?: number
  requiredSkills?: Array<{
    id: string
    name: string
    category: string
    importance: string
    level: string
  }>
}

export interface SkillPrerequisite {
  id: string
  name: string
  completed: boolean
}

export interface MissingPrerequisite {
  id: string
  name: string
}

export interface SkillGapItem {
  id: string
  name: string
  category: string
  description: string
  estimatedHours: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  importance: 'Core' | 'Recommended' | 'Prerequisite' | 'Elective'
  requiredLevel: string
  isCoreRequirement: boolean
  status: 'COMPLETED' | 'READY' | 'BLOCKED'
  prerequisites: SkillPrerequisite[]
  missingPrerequisites: MissingPrerequisite[]
}

export interface SkillGapsResponse {
  role: Role
  readinessScore: number
  totalSkillsCount: number
  completedCount: number
  readyCount: number
  blockedCount: number
  estimatedHoursRemaining: number
  skills: SkillGapItem[]
  readyToLearn: SkillGapItem[]
  blockedSkills: SkillGapItem[]
  completedSkills: SkillGapItem[]
  is_demo_mode: boolean
  source: string
}

export interface GraphNode {
  id: string
  label: string
  category: string
  difficulty: string
  status: 'COMPLETED' | 'READY' | 'BLOCKED'
  importance: string
  hours: number
  isCore: boolean
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: string
  sourceCompleted: boolean
  targetStatus: string
}

export interface RoadmapPhase {
  phaseNumber: number
  title: string
  description: string
  skills: SkillGapItem[]
}

export interface RoadmapResponse {
  role: Role
  readinessScore: number
  totalHours: number
  phases: RoadmapPhase[]
  graph: {
    nodes: GraphNode[]
    edges: GraphEdge[]
  }
  is_demo_mode: boolean
  source: string
}

export interface Resource {
  id: string
  skillId: string
  skillName: string
  skillCategory: string
  title: string
  url: string
  provider: string
  type: string
  is_free: boolean
  duration: string
  level: string
}

export interface UserProfile {
  name: string
  targetRoleId: string
  experienceYears: number
  currentTitle: string
  completedSkillIds: string[]
  targetLocation: string
  targetSalary: string
  learningPaceHoursPerWeek: number
  updatedAt?: string
}

export interface HealthStatus {
  status: string
  app: string
  version: string
  timestamp: string
  isDemoMode: boolean
  integrations: {
    neo4j: {
      configured: boolean
      connected: boolean
      status: string
      message: string
      targetUri: string
      database: string
    }
    gemini: {
      configured: boolean
      connected: boolean
      model: string
      status: string
      message: string
    }
  }
  modeDescription: string
}

export interface GroundedEvidence {
  targetRole: string
  category: string
  readinessScore: string
  marketDemand: string
  targetCtcRange: string
  completedSkillsCount: number
  completedSkills: string[]
  readyToLearn: string[]
  blockedSkills: string[]
  recommendedResources: string[]
}

export interface CoachChatResponse {
  response: string
  isDemoMode: boolean
  groundedEvidence: GroundedEvidence
  modelUsed: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  isDemoMode?: boolean
  groundedEvidence?: GroundedEvidence
}

export type SkillCatalogItem = Pick<SkillGapItem, 'id' | 'name' | 'category'>
