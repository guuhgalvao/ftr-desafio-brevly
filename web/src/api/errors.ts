import { z } from 'zod'

export const apiErrorSchema = z.object({
  message: z.string(),
  issues: z
    .array(
      z.object({
        path: z.array(z.union([z.string(), z.number()])),
        message: z.string(),
      }),
    )
    .optional(),
})

export type ApiIssue = NonNullable<z.infer<typeof apiErrorSchema>['issues']>[number]

// Non-2xx response from the API (docs/api-contract.md, "Formato de erro").
export class ApiError extends Error {
  readonly status: number
  readonly issues?: ApiIssue[]

  constructor(status: number, message: string, issues?: ApiIssue[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }

  get isValidation() {
    return this.status === 400
  }

  get isNotFound() {
    return this.status === 404
  }

  get isConflict() {
    return this.status === 409
  }
}

// The request never got a response (offline, DNS, CORS).
export class NetworkError extends Error {
  constructor(options?: ErrorOptions) {
    super('Could not reach the API.', options)
    this.name = 'NetworkError'
  }
}
