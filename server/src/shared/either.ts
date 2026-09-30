export type Left<L> = { left: L; right?: never }
export type Right<R> = { left?: never; right: R }

export type Either<L, R> = Left<L> | Right<R>

export function makeLeft<L>(value: L): Left<L> {
  return { left: value }
}

export function makeRight<R>(value: R): Right<R> {
  return { right: value }
}

export function isLeft<L, R>(either: Either<L, R>): either is Left<L> {
  return either.left !== undefined
}

export function isRight<L, R>(either: Either<L, R>): either is Right<R> {
  return either.right !== undefined
}

export function unwrapEither<L, R>(either: Either<L, R>): L | R {
  return isLeft(either) ? either.left : (either.right as R)
}
