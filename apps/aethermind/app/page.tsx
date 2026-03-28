'use client'

import { useEffect, useState } from 'react'
import { DemoRealm } from '@/src/components/demo-realm'
import { requestNarrativeReasoning } from '@/src/lib/reasoning-edge'
import { useNarrativeTimelineStore } from '@/src/stores/narrative-timeline-store'
import { useWorldModelStore } from '@/src/stores/world-model-store'
import { useAgenticCompanionStore } from '@/src/systems/AgenticCompanionSystem'
import { narrativeEffectLabel } from '@/src/systems/NarrativeCSGReactor'

function VariableBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-violet-300/80">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function Home() {
  const [draft, setDraft] = useState('')
  const [edgeBusy, setEdgeBusy] = useState(false)
  const [edgeNote, setEdgeNote] = useState<string | null>(null)

  const companionLine = useAgenticCompanionStore((s) => s.companionLine)
  const lastThought = useAgenticCompanionStore((s) => s.lastThought)
  const forkCount = useAgenticCompanionStore((s) => s.forkCount)
  const mood = useAgenticCompanionStore((s) => s.agent.emotionalState.moodLabel)
  const pushUserUtterance = useAgenticCompanionStore((s) => s.pushUserUtterance)
  const forkMoment = useAgenticCompanionStore((s) => s.forkMoment)

  const narrativeStrength = useNarrativeTimelineStore((s) => s.narrativeStrength)
  const simulationPhase = useNarrativeTimelineStore((s) => s.simulationPhase)
  const timeScale = useNarrativeTimelineStore((s) => s.timeScale)
  const forks = useNarrativeTimelineStore((s) => s.forks)
  const activeForkIndex = useNarrativeTimelineStore((s) => s.activeForkIndex)
  const setNarrativeStrength = useNarrativeTimelineStore((s) => s.setNarrativeStrength)
  const setSimulationPhase = useNarrativeTimelineStore((s) => s.setSimulationPhase)
  const setTimeScale = useNarrativeTimelineStore((s) => s.setTimeScale)
  const addTimelineFork = useNarrativeTimelineStore((s) => s.addFork)
  const selectFork = useNarrativeTimelineStore((s) => s.selectFork)

  const snapshot = useWorldModelStore((s) => s.snapshot)

  // biome-ignore lint/correctness/useExhaustiveDependencies: refresh when timeline inputs change
  useEffect(() => {
    useWorldModelStore.getState().refreshFromTimeline()
  }, [simulationPhase, timeScale, activeForkIndex])

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),_transparent_55%)]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:px-8">
        <header className="flex flex-col gap-4 text-center md:text-left">
          <p className="text-sm tracking-[0.2em] text-violet-300/80 uppercase">AetherMind</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Your mind is now a world.
            <span className="block bg-gradient-to-r from-violet-200 via-fuchsia-200 to-violet-400 bg-clip-text text-transparent">
              Step inside. Let it evolve with you.
            </span>
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-violet-200/75">
            A browser-native holodeck: serene realms, emotionally aware companions, and forkable
            timelines — built on the Pascal stack (
            <code className="text-violet-300">@pascal-app/core</code>,{' '}
            <code className="text-violet-300">@pascal-app/viewer</code>) with WebGPU-first
            rendering.
          </p>
        </header>

        <DemoRealm />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h2 className="mb-4 text-sm font-medium tracking-wide text-violet-200/90 uppercase">
            Timeline & narrative CSG
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs text-violet-300/80" htmlFor="phase">
                  Simulation scrub (void wobble; CSG updates debounced ~140ms)
                </label>
                <input
                  className="w-full accent-violet-500"
                  id="phase"
                  max={1}
                  min={0}
                  onChange={(e) => setSimulationPhase(Number(e.target.value))}
                  step={0.01}
                  type="range"
                  value={simulationPhase}
                />
                <p className="mt-1 text-xs text-violet-500/70">
                  Phase: {simulationPhase.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs text-violet-300/80" htmlFor="strength">
                  Narrative strength (boolean carve depth)
                </label>
                <input
                  className="w-full accent-fuchsia-500"
                  id="strength"
                  max={1}
                  min={0}
                  onChange={(e) => setNarrativeStrength(Number(e.target.value))}
                  step={0.01}
                  type="range"
                  value={narrativeStrength}
                />
                <p className="mt-1 text-xs text-violet-400/80">
                  {narrativeEffectLabel(narrativeStrength)}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs text-violet-300/80" htmlFor="timescale">
                  Accelerated time (display · demo)
                </label>
                <select
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-violet-100"
                  id="timescale"
                  onChange={(e) => setTimeScale(Number(e.target.value))}
                  value={timeScale}
                >
                  <option value={1}>1×</option>
                  <option value={10}>10×</option>
                  <option value={100}>100×</option>
                  <option value={1000}>1000×</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-violet-300/80 uppercase">Branches</p>
              <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto text-sm">
                {forks.map((f, i) => (
                  <li key={f.id}>
                    <button
                      className={`w-full rounded-lg px-3 py-2 text-left transition ${
                        i === activeForkIndex
                          ? 'bg-violet-500/25 text-white ring-1 ring-violet-400/50'
                          : 'bg-black/20 text-violet-200/80 hover:bg-white/5'
                      }`}
                      onClick={() => selectFork(i)}
                      type="button"
                    >
                      {f.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 border-violet-500/20 border-t pt-6">
            <h3 className="mb-3 text-xs font-medium tracking-wide text-violet-200/90 uppercase">
              World model (simulator stub)
            </h3>
            <p className="mb-4 text-xs text-violet-400/70">
              {snapshot.eraLabel} · span {snapshot.simulatedSpan} (demo units) · fork #
              {activeForkIndex}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <VariableBar label="Wealth" value={snapshot.variables.wealth} />
              <VariableBar label="Health" value={snapshot.variables.health} />
              <VariableBar label="Climate" value={snapshot.variables.climate} />
              <VariableBar label="Relationships" value={snapshot.variables.relationships} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium tracking-wide text-violet-200/90 uppercase">
              Companion
            </h2>
            <p className="text-sm text-violet-100/85 leading-relaxed">{companionLine}</p>
            <p className="text-xs text-violet-400/70">Mood: {mood}</p>
            {lastThought ? (
              <p className="border-violet-500/20 border-l-2 pl-3 text-xs text-violet-300/60 italic">
                Inner trace: {lastThought}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-violet-200/90" htmlFor="say">
              Speak to the realm
            </label>
            <textarea
              className="min-h-[88px] resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-violet-50 outline-none ring-violet-400/30 placeholder:text-violet-500/50 focus:ring-2"
              id="say"
              onChange={(e) => setDraft(e.target.value)}
              placeholder="A feeling, a memory, a what-if…"
              value={draft}
            />
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-400"
                onClick={() => {
                  pushUserUtterance(draft)
                  setDraft('')
                  setEdgeNote(null)
                }}
                type="button"
              >
                Send
              </button>
              <button
                className="rounded-full border border-fuchsia-400/50 px-4 py-2 text-sm font-medium text-fuchsia-100 transition hover:border-fuchsia-300 hover:bg-fuchsia-500/10 disabled:opacity-50"
                disabled={edgeBusy || !draft.trim()}
                onClick={async () => {
                  setEdgeBusy(true)
                  setEdgeNote(null)
                  const out = await requestNarrativeReasoning(draft)
                  setEdgeBusy(false)
                  if (out) {
                    pushUserUtterance(`[Edge] ${out.text}`)
                    setEdgeNote(null)
                    setDraft('')
                  } else {
                    setEdgeNote(
                      process.env.NEXT_PUBLIC_AETHERMIND_EDGE_URL
                        ? 'Edge returned nothing or failed.'
                        : 'Set NEXT_PUBLIC_AETHERMIND_EDGE_URL (see .env.example).',
                    )
                  }
                }}
                type="button"
              >
                {edgeBusy ? 'Reasoning…' : 'Reason (edge)'}
              </button>
              <button
                className="rounded-full border border-violet-400/40 px-4 py-2 text-sm font-medium text-violet-100 transition hover:border-violet-300 hover:bg-violet-500/10"
                onClick={() => {
                  forkMoment()
                  addTimelineFork()
                }}
                type="button"
              >
                Fork this moment
              </button>
            </div>
            {edgeNote ? <p className="text-xs text-amber-300/90">{edgeNote}</p> : null}
            <p className="text-xs text-violet-400/60">Companion fork count (demo): {forkCount}</p>
          </div>
        </section>

        <footer className="text-center text-xs text-violet-500/60">
          Pattern research & creative tool — not therapy or medical advice. Early build; WebGPU
          requires a supported browser.
        </footer>
      </div>
    </main>
  )
}
