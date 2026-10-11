import React, { useState, useEffect, useCallback } from 'react'
import type {
  HealthStatus,
  SkillCatalogItem,
  Role,
  SkillGapsResponse,
  RoadmapResponse,
  Resource,
  UserProfile
} from './types'
import { api } from './services/api'
import { Header } from './components/Header'
import { Sidebar, type NavTab } from './components/Sidebar'
import { RoadmapGraphView } from './views/RoadmapGraphView'
import { SkillGapMatrixView } from './views/SkillGapMatrixView'
import { TargetRolesView } from './views/TargetRolesView'
import { AICareerCoachView } from './views/AICareerCoachView'
import { CuratedResourcesView } from './views/CuratedResourcesView'
import { OnboardingWizardView } from './views/OnboardingWizardView'
import { PrototypeLabView } from './views/PrototypeLabView'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('roadmap')
  const [catalog, setCatalog] = useState<SkillCatalogItem[]>([])
  const [initialError, setInitialError] = useState<string | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [gapData, setGapData] = useState<SkillGapsResponse | null>(null)
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [isCalibrationOpen, setIsCalibrationOpen] = useState<boolean>(false)
  const [coachInitialPrompt, setCoachInitialPrompt] = useState<string>('')
  const [resourceFilterSkillId, setResourceFilterSkillId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load initial app data
  const loadInitialData = async () => {
    setInitialError(null)
    try {
      const [hData, pData, rData, resData, skillData] = await Promise.all([
        api.getHealth(),
        api.getUserProfile(),
        api.getRoles(),
        api.getResources(),
        api.getSkills()
      ])

      setCatalog(skillData.skills)
      setHealth(hData)
      setProfile(pData)
      setRoles(rData.roles || [])
      setResources(resData.resources || [])

      const activeRoleId = pData.targetRoleId || rData.roles[0]?.id || 'fullstack-swe'
      const activeRoleObj = rData.roles.find((r) => r.id === activeRoleId) || rData.roles[0] || null
      setCurrentRole(activeRoleObj)

      // Load gaps and roadmap for active role
      const [gData, rmData] = await Promise.all([
        api.getSkillGaps(activeRoleId),
        api.getRoadmap(activeRoleId)
      ])
      setGapData(gData)
      setRoadmap(rmData)
    } catch (err: any) {
      console.error('Failed to load initial data:', err)
      setInitialError('Cannot reach the backend. Start the Python API and retry.')
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  // Refresh gaps & roadmap when role changes or skill toggles
  const refreshGraphData = useCallback(async (roleId: string) => {
    try {
      const [gData, rmData] = await Promise.all([
        api.getSkillGaps(roleId),
        api.getRoadmap(roleId)
      ])
      setGapData(gData)
      setRoadmap(rmData)
    } catch (err) {
      console.error('Failed to refresh graph data:', err)
    }
  }, [])

  // Handle switching target roles
  const handleRoleChange = async (roleId: string) => {
    try {
      const selected = roles.find((r) => r.id === roleId) || null
      const updated = await api.updateUserProfile({ targetRoleId: roleId })
      setProfile(updated)
      setCurrentRole(selected)
      await refreshGraphData(roleId)
      showToast(`Target role updated to: ${selected?.title || roleId}`)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not change target role')
    }
  }

  // Handle skill completion toggle
  const handleToggleSkill = async (skillId: string) => {
    try {
      const res = await api.toggleSkill(skillId)
      if (profile) {
        setProfile({ ...profile, completedSkillIds: res.completedSkillIds })
      }
      const roleId = currentRole?.id || profile?.targetRoleId || 'fullstack-swe'
      await refreshGraphData(roleId)
      showToast(
        res.completed
          ? `✅ Skill marked complete! Readiness score updated.`
          : `↩️ Skill unmarked.`
      )
    } catch (err: any) {
      showToast(`Error updating skill: ${err?.message || 'Failed'}`)
    }
  }

  // Handle saving full profile from Wizard
  const handleSaveProfile = async (updated: Partial<UserProfile>) => {
    try {
      const newProfile = await api.updateUserProfile(updated)
      setProfile(newProfile)
      if (updated.targetRoleId) {
        const selected = roles.find((r) => r.id === updated.targetRoleId) || null
        setCurrentRole(selected)
        await refreshGraphData(updated.targetRoleId)
      }
      showToast('✨ Career profile calibrated & graph updated!')
    } catch (err: any) {
      showToast(`Error saving profile: ${err?.message || 'Failed'}`)
      throw err
    }
  }

  // Shortcut from node/card to Coach
  const handleSelectSkillForCoach = (skillName: string) => {
    setCoachInitialPrompt(`How should I prepare for ${skillName} as a ${currentRole?.title}? What are the prerequisite gotchas?`)
    setActiveTab('coach')
  }

  // Shortcut to Resources
  const handleViewResources = (skillId: string) => {
    setResourceFilterSkillId(skillId)
    setActiveTab('resources')
  }

  const readinessScore = gapData?.readinessScore ?? 0

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#F4F5FB] text-[#1E2238] font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E202B] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-white/10">
          <span className="material-symbols-outlined text-[18px] text-[#2F6FED]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern SaaS Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          if (tab === 'calibration') {
            setIsCalibrationOpen(true)
          }
        }}
        profile={profile}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Shell */}
        <Header
          health={health}
          profile={profile}
          roles={roles}
          currentRole={currentRole}
          readinessScore={readinessScore}
          onRoleChange={handleRoleChange}
          onOpenCalibration={() => setIsCalibrationOpen(true)}
        />

        {/* Dynamic View Router */}
        <main className="flex-1 pb-12">
          {initialError && <div role="alert" className="m-6 rounded-xl p-4 bg-red-50 text-red-700">{initialError}<button className="ml-3 underline" onClick={loadInitialData}>Retry connection</button></div>}
          {!initialError && activeTab === 'roadmap' && (
            <RoadmapGraphView
              roadmap={roadmap}
              onToggleSkill={handleToggleSkill}
              onSelectSkillForCoach={handleSelectSkillForCoach}
              onViewResources={handleViewResources}
            />
          )}

          {activeTab === 'gaps' && (
            <SkillGapMatrixView
              gapData={gapData}
              onToggleSkill={handleToggleSkill}
              onViewResources={handleViewResources}
              onAskCoach={handleSelectSkillForCoach}
            />
          )}

          {activeTab === 'roles' && (
            <TargetRolesView
              roles={roles}
              currentRoleId={currentRole?.id || ''}
              onSelectRole={(rId) => {
                handleRoleChange(rId)
                setActiveTab('roadmap')
              }}
            />
          )}

          {activeTab === 'coach' && (
            <AICareerCoachView
              currentRole={currentRole}
              initialPrompt={coachInitialPrompt}
              onClearInitialPrompt={() => setCoachInitialPrompt('')}
            />
          )}

          {activeTab === 'resources' && (
            <CuratedResourcesView
              resources={resources}
              initialSkillId={resourceFilterSkillId}
              onClearSkillFilter={() => setResourceFilterSkillId(null)}
            />
          )}

          {activeTab === 'prototype' && <PrototypeLabView />}
        </main>
      </div>

      {/* Career Calibration Modal Wizard */}
      {isCalibrationOpen && (
        <OnboardingWizardView
          profile={profile}
          roles={roles}
          allSkills={catalog}
          onSaveProfile={handleSaveProfile}
          onClose={() => {
            setIsCalibrationOpen(false)
            if (activeTab === 'calibration') setActiveTab('roadmap')
          }}
        />
      )}
    </div>
  )
}

export default App
