import React from 'react'
import type { Role } from '../types'

interface TargetRolesViewProps {
  roles: Role[]
  currentRoleId: string
  onSelectRole: (roleId: string) => void
}

export const TargetRolesView: React.FC<TargetRolesViewProps> = ({
  roles,
  currentRoleId,
  onSelectRole
}) => {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#2F6FED]">
              Target Roles Explorer
            </span>
            <span className="text-xs text-[#8B90A7]">GCC &amp; Product India Tracks</span>
          </div>
          <h2 className="text-xl font-bold text-[#1E2238] tracking-tight">
            Indian Tech Ecosystem Career Tracks
          </h2>
          <p className="text-xs text-[#626784] max-w-2xl">
            Switch target roles anytime to recalculate your prerequisite dependency roadmap, gap matrix, and GCC interview benchmarks.
          </p>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const isCurrent = role.id === currentRoleId
          return (
            <div
              key={role.id}
              className={`bg-white rounded-3xl p-6 border transition-all duration-200 shadow-card flex flex-col justify-between ${
                isCurrent
                  ? 'border-[#2F6FED] ring-2 ring-[#2F6FED]/20'
                  : 'border-[#E6E8F2] hover:shadow-card-hover hover:border-[#CBD5E1]'
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* Header tags */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4F5FB] text-[#626784] uppercase tracking-wider">
                    {role.category}
                  </span>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#16A34A] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Active Target
                    </span>
                  )}
                </div>

                {/* Role Title and Summary */}
                <div>
                  <h3 className="text-base font-bold text-[#1E2238] tracking-tight mb-1">
                    {role.title}
                  </h3>
                  <p className="text-xs text-[#626784] line-clamp-3 leading-relaxed">
                    {role.summary}
                  </p>
                </div>

                {/* Metrics */}
                <div className="p-3 bg-[#F8F9FD] rounded-2xl flex flex-col gap-2 border border-[#E6E8F2]/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8B90A7]">Illustrative Salary Range:</span>
                    <strong className="text-[#1E2238] font-bold">{role.targetCtcRange}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8B90A7]">Sample demand estimate:</span>
                    <span className="font-semibold text-[#16A34A]">{role.marketDemand}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8B90A7]">Typical Experience:</span>
                    <span className="font-medium text-[#1E2238]">{role.typicalExperience}</span>
                  </div>
                </div>

                {/* Hub Focus */}
                <div className="text-[11px] text-[#8B90A7] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#2F6FED]">location_on</span>
                  <span>Hubs: {role.hubFocus}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-[#E6E8F2]">
                <button
                  onClick={() => onSelectRole(role.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-[#EEF2FF] text-[#2F6FED] cursor-default'
                      : 'bg-[#2F6FED] text-white hover:bg-[#255CD0] shadow-pill active:scale-[0.98]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isCurrent ? 'check' : 'near_me'}
                  </span>
                  <span>{isCurrent ? 'Currently Selected' : 'Set as Target Role'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
