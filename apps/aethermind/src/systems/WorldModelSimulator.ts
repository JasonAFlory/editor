/**
 * WorldModelSimulator — stub for agentic physics + narrative evolution (spec).
 * Deterministic demo: variables derived from timeline phase, time scale, and active fork.
 */

export type WorldSimulationVariables = {
  wealth: number
  health: number
  climate: number
  relationships: number
}

export type WorldSnapshot = {
  variables: WorldSimulationVariables
  /** Human-readable era for UI */
  eraLabel: string
  /** Abstract “years advanced” in demo units */
  simulatedSpan: number
}

function fract(n: number) {
  return n - Math.floor(n)
}

function smooth01(n: number) {
  return 0.5 + 0.5 * Math.sin(n * Math.PI * 2)
}

/**
 * Pure, deterministic snapshot — replace later with real simulation + world models.
 */
export function computeWorldSnapshot(params: {
  phase: number
  timeScale: number
  forkIndex: number
}): WorldSnapshot {
  const { phase, timeScale, forkIndex } = params
  const p = Math.min(1, Math.max(0, phase))
  const ts = Math.min(1000, Math.max(1, timeScale))
  const f = Math.max(0, forkIndex)

  const t = p * Math.log10(ts + 1) * 0.35 + f * 0.17

  const wealth = smooth01(t * 1.1 + f * 0.08)
  const health = smooth01(t * 0.9 + 0.3)
  const climate = smooth01(t * 0.7 + p * 1.4 + f * 0.05)
  const relationships = smooth01(t * 1.05 + fract(p * 3.7) * 0.4)

  const span = p * ts * (1 + f * 0.12)

  let eraLabel = 'Present-adjacent'
  if (span > 80) eraLabel = 'Far horizon'
  else if (span > 25) eraLabel = 'Mid arc'
  else if (span > 8) eraLabel = 'Near future'

  return {
    variables: {
      wealth: Math.min(1, Math.max(0, wealth)),
      health: Math.min(1, Math.max(0, health)),
      climate: Math.min(1, Math.max(0, climate)),
      relationships: Math.min(1, Math.max(0, relationships)),
    },
    eraLabel,
    simulatedSpan: Math.round(span * 10) / 10,
  }
}
