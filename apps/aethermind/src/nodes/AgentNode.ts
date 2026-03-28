/**
 * AetherMind domain model — autonomous agents inside a Living Realm.
 * Distinct from Pascal building schema; may later bridge to shared stores.
 */

export type AgentPersonality = {
  openness: number
  conscientiousness: number
  warmth: number
  curiosity: number
}

export type EmotionalState = {
  valence: number
  arousal: number
  moodLabel: string
}

export type AgentGoal = {
  id: string
  description: string
  priority: number
  confidence: number
}

export type MemoryEntry = {
  id: string
  at: number
  summary: string
  embeddingKey?: string
}

export type AgentNode = {
  id: string
  realmId: string
  forkId: string
  personality: AgentPersonality
  longTermMemory: MemoryEntry[]
  shortTermContext: string[]
  emotionalState: EmotionalState
  goals: AgentGoal[]
  visualMeshHint?: string
}

export function createDefaultAgentNode(realmId: string, forkId: string): AgentNode {
  const id = `agent_${Math.random().toString(36).slice(2, 10)}`
  return {
    id,
    realmId,
    forkId,
    personality: {
      openness: 0.72,
      conscientiousness: 0.55,
      warmth: 0.8,
      curiosity: 0.68,
    },
    longTermMemory: [
      {
        id: 'mem_seed',
        at: Date.now(),
        summary: 'First meeting in the demo realm — welcoming presence.',
      },
    ],
    shortTermContext: [],
    emotionalState: {
      valence: 0.35,
      arousal: 0.2,
      moodLabel: 'serene',
    },
    goals: [
      {
        id: 'goal_listen',
        description: 'Offer gentle reflection without pushing the user.',
        priority: 1,
        confidence: 0.9,
      },
      {
        id: 'goal_fork_hint',
        description: 'When tension rises, suggest exploring a kinder fork.',
        priority: 2,
        confidence: 0.5,
      },
    ],
    visualMeshHint: 'companion-orb',
  }
}
