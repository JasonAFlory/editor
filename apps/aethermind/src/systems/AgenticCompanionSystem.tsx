'use client'

import { useFrame } from '@react-three/fiber'
import { useCallback, useRef } from 'react'
import { create } from 'zustand'
import {
  type AgentNode,
  createDefaultAgentNode,
  type EmotionalState,
} from '../nodes/AgentNode'

const EVOLVE_MS = 900

type CompanionStore = {
  agent: AgentNode
  lastThought: string
  forkCount: number
  companionLine: string
  pushUserUtterance: (text: string) => void
  forkMoment: () => void
  /** Subtle emotional drift only — keeps FPS headroom */
  evolveEmotion: () => void
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n))
}

function blendEmotion(prev: EmotionalState, valenceDelta: number, arousalDelta: number): EmotionalState {
  const valence = clamp(prev.valence + valenceDelta, -1, 1)
  const arousal = clamp(prev.arousal + arousalDelta, 0, 1)
  let moodLabel = 'reflective'
  if (valence > 0.4 && arousal < 0.35) moodLabel = 'serene'
  else if (valence < -0.2) moodLabel = 'heavy'
  else if (arousal > 0.55) moodLabel = 'alert'
  return { valence, arousal, moodLabel }
}

function dialogueForAgent(agent: AgentNode): { thought: string; line: string } {
  const recent = agent.shortTermContext.at(-1) ?? ''
  let thought = 'Resting attention on the realm; waiting for you.'
  let line =
    'I’m here in the quiet with you. When you’re ready, we can fork a gentler version of this moment.'

  if (recent) {
    thought = `User said: "${recent.slice(0, 80)}${recent.length > 80 ? '…' : ''}"`
    if (agent.emotionalState.moodLabel === 'heavy') {
      line =
        'That sounds like it weighs on you. We could fork this scene so the outcome leans kinder—only if you want.'
    } else if (agent.emotionalState.moodLabel === 'alert') {
      line =
        'There’s a lot of energy in that. Want to slow the timeline and walk it step by step?'
    } else {
      line =
        'Thank you for sharing that. I’ll hold it lightly. Tell me what “better” would feel like here.'
    }
  }

  const topGoal = [...agent.goals].sort((a, b) => a.priority - b.priority)[0]
  if (topGoal?.id === 'goal_fork_hint' && agent.emotionalState.valence < -0.15) {
    line = `${line} (Hint: **Fork this moment** is here when you want a parallel thread.)`
  }

  return { thought, line }
}

export const useAgenticCompanionStore = create<CompanionStore>((set, get) => ({
  agent: createDefaultAgentNode('realm_demo', 'fork_root'),
  lastThought: '',
  forkCount: 0,
  companionLine:
    'I’m here in the quiet with you. When you’re ready, we can fork a gentler version of this moment.',

  pushUserUtterance: (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    set((s) => {
      const nextCtx = [...s.agent.shortTermContext, trimmed].slice(-12)
      const lower = trimmed.toLowerCase()
      let deltaV = 0.05
      let deltaA = 0.04
      if (/(sad|tired|afraid|angry|lost)/i.test(lower)) {
        deltaV = -0.12
        deltaA = 0.08
      }
      if (/(hope|calm|grateful|love)/i.test(lower)) {
        deltaV = 0.14
        deltaA = -0.05
      }
      const agent: AgentNode = {
        ...s.agent,
        shortTermContext: nextCtx,
        emotionalState: blendEmotion(s.agent.emotionalState, deltaV, deltaA),
      }
      const { thought, line } = dialogueForAgent(agent)
      return { agent, lastThought: thought, companionLine: line }
    })
  },

  forkMoment: () => {
    set((s) => {
      const forkCount = s.forkCount + 1
      const agent: AgentNode = {
        ...s.agent,
        forkId: `fork_${forkCount}`,
        emotionalState: blendEmotion(s.agent.emotionalState, 0.08, -0.06),
      }
      const { thought, line } = dialogueForAgent(agent)
      return {
        forkCount,
        agent,
        lastThought: thought,
        companionLine: `${line} — **Fork ${forkCount}** spun up; same you, softer physics on this branch.`,
      }
    })
  },

  evolveEmotion: () => {
    set((s) => ({
      agent: {
        ...s.agent,
        emotionalState: blendEmotion(
          s.agent.emotionalState,
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.03,
        ),
      },
    }))
  },
}))

/**
 * R3F system: low-frequency evolution so the companion feels “alive” without starving the frame budget.
 */
export function AgenticCompanionSystem() {
  const acc = useRef(0)
  const evolveEmotion = useAgenticCompanionStore((s) => s.evolveEmotion)
  const runEvolve = useCallback(() => {
    evolveEmotion()
  }, [evolveEmotion])

  useFrame((_, delta) => {
    acc.current += delta * 1000
    if (acc.current >= EVOLVE_MS) {
      acc.current %= EVOLVE_MS
      runEvolve()
    }
  })

  return null
}
