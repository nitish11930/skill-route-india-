import React, { useState, useMemo } from 'react'
import type { SkillGapsResponse } from '../types'

interface SkillGapMatrixViewProps {
  gapData: SkillGapsResponse | null
  onToggleSkill: (skillId: string) => Promise<void>
  onViewResources: (skillId: string) => void
  onAskCoach: (skillName: string) => void
}

export const SkillGapMatrixView: React.FC<SkillGapMatrixViewProps> = ({
  gapData,
  onToggleSkill,
  onViewResources,
  onAskCoach
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'READY' | 'BLOCKED' | 'COMPLETED'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')

  const skills = useMemo(() => gapData?.skills || [], [gapData])

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(skills.map((s) => s.category))
    return ['ALL', ...Array.from(cats)]
  }, [skills])

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    return skills.filter((item) => {
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus
      const matchCat = filterCategory === 'ALL' || item.category === filterCategory
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchStatus && matchCat && matchSearch
    })
  }, [skills, filterStatus, filterCategory, searchTerm])

  if (!gapData) {
    return (
      <div className="flex items-center justify-center p-12 text-[#626784]">
        <span className="material-symbols-outlined text-[28px] animate-spin text-[#2F6FED]">
          progress_activity
        </span>
        <span className="ml-2 text-sm font-semibold">Calculating Graph Gap Analysis...</span>
      </div>
    )
  }

  const role = gapData.role

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Header and Target Role Summary */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#2F6FED]">
              Gap Matrix
            </span>
            <span className="text-xs text-[#8B90A7]">• {gapData.source}</span>
          </div>
          <h2 className="text-xl font-bold text-[#1E2238] tracking-tight">
            Skill Gap Matrix for {role?.title}
          </h2>
          <p className="text-xs text-[#626784] max-w-2xl">
            Calculated against Neo4j prerequisite graph rules (<code className="bg-[#F4F5FB] px-1 py-0.5 rounded text-[11px]">Role REQUIRES Skill</code> and <code className="bg-[#F4F5FB] px-1 py-0.5 rounded text-[11px]">Skill DEPENDS_ON Skill</code>).
          </p>
        </div>

        {/* Big Readiness Score Badge */}
        <div className="bg-gradient-to-tr from-[#2F6FED] to-[#7C5CFC] text-white p-4 rounded-2xl flex items-center gap-4 shadow-md shadow-indigo-500/20 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">
              Role Match
            </span>
            <span className="text-3xl font-extrabold">{gapData.readinessScore}%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
        </div>
      </div>

      {/* Filters and Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E6E8F2] shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-[18px] text-[#8B90A7] absolute left-3 top-2.5">
            search
          </span>
          <input
            type="text"
            placeholder="Search skills (e.g. Docker, Python, Neo4j)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F5FB] rounded-xl text-xs font-medium border border-transparent focus:border-[#2F6FED] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <select aria-label="Filter skills by category" className="rounded-xl border border-[#E6E8F2] text-xs p-2" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          {categories.map(category => <option key={category} value={category}>{category === 'ALL' ? 'All categories' : category}</option>)}
        </select>
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'ALL'
                ? 'bg-[#1E2238] text-white shadow-xs'
                : 'bg-[#F4F5FB] text-[#626784] hover:bg-[#EEF2FF]'
            }`}
          >
            All ({gapData.totalSkillsCount})
          </button>
          <button
            onClick={() => setFilterStatus('READY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'READY'
                ? 'bg-[#2F6FED] text-white shadow-xs'
                : 'bg-[#EEF2FF] text-[#2F6FED] hover:bg-[#E0E7FF]'
            }`}
          >
            Ready to Learn ({gapData.readyCount})
          </button>
          <button
            onClick={() => setFilterStatus('BLOCKED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'BLOCKED'
                ? 'bg-[#F59E0B] text-white shadow-xs'
                : 'bg-[#FFF7ED] text-[#EA580C] hover:bg-[#FFE8CC]'
            }`}
          >
            Blocked ({gapData.blockedCount})
          </button>
          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'COMPLETED'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'bg-[#ECFDF5] text-[#16A34A] hover:bg-[#D1FAE5]'
            }`}
          >
            Mastered ({gapData.completedCount})
          </button>
        </div>
      </div>

      {/* Skills Matrix Table / Cards */}
      <div className="bg-white rounded-3xl border border-[#E6E8F2] shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FD] border-b border-[#E6E8F2] text-[11px] font-bold text-[#626784] uppercase tracking-wider">
                <th className="py-3 px-6">Skill &amp; Category</th>
                <th className="py-3 px-4">Importance</th>
                <th className="py-3 px-4">Prerequisites Status</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-6 text-right">Action / Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8F2] text-xs">
              {filteredSkills.map((skill) => {
                const isCompleted = skill.status === 'COMPLETED'
                const isReady = skill.status === 'READY'

                return (
                  <tr
                    key={skill.id}
                    className={`hover:bg-[#F8F9FD] transition-colors ${
                      isCompleted ? 'bg-[#FCFDFD]' : ''
                    }`}
                  >
                    {/* Skill Info */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              isCompleted ? 'line-through text-[#626784]' : 'text-[#1E2238]'
                            }`}
                          >
                            {skill.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F4F5FB] text-[#626784]">
                            {skill.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#626784] mt-0.5 max-w-md line-clamp-1">
                          {skill.description}
                        </p>
                      </div>
                    </td>

                    {/* Importance & Required Level */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                            skill.importance === 'Core'
                              ? 'bg-[#EEF2FF] text-[#2F6FED]'
                              : skill.importance === 'Recommended'
                              ? 'bg-[#F2EFFF] text-[#7C5CFC]'
                              : 'bg-[#F4F5FB] text-[#626784]'
                          }`}
                        >
                          {skill.importance}
                        </span>
                        <span className="text-[10px] text-[#8B90A7]">Level: {skill.requiredLevel}</span>
                      </div>
                    </td>

                    {/* Prerequisite Status */}
                    <td className="py-4 px-4">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Mastered
                        </span>
                      ) : isReady ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2F6FED] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[14px]">play_circle</span>
                          Ready to Learn
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded-full w-fit">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            Blocked
                          </span>
                          <span className="text-[10px] text-[#EA580C] font-medium">
                            Needs:{' '}
                            {skill.missingPrerequisites.map((p) => p.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1E2238]">{skill.estimatedHours} hrs</span>
                        <span className="text-[10px] text-[#8B90A7]">{skill.difficulty}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewResources(skill.id)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#2F6FED] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-all"
                          title="View curated resources"
                        >
                          Resources
                        </button>

                        <button
                          onClick={() => onAskCoach(skill.name)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#7C5CFC] bg-[#F2EFFF] hover:bg-[#E7E2FE] transition-all"
                          title="Ask AI Career Coach"
                        >
                          Coach
                        </button>

                        <button
                          onClick={() => onToggleSkill(skill.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 ${
                            isCompleted
                              ? 'bg-white text-[#EA580C] border border-[#EA580C]/30 hover:bg-[#FFF7ED]'
                              : 'bg-[#2F6FED] text-white hover:bg-[#255CD0]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isCompleted ? 'undo' : 'check'}
                          </span>
                          <span>{isCompleted ? 'Undo' : 'Complete'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
