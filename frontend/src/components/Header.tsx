import React from 'react'
import type { HealthStatus, Role, UserProfile } from '../types'

interface HeaderProps {
  health: HealthStatus | null
  profile: UserProfile | null
  roles: Role[]
  currentRole: Role | null
  readinessScore: number
  onRoleChange: (roleId: string) => void
  onOpenCalibration: () => void
}

export const Header: React.FC<HeaderProps> = ({
  health,
  profile,
  roles,
  currentRole,
  readinessScore,
  onRoleChange,
  onOpenCalibration
}) => {
  const isNeo4jConnected = health?.integrations.neo4j.connected ?? false
  const isGeminiConnected = health?.integrations.gemini.connected ?? false

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#E6E8F2] px-4 sm:px-6 py-3 transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Active Role context and switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex w-full sm:w-auto flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B90A7]">Target Role:</span>
            <div className="relative w-full sm:w-auto">
              <select
                aria-label="Target Career Role"
                value={currentRole?.id || profile?.targetRoleId || ''}
                onChange={(e) => onRoleChange(e.target.value)}
                className="w-full sm:w-auto sm:max-w-[300px] min-h-11 appearance-none bg-[#F4F5FB] hover:bg-[#EEF2FF] text-[#1E2238] font-bold text-xs py-1.5 pl-3 pr-8 rounded-xl border border-[#E6E8F2] focus:outline-none focus:ring-2 focus:ring-[#2F6FED] cursor-pointer transition-colors"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[16px] text-[#626784] absolute right-2 top-3.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Hub & Demand tag */}
          {currentRole && (
            <div className="hidden lg:flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF2FF] text-[#2F6FED]">
                {currentRole.tier}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#16A34A]">
                {currentRole.marketDemand} (sample estimate)
              </span>
            </div>
          )}
        </div>

        {/* Right: Health Status, Readiness %, and Profile */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Live System Integration Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Neo4j AuraDB Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                isNeo4jConnected
                  ? 'bg-[#ECFDF5] text-[#16A34A] border border-[#10B981]/30'
                  : 'bg-[#F2EFFF] text-[#7C5CFC] border border-[#7C5CFC]/30'
              }`}
              title={health?.integrations.neo4j.message || 'Neo4j Status'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isNeo4jConnected ? 'bg-[#10B981] animate-pulse' : 'bg-[#7C5CFC]'
                }`}
              />
              <span>
                {!health ? 'Graph: checking…' : isNeo4jConnected ? 'Graph: Neo4j live' : 'Graph: demo data'}
              </span>
            </div>

            {/* Gemini Coach Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                isGeminiConnected
                  ? 'bg-[#EEF2FF] text-[#2F6FED] border border-[#2F6FED]/30'
                  : 'bg-[#FFF7ED] text-[#EA580C] border border-[#EA580C]/30'
              }`}
              title={
                health?.integrations.gemini.message
                  ? `${health.integrations.gemini.message} [Model: ${health.integrations.gemini.model}]`
                  : 'Gemini Status'
              }
            >
              <span className="material-symbols-outlined text-[13px]">
                {isGeminiConnected ? 'smart_toy' : 'bolt'}
              </span>
              <span>
                {isGeminiConnected
                  ? 'Coach: Gemini verified'
                  : !health ? 'Coach: checking…'
                  : health.integrations.gemini.configured ? 'Coach: unverified · fallback ready'
                  : 'Coach: demo fallback'}
              </span>
            </div>
          </div>

          {/* Scored Readiness Meter */}
          <div className="flex items-center gap-2 bg-[#F4F5FB] px-3 py-1 rounded-xl border border-[#E6E8F2]">
            <span className="text-[11px] font-semibold text-[#626784]">Readiness:</span>
            <div className="w-16 bg-[#E6E8F2] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2F6FED] to-[#7C5CFC] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, readinessScore))}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#1E2238]">{readinessScore}%</span>
          </div>

          {/* Quick Calibration Trigger */}
          <button
            onClick={onOpenCalibration}
            className="flex items-center gap-1.5 px-3 min-h-11 py-1.5 rounded-xl text-xs font-semibold text-[#2F6FED] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-all"
            aria-label="Recalibrate your career profile and skills"
            title="Recalibrate Your Career Profile & Skills"
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span className="hidden sm:inline">Calibrate</span>
          </button>
        </div>
      </div>
    </header>
  )
}
