import type { ValidationMode } from '../types/contracts'

interface DOMBinder {
  setFieldState: (name: string, message: string) => void
  clearFieldState: (name: string) => void
}

interface AdapterFieldResult {
  valid: boolean
  issues: { message: string }[]
}

interface AdapterFormResult {
  valid: boolean
}

interface AdapterTarget {
  validateField: (
    field: string,
    value: unknown,
    options?: { mode?: ValidationMode, values?: Record<string, unknown> },
  ) => Promise<AdapterFieldResult>
  validateForm: (values: Record<string, unknown>, mode?: ValidationMode) => Promise<AdapterFormResult>
}

interface DOMAdapter {
  bind: (form: HTMLFormElement) => Promise<void>
  collectValues: (form: HTMLFormElement) => Record<string, unknown>
}

export function createDOMAdapter<T extends AdapterTarget>(formistry: T, binder: DOMBinder): DOMAdapter {
  function collectValues(form: HTMLFormElement): Record<string, unknown> {
    const formData = new FormData(form)
    const values: Record<string, unknown> = {}

    for (const [name, value] of formData.entries())
      values[name] = value

    return values
  }

  async function bind(form: HTMLFormElement): Promise<void> {
    const fields = Array.from(form.elements).filter((element): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement => {
      return element instanceof HTMLInputElement
        || element instanceof HTMLTextAreaElement
        || element instanceof HTMLSelectElement
    })

    for (const field of fields) {
      field.addEventListener('blur', async () => {
        const values = collectValues(form)
        const result = await formistry.validateField(field.name, values[field.name], { mode: 'onBlur', values })
        if (result.valid)
          binder.clearFieldState(field.name)
        else
          binder.setFieldState(field.name, result.issues[0]?.message ?? 'Invalid value')
      })
    }

    form.addEventListener('submit', async (event: Event) => {
      event.preventDefault()
      const values = collectValues(form)
      const result = await formistry.validateForm(values, 'onSubmit')
      if (!result.valid)
        return

      form.submit()
    })
  }

  return { bind, collectValues }
}
