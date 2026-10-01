import logo from '@/assets/logo.svg'
import { LinksCard } from '@/components/links-card'
import { NewLinkForm } from '@/components/new-link-form'

export function Home() {
  return (
    // Viewport-high, so the links list scrolls inside its card. Below the minimum height the page scrolls instead.
    <main className="mx-auto flex h-dvh min-h-[640px] flex-col px-3 py-8 lg:w-[980px] lg:px-0 lg:pt-22">
      {/* The Figma box is 97×24 and the drawing fills its width; the SVG is slightly taller, so only its empty margin is cropped. */}
      <img
        src={logo}
        alt="brev.ly"
        className="h-6 w-[97px] self-center object-cover lg:self-start"
      />

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-3 lg:mt-8 lg:flex-row lg:items-start lg:gap-5">
        <NewLinkForm />
        <LinksCard />
      </div>
    </main>
  )
}
