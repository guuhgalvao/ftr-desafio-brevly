const UNIQUE_VIOLATION = '23505'

type PostgresErrorFields = { code?: unknown; constraint_name?: unknown }

function matches(error: unknown, constraint: string): boolean {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  const { code, constraint_name } = error as PostgresErrorFields

  return code === UNIQUE_VIOLATION && constraint_name === constraint
}

// Drizzle wraps driver errors in DrizzleQueryError, keeping the postgres.js error in `cause`.
export function isUniqueViolation(error: unknown, constraint: string): boolean {
  if (matches(error, constraint)) {
    return true
  }

  return error instanceof Error && matches(error.cause, constraint)
}
