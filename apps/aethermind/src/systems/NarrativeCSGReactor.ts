/**
 * NarrativeCSGReactor — story weight drives boolean mesh operations (spec: NarrativeCSGReactor).
 * Higher narrative strength → larger / deeper “voids” carved from base volumes (metaphor for plot impact).
 */

export function clampNarrativeStrength(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, value))
}

/** Maps 0–1 narrative strength to subtractive sphere radius (world units) for the demo monolith. */
export function voidRadiusForNarrativeStrength(strength: number): number {
  const s = clampNarrativeStrength(strength)
  return 0.32 + s * 0.92
}

/** How far the void shifts with narrative pull (asymmetric “tear”). */
export function voidOffsetForNarrativeStrength(strength: number): [number, number, number] {
  const s = clampNarrativeStrength(strength)
  return [0.25 + s * 0.55, 0.35 + s * 0.25, s * 0.15]
}

export function narrativeEffectLabel(strength: number): string {
  const s = clampNarrativeStrength(strength)
  if (s < 0.2) return 'Quiet — geometry barely stirred'
  if (s < 0.45) return 'Ripple — small narrative shift visible'
  if (s < 0.72) return 'Surge — structure yields to the story'
  return 'Cataclysm (demo) — heavy boolean carve'
}
