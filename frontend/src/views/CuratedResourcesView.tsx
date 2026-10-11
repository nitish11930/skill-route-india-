import React, { useState, useMemo } from 'react'
import type { Resource } from '../types'

interface CuratedResourcesViewProps {
  resources: Resource[]
  initialSkillId?: string | null
  onClearSkillFilter?: () => void
}

export const CuratedResourcesView: React.FC<CuratedResourcesViewProps> = ({
  resources,
  initialSkillId,
  onClearSkillFilter
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState<string>(initialSkillId || 'ALL')
  const [filterFreeOnly, setFilterFreeOnly] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Unique skills in resources
  const availableSkills = useMemo(() => {
    const map = new Map<string, string>()
    resources.forEach((r) => map.set(r.skillId, r.skillName))
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [resources])

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchSkill = selectedSkillId === 'ALL' || res.skillId === selectedSkillId
      const matchFree = !filterFreeOnly || res.is_free
      const matchSearch =
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.skillName.toLowerCase().includes(searchTerm.toLowerCase())
      return matchSkill && matchFree && matchSearch
    })
  }, [resources, selectedSkillId, filterFreeOnly, searchTerm])

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#16A34A]">
              Curated Learning Catalog
            </span>
            <span className="text-xs text-[#8B90A7]">• Authentic Resources</span>
          </div>
          <h2 className="text-xl font-bold text-[#1E2238] tracking-tight">
            Curated Learning Resources &amp; Certifications
          </h2>
          <p className="text-xs text-[#626784] max-w-2xl">
            Directly mapped to prerequisite graph skills. Explore official docs and public learning tracks. Availability and certification terms may change.
          </p>
        </div>

        <div className="text-xs text-[#626784] bg-[#F8F9FD] p-3 rounded-2xl border border-[#E6E8F2] flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[18px] text-[#2F6FED]">verified</span>
          <span><strong>{filteredResources.length}</strong> Resources Available</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E6E8F2] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-[18px] text-[#8B90A7] absolute left-3 top-2.5">
            search
          </span>
          <input
            type="text"
            placeholder="Search by topic, provider, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F5FB] rounded-xl text-xs font-medium border border-transparent focus:border-[#2F6FED] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Skill Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8B90A7]">Skill:</span>
            <select
              aria-label="Filter resources by skill"
              value={selectedSkillId}
              onChange={(e) => { setSelectedSkillId(e.target.value); if (e.target.value === 'ALL') onClearSkillFilter?.() }}
              className="bg-[#F4F5FB] text-[#1E2238] font-bold text-xs py-1.5 px-3 rounded-xl border border-[#E6E8F2] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] cursor-pointer"
            >
              <option value="ALL">All Skills ({resources.length})</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Free Only Toggle */}
          <button
            onClick={() => setFilterFreeOnly(!filterFreeOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterFreeOnly
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'bg-[#F4F5FB] text-[#626784] hover:bg-[#EEF2FF]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {filterFreeOnly ? 'check_box' : 'check_box_outline_blank'}
            </span>
            <span>Free Only</span>
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-3">
              {/* Category & Free Badges */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#2F6FED] uppercase tracking-wider">
                  {res.skillName}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    res.is_free ? 'bg-[#ECFDF5] text-[#16A34A]' : 'bg-[#FFF7ED] text-[#EA580C]'
                  }`}
                >
                  {res.is_free ? 'Free / Open Source' : 'Paid'}
                </span>
              </div>

              {/* Resource Title */}
              <h3 className="text-sm font-bold text-[#1E2238] leading-snug line-clamp-2">
                {res.title}
              </h3>

              {/* Metadata */}
              <div className="p-3 bg-[#F8F9FD] rounded-2xl flex flex-col gap-1.5 border border-[#E6E8F2]/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8B90A7]">Provider:</span>
                  <strong className="text-[#1E2238] font-semibold">{res.provider}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8B90A7]">Format:</span>
                  <span className="font-medium text-[#626784]">{res.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8B90A7]">Est. Duration:</span>
                  <span className="font-medium text-[#1E2238]">{res.duration}</span>
                </div>
              </div>
            </div>

            {/* Launch CTA Button */}
            <div className="mt-5 pt-3 border-t border-[#E6E8F2]">
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full py-2.5 px-4 bg-[#F4F5FB] hover:bg-[#EEF2FF] hover:text-[#2F6FED] text-[#1E2238] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all group"
              >
                <span>Open Resource</span>
                <span className="material-symbols-outlined text-[15px] group-hover:translate-x-0.5 transition-transform">
                  open_in_new
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
