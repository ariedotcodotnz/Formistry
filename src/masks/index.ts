import type { MaskDefinition, MaskResult } from '../types/contracts'

export function applyMask(raw: string, mask: MaskDefinition): MaskResult {
  const normalized = mask.normalize ? mask.normalize(raw) : raw
  return mask.mask(normalized)
}

export function unmaskValue(masked: string, mask: MaskDefinition): string {
  if (mask.unmask)
    return mask.unmask(masked)

  return masked.replace(/\W+/g, '')
}

function tokenMask(pattern: string, keep = /[a-z0-9]/gi): MaskDefinition {
  return {
    name: `token:${pattern}`,
    normalize(raw) {
      const chunks = raw.match(keep)
      return chunks ? chunks.join('') : ''
    },
    mask(raw) {
      let rawIndex = 0
      let masked = ''

      for (const token of pattern) {
        const next = raw[rawIndex]
        if (token === '#') {
          if (!next || !/\d/.test(next))
            break
          masked += next
          rawIndex += 1
          continue
        }

        if (token === 'A') {
          if (!next || !/[a-z]/i.test(next))
            break
          masked += next.toUpperCase()
          rawIndex += 1
          continue
        }

        if (token === '*') {
          if (!next)
            break
          masked += next
          rawIndex += 1
          continue
        }

        masked += token
      }

      return {
        masked,
        raw: raw.slice(0, rawIndex),
        caret: masked.length,
      }
    },
    unmask(masked) {
      const chunks = masked.match(keep)
      return chunks ? chunks.join('') : ''
    },
  }
}

export const masks = {
  phoneUS: tokenMask('(###) ###-####', /\d/g),
  dateISO: tokenMask('####-##-##', /\d/g),
  creditCard: tokenMask('#### #### #### ####', /\d/g),
  token: tokenMask,
}
