'use client'

import { OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { ACESFilmicToneMapping, PCFSoftShadowMap, WebGLRenderer } from 'three'
import * as THREE from 'three/webgpu'
import { NarrativeMonolith } from '@/src/components/narrative-monolith'
import {
  AgenticCompanionSystem,
  useAgenticCompanionStore,
} from '@/src/systems/AgenticCompanionSystem'

extend(THREE as unknown as Parameters<typeof extend>[0])

function createRenderer(canvasProps: object) {
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    try {
      const r = new THREE.WebGPURenderer(canvasProps)
      r.toneMapping = THREE.ACESFilmicToneMapping
      r.toneMappingExposure = 0.95
      return r
    } catch {
      // WebGPU advertised but failed (drivers, flags, etc.)
    }
  }
  const gl = new WebGLRenderer(canvasProps)
  gl.toneMapping = ACESFilmicToneMapping
  gl.toneMappingExposure = 0.95
  return gl
}

function CompanionOrb() {
  const ref = useRef<THREE.Mesh>(null)
  const emotionalState = useAgenticCompanionStore((s) => s.agent.emotionalState)

  const color = useMemo(() => {
    const c = new THREE.Color()
    const t = (emotionalState.valence + 1) / 2
    c.setHSL(
      0.72 + t * 0.08,
      0.45 + emotionalState.arousal * 0.25,
      0.55 + emotionalState.valence * 0.08,
    )
    return c
  }, [emotionalState.valence, emotionalState.arousal])

  useFrame((_, delta) => {
    const m = ref.current
    if (!m) return
    m.rotation.y += delta * 0.35
    const pulse = 1 + Math.sin(performance.now() * 0.002) * 0.04 + emotionalState.arousal * 0.06
    m.scale.setScalar(pulse)
  })

  return (
    <mesh ref={ref} castShadow position={[0, 1.35, 0]}>
      <icosahedronGeometry args={[0.55, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.55}
        metalness={0.2}
        roughness={0.35}
      />
    </mesh>
  )
}

function RealmFloor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleGeometry args={[14, 64]} />
      <meshStandardMaterial color="#1a1428" metalness={0.05} roughness={0.92} />
    </mesh>
  )
}

export function DemoRealm() {
  return (
    <div className="h-[min(72vh,560px)] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0814] shadow-[0_0_80px_rgba(168,140,255,0.12)]">
      <Canvas
        camera={{ position: [6, 4, 8], fov: 45 }}
        className="h-full w-full"
        dpr={[1, 2]}
        gl={(props) => createRenderer(props as object)}
        shadows={{ enabled: true, type: PCFSoftShadowMap }}
      >
        <color args={['#0c0814']} attach="background" />
        <fog args={['#0c0814', 12, 38]} attach="fog" />

        <ambientLight intensity={0.35} />
        <directionalLight
          castShadow
          intensity={1.1}
          position={[8, 14, 6]}
          shadow-camera-far={40}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight color="#c4b5fd" intensity={1.2} position={[-4, 5, 2]} />

        <RealmFloor />
        <NarrativeMonolith />
        <CompanionOrb />
        <Sparkles count={160} noise={1.2} opacity={0.55} scale={16} size={2} speed={0.22} />
        <AgenticCompanionSystem />
        <OrbitControls
          enablePan
          maxPolarAngle={Math.PI / 2 - 0.08}
          maxDistance={22}
          minDistance={4}
        />
      </Canvas>
    </div>
  )
}
