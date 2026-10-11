import type {
  HealthStatus,
  SkillCatalogItem,
  Role,
  SkillGapsResponse,
  RoadmapResponse,
  Resource,
  UserProfile,
  CoachChatResponse
} from '../types'

const API_BASE = '/api'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options,
    signal: options?.signal || AbortSignal.timeout(25000)
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API error (${res.status}): ${errorText}`)
  }

  return res.json()
}

export const api = {
  getSkills: (): Promise<{skills: SkillCatalogItem[]}> => request('/skills'),

  getHealth: (): Promise<HealthStatus> => request<HealthStatus>('/health'),

  getRoles: (): Promise<{ roles: Role[]; is_demo_mode: boolean; source: string }> =>
    request('/roles'),

  getRoleDetail: (roleId: string): Promise<{ role: Role; is_demo_mode: boolean; source: string }> =>
    request(`/roles/${roleId}`),

  getSkillGaps: (roleId?: string): Promise<SkillGapsResponse> =>
    request(roleId ? `/skills/gaps?role_id=${encodeURIComponent(roleId)}` : '/skills/gaps'),

  getRoadmap: (roleId?: string): Promise<RoadmapResponse> =>
    request(roleId ? `/roadmap?role_id=${encodeURIComponent(roleId)}` : '/roadmap'),

  getResources: (skillId?: string, isFree?: boolean): Promise<{ resources: Resource[]; count: number }> => {
    const params = new URLSearchParams()
    if (skillId) params.append('skill_id', skillId)
    if (isFree !== undefined) params.append('is_free', String(isFree))
    const query = params.toString() ? `?${params.toString()}` : ''
    return request(`/resources${query}`)
  },

  getUserProfile: (): Promise<UserProfile> => request<UserProfile>('/user/profile'),

  updateUserProfile: (profile: Partial<UserProfile>): Promise<UserProfile> =>
    request<UserProfile>('/user/profile', {
      method: 'POST',
      body: JSON.stringify(profile)
    }),

  toggleSkill: (skillId: string): Promise<{ skillId: string; completed: boolean; completedSkillIds: string[] }> =>
    request(`/user/skills/${encodeURIComponent(skillId)}/toggle`, {
      method: 'POST'
    }),

  resetProfile: (): Promise<UserProfile> =>
    request('/user/reset', { method: 'POST' }),

  chatWithCoach: (message: string, roleId?: string): Promise<CoachChatResponse> =>
    request('/coach/chat', {
      method: 'POST',
      body: JSON.stringify({ message, roleId })
    })
}
