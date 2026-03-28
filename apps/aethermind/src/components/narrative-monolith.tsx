'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { BoxGeometry, SphereGeometry } from 'three'
import type * as THREE from 'three/webgpu'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'
import { useDebouncedValue } from '@/src/hooks/use-debounced-value'
import { useNarrativeTimelineStore } from '@/src/stores/narrative-timeline-store'
import {
  voidOffsetForNarrativeStrength,
  voidRadiusForNarrativeStrength,
} from '@/src/systems/NarrativeCSGReactor'

/**
 * Demo mesh: boolean subtract driven by narrative strength + timeline scrub (NarrativeCSGReactor).
 */
export function NarrativeMonolith() {
  const meshRef = useRef<THREE.Mesh>(null)
  const narrativeStrength = useNarrativeTimelineStore((s) => s.narrativeStrength)
  const simulationPhase = useNarrativeTimelineStore((s) => s.simulationPhase)
  const debouncedPhase = useDebouncedValue(simulationPhase, 140)
  const debouncedStrength = useDebouncedValue(narrativeStrength, 100)

  const geometry = useMemo(() => {
    const radius = voidRadiusForNarrativeStrength(debouncedStrength)
    const [ox, oy, oz] = voidOffsetForNarrativeStrength(debouncedStrength)
    const wobble = Math.sin(debouncedPhase * Math.PI * 2) * 0.22 * debouncedStrength
    const evaluator = new Evaluator()
    const box = new Brush(new BoxGeometry(1.15, 2.05, 1.15))
    const sphere = new Brush(new SphereGeometry(radius, 32, 32))
    sphere.position.set(ox + wobble, oy, oz)
    sphere.updateMatrixWorld()
    const result = evaluator.evaluate(box, sphere, SUBTRACTION)
    box.geometry.dispose()
    sphere.geometry.dispose()
    return result.geometry
  }, [debouncedStrength, debouncedPhase])

  useEffect(() => {
    return () => geometry.dispose()
  }, [geometry])

  useFrame((_, delta) => {
    const m = meshRef.current
    if (!m) return
    m.rotation.y += delta * 0.12 * (0.5 + debouncedStrength)
  })

  return (
    <mesh ref={meshRef} castShadow geometry={geometry} position={[-2.85, 1.05, 0]} receiveShadow>
      <meshStandardMaterial
        color="#8b7bc8"
        emissive="#4c1d95"
        emissiveIntensity={0.12 + debouncedStrength * 0.35}
        metalness={0.18}
        roughness={0.42}
      />
    </mesh>
  )
}
