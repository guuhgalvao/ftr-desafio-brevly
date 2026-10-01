import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { Home } from '@/pages/home'
import { NotFound } from '@/pages/not-found'
import { Redirect } from '@/pages/redirect'

// Dev only: `styleguide` is a valid short URL code, so the route would shadow it in production.
// The ternary is resolved at build time, so the page is not even bundled in production.
const StyleGuide = import.meta.env.DEV
  ? lazy(() => import('@/pages/style-guide').then((module) => ({ default: module.StyleGuide })))
  : null

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      {StyleGuide && (
        <Route
          path="styleguide"
          element={
            <Suspense>
              <StyleGuide />
            </Suspense>
          }
        />
      )}
      <Route path=":shortUrl" element={<Redirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
