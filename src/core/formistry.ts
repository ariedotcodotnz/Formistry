import type { FormistryConfig } from '../types/contracts'
import { createValidationEngine } from './engine'

export function createFormistry(config: FormistryConfig): ReturnType<typeof createValidationEngine> {
  return createValidationEngine(config)
}
