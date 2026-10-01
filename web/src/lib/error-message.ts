import { NetworkError } from '@/api/errors'

// Text for errors that do not belong to a form field. The API `message` (English) is never shown.
export function getErrorDescription(error: unknown) {
  if (error instanceof NetworkError) {
    return 'Não foi possível conectar ao servidor. Tente novamente.'
  }
  return 'Algo deu errado. Tente novamente.'
}
