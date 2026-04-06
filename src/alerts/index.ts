import type { FormistryEvents } from '../types/contracts'

type EventName = keyof FormistryEvents
type Listener<K extends EventName> = (payload: FormistryEvents[K]) => void

interface EventBus {
  on: <K extends EventName>(event: K, handler: Listener<K>) => () => void
  emit: <K extends EventName>(event: K, payload: FormistryEvents[K]) => void
}

export function createEventBus(): EventBus {
  const listeners: { [K in EventName]?: Set<Listener<K>> } = {}

  function on<K extends EventName>(event: K, handler: Listener<K>): () => void {
    const set = (listeners[event] ?? new Set()) as Set<Listener<K>>
    set.add(handler)
    listeners[event] = set as never

    return () => {
      set.delete(handler)
    }
  }

  function emit<K extends EventName>(event: K, payload: FormistryEvents[K]): void {
    const set = listeners[event] as Set<Listener<K>> | undefined
    if (!set)
      return

    for (const handler of set)
      handler(payload)
  }

  return { on, emit }
}
