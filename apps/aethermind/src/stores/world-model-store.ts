import { create } from 'zustand'
import { useNarrativeTimelineStore } from '@/src/stores/narrative-timeline-store'
import { computeWorldSnapshot, type WorldSnapshot } from '@/src/systems/WorldModelSimulator'

type WorldModelState = {
  snapshot: WorldSnapshot
  refreshFromTimeline: () => void
}

export const useWorldModelStore = create<WorldModelState>((set) => ({
  snapshot: computeWorldSnapshot({ phase: 0, timeScale: 1, forkIndex: 0 }),

  refreshFromTimeline: () => {
    const nt = useNarrativeTimelineStore.getState()
    set({
      snapshot: computeWorldSnapshot({
        phase: nt.simulationPhase,
        timeScale: nt.timeScale,
        forkIndex: nt.activeForkIndex,
      }),
    })
  },
}))
