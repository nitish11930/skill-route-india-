import React from 'react'
import type { UserProfile } from '../types'

export type NavTab = 'roadmap' | 'gaps' | 'roles' | 'coach' | 'resources' | 'calibration' | 'prototype'

interface SidebarProps {
  activeTab: NavTab
  onSelectTab: (tab: NavTab) => void
  profile: UserProfile | null
  onOpenCalibration: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  onOpenCalibration
}) => {
  const navItems: Array<{ id: NavTab; label: string; icon: string; badge?: string; badgeColor?: string }> = [
    { id: 'roadmap', label: 'Roadmap & Graph', icon: 'account_tree' },
    { id: 'gaps', label: 'Skill Gap Matrix', icon: 'rule' },
    { id: 'roles', label: 'Target Roles', icon: 'work_outline' },
    { id: 'coach', label: 'AI Career Coach', icon: 'smart_toy', badge: 'Lumina', badgeColor: 'bg-[#FFF7ED] text-[#EA580C]' },
    { id: 'resources', label: 'Curated Resources', icon: 'library_books' },
    { id: 'calibration', label: 'Career Calibration', icon: 'tune' },
    { id: 'prototype', label: 'GCC Prototype Lab', icon: 'science', badge: '6 Labs', badgeColor: 'bg-[#F2EFFF] text-[#7C5CFC]' }
  ]

  return (
    <>
    <div className="md:hidden w-full bg-white border-b border-[#E6E8F2] p-4 flex items-center justify-between gap-3">
      <strong className="text-[#2F6FED] whitespace-nowrap">SkillRoute India</strong>
      <select aria-label="Navigate SkillRoute" value={activeTab} onChange={e => onSelectTab(e.target.value as NavTab)} className="text-xs rounded-xl border border-[#E6E8F2] p-2 min-w-0 min-h-11 flex-1 max-w-[220px]">
        {navItems.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
    </div>
    <aside className="hidden md:flex w-64 bg-white border-r border-[#E6E8F2] flex flex-col justify-between p-4 min-h-screen shrink-0">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2F6FED] to-[#7C5CFC] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-base text-[#1E2238] tracking-tight flex items-center gap-1.5">
              SkillRoute
              <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-[#EEF2FF] text-[#2F6FED] rounded-full">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-[#8B90A7] font-medium tracking-wide">
              India AI Career Navigator
            </div>
          </div>
        </div>

        {/* Action Button: Recalibrate */}
        <div className="px-1">
          <button
            onClick={onOpenCalibration}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#2F6FED] to-[#4F46E5] hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-pill flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Recalibrate Career</span>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav aria-label="Main Navigation" className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#F0EEFE] text-[#2F6FED]'
                    : 'text-[#626784] hover:bg-[#F8F9FD] hover:text-[#1E2238]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-white/90 text-[#2F6FED] shadow-sm'
                        : 'bg-[#F8F9FD] text-[#8B90A7]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[17px]"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-gray-100 text-gray-700'}`}>
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED]" />
                ) : null}
              </button>
            )
          })}
        </nav>
      </div>

      {/* User Footer Profile & Version */}
      <div className="pt-4 border-t border-[#E6E8F2] flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-[#F8F9FD] border border-[#E6E8F2]/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2F6FED] to-[#7C5CFC] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {profile?.name?.split(' ').map((n) => n[0]).join('') || 'AS'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#1E2238] truncate">
              {profile?.name || 'Aarav Sharma'}
            </span>
            <span className="text-[10px] text-[#8B90A7] truncate">
              {profile?.currentTitle || 'Junior Developer'} • {profile?.experienceYears ?? 1}y exp
            </span>
          </div>
        </div>

        <div className="px-2 flex items-center justify-between text-[10px] text-[#8B90A7]">
          <span>Neo4j Cypher Traversal</span>
          <span className="font-mono bg-[#EEF2FF] text-[#2F6FED] px-1.5 py-0.2 rounded font-semibold">
            Graph API
          </span>
        </div>
      </div>
    </aside>
    </>
  )
}
