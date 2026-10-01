import logo from '@/assets/logo.svg'
import { LinksCard } from '@/components/links-card'
import { NewLinkForm } from '@/components/new-link-form'

export function Home() {
  return (
    <main className="mx-auto flex flex-col px-3 py-8 lg:w-[980px] lg:px-0 lg:pt-22">
      {/* The Figma box is 97×24; the SVG has a different ratio, so it is contained instead of stretched. */}
      <img
        src={logo}
        alt="brev.ly"
        className="h-6 w-[97px] self-center object-contain lg:self-start lg:object-left"
      />

      <div className="mt-6 flex flex-col gap-3 lg:mt-8 lg:flex-row lg:items-start lg:gap-5">
        <NewLinkForm />
        <LinksCard />
      </div>
    </main>
  )
}
