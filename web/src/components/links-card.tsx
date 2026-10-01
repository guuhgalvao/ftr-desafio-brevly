import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function LinksCard() {
  return (
    <Card className="gap-4 p-6 lg:w-[580px] lg:shrink-0 lg:gap-5 lg:p-8">
      <header className="flex items-center justify-between gap-4">
        <h2 className="font-bold text-lg">Meus links</h2>
        <Button variant="secondary" icon={DownloadSimpleIcon} disabled>
          Baixar CSV
        </Button>
      </header>
    </Card>
  )
}
