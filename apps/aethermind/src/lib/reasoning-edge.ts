/**
 * Optional edge reasoning hook — wire to Supabase Edge / Gemini / Claude later.
 * Set NEXT_PUBLIC_AETHERMIND_EDGE_URL to a POST endpoint that accepts { prompt } and returns { text }.
 */

export type ReasoningResponse = {
  text: string
}

export async function requestNarrativeReasoning(prompt: string): Promise<ReasoningResponse | null> {
  const trimmed = prompt.trim()
  if (!trimmed) return null

  const url = process.env.NEXT_PUBLIC_AETHERMIND_EDGE_URL
  if (!url) return null

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmed }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { text?: string }
    if (typeof data.text !== 'string' || !data.text.trim()) return null
    return { text: data.text.trim() }
  } catch {
    return null
  }
}
