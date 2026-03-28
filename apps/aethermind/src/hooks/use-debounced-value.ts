import { useEffect, useState } from 'react'

/**
 * Debounces fast-changing values (e.g. range slider) so heavy work (CSG) does not run every frame.
 */
export function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(id)
  }, [value, ms])

  return debounced
}
