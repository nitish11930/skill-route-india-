import React, { useState, useMemo } from 'react'
import type { RoadmapResponse, GraphNode } from '../types'

interface RoadmapGraphViewProps {
  roadmap: RoadmapResponse | null
  onToggleSkill: (skillId: string) => Promise<void>
  onSelectSkillForCoach: (skillName: string) => void
  onViewResources: (skillId: string) => void
}

export const RoadmapGraphView: React.FC<RoadmapGraphViewProps> = ({
  roadmap,
  onToggleSkill,
  onSelectSkillForCoach,
  onViewResources
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'both' | 'graph' | 'roadmap'>('both')

  const role = roadmap?.role
  const nodes = useMemo(() => roadmap?.graph.nodes || [], [roadmap])
  const edges = useMemo(() => roadmap?.graph.edges || [], [roadmap])
  const phases = roadmap?.phases || []

  // Selected node details
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null
    return nodes.find((n) => n.id === selectedNodeId) || null
  }, [selectedNodeId, nodes])

  // Upstream prerequisites and downstream dependents for selected node
  const selectedPrereqs = useMemo(() => {
    if (!selectedNodeId) return []
    return edges.filter((e) => e.target === selectedNodeId).map((e) => e.source)
  }, [selectedNodeId, edges])

  const selectedDependents = useMemo(() => {
    if (!selectedNodeId) return []
    return edges.filter((e) => e.source === selectedNodeId).map((e) => e.target)
  }, [selectedNodeId, edges])

  // Topological / Level calculation for visual graph layout (left-to-right columns)
  const nodeLayout = useMemo(() => {
    // Backend nodes are topologically ordered; place every dependent after its prerequisites.
    const columns: Record<string, number> = {}
    const colGroups: Record<number, GraphNode[]> = {}
    nodes.forEach(node => {
      const parents = edges.filter(edge => edge.target === node.id).map(edge => columns[edge.source] ?? 0)
      const depth = parents.length ? Math.max(...parents) + 1 : 0
      columns[node.id] = depth
      ;(colGroups[depth] ||= []).push(node)
    })

    const coords: Record<string, { x: number; y: number }> = {}
    const colWidth = 280
    const startX = 60
    const startY = 60
    const rowHeight = 70

    Object.entries(colGroups).forEach(([colStr, colNodes]) => {
      const colIdx = parseInt(colStr, 10)
      colNodes.forEach((node, rowIdx) => {
        coords[node.id] = {
          x: startX + colIdx * colWidth,
          y: startY + rowIdx * rowHeight
        }
      })
    })

    return { coords, width: Math.max(820, (Math.max(0, ...Object.keys(colGroups).map(Number)) + 1) * 280 + 100), maxRows: Math.max(...Object.values(colGroups).map((g) => g.length), 4) }
  }, [nodes, edges])

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center p-12 text-[#626784]">
        <span className="material-symbols-outlined text-[28px] animate-spin text-[#2F6FED]">
          progress_activity
        </span>
        <span className="ml-2 text-sm font-semibold">Loading Graph Traversal...</span>
      </div>
    )
  }

  const completedCount = nodes.filter((n) => n.status === 'COMPLETED').length
  const readyCount = nodes.filter((n) => n.status === 'READY').length
  const blockedCount = nodes.filter((n) => n.status === 'BLOCKED').length

  const getNodeColor = (status: string) => {
    if (status === 'COMPLETED') return { bg: '#ECFDF5', border: '#10B981', text: '#065F46', dot: '#10B981' }
    if (status === 'READY') return { bg: '#EEF2FF', border: '#2F6FED', text: '#1E40AF', dot: '#2F6FED' }
    return { bg: '#FFF7ED', border: '#F59E0B', text: '#9A3412', dot: '#F59E0B' }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Readiness Meter Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6E8F2] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B90A7] uppercase tracking-wider">
              Scored Readiness
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#2F6FED]">
              Graph Calibrated
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1E2238] tracking-tight">
              {roadmap.readinessScore}%
            </span>
            <span className="text-xs font-medium text-[#626784]">
              ({completedCount} of {nodes.length} skills)
            </span>
          </div>
          <div className="w-full bg-[#E6E8F2] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2F6FED] to-[#7C5CFC] h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(4, roadmap.readinessScore))}%` }}
            />
          </div>
        </div>

        {/* Target CTC Benchmark Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6E8F2] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B90A7] uppercase tracking-wider">
              Illustrative Salary Range
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#16A34A]">trending_up</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-[#1E2238] tracking-tight">
              {role?.targetCtcRange || '₹14L - ₹32L PA'}
            </div>
            <div className="text-[11px] text-[#626784] font-medium">
              {role?.hubFocus || 'Bengaluru, Hyderabad, Pune'}
            </div>
          </div>
          <div className="text-[11px] text-[#8B90A7] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#16A34A]">verified</span>
            <span>Sample demand estimate: <strong className="text-[#1E2238]">{role?.marketDemand}</strong></span>
          </div>
        </div>

        {/* Immediate Next Actions Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6E8F2] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B90A7] uppercase tracking-wider">
              Ready to Learn
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#16A34A]">
              Prerequisites Met
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2F6FED] tracking-tight">
              {readyCount}
            </span>
            <span className="text-xs font-medium text-[#626784]">actionable next skills</span>
          </div>
          <div className="text-[11px] text-[#626784] truncate">
            {nodes.filter((n) => n.status === 'READY').map((n) => n.label).slice(0, 2).join(', ') || 'All clear!'}
          </div>
        </div>

        {/* Blocked by Prerequisites Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6E8F2] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B90A7] uppercase tracking-wider">
              Prerequisite Blocked
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7ED] text-[#EA580C]">
              Order Required
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#F59E0B] tracking-tight">
              {blockedCount}
            </span>
            <span className="text-xs font-medium text-[#626784]">awaiting foundations</span>
          </div>
          <div className="text-[11px] text-[#8B90A7]">
            Est. total hours to target: <strong className="text-[#1E2238]">{roadmap.totalHours} hrs</strong>
          </div>
        </div>
      </div>

      {/* Control Switcher Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-3 rounded-2xl border border-[#E6E8F2] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1E2238] px-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#2F6FED]">account_tree</span>
            Prerequisite Traversal Engine
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F4F5FB] text-[#626784]">
            {roadmap.source}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="bg-[#F4F5FB] p-1 rounded-xl flex items-center border border-[#E6E8F2]">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'both' ? 'bg-white text-[#2F6FED] shadow-xs' : 'text-[#626784]'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'graph' ? 'bg-white text-[#2F6FED] shadow-xs' : 'text-[#626784]'
              }`}
            >
              Interactive Graph
            </button>
            <button
              onClick={() => setViewMode('roadmap')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'roadmap' ? 'bg-white text-[#2F6FED] shadow-xs' : 'text-[#626784]'
              }`}
            >
              Phased Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: Interactive Graph & Phased Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* INTERACTIVE DEPENDENCY GRAPH */}
        {(viewMode === 'both' || viewMode === 'graph') && (
          <div
            className={`bg-white rounded-3xl border border-[#E6E8F2] shadow-card p-5 relative overflow-hidden ${
              viewMode === 'graph' ? 'lg:col-span-12' : 'lg:col-span-7'
            }`}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6E8F2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#2F6FED] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">hub</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E2238]">Skill Prerequisite DAG</h3>
                  <p className="text-[11px] text-[#8B90A7]">Click any node to inspect dependencies</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-medium">
                <span className="flex items-center gap-1.5 text-[#16A34A]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Mastered
                </span>
                <span className="flex items-center gap-1.5 text-[#2F6FED]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2F6FED]" /> Ready Now
                </span>
                <span className="flex items-center gap-1.5 text-[#EA580C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Blocked
                </span>
              </div>
            </div>

            {/* Column Headers for Graph Layers */}
            <div className="grid grid-cols-3 gap-2 px-6 py-2 mb-2 bg-[#F8F9FD] rounded-xl text-[11px] font-bold text-[#626784] uppercase tracking-wider">
              <span>Prerequisites</span>
              <span>→ Dependent skills</span>
              <span>Scroll to explore</span>
            </div>

            {/* Interactive SVG & HTML Node Canvas */}
            <div className="relative w-full h-[540px] overflow-auto custom-scroll bg-[#FAFBFF] rounded-2xl border border-[#E6E8F2]/60 p-4">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ minWidth: `${nodeLayout.width}px`, minHeight: `${nodeLayout.maxRows * 75 + 100}px` }}
              >
                <defs>
                  <marker
                    id="arrow-default"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#CBD5E1" />
                  </marker>
                  <marker
                    id="arrow-active"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#2F6FED" />
                  </marker>
                </defs>

                {/* Render Directed Edges */}
                {edges.map((edge) => {
                  const s = nodeLayout.coords[edge.source]
                  const t = nodeLayout.coords[edge.target]
                  if (!s || !t) return null

                  const isHighlighted =
                    selectedNodeId === edge.source || selectedNodeId === edge.target
                  const strokeColor = isHighlighted
                    ? '#2F6FED'
                    : edge.sourceCompleted
                    ? '#10B981'
                    : '#CBD5E1'
                  const strokeWidth = isHighlighted ? 2.5 : 1.5

                  // Bezier curve
                  const dx = t.x - s.x
                  const p1x = s.x + dx * 0.5
                  const p1y = s.y
                  const p2x = s.x + dx * 0.5
                  const p2y = t.y

                  return (
                    <path
                      key={edge.id}
                      d={`M ${s.x + 90} ${s.y + 18} C ${p1x} ${p1y + 18}, ${p2x} ${p2y + 18}, ${t.x} ${t.y + 18}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={edge.sourceCompleted ? 'none' : '4 3'}
                      markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                      className="transition-all duration-300"
                    />
                  )
                })}
              </svg>

              {/* Render Graph Nodes */}
              <div
                className="relative"
                style={{ minWidth: `${nodeLayout.width}px`, minHeight: `${nodeLayout.maxRows * 75 + 100}px` }}
              >
                {nodes.map((node) => {
                  const coord = nodeLayout.coords[node.id]
                  if (!coord) return null

                  const colors = getNodeColor(node.status)
                  const isSelected = selectedNodeId === node.id
                  const isPrereqOfSelected = selectedPrereqs.includes(node.id)
                  const isDependentOfSelected = selectedDependents.includes(node.id)

                  return (
                    <div
                      key={node.id}
                      role="button" tabIndex={0} aria-label={`Inspect ${node.label} dependencies`}
                      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedNodeId(isSelected ? null : node.id) } }}
                      onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                      className={`cursor-pointer select-none rounded-xl p-2.5 transition-all duration-200 border ${
                        isSelected
                          ? 'ring-2 ring-[#2F6FED] shadow-lg scale-105 z-20'
                          : isPrereqOfSelected
                          ? 'ring-2 ring-[#10B981]/60 shadow-md z-10'
                          : isDependentOfSelected
                          ? 'ring-2 ring-[#7C5CFC]/60 shadow-md z-10'
                          : 'hover:shadow-md hover:scale-[1.02] z-0'
                      }`}
                      style={{
                        position: 'absolute',
                        left: `${coord.x}px`,
                        top: `${coord.y}px`,
                        width: '210px',
                        backgroundColor: colors.bg,
                        borderColor: colors.border
                      }}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#626784] truncate">
                          {node.category}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: colors.dot }}
                          title={node.status}
                        />
                      </div>

                      <div className="font-bold text-xs text-[#1E2238] truncate" title={node.label}>
                        {node.label}
                      </div>

                      <div className="flex items-center justify-between mt-1 text-[10px] text-[#626784]">
                        <span>{node.difficulty}</span>
                        <span className="font-semibold text-[#1E2238]">{node.hours}h</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Node Floating Drawer */}
            {selectedNode && (
              <div className="mt-4 p-4 rounded-2xl bg-[#F0EEFE] border border-[#2F6FED]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1E2238]">{selectedNode.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedNode.status === 'COMPLETED'
                          ? 'bg-[#ECFDF5] text-[#16A34A]'
                          : selectedNode.status === 'READY'
                          ? 'bg-[#EEF2FF] text-[#2F6FED]'
                          : 'bg-[#FFF7ED] text-[#EA580C]'
                      }`}
                    >
                      {selectedNode.status === 'COMPLETED'
                        ? 'Mastered'
                        : selectedNode.status === 'READY'
                        ? 'Ready to Learn'
                        : 'Blocked by Prerequisites'}
                    </span>
                    <span className="text-xs text-[#626784]">• {selectedNode.hours} hrs</span>
                  </div>

                  <p className="text-xs text-[#424654]">
                    {selectedPrereqs.length > 0 ? (
                      <span>
                        Prerequisites:{' '}
                        <strong className="text-[#1E2238]">
                          {selectedPrereqs.map((pid) => nodes.find((n) => n.id === pid)?.label || pid).join(', ')}
                        </strong>
                      </span>
                    ) : (
                      'Baseline foundational skill (no prerequisites).'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => onToggleSkill(selectedNode.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                      selectedNode.status === 'COMPLETED'
                        ? 'bg-white text-[#EA580C] border border-[#EA580C]/30 hover:bg-[#FFF7ED]'
                        : 'bg-[#2F6FED] text-white hover:bg-[#255CD0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {selectedNode.status === 'COMPLETED' ? 'undo' : 'check_circle'}
                    </span>
                    <span>
                      {selectedNode.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark as Mastered'}
                    </span>
                  </button>

                  <button
                    onClick={() => onViewResources(selectedNode.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#2F6FED] border border-[#2F6FED]/30 hover:bg-[#EEF2FF] transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">library_books</span>
                    <span>Curated Resources</span>
                  </button>

                  <button
                    onClick={() => onSelectSkillForCoach(selectedNode.label)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#7C5CFC] border border-[#7C5CFC]/30 hover:bg-[#F2EFFF] transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">smart_toy</span>
                    <span>Ask Coach</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHASED PEDAGOGICAL ROADMAP */}
        {(viewMode === 'both' || viewMode === 'roadmap') && (
          <div
            className={`flex flex-col gap-4 ${
              viewMode === 'roadmap' ? 'lg:col-span-12' : 'lg:col-span-5'
            }`}
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-base text-[#1E2238] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#2F6FED]">timeline</span>
                Phased Learning Roadmap
              </h3>
              <span className="text-xs text-[#8B90A7]">{phases.length} Learning Phases</span>
            </div>

            {phases.map((phase) => (
              <div
                key={phase.phaseNumber}
                className="bg-white rounded-3xl border border-[#E6E8F2] shadow-card p-5 flex flex-col gap-3"
              >
                {/* Phase Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E6E8F2]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#F0EEFE] text-[#2F6FED] flex items-center justify-center font-bold text-xs">
                      P{phase.phaseNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1E2238]">{phase.title}</h4>
                      <p className="text-[10px] text-[#8B90A7]">{phase.description}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#626784]">
                    {phase.skills.filter((s) => s.status === 'COMPLETED').length}/{phase.skills.length} done
                  </span>
                </div>

                {/* Skills List in Phase */}
                <div className="flex flex-col gap-2">
                  {phase.skills.map((skill) => {
                    const isCompleted = skill.status === 'COMPLETED'
                    const isReady = skill.status === 'READY'
                    return (
                      <div
                        key={skill.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isCompleted
                            ? 'bg-[#F8FDF9] border-[#10B981]/20'
                            : isReady
                            ? 'bg-white border-[#2F6FED]/30 hover:border-[#2F6FED]'
                            : 'bg-[#FFFDFB] border-[#F59E0B]/20'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <button
                            onClick={() => onToggleSkill(skill.id)}
                            className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-[#10B981] text-white shadow-xs'
                                : 'border-2 border-[#CBD5E1] hover:border-[#2F6FED]'
                            }`}
                            title={isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                          >
                            {isCompleted && (
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            )}
                          </button>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs font-bold truncate ${
                                  isCompleted ? 'line-through text-[#626784]' : 'text-[#1E2238]'
                                }`}
                              >
                                {skill.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#F4F5FB] text-[#626784]">
                                {skill.estimatedHours}h
                              </span>
                            </div>

                            {skill.missingPrerequisites.length > 0 && !isCompleted && (
                              <div className="text-[10px] text-[#EA580C] font-medium flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[12px]">lock</span>
                                <span>Prereq: {skill.missingPrerequisites.map((p) => p.name).join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Direct Resource CTA */}
                        <button
                          onClick={() => onViewResources(skill.id)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#2F6FED] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-all shrink-0"
                          title="View curated learning links"
                        >
                          Resources
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
