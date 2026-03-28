'use client'

import { useState } from 'react'
import { DemoRealm } from '@/src/components/demo-realm'
import { useAgenticCompanionStore } from '@/src/systems/AgenticCompanionSystem'

export default function Home() {
  const [draft, setDraft] = useState('')
  const companionLine = useAgenticCompanionStore((s) => s.companionLine)
  const lastThought = useAgenticCompanionStore((s) => s.lastThought)
  const forkCount = useAgenticCompanionStore((s) => s.forkCount)
  const mood = useAgenticCompanionStore((s) => s.agent.emotionalState.moodLabel)
  const pushUserUtterance = useAgenticCompanionStore((s) => s.pushUserUtterance)
  const forkMoment = useAgenticCompanionStore((s) => s.forkMoment)

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
            A browser-native holodeck: serene realms, emotionally aware companions, and forkable timelines — built on
            the Pascal stack (<code className="text-violet-300">@pascal-app/core</code>,{' '}
            <code className="text-violet-300">@pascal-app/viewer</code>) with WebGPU-first rendering.
          </p>
        </header>

        <DemoRealm />

        <section className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium tracking-wide text-violet-200/90 uppercase">Companion</h2>
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
                }}
                type="button"
              >
                Send
              </button>
              <button
                className="rounded-full border border-violet-400/40 px-4 py-2 text-sm font-medium text-violet-100 transition hover:border-violet-300 hover:bg-violet-500/10"
                onClick={() => forkMoment()}
                type="button"
              >
                Fork this moment
              </button>
            </div>
            <p className="text-xs text-violet-400/60">Active timeline forks (demo): {forkCount}</p>
          </div>
        </section>

        <footer className="text-center text-xs text-violet-500/60">
          Pattern research & creative tool — not therapy or medical advice. Early build; WebGPU requires a supported
          browser.
        </footer>
      </div>
    </main>
  )
}
