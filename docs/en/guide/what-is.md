# What is Formistry.js?

Formistry.js is a modern framework-agnostic JavaScript/TypeScript library for comprehensive form validation before data is sent to backend services.

## Core capabilities

- Field-level, cross-field, and form-level validation
- Sync and async checks with stale-run protection
- Built-in issue model with severity and metadata
- Input masking with raw/masked interoperability
- Lifecycle alert hooks (`validation:start`, `field:*`, `form:*`, `validation:error`)
- Composable reporting outputs for UI and logging

## Design goals

- Keep core logic independent from DOM/framework runtime details
- Keep API typed, minimal, and easy to extend through plugins
- Keep behavior deterministic and testable
