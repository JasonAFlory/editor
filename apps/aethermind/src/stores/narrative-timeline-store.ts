import { create } from 'zustand'
import { clampNarrativeStrength } from '@/src/systems/NarrativeCSGReactor'

export type TimelineFork = {
  id: string
  label: string
  createdAt: number
}

type NarrativeTimelineState = {
  narrativeStrength: number
  simulationPhase: number
  timeScale: number
  forks: TimelineFork[]
  activeForkIndex: number
  setNarrativeStrength: (value: number) => void
  setSimulationPhase: (value: number) => void
  setTimeScale: (value: number) => void
  addFork: (label?: string) => void
  selectFork: (index: number) => void
}

let forkSeq = 0

export const useNarrativeTimelineStore = create<NarrativeTimelineState>((set, get) => ({
  narrativeStrength: 0.38,
  simulationPhase: 0,
  timeScale: 1,
  forks: [{ id: 'fork_root', label: 'Root thread', createdAt: Date.now() }],
  activeForkIndex: 0,

  setNarrativeStrength: (value) => set({ narrativeStrength: clampNarrativeStrength(value) }),

  setSimulationPhase: (value) =>
    set({ simulationPhase: Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) }),

  setTimeScale: (value) => {
    const v = Math.min(1000, Math.max(1, Math.round(Number(value)) || 1))
    set({ timeScale: v })
  },

  addFork: (label) => {
    forkSeq += 1
    const id = `fork_${forkSeq}`
    const next: TimelineFork = {
      id,
      label: label?.trim() || `Branch ${forkSeq}`,
      createdAt: Date.now(),
    }
    set((s) => ({
      forks: [...s.forks, next],
      activeForkIndex: s.forks.length,
    }))
  },

  selectFork: (index) => {
    const { forks } = get()
    if (index >= 0 && index < forks.length) set({ activeForkIndex: index })
  },
}))
