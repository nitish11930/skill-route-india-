import React, { useState } from 'react'

export const PrototypeLabView: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<string>('ctc-simulator')

  // CTC Simulator interactive state
  const [currentCtc, setCurrentCtc] = useState<number>(12)
  const [targetRoleTier, setTargetRoleTier] = useState<string>('tier1-gcc')
  const [compStockSplit, setCompStockSplit] = useState<number>(20)

  // Interview Triage interactive state
  const [triageAction, setTriageAction] = useState<string | null>(null)

  // Assessment Sandbox interactive state
  const [testResult, setTestResult] = useState<string | null>(null)

  // Calculated CTC estimate
  const estimatedOffer = Math.round(currentCtc * (targetRoleTier === 'tier1-gcc' ? 1.45 : 1.3))
  const fixedComponent = Math.round(estimatedOffer * ((100 - compStockSplit) / 100))
  const variableComponent = estimatedOffer - fixedComponent

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Prototype Lab Banner */}
      <div className="bg-gradient-to-r from-[#2F6FED] via-[#5A45CB] to-[#7C5CFC] text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
              Prototype Sandbox Hub
            </span>
            <span className="text-xs text-white/80">Stitch Screen Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            GCC Ecosystem Technical Prototypes
          </h2>
          <p className="text-xs text-white/80 max-w-2xl">
            Faithfully ported from the Stitch design system. These 6 specialized modules explore simulated interview triage, CTC negotiation modeling, recruiter talent pipelines, and portfolio verification.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold shrink-0">
          ⚠️ Clearly Labeled Prototype • Simulated Data
        </div>
      </div>

      {/* Screen Selection Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scroll pb-1">
        {[
          { id: 'ctc-simulator', label: 'CTC Benchmark & Negotiation', icon: 'payments' },
          { id: 'interview-triage', label: 'System Triage & Interview Simulator', icon: 'crisis_alert' },
          { id: 'assessment-sandbox', label: 'Skill Assessment Sandbox', icon: 'terminal' },
          { id: 'verified-portfolio', label: 'GCC Verified Portfolio', icon: 'verified_user' },
          { id: 'recruiter-portal', label: 'Enterprise Recruiter Pipeline', icon: 'badge' },
          { id: 'mentorship-hub', label: 'Peer Mentorship Hub', icon: 'diversity_3' }
        ].map((tab) => {
          const isActive = activeScreen === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-white text-[#2F6FED] shadow-sm border border-[#2F6FED]/30'
                  : 'bg-white/60 text-[#626784] hover:bg-white hover:text-[#1E2238] border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* PROTOTYPE SCREEN 1: Offer Negotiation & CTC Simulator */}
      {activeScreen === 'ctc-simulator' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E8F2]">
            <div>
              <h3 className="font-bold text-base text-[#1E2238]">
                Offer Negotiation &amp; CTC Benchmark Simulator
              </h3>
              <p className="text-xs text-[#8B90A7]">
                Model expected compensation bands based on prerequisite readiness scores and GCC hiring percentiles.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#2F6FED]">
              Simulated Benchmark
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="flex flex-col gap-4 p-5 bg-[#F8F9FD] rounded-2xl border border-[#E6E8F2]">
              <div>
                <label className="text-xs font-bold text-[#1E2238] block mb-1">
                  Current CTC: ₹{currentCtc} Lakhs / annum
                </label>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={currentCtc}
                  onChange={(e) => setCurrentCtc(parseInt(e.target.value, 10))}
                  className="w-full accent-[#2F6FED]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1E2238] block mb-1">
                  Target Company Tier:
                </label>
                <select
                  aria-label="Target Company Tier"
                  value={targetRoleTier}
                  onChange={(e) => setTargetRoleTier(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl text-xs font-semibold border border-[#E6E8F2] focus:outline-none"
                >
                  <option value="tier1-gcc">Tier-1 GCC (Global In-House Center: GS, Wells, Target)</option>
                  <option value="product-scale">High-Growth Indian Product Unicorn (Swiggy, Razorpay)</option>
                  <option value="enterprise">Global Enterprise Tech Services</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1E2238] block mb-1">
                  Equity / Variable Component Split: {compStockSplit}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={compStockSplit}
                  onChange={(e) => setCompStockSplit(parseInt(e.target.value, 10))}
                  className="w-full accent-[#7C5CFC]"
                />
              </div>
            </div>

            {/* Projection Card */}
            <div className="flex flex-col justify-between p-5 bg-gradient-to-tr from-[#F0EEFE] to-white rounded-2xl border border-[#2F6FED]/20">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#7C5CFC] tracking-wider">
                  Projected Benchmark Offer
                </span>
                <div className="text-3xl font-extrabold text-[#1E2238] my-2">
                  ₹{estimatedOffer} Lakhs <span className="text-xs font-normal text-[#626784]">PA</span>
                </div>
                <div className="text-xs text-[#16A34A] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  <span>+{Math.round(((estimatedOffer - currentCtc) / currentCtc) * 100)}% Projection over Current</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E6E8F2] flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#626784]">Fixed Base (Monthly In-hand core):</span>
                  <strong className="text-[#1E2238]">₹{fixedComponent}L PA</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#626784]">Variable / RSU Performance Grant:</span>
                  <strong className="text-[#7C5CFC]">₹{variableComponent}L PA</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROTOTYPE SCREEN 2: System Triage Simulator */}
      {activeScreen === 'interview-triage' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E8F2]">
            <div>
              <h3 className="font-bold text-base text-[#1E2238]">
                AI Mock Interview: Production System Triage Simulator
              </h3>
              <p className="text-xs text-[#8B90A7]">
                Experience high-stakes GCC architectural incident response triage used in Principal/Staff hiring.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7ED] text-[#EA580C]">
              Incident Simulator
            </span>
          </div>

          <div className="p-4 bg-[#FFF1EE] border border-[#F04438]/30 rounded-2xl flex items-start gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#F04438] shrink-0">
              warning
            </span>
            <div>
              <div className="font-bold text-xs text-[#F04438] uppercase tracking-wide">
                Active Incident #INC-4029 • Severity 1
              </div>
              <div className="font-semibold text-sm text-[#1E2238] mt-1">
                Payment Gateway Microservice P99 Latency Spiked to 8,200ms
              </div>
              <p className="text-xs text-[#626784] mt-1">
                PostgreSQL database connection pool exhausted. Redis cache eviction rate spiked 400%. Incoming checkout traffic dropping 32%.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-[#1E2238]">Choose Your Engineering Mitigation:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'ratelimit',
                  title: 'Activate Token-Bucket Rate Limiter',
                  desc: 'Shed non-critical read traffic at edge API gateway to preserve checkout threads.'
                },
                {
                  id: 'pool',
                  title: 'Scale PgBouncer Connection Pool',
                  desc: 'Double max client connections and force transaction-level pooling.'
                },
                {
                  id: 'circuit',
                  title: 'Trip Circuit Breakers to Fallback Cache',
                  desc: 'Serve stale catalog data and queue transactions via Apache Kafka.'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTriageAction(opt.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    triageAction === opt.id
                      ? 'border-[#2F6FED] bg-[#EEF2FF] shadow-xs'
                      : 'border-[#E6E8F2] hover:bg-[#F8F9FD]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#1E2238] mb-1">{opt.title}</div>
                  <div className="text-[11px] text-[#626784]">{opt.desc}</div>
                </button>
              ))}
            </div>

            {triageAction && (
              <div className="p-4 bg-[#ECFDF5] border border-[#10B981]/30 rounded-2xl text-xs text-[#065F46] flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  <span>
                    Mitigation Evaluated: P99 latency recovered to 140ms. Graph prerequisite verified: <strong>System Design &amp; Redis Caching</strong>.
                  </span>
                </div>
                <span className="font-bold text-[#10B981]">+25 Graph Score</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROTOTYPE SCREEN 3: Skill Assessment Sandbox */}
      {activeScreen === 'assessment-sandbox' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E8F2]">
            <div>
              <h3 className="font-bold text-base text-[#1E2238]">
                Interactive Skill Assessment Sandbox
              </h3>
              <p className="text-xs text-[#8B90A7]">
                Live in-browser coding challenge verifying Cypher query traversal &amp; Async Python API design.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#2F6FED]">
              Sandbox Lab
            </span>
          </div>

          <div className="p-4 bg-[#1E202B] text-white rounded-2xl font-mono text-xs overflow-x-auto">
            <div className="text-[#8B90A7] mb-2">// Problem: Find all uncompleted prerequisite skills for target role</div>
            <div className="text-[#A5B4FC]">MATCH (role:Role &#123;id: $roleId&#125;)-[:REQUIRES]-&gt;(s:Skill)</div>
            <div className="text-[#A5B4FC]">OPTIONAL MATCH (s)-[:DEPENDS_ON*]-&gt;(prereq:Skill)</div>
            <div className="text-[#93C5FD]">WHERE NOT prereq.id IN $completedSkillIds</div>
            <div className="text-[#86EFAC]">RETURN s.name, collect(prereq.name) AS blockingPrerequisites</div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setTestResult('Passed 4/4 test cases. Prerequisite DAG traversal valid.')}
              className="px-5 py-2.5 bg-[#2F6FED] hover:bg-[#255CD0] text-white font-bold text-xs rounded-xl shadow-pill transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Run Automated Evaluation</span>
            </button>

            {testResult && (
              <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1.5 bg-[#ECFDF5] px-3 py-1.5 rounded-xl">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                {testResult}
              </span>
            )}
          </div>
        </div>
      )}

      {/* PROTOTYPE SCREEN 4: GCC Verified Portfolio */}
      {activeScreen === 'verified-portfolio' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E8F2]">
            <div>
              <h3 className="font-bold text-base text-[#1E2238]">
                GCC Verified Portfolio &amp; Graph Credential
              </h3>
              <p className="text-xs text-[#8B90A7]">
                Prototype credentials only; these sample records do not certify skills or identity.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#16A34A]">
              Cryptographic Proof
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Neo4j Cypher Traversal', issuer: 'Sample issuer', id: 'VERIF-77291', status: 'Sample' },
              { title: 'Async Python Microservices', issuer: 'Sample issuer', id: 'VERIF-89210', status: 'Sample' },
              { title: 'Distributed Systems & Kafka', issuer: 'GCC Talent Advisory', id: 'VERIF-44109', status: 'In Progress' }
            ].map((c, i) => (
              <div key={i} className="p-4 rounded-2xl border border-[#E6E8F2] bg-[#F8F9FD] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#8B90A7]">{c.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#ECFDF5] text-[#16A34A]">
                      {c.status}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[#1E2238]">{c.title}</div>
                  <div className="text-[11px] text-[#626784] mt-1">{c.issuer}</div>
                </div>
                <div className="mt-4 pt-2 border-t border-[#E6E8F2] text-[10px] text-[#2F6FED] font-bold flex items-center gap-1">
                  <span>View Graph Attestation</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROTOTYPE SCREEN 5: Recruiter Portal */}
      {activeScreen === 'recruiter-portal' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E8F2]">
            <div>
              <h3 className="font-bold text-base text-[#1E2238]">
                GCC Enterprise Talent Pipeline &amp; Recruiter Dashboard
              </h3>
              <p className="text-xs text-[#8B90A7]">
                How enterprise hiring leaders in Bengaluru and Hyderabad discover graph-calibrated talent pipelines.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#2F6FED]">
              Recruiter Mode
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F9FD] border-b border-[#E6E8F2] text-[10px] font-bold text-[#8B90A7] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Candidate Track</th>
                  <th className="py-2.5 px-4">Graph Readiness</th>
                  <th className="py-2.5 px-4">Top Prerequisite Badges</th>
                  <th className="py-2.5 px-4">Hub Location</th>
                  <th className="py-2.5 px-4 text-right">GCC Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8F2]">
                {[
                  { name: 'Aarav Sharma (You)', score: '68%', badges: 'FastAPI, Docker, SQL', hub: 'Bengaluru', stage: 'Ready for Technical Screen' },
                  { name: 'Priya Iyer', score: '92%', badges: 'PyTorch, RAG, Neo4j', hub: 'Hyderabad', stage: 'Final Leadership Round' },
                  { name: 'Rohan Deshmukh', score: '84%', badges: 'Kubernetes, Terraform, AWS', hub: 'Pune', stage: 'Offer Extended' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#F8F9FD]">
                    <td className="py-3 px-4 font-bold text-[#1E2238]">{row.name}</td>
                    <td className="py-3 px-4 font-bold text-[#2F6FED]">{row.score}</td>
                    <td className="py-3 px-4 text-[#626784]">{row.badges}</td>
                    <td className="py-3 px-4 text-[#8B90A7]">{row.hub}</td>
                    <td className="py-3 px-4 text-right font-semibold text-[#16A34A]">{row.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROTOTYPE SCREEN 6: Mentorship Hub */}
      {activeScreen === 'mentorship-hub' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8F2] shadow-card flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E8F2]">
            <div>
              <h3 className="font-bold text-base text-[#1E2238]">
                AI &amp; Peer Mentorship Hub
              </h3>
              <p className="text-xs text-[#8B90A7]">
                Connect with engineers who cleared the exact same prerequisite graphs and transitioned to Tier-1 GCCs.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F2EFFF] text-[#7C5CFC]">
              Community
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Vikram Mehta',
                role: 'Staff Engineer at Top FinTech GCC',
                focus: 'Prerequisite Roadmapping & Distributed Caching',
                availability: '2 slots this week'
              },
              {
                name: 'Sneha Patel',
                role: 'AI Platform Lead at Global Healthcare GCC',
                focus: 'RAG Architectures & PyTorch Pipelines',
                availability: 'Tomorrow, 7:00 PM IST'
              }
            ].map((m, i) => (
              <div key={i} className="p-4 rounded-2xl border border-[#E6E8F2] bg-[#F8F9FD] flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs text-[#1E2238]">{m.name}</div>
                  <div className="text-[11px] text-[#2F6FED] font-semibold mt-0.5">{m.role}</div>
                  <p className="text-xs text-[#626784] mt-2">{m.focus}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E6E8F2] flex items-center justify-between">
                  <span className="text-[10px] text-[#16A34A] font-bold">{m.availability}</span>
                  <button className="px-3 py-1 bg-[#2F6FED] text-white rounded-xl text-[11px] font-bold">
                    Schedule Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
