import type { Severity, ValidationIssue, ValidationResult } from '../types/contracts'

export function reportRaw(result: ValidationResult): ValidationResult {
  return result
}

export function reportByField(result: ValidationResult): Record<string, ValidationIssue[]> {
  return Object.fromEntries(
    Object.entries(result.fields).map(([field, fieldResult]) => [field, fieldResult.issues]),
  )
}

export function reportBySeverity(result: ValidationResult): Record<Severity, ValidationIssue[]> {
  const grouped: Record<Severity, ValidationIssue[]> = {
    error: [],
    warning: [],
    info: [],
  }

  for (const issue of [...result.issues, ...result.warnings, ...result.infos])
    grouped[issue.severity].push(issue)

  return grouped
}

export function reportFirstError(result: ValidationResult): string {
  return result.issues[0]?.message ?? ''
}
