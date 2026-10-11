import React, { useState } from 'react'
import type { Role, UserProfile, SkillCatalogItem } from '../types'

interface OnboardingWizardViewProps {
  profile: UserProfile | null
  roles: Role[]
  allSkills: SkillCatalogItem[]
  onSaveProfile: (updated: Partial<UserProfile>) => Promise<void>
  onClose: () => void
}

export const OnboardingWizardView: React.FC<OnboardingWizardViewProps> = ({
  profile,
  roles,
  allSkills,
  onSaveProfile,
  onClose
}) => {
  const [step, setStep] = useState<number>(1)
  const [targetRoleId, setTargetRoleId] = useState<string>(
    profile?.targetRoleId || 'fullstack-swe'
  )
  const [name, setName] = useState<string>(profile?.name || 'Aarav Sharma')
  const [currentTitle, setCurrentTitle] = useState<string>(
    profile?.currentTitle || 'Junior Developer'
  )
  const [experienceYears, setExperienceYears] = useState<number>(
    profile?.experienceYears ?? 1
  )
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(
    new Set(profile?.completedSkillIds || ['web-foundations', 'js-ts'])
  )
  const [targetLocation, setTargetLocation] = useState<string>(
    profile?.targetLocation || 'Bengaluru / Remote'
  )
  const [targetSalary, setTargetSalary] = useState<string>(
    profile?.targetSalary || '₹18,00,000'
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)

  const toggleSkill = (id: string) => {
    setCompletedSkills((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      await onSaveProfile({
        name,
        targetRoleId,
        currentTitle,
        experienceYears,
        completedSkillIds: Array.from(completedSkills),
        targetLocation,
        targetSalary
      })
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save profile. Please retry.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#1E202B]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E6E8F2] shadow-2xl max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 my-auto">
        {error && <div role="alert" className="text-red-700 bg-red-50 rounded-xl p-3 text-xs">{error}</div>}
        {/* Wizard Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2F6FED] to-[#7C5CFC] flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E2238]">Career Calibration Wizard</h2>
              <p className="text-xs text-[#8B90A7]">
                Step {step} of 3 • SkillRoute India Graph Calibration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F5FB] hover:bg-[#EEF2FF] text-[#626784] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#F4F5FB] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#2F6FED] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step 1: Target Role & Experience */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-bold text-sm text-[#1E2238] mb-1">
                1. Select Target Career Track &amp; Experience Level
              </h3>
              <p className="text-xs text-[#626784]">
                Choose your ambition. The graph will tailor its prerequisite algorithms to this path.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="text-xs font-semibold text-[#1E2238]">Target Role Track:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {roles.map((r) => {
                  const isSelected = r.id === targetRoleId
                  return (
                    <div
                      key={r.id}
                      onClick={() => setTargetRoleId(r.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#2F6FED] bg-[#EEF2FF] shadow-xs'
                          : 'border-[#E6E8F2] hover:bg-[#F8F9FD]'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#1E2238]">{r.title}</div>
                      <div className="text-[11px] text-[#626784] mt-0.5">{r.targetCtcRange}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1E2238] block mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F4F5FB] rounded-xl text-xs font-medium border border-[#E6E8F2] focus:border-[#2F6FED] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1E2238] block mb-1">
                  Current Title:
                </label>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F4F5FB] rounded-xl text-xs font-medium border border-[#E6E8F2] focus:border-[#2F6FED] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1 font-semibold text-[#1E2238]">
                <span>Years of Professional Experience:</span>
                <span className="text-[#2F6FED] font-bold">{experienceYears} Years</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
                className="w-full accent-[#2F6FED] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Step 2: Skill Calibration Checkboxes */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-sm text-[#1E2238] mb-1">
                2. Calibrate Your Current Technical Foundations
              </h3>
              <p className="text-xs text-[#626784]">
                Check the skills you currently possess. The prerequisite graph will mark downstream skills as Ready.
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto custom-scroll p-3 bg-[#F8F9FD] rounded-2xl border border-[#E6E8F2] grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allSkills.map((s) => {
                const checked = completedSkills.has(s.id)
                return (
                  <button type="button" role="checkbox" aria-checked={checked} aria-label={s.name}
                    key={s.id}
                    onClick={() => toggleSkill(s.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      checked
                        ? 'bg-[#ECFDF5] border-[#10B981]/40 text-[#065F46]'
                        : 'bg-white border-[#E6E8F2] text-[#1E2238] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold truncate">{s.name}</span>
                      <span className="text-[10px] text-[#8B90A7]">{s.category}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        checked ? 'bg-[#10B981] text-white' : 'border border-[#CBD5E1]'
                      }`}
                    >
                      {checked && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="text-[11px] text-[#8B90A7]">
              Selected: <strong className="text-[#2F6FED]">{completedSkills.size}</strong> skills mastered
            </div>
          </div>
        )}

        {/* Step 3: Location and Compensation */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-bold text-sm text-[#1E2238] mb-1">
                3. Compensation Benchmark &amp; Preferred Tech Hub
              </h3>
              <p className="text-xs text-[#626784]">
                Align your roadmap with local GCC hiring brackets and remote opportunities.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1E2238] block mb-1">
                Target Annual Compensation (CTC):
              </label>
              <input
                type="text"
                value={targetSalary}
                onChange={(e) => setTargetSalary(e.target.value)}
                placeholder="e.g. ₹20,00,000"
                className="w-full px-3.5 py-2.5 bg-[#F4F5FB] rounded-xl text-xs font-medium border border-[#E6E8F2] focus:border-[#2F6FED] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1E2238] block mb-1">
                Preferred Tech Hub:
              </label>
              <select
                aria-label="Preferred Tech Hub"
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F5FB] rounded-xl text-xs font-medium border border-[#E6E8F2] focus:border-[#2F6FED] focus:outline-none cursor-pointer"
              >
                <option value="Bengaluru / Hybrid">Bengaluru (Electronic City / Outer Ring Road)</option>
                <option value="Hyderabad / Hybrid">Hyderabad (Hitec City / Financial District)</option>
                <option value="Pune / Hybrid">Pune (Hinjawadi / Kharadi)</option>
                <option value="Gurugram / Noida">NCR (Gurugram CyberHub / Noida)</option>
                <option value="Pan-India Remote">Pan-India Remote / Global GCC</option>
              </select>
            </div>

            <div className="p-4 bg-[#EEF2FF] rounded-2xl border border-[#2F6FED]/20 text-xs text-[#1E2238] flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px] text-[#2F6FED] shrink-0">
                hub
              </span>
              <div>
                <strong>Graph Traversal Ready:</strong> Saving will immediately re-index your prerequisite roadmap, gap matrix, and AI coaching grounding evidence.
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E6E8F2]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#626784] hover:bg-[#F4F5FB] transition-all"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-[#2F6FED] hover:bg-[#255CD0] text-white font-bold text-xs rounded-xl shadow-pill transition-all flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2F6FED] to-[#7C5CFC] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-pill transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>{saving ? 'Recalibrating Graph...' : 'Save & Recalibrate'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
