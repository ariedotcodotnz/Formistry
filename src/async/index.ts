interface RunToken {
  request: number
  abortController: AbortController
}

interface AsyncController {
  begin: (field: string) => RunToken
  isLatest: (field: string, request: number) => boolean
}

export function createAsyncController(): AsyncController {
  const tokens = new Map<string, RunToken>()

  function begin(field: string): RunToken {
    const current = tokens.get(field)
    current?.abortController.abort()

    const next: RunToken = {
      request: (current?.request ?? 0) + 1,
      abortController: new AbortController(),
    }

    tokens.set(field, next)
    return next
  }

  function isLatest(field: string, request: number): boolean {
    return tokens.get(field)?.request === request
  }

  return { begin, isLatest }
}

export function debounceAsync<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  waitMs = 300,
): (...args: TArgs) => Promise<TResult> {
  let timer: ReturnType<typeof setTimeout> | undefined
  let rejectLast: ((reason?: unknown) => void) | undefined

  return (...args: TArgs): Promise<TResult> => {
    if (timer)
      clearTimeout(timer)

    rejectLast?.(new Error('Debounced call superseded'))

    return new Promise<TResult>((resolve, reject) => {
      rejectLast = reject
      timer = setTimeout(() => {
        fn(...args).then(resolve).catch(reject)
      }, waitMs)
    })
  }
}

export function latestRunGuard<TResult>(): (task: (runId: number) => Promise<TResult>) => Promise<{ runId: number, result: TResult }> {
  let sequence = 0

  return async (task: (runId: number) => Promise<TResult>): Promise<{ runId: number, result: TResult }> => {
    sequence += 1
    const runId = sequence
    const result = await task(runId)
    return { runId, result }
  }
}
