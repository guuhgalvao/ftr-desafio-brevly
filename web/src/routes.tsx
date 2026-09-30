import { Route, Routes } from 'react-router'
import { Home } from '@/pages/home'
import { NotFound } from '@/pages/not-found'
import { Redirect } from '@/pages/redirect'

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path=":shortUrl" element={<Redirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
