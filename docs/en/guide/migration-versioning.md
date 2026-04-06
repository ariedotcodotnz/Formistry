# Migration & Versioning Policy

Formistry.js follows semantic versioning:

- MAJOR: breaking API changes
- MINOR: backward-compatible features
- PATCH: backward-compatible fixes

## Backward compatibility

Public exports from the package root are considered stable.

Internal modules are not guaranteed stable unless explicitly exported.

## Release process

1. Update changes and tests
2. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
3. Bump version with `pnpm release`
4. Publish release notes in GitHub Releases
